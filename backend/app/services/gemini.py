"""
@file    : gemini.py
@purpose : Gemini API 服務 - 多模態影像分析
@depends : ['config.py', 'prompts/heuristic.py', 'types/schemas.py']
@usedBy  : ['main.py']
"""

import json
import time
import base64
from typing import AsyncGenerator

from google import genai

from app.config import settings
from app.prompts.heuristic import build_analysis_prompt
from app.types.schemas import AnalysisResult, DynamicAttribute


class GeminiService:
    """Gemini API 多模態分析服務"""
    
    def __init__(self):
        """初始化 Gemini Client"""
        self.client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        self.model = settings.GEMINI_MODEL
        print(f"📍[GeminiService] 初始化完成，使用模型: {self.model}")
    
    async def analyze_image(
        self,
        image_base64: str,
        mime_type: str = "image/jpeg"
    ) -> AnalysisResult:
        """
        分析圖像並返回動態屬性
        
        Args:
            image_base64: Base64 編碼的圖片
            mime_type: 圖片 MIME 類型
            
        Returns:
            AnalysisResult: 分析結果
        """
        start_time = time.time()
        print(f"📍[GeminiService] 開始分析圖像...")
        
        try:
            # 建構 Prompt
            prompt = build_analysis_prompt()
            
            # 準備圖片數據（使用 Data URI 格式）
            image_uri = f"data:{mime_type};base64,{image_base64}"
            
            # 使用簡化的 contents 格式（2026 新版 SDK）
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    {
                        "role": "user",
                        "parts": [
                            {"inline_data": {"mime_type": mime_type, "data": image_base64}},
                            {"text": prompt}
                        ]
                    }
                ]
            )
            
            # 解析回應
            response_text = response.text
            print(f"📍[GeminiService] 收到回應，長度: {len(response_text)}")
            
            # 提取 JSON
            result = self._parse_response(response_text)
            result.processing_time_ms = (time.time() - start_time) * 1000
            
            return result
            
        except Exception as e:
            print(f"📍[GeminiService] 錯誤: {type(e).__name__}: {e}")
            raise
    
    async def analyze_image_stream(
        self,
        image_base64: str,
        mime_type: str = "image/jpeg"
    ) -> AsyncGenerator[dict, None]:
        """
        串流分析圖像，逐步輸出結果
        
        Yields:
            dict: SSE 事件數據
        """
        start_time = time.time()
        
        try:
            yield {"type": "progress", "data": {"message": "🔍 正在掃描圖像..."}}
            
            # 建構 Prompt
            prompt = build_analysis_prompt()
            
            yield {"type": "progress", "data": {"message": "🧠 啟動啟發式分析引擎..."}}
            
            # 使用簡化的 contents 格式（2026 新版 SDK）
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    {
                        "role": "user",
                        "parts": [
                            {"inline_data": {"mime_type": mime_type, "data": image_base64}},
                            {"text": prompt}
                        ]
                    }
                ]
            )
            
            yield {"type": "progress", "data": {"message": "📊 解析隱性屬性..."}}
            
            # 解析結果
            result = self._parse_response(response.text)
            
            # 逐一輸出屬性
            for i, attr in enumerate(result.attributes):
                yield {
                    "type": "attribute",
                    "data": {
                        "index": i,
                        "total": len(result.attributes),
                        "attribute": attr.model_dump()
                    }
                }
            
            # 完成
            processing_time = (time.time() - start_time) * 1000
            yield {
                "type": "complete",
                "data": {
                    "image_summary": result.image_summary,
                    "total_attributes": len(result.attributes),
                    "processing_time_ms": processing_time
                }
            }
            
        except Exception as e:
            yield {
                "type": "error",
                "data": {"error": type(e).__name__, "message": str(e)}
            }
    
    def _parse_response(self, response_text: str) -> AnalysisResult:
        """解析 Gemini 回應中的 JSON"""
        try:
            # 嘗試提取 JSON 區塊
            if "```json" in response_text:
                start = response_text.find("```json") + 7
                end = response_text.find("```", start)
                json_str = response_text[start:end].strip()
            elif "{" in response_text:
                start = response_text.find("{")
                end = response_text.rfind("}") + 1
                json_str = response_text[start:end]
            else:
                raise ValueError("無法在回應中找到 JSON")
            
            data = json.loads(json_str)
            
            # 建構結果
            attributes = [
                DynamicAttribute(**attr)
                for attr in data.get("attributes", [])
            ]
            
            return AnalysisResult(
                success=True,
                image_summary=data.get("image_summary", "分析完成"),
                attributes=attributes
            )
            
        except json.JSONDecodeError as e:
            print(f"📍[GeminiService] JSON 解析失敗: {e}")
            # 降級處理：返回原始文字
            return AnalysisResult(
                success=True,
                image_summary=response_text[:200],
                attributes=[]
            )


# 全域服務實例
gemini_service: GeminiService | None = None


def get_gemini_service() -> GeminiService:
    """獲取 Gemini 服務實例（依賴注入）"""
    global gemini_service
    if gemini_service is None:
        gemini_service = GeminiService()
    return gemini_service
