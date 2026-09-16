export const hudStats = [
  {
    label: "Oxy hoà tan",
    value: "5.2",
    unit: "mg/L",
    trend: "up",
    trendValue: "0.2",
    percent: 72,
    color: "var(--green)",
    range: "An toàn: 4–7",
    rangeStatus: "good"
  },
  {
    label: "Độ pH",
    value: "7.8",
    unit: "",
    trend: "down",
    trendValue: "0.1",
    percent: 64,
    color: "var(--green)",
    range: "An toàn: 7.5–8.5",
    rangeStatus: "good"
  },
  {
    label: "Nhiệt độ nước",
    value: "29.4",
    unit: "°C",
    trend: "up",
    trendValue: "0.4",
    percent: 80,
    color: "var(--amber)",
    range: "Gần ngưỡng cao: 28–31",
    rangeStatus: "warn"
  },
  {
    label: "Độ đục (ảnh)",
    value: "Trung bình",
    unit: "",
    trend: "down",
    trendValue: "3%",
    percent: 45,
    color: "var(--amber)",
    range: "Ước tính từ ảnh",
    rangeStatus: "warn"
  }
];

export const alerts = [
  { time: "08:12", level: "warn", text: "Nhiệt độ nước tiệm cận ngưỡng cao tại Ao 02 (29.4°C)." },
  { time: "07:40", level: "", text: "Đã nhận ảnh chụp bề mặt nước mới từ camera." },
  { time: "Hôm qua", level: "bad", text: "Mất kết nối cảm biến pH trong 6 phút." },
  { time: "Hôm qua", level: "", text: "Đã hiệu chuẩn lại cảm biến DO." }
];

export const devices = [
  { name: "Cảm biến pH", model: "ES-PH-WT-01", modbus: "addr 1 · 4800bps", status: "ok" },
  { name: "Bộ relay I/O", model: "LH-IO404", modbus: "addr 2 · 4800bps", status: "ok" },
  { name: "Gateway", model: "EPCB-IEC-ESP32-S3", modbus: "Modbus master", status: "ok" },
  { name: "Camera bề mặt", model: "—", modbus: "chưa chọn", status: "off" }
];

export const relays = [
  { id: 1, name: "Quạt sục khí", sub: "Relay 1 · tự động khi DO thấp", on: true },
  { id: 2, name: "Bơm cấp nước", sub: "Relay 2 · điều khiển tay", on: false },
  { id: 3, name: "Máy cho ăn", sub: "Relay 3 · theo lịch", on: false }
];
