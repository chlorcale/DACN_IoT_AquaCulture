import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const spritesRoot = path.resolve(here, "../../Web app/public/sprites");
const stateDirectory = path.resolve(here, "../data");
const stateFile = path.join(stateDirectory, "runtime-state.json");
const now = new Date();
const isoMinutesAgo = (minutes) => new Date(now.getTime() - minutes * 60_000).toISOString();

// These are project configuration values, not universal aquaculture limits.
// They must be validated during the experiment for the shrimp species and pond.
const thresholds = {
  dissolvedOxygen: { label: "Dissolved oxygen (DO)", unit: "mg/L", min: 4, max: 7, source: "DO sensor (to be selected)" },
  ph: { label: "pH", unit: "pH", min: 7.5, max: 8.5, source: "ES-PH-WT-01 register 0x0001" },
  temperature: { label: "Water temperature", unit: "\u00b0C", min: 28, max: 31, source: "ES-PH-WT-01 register 0x0003" }
};

const telemetry = [
  { capturedAt: isoMinutesAgo(60), dissolvedOxygen: 5.0, ph: 7.7, temperature: 28.8, source: "gateway-01" },
  { capturedAt: isoMinutesAgo(50), dissolvedOxygen: 5.1, ph: 7.8, temperature: 28.9, source: "gateway-01" },
  { capturedAt: isoMinutesAgo(40), dissolvedOxygen: 5.2, ph: 7.8, temperature: 29.0, source: "gateway-01" },
  { capturedAt: isoMinutesAgo(30), dissolvedOxygen: 5.1, ph: 7.9, temperature: 29.2, source: "gateway-01" },
  { capturedAt: isoMinutesAgo(20), dissolvedOxygen: 5.3, ph: 7.8, temperature: 29.3, source: "gateway-01" },
  { capturedAt: isoMinutesAgo(10), dissolvedOxygen: 5.2, ph: 7.8, temperature: 29.4, source: "gateway-01" }
];

const alerts = [
  { id: "alert-temperature", createdAt: isoMinutesAgo(8), severity: "warning", source: "temperature", message: "Water temperature is approaching the configured upper threshold (29.4 \u00b0C / 31 \u00b0C).", acknowledged: false },
  { id: "alert-vision", createdAt: isoMinutesAgo(22), severity: "info", source: "vision", message: "New surface-water image was received and analysed.", acknowledged: false },
  { id: "alert-ph", createdAt: isoMinutesAgo(1440), severity: "critical", source: "ph-01", message: "pH sensor communication was interrupted for 6 minutes.", acknowledged: true }
];

const devices = [
  {
    id: "gateway-01", role: "gateway", name: "IoT Gateway", model: "EPCB-IEC-ESP32-S3", installed: true, status: "online",
    connection: "LAN/Wi-Fi \u00b7 RS485 Modbus master", power: "8\u201328 VDC", sourceUrl: "https://epcb.vn/products/smart-industrial-iot-gateway-epcb-iec-esp32-s3",
    capabilities: ["RS485", "LAN", "Wi-Fi", "RTC", "2 DI / 2 DO", "USB-C programming/console"],
    projectUse: "Polls RS485 sensors, time-stamps measurements, sends data and captures commands from the server."
  },
  {
    id: "ph-01", role: "sensor", name: "pH and water-temperature sensor", model: "ES-PH-WT-01", installed: true, status: "online",
    connection: "RS485 Modbus RTU \u00b7 slave 1 \u00b7 4800 bps \u00b7 8N1", power: "9\u201330 VDC (12 V recommended)", sourceUrl: "https://epcb.vn/products/cam-bien-dau-do-do-do-ph-nuoc-es-ph-wt-01-rs485-4-20ma",
    capabilities: ["pH 0\u201314", "temperature 0\u201360 \u00b0C", "automatic temperature compensation", "RS485 Modbus RTU", "4\u201320 mA", "IP68"],
    registers: [
      { address: "0x0001", field: "ph", type: "float (2 registers)", access: "read", note: "Measured pH" },
      { address: "0x0003", field: "temperature", type: "float (2 registers)", access: "read", note: "Measured temperature" },
      { address: "0x0007", field: "alarm", type: "int", access: "read", note: "pH / temperature alarm code" }
    ],
    projectUse: "Primary pH and water-temperature probe. Prefer a flow-cell installation and schedule cleaning/calibration."
  },
  {
    id: "relay-01", role: "actuator", name: "I/O relay controller", model: "LH-IO404", installed: true, status: "online",
    connection: "Isolated RS485 Modbus RTU \u00b7 slave 2 \u00b7 4800 bps", power: "9\u201328 VDC", sourceUrl: "https://epcb.vn/products/thiet-bi-dieu-khien-giam-sat-io-giao-tiep-rs485-va-rs232-cong-nghiep-lh-io",
    capabilities: ["4 isolated DI", "4 isolated relay DO", "10 A / 250 VAC or 30 VDC", "DIN rail", "Modbus coils 1\u20134"],
    projectUse: "Controls aerator, water pump, feeder and a spare/alarm output."
  },
  {
    id: "do-01", role: "sensor", name: "Dissolved oxygen sensor", model: "Not selected", installed: false, status: "planned",
    connection: "Required: RS485 Modbus RTU or analogue interface", power: "TBD", sourceUrl: null,
    capabilities: ["Required for the project", "must tolerate pond water", "must have a documented calibration process"],
    projectUse: "This is a required device in the thesis; select the exact model before declaring the system complete."
  },
  {
    id: "camera-01", role: "camera", name: "Surface-water camera", model: "Not selected", installed: false, status: "planned",
    connection: "Wi-Fi/LAN \u00b7 periodic capture", power: "TBD", sourceUrl: null,
    capabilities: ["waterproof/moisture-resistant enclosure", "fixed framing", "periodic image upload"],
    projectUse: "Captures water surface images for colour and turbidity/clarity assessment; it does not replace physical sensors."
  }
];

const relays = [
  { id: 1, coil: 1, name: "Aerator", sub: "Automatic safety action when DO is below configured threshold", on: true, mode: "auto" },
  { id: 2, coil: 2, name: "Water pump", sub: "Manual operation with interlock to be implemented in firmware", on: false, mode: "manual" },
  { id: 3, coil: 3, name: "Feeder", sub: "Scheduled operation controlled by gateway RTC", on: false, mode: "schedule" },
  { id: 4, coil: 4, name: "Reserve / alarm", sub: "Available LH-IO404 output for a beacon or auxiliary equipment", on: false, mode: "manual" }
];

const vision = {
  captureIntervalMinutes: 30, cameraStatus: "planned", capturedAt: isoMinutesAgo(22), imageUrl: null,
  result: { dominantColour: "green-brown", turbidity: "medium", clarityChangePercent: -8, confidence: 0.72, method: "Feature-extraction placeholder" },
  note: "Image metrics are supplementary observations and require comparison with field measurements during evaluation."
};

const testRuns = [
  { id: "test-001", date: "2026-09-16", target: "pH and temperature acquisition", result: "baseline API sample", status: "planned" },
  { id: "test-002", date: null, target: "DO sensor comparison against reference meter", result: null, status: "planned" },
  { id: "test-003", date: null, target: "Image assessment versus field observation", result: null, status: "planned" }
];

// JSON persistence keeps the prototype dependency-free. Replace this adapter with
// PostgreSQL/TimescaleDB (or the selected IoT platform) before a multi-user deployment.
function restoreState() {
  if (!existsSync(stateFile)) return;
  try {
    const saved = JSON.parse(readFileSync(stateFile, "utf8"));
    if (Array.isArray(saved.telemetry)) telemetry.splice(0, telemetry.length, ...saved.telemetry);
    if (Array.isArray(saved.alerts)) alerts.splice(0, alerts.length, ...saved.alerts);
    if (Array.isArray(saved.relays)) saved.relays.forEach((savedRelay) => {
      const relay = relays.find((item) => item.id === savedRelay.id);
      if (relay && typeof savedRelay.on === "boolean") relay.on = savedRelay.on;
    });
    if (saved.vision && typeof saved.vision === "object") Object.assign(vision, saved.vision);
  } catch (error) { console.warn("Ignoring unreadable runtime state:", error.message); }
}
function saveState() {
  mkdirSync(stateDirectory, { recursive: true });
  writeFileSync(stateFile, JSON.stringify({ telemetry, alerts, relays, vision }, null, 2), "utf8");
}
restoreState();

function latest() { return telemetry[telemetry.length - 1]; }
function metricStatus(value, threshold) { return value < threshold.min || value > threshold.max ? "warning" : "normal"; }
function dashboardPayload() {
  const reading = latest();
  return {
    pond: { id: "pond-02", name: "Pond 02" }, updatedAt: reading.capturedAt,
    stats: Object.entries(thresholds).map(([key, threshold]) => ({
      id: key, label: threshold.label, value: String(reading[key]), unit: threshold.unit,
      percent: Math.max(0, Math.min(100, ((reading[key] - threshold.min) / (threshold.max - threshold.min)) * 100)),
      color: metricStatus(reading[key], threshold) === "normal" ? "var(--green)" : "var(--amber)",
      range: `Configured: ${threshold.min}\u2013${threshold.max} ${threshold.unit}`, rangeStatus: metricStatus(reading[key], threshold) === "normal" ? "good" : "warn",
      trend: key === "temperature" ? "up" : "down", trendValue: key === "temperature" ? "0.2" : "0.1"
    })), alerts: alerts.slice(0, 3).map((alert) => ({ ...alert, time: new Date(alert.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), level: alert.severity === "critical" ? "bad" : alert.severity === "warning" ? "warn" : "" , text: alert.message }))
  };
}
function catalogDirectory(directory, relative = "") {
  const children = readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((entry) => {
    const full = path.join(directory, entry.name), next = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) return [catalogDirectory(full, next)];
    if (!entry.name.endsWith(".json")) return [];
    try { const json = JSON.parse(readFileSync(full, "utf8")); const frames = Array.isArray(json.frames) ? json.frames.map((f) => f.filename) : Object.keys(json.frames || {}); return [{ type: "atlas", name: entry.name, path: next, url: `/sprites/${next}`, frames }]; } catch { return []; }
  });
  return { type: "folder", name: relative ? path.posix.basename(relative) : "sprites", children };
}
function send(res, status, body) { res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" }); res.end(JSON.stringify(body)); }
function readBody(req) { return new Promise((resolve, reject) => { let raw = ""; req.on("data", c => raw += c); req.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error("Invalid JSON")); } }); }); }
function newAlert(source, message, severity = "warning") { const alert = { id: `alert-${Date.now()}`, createdAt: new Date().toISOString(), severity, source, message, acknowledged: false }; alerts.unshift(alert); return alert; }
function validateNumber(value, field) { if (!Number.isFinite(value)) throw new Error(`${field} must be a number`); }
function ingestTelemetry(payload) {
  ["dissolvedOxygen", "ph", "temperature"].forEach((field) => validateNumber(payload[field], field));
  const sample = { capturedAt: payload.capturedAt || new Date().toISOString(), dissolvedOxygen: payload.dissolvedOxygen, ph: payload.ph, temperature: payload.temperature, source: payload.source || "gateway-01" };
  telemetry.push(sample); if (telemetry.length > 288) telemetry.shift();
  const generatedAlerts = Object.entries(thresholds).flatMap(([key, threshold]) => sample[key] < threshold.min || sample[key] > threshold.max ? [newAlert(key, `${threshold.label} is ${sample[key]} ${threshold.unit}; configured range is ${threshold.min}\u2013${threshold.max} ${threshold.unit}.`)] : []);
  saveState();
  return { sample, generatedAlerts };
}

createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  const url = new URL(req.url, "http://localhost:4000");
  try {
    if (req.method === "GET" && url.pathname === "/api/health") return send(res, 200, { status: "ok", gateway: devices[0].status, timestamp: new Date().toISOString() });
    if (req.method === "GET" && url.pathname === "/api/dashboard") return send(res, 200, dashboardPayload());
    if (req.method === "GET" && url.pathname === "/api/devices") return send(res, 200, { devices, relays });
    if (req.method === "GET" && url.pathname === "/api/telemetry") { const limit = Math.min(Number(url.searchParams.get("limit")) || 72, 288); return send(res, 200, { thresholds, samples: telemetry.slice(-limit) }); }
    if (req.method === "POST" && url.pathname === "/api/telemetry") return send(res, 201, ingestTelemetry(await readBody(req)));
    if (req.method === "GET" && url.pathname === "/api/alerts") return send(res, 200, { alerts });
    if (req.method === "GET" && url.pathname === "/api/vision") return send(res, 200, vision);
    if (req.method === "POST" && url.pathname === "/api/vision") { const payload = await readBody(req); Object.assign(vision, payload, { capturedAt: payload.capturedAt || new Date().toISOString() }); saveState(); return send(res, 201, vision); }
    if (req.method === "GET" && url.pathname === "/api/project") return send(res, 200, { name: "Shrimp pond water-quality monitoring", thresholds, devices, testRuns, architecture: ["Sensors / camera", "EPCB-IEC-ESP32-S3 gateway", "IoT server API + storage", "Web/mobile monitoring + alerts"] });
    if (req.method === "GET" && url.pathname === "/api/catalog") return send(res, 200, { tree: existsSync(spritesRoot) ? catalogDirectory(spritesRoot) : { type: "folder", name: "sprites", children: [] } });
    const relayMatch = url.pathname.match(/^\/api\/relays\/(\d+)$/);
    if (req.method === "PATCH" && relayMatch) { const relay = relays.find(r => r.id === Number(relayMatch[1])); if (!relay) return send(res, 404, { message: "Relay not found" }); const payload = await readBody(req); if (typeof payload.on !== "boolean") return send(res, 400, { message: "on must be boolean" }); relay.on = payload.on; saveState(); return send(res, 200, relay); }
    return send(res, 404, { message: "Endpoint not found" });
  } catch (error) { return send(res, 400, { message: error.message }); }
}).listen(4000, () => console.log("AquaPixel API listening on http://localhost:4000"));
