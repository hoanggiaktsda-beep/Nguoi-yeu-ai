# NGƯỜI YÊU AI

V2: một AI companion cố định, có Character DNA, Relationship DNA, roleplay và long-term memory.

## Kiến trúc
- Giao diện + mã nguồn: GitHub Pages.
- API AI: Cloudflare Worker.
- Model: Cloudflare Workers AI.
- Bộ nhớ dài hạn: Cloudflare D1.
- Khi chưa cấu hình API, website vẫn chạy chế độ local.

GitHub Pages là hosting tĩnh, nên không thể tự chạy backend/AI server. Public repo trên GitHub Free có thể dùng GitHub Pages.

## Đã nâng cấp
- Character DNA mở rộng: background, face, hair, body, style, voice, personality, signature.
- Mối quan hệ ban đầu: mới làm quen / đang tìm hiểu / người yêu / vợ-chồng.
- Chat gọi API thật khi API_BASE được cấu hình.
- Session ID riêng để tách bộ nhớ.
- Server lưu messages + memories.
- AI tự trích xuất ký ức quan trọng và cập nhật ký ức cũ.
- Có API health, memories GET/DELETE.
- Không đặt AI secret trong frontend.

## Kích hoạt backend miễn phí
1. Tạo tài khoản Cloudflare.
2. Tạo Workers AI và D1 database tên nguoi-yeu-ai.
3. Chạy api/schema.sql trên D1.
4. Sửa api/wrangler.toml, thay REPLACE_WITH_D1_ID.
5. Trong thư mục api chạy: npx wrangler login và npx wrangler deploy.
6. Lấy URL Worker dạng https://ten-worker.ten-subdomain.workers.dev.
7. Mở app.js và đặt const API_BASE = URL Worker.
8. Commit lên main. GitHub Actions sẽ triển khai lại Pages.

Workers AI hiện có free allocation theo ngày; D1 cũng có free plan nhưng có giới hạn sử dụng. Đây là hạn mức của Cloudflare và có thể thay đổi.

## Lưu ý
Phiên bản này là prototype/personal app. Chưa có đăng nhập OAuth, thanh toán, moderation production hay bảo vệ abuse ở cấp hệ thống. Không đặt secret trong GitHub Pages.