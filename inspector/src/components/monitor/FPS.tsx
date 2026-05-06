import React, {memo, useState} from 'react';
import {useInspectorStore} from '../../store';
import MiniGraph from "../common/MiniGraph";
import formatBytes from "@redgpu/src/utils/formatBytes";
import {COMMON_STYLES} from "../common/Theme";

/**
 * [KO] FPS 및 프레임 타임 통계를 계산하는 클래스입니다.
 * [EN] Class that calculates FPS and frame time statistics.
 */
export class FPSMeter {
    private previousTimeStamp: number = 0;
    private frameCount: number = 0;
    private frameTimesRaw: number[] = [];
    private recentFrameTimes: number[] = [];

    private readonly maxFrameTimeBuffer = 1200;
    private readonly recentFrameTimeWindow = 10;
    private readonly initializationFrames = 60;

    /**
     * [KO] 새로운 타임스탬프를 기반으로 통계를 업데이트합니다.
     * [EN] Updates statistics based on a new timestamp.
     */
    update(currentTime: number) {
        if (currentTime === 0) return null;

        if (this.frameCount === 0) {
            this.previousTimeStamp = currentTime;
            this.frameCount++;
            return null;
        }

        const deltaTime = currentTime - this.previousTimeStamp;
        this.previousTimeStamp = currentTime;
        this.frameCount++;

        const safeFrameTime = Math.min(Math.max(deltaTime, 0.1), 1000);

        // [KO] 데이터 수집
        // [EN] Data collection
        if (this.frameCount > this.initializationFrames) {
            this.frameTimesRaw.push(safeFrameTime);
            if (this.frameTimesRaw.length > this.maxFrameTimeBuffer) this.frameTimesRaw.shift();
        }

        this.recentFrameTimes.push(safeFrameTime);
        if (this.recentFrameTimes.length > this.recentFrameTimeWindow) this.recentFrameTimes.shift();

        // [KO] 현재 FPS 계산 (최근 10프레임 평균)
        // [EN] Calculate current FPS (Average of recent 10 frames)
        const avgRecent = this.recentFrameTimes.reduce((a, b) => a + b, 0) / this.recentFrameTimes.length;
        const fps = Math.round(1000 / avgRecent);

        let stats = {
            fps,
            avgFps: 0,
            low1Fps: 0,
            low01Fps: 0,
            frameTime: `${safeFrameTime.toFixed(2)}ms`
        };

        // [KO] 상세 통계 계산 (데이터가 충분할 때)
        // [EN] Calculate detailed statistics (When enough data is collected)
        if (this.frameTimesRaw.length >= 100) {
            const sorted = [...this.frameTimesRaw].sort((a, b) => b - a);
            const total = sorted.length;

            const avgTotal = this.frameTimesRaw.reduce((a, b) => a + b, 0) / total;
            stats.avgFps = Math.round(1000 / avgTotal);

            const low1Count = Math.max(1, Math.ceil(total * 0.01));
            const low1Avg = sorted.slice(0, low1Count).reduce((a, b) => a + b, 0) / low1Count;
            stats.low1Fps = Math.round(1000 / low1Avg);

            const low01Count = Math.max(1, Math.ceil(total * 0.001));
            const low01Avg = sorted.slice(0, low01Count).reduce((a, b) => a + b, 0) / low01Count;
            stats.low01Fps = Math.round(1000 / low01Avg);
        }

        return stats;
    }
}

/**
 * [KO] FPS 및 프레임 타임 통계를 표시하는 컴포넌트입니다.
 */
const FPS = memo(() => {
    // [KO] 특정 필드만 선택하여 구독함으로써 불필요한 리렌더링 방지
    const fps = useInspectorStore(state => state.fps);
    const avgFps = useInspectorStore(state => state.avgFps);
    const low1Fps = useInspectorStore(state => state.low1Fps);
    const low01Fps = useInspectorStore(state => state.low01Fps);
    const frameTime = useInspectorStore(state => state.frameTime);

    const fpsHistory = useInspectorStore(state => state.fpsHistory);
    const drawCallHistory = useInspectorStore(state => state.drawCallHistory);
    const memoryHistory = useInspectorStore(state => state.memoryHistory);

    const totalNumDrawCalls = useInspectorStore(state => state.totalNumDrawCalls);
    const totalUsedVideoMemory = useInspectorStore(state => state.totalUsedVideoMemory);

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div style={containerStyle}>
            <div style={statsContainerStyle}>
                <div
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={toggleWrapperStyle}
                >
                    <span style={COMMON_STYLES.toggleButton}>{isExpanded ? '-' : '+'}</span>
                </div>

                <div style={fpsValueStyle}>{fps} FPS</div>
                <div style={frameTimeValueStyle}>({frameTime})</div>

                <div style={{flex: 1}}/>

                <div style={avgFpsStyle}>Avg: {avgFps}</div>
                <div style={miniDividerStyle}/>
                <div style={low1FpsStyle}>1%: {low1Fps}</div>
                <div style={miniDividerStyle}/>
                <div style={low01FpsStyle}>0.1%: {low01Fps}</div>
            </div>

            {isExpanded && (
                <div style={graphColumnStyle}>
                    <MiniGraph data={fpsHistory} height={20} color="#0f0" label="FPS" valueDisplay={`${fps} FPS`}/>
                    <MiniGraph data={drawCallHistory} height={20} color="#4af" label="Draws"
                               valueDisplay={totalNumDrawCalls.toString()}/>
                    <MiniGraph data={memoryHistory} height={20} color="#fdb48d" label="VRAM"
                               valueDisplay={formatBytes(totalUsedVideoMemory)}/>
                    <div>TODO - bundleCall</div>
                </div>
            )}
        </div>
    );
});

// Styles
const containerStyle: React.CSSProperties = {
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    background: '#000'
};

const statsContainerStyle: React.CSSProperties = {
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    fontFamily: 'monospace, "Courier New", courier',
    fontVariantNumeric: 'tabular-nums'
};

const toggleWrapperStyle: React.CSSProperties = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    paddingRight: '4px'
};

const graphColumnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 12px 8px 12px',
    gap: '4px'
};

const miniDividerStyle: React.CSSProperties = {
    width: '1px',
    height: '10px',
    background: 'rgba(255,255,255,0.2)',
    margin: '0 2px'
};

const fpsValueStyle: React.CSSProperties = {
    color: '#0f0',
    fontWeight: 'bold',
    fontSize: '12px',
    textAlign: 'left'
};

const frameTimeValueStyle: React.CSSProperties = {
    color: '#888',
    fontSize: '10px',
    minWidth: '65px',
    textAlign: 'left'
};

const avgFpsStyle: React.CSSProperties = {
    color: '#4af',
    minWidth: '50px'
};

const low1FpsStyle: React.CSSProperties = {
    color: '#fa0',
    minWidth: '45px'
};

const low01FpsStyle: React.CSSProperties = {
    color: '#f50',
};

export default FPS;
