import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import ShaderVariantGenerator from "../../../resources/wgslParser/core/ShaderVariantGenerator";

/**
 * [KO] GPU 버텍스 렌더링 파이프라인 및 리소스 정보를 관리하는 클래스입니다.
 * [EN] Class that manages GPU vertex rendering pipeline and resource information.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
class VertexGPURenderInfo {
    /**
     * [KO] 버텍스 셰이더 모듈
     * [EN] Vertex shader module
     */
    vertexShaderModule: GPUShaderModule;
    /**
     * [KO] 버텍스 셰이더 바리안트 생성기
     * [EN] Vertex shader variant generator
     */
    vertexShaderSourceVariant: ShaderVariantGenerator;
    /**
     * [KO] 버텍스 셰이더 조건부 블록 목록
     * [EN] List of vertex shader conditional blocks
     */
    vertexShaderVariantConditionalBlocks: string[];
    /**
     * [KO] 버텍스 구조체 파싱 정보
     * [EN] Vertex structure parsing information
     */
    vertexStructInfo: any;
    /**
     * [KO] 버텍스 유니폼 정보
     * [EN] Vertex uniform information
     */
    vertexUniformInfo: any;
    /**
     * [KO] 버텍스 바인드 그룹 레이아웃
     * [EN] Vertex bind group layout
     */
    vertexBindGroupLayout: GPUBindGroupLayout;
    /**
     * [KO] 버텍스 유니폼 바인드 그룹
     * [EN] Vertex uniform bind group
     */
    vertexUniformBindGroup: GPUBindGroup;
    /**
     * [KO] 버텍스 유니폼 또는 스토리지 버퍼
     * [EN] Vertex uniform or storage buffer
     */
    vertexUniformBuffer: UniformBuffer | StorageBuffer;
    /**
     * [KO] 기본 렌더 파이프라인
     * [EN] Base render pipeline
     */
    pipeline: GPURenderPipeline;
    /**
     * [KO] 그림자 렌더 파이프라인
     * [EN] Shadow render pipeline
     */
    shadowPipeline: GPURenderPipeline;
    /**
     * [KO] 피킹 렌더 파이프라인
     * [EN] Picking render pipeline
     */
    pickingPipeline: GPURenderPipeline;

    /**
     * [KO] VertexGPURenderInfo 인스턴스를 생성합니다.
     * [EN] Creates a VertexGPURenderInfo instance.
     *
     * @param vertexShaderModule -
     * [KO] 버텍스 셰이더 모듈
     * [EN] Vertex shader module
     * @param vertexShaderSourceVariant -
     * [KO] 버텍스 셰이더 바리안트 생성기
     * [EN] Vertex shader variant generator
     * @param vertexShaderVariantConditionalBlocks -
     * [KO] 버텍스 셰이더 조건부 블록 목록
     * [EN] List of vertex shader conditional blocks
     * @param vertexUniformInfo -
     * [KO] 버텍스 유니폼 정보
     * [EN] Vertex uniform information
     * @param vertexBindGroupLayout -
     * [KO] 버텍스 바인드 그룹 레이아웃
     * [EN] Vertex bind group layout
     * @param vertexUniformBuffer -
     * [KO] 버텍스 유니폼 또는 스토리지 버퍼
     * [EN] Vertex uniform or storage buffer
     * @param vertexUniformBindGroup -
     * [KO] 버텍스 유니폼 바인드 그룹
     * [EN] Vertex uniform bind group
     * @param pipeline -
     * [KO] 기본 렌더 파이프라인
     * [EN] Base render pipeline
     * @param shadowPipeline -
     * [KO] 그림자 렌더 파이프라인 (선택)
     * [EN] Shadow render pipeline (optional)
     * @param pickingPipeline -
     * [KO] 피킹 렌더 파이프라인 (선택)
     * [EN] Picking render pipeline (optional)
     */
    constructor(
        vertexShaderModule: GPUShaderModule,
        vertexShaderSourceVariant: ShaderVariantGenerator,
        vertexShaderVariantConditionalBlocks: string[],
        vertexUniformInfo: any,
        vertexBindGroupLayout: GPUBindGroupLayout,
        vertexUniformBuffer: UniformBuffer | StorageBuffer,
        vertexUniformBindGroup: GPUBindGroup,
        pipeline: GPURenderPipeline,
        shadowPipeline?: GPURenderPipeline,
        pickingPipeline?: GPURenderPipeline,
    ) {
        this.vertexShaderModule = vertexShaderModule;
        this.vertexShaderSourceVariant = vertexShaderSourceVariant;
        this.vertexShaderVariantConditionalBlocks = vertexShaderVariantConditionalBlocks;
        this.vertexUniformInfo = vertexUniformInfo;
        this.vertexBindGroupLayout = vertexBindGroupLayout;
        this.vertexUniformBindGroup = vertexUniformBindGroup;
        this.vertexUniformBuffer = vertexUniformBuffer;
        this.pipeline = pipeline;
        this.shadowPipeline = shadowPipeline;
        this.pickingPipeline = pickingPipeline;
    }
}

Object.freeze(VertexGPURenderInfo)
export default VertexGPURenderInfo
