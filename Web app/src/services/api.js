const API_ROOT = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
}

export const getDashboard = () => request("/dashboard");
export const getDevices = () => request("/devices");
export const getCatalog = () => request("/catalog");
export const getTelemetry = () => request("/telemetry?limit=24");
export const getAlerts = () => request("/alerts");
export const getVision = () => request("/vision");
export const getProject = () => request("/project");
export const updateRelay = (id, on) => request(`/relays/${id}`, { method: "PATCH", body: JSON.stringify({ on }) });
