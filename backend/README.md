# Specter Vision Backend

黑科技影像分析 API - 啟發式動態發現引擎

## 部署到 Render

1. 連接此 Git 倉庫
2. 選擇 `backend` 目錄作為根目錄
3. 設定環境變數:
   - `GOOGLE_API_KEY`: 您的 Gemini API Key
   - `GEMINI_MODEL`: `gemini-2.5-flash`

## 本地開發

```bash
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## API 端點

- `GET /` - 健康檢查
- `POST /analyze` - 同步分析
- `POST /analyze/stream` - SSE 串流分析
- `POST /upload` - 圖片上傳
