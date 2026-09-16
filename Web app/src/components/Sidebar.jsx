import Sprite from "../sprites/Sprite.jsx";

const NAV_ITEMS = [
  { id: "overview", label: "Tong quan" },
  { id: "monitoring", label: "Theo doi so lieu" },
  { id: "devices", label: "Thiet bi va RS485" },
  { id: "camera", label: "Camera va anh nuoc" },
  { id: "alerts", label: "Canh bao" },
  { id: "catalog", label: "Catalog pixel" },
  { id: "project", label: "Thiet ke de tai" },
  { id: "settings", label: "Tai khoan" }
];

export default function Sidebar({ page, setPage }) {
  return <aside className="sidebar">
    <div className="brand"><Sprite atlas="/sprites/ui-icons.json" frame="shrimp_0" scale={2} alt="AquaPixel" /><div className="brand-name">AQUAPIXEL<span>Shrimp pond IoT monitoring</span></div></div>
    <div className="account-card pixel-corners-sm"><div className="account-row"><div className="avatar">NT</div><div><div className="account-name">Operator</div><div className="account-role">Pond technician</div></div></div><div className="account-status"><span className="led" />Server session active</div></div>
    <nav className="menu"><div className="menu-label">WORKSPACE</div>{NAV_ITEMS.map((item) => <button key={item.id} className={'nav-item' + (page === item.id ? ' active' : '')} onClick={() => setPage(item.id)}><span className="dot" />{item.label}{item.id === "alerts" && <span className="badge">3</span>}</button>)}</nav>
    <div className="sidebar-footer">Selected pond:<br /><b style={{ color: "var(--ink)" }}>Pond 02</b><br />Thesis prototype v0.2</div>
  </aside>;
}
