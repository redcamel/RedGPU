import RedGPUContext from "../../../context/RedGPUContext";
import DebugRender from "../DebugRender";
import ADebugItem from "./core/ADebugItem";

class DebugStatisticsDomService {
    dom: HTMLElement;

    constructor() {
        this.dom = document.createElement('div');
        this.dom.style.cssText = 'z-index: 1;position: sticky;top:0;background:#000;border-bottom:1px solid rgba(255,255,255,0.06);box-shadow:0 10px 10px rgba(0,0,0,0.5)'
        this.#initializeStatisticsDisplay();
    }

    update(elapsedSeconds: string, currentFps: string, averageFps: string) {
        const fpsDetails = {elapsedSeconds, currentFps, averageFps};
        Object.entries(fpsDetails).forEach(([key, value]) => this.#updateElement(key, value));
    }

    #initializeStatisticsDisplay() {
        this.dom.innerHTML = `
  		<div class="debug-group" >
          <div class='debug-item'>
              <span class='debug-item-title'>Frame</span>
              <span style="text-align: right">
                  <div class="elapsedSeconds">elapsedSeconds</div>
                  <div class="currentFps">currentFps</div>
                  <div style="color:#fff" class="averageFps">averageFps</div>
              </span>
          </div>
      </div>
    `;
    }

    #updateElement(selector: string, value: any) {
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
    #elapsedSeconds: number;
    #previousTimeStamp: number;
    #frameCount: number = 0;
    #totalFps: number = 0;

    constructor() {
        super()
        this.debugStatisticsDomService = new DebugStatisticsDomService();
        this.#previousTimeStamp = performance.now();
    }

    update(debugRender: DebugRender, redGPUContext: RedGPUContext, time: number) {
        this.#updateElapsedTime(time);
        const fpsDetails = this.#calculateFpsDetails();
        const {elapsedSeconds, currentFps, averageFps} = fpsDetails;
        this.debugStatisticsDomService.update(
            `${elapsedSeconds.toLocaleString()}ms`,
            `${currentFps.toLocaleString()} fps`,
            `AVG: ${averageFps} fps`
        );
    }

    #updateElapsedTime(time: number) {
        this.#elapsedSeconds = (time - this.#previousTimeStamp) || 16;
        this.#previousTimeStamp = time;
        this.#frameCount++;
    }

    #calculateFpsDetails() {
        const fpsLowerBound = 1 / (this.#elapsedSeconds / 1000);
        const currentFps = Math.round(fpsLowerBound);
        this.#totalFps += fpsLowerBound;
        const averageFps = Math.round(this.#totalFps / this.#frameCount);
        return {currentFps, averageFps, elapsedSeconds: this.#elapsedSeconds};
    }
}

export default Fps
