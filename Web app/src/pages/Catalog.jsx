import PixelCatalog from "../components/PixelCatalog.jsx";
import { getCatalog } from "../services/api.js";
import { useApi } from "../hooks/useApi.js";

export default function Catalog() {
  const { data, loading, error } = useApi(getCatalog);
  return <section className="page"><div><div className="section-title">CATALOG PIXEL ART</div><p className="section-sub">Các atlas Aseprite trong <code>public/sprites</code> được backend quét thành cây thư mục.</p></div>{loading && <div className="catalog-empty">Đang tải catalog…</div>}{error && <div className="empty-state"><b>Không kết nối được backend</b>Chạy <code>npm run server</code> trong thư mục Web app.</div>}{data && <PixelCatalog tree={data.tree} />}</section>;
}
