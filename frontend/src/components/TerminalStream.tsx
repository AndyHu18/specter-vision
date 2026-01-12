/**
 * @file    : TerminalStream.tsx
 * @purpose : 動態終端機流組件 - 像矩陣代碼一樣逐行顯示
 */

'use client';

import { useEffect, useRef } from 'react';

interface TerminalLine {
    type: 'info' | 'success' | 'warning' | 'error' | 'data';
    content: string;
    timestamp?: string;
}

interface TerminalStreamProps {
    lines: TerminalLine[];
    isActive?: boolean;
}

export default function TerminalStream({ lines, isActive = false }: TerminalStreamProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // 自動滾動到底部
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [lines]);

    const getLineColor = (type: TerminalLine['type']) => {
        switch (type) {
            case 'success': return 'text-[var(--neon-green)]';
            case 'warning': return 'text-[var(--neon-orange)]';
            case 'error': return 'text-[var(--neon-magenta)]';
            case 'data': return 'text-[var(--neon-cyan)]';
            default: return 'text-[var(--text-secondary)]';
        }
    };

    const getPrefix = (type: TerminalLine['type']) => {
        switch (type) {
            case 'success': return '[✓]';
            case 'warning': return '[!]';
            case 'error': return '[✗]';
            case 'data': return '[→]';
            default: return '[~]';
        }
    };

    return (
        <div className="cyber-panel p-4">
            {/* 終端機標題欄 */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--neon-cyan)]/20">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[var(--neon-magenta)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--neon-orange)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--neon-green)]" />
                </div>
                <span className="text-xs text-[var(--text-muted)] ml-2">
                    SPECTER_VISION://analysis_stream
                </span>
                {isActive && (
                    <span className="ml-auto text-xs text-[var(--neon-cyan)] pulse-glow">
                        ● LIVE
                    </span>
                )}
            </div>

            {/* 終端機內容 */}
            <div
                ref={containerRef}
                className="h-48 overflow-y-auto font-mono text-sm space-y-1"
            >
                {lines.length === 0 ? (
                    <div className="text-[var(--text-muted)] flex items-center gap-2">
                        <span className="animate-pulse">▌</span>
                        <span>等待圖像輸入...</span>
                    </div>
                ) : (
                    lines.map((line, index) => (
                        <div
                            key={index}
                            className={`flex gap-2 ${getLineColor(line.type)} animate-fade-in`}
                            style={{
                                animation: `fadeIn 0.3s ease ${index * 0.05}s both`
                            }}
                        >
                            <span className="opacity-60">{getPrefix(line.type)}</span>
                            <span>{line.content}</span>
                        </div>
                    ))
                )}

                {/* 閃爍游標 */}
                {isActive && (
                    <div className="flex items-center text-[var(--neon-cyan)]">
                        <span className="animate-pulse">▌</span>
                    </div>
                )}
            </div>

        </div>
    );
}
