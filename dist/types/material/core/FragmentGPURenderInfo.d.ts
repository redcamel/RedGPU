import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ShaderVariantGenerator from "../../resources/wgslParser/core/ShaderVariantGenerator";
/**
 * [KO] 프래그먼트 셰이더의 GPU 렌더링 리소스 및 파이프라인 상태 정보를 보관하는 클래스입니다.
 * [EN] Class that holds GPU rendering resources and pipeline state information for a fragment shader.
 *
 * [KO] 머티리얼 초기화 시 내부적으로 자동 생성되어 셰이더 모듈, 바인드 그룹 레이아웃, 유니폼 버퍼 및 바인드 그룹을 관리합니다.
 * [EN] Automatically created internally during material initialization to manage shader modules, bind group layouts, uniform buffers, and bind groups.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 머티리얼 인스턴스를 통해 접근
 * // [EN] Access through a material instance
 * const renderInfo = material.gpuRenderInfo;
 * ```
 *
 * @category Material
 */
declare class FragmentGPURenderInfo {
    /**
     * [KO] 컴파일된 프래그먼트 GPUShaderModule
     * [EN] Compiled fragment GPUShaderModule
     */
    fragmentShaderModule: GPUShaderModule;
    /**
     * [KO] 프래그먼트 셰이더 소스 바리안트 생성기
     * [EN] Fragment shader source variant generator
     */
    fragmentShaderSourceVariant: ShaderVariantGenerator;
    /**
     * [KO] 프래그먼트 셰이더 조건부 분기 블록 식별자 목록
     * [EN] List of fragment shader conditional branch block identifiers
     */
    fragmentShaderVariantConditionalBlocks: string[];
    /**
     * [KO] 파싱된 프래그먼트 유니폼 구조체 정보
     * [EN] Parsed fragment uniform structure information
     */
    fragmentUniformInfo: any;
    /**
     * [KO] 프래그먼트 바인드 그룹 레이아웃 (GPUBindGroupLayout)
     * [EN] Fragment bind group layout (GPUBindGroupLayout)
     */
    fragmentBindGroupLayout: GPUBindGroupLayout;
    /**
     * [KO] 프래그먼트 유니폼 버퍼 (UniformBuffer)
     * [EN] Fragment uniform buffer (UniformBuffer)
     */
    fragmentUniformBuffer: UniformBuffer;
    /**
     * [KO] 프래그먼트 유니폼 바인드 그룹 (GPUBindGroup)
     * [EN] Fragment uniform bind group (GPUBindGroup)
     */
    fragmentUniformBindGroup: GPUBindGroup;
    /**
     * [KO] 파이프라인 생성에 사용되는 프래그먼트 렌더 상태 (GPUFragmentState)
     * [EN] Fragment render state (GPUFragmentState) used for pipeline creation
     */
    fragmentState: GPUFragmentState;
    /**
     * [KO] FragmentGPURenderInfo 인스턴스를 생성합니다.
     * [EN] Creates a FragmentGPURenderInfo instance.
     *
     * @param fragmentShaderModule -
     * [KO] 프래그먼트 셰이더 모듈
     * [EN] Fragment shader module
     * @param fragmentShaderSourceVariant -
     * [KO] 프래그먼트 셰이더 소스 바리안트 생성기
     * [EN] Fragment shader source variant generator
     * @param fragmentShaderVariantConditionalBlocks -
     * [KO] 프래그먼트 셰이더 바리안트 조건부 블록 목록
     * [EN] List of fragment shader variant conditional blocks
     * @param fragmentUniformInfo -
     * [KO] 프래그먼트 유니폼 구조체 정보
     * [EN] Fragment uniform structure information
     * @param fragmentBindGroupLayout -
     * [KO] 프래그먼트 바인드 그룹 레이아웃
     * [EN] Fragment bind group layout
     * @param fragmentUniformBuffer -
     * [KO] 프래그먼트 유니폼 버퍼
     * [EN] Fragment uniform buffer
     * @param fragmentUniformBindGroup -
     * [KO] 프래그먼트 유니폼 바인드 그룹 (선택)
     * [EN] Fragment uniform bind group (optional)
     * @param fragmentState -
     * [KO] 프래그먼트 렌더 상태 (선택)
     * [EN] Fragment render state (optional)
     */
    constructor(fragmentShaderModule: GPUShaderModule, fragmentShaderSourceVariant: ShaderVariantGenerator, fragmentShaderVariantConditionalBlocks: string[], fragmentUniformInfo: any, fragmentBindGroupLayout: GPUBindGroupLayout, fragmentUniformBuffer: UniformBuffer, fragmentUniformBindGroup?: GPUBindGroup, fragmentState?: GPUFragmentState);
    /**
     * [KO] 관리 중인 프래그먼트 유니폼 버퍼를 파기하고 모든 참조를 해제합니다.
     * [EN] Destroys the managed fragment uniform buffer and releases all references.
     */
    destroy(): void;
}
export default FragmentGPURenderInfo;
