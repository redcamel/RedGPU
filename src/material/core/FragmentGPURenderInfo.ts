import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ShaderVariantGenerator from "../../resources/wgslParser/core/ShaderVariantGenerator";

/**
 * [KO] GPU 프래그먼트 렌더링 작업에 대한 정보를 나타냅니다.
 * [EN] Represents information about a GPU fragment render operation.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 * @category Material
 */
class FragmentGPURenderInfo {
    /**
     * [KO] 프래그먼트 셰이더 모듈
     * [EN] Fragment shader module
     */
    fragmentShaderModule: GPUShaderModule;
    /**
     * [KO] 프래그먼트 셰이더 소스 바리안트 생성기
     * [EN] Fragment shader source variant generator
     */
    fragmentShaderSourceVariant: ShaderVariantGenerator;
    /**
     * [KO] 프래그먼트 셰이더 바리안트 조건부 블록 리스트
     * [EN] List of fragment shader variant conditional blocks
     */
    fragmentShaderVariantConditionalBlocks: string[];
    /**
     * [KO] 프래그먼트 유니폼 정보
     * [EN] Fragment globalStruct information
     */
    fragmentUniformInfo: any;
    /**
     * [KO] 프래그먼트 바인드 그룹 레이아웃
     * [EN] Fragment bind group layout
     */
    fragmentBindGroupLayout: GPUBindGroupLayout;
    /**
     * [KO] 프래그먼트 유니폼 버퍼
     * [EN] Fragment globalStruct buffer
     */
    fragmentUniformBuffer: UniformBuffer;
    /**
     * [KO] 프래그먼트 유니폼 바인드 그룹
     * [EN] Fragment globalStruct bind group
     */
    fragmentUniformBindGroup: GPUBindGroup;
    /**
     * [KO] 프래그먼트 렌더 상태
     * [EN] Fragment render state
     */
    fragmentState: GPUFragmentState;

    /**
     * [KO] FragmentGPURenderInfo 생성자
     * [EN] FragmentGPURenderInfo constructor
     * @param fragmentShaderModule -
     * [KO] 프래그먼트 셰이더 모듈
     * [EN] Fragment shader module
     * @param fragmentShaderSourceVariant -
     * [KO] 프래그먼트 셰이더 소스 바리안트 생성기
     * [EN] Fragment shader source variant generator
     * @param fragmentShaderVariantConditionalBlocks -
     * [KO] 프래그먼트 셰이더 바리안트 조건부 블록 리스트
     * [EN] List of fragment shader variant conditional blocks
     * @param fragmentUniformInfo -
     * [KO] 프래그먼트 유니폼 정보
     * [EN] Fragment globalStruct information
     * @param fragmentBindGroupLayout -
     * [KO] 프래그먼트 바인드 그룹 레이아웃
     * [EN] Fragment bind group layout
     * @param fragmentUniformBuffer -
     * [KO] 프래그먼트 유니폼 버퍼
     * [EN] Fragment globalStruct buffer
     * @param fragmentUniformBindGroup -
     * [KO] 프래그먼트 유니폼 바인드 그룹
     * [EN] Fragment globalStruct bind group
     * @param fragmentState -
     * [KO] 프래그먼트 렌더 상태
     * [EN] Fragment render state
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

    destroy() {
        if (this.fragmentUniformBuffer) {
            this.fragmentUniformBuffer.destroy();
            this.fragmentUniformBuffer = null;
        }
        this.fragmentShaderModule = null;
        this.fragmentShaderSourceVariant = null;
        this.fragmentShaderVariantConditionalBlocks = null;
        this.fragmentUniformInfo = null;
        this.fragmentBindGroupLayout = null;
        this.fragmentUniformBindGroup = null;
        this.fragmentState = null;
    }
}

Object.freeze(FragmentGPURenderInfo)
export default FragmentGPURenderInfo
