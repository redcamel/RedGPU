import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import {getVertexBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import Box from "../../../primitive/Box";
import Primitive from "../../../primitive/core/Primitive";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import VertexGPURenderInfo from "../../mesh/core/VertexGPURenderInfo";
import DepthStencilState from "../../../renderState/DepthStencilState";
import PrimitiveState from "../../../renderState/PrimitiveState";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import CubeTexture from "../../../resources/texture/CubeTexture";
import HDRTexture from "../../../resources/texture/hdr/HDRTexture";
import ANoiseTexture from "../../../resources/texture/noiseTexture/core/ANoiseTexture";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import SkyBoxMaterial from "./core/SkyBoxMaterial";
import vertexModuleSource from './shader/vertex.wgsl';

/** 파싱된 WGSL 셰이더 정보 */
const SHADER_INFO = parseWGSL(vertexModuleSource)
/** 버텍스 유니폼 구조체 정보 */
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
/** 버텍스 셰이더 모듈 이름 */
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SKYBOX'
/** 버텍스 바인드 그룹 디스크립터 이름 */
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_SKYBOX'
/** 파이프라인 디스크립터 레이블 */
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_SKYBOX'

/**
 * 3D 씬의 배경으로 사용되는 스카이박스 클래스
 *
 * 큐브 텍스처나 HDR 텍스처를 사용하여 360도 환경을 렌더링하며,
 * 텍스처 간 부드러운 전환 효과와 블러, 노출, 투명도 조절 기능을 제공합니다.
 *
 * @example
 * ```typescript
 * const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
 * view.skybox = skybox
 * ```
 * <iframe src="/RedGPU/examples/3d/skybox/skybox/"></iframe>
 *
 * 아래는 Skybox의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [Skybox using HDRTexture](/RedGPU/examples/3d/skybox/skyboxWithHDRTexture/)
 * @see [Skybox using IBL](/RedGPU/examples/3d/skybox/skyboxWithIbl/)
 *
 * @category SkyBox
 */
class SkyBox {
    /**
     * 모델 변환 행렬 (4x4 매트릭스)
     * @public
     */
    modelMatrix = mat4.create()
    /**
     * GPU 렌더링 정보 객체
     * @public
     */
    gpuRenderInfo: VertexGPURenderInfo
    /**
     * 파이프라인 재생성이 필요한지 나타내는 플래그
     * @private
     */
    #dirtyPipeline: boolean = true
    /**
     * 스카이박스의 기하학적 형태 (박스)
     * @private
     */
    #geometry: Primitive
    /**
     * 스카이박스 머티리얼
     * @private
     */
    #material: SkyBoxMaterial
    /**
     * RedGPU 컨텍스트 참조
     * @private
     */
    #redGPUContext: RedGPUContext
    /**
     * 프리미티브 렌더링 상태
     * @private
     */
    #primitiveState: PrimitiveState
    /**
     * 깊이 스텐실 상태
     * @private
     */
    #depthStencilState: DepthStencilState
    /**
     * 현재 스카이박스 텍스처
     * @private
     */
    #skyboxTexture: CubeTexture | HDRTexture
    /**
     * 전환 대상 텍스처
     * @private
     */
    #transitionTexture: CubeTexture | HDRTexture
    /**
     * 전환 시작 시간 (밀리초)
     * @private
     */
    #transitionStartTime: number = 0
    /**
     * 전환 지속 시간 (밀리초)
     * @private
     */
    #transitionDuration: number = 0
    /**
     * 전환 경과 시간 (밀리초)
     * @private
     */
    #transitionElapsed: number = 0

    /**
     * 새로운 SkyBox 인스턴스를 생성합니다.
     *
     * @param redGPUContext - RedGPU 렌더링 컨텍스트
     * @param cubeTexture - 스카이박스에 사용할 큐브 텍스처 또는 HDR 텍스처
     *
     * @throws {Error} redGPUContext가 유효하지 않은 경우
     *
     */
    constructor(redGPUContext: RedGPUContext, cubeTexture: CubeTexture | HDRTexture) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.#geometry = new Box(redGPUContext)
        this.#skyboxTexture = cubeTexture
        this.#material = new SkyBoxMaterial(redGPUContext, this.#skyboxTexture)
        this.#primitiveState = new PrimitiveState(this)
        this.#primitiveState.cullMode = GPU_CULL_MODE.NONE
        this.#depthStencilState = new DepthStencilState(this)
        // this.#depthStencilState.depthWriteEnabled = false
    }

    /**
     * 전환 지속 시간을 반환합니다.
     * @returns 전환 지속 시간 (밀리초)
     */
    get transitionDuration(): number {
        return this.#transitionDuration;
    }

    /**
     * 전환 경과 시간을 반환합니다.
     * @returns 전환 경과 시간 (밀리초)
     */
    get transitionElapsed(): number {
        return this.#transitionElapsed;
    }

    /**
     * 전환 진행률을 반환합니다.
     * @returns 0.0에서 1.0 사이의 전환 진행률
     */
    get transitionProgress(): number {
        return this.#material.transitionProgress;
    }

    /**
     * 스카이박스 블러 정도를 반환합니다.
     * @returns 0.0에서 1.0 사이의 블러 값
     */
    get blur(): number {
        return this.#material.blur;
    }

    /**
     * 스카이박스 블러 정도를 설정합니다.
     * @param value - 0.0에서 1.0 사이의 블러 값
     * @throws {Error} 값이 0.0-1.0 범위를 벗어나는 경우
     */
    set blur(value: number) {
        validatePositiveNumberRange(1, 0, 1)
        this.#material.blur = value;
    }

    /**
     * HDR 텍스처의 노출값을 반환합니다.
     * 일반 큐브 텍스처의 경우 항상 1을 반환합니다.
     * @returns 노출값 (HDR 텍스처) 또는 1 (일반 텍스처)
     */
    get exposure(): number {
        if (this.#skyboxTexture instanceof HDRTexture) {
            return this.#skyboxTexture.exposure;
        }
        return 1
    }

    /**
     * HDR 텍스처의 노출값을 설정합니다.
     * 일반 큐브 텍스처에는 영향을 주지 않습니다.
     * @param value - 양수 노출값
     * @throws {Error} 값이 양수가 아닌 경우
     */
    set exposure(value: number) {
        validatePositiveNumberRange(1)
        if (this.#skyboxTexture instanceof HDRTexture) this.#skyboxTexture.exposure = value;
    }

    /**
     * 스카이박스의 불투명도를 반환합니다.
     * @returns 0.0에서 1.0 사이의 불투명도 값
     */
    get opacity(): number {
        return this.#material.opacity;
    }

    /**
     * 스카이박스의 불투명도를 설정합니다.
     * @param value - 0.0에서 1.0 사이의 불투명도 값
     * @throws {Error} 값이 0.0-1.0 범위를 벗어나는 경우
     */
    set opacity(value: number) {
        validatePositiveNumberRange(1, 0, 1)
        this.#material.opacity = value;
    }

    /**
     * 현재 스카이박스 텍스처를 반환합니다.
     * @returns 현재 스카이박스 텍스처
     */
    get skyboxTexture(): CubeTexture | HDRTexture {
        return this.#skyboxTexture
    }

    /**
     * 스카이박스 텍스처를 설정합니다.
     * @param texture - 새로운 스카이박스 텍스처
     * @throws {Error} 텍스처가 null이거나 유효하지 않은 경우
     */
    set skyboxTexture(texture: CubeTexture | HDRTexture) {
        if (!texture) {
            consoleAndThrowError('SkyBox requires a valid CubeTexture | HDRTexture')
        } else {
            this.#skyboxTexture = texture
            this.#material.skyboxTexture = texture
        }
    }

    /**
     * 전환 대상 텍스처를 반환합니다.
     * @returns 전환 대상 텍스처 (전환 중이 아니면 undefined)
     */
    get transitionTexture(): CubeTexture | HDRTexture {
        return this.#transitionTexture
    }

    /**
     * 다른 텍스처로의 부드러운 전환을 시작합니다.
     *
     * @param transitionTexture - 전환할 대상 텍스처
     * @param duration - 전환 지속 시간 (밀리초, 기본값: 300)
     * @param transitionAlphaTexture - 전환 효과에 사용할 알파 노이즈 텍스처
     *
     * @example
     * ```typescript
     * // 1초 동안 새 텍스처로 전환
     * skybox.transition(newTexture, 1000, noiseTexture);
     * ```
     */
    transition(transitionTexture: CubeTexture | HDRTexture, duration: number = 300, transitionAlphaTexture: ANoiseTexture) {
        this.#transitionTexture = transitionTexture
        this.#material.transitionTexture = transitionTexture
        this.#transitionDuration = duration
        this.#transitionStartTime = performance.now()
        this.#material.transitionAlphaTexture = transitionAlphaTexture
    }

    /**
     * 스카이박스를 렌더링합니다.
     *
     * 이 메서드는 매 프레임마다 호출되어야 하며, 다음 작업을 수행합니다:
     * - MSAA 상태 업데이트
     * - GPU 렌더 정보 초기화 (첫 렌더링 시)
     * - 파이프라인 업데이트 (필요 시)
     * - 텍스처 전환 진행 상황 업데이트
     * - 실제 렌더링 명령 실행
     *
     * @param renderViewStateData - 렌더링 상태 및 디버그 정보
     *
     * @example
     * ```typescript
     * // 렌더링 루프에서
     * skybox.render(renderViewState);
     * ```
     */
    render(renderViewStateData: RenderViewStateData) {
        const {currentRenderPassEncoder, startTime} = renderViewStateData
        this.#updateMSAAStatus();
        if (!this.gpuRenderInfo) this.#initGPURenderInfos(this.#redGPUContext)
        if (this.#dirtyPipeline) {
            this.gpuRenderInfo.pipeline = this.#updatePipeline()
            this.#dirtyPipeline = false
            renderViewStateData.numDirtyPipelines++
        }
        if (this.#transitionStartTime) {
            this.#transitionElapsed = Math.max(startTime - this.#transitionStartTime, 0)
            if (this.#transitionElapsed > this.#transitionDuration) {
                this.#transitionStartTime = 0
                this.#material.transitionProgress = 0
                this.skyboxTexture = this.#transitionTexture
                this.#material.transitionTexture = null
                this.#dirtyPipeline = true
            } else {
                const value = this.#transitionElapsed / this.#transitionDuration
                this.#material.transitionProgress = value < 0 ? 0 : value > 1 ? 1 : value
            }
        }
        const {gpuRenderInfo} = this
        const {vertexUniformBindGroup, pipeline} = gpuRenderInfo
        const {indexBuffer} = this.#geometry
        const {triangleCount, indexCount, format} = indexBuffer
        currentRenderPassEncoder.setPipeline(pipeline)
        currentRenderPassEncoder.setVertexBuffer(0, this.#geometry.vertexBuffer.gpuBuffer)
        currentRenderPassEncoder.setBindGroup(1, vertexUniformBindGroup); // 버텍스 유니폼 버퍼 1번 고정
        currentRenderPassEncoder.setBindGroup(2, this.#material.gpuRenderInfo.fragmentUniformBindGroup)
        currentRenderPassEncoder.setIndexBuffer(indexBuffer.gpuBuffer, format)
        currentRenderPassEncoder.drawIndexed(indexBuffer.indexCount, 1, 0, 0, 0);
        //
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
     *
     * 바인드 그룹 레이아웃, 유니폼 버퍼, 바인드 그룹 등을 생성하고
     * 모델 매트릭스를 설정합니다.
     *
     * @private
     * @param redGPUContext - RedGPU 렌더링 컨텍스트
     */
    #initGPURenderInfos(redGPUContext: RedGPUContext) {
        const {resourceManager,} = this.#redGPUContext
        const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKYBOX_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
            'SKYBOX_VERTEX_BIND_GROUP_LAYOUT',
            getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
        )
        // UniformBuffer
        const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
        const vertexUniformBuffer: UniformBuffer = new UniformBuffer(redGPUContext, vertexUniformData, 'SKYBOX_VERTEX_UNIFORM_BUFFER', 'SKYBOX_VERTEX_UNIFORM_BUFFER')
        // modelMatrix
        mat4.identity(this.modelMatrix);
        mat4.scale(this.modelMatrix, this.modelMatrix, [10000, 10000, 10000]); 	//TODO 카메라 farClip 받도록 수정
        vertexUniformBuffer.writeOnlyBuffer(UNIFORM_STRUCT.members.modelMatrix, this.modelMatrix)
        // GPUBindGroupDescriptor
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
     *
     * 버텍스 셰이더, 바인드 그룹 레이아웃, 파이프라인 레이아웃을 설정하고
     * 현재 MSAA 설정을 반영한 새로운 렌더 파이프라인을 생성합니다.
     *
     * @private
     * @returns 새로 생성된 GPU 렌더 파이프라인
     */
    #updatePipeline(): GPURenderPipeline {
        const {resourceManager, gpuDevice, antialiasingManager} = this.#redGPUContext
        // 셰이더 모듈 설명자를 생성합니다.
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
        // BindGroup 레이아웃을 가져온다
        const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKYBOX_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
            'SKYBOX_VERTEX_BIND_GROUP_LAYOUT',
            getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
        )
        const bindGroupLayouts: GPUBindGroupLayout[] = [
            resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
            vertex_BindGroupLayout,
            this.#material.gpuRenderInfo.fragmentBindGroupLayout
        ]
        const pipelineLayoutDescriptor: GPUPipelineLayoutDescriptor = {bindGroupLayouts: bindGroupLayouts}
        const pipelineLayout: GPUPipelineLayout = resourceManager.createGPUPipelineLayout('SKYBOX_PIPELINE_LAYOUT', pipelineLayoutDescriptor);
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

Object.freeze(SkyBox)
export default SkyBox
