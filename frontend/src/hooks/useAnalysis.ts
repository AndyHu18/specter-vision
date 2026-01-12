/**
 * @file    : useAnalysis.ts
 * @purpose : 分析 Hook - SSE 串流連接與狀態管理
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import {
    DynamicAttribute,
    AnalysisStatus,
    ProgressEvent,
    AttributeEvent,
    CompleteEvent,
    ErrorEvent
} from '@/types/analysis';

// 後端 API 基礎 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface TerminalLine {
    type: 'info' | 'success' | 'warning' | 'error' | 'data';
    content: string;
}

interface UseAnalysisReturn {
    status: AnalysisStatus;
    attributes: DynamicAttribute[];
    imageSummary: string | null;
    processingTime: number | null;
    terminalLines: TerminalLine[];
    error: string | null;
    analyze: (imageBase64: string, mimeType: string) => Promise<void>;
    reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
    const [status, setStatus] = useState<AnalysisStatus>('idle');
    const [attributes, setAttributes] = useState<DynamicAttribute[]>([]);
    const [imageSummary, setImageSummary] = useState<string | null>(null);
    const [processingTime, setProcessingTime] = useState<number | null>(null);
    const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
    const [error, setError] = useState<string | null>(null);

    const eventSourceRef = useRef<EventSource | null>(null);

    const addTerminalLine = useCallback((type: TerminalLine['type'], content: string) => {
        setTerminalLines(prev => [...prev, { type, content }]);
    }, []);

    const analyze = useCallback(async (imageBase64: string, mimeType: string) => {
        // 清理之前的連接
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        // 重置狀態
        setStatus('analyzing');
        setAttributes([]);
        setImageSummary(null);
        setProcessingTime(null);
        setError(null);
        setTerminalLines([]);

        addTerminalLine('info', '初始化 Specter Vision 分析引擎...');

        try {
            // 使用 fetch + ReadableStream 處理 SSE（因為需要 POST）
            const response = await fetch(`${API_BASE_URL}/analyze/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_base64: imageBase64,
                    mime_type: mimeType,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('無法讀取回應串流');

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('event:')) {
                        const eventType = line.slice(6).trim();
                        continue;
                    }

                    if (line.startsWith('data:')) {
                        const dataStr = line.slice(5).trim();
                        if (!dataStr) continue;

                        try {
                            const data = JSON.parse(dataStr);
                            handleSSEData(data);
                        } catch (e) {
                            console.error('📍[useAnalysis] JSON 解析錯誤:', e);
                        }
                    }
                }
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '未知錯誤';
            setError(errorMessage);
            setStatus('error');
            addTerminalLine('error', `分析失敗: ${errorMessage}`);
        }
    }, [addTerminalLine]);

    const handleSSEData = useCallback((data: ProgressEvent | AttributeEvent | CompleteEvent | ErrorEvent | Record<string, unknown>) => {
        // 判斷事件類型
        if ('message' in data && typeof data.message === 'string') {
            // 進度事件
            addTerminalLine('info', data.message);
        } else if ('attribute' in data && 'index' in data) {
            // 屬性事件
            const attrData = data as AttributeEvent;
            setAttributes(prev => [...prev, attrData.attribute]);
            addTerminalLine('data', `發現屬性 #${attrData.index + 1}: ${attrData.attribute.attribute_name}`);
            addTerminalLine('success', `震撼度: ${attrData.attribute.shock_value}/10`);
        } else if ('image_summary' in data && 'total_attributes' in data) {
            // 完成事件
            const completeData = data as CompleteEvent;
            setImageSummary(completeData.image_summary);
            setProcessingTime(completeData.processing_time_ms);
            setStatus('complete');
            addTerminalLine('success', `✓ 分析完成！共發現 ${completeData.total_attributes} 個隱性屬性`);
            addTerminalLine('info', `處理時間: ${completeData.processing_time_ms.toFixed(0)}ms`);
        } else if ('error' in data) {
            // 錯誤事件
            const errorData = data as ErrorEvent;
            setError(errorData.message);
            setStatus('error');
            addTerminalLine('error', `${errorData.error}: ${errorData.message}`);
        }
    }, [addTerminalLine]);

    const reset = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }
        setStatus('idle');
        setAttributes([]);
        setImageSummary(null);
        setProcessingTime(null);
        setTerminalLines([]);
        setError(null);
    }, []);

    return {
        status,
        attributes,
        imageSummary,
        processingTime,
        terminalLines,
        error,
        analyze,
        reset,
    };
}
