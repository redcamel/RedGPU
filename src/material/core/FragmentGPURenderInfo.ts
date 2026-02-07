import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ShaderVariantGenerator from "../../resources/wgslParser/core/ShaderVariantGenerator";

/**
 * [KO] GPU 프래그먼트 렌더링 작업에 필요한 정보를 관리하는 클래스입니다.
 * [EN] Class that manages information required for GPU fragment rendering operations.
 *
 * [KO] 셰이더 모듈, 바인드 그룹 레이아웃, 유니폼 버퍼 등 프래그먼트 단계의 렌더링 상태를 캡슐화합니다.
 * [EN] Encapsulates rendering states for the fragment stage, such as shader modules, bind group layouts, and uniform buffers.
 * @category Material
 */
class FragmentGPURenderInfo {
	/** [KO] 프래그먼트 셰이더 모듈 [EN] Fragment shader module */
	fragmentShaderModule: GPUShaderModule;
	/** [KO] 셰이더 바리안트 생성기 [EN] Shader variant generator */
	fragmentShaderSourceVariant: ShaderVariantGenerator;
	/** [KO] 활성화된 셰이더 조건부 블록 리스트 [EN] List of active shader conditional blocks */
	fragmentShaderVariantConditionalBlocks: string[];
	/** [KO] 프래그먼트 유니폼 구조체 정보 [EN] Fragment uniform structure information */
	fragmentUniformInfo: any;
	/** [KO] 프래그먼트 바인드 그룹 레이아웃 [EN] Fragment bind group layout */
	fragmentBindGroupLayout: GPUBindGroupLayout;
	/** [KO] 프래그먼트 유니폼 버퍼 [EN] Fragment uniform buffer */
	fragmentUniformBuffer: UniformBuffer;
	/** [KO] 프래그먼트 유니폼 바인드 그룹 [EN] Fragment uniform bind group */
	fragmentUniformBindGroup: GPUBindGroup;
	/** [KO] 프래그먼트 렌더 상태 [EN] Fragment render state */
	fragmentState: GPUFragmentState;

	/**
	 * [KO] FragmentGPURenderInfo 인스턴스를 생성합니다.
	 * [EN] Creates a FragmentGPURenderInfo instance.
	 *
	 * @param fragmentShaderModule -
	 * [KO] 프래그먼트 셰이더 모듈
	 * [EN] Fragment shader module
	 * @param fragmentShaderSourceVariant -
	 * [KO] 셰이더 바리안트 생성기
	 * [EN] Shader variant generator
	 * @param fragmentShaderVariantConditionalBlocks -
	 * [KO] 조건부 블록 리스트
	 * [EN] List of conditional blocks
	 * @param fragmentUniformInfo -
	 * [KO] 유니폼 정보
	 * [EN] Uniform information
	 * @param fragmentBindGroupLayout -
	 * [KO] 바인드 그룹 레이아웃
	 * [EN] Bind group layout
	 * @param fragmentUniformBuffer -
	 * [KO] 유니폼 버퍼
	 * [EN] Uniform buffer
	 * @param fragmentUniformBindGroup -
	 * [KO] 유니폼 바인드 그룹 (선택적)
	 * [EN] Uniform bind group (optional)
	 * @param fragmentState -
	 * [KO] 프래그먼트 상태 (선택적)
	 * [EN] Fragment state (optional)
	 */
	constructor(
		fragmentShaderModule: GPUShaderModule,
		fragmentShaderSourceVariant: ShaderVariantGenerator,
		fragmentShaderVariantConditionalBlocks: string[],
		fragmentUniformInfo: any,
		fragmentBindGroupLayout: GPUBindGroupLayout,
		fragmentUniformBuffer: UniformBuffer,
		fragmentUniformBindGroup?: GPUBindGroup,
		fragmentState?: GPUFragmentState
	) {
		this.fragmentShaderModule = fragmentShaderModule;
		this.fragmentShaderSourceVariant = fragmentShaderSourceVariant;
		this.fragmentShaderVariantConditionalBlocks = fragmentShaderVariantConditionalBlocks;
		this.fragmentUniformInfo = fragmentUniformInfo;
		this.fragmentBindGroupLayout = fragmentBindGroupLayout;
		this.fragmentUniformBuffer = fragmentUniformBuffer;
		this.fragmentUniformBindGroup = fragmentUniformBindGroup;
		this.fragmentState = fragmentState;
	}
}

Object.freeze(FragmentGPURenderInfo)
export default FragmentGPURenderInfo
