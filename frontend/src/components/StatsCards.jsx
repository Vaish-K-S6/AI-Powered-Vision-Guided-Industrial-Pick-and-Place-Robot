function StatsCards({ detections }) {

  const totalObjects = detections.length > 0 ? 1 : 0;

const rejected =
  detections.some((item) => item.quality === "FAIL") ? 1 : 0;

const passed =
  totalObjects === 1 && rejected === 0 ? 1 : 0;
  const accuracy =
    totalObjects > 0
      ? (
          detections.reduce(
            (sum, item) => sum + item.confidence,
            0
          ) /
         detections.length *
          100
        ).toFixed(0)
      : 0;

  return (
    <div className="stats-container">

      <div className="stats-card">
        <h3>Objects</h3>
        <h1>{totalObjects}</h1>
      </div>

      <div className="stats-card">
        <h3>Passed</h3>
        <h1>{passed}</h1>
      </div>

      <div className="stats-card">
        <h3> Rejected</h3>
        <h1>{rejected}</h1>
      </div>

      <div className="stats-card">
        <h3>Avg Confidence</h3>
        <h1>{accuracy}%</h1>
      </div>

    </div>
  );
}

export default StatsCards;