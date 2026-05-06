import React, {useEffect, useRef} from 'react';
import {THEME} from "./Theme";

/**
 * [KO] 실시간 데이터를 선 그래프로 시각화하는 경량 컴포넌트입니다.
 * [EN] Lightweight component that visualizes real-time data as a line graph.
 */
const MiniGraph = ({
                       data,
                       width = '100%',
                       height = 40,
                       color = THEME.colors.primary,
                       label,
                       valueDisplay
                   }: {
    data: number[],
    width?: string | number,
    height?: number,
    color?: string,
    label?: string,
    valueDisplay?: string
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // DPI 대응
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;

        // 배경 초기화
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, w, h);

        if (data.length < 2) return;

        // 그래프 그리기
        const max = Math.max(...data) * 1.1 || 1;
        const min = Math.min(...data) * 0.9 || 0;
        const range = max - min;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';

        const step = w / (data.length - 1);
        data.forEach((val, i) => {
            const x = i * step;
            const y = h - ((val - min) / range) * h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // 아래쪽 채우기 (Gradiant)
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        const rgbaColor = color.startsWith('#') ? hexToRgba(color, 0.3) : color;
        gradient.addColorStop(0, rgbaColor);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        }, [data, color]);

        return (
        <div style={{marginBottom: '12px'}}>
            {(label || valueDisplay) && (
                <div style={headerStyle}>
                    <span style={labelStyle}>{label}</span>
                    <span style={{...valueStyle, color}}>{valueDisplay}</span>
                </div>
            )}
            <canvas
                ref={canvasRef}
                style={{
                    width: width,
                    height: height,
                    display: 'block',
                    borderRadius: '2px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            />
        </div>
        );
        };

        const hexToRgba = (hex: string, alpha: number) => {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10px',
    marginBottom: '4px',
    fontFamily: 'monospace, "Courier New", courier',
    fontVariantNumeric: 'tabular-nums'
};

const labelStyle: React.CSSProperties = {
    color: '#888'
};

const valueStyle: React.CSSProperties = {
    fontWeight: 'bold'
};

export default MiniGraph;
