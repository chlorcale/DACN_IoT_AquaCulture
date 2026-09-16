import { getTelemetry } from "../services/api.js";
import { useApi } from "../hooks/useApi.js";

function points(samples, field) {
  const values = samples.map(sample => sample[field]);
  const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  return values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 100},${92 - ((value - min) / span) * 76}`).join(' ');
}
function HistoryChart({ samples, field, threshold }) {
  return <div className="history-chart"><div className="chart-head"><b>{threshold.label}</b><span>{threshold.min}–{threshold.max} {threshold.unit}</span></div><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={`${threshold.label} history`}><line x1="0" y1="20" x2="100" y2="20" /><line x1="0" y1="50" x2="100" y2="50" /><line x1="0" y1="80" x2="100" y2="80" /><polyline points={points(samples, field)} /></svg><div className="chart-latest">Latest: {samples.at(-1)?.[field]} {threshold.unit}</div></div>;
}

export default function Monitoring() {
  const { data, loading, error } = useApi(getTelemetry);
  const samples = data?.samples || [];
  return <section className="page"><div><div className="section-title">REAL-TIME MONITORING</div><p className="section-sub">Telemetry history is the evidence layer for the thesis: store timestamp, source and raw measured values.</p></div>
    {loading && <p className="section-sub">Loading telemetry history...</p>}{error && <div className="empty-state"><b>API unavailable</b>Cannot retrieve telemetry.</div>}
    {data && <><div className="history-grid">{Object.entries(data.thresholds).map(([field, threshold]) => <HistoryChart key={field} samples={samples} field={field} threshold={threshold} />)}</div><div className="panel-box pixel-corners-sm"><h3>LATEST RAW SAMPLES</h3><table className="data-table"><thead><tr><th>Timestamp</th><th>DO (mg/L)</th><th>pH</th><th>Temperature (°C)</th><th>Source</th></tr></thead><tbody>{samples.slice().reverse().slice(0, 8).map(sample => <tr key={sample.capturedAt}><td>{new Date(sample.capturedAt).toLocaleString('en-GB')}</td><td>{sample.dissolvedOxygen}</td><td>{sample.ph}</td><td>{sample.temperature}</td><td>{sample.source}</td></tr>)}</tbody></table></div></>}
  </section>;
}
