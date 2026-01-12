# Specter Vision - 動態影像偵測 Web App

> **版本**: v1.0.0 | **建立日期**: 2026-01-12
> **核心理念**: 啟發式動態發現 (Heuristic Discovery)

---

## 🎯 專案概述

Specter Vision 是一個「黑科技」影像分析 Web App，採用 Gemini API 的多模態能力，
實現「軟編碼」分析邏輯 —— AI 根據圖像的資訊熵自動定義 3-5 個「隱性屬性」。

### 核心技術規格

| 層級 | 技術 | 用途 |
|------|------|------|
| 後端 API | FastAPI + Python 3.11 | 影像分析 API |
| AI 引擎 | Google Gemini 2.5 Flash | 多模態視覺分析 |
| 前端 UI | Next.js 15 + TypeScript | 賽博龐克儀表板 |
| 通訊協議 | SSE (Server-Sent Events) | 動態終端機流 |

---

## 📁 目錄結構

```
specter-vision/
├── backend/                    # FastAPI 後端
│   ├── app/
│   │   ├── main.py            # FastAPI 入口
│   │   ├── config.py          # 環境變數配置
│   │   ├── prompts/
│   │   │   └── heuristic.py   # 啟發式 Prompt 引擎
│   │   ├── services/
│   │   │   └── gemini.py      # Gemini API 服務
│   │   └── types/
│   │       └── schemas.py     # Pydantic 型別定義
│   └── requirements.txt
├── frontend/                   # Next.js 前端
│   ├── src/
│   │   ├── app/               # App Router 頁面
│   │   ├── components/        # React 組件
│   │   ├── hooks/             # 自定義 Hooks
│   │   └── types/             # TypeScript 型別
│   └── package.json
└── ARCHITECTURE.md
```

---

## 🔐 安全規範

1. **API Key 保護**: 僅存於後端 `.env`，禁止前端暴露
2. **輸入驗證**: 限制上傳檔案類型（PNG/JPEG/WEBP）、大小上限 5MB
3. **請求節流**: 實作 Rate Limiting 防止濫用
4. **CORS 配置**: 明確列出允許的來源

---

## 🎨 設計系統 (Cyberpunk)

- **主色調**: 霓虹青 (#00f5ff)、洋紅 (#ff00ff)、紫 (#8b5cf6)
- **背景**: 深黑 (#0a0a0f)
- **字體**: Roboto Mono (等寬)
- **特效**: 霓虹光暈、終端機掃描動畫、Canvas 疊加

---

## 🔄 開發規則

- 單一檔案 ≤ 200 行
- 所有外部 API 調用必須包含 try/catch
- 使用 Result Pattern 處理錯誤
- 禁止使用 `any` 類型
