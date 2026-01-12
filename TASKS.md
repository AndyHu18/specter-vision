# Specter Vision - 任務追蹤

> **最後更新**: 2026-01-12T12:45

---

## 第一階段：後端 API 層 ✅

- [x] 1.1 建立 FastAPI 專案結構
- [x] 1.2 實作 config.py 環境變數管理
- [x] 1.3 實作 schemas.py 型別定義
- [x] 1.4 實作 heuristic.py 啟發式 Prompt 模板
- [x] 1.5 實作 gemini.py Gemini API 服務
- [x] 1.6 實作 main.py API 端點
- [x] 1.7 建立 requirements.txt

## 第二階段：前端 UI 層 ✅

- [x] 2.1 初始化 Next.js 專案
- [x] 2.2 實作 globals.css 賽博龐克設計
- [x] 2.3 實作 ImageUploader 組件
- [x] 2.4 實作 TerminalStream 組件
- [x] 2.5 實作 CanvasOverlay 組件
- [x] 2.6 實作 AttributeCard 組件
- [x] 2.7 實作 useAnalysis Hook
- [x] 2.8 組裝主頁面

## 第三階段：整合與驗證

- [ ] 3.1 設定 API Key 與啟動後端
- [ ] 3.2 啟動前端開發伺服器
- [ ] 3.3 端對端功能測試
- [ ] 3.4 瀏覽器視覺驗證

---

## 🚀 啟動指南

### 後端啟動
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env
# 編輯 .env 填入 GOOGLE_API_KEY
python -m uvicorn app.main:app --reload
```

### 前端啟動
```bash
cd frontend
npm run dev
```

### 訪問
- 前端: http://localhost:3000
- API 文檔: http://localhost:8000/docs
