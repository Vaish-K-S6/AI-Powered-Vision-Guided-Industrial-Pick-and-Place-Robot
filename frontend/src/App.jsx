import { useRef, useState } from "react";

import Header from "./components/Header";
import ImagePanel from "./components/ImagePanel";
//import RobotPanel from "./components/RobotPanel";
import DetectionTable from "./components/DetectionTable";
import StatsCards from "./components/StatsCards";

import "./App.css";

function App() {
  const fileInput = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [detections, setDetections] = useState([]);
  const [detectedImage, setDetectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

const [showCamera, setShowCamera] = useState(false);

const [cameraStream, setCameraStream] = useState(null);
const [liveMode, setLiveMode] = useState(false);

const liveInterval = useRef(null);
const lastAnnouncement = useRef("");

  const chooseFile = () => {
    fileInput.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));

    setMessage("");
    setDetections([]);
    setDetectedImage("");
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      alert("Please choose an image first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setMessage(data.message);
      setDetections(data.detections || []);

      setDetectedImage(
        data.detected_image + "?t=" + new Date().getTime()
      );
    } catch (error) {
      alert("Upload Failed");
      console.error(error);
    }

    setLoading(false);
  };
  const openCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    setCameraStream(stream);
    setShowCamera(true);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }, 100);

  } catch (err) {
    alert("Unable to access camera");
    console.error(err);
  }
};
const captureImage = async () => {
  const canvas = document.createElement("canvas");

  canvas.width = videoRef.current.videoWidth;
  canvas.height = videoRef.current.videoHeight;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    videoRef.current,
    0,
    0,
    canvas.width,
    canvas.height
  );

  canvas.toBlob((blob) => {
    const file = new File([blob], "camera.jpg", {
      type: "image/jpeg",
    });

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));

    cameraStream.getTracks().forEach((track) => track.stop());

    setShowCamera(false);
  }, "image/jpeg");
};
const startLiveDetection = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    setCameraStream(stream);
    setShowCamera(true);
    setLiveMode(true);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }, 100);
   liveInterval.current = setInterval(() => {
     console.log("Sending frame...");
  sendFrame();
}, 5000);

  } catch (err) {
    alert("Unable to access camera");
    console.error(err);
  }
};
const stopLiveDetection = () => {

  if (liveInterval.current) {
    clearInterval(liveInterval.current);
  }

  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
  }

  setShowCamera(false);
  setLiveMode(false);

};
const sendFrame = async () => {
  const canvas = document.createElement("canvas");

canvas.width = videoRef.current.videoWidth;
canvas.height = videoRef.current.videoHeight;

const ctx = canvas.getContext("2d");

ctx.drawImage(
  videoRef.current,
  0,
  0,
  canvas.width,
  canvas.height
);
canvas.toBlob(async (blob) => {

  const formData = new FormData();

  formData.append("file", blob, "live_frame.jpg");

  try {
    await new Audio("/beep.mp3").play();

    const response = await fetch(
      "http://127.0.0.1:8000/live-detect",
      {
        method: "POST",
        body: formData,
      }
    );

   const data = await response.json();
   console.log(data);

setDetections(data.detections);
const failedObject = data.detections.find(
  (item) => item.quality === "FAIL"
);

if (failedObject) {
  speakResult("FAIL");
} else if (data.detections.length > 0) {
  speakResult("PASS");
}

setDetectedImage(
  data.detected_image + "?t=" + new Date().getTime()
);

  } catch (err) {

    console.error(err);

  }

}, "image/jpeg");
};
const playBeep = () => {
  const audio = new Audio("/beep.mp3");
  audio.play();
};

const speakResult = (quality) => {
  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(
    quality === "PASS"
      ? "Product accepted. Move to good bin."
      : "Defective product detected. Move to reject bin."
  );

  speech.rate = 1;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
};
const resetDashboard = () => {
  // Stop live detection if it's running
  if (liveInterval.current) {
    clearInterval(liveInterval.current);
  }

  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
  }

  // Reset all states
  setSelectedFile(null);
  setPreview(null);
  setDetectedImage(null);
  setDetections([]);
  setMessage("");
  setLoading(false);

  setShowCamera(false);
  setLiveMode(false);
  setCameraStream(null);
};
  return (
    <div className="app">

      <Header />
      <StatsCards detections={detections} />

      <div className="upload-section">

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />

        <button
          className="choose-btn"
          onClick={chooseFile}
        >
           Choose Image
        </button>
        <button
  className="camera-btn"
  onClick={openCamera}
>
   Camera
</button>
<button
  className="live-btn"
  onClick={startLiveDetection}
>
   Live Detection
</button>
<button
  className="reset-btn"
  onClick={resetDashboard}
>
   Reset Dashboard
</button>

        {selectedFile && (
          <>
            <p className="filename">
              {selectedFile.name}
            </p>

            <button
              className="detect-btn"
              onClick={uploadImage}
              disabled={loading}
            >
              {loading
                ? "Detecting..."
                : " Upload & Detect"}
            </button>
          </>
        )}

        {message && (
          <h4 className="success-msg">
            {message}
          </h4>
        )}
       {showCamera && (
  <div className="camera-preview">

    <video
      ref={videoRef}
      autoPlay
      playsInline
      width="500"
    />

    <br />

    {!liveMode && (
  <button
    className="detect-btn"
    onClick={captureImage}
  >
     Capture
  </button>
)}

{liveMode && (
  <button
    className="detect-btn"
    onClick={stopLiveDetection}
  >
    Stop Live Detection
  </button>
)}
     

  </div>
)}

      </div>

      <ImagePanel
        preview={preview}
        detectedImage={detectedImage}
      />

      {/*}
      <RobotPanel
        detections={detections}
      />*/}

      <DetectionTable
        detections={detections}
      />
            <div className="factory-section">
        <h4> Factory Simulation</h4>

        {detections.length > 0 ? (
          <div className="factory-flow">

            <div className="factory-box">
              
              <br />
              Camera
            </div>

            <div className="arrow">⬇</div>

            <div className="factory-box">
              
              <br />
              Robot Arm
            </div>

            <div className="split-row">

              <div
                className={
                  detections[0].confidence >= 0.8
                    ? "bin good active"
                    : "bin good"
                }
              >
                🟢
                <br />
                GOOD BIN
              </div>

              <div
                className={
                  detections[0].confidence < 0.8
                    ? "bin reject active"
                    : "bin reject"
                }
              >
                🔴
                <br />
                REJECT BIN
              </div>

            </div>

          </div>
        ) : (
          <p className="waiting-text">
            Upload an image to simulate robot sorting.
          </p>
        )}
      </div>

    </div>
  );
}

export default App;