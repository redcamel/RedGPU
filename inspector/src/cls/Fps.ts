import RedGPUContext from "../../../src/context/RedGPUContext";
import RedGPUInspector from "../index";
import ADebugItem from "./core/ADebugItem";

class DebugStatisticsDomService {
    dom: HTMLElement;

    constructor() {
        this.dom = document.createElement('div');
        this.dom.style.cssText = 'z-index: 1;position: sticky;top:0;background:#000;border-bottom:1px solid rgba(255,255,255,0.06);box-shadow:0 10px 10px rgba(0,0,0,0.5)'
        this.#initializeStatisticsDisplay();
    }

    update(fps: string, avg: string, low1: string, low01: string, frameTime: string) {
        const stats = {fps, avg, low1, low01, frameTime};
        Object.entries(stats).forEach(([key, value]) => this.#updateElement(key, value));
    }

    #initializeStatisticsDisplay() {
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
    // ?ÑÎ†à???Ä???òÏßë (?ÖÍ≥Ñ ?úÏ?: ÏµúÏÜå 1Ï¥??¥ÏÉÅ???∞Ïù¥??
    #frameTimesRaw: number[] = [];
    #maxFrameTimeBuffer: number = 1200; // 20Ï¥?@ 60fps (Ï∂©Î∂Ñ???òÌîå)
    // ?ÑÏû¨ FPS ?úÏãú??(ÏßßÏ? ?§Î¨¥??
    #recentFrameTimes: number[] = [];
    #recentFrameTimeWindow: number = 10; // ÏµúÍ∑º 10?ÑÎ†à?ÑÎßå ?¨Ïö©
    // ?µÍ≥Ñ ?ÖÎç∞?¥Ìä∏ Ï£ºÍ∏∞ ?úÏñ¥
    #statisticsUpdateCounter: number = 0;
    #statisticsUpdateInterval: number = 60; // 60?ÑÎ†à??1Ï¥?ÎßàÎã§ ?µÍ≥Ñ Í∞±Ïã†
    // Ï∫êÏãú???µÍ≥ÑÍ∞?
    #cachedAvgFps: number = 0;
    #cachedLow1Fps: number = 0;
    #cachedLow01Fps: number = 0;
    // Ï¥àÍ∏∞???ÄÍ∏??úÍ∞Ñ
    #initializationFrames: number = 60; // Ï≤?1Ï¥àÎäî ?àÏ†ï??Í∏∞Í∞Ñ
    constructor() {
        super();
        this.debugStatisticsDomService = new DebugStatisticsDomService();
    }

    update(debugRender: RedGPUInspector, redGPUContext: RedGPUContext, time: number) {
        // Ï≤??ÑÎ†à??Ï¥àÍ∏∞??
        if (this.#frameCount === 0) {
            this.#previousTimeStamp = time;
            this.#frameCount++;
            return;
        }
        // Delta Time Í≥ÑÏÇ∞
        const deltaTime = time - this.#previousTimeStamp;
        this.#previousTimeStamp = time;
        this.#frameCount++;
        // Close Î≤ÑÌäº ?¥Î≤§???±Î°ù (??Î≤àÎßå)
        if (!this.#addedEvent) {
            const closeBtn = document.querySelector('.panel_close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    debugRender.useDebugPanel = false;
                });
                this.#addedEvent = true;
            }
        }
        // Frame Time ?†Ìö®??Í≤ÄÏ¶?Î∞??Ä??
        const safeFrameTime = this.#validateFrameTime(deltaTime);
        // Ï¥àÍ∏∞??Í∏∞Í∞Ñ ?¥ÌõÑ?êÎßå ?∞Ïù¥???òÏßë
        if (this.#frameCount > this.#initializationFrames) {
            this.#frameTimesRaw.push(safeFrameTime);
            if (this.#frameTimesRaw.length > this.#maxFrameTimeBuffer) {
                this.#frameTimesRaw.shift();
            }
        }
        // ?ÑÏû¨ FPS Í≥ÑÏÇ∞ (ÏµúÍ∑º ?ÑÎ†à?ÑÎßå ?¨Ïö©)
        this.#recentFrameTimes.push(safeFrameTime);
        if (this.#recentFrameTimes.length > this.#recentFrameTimeWindow) {
            this.#recentFrameTimes.shift();
        }
        const currentFps = this.#calculateInstantaneousFps();
        // ?µÍ≥Ñ Í≥ÑÏÇ∞ (Ï£ºÍ∏∞?ÅÏúºÎ°úÎßå)
        this.#statisticsUpdateCounter++;
        if (this.#statisticsUpdateCounter >= this.#statisticsUpdateInterval) {
            this.#updateStatistics();
            this.#statisticsUpdateCounter = 0;
        }
        // UI ?ÖÎç∞?¥Ìä∏
        this.debugStatisticsDomService.update(
            `${currentFps} FPS`,
            `Avg: ${this.#cachedAvgFps}`,
            `1%: ${this.#cachedLow1Fps}`,
            `0.1%: ${this.#cachedLow01Fps}`,
            `${safeFrameTime.toFixed(2)}ms`
        );
    }

    /**
     * Frame Time ?†Ìö®??Í≤ÄÏ¶?
     * ?ÖÍ≥Ñ ?úÏ?: ÎπÑÏ†ï?ÅÏ†Å??Í∞??ÑÌÑ∞Îß?(0ms, Í∑πÎã®???§Ìåå?¥ÌÅ¨)
     */
    #validateFrameTime(deltaTime: number): number {
        // ÏµúÏÜåÍ∞? 0.1ms (10000 FPS ?úÌïú)
        // ÏµúÎ?Í∞? 1000ms (1 FPS ?úÌïú - ???ÑÌôò ?±Ïùò Í≤ΩÏö∞)
        const minFrameTime = 0.1;
        const maxFrameTime = 1000;
        return Math.min(Math.max(deltaTime, minFrameTime), maxFrameTime);
    }

    /**
     * Ï¶âÏãú FPS Í≥ÑÏÇ∞ (?ÑÏû¨ ?úÏãú??
     * ?ÖÍ≥Ñ ?úÏ?: ÏµúÍ∑º Î™??ÑÎ†à?ÑÏùò ?âÍ∑†
     */
    #calculateInstantaneousFps(): number {
        if (this.#recentFrameTimes.length === 0) return 0;
        const avgFrameTime = this.#recentFrameTimes.reduce((a, b) => a + b, 0) / this.#recentFrameTimes.length;
        return Math.round(1000 / avgFrameTime);
    }

    /**
     * ?µÍ≥Ñ Í≥ÑÏÇ∞ Î∞?Ï∫êÏã±
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
     * ?ÑÎ†à???Ä???µÍ≥Ñ Í≥ÑÏÇ∞
     * ?ÖÍ≥Ñ ?úÏ? Î∞©Ïãù:
     * - Average FPS: ?ÑÏ≤¥ ?ÑÎ†à?ÑÏùò ?âÍ∑†
     * - 1% Low: ?òÏúÑ 1% ?ÑÎ†à?ÑÎì§???âÍ∑† FPS
     * - 0.1% Low: ?òÏúÑ 0.1% ?ÑÎ†à?ÑÎì§???âÍ∑† FPS
     */
    #calculateFrameTimeStatistics() {
        // ?âÍ∑† FPS Í≥ÑÏÇ∞
        const totalFrameTime = this.#frameTimesRaw.reduce((a, b) => a + b, 0);
        const avgFrameTime = totalFrameTime / this.#frameTimesRaw.length;
        const avgFps = Math.round(1000 / avgFrameTime);
        // ?ÑÎ†à???Ä???ïÎ†¨ (?¥Î¶ºÏ∞®Ïàú - Í∞Ä???êÎ¶∞ ?ÑÎ†à?ÑÏù¥ ??
        const sortedFrameTimes = [...this.#frameTimesRaw].sort((a, b) => b - a);
        const totalFrames = sortedFrameTimes.length;
        // 1% Low Í≥ÑÏÇ∞
        const low1Count = Math.max(1, Math.ceil(totalFrames * 0.01));
        const low1Frames = sortedFrameTimes.slice(0, low1Count);
        const low1AvgFrameTime = low1Frames.reduce((a, b) => a + b, 0) / low1Frames.length;
        const low1Fps = Math.round(1000 / low1AvgFrameTime);
        // 0.1% Low Í≥ÑÏÇ∞
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
