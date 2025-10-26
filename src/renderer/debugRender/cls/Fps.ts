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

	update(fps: string, low1: string, low01: string, frameTime: string) {
		const stats = {fps, low1, low01, frameTime};
		Object.entries(stats).forEach(([key, value]) => this.#updateElement(key, value));
	}

	#initializeStatisticsDisplay(redGPUContext: RedGPUContext) {
		this.dom.innerHTML = `
        <div class="debug-group">
            <div class='debug-item'>
                <span class='debug-item-title'>Performance</span>
                <div style="display: flex;align-items: center;justify-content: flex-end;gap:8px;">
                    <div style="display:flex;flex-direction:column;align-items:flex-end">
                        <div class="fps" style="color:#0f0;font-size:16px;font-weight:bold">60 FPS</div>
                        <div class="frameTime" style="color:#666;font-size:10px">16.67ms</div>
                    </div>
                    <div style="width:1px;height:30px;background:rgba(255,255,255,0.1)"></div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end">
                        <div class="low1" style="color:#ff0;font-size:12px">1%: 60</div>
                        <div class="low01" style="color:#f80;font-size:12px">0.1%: 60</div>
                    </div>
                    <div class="panel_close" style="cursor:pointer;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#fff;width: 50px;height:48px;background: red;margin-left:6px;font-size:10px;font-weight:bold;">CLOSE</div>
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

	// 현재 FPS (30프레임 스무딩)
	#fpsBuffer: number[] = [];
	#fpsBufferSize: number = 60;

	// Frame Time 버퍼 (모든 프레임 타임 저장)
	#allFrameTimes: number[] = [];
	#maxFrameTimeBuffer: number = 600;

	constructor(redGPUContext: RedGPUContext) {
		super();
		this.debugStatisticsDomService = new DebugStatisticsDomService(redGPUContext);
	}

	update(debugRender: DebugRender, redGPUContext: RedGPUContext, time: number) {
		if (this.#frameCount === 0) {
			this.#previousTimeStamp = time;
			this.#frameCount++;
			return;
		}

		const deltaTime = time - this.#previousTimeStamp;
		this.#previousTimeStamp = time;
		this.#frameCount++;

		if (!this.#addedEvent) {
			const closeBtn = document.querySelector('.panel_close');
			if (closeBtn) {
				closeBtn.addEventListener('click', () => {
					redGPUContext.useDebugPanel = false;
				});
				this.#addedEvent = true;
			}
		}

		const safeFrameTime = Math.max(deltaTime, 0.001);
		const instantFps = 1000 / safeFrameTime;

		// Frame Time 저장
		this.#allFrameTimes.push(safeFrameTime);
		if (this.#allFrameTimes.length > this.#maxFrameTimeBuffer) {
			this.#allFrameTimes.shift();
		}

		// 현재 FPS (스무딩)
		this.#fpsBuffer.push(instantFps);
		if (this.#fpsBuffer.length > this.#fpsBufferSize) {
			this.#fpsBuffer.shift();
		}
		const currentFps = Math.round(
			this.#fpsBuffer.reduce((a, b) => a + b, 0) / this.#fpsBuffer.length
		);

		// 1% Low / 0.1% Low 계산
		const { low1Fps, low01Fps } = this.#calculateLowFps();

		this.debugStatisticsDomService.update(
			`${currentFps} FPS`,
			`1%: ${low1Fps}`,
			`0.1%: ${low01Fps}`,
			`${safeFrameTime.toFixed(2)}ms`
		);
	}

	#calculateLowFps() {
		if (this.#allFrameTimes.length < 100) {
			return { low1Fps: 0, low01Fps: 0 };
		}

		// Frame Times를 정렬 (높은 것부터 = 느린 프레임부터)
		const sortedFrameTimes = [...this.#allFrameTimes].sort((a, b) => b - a);

		// 1% Low: 가장 느린 1%의 프레임들
		const low1Index = Math.ceil(sortedFrameTimes.length * 0.01);
		const low1FrameTime = sortedFrameTimes[low1Index - 1];
		const low1Fps = Math.round(1000 / low1FrameTime);

		// 0.1% Low: 가장 느린 0.1%의 프레임들
		const low01Index = Math.ceil(sortedFrameTimes.length * 0.001);
		const low01FrameTime = sortedFrameTimes[Math.max(0, low01Index - 1)];
		const low01Fps = Math.round(1000 / low01FrameTime);

		return { low1Fps, low01Fps };
	}
}

export default Fps;
