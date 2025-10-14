import ADebugItem from "./core/ADebugItem";
class DebugStatisticsDomService {
    dom;
    constructor(redGPUContext) {
        this.dom = document.createElement('div');
        this.dom.style.cssText = 'z-index: 1;position: sticky;top:0;background:#000;border-bottom:1px solid rgba(255,255,255,0.06);box-shadow:0 10px 10px rgba(0,0,0,0.5)';
        this.#initializeStatisticsDisplay(redGPUContext);
    }
    update(elapsedSeconds, currentFps, averageFps) {
        const fpsDetails = { elapsedSeconds, currentFps, averageFps };
        Object.entries(fpsDetails).forEach(([key, value]) => this.#updateElement(key, value));
    }
    #initializeStatisticsDisplay(redGPUContext) {
        this.dom.innerHTML = `
  		<div class="debug-group" >
          <div class='debug-item'>
              <span class='debug-item-title'>Frame</span>
              <div style="display: flex;align-items: center;justify-content: flex-end">
                  <div class="elapsedSeconds" style="width:45px;text-align: right">elapsedSeconds</div>
                  <div class="currentFps" style="width:50px;text-align: right">currentFps</div>
                  <div style="color:#fff;width: 50px;text-align: right" class="averageFps" >averageFps</div>
									<div class="panel_close" style="cursor:pointer;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#fff;width: 50px;background: red;margin-left:6px;">CLOSE</div>
              </div>
          </div>
      </div>
    `;
    }
    #updateElement(selector, value) {
        const targetElement = this.dom.querySelector(`.${selector}`);
        if (targetElement) {
            const updatedValue = value.toLocaleString();
            if (targetElement.innerHTML !== updatedValue) {
                targetElement.innerHTML = updatedValue;
            }
        }
    }
}
class Fps extends ADebugItem {
    #elapsedSeconds;
    #previousTimeStamp;
    #frameCount = 0;
    #totalFps = 0;
    #addedEvent = false;
    constructor(redGPUContext) {
        super();
        this.debugStatisticsDomService = new DebugStatisticsDomService(redGPUContext);
        this.#previousTimeStamp = performance.now();
    }
    update(debugRender, redGPUContext, time) {
        this.#updateElapsedTime(time);
        const fpsDetails = this.#calculateFpsDetails();
        const { elapsedSeconds, currentFps, averageFps } = fpsDetails;
        if (!this.#addedEvent) {
            document.querySelector('.panel_close').addEventListener('click', () => {
                redGPUContext.useDebugPanel = false;
            });
            this.#addedEvent = true;
        }
        this.debugStatisticsDomService.update(`${elapsedSeconds.toLocaleString()}ms`, `${currentFps.toLocaleString()} FPS`, `${averageFps} AVG`);
    }
    #updateElapsedTime(time) {
        this.#elapsedSeconds = (time - this.#previousTimeStamp) || 16;
        this.#previousTimeStamp = time;
        this.#frameCount++;
    }
    #calculateFpsDetails() {
        const fpsLowerBound = 1 / (this.#elapsedSeconds / 1000);
        const currentFps = Math.round(fpsLowerBound);
        this.#totalFps += fpsLowerBound;
        const averageFps = Math.round(this.#totalFps / this.#frameCount);
        return { currentFps, averageFps, elapsedSeconds: this.#elapsedSeconds };
    }
}
export default Fps;
