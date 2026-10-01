# NGƯỜI YÊU AI 🇻🇳

AI companion thuần Việt, chạy ưu tiên trực tiếp trên GitHub Pages: một nhân vật cố định, Character DNA bất biến, ký ức dài hạn, cảm xúc, quan hệ và giọng nói tiếng Việt.

## Mục tiêu

**Một cô ấy — một Character DNA — một dòng ký ức — một quan hệ liên tục.**

Ốc chỉ cần mở website, tạo hồ sơ cô ấy một lần rồi bắt đầu trò chuyện.

## Phiên bản GitHub Free

Runtime chính không phụ thuộc server riêng:

- GitHub Pages: hosting miễn phí.
- HTML/CSS/JavaScript: toàn bộ giao diện và logic.
- localStorage: hồ sơ, ký ức, cảm xúc và cài đặt trên thiết bị.
- Web Speech API: đọc câu trả lời bằng giọng tiếng Việt của trình duyệt.
- AI Brain cục bộ: **tùy chọn**, chỉ tải khi người dùng bấm khởi động.
- Không cần Cloudflare Worker, D1, server riêng hoặc API key.
- Không tự động tải model ~500 MB khi mở website.
- Nếu chưa bật AI Brain, website vẫn trò chuyện ngay bằng chế độ phản hồi nhẹ.

## Character DNA

Hồ sơ cô ấy được khai báo một lần gồm:

- Tên, tuổi, ngày sinh, quê quán, nghề nghiệp, học vấn.
- Gia đình, giá trị sống, ước mơ, nỗi sợ, nguyên tắc.
- Khuôn mặt, tóc, vóc dáng, phong cách, trang phục.
- Tính cách, cách suy nghĩ, cách quan tâm, cách làm hòa.
- Sở thích, đồ ăn, âm nhạc, phim, hoạt động và thói quen.
- Giọng nói, vùng miền, cách xưng hô.
- Quan hệ ban đầu: Bạn bè, Bạn thân, Mới làm quen, Đang tìm hiểu, Người yêu, Vợ/chồng, Bạn đồng hành hoặc Tùy chỉnh.

Sau khi bấm **Lưu hồ sơ**, Character DNA được khóa. Memory chỉ được bổ sung trải nghiệm và không được tự ý sửa ngoại hình, tính cách hay quá khứ đã khai báo.

## Hồ sơ của Ốc

Phần người dùng được giữ gọn:

- Tên
- Tuổi
- Tính cách
- Chiều cao
- Cân nặng
- Tài sản / điều kiện tài chính
- Công việc
- Sở thích

## Memory Engine

Hệ thống ghi nhớ có chọn lọc thay vì lưu mọi câu nói:

- profile
- preference
- episode
- relationship
- important

Ốc có thể mở **🧠 Ký ức của em** để xem và xóa từng ký ức.

## Emotion Engine

Mô phỏng:

- đói
- mệt
- sức khỏe
- năng lượng
- tâm trạng
- tình cảm
- tin tưởng
- ghen
- mong muốn
- sức hút

Các trạng thái thay đổi theo cuộc trò chuyện nhưng không làm thay đổi Character DNA.

## AI Brain tùy chọn

Model mặc định:

`onnx-community/Qwen2.5-0.5B-Instruct`

Transformers.js chạy model trực tiếp trong trình duyệt, ưu tiên WebGPU và tự chuyển sang WASM nếu cần.

**Quan trọng:** website không tải model khi mở lần đầu. Muốn dùng AI Brain mạnh hơn, vào **⚙ Hệ thống AI → 🚀 Khởi động AI Brain**.

Model được cache trên thiết bị sau lần tải đầu tiên.

## Voice

Giọng nói hiện dùng Web Speech API với `vi-VN`. Đây là giọng tổng hợp của thiết bị/trình duyệt, không clone giọng người thật.

## GitHub Pages

Repository:

https://github.com/hoanggiaktsda-beep/Nguoi-yeu-ai

Website dự kiến:

https://hoanggiaktsda-beep.github.io/Nguoi-yeu-ai/

Nếu GitHub Pages chưa tự triển khai, vào:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

Sau đó vào **Actions → Deploy to GitHub Pages** để chạy workflow.

## Quyền riêng tư

Dữ liệu cá nhân hiện được lưu cục bộ trên thiết bị bằng localStorage. Ảnh đại diện và ảnh nền cũng lưu cục bộ.

Backend trong thư mục `api/` chỉ là phần tham khảo/phát triển tương lai và **không phải dependency của runtime GitHub Pages hiện tại**.

## Nguyên tắc

**Một cô ấy. Một DNA bất biến. Một dòng ký ức. Một mối quan hệ liên tục. Và một thế giới riêng chỉ lớn dần theo thời gian.**
