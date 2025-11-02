# backend/main.py
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import time
import random
import re

app = FastAPI()

# ----------------- Định nghĩa cấu trúc dữ liệu trả về (theo Frontend) -----------------
# Frontend của bạn cần định dạng này: type Highlight = { start: number; end: number; weight?: number };
class Highlight(BaseModel):
    start: int
    end: int
    weight: float = 1.0

# Frontend cần: type TopK = { label: string; score: number };
class TopK(BaseModel):
    label: str
    score: float

# Định nghĩa dữ liệu đầu vào
class TextInput(BaseModel):
    text: str = Field(min_length=1)

# Định nghĩa dữ liệu đầu ra cho phân tích SINGLE
class TextResult(BaseModel):
    label: str
    polarity: float
    topK: List[TopK]
    latency: int  # ms
    input: str
    highlights: List[Highlight] = Field(default_factory=list)

# Định nghĩa dữ liệu đầu ra cho phân tích BATCH
class BatchResult(BaseModel):
    batch_results: List[Dict[str, Any]] # Sẽ chứa list các BatchRow (text, label, polarity, confidence)
    latency: int

# ----------------- Mô hình Phân tích Giả lập (Mock ML Logic) -----------------
def get_mock_sentiment(text: str) -> TextResult:
    """Mô phỏng việc chạy mô hình ML và trả về kết quả."""
    start_time = time.time()
    
    # Logic giả lập:
    text_len = len(text)
    
    # 1. Polarity & Label
    polarity = random.uniform(-0.8, 0.8)
    if text_len < 30:
        # Nếu văn bản ngắn, xác suất trung tính cao hơn
        polarity = random.uniform(-0.3, 0.3)
    
    label = "Positive" if polarity > 0.1 else "Negative" if polarity < -0.1 else "Neutral"
    
    # 2. Confidence & TopK
    confidence_score = random.uniform(0.65, 0.95)
    topK = [
        TopK(label=label, score=confidence_score),
        TopK(label="Neutral" if label != "Neutral" else "Positive", score=random.uniform(0.05, 0.2)),
        TopK(label="Negative" if label != "Negative" else "Neutral", score=1 - confidence_score)
    ]
    
    # 3. Highlights (tìm kiếm từ khóa đơn giản)
    highlights: List[Highlight] = []
    if label == "Positive":
        keywords = ["tuyệt", "thân thiện", "sẽ quay lại", "hài lòng"]
        for keyword in keywords:
            for match in re.finditer(keyword, text.lower()):
                highlights.append(Highlight(start=match.start(), end=match.end(), weight=random.uniform(0.5, 0.9)))

    # 4. Latency
    time.sleep(random.uniform(0.1, 0.5)) # Mô phỏng độ trễ ML
    latency = int((time.time() - start_time) * 1000)

    return TextResult(
        label=label,
        polarity=polarity,
        topK=topK[:3],
        latency=latency,
        input=text,
        highlights=highlights
    )

# ----------------- Định nghĩa Endpoints -----------------

@app.post("/analyze/text/single", response_model=TextResult)
def analyze_single_text(data: TextInput):
    """Xử lý phân tích cảm xúc cho một đoạn văn bản duy nhất."""
    # Logic thực tế: Tải mô hình HuggingFace/PyTorch/etc., chạy Inference
    return get_mock_sentiment(data.text)

@app.post("/analyze/text/batch", response_model=BatchResult)
def analyze_batch_text(data: TextInput):
    """Xử lý phân tích cảm xúc hàng loạt theo dòng."""
    start_time = time.time()
    
    lines = [s.strip() for s in data.text.split('\n') if s.strip()]
    
    batch_results = []
    ts = int(time.time() * 1000)

    # Trong thực tế, bạn sẽ dùng batch processing (xử lý hàng loạt) để nhanh hơn
    for i, line in enumerate(lines):
        if not line: continue
        
        # Chạy mô hình cho từng dòng
        result = get_mock_sentiment(line)
        
        # Tạo format BatchRow mà Frontend cần (có ID, ts)
        batch_results.append({
            "id": f"{ts}-{i}", 
            "ts": ts, 
            "text": line, 
            "label": result.label, 
            "polarity": result.polarity, 
            "confidence": result.topK[0].score # Lấy confidence của nhãn cao nhất
        })

    latency = int((time.time() - start_time) * 1000)
    return BatchResult(batch_results=batch_results, latency=latency)

# ----------------- Chạy Server -----------------
# Sau khi lưu, chạy lệnh này trong terminal của thư mục backend:
# uvicorn main:app --reload --host 0.0.0.0 --port 8000