# NGƯỜI YÊU AI

AI companion một nhân vật cố định, có Character DNA, Relationship DNA, Roleplay và Long-term Memory.

## V1 hiện tại
- Một nhân vật duy nhất, thiết lập một lần.
- Mối quan hệ ban đầu: mới làm quen / đang tìm hiểu / người yêu / vợ-chồng.
- Character DNA: khuôn mặt, tóc, vóc dáng, phong cách, giọng nói, tính cách, cách nói.
- Roleplay: lời thoại + hành động + biểu cảm.
- Automatic Memory Engine bản trình duyệt: nhận diện một số thông tin đáng nhớ và lưu localStorage.
- Trang “Ký ức của em” để xem/xóa.
- Lưu hội thoại và hồ sơ trên thiết bị.
- Responsive mobile.
- GitHub Pages workflow.

## V2 để thành AI thật
GitHub Pages → API backend → LLM → Memory Extractor → Database/Vector Store.

Backend cần:
1. /chat: nhận message + Character DNA + Relationship State + memories liên quan.
2. Memory extractor: type, importance, timestamp, confidence.
3. Memory retrieval: semantic search + recent conversation.
4. Memory updater: merge/supersede memory cũ.
5. Streaming response.
6. Authentication để đồng bộ nhiều thiết bị.

**Không đưa API key AI vào JavaScript frontend.**
