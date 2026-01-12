# Specter Vision - 全局專案地圖

> **最後更新**: 2026-01-12T14:25
> **版本**: v1.0.0

---

## 🎯 核心願景 (Core Vision)

> **一句話定義**：透過 AI 的「超感官視角」，揭露人類認知盲區中的隱性視覺維度。

Specter Vision 是一個「黑科技」影像分析系統，採用**啟發式動態發現（Heuristic Discovery）**技術，
讓 AI 根據圖像的資訊熵自動定義 3-5 個「隱性屬性」——而非使用固定的 JSON Schema。

---

## 🏗️ 架構拓撲 (Architecture Topology)

```mermaid
graph TB
    subgraph Frontend["前端 (Next.js 15)"]
        UI[賽博龐克 UI]
        Upload[ImageUploader]
        Terminal[TerminalStream]
        Canvas[CanvasOverlay]
        Cards[AttributeCard]
        Hook[useAnalysis Hook]
    end
    
    subgraph Backend["後端 (FastAPI)"]
        API[/analyze/stream]
        Gemini[GeminiService]
        Prompt[Heuristic Prompt 引擎]
    end
    
    subgraph External["外部服務"]
        GeminiAPI[Gemini 2.5 Flash API]
    end
    
    UI --> Upload
    Upload --> Hook
    Hook -->|SSE POST| API
    API --> Gemini
    Gemini --> Prompt
    Gemini -->|Base64 Image| GeminiAPI
    GeminiAPI -->|JSON Response| Gemini
    API -->|SSE Stream| Hook
    Hook --> Terminal
    Hook --> Cards
    Hook --> Canvas
```

---

## 📁 模組狀態 (Module Status)

| 模組 | 路徑 | 狀態 | 行數 | 說明 |
|------|------|------|------|------|
| **後端主入口** | `backend/app/main.py` | ✅ Stable | 134 | FastAPI 端點 |
| **Gemini 服務** | `backend/app/services/gemini.py` | ✅ Stable | 195 | 多模態 API 整合 |
| **啟發式引擎** | `backend/app/prompts/heuristic.py` | ✅ Stable | 77 | 軟編碼 Prompt |
| **型別定義** | `backend/app/types/schemas.py` | ✅ Stable | 79 | Pydantic Models |
| **前端主頁** | `frontend/src/app/page.tsx` | ✅ Stable | 176 | 儀表板組裝 |
| **圖片上傳** | `frontend/src/components/ImageUploader.tsx` | ✅ Stable | 134 | 拖放/點擊上傳 |
| **終端機流** | `frontend/src/components/TerminalStream.tsx` | ✅ Stable | 106 | 矩陣式輸出 |
| **Canvas 疊加** | `frontend/src/components/CanvasOverlay.tsx` | ✅ Stable | 156 | HUD 視覺標記 |
| **屬性卡片** | `frontend/src/components/AttributeCard.tsx` | ✅ Stable | 92 | 震撼值顯示 |
| **分析 Hook** | `frontend/src/hooks/useAnalysis.ts` | ✅ Stable | 162 | SSE 狀態管理 |
| **設計系統** | `frontend/src/app/globals.css` | ✅ Stable | 269 | 賽博龐克 CSS |

---

## 🔧 技術棧 (Tech Stack)

| 層級 | 技術 | 版本 |
|------|------|------|
| 後端框架 | FastAPI | 0.115+ |
| AI 引擎 | Google Gemini | 2.5 Flash |
| 前端框架 | Next.js | 16.1.1 |
| 通訊協議 | SSE | - |
| 樣式系統 | Tailwind CSS + CSS Variables | - |

---

## 📊 數據流 (Data Flow)

1. **用戶上傳圖片** → ImageUploader → Base64 編碼
2. **發起 SSE 請求** → useAnalysis → POST /analyze/stream
3. **後端處理** → GeminiService → 建構多模態請求
4. **AI 分析** → Gemini API → 啟發式 Prompt 執行
5. **串流回應** → SSE Events → 逐一推送屬性
6. **前端渲染** → TerminalStream + AttributeCard + CanvasOverlay

---

## ⚠️ 已知限制

- Gemini API 有 Rate Limit（免費層：5 RPM）
- `.env` 中的 API Key 需手動設定
- 前後端分離，部署需分開處理
