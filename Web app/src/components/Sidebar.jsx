import Sprite from "../sprites/Sprite.jsx";
import SpriteNumber from "./SpriteNumber.jsx";

const NAV_ITEMS = [
  { id: "overview", label: "Tổng quan" },
  { id: "monitoring", label: "Theo dõi số liệu" },
  { id: "devices", label: "Thiết bị và RS485" },
  { id: "camera", label: "Camera và ảnh nước" },
  { id: "alerts", label: "Cảnh báo" },
  { id: "catalog", label: "Catalog pixel" },
  { id: "project", label: "Thiết kế đề tài" },
  { id: "settings", label: "Tài khoản" },
];

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">

      {/* =========================
          BRAND
      ========================= */}
      <div className="brand">
        <Sprite
          atlas="/sprites/ui-icons.json"
          frame="shrimp_0"
          scale={2}
          alt="AquaPixel"
        />

        <div className="brand-name">
          AQUAPIXEL
          <span>Shrimp pond IoT monitoring</span>
        </div>
      </div>

      {/* =========================
          ACCOUNT
      ========================= */}
      <div className="account-card pixel-corners-sm">
        <div className="account-row">

          <div className="avatar">
            HP
          </div>

          <div>
            <div className="account-name">
              Operator
            </div>

            <div className="account-role">
              Pond technician
            </div>
          </div>

        </div>

        <div className="account-status">
          <span className="led" />
          Server session active
        </div>
      </div>

      {/* =========================
          NAVIGATION
      ========================= */}
      <nav className="menu">
        <div className="menu-label">
          WORKSPACE
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = page === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={
                "nav-item" +
                (isActive ? " active" : "")
              }
              onClick={() => setPage(item.id)}
              aria-current={
                isActive ? "page" : undefined
              }
            >
              <span className="dot" />

              <span>
                {item.label}
              </span>

              {item.id === "alerts" && (
                <span className="badge">
                  <SpriteNumber
                    value={3}
                    size={14}
                    color="currentColor"
                    gap={0}
                  />
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* =========================
          FOOTER
      ========================= */}
      <div className="sidebar-footer">
        Selected pond:
        <br />

        <b style={{ color: "var(--ink)" }}>
          Pond 02
        </b>

        <br />

        Thesis prototype v0.2
      </div>

    </aside>
  );
}