import { useState } from "react";
import Sprite from "../sprites/Sprite.jsx";

function Tree({ node, depth = 0, selectAtlas }) {
  const [open, setOpen] = useState(true);
  if (node.type === "atlas") return <button className="catalog-file" onClick={() => selectAtlas(node)}>▧ {node.name}</button>;
  return <div className="catalog-node" style={{ "--depth": depth }}>
    <button className="catalog-folder" onClick={() => setOpen(!open)}>{open ? "▾" : "▸"} 📁 {node.name}</button>
    {open && node.children?.map((child) => <Tree key={child.path || child.name} node={child} depth={depth + 1} selectAtlas={selectAtlas} />)}
  </div>;
}

export default function PixelCatalog({ tree }) {
  const initial = tree?.children?.[0];
  const [atlas, setAtlas] = useState(initial);
  const [selected, setSelected] = useState(null);
  const icons = atlas?.frames || [];
  return <div className="catalog-layout">
    <aside className="panel-box pixel-corners-sm"><h3>THƯ MỤC ASSET</h3><div className="catalog-tree">{tree && <Tree node={tree} selectAtlas={setAtlas} />}</div></aside>
    <section className="panel-box pixel-corners-sm"><h3>{atlas ? `ATLAS: ${atlas.path}` : "CHỌN MỘT ATLAS"}</h3>
      {selected && <p className="section-sub">Dùng: <code>{`<Sprite atlas="${atlas.url}" frame="${selected}" scale={2} />`}</code></p>}
      <div className="catalog-grid">{icons.map((frame) => <button key={frame} className={'catalog-icon' + (selected === frame ? ' selected' : '')} onClick={() => setSelected(frame)}><span className="catalog-preview"><Sprite atlas={atlas.url} frame={frame} scale={2} alt={frame} /></span><span>{frame}</span><span className="catalog-code">{atlas.path}/{frame}</span></button>)}</div>
      {!icons.length && <div className="catalog-empty">Atlas này chưa có frame. Hãy xuất lại từ Aseprite.</div>}
    </section>
  </div>;
}
