import React from "react";
import SpriteChar from "./SpriteChar";

export default function SpriteNumber({
  value,
  size = 32,
  color = "#ffffff",
  gap = 2,
  className = "",
}) {
  const text = String(value);

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${gap}px`,
      }}
    >
      {text.split("").map((char, index) => (
        <SpriteChar
          key={`${char}-${index}`}
          char={char}
          size={size}
          color={color}
        />
      ))}
    </span>
  );
}