import Mesh from "../display/mesh/Mesh";
import GPU_COMPARE_FUNCTION from "../gpuConst/GPU_COMPARE_FUNCTION";
import GPU_PRIMITIVE_TOPOLOGY from "../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import consoleAndThrowError from "../utils/consoleAndThrowError";

const validateCompareList: GPUCompareFunction[] = Object.values(GPU_COMPARE_FUNCTION)

/**
 * [KO] 객체의 깊이(Depth) 및 스텐실(Stencil) 테스트 상태를 관리하는 클래스입니다.
 * [EN] Class that manages depth and stencil test states for objects.
 *
 * [KO] Z-버퍼 기반의 깊이 테스트 활성 여부, 쓰기 설정, 비교 함수 및 스텐실 마스킹 등을 제어합니다.
 * [EN] Controls whether Z-buffer based depth testing is active, write settings, comparison functions, and stencil masking.
 *
 * * ### Example
 * ```typescript
 * const dsState = mesh.depthStencilState;
 * dsState.depthWriteEnabled = true;
 * dsState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.LESS;
 * ```
 * @category RenderState
 */
class DepthStencilState {
	#targetObject3D: Mesh;
	#format: GPUTextureFormat = 'depth32float';
	#formatValues: string[] = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];
	#depthWriteEnabled: boolean = true;
	#depthCompare?: GPUCompareFunction = GPU_COMPARE_FUNCTION.LESS_EQUAL;
	#stencilFront?: GPUStencilFaceState;
	#stencilBack?: GPUStencilFaceState;
	#stencilReadMask?: number;
	#stencilWriteMask?: number;
	#depthBias?: GPUDepthBias = 1;
	#depthBiasSlopeScale?: number = 1;
	#depthBiasClamp?: number = 1;

	/**
	 * [KO] DepthStencilState 인스턴스를 생성합니다.
	 * [EN] Creates an instance of DepthStencilState.
	 * 
	 * @param targetObject3D - 
	 * [KO] 상태가 적용될 대상 객체 
	 * [EN] Target object to which the state is applied
	 */
	constructor(targetObject3D: any) {
		this.#targetObject3D = targetObject3D;
	}

	/**
	 * [KO] 깊이/스텐실 텍스처 포맷을 가져오거나 설정합니다.
	 * [EN] Gets or sets the depth/stencil texture format.
	 * 
	 * @returns 
	 * [KO] 현재 설정된 GPUTextureFormat 
	 * [EN] Current GPUTextureFormat
	 */
	get format(): GPUTextureFormat {
		return this.#format;
	}

	set format(value: GPUTextureFormat) {
		if (this.#formatValues.includes(value)) {
			this.#format = value;
			this.#targetObject3D.dirtyPipeline = true;
		} else consoleAndThrowError(`Invalid value for format. Received ${value}. Expected one of: ${this.#formatValues.join(", ")}`);
	}

	/**
	 * [KO] 깊이 버퍼에 기록할지 여부를 가져오거나 설정합니다.
	 * [EN] Gets or sets whether to write to the depth buffer.
	 */
	get depthWriteEnabled(): boolean {
		return this.#depthWriteEnabled;
	}

	set depthWriteEnabled(value: boolean) {
		this.#depthWriteEnabled = value;
		this.#targetObject3D.dirtyPipeline = true;
	}

	/**
	 * [KO] 깊이 비교 함수를 가져오거나 설정합니다.
	 * [EN] Gets or sets the depth comparison function.
	 * 
	 * @returns 
	 * [KO] 현재 설정된 GPUCompareFunction 
	 * [EN] Current GPUCompareFunction
	 */
	get depthCompare(): GPUCompareFunction {
		return this.#depthCompare;
	}

	set depthCompare(value: GPUCompareFunction) {
		if (validateCompareList.includes(value)) {
			this.#depthCompare = value;
			this.#targetObject3D.dirtyPipeline = true;
		} else consoleAndThrowError(`Invalid value for depthCompare. Received ${value}. Expected one of: ${validateCompareList.join(", ")}`);
	}

	/**
	 * [KO] 전면(Front) 스텐실 상태를 가져오거나 설정합니다.
	 * [EN] Gets or sets the front stencil state.
	 */
	get stencilFront(): GPUStencilFaceState {
		return this.#stencilFront;
	}

	set stencilFront(value: GPUStencilFaceState) {
		this.#stencilFront = value;
		this.#targetObject3D.dirtyPipeline = true;
	}

	/**
	 * [KO] 후면(Back) 스텐실 상태를 가져오거나 설정합니다.
	 * [EN] Gets or sets the back stencil state.
	 */
	get stencilBack(): GPUStencilFaceState {
		return this.#stencilBack;
	}

	set stencilBack(value: GPUStencilFaceState) {
		this.#stencilBack = value;
		this.#targetObject3D.dirtyPipeline = true;
	}

	/**
	 * [KO] 스텐실 읽기 마스크를 가져오거나 설정합니다.
	 * [EN] Gets or sets the stencil read mask.
	 */
	get stencilReadMask(): number {
		return this.#stencilReadMask;
	}

	set stencilReadMask(value: number) {
		this.#stencilReadMask = value;
		this.#targetObject3D.dirtyPipeline = true;
	}

	/**
	 * [KO] 스텐실 쓰기 마스크를 가져오거나 설정합니다.
	 * [EN] Gets or sets the stencil write mask.
	 */
	get stencilWriteMask(): number {
		return this.#stencilWriteMask;
	}

	set stencilWriteMask(value: number) {
		this.#stencilWriteMask = value;
		this.#targetObject3D.dirtyPipeline = true;
	}

	/**
	 * [KO] 깊이 바이어스(Depth Bias) 값을 가져오거나 설정합니다.
	 * [EN] Gets or sets the depth bias value.
	 */
	get depthBias(): GPUDepthBias {
		return this.#depthBias;
	}

	set depthBias(value: GPUDepthBias) {
		this.#depthBias = value;
		this.#targetObject3D.dirtyPipeline = true;
	}

	/**
	 * [KO] 깊이 바이어스 슬로프 스케일(Slope Scale)을 가져오거나 설정합니다.
	 * [EN] Gets or sets the depth bias slope scale.
	 */
	get depthBiasSlopeScale(): number {
		return this.#depthBiasSlopeScale;
	}

	set depthBiasSlopeScale(value: number) {
		this.#depthBiasSlopeScale = value;
		this.#targetObject3D.dirtyPipeline = true;
	}

	/**
	 * [KO] 깊이 바이어스 클램프(Clamp) 값을 가져오거나 설정합니다.
	 * [EN] Gets or sets the depth bias clamp value.
	 */
	get depthBiasClamp(): number {
		return this.#depthBiasClamp;
	}

	set depthBiasClamp(value: number) {
		this.#depthBiasClamp = value;
		this.#targetObject3D.dirtyPipeline = true;
	}

	/**
	 * [KO] 현재 설정된 값들을 기반으로 GPUDepthStencilState 형식의 객체를 반환합니다.
	 * [EN] Returns an object in GPUDepthStencilState format based on the current settings.
	 */
	get state() {
		let enableBiasTopology = false;
		if (this.#targetObject3D?.primitiveState) {
			const {topology} = this.#targetObject3D.primitiveState;
			enableBiasTopology = topology === GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST ||
				topology === GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
		}
		return {
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
		};
	}
}

export default DepthStencilState;