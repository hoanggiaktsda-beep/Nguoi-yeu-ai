# NGƯỜI YÊU AI 🇻🇳

AI companion **thuần Việt**: một nhân vật cố định, Character DNA, Relationship DNA, ký ức dài hạn, trạng thái mô phỏng, Social Life và nền tảng AI voice.

## Đã tích hợp

- Mobile riêng cho điện thoại và layout 3 cột cho PC.
- Logo chung `logo.svg`.
- Character DNA: lý lịch, quê quán, nghề nghiệp, học vấn, khuôn mặt, tóc, vóc dáng, phong cách, Voice DNA, tính cách, giá trị và sở thích.
- Relationship Stage: mới làm quen / đang tìm hiểu / người yêu / vợ-chồng.
- Relationship & Intimacy DNA: lãng mạn, flirty, âu yếm, táo bạo, tinh nghịch, đam mê, ngại ngùng, chủ động, riêng tư.
- Phần intimacy chỉ điều chỉnh biểu đạt tình cảm trưởng thành; hệ thống không tạo nội dung tình dục đồ họa.
- Vietnamese-first: tiếng Việt mặc định, vùng giọng Bắc/Trung/Nam, xưng hô theo quan hệ.
- Emotion Engine: đói, mệt, sức khỏe, mong muốn, sức hút, ghen, tâm trạng, năng lượng, tình cảm, tin tưởng.
- Memory Engine: profile / preference / episode / relationship / important; có thể xóa.
- Social Life Engine: Trend Scanner + Social Memory + Personal Interest; hiện fallback mô phỏng ở frontend, backend đã có bảng và API trend Việt Nam.
- Character Brain: server kết hợp Character DNA + Relationship + Emotion + Memory + Social context.
- AI Voice DNA: chỉ định hướng AI voice; không nhận/clone giọng người thật.
- Avatar và ảnh nền lưu cục bộ trên thiết bị.
- Không đặt secret/API key trong GitHub Pages.

## Kiến trúc hiện tại

GitHub Pages → JavaScript trên trình duyệt → Local AI Brain → bộ nhớ/cảm xúc cục bộ.

Local AI Brain dùng Transformers.js để chạy model ONNX trực tiếp trong trình duyệt; WebGPU được ưu tiên khi thiết bị hỗ trợ, nếu không thì dùng WASM. Transformers.js hỗ trợ chạy model ngay trong browser mà không cần server. citeturn0search3turn0search0

## Chạy hoàn toàn trên GitHub Pages

Phiên bản runtime hiện tại được thiết kế để chạy trực tiếp trên GitHub Pages:
- Không cần Cloudflare Worker.
- Không cần D1.
- Không cần server riêng.
- Character DNA, Relationship DNA, Emotion Engine, Memory và Social World chạy phía trình duyệt.
- Dữ liệu cá nhân lưu trên thiết bị bằng localStorage/IndexedDB.
- Voice sử dụng Web Speech API với ngôn ngữ `vi-VN`.
- Không đặt API key bí mật trong repository.

Bật website tại GitHub → Settings → Pages → Deploy from branch → `main` → `/ (root)`.

`API_BASE` được giữ trống để website không phụ thuộc backend bên ngoài.

`api/` được giữ như mã tham khảo/phát triển tương lai, không phải dependency runtime của GitHub Pages.
## Social API Gateway (legacy / không phải runtime)

Backend có:

`GET /api/social/trends`

Schema chuẩn hóa:

`id, source, title, url, category, region=VN, language=vi, score, published_at, fetched_at, summary, tags`

Collector thật cho TikTok / YouTube / Instagram / Facebook / Google Trends cần được cấu hình bằng API/quyền truy cập hợp lệ. Không scrape private feed và không coi dữ liệu mô phỏng là trend thật.

## Local AI Brain

Model mặc định: `onnx-community/Qwen2.5-0.5B-Instruct`. Model có bản ONNX quantized và hỗ trợ Transformers.js text generation; bản `q4f16` hiện khoảng 483 MB. citeturn1search1turn1search7

Lần đầu người dùng bấm **Khởi động AI Brain**, trình duyệt tải model và lưu cache trên thiết bị. Các lượt chat sau có thể tái sử dụng cache. Đây là model chạy phía client, không phải API inference có khóa bí mật.

WebGPU không có trên mọi trình duyệt/thiết bị; hệ thống tự chuyển sang WASM khi không có WebGPU. citeturn0search0

## Voice

Voice DNA dùng AI voice theo nguyên tắc không clone giọng người thật. Phát giọng tiếng Việt hiện dùng Web Speech API `vi-VN` của trình duyệt.

## Privacy

Đây hiện là personal app. Trước khi mở rộng nhiều người dùng cần thêm authentication, rate limiting, abuse protection, data export/delete, kiểm soát CORS và chính sách lưu dữ liệu.

## Nguyên tắc sản phẩm

**Một cô ấy — một Character DNA — một dòng ký ức — một quan hệ liên tục — một thế giới sống bên ngoài cuộc trò chuyện.**
