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

## Kiến trúc

GitHub Pages → Cloudflare Worker → Workers AI → D1.

Cloudflare Workers AI hiện hỗ trợ chạy model serverless trên hạ tầng Cloudflare; D1 là database serverless có thể bind trực tiếp vào Worker.

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
## Social API Gateway

Backend có:

`GET /api/social/trends`

Schema chuẩn hóa:

`id, source, title, url, category, region=VN, language=vi, score, published_at, fetched_at, summary, tags`

Collector thật cho TikTok / YouTube / Instagram / Facebook / Google Trends cần được cấu hình bằng API/quyền truy cập hợp lệ. Không scrape private feed và không coi dữ liệu mô phỏng là trend thật.

## Voice

Voice DNA đã được đặt theo nguyên tắc **AI voice only**. TTS adapter nên được nối ở Worker sau khi chọn provider/model phù hợp và kiểm tra free tier tại thời điểm triển khai. Không lưu hoặc clone giọng người thật.

## Privacy

Đây hiện là personal app. Trước khi mở rộng nhiều người dùng cần thêm authentication, rate limiting, abuse protection, data export/delete, kiểm soát CORS và chính sách lưu dữ liệu.

## Nguyên tắc sản phẩm

**Một cô ấy — một Character DNA — một dòng ký ức — một quan hệ liên tục — một thế giới sống bên ngoài cuộc trò chuyện.**
