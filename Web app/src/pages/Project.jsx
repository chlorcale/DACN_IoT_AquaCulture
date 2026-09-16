import { getProject } from "../services/api.js";
import { useApi } from "../hooks/useApi.js";

export default function Project() {
  const { data, loading, error } = useApi(getProject);
  return <section className="page"><div><div className="section-title">THESIS SYSTEM DESIGN</div><p className="section-sub">Scope, deployment gaps and field-evaluation plan are explicit so the prototype does not overstate its capabilities.</p></div>
    {loading && <p className="section-sub">Loading project design...</p>}{error && <div className="empty-state"><b>API unavailable</b>Cannot retrieve project definition.</div>}
    {data && <><div className="architecture">{data.architecture.map((step, index) => <div key={step} className="architecture-step"><span>{index + 1}</span>{step}</div>)}</div><div className="cols"><div className="panel-box pixel-corners-sm"><h3>CONFIGURED MEASUREMENT RANGES</h3><div className="spec-list">{Object.values(data.thresholds).map(threshold => <div key={threshold.label}><span>{threshold.label}</span>{threshold.min}–{threshold.max} {threshold.unit}<small>{threshold.source}</small></div>)}</div><p className="ai-note">These ranges are project configuration values; calibrate them for the shrimp species, stocking density and pond conditions during testing.</p></div><div className="panel-box pixel-corners-sm"><h3>FIELD EVALUATION LOG</h3><table className="data-table"><thead><tr><th>Test</th><th>Target</th><th>Status</th></tr></thead><tbody>{data.testRuns.map(run => <tr key={run.id}><td>{run.id}</td><td>{run.target}</td><td><span className={'tag ' + (run.status === 'planned' ? 'off' : '')}>{run.status}</span></td></tr>)}</tbody></table></div></div></>}
  </section>;
}
