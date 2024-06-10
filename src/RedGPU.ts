import {RedGPUContext} from "./context";

export * from "./systemShaderDefine";
export * from "./context";
export * from "./main/view";
export * from "./postEffect";
export * from "./main/render";
export * from "./main/scene";
export * from "./camera";
export * from "./light";
export * from "./light/pointLightCluster";
export * from "./util";
export * from "./util/gl-matrix";
export * from "./material";
export * from "./object3d";
export * from "./resource/buffers";
export * from "./resource/geometry";
export * from "./resource/texture";
export * from "./temp/qurd/Quad";
const BASE_OPTION: GPURequestAdapterOptions = {
	powerPreference: "high-performance",
	forceFallbackAdapter: false
}
const BASE_REQUIRED_FEATURES: GPUDeviceDescriptor = {}
/**
 * test232
 * RedGPU initialization function.
 * @param {HTMLCanvasElement} canvas
 * @param label
 * @param {GPUCanvasAlphaMode=} alphaMode  알파모드 설정
 * @param {GPURequestAdapterOptions=} requestAdapterOptions
 * @param {Function=} HD_destroy GPUDevice가 lost 될 경우 발동할 핸들러
 *
 * @example
 * RedGPU.initialize(HTMLCanvasElement instance).then(
 *  (redGPUContext)=>{
 *     console.log(redGPUContext) // success!
 *  }
 * )
 */
const init = (canvas: HTMLCanvasElement, label?: string, alphaMode: GPUCanvasAlphaMode = 'premultiplied', requestAdapterOptions: GPURequestAdapterOptions = BASE_OPTION, HD_destroy?: Function) => {
	alphaMode = alphaMode || 'premultiplied'
	return new Promise(async (resolve, reject) => {
		let errorInfo;
		const checkCanvas = canvas => canvas instanceof HTMLCanvasElement
		const checkAdapter = gpu => {
			gpu.requestAdapter(requestAdapterOptions)
				.then(checkDevice)
				.catch(e => {
					errorInfo = {successYn: false, reason: e}
					reject(errorInfo)
				})
		}
		const checkDevice = adapter => {
			const gpuDeviceDescriptor: GPUDeviceDescriptor = {
				...BASE_REQUIRED_FEATURES,
				label: label || `gpuDevice : Label input is recommended.`
			};
			adapter.requestDevice(gpuDeviceDescriptor)
				.then(device => {
					console.log('device', device)
					checkContext(canvas, adapter, device)
					device.addEventListener('uncapturederror', (event) => {
						// TODO uncapturederror 보강처리
						// Re-surface the error, because adding an event listener may silence console logs.
						console.error('TODO A WebGPU error was not captured:', event.error);
					});
					device.lost.then(v => {
						console.log('GPUDevice Lost', v)
						device.destroy()
						HD_destroy?.(v)
					})
				})
				.catch(e => {
					errorInfo = {successYn: false, reason: e}
					reject(errorInfo)
					throw errorInfo
				})
		}
		const checkContext = (canvas, adapter, device) => {
			const context = canvas.getContext('webgpu')
			if (context) resolve(new RedGPUContext(canvas, adapter, device, context, alphaMode))
			else {
				errorInfo = {successYn: false, reason: 'canvas.getContext(\'webgpu\') is null'}
				reject(errorInfo)
			}
		}
		const {gpu} = navigator
		if (checkCanvas(canvas)) {
			if (gpu) checkAdapter(gpu)
			else {
				errorInfo = {
					successYn: false,
					reason: 'Cannot find navigator.gpu.'
				}
				reject(errorInfo)
			}
		} else {
			errorInfo = {
				successYn: false,
				reason: 'canvas is not HTMLCanvasElement '
			}
			reject(errorInfo)
		}
	})
}
export {init}
