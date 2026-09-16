import { useEffect, useState } from "react";

export default function TopBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="topbar">
      <div className="pond-select pixel-corners-sm">
        <span style={{ color: "var(--ink-dim)", fontSize: 14 }}>AO NUÔI</span>
        <select>
          <option>Ao tôm số 02</option>
          <option>Ao tôm số 01</option>
          <option>Ao tôm số 03 (chưa gắn thiết bị)</option>
        </select>
      </div>
      <div className="topbar-right">
        <span className="conn-ok">● Server IoT: kết nối ổn định</span>
        <span>{time.toLocaleTimeString("vi-VN")}</span>
      </div>
    </div>
  );
}
