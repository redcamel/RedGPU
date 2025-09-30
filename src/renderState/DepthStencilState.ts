import Mesh from "../display/mesh/Mesh";
import GPU_COMPARE_FUNCTION from "../gpuConst/GPU_COMPARE_FUNCTION";
import GPU_PRIMITIVE_TOPOLOGY from "../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import consoleAndThrowError from "../utils/consoleAndThrowError";

const validateCompareList: GPUCompareFunction[] = Object.values(GPU_COMPARE_FUNCTION)

/**
 * 3D Mesh 등 Object3D의 GPU 렌더 파이프라인에서 깊이(Depth) 및 스텐실(Stencil) 테스트 상태를 관리하는 객체입니다.
 *
 * 각종 깊이/스텐실 관련 설정을 통해 Z-버퍼 기반의 깊이 테스트, 스텐실 마스킹, 폴리곤 오프셋 등 다양한 렌더링 효과를 제어할 수 있습니다.
 *
 */
class DepthStencilState {
	#targetObject3D: Mesh
	#format: GPUTextureFormat = 'depth32float';
	#formatValues: string[] = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];
	#depthWriteEnabled: boolean = true;
	#depthCompare?: GPUCompareFunction = GPU_COMPARE_FUNCTION.LESS_EQUAL;
	//
	#stencilFront?: GPUStencilFaceState;
	#stencilBack?: GPUStencilFaceState;
	#stencilReadMask?: number;
	#stencilWriteMask?: number;
	#depthBias?: GPUDepthBias = 1;
	#depthBiasSlopeScale?: number = 1;
	#depthBiasClamp?: number = 1;

	/**
	 * DepthStencilState 생성자
	 * @param targetObject3D - 상태가 적용될 Mesh 또는 Object3D 객체
	 * @category Buffer
	 */
	constructor(targetObject3D: any) {
		this.#targetObject3D = targetObject3D
	}

	/**
	 * 깊이/스텐실 포맷 반환
	 * @category Buffer
	 */
	get format(): GPUTextureFormat {
		return this.#format;
	}

	/**
	 * 깊이/스텐실 포맷 설정
	 * @param value - GPUTextureFormat 값
	 * @category Buffer
	 */
	set format(value: GPUTextureFormat) {
		if (this.#formatValues.includes(value)) {
			this.#format = value;
			this.#targetObject3D.dirtyPipeline = true
		} else consoleAndThrowError(`Invalid value for format. Received ${value}. Expected one of: ${this.#formatValues.join(", ")}`);
	}

	/**
	 * 깊이 버퍼 쓰기 활성화 여부 반환
	 * @category Buffer
	 */
	get depthWriteEnabled(): boolean {
		return this.#depthWriteEnabled;
	}

	/**
	 * 깊이 버퍼 쓰기 활성화 여부 설정
	 * @param value - true면 깊이 버퍼에 기록
	 * @category Buffer
	 */
	set depthWriteEnabled(value: boolean) {
		this.#depthWriteEnabled = value;
		this.#targetObject3D.dirtyPipeline = true
	}

	/**
	 * 깊이 비교 함수 반환
	 * @category Buffer
	 */
	get depthCompare(): GPUCompareFunction {
		return this.#depthCompare
	}

	/**
	 * 깊이 비교 함수 설정
	 * @param value - GPUCompareFunction 값
	 * @category Buffer
	 */
	set depthCompare(value: GPUCompareFunction) {
		if (validateCompareList.includes(value)) {
			this.#depthCompare = value;
			this.#targetObject3D.dirtyPipeline = true
		} else consoleAndThrowError(`Invalid value for depthCompare. Received ${value}. Expected one of: ${validateCompareList.join(", ")}`);
	}

	/**
	 * 스텐실 전면 상태 반환
	 * @category Buffer
	 */
	get stencilFront(): GPUStencilFaceState {
		return this.#stencilFront
	}

	/**
	 * 스텐실 전면 상태 설정
	 * @param value - GPUStencilFaceState 값
	 * @category Buffer
	 */
	set stencilFront(value: GPUStencilFaceState) {
		this.#stencilFront = value;
		this.#targetObject3D.dirtyPipeline = true
	}

	/**
	 * 스텐실 후면 상태 반환
	 * @category Buffer
	 */
	get stencilBack(): GPUStencilFaceState {
		return this.#stencilBack
	}

	/**
	 * 스텐실 후면 상태 설정
	 * @param value - GPUStencilFaceState 값
	 * @category Buffer
	 */
	set stencilBack(value: GPUStencilFaceState) {
		this.#stencilBack = value;
		this.#targetObject3D.dirtyPipeline = true
	}

	/**
	 * 스텐실 읽기 마스크 반환
	 * @category Buffer
	 */
	get stencilReadMask(): number {
		return this.#stencilReadMask
	}

	/**
	 * 스텐실 읽기 마스크 설정
	 * @param value - 마스크 값
	 * @category Buffer
	 */
	set stencilReadMask(value: number) {
		this.#stencilReadMask = value;
		this.#targetObject3D.dirtyPipeline = true
	}

	/**
	 * 스텐실 쓰기 마스크 반환
	 * @category Buffer
	 */
	get stencilWriteMask(): number {
		return this.#stencilWriteMask
	}

	/**
	 * 스텐실 쓰기 마스크 설정
	 * @param value - 마스크 값
	 * @category Buffer
	 */
	set stencilWriteMask(value: number) {
		this.#stencilWriteMask = value;
		this.#targetObject3D.dirtyPipeline = true
	}

	/**
	 * 깊이 바이어스 반환
	 * @category Buffer
	 */
	get depthBias(): GPUDepthBias {
		return this.#depthBias
	}

	/**
	 * 깊이 바이어스 설정
	 * @param value - 바이어스 값
	 * @category Buffer
	 */
	set depthBias(value: GPUDepthBias) {
		this.#depthBias = value;
		this.#targetObject3D.dirtyPipeline = true
	}

	/**
	 * 깊이 바이어스 SlopeScale 반환
	 * @category Buffer
	 */
	get depthBiasSlopeScale(): number {
		return this.#depthBiasSlopeScale
	}

	/**
	 * 깊이 바이어스 SlopeScale 설정
	 * @param value - SlopeScale 값
	 * @category Buffer
	 */
	set depthBiasSlopeScale(value: number) {
		this.#depthBiasSlopeScale = value;
		this.#targetObject3D.dirtyPipeline = true
	}

	/**
	 * 깊이 바이어스 Clamp 반환
	 * @category Buffer
	 */
	get depthBiasClamp(): number {
		return this.#depthBiasClamp
	}

	/**
	 * 깊이 바이어스 Clamp 설정
	 * @param value - Clamp 값
	 * @category Buffer
	 */
	set depthBiasClamp(value: number) {
		this.#depthBiasClamp = value;
		this.#targetObject3D.dirtyPipeline = true
	}

	/**
	 * 현재 설정된 DepthStencil 상태 객체 반환
	 * @category Buffer
	 */
	get state() {
		let enableBiasTopology = false
		if (this.#targetObject3D?.primitiveState) {
			const {topology} = this.#targetObject3D.primitiveState
			enableBiasTopology = topology === GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST ||
				topology === GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
		}
		const state = {
			format: this.#format,
			depthWriteEnabled: this.#depthWriteEnabled,
			depthCompare: this.#depthCompare,
			stencilFront: this.#stencilFront,
			stencilBack: this.#stencilBack,
			stencilReadMask: this.#stencilReadMask,
			stencilWriteMask: this.#stencilWriteMask,
			depthBias: enableBiasTopology ? this.#depthBias : null,
			depthBiasSlopeScale: enableBiasTopology ? this.#depthBiasSlopeScale : null,
			depthBiasClamp: enableBiasTopology ? this.#depthBiasClamp : null
		}
		return state
	}
}

export default DepthStencilState;
