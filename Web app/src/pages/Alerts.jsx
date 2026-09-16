import { getAlerts } from "../services/api.js";
import { useApi } from "../hooks/useApi.js";

export default function Alerts() {
  const { data, loading, error } = useApi(getAlerts);
  const alerts = data?.alerts || [];
  return <section className="page"><div><div className="section-title">SYSTEM ALERTS</div><p className="section-sub">Events are created from configured thresholds, device communication and image-processing jobs.</p></div>
    {loading && <p className="section-sub">Loading alerts...</p>}{error && <div className="empty-state"><b>API unavailable</b>Cannot retrieve alert log.</div>}
    <div className="panel-box pixel-corners-sm"><div className="alert-list">{alerts.map(alert => <div key={alert.id} className={'alert-item ' + (alert.severity === 'critical' ? 'bad' : alert.severity === 'warning' ? 'warn' : '')}><span className="alert-time">{new Date(alert.createdAt).toLocaleString('en-GB')}</span><span><b>{alert.source}</b> · {alert.message}<small className="alert-state">{alert.acknowledged ? 'Acknowledged' : 'Open'}</small></span></div>)}</div></div>
  </section>;
}
