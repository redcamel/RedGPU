import ColorRGBA from "../color/ColorRGBA";
import View3D from "../display/view/View3D";
import PICKING_EVENT_TYPE from "../picking/PICKING_EVENT_TYPE";
import ResourceManager from "../resources/resourceManager/ResourceManager";
import consoleAndThrowError from "../utils/consoleAndThrowError";
import AntialiasingManager from "./antialiasing/AntialiasingManager";
import RedGPUContextSizeManager from "./core/RedGPUContextSizeManager";
import RedGPUContextViewContainer from "./core/RedGPUContextViewContainer";
import RedGPUContextDetector from "./detector/RedGPUContextDetector";

/**
 * RedGPU.initialize 실행이후 생성 제공되는 객체.
 * - WebGPU 초기화시 얻어낸 기본 정보들을 속성으로 가진다
 * - View3D 객체를 소유하며 실제 최상위 컨테이너 역활을 한다.
 */
class RedGPUContext extends RedGPUContextViewContainer {
	currentRequestAnimationFrame: number
	onResize: ((width: number, height: number) => void) | null = null;
	#configurationDescription: GPUCanvasConfiguration
	readonly #gpuAdapter: GPUAdapter
	#alphaMode: GPUCanvasAlphaMode
	readonly #gpuContext: GPUCanvasContext
	readonly #gpuDevice: GPUDevice
	readonly #htmlCanvas: HTMLCanvasElement
	readonly #sizeManager: RedGPUContextSizeManager
	readonly #detector: RedGPUContextDetector
	readonly #resourceManager: ResourceManager
	#backgroundColor: ColorRGBA = new ColorRGBA(0, 0, 0, 1)
	#useDebugPanel: boolean = false
	#keyboardKeyBuffer: { [key: string]: boolean } = {}
	#antialiasingManager: AntialiasingManager

	constructor(
		htmlCanvas: HTMLCanvasElement,
		gpuAdapter: GPUAdapter,
		gpuDevice: GPUDevice,
		gpuContext: GPUCanvasContext,
		alphaMode: GPUCanvasAlphaMode
	) {
		super()
		this.#gpuAdapter = gpuAdapter
		this.#gpuDevice = gpuDevice
		this.#gpuContext = gpuContext
		this.#alphaMode = alphaMode
		this.#htmlCanvas = htmlCanvas
		this.#sizeManager = new RedGPUContextSizeManager(this)
		this.#detector = new RedGPUContextDetector(this)
		this.#resourceManager = new ResourceManager(this)
		this.#antialiasingManager = new AntialiasingManager(this)
		this.#initialize()
	}

	get antialiasingManager(): AntialiasingManager {
		return this.#antialiasingManager;
	}

	get useDebugPanel(): boolean {
		return this.#useDebugPanel;
	}

	set useDebugPanel(value: boolean) {
		this.#useDebugPanel = value;
	}

	/**
	 * Get the background color.
	 *
	 * @return {ColorRGBA} The background color.
	 */
	get backgroundColor(): ColorRGBA {
		return this.#backgroundColor;
	}

	/**
	 * Sets the background color of the element.
	 *
	 * @param {ColorRGBA} value - The color value to set as the background color.
	 * @throws {TypeError} If the value parameter is not an instance of ColorRGBA.
	 */
	set backgroundColor(value: ColorRGBA) {
		if (!(value instanceof ColorRGBA)) consoleAndThrowError('allow only ColorRGBA instance')
		this.#backgroundColor = value;
	}

	/**
	 * Retrieves the RedGPUContextDetector instance.
	 *
	 * @returns {RedGPUContextDetector} The RedGPUContextDetector instance.
	 */
	get detector(): RedGPUContextDetector {
		return this.#detector;
	}

	/**
	 * Retrieves the GPU canvas configuration description.
	 *
	 * @returns {GPUCanvasConfiguration} The configuration description.
	 */
	get configurationDescription(): GPUCanvasConfiguration {
		return this.#configurationDescription;
	}

	/**
	 * Retrieves the GPU adapter.
	 *
	 * @returns {GPUAdapter} The GPU adapter object.
	 */
	get gpuAdapter(): GPUAdapter {
		return this.#gpuAdapter;
	}

	/**
	 * Retrieves the alpha mode of the GPUCanvas object.
	 *
	 * @return {GPUCanvasAlphaMode} The alpha mode of the GPUCanvas.
	 */
	get alphaMode(): GPUCanvasAlphaMode {
		return this.#alphaMode;
	}

	/**
	 * Sets the alpha mode of the GPUCanvas.
	 *
	 * @param {GPUCanvasAlphaMode} value - The new alpha mode value to be set.
	 */
	set alphaMode(value: GPUCanvasAlphaMode) {
		this.#alphaMode = value;
		this.#configure()
	}

	/**
	 * Returns the GPU canvas context.
	 *
	 * @returns {GPUCanvasContext} The GPU canvas context.
	 */
	get gpuContext(): GPUCanvasContext {
		return this.#gpuContext;
	}

	/**
	 * Retrieves the GPU device associated with this object.
	 *
	 * @returns {GPUDevice} The GPU device.
	 */
	get gpuDevice(): GPUDevice {
		return this.#gpuDevice;
	}

	/**
	 * Retrieves the HTML canvas element associated with the current instance of the class.
	 *
	 * @returns {HTMLCanvasElement} The HTML canvas element.
	 */
	get htmlCanvas(): HTMLCanvasElement {
		return this.#htmlCanvas;
	}

	get keyboardKeyBuffer(): { [p: string]: boolean } {
		return this.#keyboardKeyBuffer;
	}

	set keyboardKeyBuffer(value: { [p: string]: boolean }) {
		this.#keyboardKeyBuffer = value;
	}

	/**
	 * Returns the resource manager.
	 *
	 * @return {ResourceManager} The resource manager object.
	 */
	get resourceManager(): ResourceManager {
		return this.#resourceManager;
	}

	/**
	 * Retrieves the size manager of the RedGPU context.
	 *
	 * @returns {RedGPUContextSizeManager} The size manager of the RedGPU context.
	 */
	get sizeManager(): RedGPUContextSizeManager {
		return this.#sizeManager;
	}

	/**
	 * Retrieves the width of the object.
	 *
	 * @returns {number} The width of the object.
	 */
	get width(): number | string {
		return this.#sizeManager.width;
	}

	/**
	 * Sets the width value for the size manager.
	 *
	 * @param {number | string} value - The width value to set. It can be either a number or a string.
	 */
	set width(value: number | string) {
		this.#sizeManager.width = value;
	}

	/**
	 * Retrieves the height of the sizeManager.
	 *
	 * @returns {number | string} The height of the sizeManager.
	 */
	get height(): number | string {
		return this.#sizeManager.height;
	}

	/**
	 * Sets the height value of the element.
	 *
	 * @param {number | string} value - The height value to set. It can be either a number or a string.
	 */
	set height(value: number | string) {
		this.#sizeManager.height = value;
	}

	get screenRectObject() {
		return this.#sizeManager.screenRectObject
	}

	/**
	 * Retrieves the render scale value from the size manager.
	 *
	 * @return {number} The render scale value.
	 */
	get renderScale(): number {
		return this.#sizeManager.renderScale;
	}

	/**
	 * Sets the render scale for the size manager.
	 *
	 * @param {number} value - The render scale value to set.
	 */
	set renderScale(value: number) {
		this.#sizeManager.renderScale = value;
		this.viewList.forEach((view: View3D) => {
			view.setPosition()
			view.setSize()
		})
	}

	/**
	 * Destroys the GPU device.
	 * It releases any allocated resources and cleans up the GPU device.
	 *
	 */
	destroy() {
		this.#gpuDevice.destroy()
	}

	/**
	 * Sets the size of the element.
	 *
	 * @param {string | number} [w=this.width] - The width of the element. It can be either a string or a number. Defaults to the current width.
	 * @param {string | number} [h=this.height] - The height of the element. It can be either a string or a number. Defaults to the current height.

	 */
	setSize(w: string | number = this.width, h: string | number = this.height) {
		this.sizeManager.setSize(w, h)
	}

	saveCanvasAsImage() {
		const canvas = this.htmlCanvas
		const image = canvas.toDataURL('image/png')
		const a = document.createElement('a')
		a.href = image
		a.download = 'image.png'
		a.click()
	}

	/**
	 * Initializes the software.
	 *
	 * @function initialize
	 */
	#initialize() {
		this.#configure()
		this.sizeManager.setSize('100%', '100%')
		window?.addEventListener('resize', () => {
			this.sizeManager.setSize()
			this.viewList.forEach((view: View3D) => {
				view.setSize()
				view.setPosition()
			})
		});
		const eventList = this.detector.isMobile ?
			[
				'click',
				'touchmove',
				'touchstart',
				'touchend'
			]
			:
			[
				'click',
				'mousemove',
				'mousedown',
				'mouseup'
			]
		eventList.forEach((eventName) => {
			const eventMap = (
				this.detector.isMobile
					?
					{
						click: PICKING_EVENT_TYPE.CLICK,
						touchmove: PICKING_EVENT_TYPE.MOVE,
						touchstart: PICKING_EVENT_TYPE.DOWN,
						touchend: PICKING_EVENT_TYPE.UP,
					} :
					{
						click: PICKING_EVENT_TYPE.CLICK,
						mousemove: PICKING_EVENT_TYPE.MOVE,
						mousedown: PICKING_EVENT_TYPE.DOWN,
						mouseup: PICKING_EVENT_TYPE.UP,
					}
			)
			this.#htmlCanvas.addEventListener(eventName, (e: MouseEvent) => {
				const eventTypeForDevice = eventMap[e.type]
				// console.log('eventTypeForDevice',e.type)
				this.viewList.forEach((view: View3D) => {
					if (this.detector.isMobile && e instanceof TouchEvent && e.touches.length > 0) {
						// Touch event
						view.pickingManager.mouseX = e.touches[0].clientX * devicePixelRatio - view.pixelRectObject.x;
						view.pickingManager.mouseY = e.touches[0].clientY * devicePixelRatio - view.pixelRectObject.y;
					} else if (e instanceof MouseEvent) {
						// Mouse event
						view.pickingManager.mouseX = e.offsetX * devicePixelRatio - view.pixelRectObject.x;
						view.pickingManager.mouseY = e.offsetY * devicePixelRatio - view.pixelRectObject.y;
					}
					if (eventTypeForDevice === PICKING_EVENT_TYPE.CLICK) {
						view.pickingManager.lastMouseClickEvent = {...e, type: eventTypeForDevice}
					} else {
						view.pickingManager.lastMouseEvent = {...e, type: eventTypeForDevice}
					}
				})
			})
		})
		{
			// 키보드 이벤트 설정
			const HD_keyDown = (e: KeyboardEvent) => {
				this.#keyboardKeyBuffer[e.key] = true
			};
			const HD_keyUp = (e: KeyboardEvent) => {
				this.#keyboardKeyBuffer[e.key] = false
			};
			window?.addEventListener('keyup', HD_keyUp);
			window?.addEventListener('keydown', HD_keyDown);
		}
		const resizeObserver = new ResizeObserver(entries => {
			// for (const entry of entries) {
			// 	if (entry.target != canvas) { continue; }
			// 	canvas.width = entry.devicePixelContentBoxSize[0].inlineSize;
			// 	canvas.height = entry.devicePixelContentBoxSize[0].blockSize;
			// }
			// this.sizeManager.setSize()
			console.log('entries', entries)
		});
		resizeObserver.observe(this.#htmlCanvas);
	}

	/**
	 * Configures the GPU context with the specified configuration settings.
	 *
	 */
	#configure() {
		const presentationFormat: GPUTextureFormat = navigator.gpu.getPreferredCanvasFormat();
		this.#configurationDescription = {
			device: this.#gpuDevice,
			format: presentationFormat,
			alphaMode: this.#alphaMode,
		};
		console.log(`configurationDescription`, this.#configurationDescription);
		this.#gpuContext.configure(this.#configurationDescription);
	}

	/**
	 * Resize function.
	 *
	 * @function resize
	 *
	 * @description
	 * Method to resize the component or element based on the current size manager.
	 *
	 */
	#resize = () => {
		this.sizeManager.setSize()
	}
}

Object.freeze(RedGPUContext)
export default RedGPUContext
