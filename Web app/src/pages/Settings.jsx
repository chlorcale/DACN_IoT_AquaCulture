import { useState } from "react";

export default function Settings() {
  const [form, setForm] = useState({
    name: "Nguyễn Thảo",
    role: "Kỹ thuật viên",
    email: "thao.nguyen@aquapixel.vn"
  });

  const handleChange = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <section className="page">
      <div>
        <div className="section-title">TÀI KHOẢN</div>
        <p className="section-sub">Thông tin đăng nhập hiển thị ở sidebar sẽ lấy từ đây.</p>
      </div>
      <div className="panel-box pixel-corners-sm" style={{ maxWidth: 420 }}>
        <div className="form-row">
          <label>Họ tên</label>
          <input value={form.name} onChange={handleChange("name")} />
        </div>
        <div className="form-row">
          <label>Vai trò</label>
          <input value={form.role} onChange={handleChange("role")} />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input value={form.email} onChange={handleChange("email")} />
        </div>
        <button className="btn-primary">LƯU THAY ĐỔI</button>
      </div>
    </section>
  );
}
