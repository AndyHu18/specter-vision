/**
 * @file    : AttributeCard.tsx
 * @purpose : 動態屬性卡片組件 - 展示 AI 發現的隱性屬性
 */

'use client';

import { DynamicAttribute } from '@/types/analysis';

interface AttributeCardProps {
    attribute: DynamicAttribute;
    index: number;
    isNew?: boolean;
}

export default function AttributeCard({ attribute, index, isNew = false }: AttributeCardProps) {
    const shockPercentage = (attribute.shock_value / 10) * 100;

    // 根據震撼值決定邊框顏色
    const getBorderColor = () => {
        if (attribute.shock_value >= 8) return 'border-[var(--neon-magenta)]';
        if (attribute.shock_value >= 5) return 'border-[var(--neon-cyan)]';
        return 'border-[var(--neon-purple)]/50';
    };

    return (
        <div
            className={`
        cyber-card p-4 ${getBorderColor()}
        ${isNew ? 'animate-pulse-once' : ''}
        transition-all duration-500
      `}
        >
            {/* 標頭 */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)] opacity-60">
                        #{String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--neon-cyan)] neon-glow-cyan">
                        {attribute.attribute_name}
                    </h3>
                </div>

                {/* 震撼值徽章 */}
                <div className={`
          px-2 py-1 rounded text-xs font-bold
          ${attribute.shock_value >= 8
                        ? 'bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)]'
                        : attribute.shock_value >= 5
                            ? 'bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]'
                            : 'bg-[var(--neon-purple)]/20 text-[var(--neon-purple)]'
                    }
        `}>
                    震撼度 {attribute.shock_value}/10
                </div>
            </div>

            {/* 震撼值進度條 */}
            <div className="shock-meter mb-3">
                <div
                    className="shock-meter-fill"
                    style={{ width: `${shockPercentage}%` }}
                />
            </div>

            {/* 偵測邏輯 */}
            <div className="mb-3">
                <p className="text-xs text-[var(--text-muted)] mb-1">偵測邏輯</p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {attribute.detection_logic}
                </p>
            </div>

            {/* 黑科技洞察 */}
            <div className="bg-[var(--bg-dark)] p-3 rounded border-l-2 border-[var(--neon-magenta)]">
                <p className="text-xs text-[var(--neon-magenta)] mb-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    黑科技洞察
                </p>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                    {attribute.black_tech_insight}
                </p>
            </div>

        </div>
    );
}
