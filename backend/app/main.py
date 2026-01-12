"""
@file    : main.py
@purpose : FastAPI 主入口 - API 端點定義
@depends : ['config.py', 'services/gemini.py', 'types/schemas.py']
@usedBy  : []
"""

import json
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse

from app.config import settings
from app.services.gemini import get_gemini_service
from app.types.schemas import UploadRequest, AnalysisResult, AnalysisError


@asynccontextmanager
async def lifespan(app: FastAPI):
    """應用程式生命週期管理"""
    # 啟動時驗證設定
    print("📍[Main] 啟動 Specter Vision API...")
    try:
        settings.validate()
        # 預初始化 Gemini 服務
        get_gemini_service()
        print("📍[Main] ✅ 服務初始化完成")
    except ValueError as e:
        print(f"📍[Main] ❌ 設定驗證失敗: {e}")
    yield
    print("📍[Main] 關閉服務...")


# 建立 FastAPI 應用
app = FastAPI(
    title="Specter Vision API",
    description="黑科技影像分析 - 啟發式動態發現引擎",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """健康檢查端點"""
    return {
        "name": "Specter Vision API",
        "status": "operational",
        "model": settings.GEMINI_MODEL
    }


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_image(request: UploadRequest):
    """
    分析圖像（同步模式）
    
    接收 Base64 編碼的圖片，返回完整分析結果
    """
    try:
        service = get_gemini_service()
        result = await service.analyze_image(
            image_base64=request.image_base64,
            mime_type=request.mime_type
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"📍[API] 分析錯誤: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"分析失敗: {str(e)}")


@app.post("/analyze/stream")
async def analyze_image_stream(request: UploadRequest):
    """
    分析圖像（串流模式）
    
    使用 SSE 即時推送分析進度和結果
    """
    async def event_generator():
        service = get_gemini_service()
        async for chunk in service.analyze_image_stream(
            image_base64=request.image_base64,
            mime_type=request.mime_type
        ):
            yield {
                "event": chunk["type"],
                "data": json.dumps(chunk["data"], ensure_ascii=False)
            }
    
    return EventSourceResponse(event_generator())


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    上傳圖片檔案
    
    接收檔案上傳，驗證後返回 Base64 編碼
    """
    # 驗證檔案類型
    if file.content_type not in [
        "image/png", "image/jpeg", "image/jpg", "image/webp"
    ]:
        raise HTTPException(
            status_code=400,
            detail=f"不支援的檔案類型: {file.content_type}"
        )
    
    # 驗證檔案大小
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"檔案過大: {size_mb:.2f}MB > {settings.MAX_FILE_SIZE_MB}MB"
        )
    
    # 編碼為 Base64
    import base64
    base64_data = base64.b64encode(contents).decode("utf-8")
    
    return {
        "success": True,
        "filename": file.filename,
        "mime_type": file.content_type,
        "size_mb": round(size_mb, 2),
        "base64": base64_data
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
