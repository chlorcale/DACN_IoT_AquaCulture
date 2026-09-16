import { useState } from "react";
import { updateRelay } from "../services/api.js";

export default function RelaySwitch({ relay }) {
  const [on, setOn] = useState(relay.on);

  return (
    <div className="relay-card">
      <div>
        <div className="relay-name">{relay.name}</div>
        <div className="relay-sub">{relay.sub}</div>
      </div>
      <button
        type="button"
        aria-label={`Bật/tắt ${relay.name}`}
        className={"pixel-switch" + (on ? " on" : "")}
        onClick={async () => {
          const next = !on;
          setOn(next);
          try { await updateRelay(relay.id, next); } catch { setOn(!next); }
        }}
      >
        <div className="knob"></div>
      </button>
    </div>
  );
}
