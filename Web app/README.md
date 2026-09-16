# AquaPixel Dashboard

Dashboard React + Node API cho hệ thống giám sát ao tôm. Frontend gọi API qua Vite proxy; backend hiện có dữ liệu mô phỏng có thể thay bằng dữ liệu gateway/DB.

## Chạy toàn bộ dự án

Mở hai terminal tại `Web app/`:

```bash
# Terminal 1: API tại http://localhost:4000
npm run server

# Terminal 2: web tại http://localhost:5173
npm run dev
```

Các endpoint hiện có: `GET /api/health`, `GET /api/dashboard`, `GET /api/devices`, `PATCH /api/relays/:id`, `GET /api/catalog`.

The full thesis-oriented hardware boundary, device status and API contracts are documented in [`../THESIS_SCOPE.md`](../THESIS_SCOPE.md). The API also provides `GET/POST /api/telemetry`, `GET/POST /api/vision`, `GET /api/alerts`, and `GET /api/project`.

## Catalog Aseprite

Lưu artwork theo nhóm trong `assets/aseprite/`, ví dụ `assets/aseprite/devices/sensors.aseprite`, rồi chạy `npm run sprites`. File xuất ra sẽ giữ cấu trúc thư mục trong `public/sprites/`; backend quét thư mục này và trang **Catalog pixel** hiển thị dạng cây. Nhấn icon để nhận JSX gọi đúng atlas/frame.

Giao diện dashboard React (pixel art) cho đồ án giám sát chất lượng nước ao tôm.
Toàn bộ dữ liệu hiện là dữ liệu mẫu (`src/data/mockData.js`) — chưa nối backend thật.

## Chạy thử

```bash
npm install
npm start
```

Mở trình duyệt tại `http://localhost:5173` (Vite sẽ tự mở).

## Cấu trúc thư mục

```
src/
  App.jsx              # điều hướng giữa các trang
  index.css            # toàn bộ token màu + style pixel
  components/          # Sidebar, TopBar, HudCard, RelaySwitch (dùng lại được)
  pages/                # Overview, Devices, Camera, Alerts, AIAssistant, Settings
  data/mockData.js      # dữ liệu mẫu — thay bằng API thật ở đây
```

## Bước tiếp theo gợi ý

1. Tạo `src/services/api.js` gọi backend Node.js (REST hoặc Socket.IO) thay cho `mockData.js`.
2. Thêm cảm biến DO và camera thật vào bảng thiết bị trong `Devices.jsx` khi đã chốt phần cứng.
3. Nối nút "GỬI" trong `AIAssistant.jsx` với API AI thật.
4. Thêm xác thực đăng nhập thật cho `Sidebar.jsx` (hiện đang là dữ liệu tĩnh).
