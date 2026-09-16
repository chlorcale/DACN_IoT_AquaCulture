import React from "react";
import SpriteChar from "./SpriteChar.jsx";
import SpriteVietnamese from "./SpriteVietnamese.jsx";

const VIETNAMESE_VOWELS =
  "aáàảãạ" +
  "ăắằẳẵặ" +
  "âấầẩẫậ" +
  "eéèẻẽẹ" +
  "êếềểễệ" +
  "iíìỉĩị" +
  "oóòỏõọ" +
  "ôốồổỗộ" +
  "ơớờởỡợ" +
  "uúùủũụ" +
  "ưứừửữự" +
  "yýỳỷỹỵ";

export default function SpriteText({
  text,
  size = 32,
  color = "#ffffff",
  gap = 1,
  className = "",
}) {
  const characters = [...String(text)];

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: `${gap}px`,
        color,
      }}
    >
      {characters.map((char, index) => {
        // ========================================
        // 1. KHOẢNG TRẮNG
        // ========================================
        if (char === " ") {
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                width: `${size / 2}px`,
                height: `${size}px`,
              }}
            />
          );
        }

        // ========================================
        // 2. XUỐNG DÒNG
        // ========================================
        if (char === "\n") {
          return (
            <span
              key={index}
              style={{
                flexBasis: "100%",
                height: 0,
              }}
            />
          );
        }

        // ========================================
        // 3. SỐ + KÝ HIỆU TRONG Number.png
        // ========================================
        if (/[0-9.,+\-*\/]/.test(char)) {
          return (
            <SpriteChar
              key={index}
              char={char}
              size={size}
              color={color}
            />
          );
        }

        // ========================================
        // 4. NGUYÊN ÂM TIẾNG VIỆT
        // ========================================
        if (VIETNAMESE_VOWELS.includes(char)) {
          return (
            <SpriteVietnamese
              key={index}
              char={char}
              size={size}
              color={color}
            />
          );
        }

        // ========================================
        // 5. CÁC KÝ TỰ KHÁC
        //    → dùng font bình thường
        // ========================================
        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              fontSize: `${size}px`,
              lineHeight: `${size}px`,
              color,
              whiteSpace: "pre",
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}