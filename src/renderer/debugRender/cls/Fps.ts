import RedGPUContext from "../../../context/RedGPUContext";
import DebugRender from "../DebugRender";
import ADebugItem from "./core/ADebugItem";

class DebugStatisticsDomService {
    dom: HTMLElement;

    constructor(redGPUContext: RedGPUContext) {
        this.dom = document.createElement('div');
        this.dom.style.cssText = 'z-index: 1;position: sticky;top:0;background:#000;border-bottom:1px solid rgba(255,255,255,0.06);box-shadow:0 10px 10px rgba(0,0,0,0.5)'
        this.#initializeStatisticsDisplay(redGPUContext);
    }

    update(fps: string, avg: string, low1: string, low01: string, frameTime: string) {
        const stats = {fps, avg, low1, low01, frameTime};
        Object.entries(stats).forEach(([key, value]) => this.#updateElement(key, value));
    }

    #initializeStatisticsDisplay(redGPUContext: RedGPUContext) {
        this.dom.innerHTML = `
        <div class="debug-group">
            <div class='debug-item'>
                <span class='debug-item-title' style="font-size: 14px;font-weight: 500;color:#fff">Performance<br/>Monitor</span>
                <div style="display: flex;align-items: center;justify-content: flex-end;gap:12px;">
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
                        <div class="fps" style="color:#0f0;font-size:18px;font-weight:bold;white-space: nowrap">60 FPS</div>
                        <div class="frameTime" style="color:#888;font-size:11px;">16.67ms</div>
                    </div>
                    <div style="width:1px;height:36px;background:rgba(255,255,255,0.15)"></div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0px">
                        <div class="avg" style="color:#4af;font-size:11px;">Avg: 60</div>
                        <div class="low1" style="color:#fa0;font-size:11px;">1%: 60</div>
                        <div class="low01" style="color:#f50;font-size:11px;">0.1%: 60</div>
                    </div>
                    <div class="panel_close" style="cursor:pointer;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#fff;width: 50px;height:48px;background: #c00;margin-left:8px;font-size:10px;font-weight:bold;transition:background 0.2s;" onmouseover="this.style.background='#e00'" onmouseout="this.style.background='#c00'">CLOSE</div>
                </div>
            </div>
        </div>
        `;
    }

    #updateElement(selector: string, value: any) {
        const targetElement = this.dom.querySelector(`.${selector}`);
        if (targetElement && targetElement.innerHTML !== value) {
            targetElement.innerHTML = value;
        }
    }
}

class Fps extends ADebugItem {
    #previousTimeStamp: number = 0;
    #frameCount: number = 0;
    #addedEvent: boolean = false;

    // 프레임 타임 수집 (업계 표준: 최소 1초 이상의 데이터)
    #frameTimesRaw: number[] = [];
    #maxFrameTimeBuffer: number = 1200; // 20초 @ 60fps (충분한 샘플)

    // 현재 FPS 표시용 (짧은 스무딩)
    #recentFrameTimes: number[] = [];
    #recentFrameTimeWindow: number = 10; // 최근 10프레임만 사용

    // 통계 업데이트 주기 제어
    #statisticsUpdateCounter: number = 0;
    #statisticsUpdateInterval: number = 60; // 60프레임(1초)마다 통계 갱신

    // 캐시된 통계값
    #cachedAvgFps: number = 0;
    #cachedLow1Fps: number = 0;
    #cachedLow01Fps: number = 0;

    // 초기화 대기 시간
    #initializationFrames: number = 60; // 첫 1초는 안정화 기간

    constructor(redGPUContext: RedGPUContext) {
        super();
        this.debugStatisticsDomService = new DebugStatisticsDomService(redGPUContext);
    }

    update(debugRender: DebugRender, redGPUContext: RedGPUContext, time: number) {
        // 첫 프레임 초기화
        if (this.#frameCount === 0) {
            this.#previousTimeStamp = time;
            this.#frameCount++;
            return;
        }

        // Delta Time 계산
        const deltaTime = time - this.#previousTimeStamp;
        this.#previousTimeStamp = time;
        this.#frameCount++;

        // Close 버튼 이벤트 등록 (한 번만)
        if (!this.#addedEvent) {
            const closeBtn = document.querySelector('.panel_close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    redGPUContext.useDebugPanel = false;
                });
                this.#addedEvent = true;
            }
        }

        // Frame Time 유효성 검증 및 저장
        const safeFrameTime = this.#validateFrameTime(deltaTime);

        // 초기화 기간 이후에만 데이터 수집
        if (this.#frameCount > this.#initializationFrames) {
            this.#frameTimesRaw.push(safeFrameTime);
            if (this.#frameTimesRaw.length > this.#maxFrameTimeBuffer) {
                this.#frameTimesRaw.shift();
            }
        }

        // 현재 FPS 계산 (최근 프레임만 사용)
        this.#recentFrameTimes.push(safeFrameTime);
        if (this.#recentFrameTimes.length > this.#recentFrameTimeWindow) {
            this.#recentFrameTimes.shift();
        }
        const currentFps = this.#calculateInstantaneousFps();

        // 통계 계산 (주기적으로만)
        this.#statisticsUpdateCounter++;
        if (this.#statisticsUpdateCounter >= this.#statisticsUpdateInterval) {
            this.#updateStatistics();
            this.#statisticsUpdateCounter = 0;
        }

        // UI 업데이트
        this.debugStatisticsDomService.update(
            `${currentFps} FPS`,
            `Avg: ${this.#cachedAvgFps}`,
            `1%: ${this.#cachedLow1Fps}`,
            `0.1%: ${this.#cachedLow01Fps}`,
            `${safeFrameTime.toFixed(2)}ms`
        );
    }

    /**
     * Frame Time 유효성 검증
     * 업계 표준: 비정상적인 값 필터링 (0ms, 극단적 스파이크)
     */
    #validateFrameTime(deltaTime: number): number {
        // 최소값: 0.1ms (10000 FPS 제한)
        // 최대값: 1000ms (1 FPS 제한 - 탭 전환 등의 경우)
        const minFrameTime = 0.1;
        const maxFrameTime = 1000;

        return Math.min(Math.max(deltaTime, minFrameTime), maxFrameTime);
    }

    /**
     * 즉시 FPS 계산 (현재 표시용)
     * 업계 표준: 최근 몇 프레임의 평균
     */
    #calculateInstantaneousFps(): number {
        if (this.#recentFrameTimes.length === 0) return 0;

        const avgFrameTime = this.#recentFrameTimes.reduce((a, b) => a + b, 0) / this.#recentFrameTimes.length;
        return Math.round(1000 / avgFrameTime);
    }

    /**
     * 통계 계산 및 캐싱
     */
    #updateStatistics() {
        if (this.#frameTimesRaw.length < 100) {
            this.#cachedAvgFps = 0;
            this.#cachedLow1Fps = 0;
            this.#cachedLow01Fps = 0;
            return;
        }

        const stats = this.#calculateFrameTimeStatistics();
        this.#cachedAvgFps = stats.avgFps;
        this.#cachedLow1Fps = stats.low1Fps;
        this.#cachedLow01Fps = stats.low01Fps;
    }

    /**
     * 프레임 타임 통계 계산
     * 업계 표준 방식:
     * - Average FPS: 전체 프레임의 평균
     * - 1% Low: 하위 1% 프레임들의 평균 FPS
     * - 0.1% Low: 하위 0.1% 프레임들의 평균 FPS
     */
    #calculateFrameTimeStatistics() {
        // 평균 FPS 계산
        const totalFrameTime = this.#frameTimesRaw.reduce((a, b) => a + b, 0);
        const avgFrameTime = totalFrameTime / this.#frameTimesRaw.length;
        const avgFps = Math.round(1000 / avgFrameTime);

        // 프레임 타임 정렬 (내림차순 - 가장 느린 프레임이 앞)
        const sortedFrameTimes = [...this.#frameTimesRaw].sort((a, b) => b - a);
        const totalFrames = sortedFrameTimes.length;

        // 1% Low 계산
        const low1Count = Math.max(1, Math.ceil(totalFrames * 0.01));
        const low1Frames = sortedFrameTimes.slice(0, low1Count);
        const low1AvgFrameTime = low1Frames.reduce((a, b) => a + b, 0) / low1Frames.length;
        const low1Fps = Math.round(1000 / low1AvgFrameTime);

        // 0.1% Low 계산
        const low01Count = Math.max(1, Math.ceil(totalFrames * 0.001));
        const low01Frames = sortedFrameTimes.slice(0, low01Count);
        const low01AvgFrameTime = low01Frames.reduce((a, b) => a + b, 0) / low01Frames.length;
        const low01Fps = Math.round(1000 / low01AvgFrameTime);

        return {
            avgFps,
            low1Fps,
            low01Fps
        };
    }
}

export default Fps;