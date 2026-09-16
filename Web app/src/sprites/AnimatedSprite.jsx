import { useEffect, useRef, useState } from "react";
import { useAtlas, imageUrlFromAtlas } from "./useAtlas.js";

// Chạy animation theo 1 tag đã đặt trong Aseprite (vd tag "swim", "idle", "alert").
// <AnimatedSprite atlas="/sprites/shrimp-anim.json" tag="swim" scale={3} />
export default function AnimatedSprite({ atlas, tag, scale = 1, alt = "" }) {
  const data = useAtlas(atlas);
  const [frameIndex, setFrameIndex] = useState(0);
  const timeoutRef = useRef(null);

  const tagInfo = data ? data.tags.find((t) => t.name === tag) : null;
  const framesInTag =
    data && tagInfo ? data.frames.slice(tagInfo.from, tagInfo.to + 1) : data ? data.frames : [];

  useEffect(() => {
    if (!framesInTag.length) return;
    const current = framesInTag[frameIndex % framesInTag.length];
    const duration = current.duration || 100;
    timeoutRef.current = setTimeout(() => {
      setFrameIndex((i) => (i + 1) % framesInTag.length);
    }, duration);
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameIndex, framesInTag.length, atlas, tag]);

  if (!data || !framesInTag.length) return null;

  const entry = framesInTag[frameIndex % framesInTag.length];
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
