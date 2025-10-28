🧠 Emotion AI Analyzer
🎯 Mục tiêu dự án

Emotion AI Analyzer là một ứng dụng phân tích cảm xúc đa phương thức (multimodal sentiment analysis) kết hợp văn bản, âm thanh, và hình ảnh/video.
Mục tiêu của hệ thống là xác định trạng thái cảm xúc tổng thể của người dùng hoặc nội dung, hỗ trợ nghiên cứu và ứng dụng AI trong các lĩnh vực như tâm lý học, dịch vụ khách hàng, và giao tiếp người–máy.


⚙️ Chức năng chính
1. 📝 Text Sentiment Analysis

Người dùng nhập văn bản (bình luận, tin nhắn, đoạn review, email, v.v.).

Hệ thống phân tích nội dung ngôn ngữ và trả về:

positive – tích cực

negative – tiêu cực

neutral – trung tính

Kèm theo điểm tin cậy (score) từ 0 đến 1 thể hiện mức độ chắc chắn của mô hình.

Ví dụ:

Input: "Tôi rất hài lòng với chất lượng dịch vụ!"
Output: { label: "positive", score: 0.93 }


2. 🔊 Audio Sentiment Analysis

Cho phép người dùng tải file âm thanh (.wav, .mp3).

Quy trình:

Transcribe – chuyển giọng nói thành văn bản (ở bản demo có thể mock dữ liệu).

Phân tích văn bản thu được bằng mô hình Text Sentiment.

Kết quả: positive, negative, hoặc neutral.

Ví dụ:

File: happy_voice.wav → Transcribed: “Thật tuyệt vời hôm nay!”  
Output: positive


3. 👁️ Vision Sentiment Analysis

Phân tích hình ảnh hoặc video có khuôn mặt người để nhận diện cảm xúc.

Hệ thống phát hiện khuôn mặt và gán nhãn cảm xúc dựa trên biểu cảm khuôn mặt:

happy (vui vẻ)

sad (buồn)

angry (giận dữ)

surprised (ngạc nhiên)

neutral (bình thường)

(mở rộng: fear, disgust, contempt nếu có dữ liệu huấn luyện thêm)

Có thể hiển thị bounding box quanh khuôn mặt và hiển thị nhãn cảm xúc.

Ví dụ:

Ảnh đầu vào: face_smiling.jpg  
Kết quả: happy (0.87)


4. ⚖️ Fused Model – Hợp nhất cảm xúc đa phương thức

Kết hợp kết quả từ 3 mô hình:

Text Sentiment

Audio Sentiment

Vision Sentiment

Tính toán final sentiment (cảm xúc tổng hợp).

Quy tắc ví dụ:

Nếu ít nhất 2/3 mô hình cùng nhãn → final sentiment = nhãn đó.

Nếu kết quả khác nhau → chọn nhãn có confidence cao nhất.

Ví dụ:

Text: neutral  
Audio: positive  
Vision: happy  
→ Final Sentiment: positive






🧭 Cấu trúc trang / menu chính của ứng dụng
🏠 Home

Giới thiệu tổng quan về ứng dụng Emotion AI Analyzer.

Có banner chính và sidebar chứa các bài viết gần đây:

Golang là gì?

Nguồn server (PSU) là gì?

Access Point là gì?

VS Code là gì? Ưu nhược điểm và lệnh cơ bản.




📊 Dashboard

Hiển thị tổng quan kết quả gần đây từ các mô-đun sentiment.

Có biểu đồ, tỷ lệ cảm xúc, và thống kê người dùng.




✍️ Text Sentiment

Giao diện gồm một textarea và nút Phân tích.

Kết quả hiển thị:

Label cảm xúc (positive/negative/neutral)

Score tin cậy (confidence)




🎤 Audio Sentiment

Cho phép người dùng tải file .wav hoặc .mp3.

Hiển thị quá trình xử lý và kết quả phân tích cảm xúc từ giọng nói.




🎥 Vision Sentiment

Cho phép tải ảnh hoặc video.

Preview hiển thị bounding box quanh khuôn mặt và nhãn cảm xúc.




💬 Hướng dẫn phản hồi của Chatbot
Khi người dùng hỏi:

“Web có các sentiment nào?”
→ Chatbot nên trả lời:

Với văn bản: positive, negative, neutral.  
Với hình ảnh/video: happy, sad, angry, surprised, neutral (và có thể thêm fear, disgust nếu được mở rộng).

Khi người dùng hỏi:

“Audio sentiment hoạt động thế nào?”
→ Chatbot nên trả lời:

Audio sentiment sẽ chuyển âm thanh thành văn bản (transcribe),  
sau đó phân tích cảm xúc giống như mô hình Text Sentiment.

Khi người dùng hỏi ngoài phạm vi KB

→ Chatbot nên trả lời ngắn gọn, lịch sự:

Mình chưa có dữ liệu để trả lời câu này trong hệ thống.





📂 Cấu trúc kỹ thuật (backend & frontend)
Backend (Node.js + Express)

Cổng mặc định: 5174

Thư mục kb/ chứa dữ liệu dự án (Knowledge Base)

Endpoint:

GET /health → kiểm tra trạng thái server

POST /api/chat → chatbot trả lời dựa trên KB

POST /admin/reload-kb → reload dữ liệu KB

Tích hợp Google Generative AI (Gemini) để trả lời tự nhiên hơn.

Bảo mật bằng header x-chat-secret (giá trị lưu trong .env).

Frontend (React + TypeScript + Vite)

Component chính: ChatWidget.tsx

Kết nối API qua biến môi trường:

VITE_CHAT_API=http://localhost:5174
VITE_CHAT_SHARED_SECRET=abc123


Lưu lịch sử hội thoại vào localStorage.

Giao diện tối (dark mode) với hiệu ứng cuộn mượt, hiển thị loading spinner.






🧩 Hướng phát triển tương lai

Real-time emotion detection qua webcam.

Tối ưu mô hình hợp nhất đa phương thức (Fusion Model).

Dashboard nâng cao: lọc, thống kê, biểu đồ timeline.

API mở để tích hợp với ứng dụng khác (REST hoặc WebSocket).

Chức năng “Emotion Trend Over Time” — theo dõi cảm xúc người dùng theo thời gian.




🧱 Nguyên tắc chatbot phải tuân thủ

Trả lời ngắn gọn, dễ hiểu, đúng phạm vi KB.

Nếu không có dữ liệu, không đoán, không bịa.

Có thể thêm emoji nhẹ nhàng để thân thiện (😊, 😅...).