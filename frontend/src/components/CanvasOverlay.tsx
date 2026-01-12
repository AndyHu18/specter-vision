/**
 * @file    : CanvasOverlay.tsx
 * @purpose : Canvas 疊加層 - 在圖片上繪製 AI 偵測到的視覺標記
 */

'use client';

import { useRef, useEffect } from 'react';
import { DynamicAttribute } from '@/types/analysis';

interface CanvasOverlayProps {
    imageUrl: string;
    attributes: DynamicAttribute[];
    width?: number;
    height?: number;
}

export default function CanvasOverlay({
    imageUrl,
    attributes,
    width = 640,
    height = 480
}: CanvasOverlayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 載入圖片
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            imageRef.current = img;
            drawOverlay(ctx, img);
        };
        img.src = imageUrl;
    }, [imageUrl]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        drawOverlay(ctx, img);
    }, [attributes]);

    const drawOverlay = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
        const canvas = ctx.canvas;

        // 清除畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 繪製圖片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 繪製屬性標記
        attributes.forEach((attr, index) => {
            if (attr.coordinates) {
                drawAttributeMarker(ctx, attr, index);
            }
        });

        // 繪製掃描線效果
        drawScanEffect(ctx);
    };

    const drawAttributeMarker = (
        ctx: CanvasRenderingContext2D,
        attr: DynamicAttribute,
        index: number
    ) => {
        const { coordinates, shock_value } = attr;
        if (!coordinates) return;

        const canvas = ctx.canvas;
        const x = coordinates.x * canvas.width;
        const y = coordinates.y * canvas.height;
        const radius = coordinates.radius * Math.min(canvas.width, canvas.height);

        // 根據震撼值選擇顏色
        const color = shock_value >= 8
            ? '#ff00ff'  // 洋紅
            : shock_value >= 5
                ? '#00f5ff'  // 青
                : '#8b5cf6'; // 紫

        // 繪製外圈
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // 繪製內圈光暈
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `${color}40`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();

        // 繪製十字準心
        ctx.beginPath();
        ctx.moveTo(x - 10, y);
        ctx.lineTo(x + 10, y);
        ctx.moveTo(x, y - 10);
        ctx.lineTo(x, y + 10);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 繪製標籤
        const labelX = x + radius + 10;
        const labelY = y;

        ctx.font = '12px "Roboto Mono", monospace';
        ctx.fillStyle = color;
        ctx.fillText(`#${index + 1}`, labelX, labelY);
    };

    const drawScanEffect = (ctx: CanvasRenderingContext2D) => {
        const canvas = ctx.canvas;

        // 角落裝飾
        const cornerSize = 30;
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 2;

        // 左上角
        ctx.beginPath();
        ctx.moveTo(0, cornerSize);
        ctx.lineTo(0, 0);
        ctx.lineTo(cornerSize, 0);
        ctx.stroke();

        // 右上角
        ctx.beginPath();
        ctx.moveTo(canvas.width - cornerSize, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.lineTo(canvas.width, cornerSize);
        ctx.stroke();

        // 左下角
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - cornerSize);
        ctx.lineTo(0, canvas.height);
        ctx.lineTo(cornerSize, canvas.height);
        ctx.stroke();

        // 右下角
        ctx.beginPath();
        ctx.moveTo(canvas.width - cornerSize, canvas.height);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(canvas.width, canvas.height - cornerSize);
        ctx.stroke();
    };

    return (
        <div className="relative neon-border rounded-lg overflow-hidden">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="w-full h-auto"
            />

            {/* HUD 覆蓋層 */}
            <div className="absolute top-2 left-2 text-xs text-[var(--neon-cyan)] opacity-80">
                SPECTER_VISION v1.0
            </div>
            <div className="absolute top-2 right-2 text-xs text-[var(--neon-cyan)] opacity-80">
                {attributes.length} ANOMALIES DETECTED
            </div>
            <div className="absolute bottom-2 left-2 text-xs text-[var(--text-muted)]">
                {width} × {height}
            </div>
        </div>
    );
}
