import { useEffect, useState } from "react";

const cache = new Map();

// Đọc file atlas JSON do Aseprite xuất (định dạng --format json-array).
// Trả về { frames, tags, image, imageSize, loading }.
export function useAtlas(atlasUrl) {
  const [data, setData] = useState(cache.get(atlasUrl) || null);

  useEffect(() => {
    if (cache.has(atlasUrl)) {
      setData(cache.get(atlasUrl));
      return;
    }
    let cancelled = false;
    fetch(atlasUrl)
      .then((res) => res.json())
      .then((json) => {
        const parsed = {
          frames: json.frames || [],
          tags: (json.meta && json.meta.frameTags) || [],
          image: json.meta ? json.meta.image : null,
          imageSize: json.meta ? json.meta.size : { w: 0, h: 0 }
        };
        cache.set(atlasUrl, parsed);
        if (!cancelled) setData(parsed);
      })
      .catch((err) => console.error("Không đọc được atlas:", atlasUrl, err));
    return () => {
      cancelled = true;
    };
  }, [atlasUrl]);

  return data;
}

// atlasUrl vd: "/sprites/ui-icons.json" -> ảnh cùng tên "/sprites/ui-icons.png"
export function imageUrlFromAtlas(atlasUrl) {
  return atlasUrl.replace(/\.json$/, ".png");
}
