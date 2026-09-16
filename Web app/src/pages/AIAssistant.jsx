import { useState } from "react";

export default function AIAssistant() {
  const [input, setInput] = useState("");

  return (
    <section className="page">
      <div>
        <div className="section-title">TRỢ LÝ AI (PLACEHOLDER)</div>
        <p className="section-sub">Khu vực này dành để tích hợp mô hình đánh giá / tư vấn chất lượng nước sau này.</p>
      </div>
      <div className="ai-box" style={{ maxWidth: 640 }}>
        <div className="ai-msg">Xin chào, tôi có thể tóm tắt tình trạng ao và gợi ý hành động khi có dữ liệu thật.</div>
        <div className="ai-note">* Hiện là giao diện mẫu — chưa gọi API mô hình.</div>
        <div className="ai-input-row">
          <input
            type="text"
            placeholder="Hỏi trợ lý AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={() => setInput("")}>GỬI</button>
        </div>
      </div>
    </section>
  );
}
