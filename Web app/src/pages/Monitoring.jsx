import SpriteNumber from "../components/SpriteNumber.jsx";

import { getTelemetry } from "../services/api.js";
import { useApi } from "../hooks/useApi.js";

function points(samples, field) {
  const values = samples
    .map((sample) => sample[field])
    .filter((value) => typeof value === "number");

  if (!values.length) {
    return "";
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  return values
    .map(
      (value, index) =>
        `${(index / Math.max(values.length - 1, 1)) * 100},${
          92 - ((value - min) / span) * 76
        }`
    )
    .join(" ");
}

function HistoryChart({ samples, field, threshold }) {
  const latestValue = samples.at(-1)?.[field];

  return (
    <div className="history-chart">

      {/* =========================================
          CHART HEADER
      ========================================= */}
      <div className="chart-head">
        <b>{threshold.label}</b>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <SpriteNumber
            value={threshold.min}
            size={16}
            color="currentColor"
            gap={0}
          />

          <span>–</span>

          <SpriteNumber
            value={threshold.max}
            size={16}
            color="currentColor"
            gap={0}
          />

          <span>{threshold.unit}</span>
        </span>
      </div>

      {/* =========================================
          SVG CHART
      ========================================= */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-label={`${threshold.label} history`}
      >
        <line
          x1="0"
          y1="20"
          x2="100"
          y2="20"
        />

        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
        />

        <line
          x1="0"
          y1="80"
          x2="100"
          y2="80"
        />

        <polyline
          points={points(samples, field)}
        />
      </svg>

      {/* =========================================
          LATEST VALUE
      ========================================= */}
      <div
        className="chart-latest"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span>Latest:</span>

        {typeof latestValue === "number" ? (
          <SpriteNumber
            value={latestValue}
            size={18}
            color="currentColor"
            gap={0}
          />
        ) : (
          <span>--</span>
        )}

        <span>{threshold.unit}</span>
      </div>

    </div>
  );
}

export default function Monitoring() {
  const { data, loading, error } = useApi(getTelemetry);

  const samples = data?.samples || [];

  return (
    <section className="page">

      {/* =========================================
          HEADER
      ========================================= */}
      <div>
        <div className="section-title">
          REAL-TIME MONITORING
        </div>

        <p className="section-sub">
          Telemetry history is the evidence layer for
          the thesis: store timestamp, source and raw
          measured values.
        </p>
      </div>

      {/* =========================================
          LOADING
      ========================================= */}
      {loading && (
        <p className="section-sub">
          Loading telemetry history...
        </p>
      )}

      {/* =========================================
          ERROR
      ========================================= */}
      {error && (
        <div className="empty-state">
          <b>API unavailable</b>
          <br />
          Cannot retrieve telemetry.
        </div>
      )}

      {/* =========================================
          DATA
      ========================================= */}
      {data && (
        <>
          {/* =======================================
              HISTORY CHARTS
          ======================================== */}
          <div className="history-grid">
            {Object.entries(data.thresholds).map(
              ([field, threshold]) => (
                <HistoryChart
                  key={field}
                  samples={samples}
                  field={field}
                  threshold={threshold}
                />
              )
            )}
          </div>

          {/* =======================================
              RAW SAMPLES TABLE
          ======================================== */}
          <div className="panel-box pixel-corners-sm">

            <h3>LATEST RAW SAMPLES</h3>

            <table className="data-table">

              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>DO (mg/L)</th>
                  <th>pH</th>
                  <th>Temperature (°C)</th>
                  <th>Source</th>
                </tr>
              </thead>

              <tbody>
                {samples
                  .slice()
                  .reverse()
                  .slice(0, 8)
                  .map((sample) => (
                    <tr
                      key={sample.capturedAt}
                    >
                      {/* Timestamp vẫn dùng font cũ */}
                      <td>
                        {new Date(
                          sample.capturedAt
                        ).toLocaleString("en-GB")}
                      </td>

                      {/* DO */}
                      <td>
                        <SpriteNumber
                          value={
                            sample.dissolvedOxygen
                          }
                          size={18}
                          color="currentColor"
                          gap={0}
                        />
                      </td>

                      {/* pH */}
                      <td>
                        <SpriteNumber
                          value={sample.ph}
                          size={18}
                          color="currentColor"
                          gap={0}
                        />
                      </td>

                      {/* Temperature */}
                      <td>
                        <SpriteNumber
                          value={
                            sample.temperature
                          }
                          size={18}
                          color="currentColor"
                          gap={0}
                        />
                      </td>

                      {/* Source vẫn dùng font cũ */}
                      <td>
                        {sample.source}
                      </td>
                    </tr>
                  ))}
              </tbody>

            </table>
          </div>
        </>
      )}

    </section>
  );
}