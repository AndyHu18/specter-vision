"""
@file    : config.py
@purpose : 環境變數配置與驗證
@depends : []
@usedBy  : ['services/gemini.py', 'main.py']
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# 載入 .env 檔案
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class Settings:
    """應用程式設定"""
    
    # Gemini API
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # 伺服器設定
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS 設定
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://specter-vision.vercel.app",
        "https://specter-vision-andyhu18.vercel.app",
    ]
    
    # 上傳限制
    MAX_FILE_SIZE_MB: int = 5
    ALLOWED_EXTENSIONS: set[str] = {"png", "jpg", "jpeg", "webp"}
    
    @classmethod
    def validate(cls) -> bool:
        """驗證必要的環境變數"""
        if not cls.GOOGLE_API_KEY:
            raise ValueError(
                "❌ GOOGLE_API_KEY 未設定！\n"
                "請在 backend/.env 中設定您的 Gemini API Key"
            )
        return True


# 全域設定實例
settings = Settings()
