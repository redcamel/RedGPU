import ColorRGBA from "../color/ColorRGBA";
import ResourceManager from "../resources/core/resourceManager/ResourceManager";
import AntialiasingManager from "./core/AntialiasingManager";
import RedGPUContextSizeManager from "./core/RedGPUContextSizeManager";
import RedGPUContextViewContainer from "./core/RedGPUContextViewContainer";
import RedGPUContextDetector from "./core/RedGPUContextDetector";
/**
 * RedGPUContext 클래스는 WebGPU 초기화 후 제공되는 최상위 컨텍스트 객체입니다.
 *
 * - GPU, 캔버스, 디바이스, 어댑터 등 WebGPU의 핵심 정보를 속성으로 가집니다.
 * - View3D 객체를 소유하며, 실제 최상위 컨테이너 역할을 합니다.
 * - 리사이즈, 배경색, 디버그 패널, 안티앨리어싱, 리소스 관리 등 다양한 기능을 제공합니다.
 *
 * @extends RedGPUContextViewContainer
 */
declare class RedGPUContext extends RedGPUContextViewContainer {
    #private;
    /** 현재 requestAnimationFrame ID (프레임 루프 관리용) */
    currentRequestAnimationFrame: number;
    /** 리사이즈 이벤트 핸들러 (캔버스 크기 변경 시 호출) */
    onResize: ((width: number, height: number) => void) | null;
    /** 현재 시간(프레임 기준, ms) */
    currentTime: number;
    constructor(htmlCanvas: HTMLCanvasElement, gpuAdapter: GPUAdapter, gpuDevice: GPUDevice, gpuContext: GPUCanvasContext, alphaMode: GPUCanvasAlphaMode);
    get antialiasingManager(): AntialiasingManager;
    get useDebugPanel(): boolean;
    set useDebugPanel(value: boolean);
    /**
     * Get the background color.
     *
     * @return {ColorRGBA} The background color.
     */
    get backgroundColor(): ColorRGBA;
    /**
     * Sets the background color of the element.
     *
     * @param {ColorRGBA} value - The color value to set as the background color.
     * @throws {TypeError} If the value parameter is not an instance of ColorRGBA.
     */
    set backgroundColor(value: ColorRGBA);
    /**
     * Retrieves the RedGPUContextDetector instance.
     *
     * @returns {RedGPUContextDetector} The RedGPUContextDetector instance.
     */
    get detector(): RedGPUContextDetector;
    /**
     * Retrieves the GPU canvas configuration description.
     *
     * @returns {GPUCanvasConfiguration} The configuration description.
     */
    get configurationDescription(): GPUCanvasConfiguration;
    /**
     * Retrieves the GPU adapter.
     *
     * @returns {GPUAdapter} The GPU adapter object.
     */
    get gpuAdapter(): GPUAdapter;
    /**
     * Retrieves the alpha mode of the GPUCanvas object.
     *
     * @return {GPUCanvasAlphaMode} The alpha mode of the GPUCanvas.
     */
    get alphaMode(): GPUCanvasAlphaMode;
    /**
     * Sets the alpha mode of the GPUCanvas.
     *
     * @param {GPUCanvasAlphaMode} value - The new alpha mode value to be set.
     */
    set alphaMode(value: GPUCanvasAlphaMode);
    /**
     * Returns the GPU canvas context.
     *
     * @returns {GPUCanvasContext} The GPU canvas context.
     */
    get gpuContext(): GPUCanvasContext;
    /**
     * Retrieves the GPU device associated with this object.
     *
     * @returns {GPUDevice} The GPU device.
     */
    get gpuDevice(): GPUDevice;
    /**
     * Retrieves the HTML canvas element associated with the current instance of the class.
     *
     * @returns {HTMLCanvasElement} The HTML canvas element.
     */
    get htmlCanvas(): HTMLCanvasElement;
    get keyboardKeyBuffer(): {
        [p: string]: boolean;
    };
    set keyboardKeyBuffer(value: {
        [p: string]: boolean;
    });
    /**
     * Returns the resource manager.
     *
     * @return {ResourceManager} The resource manager object.
     */
    get resourceManager(): ResourceManager;
    /**
     * Retrieves the size manager of the RedGPU context.
     *
     * @returns {RedGPUContextSizeManager} The size manager of the RedGPU context.
     */
    get sizeManager(): RedGPUContextSizeManager;
    /**
     * Retrieves the width of the object.
     *
     * @returns {number} The width of the object.
     */
    get width(): number | string;
    /**
     * Sets the width value for the size manager.
     *
     * @param {number | string} value - The width value to set. It can be either a number or a string.
     */
    set width(value: number | string);
    /**
     * Retrieves the height of the sizeManager.
     *
     * @returns {number | string} The height of the sizeManager.
     */
    get height(): number | string;
    /**
     * Sets the height value of the element.
     *
     * @param {number | string} value - The height value to set. It can be either a number or a string.
     */
    set height(value: number | string);
    get screenRectObject(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * Retrieves the render scale value from the size manager.
     *
     * @return {number} The render scale value.
     */
    get renderScale(): number;
    /**
     * Sets the render scale for the size manager.
     *
     * @param {number} value - The render scale value to set.
     */
    set renderScale(value: number);
    /**
     * Destroys the GPU device.
     * It releases any allocated resources and cleans up the GPU device.
     *
     */
    destroy(): void;
    /**
     * Sets the size of the element.
     *
     * @param {string | number} [w=this.width] - The width of the element. It can be either a string or a number. Defaults to the current width.
     * @param {string | number} [h=this.height] - The height of the element. It can be either a string or a number. Defaults to the current height.

     */
    setSize(w?: string | number, h?: string | number): void;
}
export default RedGPUContext;
