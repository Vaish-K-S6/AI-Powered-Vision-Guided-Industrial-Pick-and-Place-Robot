function ImagePanel({ preview, detectedImage }) {
  return (
    <div className="image-section">

      <div className="image-card">
        <h2>Original Image</h2>

        {preview ? (
          <img src={preview} alt="Original" className="image" />
        ) : (
          <div className="placeholder">
            No image selected
          </div>
        )}
      </div>

      <div className="image-card">
        <h2> AI Detection Result</h2>

        {detectedImage ? (
          <img
            src={detectedImage}
            alt="Detected"
            className="image"
          />
        ) : (
          <div className="placeholder">
            Detection image will appear here
          </div>
        )}
      </div>

    </div>
  );
}

export default ImagePanel;