/**
 * @file    : page.tsx
 * @purpose : 主頁面 - Specter Vision 儀表板
 */

'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import TerminalStream from '@/components/TerminalStream';
import AttributeCard from '@/components/AttributeCard';
import CanvasOverlay from '@/components/CanvasOverlay';
import { useAnalysis } from '@/hooks/useAnalysis';

export default function HomePage() {
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string; dataUrl: string } | null>(null);
  const {
    status,
    attributes,
    imageSummary,
    processingTime,
    terminalLines,
    error,
    analyze,
    reset
  } = useAnalysis();

  const handleImageSelect = (base64: string, mimeType: string) => {
    const dataUrl = `data:${mimeType};base64,${base64}`;
    setImageData({ base64, mimeType, dataUrl });
  };

  const handleAnalyze = async () => {
    if (!imageData) return;
    await analyze(imageData.base64, imageData.mimeType);
  };

  const handleReset = () => {
    setImageData(null);
    reset();
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 標題區 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-[var(--neon-cyan)] neon-glow-cyan">SPECTER</span>
            <span className="text-[var(--text-primary)]"> VISION</span>
          </h1>
          <p className="text-[var(--text-secondary)]">
            啟發式動態發現引擎 | Heuristic Discovery Engine
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            揭露人類認知盲區的 AI 影像分析系統
          </p>
        </header>

        {/* 主要內容區 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：圖片上傳與預覽 */}
          <div className="space-y-6">
            <div className="cyber-panel p-4">
              <h2 className="text-sm text-[var(--neon-purple)] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--neon-purple)]" />
                圖像輸入
              </h2>

              {attributes.length > 0 && imageData ? (
                <CanvasOverlay
                  imageUrl={imageData.dataUrl}
                  attributes={attributes}
                />
              ) : (
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  isLoading={status === 'analyzing'}
                />
              )}

              {/* 操作按鈕 */}
              <div className="flex gap-4 mt-4">
                {imageData && status === 'idle' && (
                  <button
                    onClick={handleAnalyze}
                    className="cyber-button flex-1"
                  >
                    啟動分析
                  </button>
                )}

                {(status === 'complete' || status === 'error') && (
                  <button
                    onClick={handleReset}
                    className="cyber-button flex-1"
                    style={{ borderColor: 'var(--neon-magenta)', color: 'var(--neon-magenta)' }}
                  >
                    重新開始
                  </button>
                )}
              </div>
            </div>

            {/* 終端機流 */}
            <TerminalStream
              lines={terminalLines}
              isActive={status === 'analyzing'}
            />
          </div>

          {/* 右側：分析結果 */}
          <div className="space-y-6">
            <div className="cyber-panel p-4">
              <h2 className="text-sm text-[var(--neon-cyan)] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]" />
                隱性屬性發現
                {attributes.length > 0 && (
                  <span className="ml-auto text-xs text-[var(--text-muted)]">
                    {attributes.length} 項發現
                  </span>
                )}
              </h2>

              {/* 圖像摘要 */}
              {imageSummary && (
                <div className="mb-4 p-3 bg-[var(--bg-dark)] rounded border-l-2 border-[var(--neon-cyan)]">
                  <p className="text-sm text-[var(--text-secondary)]">{imageSummary}</p>
                </div>
              )}

              {/* 屬性卡片列表 */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {attributes.length === 0 ? (
                  <div className="text-center py-12 text-[var(--text-muted)]">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p>上傳圖片後啟動分析</p>
                    <p className="text-xs mt-1">AI 將自動發現隱藏的視覺維度</p>
                  </div>
                ) : (
                  attributes.map((attr, index) => (
                    <AttributeCard
                      key={index}
                      attribute={attr}
                      index={index}
                      isNew={index === attributes.length - 1 && status === 'analyzing'}
                    />
                  ))
                )}
              </div>

              {/* 處理時間 */}
              {processingTime && (
                <div className="mt-4 pt-4 border-t border-[var(--neon-cyan)]/20 text-xs text-[var(--text-muted)] flex justify-between">
                  <span>處理時間</span>
                  <span className="text-[var(--neon-cyan)]">{processingTime.toFixed(0)}ms</span>
                </div>
              )}
            </div>

            {/* 錯誤顯示 */}
            {error && (
              <div className="cyber-panel p-4 border-[var(--neon-magenta)]">
                <p className="text-[var(--neon-magenta)] text-sm">
                  ⚠ 錯誤: {error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 頁腳 */}
        <footer className="mt-12 text-center text-xs text-[var(--text-muted)]">
          <p>Specter Vision v1.0 | Powered by Gemini 2.5 Flash</p>
          <p className="mt-1">啟發式動態發現引擎 © 2026</p>
        </footer>
      </div>
    </main>
  );
}
