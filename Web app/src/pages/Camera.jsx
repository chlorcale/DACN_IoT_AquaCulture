import { getVision } from "../services/api.js";
import { useApi } from "../hooks/useApi.js";

export default function Camera() {
  const { data, loading, error } = useApi(getVision);
  const result = data?.result;
  return <section className="page"><div><div className="section-title">CAMERA AND WATER-SURFACE ANALYSIS</div><p className="section-sub">Colour and clarity observations supplement pH, DO and temperature; they are not sensor replacements.</p></div>
    {loading && <p className="section-sub">Loading latest image assessment...</p>}{error && <div className="empty-state"><b>API unavailable</b>Cannot retrieve image-analysis results.</div>}
    {data && <div className="cols"><div className="panel-box pixel-corners-sm"><h3>LATEST CAPTURE</h3><div className="cam-frame" style={{ height: 280 }}>{data.imageUrl ? <img className="camera-image" src={data.imageUrl} alt="Pond water surface" /> : <div className="cam-swatch" />}<div className="cam-tag">{new Date(data.capturedAt).toLocaleString('en-GB')}</div><div className="cam-badge">Camera: {data.cameraStatus}</div></div><p className="section-sub">Capture schedule: every {data.captureIntervalMinutes} minutes. {data.cameraStatus === 'planned' && 'Select waterproof/moisture-resistant camera hardware before field deployment.'}</p></div>
      <div className="panel-box pixel-corners-sm"><h3>IMAGE-ANALYSIS RESULT</h3><div className="spec-list"><div><span>Dominant colour</span>{result.dominantColour}</div><div><span>Turbidity class</span>{result.turbidity}</div><div><span>Clarity change</span>{result.clarityChangePercent}% compared with previous capture</div><div><span>Confidence</span>{Math.round(result.confidence * 100)}%</div><div><span>Method</span>{result.method}</div></div><p className="ai-note">{data.note}</p></div></div>}
  </section>;
}
