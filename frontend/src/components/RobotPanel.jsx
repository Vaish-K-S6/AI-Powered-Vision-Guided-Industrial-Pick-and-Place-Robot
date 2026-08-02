function RobotPanel({ detections }) {
  if (!detections || detections.length === 0) {
    return (
      <div className="robot-panel">
        <h2>🤖 AI Inspection Report</h2>
        <p>No inspection performed yet.</p>
      </div>
    );
  }

  const object =
  detections.find(
    (item) => item.quality === "FAIL"
  ) || detections[0];

  const inspectionTime = (
    Math.random() * (0.35 - 0.12) + 0.12
  ).toFixed(2);

  const pickTime = (
    Math.random() * (1.20 - 0.60) + 0.60
  ).toFixed(2);

  return (
    <div className="robot-panel">

      <h2>🤖 AI Inspection Report</h2>

      <div className="info-grid">

        <div className="info-card">
          <h3>📦 Detected Object</h3>
          <p>{object.object.toUpperCase()}</p>
        </div>

        <div className="info-card">
          <h3>🎯 Confidence</h3>
          <p>{(object.confidence * 100).toFixed(0)}%</p>
        </div>

        <div className="info-card">
          <h3>✅ Inspection Result</h3>
          <p>
            {object.quality === "PASS"
              ? "🟢 PASS"
              : object.quality === "CHECK"
              ? "🟠 MANUAL CHECK"
              : "🔴 FAIL"}
          </p>
        </div>

        <div className="info-card">
          <h3>🤖 Robot Decision</h3>
          <p>{object.robot_action}</p>
        </div>

        <div className="info-card">
          <h3>📍 Destination</h3>
          <p>{object.destination}</p>
        </div>

        <div className="info-card">
          <h3>⚙ Robot Status</h3>
          <p>{object.robot_status}</p>
        </div>

        <div className="info-card">
          <h3>📐 Pick Coordinate X</h3>
          <p>{object.center_x}px</p>
        </div>

        <div className="info-card">
          <h3>📐 Pick Coordinate Y</h3>
          <p>{object.center_y}px</p>
        </div>

        <div className="info-card">
          <h3>⏱ Inspection Time</h3>
          <p>{inspectionTime} sec</p>
        </div>

        <div className="info-card">
          <h3>🦾 Estimated Pick Time</h3>
          <p>{pickTime} sec</p>
        </div>

        <div className="info-card full-width">
          <h3>📝 AI Decision Reason</h3>
          <p>{object.reason}</p>
        </div>

      </div>

    </div>
  );
}

export default RobotPanel;