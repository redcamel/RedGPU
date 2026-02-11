import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import GPU_CULL_MODE from "../../gpuConst/GPU_CULL_MODE";
import {getVertexBindGroupLayoutDescriptorFromShaderInfo} from "../../material/core";
import Primitive from "../../primitive/core/Primitive";
import Sphere from "../../primitive/Sphere";
import DepthStencilState from "../../renderState/DepthStencilState";
import PrimitiveState from "../../renderState/PrimitiveState";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import VertexGPURenderInfo from "../mesh/core/VertexGPURenderInfo";
import RenderViewStateData from "../view/core/RenderViewStateData";
import SkyAtmosphereMaterial from "./core/SkyAtmosphereMaterial";
import TransmittanceGenerator from "./core/generator/TransmittanceGenerator";
import vertexModuleSource from './shader/vertex.wgsl';

/** 파싱된 WGSL 셰이더 정보 */
const SHADER_INFO = parseWGSL(vertexModuleSource)
/** 버텍스 유니폼 구조체 정보 */
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
/** 버텍스 셰이더 모듈 이름 */
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SKY_ATMOSPHERE'
/** 버텍스 바인드 그룹 디스크립터 이름 */
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_SKY_ATMOSPHERE'
/** 파이프라인 디스크립터 레이블 */
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_SKY_ATMOSPHERE'

/**
 * [KO] 대기 산란을 표현하는 SkyAtmosphere 클래스입니다.
 * [EN] SkyAtmosphere class that represents atmospheric scattering.
 *
 * [KO] 물리 기반 대기 산란 연산을 통해 사실적인 하늘과 노을 등을 표현합니다.
 * [EN] Represents realistic sky and sunsets through physics-based atmospheric scattering calculations.
 *
 * ### Example
 * ```typescript
 * const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
 * view.skyAtmosphere = skyAtmosphere;
 * ```
 *
 * @category SkyAtmosphere
 */
class SkyAtmosphere {
    /**
     * [KO] 모델 변환 행렬 (4x4 매트릭스)
     * [EN] Model transformation matrix (4x4 matrix)
     */
    modelMatrix = mat4.create()
    /**
     * [KO] GPU 렌더링 정보 객체
     * [EN] GPU rendering information object
     */
    gpuRenderInfo: VertexGPURenderInfo
    /**
     * [KO] 파이프라인 재생성이 필요한지 나타내는 플래그
     * [EN] Flag indicating if pipeline regeneration is needed
     */
    #dirtyPipeline: boolean = true
    #renderBundle: GPURenderBundle
    /**
     * [KO] SkyAtmosphere의 기하학적 형태 (구체)
     * [EN] Geometric shape of the SkyAtmosphere (sphere)
     */
    #geometry: Primitive
    /**
     * [KO] SkyAtmosphere 머티리얼
     * [EN] SkyAtmosphere material
     */
    #material: SkyAtmosphereMaterial
    /**
     * [KO] RedGPU 컨텍스트 참조
     * [EN] Reference to RedGPU context
     */
    #redGPUContext: RedGPUContext
    /**
     * [KO] 프리미티브 렌더링 상태
     * [EN] Primitive rendering state
     */
    #primitiveState: PrimitiveState
    /**
     * [KO] 깊이 스텐실 상태
     * [EN] Depth stencil state
     */
    #depthStencilState: DepthStencilState
    #transmittanceGenerator: TransmittanceGenerator
    #sunDirection: Float32Array = new Float32Array([0, 1, 0])
    #prevSystemUniform_Vertex_UniformBindGroup: GPUBindGroup

    // [KO] 대기 물리 파라미터 [EN] Atmospheric physical parameters
    #earthRadius: number = 6360.0;
    #atmosphereHeight: number = 60.0;
    #mieScattering: number = 0.00399;
    #mieExtinction: number = 0.00444;
    #rayleighScattering: [number, number, number] = [0.0058, 0.0135, 0.0331];
    #dirtyLUT: boolean = true;

    /**
     * [KO] 새로운 SkyAtmosphere 인스턴스를 생성합니다.
     * [EN] Creates a new SkyAtmosphere instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     */
    constructor(redGPUContext: RedGPUContext) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        // 대기를 표현할 거대 구체 생성
        this.#geometry = new Sphere(redGPUContext, 1, 32, 32)
        this.#material = new SkyAtmosphereMaterial(redGPUContext)
        this.#primitiveState = new PrimitiveState(this)
        this.#primitiveState.cullMode = GPU_CULL_MODE.NONE
        this.#depthStencilState = new DepthStencilState(this)

        // LUT Generator 초기화
        this.#transmittanceGenerator = new TransmittanceGenerator(redGPUContext)
        this.#material.transmittanceTexture = this.#transmittanceGenerator.lutTexture
    }

    get earthRadius(): number { return this.#earthRadius; }
    set earthRadius(v: number) { this.#earthRadius = v; this.#dirtyLUT = true; }

    get atmosphereHeight(): number { return this.#atmosphereHeight; }
    set atmosphereHeight(v: number) { this.#atmosphereHeight = v; this.#dirtyLUT = true; }

    get mieScattering(): number { return this.#mieScattering; }
    set mieScattering(v: number) { this.#mieScattering = v; this.#dirtyLUT = true; }

    get mieExtinction(): number { return this.#mieExtinction; }
    set mieExtinction(v: number) { this.#mieExtinction = v; this.#dirtyLUT = true; }

    get rayleighScattering(): [number, number, number] { return this.#rayleighScattering; }
    set rayleighScattering(v: [number, number, number]) { this.#rayleighScattering = v; this.#dirtyLUT = true; }

    /**
     * [KO] 태양 방향을 반환합니다.
     * [EN] Returns the sun direction.
     */
    get sunDirection(): Float32Array {
        return this.#sunDirection;
    }

    /**
     * [KO] 태양 방향을 설정합니다.
     * [EN] Sets the sun direction.
     * @param value - [KO] 태양 방향 벡터 [EN] Sun direction vector
     */
    set sunDirection(value: Float32Array) {
        this.#sunDirection = value;
        this.#material.sunDirection = value;
    }

    /**
     * [KO] SkyAtmosphere를 렌더링합니다.
     * [EN] Renders the SkyAtmosphere.
     *
     * @param renderViewStateData -
     * [KO] 렌더링 상태 및 디버그 정보
     * [EN] Rendering state and debug info
     */
    render(renderViewStateData: RenderViewStateData) {
        const {currentRenderPassEncoder, view} = renderViewStateData
        const {indexBuffer} = this.#geometry
        const {triangleCount, indexCount, format} = indexBuffer
        const {gpuDevice, antialiasingManager} = this.#redGPUContext
        
        // LUT 갱신 체크
        if (this.#dirtyLUT) {
            this.#transmittanceGenerator.render({
                earthRadius: this.#earthRadius,
                atmosphereHeight: this.#atmosphereHeight,
                mieScattering: this.#mieScattering,
                mieExtinction: this.#mieExtinction,
                rayleighScattering: this.#rayleighScattering
            });
            this.#dirtyLUT = false;
        }

        this.#updateMSAAStatus();
        
        if (!this.gpuRenderInfo) this.#initGPURenderInfos(this.#redGPUContext)
        
        // 카메라 위치에 맞춰 구체 이동 (카메라 팔로잉)
        const {camera} = view;
        const cameraPos = (camera as any).position || [0, 0, 0];
        mat4.identity(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, cameraPos);
        // 매우 크게 확장
        mat4.scale(this.modelMatrix, this.modelMatrix, [5000, 5000, 5000]); 
        
        this.gpuRenderInfo.vertexUniformBuffer.writeOnlyBuffer(UNIFORM_STRUCT.members.modelMatrix, this.modelMatrix)

        if (this.#dirtyPipeline || this.#material.dirtyPipeline || this.#prevSystemUniform_Vertex_UniformBindGroup !== view.systemUniform_Vertex_UniformBindGroup) {
            this.gpuRenderInfo.pipeline = this.#updatePipeline()
            this.#dirtyPipeline = false
            renderViewStateData.numDirtyPipelines++
            this.#prevSystemUniform_Vertex_UniformBindGroup = view.systemUniform_Vertex_UniformBindGroup
            
            this.#material.dirtyPipeline = false
            const bundleEncoder = gpuDevice.createRenderBundleEncoder({
                ...view.basicRenderBundleEncoderDescriptor,
                label: 'skyAtmosphere'
            })
            const {gpuRenderInfo} = this
            const {vertexUniformBindGroup, pipeline} = gpuRenderInfo
            bundleEncoder.setPipeline(pipeline)
            bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
            bundleEncoder.setVertexBuffer(0, this.#geometry.vertexBuffer.gpuBuffer)
            bundleEncoder.setBindGroup(1, vertexUniformBindGroup);
            bundleEncoder.setBindGroup(2, this.#material.gpuRenderInfo.fragmentUniformBindGroup)
            bundleEncoder.setIndexBuffer(indexBuffer.gpuBuffer, format)
            bundleEncoder.drawIndexed(indexBuffer.indexCount, 1, 0, 0, 0);
            this.#renderBundle = bundleEncoder.finish({
                label: 'renderBundle skyAtmosphere',
            })
        }
        
        currentRenderPassEncoder.executeBundles([this.#renderBundle])
        
        renderViewStateData.num3DObjects++
        renderViewStateData.numDrawCalls++
        renderViewStateData.numTriangles += triangleCount
        renderViewStateData.numPoints += indexCount
    }

    /**
     * MSAA (Multi-Sample Anti-Aliasing) 상태 변경을 확인하고 파이프라인을 갱신합니다.
     * @private
     */
    #updateMSAAStatus() {
        const {changedMSAA} = this.#redGPUContext.antialiasingManager
        if (changedMSAA) {
            this.#dirtyPipeline = true
        }
    }

    /**
     * GPU 렌더링 정보를 초기화합니다.
     * @private
     * @param redGPUContext - RedGPU 렌더링 컨텍스트
     */
    #initGPURenderInfos(redGPUContext: RedGPUContext) {
        const {resourceManager} = this.#redGPUContext
        const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
            'SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT',
            getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
        )
        
        const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
        const vertexUniformBuffer: UniformBuffer = new UniformBuffer(redGPUContext, vertexUniformData, 'SKY_ATMOSPHERE_VERTEX_UNIFORM_BUFFER', 'SKY_ATMOSPHERE_VERTEX_UNIFORM_BUFFER')
        
        const vertexBindGroupDescriptor: GPUBindGroupDescriptor = {
            layout: vertex_BindGroupLayout,
            label: VERTEX_BIND_GROUP_DESCRIPTOR_NAME,
            entries: [{
                binding: 0,
                resource: {
                    buffer: vertexUniformBuffer.gpuBuffer,
                    offset: 0,
                    size: vertexUniformBuffer.size
                },
            }]
        }
        const vertexUniformBindGroup: GPUBindGroup = redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
        this.gpuRenderInfo = new VertexGPURenderInfo(
            null,
            SHADER_INFO.shaderSourceVariant,
            SHADER_INFO.conditionalBlocks,
            UNIFORM_STRUCT,
            vertex_BindGroupLayout,
            vertexUniformBuffer,
            vertexUniformBindGroup,
            this.#updatePipeline(),
        )
    }

    /**
     * 렌더링 파이프라인을 업데이트합니다.
     * @private
     * @returns 새로 생성된 GPU 렌더 파이프라인
     */
    #updatePipeline(): GPURenderPipeline {
        const {resourceManager, gpuDevice, antialiasingManager} = this.#redGPUContext
        const vModuleDescriptor: GPUShaderModuleDescriptor = {code: vertexModuleSource}
        const vertexShaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
            VERTEX_SHADER_MODULE_NAME,
            vModuleDescriptor
        )
        const vertexState: GPUVertexState = {
            module: vertexShaderModule,
            entryPoint: 'main',
            buffers: this.#geometry.gpuRenderInfo.buffers
        }
        
        const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
            'SKY_ATMOSPHERE_VERTEX_BIND_GROUP_LAYOUT',
            getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
        )
        const bindGroupLayouts: GPUBindGroupLayout[] = [
            resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
            vertex_BindGroupLayout,
            this.#material.gpuRenderInfo.fragmentBindGroupLayout
        ]
        const pipelineLayoutDescriptor: GPUPipelineLayoutDescriptor = {bindGroupLayouts: bindGroupLayouts}
        const pipelineLayout: GPUPipelineLayout = resourceManager.createGPUPipelineLayout('SKY_ATMOSPHERE_PIPELINE_LAYOUT', pipelineLayoutDescriptor);
        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: PIPELINE_DESCRIPTOR_LABEL,
            layout: pipelineLayout,
            vertex: vertexState,
            fragment: this.#material.gpuRenderInfo.fragmentState,
            primitive: this.#primitiveState.state,
            depthStencil: this.#depthStencilState.state,
            multisample: {
                count: antialiasingManager.useMSAA ? 4 : 1,
            },
        }
        return gpuDevice.createRenderPipeline(pipelineDescriptor)
    }
}

Object.freeze(SkyAtmosphere)
export default SkyAtmosphere