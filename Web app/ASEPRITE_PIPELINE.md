# Pipeline pixel art (Aseprite → React)

## 1. Vẽ trong Aseprite
Lưu file `.aseprite` gốc vào `assets/aseprite/`. Mỗi file có thể chứa nhiều frame
(cho icon tĩnh) hoặc nhiều frame + tag animation (cho sprite chuyển động, vd tag
`swim`, `idle`, `alert` — đặt tag trong Aseprite ở khung Timeline).

## 2. Xuất sprite sheet
```bash
npm run sprites
```
Script `scripts/build-sprites.js` gọi CLI có sẵn của Aseprite để xuất mỗi file
`.aseprite` thành 1 cặp `ten-file.png` (sprite sheet) + `ten-file.json` (atlas toạ
độ từng frame + tag) vào `public/sprites/`.

**Yêu cầu:** bản Aseprite có CLI (Steam/itch.io — bản Mac App Store không có CLI).
Nếu lệnh `aseprite` không có trong PATH, set biến môi trường:
```bash
# Windows (PowerShell)
$env:ASEPRITE_PATH="C:\Program Files\Aseprite\Aseprite.exe"
# macOS/Linux
export ASEPRITE_PATH="/Applications/Aseprite.app/Contents/MacOS/aseprite"
```
rồi chạy lại `npm run sprites`.

## 3. Dùng trong React
Icon tĩnh:
```jsx
import Sprite from "../sprites/Sprite.jsx";
<Sprite atlas="/sprites/ui-icons.json" frame="shrimp_0" scale={2} />
```

Animation theo tag:
```jsx
import AnimatedSprite from "../sprites/AnimatedSprite.jsx";
<AnimatedSprite atlas="/sprites/shrimp-anim.json" tag="swim" scale={3} />
```

`scale` phóng to nguyên lần (2x, 3x...) và giữ nét răng cưa pixel nhờ
`image-rendering: pixelated` — không bị mờ như phóng to ảnh thường.

## Demo có sẵn
`public/sprites/ui-icons.png` + `.json` là 1 sprite sheet mẫu (tự sinh, không phải
từ Aseprite) để bạn thấy pipeline chạy ngay cả khi chưa cài Aseprite. Icon "tôm"
trong sidebar (`Sidebar.jsx`) đang dùng file này qua `<Sprite frame="shrimp_0" />`.
Khi bạn xuất file thật từ Aseprite trùng tên `ui-icons`, nó sẽ tự ghi đè và thay
thế icon demo.
