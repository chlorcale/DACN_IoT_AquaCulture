import React from "react";

const CHAR_MAP = {
  "1": [0, 0],
  "2": [1, 0],
  "3": [2, 0],
  "4": [3, 0],

  "5": [0, 1],
  "6": [1, 1],
  "7": [2, 1],
  "8": [3, 1],

  "9": [0, 2],
  "0": [1, 2],
  ".": [2, 2],
  ",": [3, 2],

  "+": [0, 3],
  "-": [1, 3],
  "*": [2, 3],
  "/": [3, 3],
};

const SPRITE_SIZE = 32;
const SHEET_SIZE = 128;

export default function SpriteChar({
  char,
  size = 32,
  color = "#ffffff",
  className = "",
}) {
  const position = CHAR_MAP[char];

  if (!position) {
    return (
      <span className={className}>
        {char}
      </span>
    );
  }

  const [column, row] = position;

  const scale = size / SPRITE_SIZE;

  return (
    <span
      className={className}
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: `${size}px`,
        height: `${size}px`,

        backgroundColor: color,

        WebkitMaskImage: "url('/sprites/Number.png')",
        maskImage: "url('/sprites/Number.png')",

        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",

        WebkitMaskSize: `${SHEET_SIZE * scale}px ${
          SHEET_SIZE * scale
        }px`,
        maskSize: `${SHEET_SIZE * scale}px ${
          SHEET_SIZE * scale
        }px`,

        WebkitMaskPosition: `-${column * size}px -${row * size}px`,
        maskPosition: `-${column * size}px -${row * size}px`,
      }}
    />
  );
}