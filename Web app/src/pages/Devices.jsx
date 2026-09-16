import { useState } from "react";
import RelaySwitch from "../components/RelaySwitch.jsx";
import { getDevices } from "../services/api.js";
import { useApi } from "../hooks/useApi.js";

function DeviceCard({ device, selected, onSelect }) {
  return <button className={'device-card ' + (selected ? 'selected' : '')} onClick={() => onSelect(device)}><span className={'device-status ' + device.status} />
    <b>{device.name}</b><small>{device.model}</small><small>{device.installed ? device.connection : 'Required / planned hardware'}</small></button>;
}

export default function Devices() {
  const { data, loading, error } = useApi(getDevices);
  const [selected, setSelected] = useState(null);
  const devices = data?.devices || [];
  const selectedDevice = selected || devices[0];
  return <section className="page"><div><div className="section-title">DEVICE AND RS485 REGISTRY</div><p className="section-sub">Installed hardware is separated from required, not-yet-selected DO and camera modules.</p></div>
    {loading && <p className="section-sub">Loading device registry...</p>}{error && <div className="empty-state"><b>API unavailable</b>Start the backend with <code>npm run server</code>.</div>}
    <div className="device-grid">{devices.map(device => <DeviceCard key={device.id} device={device} selected={selectedDevice?.id === device.id} onSelect={setSelected} />)}</div>
    {selectedDevice && <div className="cols"><div className="panel-box pixel-corners-sm"><h3>{selectedDevice.model} / CONNECTION</h3><div className="spec-list"><div><span>Project role</span>{selectedDevice.projectUse}</div><div><span>Bus / interface</span>{selectedDevice.connection}</div><div><span>Power</span>{selectedDevice.power}</div><div><span>Capabilities</span>{selectedDevice.capabilities.join(' · ')}</div></div>{selectedDevice.sourceUrl && <a className="source-link" href={selectedDevice.sourceUrl} target="_blank" rel="noreferrer">Open manufacturer documentation ↗</a>}</div>
      <div className="panel-box pixel-corners-sm"><h3>MODBUS MAP</h3>{selectedDevice.registers?.length ? <table className="data-table"><thead><tr><th>Address</th><th>Field</th><th>Type</th><th>Purpose</th></tr></thead><tbody>{selectedDevice.registers.map(row => <tr key={row.address}><td><span className="modbus-tag">{row.address}</span></td><td>{row.field}</td><td>{row.type}</td><td>{row.note}</td></tr>)}</tbody></table> : <div className="catalog-empty">No register map applies to this device. Do not invent a Modbus map for hardware that has not been selected.</div>}</div></div>}
    <div className="panel-box pixel-corners-sm"><h3>LH-IO404 OUTPUTS / MODBUS COILS 1-4</h3><div className="relay-grid">{(data?.relays || []).map(relay => <RelaySwitch key={relay.id} relay={relay} />)}</div></div>
  </section>;
}
