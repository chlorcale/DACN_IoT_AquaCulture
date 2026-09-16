import { useAtlas, imageUrlFromAtlas } from "./useAtlas.js";

// Hiển thị 1 frame tĩnh từ atlas Aseprite, ví dụ:
// <Sprite atlas="/sprites/ui-icons.json" frame="shrimp_0" scale={2} />
export default function Sprite({ atlas, frame, scale = 1, alt = "" }) {
  const data = useAtlas(atlas);
  if (!data) return null;

  const entry = data.frames.find((f) => f.filename === frame);
  if (!entry) {
    console.warn(`Không tìm thấy frame "${frame}" trong ${atlas}`);
    return null;
  }

  const { x, y, w, h } = entry.frame;
  const imageUrl = imageUrlFromAtlas(atlas);

  return (
    <div
      role="img"
      aria-label={alt}
      style={{
        width: w * scale,
        height: h * scale,
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: `-${x * scale}px -${y * scale}px`,
        backgroundSize: `${data.imageSize.w * scale}px ${data.imageSize.h * scale}px`,
        imageRendering: "pixelated",
        flexShrink: 0
      }}
    />
  );
}
