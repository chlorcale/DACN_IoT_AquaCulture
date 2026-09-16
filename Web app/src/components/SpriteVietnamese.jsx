import React from "react";

/*
 * Sprite sheet:
 *
 * Size: 128 x 512 px
 *
 * Mỗi ký tự:
 *   width  = 16 px
 *   height = 32 px
 *
 * Vì ký tự cao 2 ô 16x16 nên:
 *
 *   x = column * 16
 *   y = row * 32
 */

const VOWEL_MAP = {
  // =========================
  // A
  // =========================
  "a": [0, 0],
  "á": [1, 0],
  "à": [2, 0],
  "ả": [3, 0],
  "ã": [4, 0],
  "ạ": [5, 0],

  // =========================
  // Ă
  // =========================
  "ă": [0, 1],
  "ắ": [1, 1],
  "ằ": [2, 1],
  "ẳ": [3, 1],
  "ẵ": [4, 1],
  "ặ": [5, 1],

  // =========================
  // Â
  // =========================
  "â": [0, 2],
  "ấ": [1, 2],
  "ầ": [2, 2],
  "ẩ": [3, 2],
  "ẫ": [4, 2],
  "ậ": [5, 2],

  // =========================
  // I
  // =========================
  "i": [0, 3],
  "í": [1, 3],
  "ì": [2, 3],
  "ỉ": [3, 3],
  "ĩ": [4, 3],
  "ị": [5, 3],

  // =========================
  // O
  // =========================
  "o": [0, 4],
  "ó": [1, 4],
  "ò": [2, 4],
  "ỏ": [3, 4],
  "õ": [4, 4],
  "ọ": [5, 4],

  // =========================
  // Ô
  // =========================
  "ô": [0, 5],
  "ố": [1, 5],
  "ồ": [2, 5],
  "ổ": [3, 5],
  "ỗ": [4, 5],
  "ộ": [5, 5],

  // =========================
  // Ơ
  // =========================
  "ơ": [0, 6],
  "ớ": [1, 6],
  "ờ": [2, 6],
  "ở": [3, 6],
  "ỡ": [4, 6],
  "ợ": [5, 6],

  // =========================
  // U
  // =========================
  "u": [0, 7],
  "ú": [1, 7],
  "ù": [2, 7],
  "ủ": [3, 7],
  "ũ": [4, 7],
  "ụ": [5, 7],

  // =========================
  // Ư
  // =========================
  "ư": [0, 8],
  "ứ": [1, 8],
  "ừ": [2, 8],
  "ử": [3, 8],
  "ữ": [4, 8],
  "ự": [5, 8],

  // =========================
  // E
  // =========================
  "e": [0, 9],
  "é": [1, 9],
  "è": [2, 9],
  "ẻ": [3, 9],
  "ẽ": [4, 9],
  "ẹ": [5, 9],

  // =========================
  // Ê
  // =========================
  "ê": [0, 10],
  "ế": [1, 10],
  "ề": [2, 10],
  "ể": [3, 10],
  "ễ": [4, 10],
  "ệ": [5, 10],

  // =========================
  // Y
  // =========================
  "y": [0, 11],
  "ý": [1, 11],
  "ỳ": [2, 11],
  "ỷ": [3, 11],
  "ỹ": [4, 11],
  "ỵ": [5, 11],
};

const CHAR_WIDTH = 16;
const CHAR_HEIGHT = 32;

const SHEET_WIDTH = 128;
const SHEET_HEIGHT = 512;

export default function SpriteVietnamese({
  char,
  size = 32,
  color = "#ffffff",
}) {
  const position = VOWEL_MAP[char];

  /*
   * Không có ký tự trong sprite sheet
   * thì trả về text bình thường.
   */
  if (!position) {
    return (
      <span
        style={{
          color,
          fontSize: `${size}px`,
          lineHeight: `${size}px`,
        }}
      >
        {char}
      </span>
    );
  }

  const [column, row] = position;

  /*
   * Sprite gốc cao 32px.
   *
   * Nếu size = 32
   *   → scale = 1
   *
   * Nếu size = 64
   *   → scale = 2
   */
  const scale = size / CHAR_HEIGHT;

  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",

        /*
         * Mỗi ký tự trong UI vẫn có tỷ lệ 1:2
         *
         * width  = size / 2
         * height = size
         */
        width: `${size / 2}px`,
        height: `${size}px`,

        backgroundColor: color,

        /*
         * Lấy hình từ sprite sheet
         */
        WebkitMaskImage:
          "url('/sprites/nguyenam_normal.png')",

        maskImage:
          "url('/sprites/nguyenam_normal.png')",

        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",

        /*
         * Phóng toàn bộ sheet theo scale.
         */
        WebkitMaskSize:
          `${SHEET_WIDTH * scale}px ${
            SHEET_HEIGHT * scale
          }px`,

        maskSize:
          `${SHEET_WIDTH * scale}px ${
            SHEET_HEIGHT * scale
          }px`,

        /*
         * Mỗi ký tự:
         * x = 16 px
         * y = 32 px
         */
        WebkitMaskPosition:
          `-${column * size / 2}px -${row * size}px`,

        maskPosition:
          `-${column * size / 2}px -${row * size}px`,
      }}
    />
  );
}