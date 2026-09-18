import HudCard from "../components/HudCard.jsx";

import { getDashboard } from "../services/api.js";
import { useApi } from "../hooks/useApi.js";

export default function Overview() {
  const { data, loading, error } = useApi(getDashboard);

  const stats = data?.stats || [];
  const alerts = data?.alerts || [];

  return (
    <section className="page">

      {/* HEADER */}
      <div>
        <div className="section-title">
          TỔNG QUAN AO TÔM
        </div>

        <p className="section-sub">
          {loading
            ? "Đang lấy dữ liệu gateway…"
            : error
              ? "Backend chưa kết nối."
              : `Dữ liệu từ API · ${data?.pond?.name || ""}`}
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="empty-state">
          <b>Không kết nối được backend</b>
          <br />
          Chạy <code>npm run server</code> trong thư mục Web app.
        </div>
      )}

      {/* HUD CARDS */}
      <div className="hud-grid">
        {stats.map((stat) => (
          <HudCard
            key={stat.id}
            stat={stat}
          />
        ))}
      </div>

      {/* BOTTOM COLUMNS */}
      <div className="cols">

        {/* SƠ ĐỒ AO */}
        <div className="panel-box pixel-corners-sm">
          <h3>SƠ ĐỒ AO</h3>

          <div className="pond-view">
            <div className="pond-water" />

            <div
              className="pond-pin"
              style={{
                left: "30%",
                top: "40%",
              }}
            >
              DO
            </div>

            <div
              className="pond-pin"
              style={{
                left: "60%",
                top: "60%",
              }}
            >
              pH
            </div>

            <div
              className="pond-pin"
              style={{
                left: "78%",
                top: "25%",
              }}
            >
              CAM
            </div>

            <div className="pond-caption">
              3 thiết bị · trạng thái tốt
            </div>
          </div>
        </div>

        {/* CẢNH BÁO */}
        <div className="panel-box pixel-corners-sm">
          <h3>CẢNH BÁO GẦN ĐÂY</h3>

          <div className="alert-list">
            {alerts.map((a, i) => (
              <div
                key={i}
                className={"alert-item " + a.level}
              >
                <span className="alert-time">
                  {a.time}
                </span>

                <span>
                  {a.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}