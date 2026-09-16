# AquaPixel — Hệ thống IoT giám sát chất lượng nước ao tôm

Prototype đồ án cho hệ thống quan trắc chất lượng nước ao tôm theo thời gian thực. Hệ thống thu nhận pH, nhiệt độ nước và oxy hòa tan (DO); lưu dữ liệu lên server; chụp ảnh bề mặt nước theo chu kỳ để đánh giá bổ sung màu sắc/độ đục; sau đó trực quan hóa dữ liệu và cảnh báo trên web app.

> Trạng thái hiện tại: gateway, cảm biến pH/nhiệt độ và relay I/O đã được mô hình hóa đúng tài liệu thiết bị. Cảm biến DO và camera là hạng mục **bắt buộc nhưng chưa chốt model**, vì vậy không được xem là phần cứng đã hoàn thiện.

## Mục lục

- [Mục tiêu đồ án](#mục-tiêu-đồ-án)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Thiết bị phần cứng](#thiết-bị-phần-cứng)
- [Chức năng đã có](#chức-năng-đã-có)
- [Cấu trúc repository](#cấu-trúc-repository)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [API](#api)
- [Catalog Aseprite](#catalog-aseprite)
- [Kiểm thử và triển khai](#kiểm-thử-và-triển-khai)
- [Lộ trình hoàn thiện](#lộ-trình-hoàn-thiện)

## Mục tiêu đồ án

Trong nuôi tôm, DO, pH và nhiệt độ biến động theo thời gian và có ảnh hưởng trực tiếp đến sức khỏe tôm. Đồ án xây dựng một luồng giám sát gồm:

1. Thu thập pH, nhiệt độ và DO theo thời gian thực.
2. Truyền dữ liệu từ gateway lên server IoT; lưu lịch sử có timestamp và nguồn dữ liệu.
3. Chụp ảnh bề mặt ao theo chu kỳ, rút trích màu sắc/độ trong-độ đục như chỉ báo bổ sung.
4. Hiển thị số liệu, ảnh, trạng thái thiết bị và cảnh báo trên web/mobile app.
5. Kiểm thử thực tế, so sánh với thiết bị tham chiếu và đánh giá độ tin cậy của toàn hệ thống.

## Kiến trúc hệ thống

```text
ES-PH-WT-01 (pH + temperature) -- RS485 --+
DO sensor (required, model TBD) ---- RS485 --+--> EPCB-IEC-ESP32-S3 gateway
LH-IO404 (4 relay outputs) -------- RS485 --+               |
                                                               | LAN / Wi-Fi
Water-surface camera ------------- Wi-Fi/LAN ----------------> IoT API + storage
                                                                          |
                                                               React web / mobile app
```

Ảnh camera chỉ là nguồn đánh giá bổ sung. Kết quả màu sắc/độ đục **không thay thế** phép đo DO, pH hoặc nhiệt độ bằng cảm biến vật lý.

## Thiết bị phần cứng

| Vai trò | Thiết bị | Kết nối / cấu hình trong dự án | Trạng thái |
|---|---|---|---|
| Gateway | [EPCB-IEC-ESP32-S3](https://epcb.vn/products/smart-industrial-iot-gateway-epcb-iec-esp32-s3) | RS485 master, LAN/Wi-Fi, RTC, DI/DO | Đã chọn |
| pH + nhiệt độ | [ES-PH-WT-01](https://epcb.vn/products/cam-bien-dau-do-do-do-ph-nuoc-es-ph-wt-01-rs485-4-20ma) | Modbus RTU slave 1, 4800 bps, 8N1; pH `0x0001`, nhiệt độ `0x0003` | Đã chọn |
| Điều khiển tải | [LH-IO404](https://epcb.vn/products/thiet-bi-dieu-khien-giam-sat-io-giao-tiep-rs485-va-rs232-cong-nghiep-lh-io) | Modbus RTU slave 2; coil 1–4: quạt, bơm, máy cho ăn, dự phòng | Đã chọn |
| DO | Cảm biến DO phù hợp nước ao | Cần chọn loại có quy trình hiệu chuẩn và giao tiếp tương thích | Chưa chọn |
| Camera | Camera chống nước/chống ẩm | Khung hình cố định, upload ảnh định kỳ qua Wi-Fi/LAN | Chưa chọn |

Ngưỡng hiển thị hiện tại là **cấu hình mẫu của đồ án**: DO 4–7 mg/L, pH 7.5–8.5 và nhiệt độ 28–31 °C. Khi thử nghiệm phải hiệu chỉnh ngưỡng theo giống tôm, mật độ nuôi, giai đoạn nuôi và điều kiện ao thực tế.

## Chức năng đã có

- Dashboard lấy dữ liệu qua REST API, không dùng mock data cho các trang giám sát chính.
- Device registry: phân biệt rõ thiết bị đã có, thiết bị chưa chọn, bus RS485, nguồn cấp, khả năng và map thanh ghi pH.
- Điều khiển 4 relay LH-IO404 qua `PATCH /api/relays/:id`.
- Lịch sử telemetry và biểu đồ DO, pH, nhiệt độ.
- Cảnh báo từ ngưỡng cấu hình, mất liên lạc và tác vụ xử lý ảnh.
- Endpoint metadata/kết quả camera: màu chủ đạo, phân loại độ đục, biến thiên độ trong và confidence.
- Catalog pixel art: quét atlas Aseprite theo cây thư mục và tạo JSX sử dụng từng frame.
- Lưu runtime telemetry, cảnh báo, relay và vision tại `server/data/runtime-state.json` để không mất khi restart.
- GitHub Actions kiểm tra cú pháp backend và build frontend ở mỗi push/pull request.

## Cấu trúc repository

```text
.
├── Web app/                     # React 18 + Vite dashboard
│   ├── src/
│   │   ├── pages/               # Dashboard, telemetry, device, camera, alert, catalog
│   │   ├── components/          # UI components tái sử dụng
│   │   ├── services/api.js      # REST client
│   │   └── sprites/             # Aseprite atlas renderers
│   ├── public/sprites/          # PNG + JSON atlas đã export
│   └── scripts/build-sprites.js # Aseprite → atlas pipeline
├── server/
│   ├── src/server.js            # Node.js REST API, rules và JSON persistence
│   └── data/                    # Runtime state (được gitignore)
├── .github/workflows/ci.yml     # GitHub Actions
└── THESIS_SCOPE.md              # Phạm vi, API contracts và checklist đánh giá
```

## Cài đặt và chạy

### Yêu cầu

- Node.js 20 LTS hoặc mới hơn.
- npm 10+.
- Aseprite CLI chỉ cần khi export artwork mới.

### 1. Clone repository

```bash
git clone https://github.com/<your-account>/aquapixel-iot-shrimp-pond.git
cd aquapixel-iot-shrimp-pond
```

### 2. Chạy backend API

Backend không cần cài package ngoài.

```bash
cd server
npm run dev
```

API chạy tại `http://localhost:4000`.

### 3. Chạy frontend

Mở terminal khác từ thư mục root repository:

```bash
cd "Web app"
npm ci
npm run dev
```

Mở `http://localhost:5173`. Vite tự proxy `/api` sang backend `http://localhost:4000` trong môi trường phát triển.

### 4. Build production

```bash
cd "Web app"
npm run build
npm run preview
```

Để deploy riêng frontend, tạo file `Web app/.env.production`:

```env
VITE_API_URL=https://your-api-domain.example/api
```

API production phải dùng database thật, HTTPS, xác thực và kiểm soát quyền trước khi điều khiển relay.

## API

| Method | Endpoint | Mục đích |
|---|---|---|
| `GET` | `/api/health` | Kiểm tra API/gateway status |
| `GET` | `/api/dashboard` | Giá trị mới nhất và cảnh báo gần đây |
| `GET` | `/api/devices` | Registry thiết bị và relay |
| `GET` | `/api/telemetry?limit=24` | Lịch sử DO, pH, nhiệt độ và ngưỡng |
| `POST` | `/api/telemetry` | Gateway gửi mẫu đo mới |
| `GET` / `POST` | `/api/vision` | Metadata ảnh và kết quả đánh giá ảnh |
| `GET` | `/api/alerts` | Log cảnh báo |
| `PATCH` | `/api/relays/:id` | Yêu cầu thay đổi trạng thái relay |
| `GET` | `/api/catalog` | Cây thư mục atlas sprite |
| `GET` | `/api/project` | Phạm vi thiết kế và kế hoạch kiểm thử |

Ví dụ gửi telemetry từ gateway hoặc công cụ test:

```bash
curl -X POST http://localhost:4000/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{"dissolvedOxygen":5.4,"ph":7.9,"temperature":29.2,"source":"gateway-01"}'
```

> API hiện là prototype Node.js. Gateway firmware thực tế cần poll Modbus RTU, kiểm tra CRC/timeout, retry có giới hạn, ghi log lỗi và gửi dữ liệu theo giao thức được xác thực.

## Catalog Aseprite

Lưu file nguồn trong `Web app/assets/aseprite/`. Có thể tạo thư mục theo nhóm, ví dụ:

```text
assets/aseprite/
├── devices/
│   ├── ph-sensor.aseprite
│   └── relay.aseprite
└── dashboard/
    └── water-quality.aseprite
```

Export atlas:

```bash
cd "Web app"
npm run sprites
```

Script giữ cấu trúc thư mục trong `public/sprites/`. Vào trang **Catalog pixel** để xem cây asset, preview frame và sao chép JSX:

```jsx
<Sprite atlas="/sprites/devices/ph-sensor.json" frame="idle_0" scale={2} />
```

Đặt `ASEPRITE_PATH` nếu Aseprite CLI chưa có trong `PATH`:

```powershell
$env:ASEPRITE_PATH = "C:\Program Files\Aseprite\Aseprite.exe"
```

## Kiểm thử và triển khai

Trước nghiệm thu, cần lưu bằng chứng cho từng lần đo: timestamp, ao/vị trí, raw value, thiết bị, kết quả thiết bị tham chiếu, phiên bản firmware và ảnh tương ứng. Kiểm thử tối thiểu:

1. So sánh DO/pH/nhiệt độ với thiết bị tham chiếu.
2. Ghi log hiệu chuẩn và vệ sinh đầu dò pH.
3. So sánh đánh giá ảnh với quan sát thực địa để tính độ chính xác/agreement.
4. Kiểm tra mất RS485, mất mạng, dữ liệu thiếu, trễ cảnh báo và thời gian phục hồi.
5. Kiểm tra relay với tải an toàn. Lệnh API không phải bằng chứng tải đã đổi trạng thái; firmware nên có read-back/DI và interlock điện.

## Lộ trình hoàn thiện

- [ ] Chọn cảm biến DO và camera có thông số, wiring diagram, chiến lược hiệu chuẩn rõ ràng.
- [ ] Viết firmware ESP32-S3: Modbus polling, buffering offline, NTP/RTC, HTTPS/MQTT và OTA.
- [ ] Chuyển JSON persistence sang PostgreSQL/TimescaleDB hoặc nền tảng IoT.
- [ ] Bổ sung đăng nhập, phân quyền, audit log và xác nhận thao tác relay.
- [ ] Lưu ảnh ở object storage, chạy pipeline CV và version model/dataset.
- [ ] Phát triển Mobile app khi API contract đã ổn định.

## Tài liệu bổ sung

- [Phạm vi đồ án, thiết bị và API contract](THESIS_SCOPE.md)
- [Hướng dẫn pipeline Aseprite](Web%20app/ASEPRITE_PIPELINE.md)
