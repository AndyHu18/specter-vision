"""
@file    : schemas.py
@purpose : Pydantic 型別定義 - 動態屬性結構
@depends : []
@usedBy  : ['services/gemini.py', 'main.py']
"""

from pydantic import BaseModel, Field
from typing import Optional


class DynamicAttribute(BaseModel):
    """AI 自主發現的動態屬性"""
    
    attribute_name: str = Field(
        ...,
        description="AI 自主命名的屬性名稱，如「亞像素級光源不一致性」"
    )
    detection_logic: str = Field(
        ...,
        description="解釋 AI 如何發現這個細節"
    )
    black_tech_insight: str = Field(
        ...,
        description="這個細節背後揭露的驚人事實或數據推論"
    )
    shock_value: int = Field(
        ...,
        ge=1,
        le=10,
        description="震撼程度評分 (1-10)"
    )
    coordinates: Optional[dict] = Field(
        default=None,
        description="可選的圖像座標區域，用於 Canvas 疊加"
    )


class AnalysisResult(BaseModel):
    """完整的分析結果"""
    
    success: bool = Field(default=True)
    image_summary: str = Field(
        ...,
        description="圖像的整體描述"
    )
    attributes: list[DynamicAttribute] = Field(
        ...,
        description="AI 發現的 3-5 個動態屬性"
    )
    processing_time_ms: Optional[float] = Field(
        default=None,
        description="處理時間（毫秒）"
    )


class AnalysisError(BaseModel):
    """分析錯誤"""
    
    success: bool = Field(default=False)
    error: str = Field(..., description="錯誤類型")
    message: str = Field(..., description="錯誤詳情")


class StreamChunk(BaseModel):
    """SSE 串流的單一數據塊"""
    
    type: str = Field(
        ...,
        description="數據類型: 'progress' | 'attribute' | 'complete' | 'error'"
    )
    data: dict = Field(..., description="數據內容")


class UploadRequest(BaseModel):
    """圖片上傳請求（Base64）"""
    
    image_base64: str = Field(
        ...,
        description="Base64 編碼的圖片數據"
    )
    mime_type: str = Field(
        default="image/jpeg",
        description="圖片 MIME 類型"
    )
