function DetectionTable({ detections }) {
  if (!detections || detections.length === 0) {
    return null;
  }

  return (
    <div className="table-section">
      <h2>📋 Detection Summary</h2>

      <table className="detection-table">
        <thead>
          <tr>
            <th>Object</th>
            <th>Confidence</th>
            <th>Pick X</th>
            <th>Pick Y</th>
            <th>Quality</th>
            <th>Destination</th>
          </tr>
        </thead>

        <tbody>
          {detections.map((item, index) => {
            const good = item.confidence >= 0.8;

            return (
              <tr key={index}>
                <td>{item.object}</td>

                <td>{(item.confidence * 100).toFixed(0)}%</td>

                <td>{item.center_x}</td>

                <td>{item.center_y}</td>

                <td>{good ? "🟢 GOOD" : "🔴 CHECK"}</td>

                <td>{good ? "GOOD BIN" : "REJECT BIN"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DetectionTable;