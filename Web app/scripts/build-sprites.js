// Xuất tất cả file .aseprite trong assets/aseprite/ thành spritesheet PNG + atlas JSON
// trong public/sprites/, dùng chính CLI có sẵn trong Aseprite (không cần thư viện thêm).
//
// Yêu cầu: đã cài Aseprite (bản Steam/itch.io có sẵn CLI; bản Mac App Store thì không).
// Nếu "aseprite" không nằm trong PATH, set biến môi trường ASEPRITE_PATH trỏ tới file .exe/binary.
//
// Chạy: npm run sprites

import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, "..", "assets", "aseprite");
const OUT_DIR = path.join(__dirname, "..", "public", "sprites");
const ASEPRITE_BIN = process.env.ASEPRITE_PATH || "aseprite";

if (!existsSync(SRC_DIR)) {
  console.log(`Không thấy thư mục ${SRC_DIR} — bỏ qua.`);
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });

// Preserve source subfolders in public/sprites so the web catalog mirrors your art library.
const files = readdirSync(SRC_DIR, { recursive: true }).filter((f) => f.endsWith(".aseprite") || f.endsWith(".ase"));

if (files.length === 0) {
  console.log("Chưa có file .aseprite nào trong assets/aseprite/.");
  process.exit(0);
}

for (const file of files) {
  const name = file.slice(0, -path.extname(file).length).replace(/\\/g, "/");
  const input = path.join(SRC_DIR, file);
  const sheetOut = path.join(OUT_DIR, `${name}.png`);
  const dataOut = path.join(OUT_DIR, `${name}.json`);
  mkdirSync(path.dirname(sheetOut), { recursive: true });

  console.log(`Đang xuất ${file} ...`);
  try {
    execFileSync(
      ASEPRITE_BIN,
      [
        "-b", input,
        "--sheet", sheetOut,
        "--sheet-pack",
        "--format", "json-array",
        "--data", dataOut,
        "--filename-format", "{tag}_{frame}"
      ],
      { stdio: "inherit" }
    );
    console.log(`  -> ${name}.png + ${name}.json`);
  } catch (err) {
    console.error(`Lỗi khi xuất ${file}. Kiểm tra ASEPRITE_PATH hoặc PATH.`);
    console.error(err.message);
    process.exitCode = 1;
  }
}
