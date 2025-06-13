import RedGPUContext from "./context/RedGPUContext";

/**
 * WebGPU를 비동기적으로 초기화합니다. 초기화에 실패한 경우 선택적으로 제공된 콜백 함수를 호출합니다.
 * <br/>Asynchronously initializes WebGPU. If initialization fails, it invokes an optionally provided callback function.
 *
 * @param {HTMLCanvasElement} canvas - WebGPU 초기화를 위한 HTML 캔버스 요소입니다.
 * <br/>The HTMLCanvasElement for WebGPU initialization.
 *
 * @param {Function} onWebGPUInitialized - WebGPU가 성공적으로 초기화된 후 호출되는 함수입니다.
 * <br/>The function to be called after WebGPU has been successfully initialized.
 *
 * @param {function=} onFailInitialized - WebGPU 초기화가 실패한 후에 호출되는 선택적인 함수입니다.
 * <br/>An optional function that is called if WebGPU initialization fails.
 *
 * @param {function=} onDestroy - 장치가 손실된 경우에 호출되는 선택적인 함수입니다.
 * <br/>An optional function that is called when the device is lost.
 *
 * @param {GPUCanvasAlphaMode} alphaMode - 캔버스의 알파 모드로서 기본 값은 premultiplied 입니다.
 * <br/>The alpha mode of the canvas, the default value is 'premultiplied'.
 *
 * @param {GPURequestAdapterOptions} requestAdapterOptions - 어댑터 요청에 대한 옵션으로써 기본 값은 { powerPreference: "high-performance", forceFallbackAdapter: false }입니다.
 * <br/>The options for adapter request, defaults to { powerPreference: "high-performance", forceFallbackAdapter: false }.
 */
const init = async (
	canvas: HTMLCanvasElement,
	onWebGPUInitialized: Function,
	onFailInitialized?: Function,
	onDestroy?: Function,
	alphaMode: GPUCanvasAlphaMode = 'premultiplied',
	requestAdapterOptions: GPURequestAdapterOptions = {
		powerPreference: "high-performance",
		forceFallbackAdapter: false,
	},
) => {
	const {gpu} = navigator
	const errorHandler = (e: Error, defaultMsg: string) => {
		const msg = generateErrorMessage(e, defaultMsg);
		console.error('\n============\n', msg, '\n============\n');
		onFailInitialized?.(msg);
	};
	const validateAndRequestAdapter = async (targetGPU: GPU) => {
		if (!targetGPU) errorHandler(null, `Cannot find navigator.gpu`)
		try {
			const adapter: GPUAdapter = await targetGPU.requestAdapter(requestAdapterOptions)
			console.log('PASS adapter', adapter)
			await validateAndRequestDevice(adapter)
		} catch (e) {
			errorHandler(e, `Failed to request adapter or validate device with target GPU: ${targetGPU}, error message is ${e.message}`);
		}
	}
	const validateAndRequestDevice = async (adapter: GPUAdapter) => {
		const requiredFeatures = []
		if (adapter.features.has("texture-compression-astc")) {
			//TODO - 확장확인
			requiredFeatures.push("texture-compression-astc");
		}
		const gpuDeviceDescriptor: GPUDeviceDescriptor = {
			requiredFeatures
		};
		try {
			const device: GPUDevice = await adapter.requestDevice(gpuDeviceDescriptor)
			console.log('PASS device', device)
			validateAndInitializeContext(canvas, adapter, device)
		} catch (e) {
			errorHandler(null, `Failed to request device. Adapter was ${adapter}, error message is ${e.message}`)
		}
	}
	const validateAndInitializeContext = (canvas: HTMLCanvasElement, adapter: GPUAdapter, device: GPUDevice) => {
		const context = canvas.getContext('webgpu')
		if (!context) {
			errorHandler(new Error(`Failed to get context from canvas: ${canvas.id || canvas}`), 'Failed to get webgpu initialize from canvas');
			return
		}
		try {
			const redGPUContext: RedGPUContext = new RedGPUContext(canvas, adapter, device, context, alphaMode)
			onWebGPUInitialized(redGPUContext)
			device.addEventListener('uncapturederror', (event: GPUUncapturedErrorEvent) => {
				console.warn('TODO A WebGPU error was not captured:', event);
				console.warn(event.error?.message);
				// onFailInitialized?.(errorMsg);
				window.cancelAnimationFrame(redGPUContext.currentRequestAnimationFrame)
			});
			device.lost.then((info: GPUDeviceLostInfo) => {
				console.warn(info)
				console.warn(`Device lost occurred: ${info.message}`)
				if (info.reason === 'destroyed') onDestroy?.(info)
			})
		} catch (e) {
			onFailInitialized(errorHandler(e, ''))
			//TODO 이거 먼가 이상하다 확인해야함
		}
	}
	const initializeWebGPU = async () => {
		if (!(onWebGPUInitialized instanceof Function)) {
			errorHandler(null, `Expected onWebGPUInitialized, but received : ${onWebGPUInitialized}`);
			return
		}
		if (!(canvas instanceof HTMLCanvasElement)) {
			errorHandler(null, `Expected HTMLCanvasElement, but received : ${canvas}`);
			return;
		}
		await validateAndRequestAdapter(gpu);
	}
	try {
		await initializeWebGPU()
	} catch (e) {
		errorHandler(e, `Unexpected error occurred during WebGPU initialization: ${e.message}`);
	}
}
export default init
const generateErrorMessage = (e: any, defaultMsg: string): string => {
	let msg = defaultMsg;
	// Check if 'e' is an instance of Error
	if (e instanceof Error) {
		msg = e.message ?? defaultMsg;
		if (typeof e.stack === 'string') {
			msg += `\nStack Trace: ${e.stack}`;
		}
	} else {
		console.warn('generateErrorMessage function expected an Error instance, but got: ', e);
	}
	return msg;
}
