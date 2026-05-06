import React, {useEffect, useRef, memo} from 'react';
import {THEME} from "./Theme";

/**
 * [KO] 실시간 데이터를 선 그래프로 시각화하는 경량 컴포넌트입니다.
 */
const MiniGraph = memo(({
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

        const ctx = canvas.getContext('2d', {alpha: false}); // Performance optimization: disable alpha if possible
        if (!ctx) return;

        // DPI 대응
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.scale(dpr, dpr);
        }

        // 배경 초기화
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, w, h);

        if (data.length < 2) return;

        // 그래프 그리기 최적화
        const dataLen = data.length;
        let max = -Infinity;
        let min = Infinity;
        for(let i=0; i<dataLen; i++) {
            if(data[i] > max) max = data[i];
            if(data[i] < min) min = data[i];
        }
        max = max * 1.1 || 1;
        min = min * 0.9 || 0;
        const range = max - min;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';

        const step = w / (dataLen - 1);
        for (let i = 0; i < dataLen; i++) {
            const x = i * step;
            const y = h - ((data[i] - min) / range) * h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 아래쪽 채우기 (Gradient)
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        const rgbaColor = color.startsWith('#') ? hexToRgba(color, 0.2) : color;
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
        });

        const hexCache: Record<string, string> = {};
        const hexToRgba = (hex: string, alpha: number) => {
            const key = hex + alpha;
            if (hexCache[key]) return hexCache[key];

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
            const result = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            hexCache[key] = result;
            return result;
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
