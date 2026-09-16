import SpriteNumber from "./SpriteNumber.jsx";
import SpriteText from "./SpriteText.jsx";
export default function HudCard({ stat }) {
  const trendClass =
    stat.trend === "up" ? "trend-up" : "trend-down";

  const trendArrow =
    stat.trend === "up" ? "▲" : "▼";

  const rangeClass =
    stat.rangeStatus === "good"
      ? "status-good"
      : stat.rangeStatus === "warn"
        ? "status-warn"
        : "status-bad";

  return (
    <div className="hud-card pixel-corners-sm">

      <div className="hud-top">
        <span className="hud-label">
          {stat.label}
        </span>

        <span className={"hud-trend " + trendClass}>
          {trendArrow} {stat.trendValue}
        </span>
      </div>

      <div className="hud-value">
        <SpriteNumber
          value={stat.value}
          size={32}
          color={stat.color || "#ffffff"}
        />

        {stat.unit && (
          <small>{stat.unit}</small>
        )}
      </div>

      <div className="bar-track">
        <div
          className="bar-fill"
          style={{
            width: stat.percent + "%",
            background: stat.color,
          }}
        />
      </div>

      <div className="hud-range">
        <span>0</span>

        <span className={rangeClass}>
          {stat.range}
        </span>

        <span>10</span>
      </div>

    </div>
  );
}