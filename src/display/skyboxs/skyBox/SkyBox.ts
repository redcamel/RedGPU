import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import {getVertexBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import Box from "../../../primitive/Box";
import Primitive from "../../../primitive/core/Primitive";
import DepthStencilState from "../../../renderState/DepthStencilState";
import PrimitiveState from "../../../renderState/PrimitiveState";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import CubeTexture from "../../../resources/texture/CubeTexture";
import DirectCubeTexture from "../../../resources/texture/DirectCubeTexture";
import ANoiseTexture from "../../../resources/texture/noiseTexture/core/ANoiseTexture";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import VertexGPURenderInfo from "../../mesh/core/VertexGPURenderInfo";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import SkyBoxMaterial from "./core/SkyBoxMaterial";
import vertexModuleSource from './shader/vertex.wgsl';
import RedGPUObject from "../../../base/RedGPUObject";

/** 파싱된 WGSL 셰이더 정보 */
const SHADER_INFO = parseWGSL('SKYBOX_VERTEX', vertexModuleSource)
/** 버텍스 유니폼 구조체 정보 */
const UNIFORM_STRUCT = ResourceManager.GLOBAL_SSAO_VERTEX_STRUCT;
/** 버텍스 셰이더 모듈 이름 */
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SKYBOX'
/** 버텍스 바인드 그룹 디스크립터 이름 */
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_SKYBOX'
/** 파이프라인 디스크립터 레이블 */
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_SKYBOX'

/**
 * [KO] 3D 씬의 원경 및 환경 맵 정보로 사용되는 스카이박스(Skybox) 클래스입니다.
 * [EN] Skybox class used as the distant view and environment map information for 3D scenes.
 *
 * [KO] 큐브 맵 텍스처를 이용하여 무한한 공간 배경을 렌더링합니다. 물리 기반 렌더링에 적합한 물리적 휘도(Luminance) 설정, 아티스트용 강도 배율, 실시간 전환 효과(Transition) 및 블러(Blur)와 불투명도 조절 기능을 지원합니다.
 * [EN] Renders an infinite background space using a cube map texture. It supports physical luminance configuration suitable for PBR, artistic intensity multipliers, real-time transition effects, and control over blur and opacity.
 *
 * ### Example
 * ```typescript
 * const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
 * view.skybox = skybox;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/" ></iframe>
 *
 * [KO] 아래는 SkyBox의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of SkyBox.
 * @see [SkyBox basic example](/RedGPU/examples/3d/skybox/skybox/)
 * @see [SkyBox transition example](/RedGPU/examples/3d/skybox/transition/skyboxTransition/)
 * @see [SkyBox transition example2](/RedGPU/examples/3d/skybox/transition/skyboxTransitionWithNoiseTexture/)
 *
 * @category SkyBox
 */
class SkyBox extends RedGPUObject {
    /**
     * [KO] 스카이박스 메쉬 모델 변환 행렬
     * [EN] Skybox mesh model transformation matrix
     */
    modelMatrix = mat4.create()
    /**
     * [KO] GPU 렌더링 및 유니폼 정보 객체
     * [EN] GPU rendering and uniform information object
     */
    gpuRenderInfo: VertexGPURenderInfo

    #dirtyPipeline: boolean = true
    #renderBundle: GPURenderBundle
    #geometry: Primitive
    #material: SkyBoxMaterial
    #primitiveState: PrimitiveState
    #depthStencilState: DepthStencilState
    #texture: CubeTexture | DirectCubeTexture
    #transitionTexture: CubeTexture | DirectCubeTexture
    #transitionStartTime: number = 0
    #transitionDuration: number = 0
    #transitionElapsed: number = 0
    #prevSystemUniform_Vertex_UniformBindGroup: GPUBindGroup
    #luminance: number = 25000.0;
    #lastUpdateMSAAID: string
    #globalVertexBufferSlotIndex: number = -1
    /**
     * [KO] SkyBox 인스턴스를 생성합니다.
     * [EN] Creates an instance of SkyBox.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param texture -
     * [KO] 배경으로 사용할 큐브 텍스처 객체
     * [EN] Cube texture object to use as the background
     * @param luminance -
     * [KO] 물리적 휘도 (단위: cd/m² 또는 Nit, 기본값: 25000 Nit)
     * [EN] Physical luminance (unit: cd/m² or Nit, default: 25000 Nit)
     */
    constructor(redGPUContext: RedGPUContext, texture: CubeTexture | DirectCubeTexture, luminance: number = 25000) {
        super(redGPUContext)
        this.#geometry = new Box(redGPUContext)
        this.#texture = texture
        this.#material = new SkyBoxMaterial(redGPUContext, this.#texture)
        this.luminance = this.#luminance = luminance;
        this.#primitiveState = new PrimitiveState(this)
        this.#primitiveState.cullMode = GPU_CULL_MODE.NONE
        this.#depthStencilState = new DepthStencilState(this)
        this.#depthStencilState.depthWriteEnabled = false
        const slot = redGPUContext.globalVertexUniformBuffer.allocateSlot();
        this.#globalVertexBufferSlotIndex = slot.index;
    }

    /**
     * [KO] 스카이박스 배경으로 적용된 현재 큐브 텍스처를 가져오거나 설정합니다.
     * [EN] Gets or sets the current cube texture applied as the skybox background.
     */
    get texture(): CubeTexture | DirectCubeTexture {
        return this.#texture;
    }

    set texture(texture: CubeTexture | DirectCubeTexture) {
        if (!texture) consoleAndThrowError('SkyBox requires a valid CubeTexture | DirectCubeTexture');
        this.#texture = texture;
        this.#material.texture0 = texture;
    }

    /**
     * [KO] 물리 기반 광학 시뮬레이션용 휘도(Nit) 값을 가져오거나 설정합니다.
     * [EN] Gets or sets the luminance value (Nit) for physical optics simulation.
     */
    get luminance(): number {
        return this.#luminance;
    }

    set luminance(value: number) {
        this.#luminance = value;
        this.#material.luminance = value;
    }

    /**
     * [KO] 시각적인 라이팅 강도를 조절하기 위한 강도 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the intensity multiplier to adjust visual lighting strength.
     */
    get intensityMultiplier(): number {
        return this.#material.intensityMultiplier;
    }

    set intensityMultiplier(value: number) {
        this.#material.intensityMultiplier = value;
    }

    /**
     * [KO] 배경 텍스처의 블러 세기(0.0 ~ 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the blur strength (0.0 to 1.0) of the background texture.
     */
    get blur(): number {
        return this.#material.blur;
    }

    set blur(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#material.blur = value;
    }

    /**
     * [KO] 스카이박스 배경의 최종 불투명도(0.0 ~ 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the final opacity (0.0 to 1.0) of the skybox background.
     */
    get opacity(): number {
        return this.#material.opacity;
    }

    set opacity(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#material.opacity = value;
    }

    /**
     * [KO] 텍스처 전환 애니메이션 도중의 목표가 되는 텍스처를 가져옵니다.
     * [EN] Gets the target texture during a texture transition animation.
     */
    get transitionTexture(): CubeTexture | DirectCubeTexture {
        return this.#transitionTexture;
    }

    /**
     * [KO] 지정된 다른 큐브 텍스처로 부드럽게 배경을 전환하는 마스킹 애니메이션을 기동합니다.
     * [EN] Starts a masking animation to smoothly transition the background to the specified target cube texture.
     * @param targetTexture -
     * [KO] 새롭게 전환할 대상 큐브 텍스처
     * [EN] The new target cube texture to transition to
     * @param duration -
     * [KO] 전환에 걸리는 지속 시간 (ms, 기본값: 300)
     * [EN] The duration of the transition (in ms, default: 300)
     * @param mask -
     * [KO] 전환 효과에 적용할 노이즈 마스크 텍스처
     * [EN] Noise mask texture to apply to the transition effect
     */
    transition(targetTexture: CubeTexture | DirectCubeTexture, duration: number = 300, mask: ANoiseTexture) {
        this.#transitionTexture = targetTexture;
        this.#material.transitionTexture = targetTexture;
        this.#transitionDuration = duration;
        this.#transitionStartTime = performance.now();
        this.#material.transitionMask = mask;
    }

    /**
     * [KO] 스카이박스를 화면 배경에 드로우합니다. 텍스처 전환이 진행 중이면 경과 시간을 기준으로 진척도를 계산해 업로드합니다.
     * [EN] Draws the skybox on the screen background. If a texture transition is in progress, computes and uploads progress based on elapsed time.
     * @param renderViewStateData -
     * [KO] 현재 뷰 및 렌더 상태 데이터
     * [EN] Current view and render state data
     */
    render(renderViewStateData: RenderViewStateData) {
        const {currentRenderPassEncoder, viewRenderStartTime, view} = renderViewStateData
        const {indexBuffer} = this.#geometry
        const {triangleCount, indexCount, format} = indexBuffer
        const {gpuDevice, redGPUContext} = this

        this.#updateMSAAStatus();
        if (!this.gpuRenderInfo) this.#initGPURenderInfos()

        if (this.#transitionStartTime) {
            this.#transitionElapsed = Math.max(viewRenderStartTime - this.#transitionStartTime, 0)
            if (this.#transitionElapsed > this.#transitionDuration) {
                this.#transitionStartTime = 0
                this.#material.transitionProgress = 0
                this.texture = this.#transitionTexture
                this.#material.transitionTexture = null
                this.#dirtyPipeline = true
            } else {
                const value = this.#transitionElapsed / this.#transitionDuration
                this.#material.transitionProgress = value < 0 ? 0 : value > 1 ? 1 : value
            }
        }

        if (this.#dirtyPipeline || this.#material.dirtyPipeline || this.#prevSystemUniform_Vertex_UniformBindGroup !== view.systemUniform_Vertex_UniformBindGroup) {
            this.gpuRenderInfo.pipeline = this.#updatePipeline()
            this.#dirtyPipeline = false
            renderViewStateData.renderResults.numDirtyPipelines++
            this.#prevSystemUniform_Vertex_UniformBindGroup = view.systemUniform_Vertex_UniformBindGroup
            {
                this.#material.dirtyPipeline = false
                const bundleEncoder = gpuDevice.createRenderBundleEncoder({
                    ...view.basicRenderBundleEncoderDescriptor,
                    label: 'skybox'
                })
                const {gpuRenderInfo} = this
                const {vertexUniformBindGroup, pipeline} = gpuRenderInfo
                bundleEncoder.setPipeline(pipeline)
                bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
                bundleEncoder.setVertexBuffer(0, this.#geometry.vertexBuffer.gpuBuffer)
                bundleEncoder.setBindGroup(1, vertexUniformBindGroup);
                bundleEncoder.setBindGroup(2, this.#material.gpuRenderInfo.fragmentUniformBindGroup)
                bundleEncoder.setIndexBuffer(indexBuffer.gpuBuffer, format)
                bundleEncoder.drawIndexed(indexBuffer.indexCount, 1, 0, 0, this.#globalVertexBufferSlotIndex);
                this.#renderBundle = bundleEncoder.finish({label: 'renderBundle skybox'})
            }
        }
        currentRenderPassEncoder.executeBundles([this.#renderBundle])

        const {renderResults} = renderViewStateData;
        renderResults.num3DObjects++
        renderResults.numDrawCalls++
        renderResults.numTriangles += triangleCount
        renderResults.numPoints += indexCount
    }

    #updateMSAAStatus() {
        const {msaaID} = this.antialiasingManager;
        if (this.#lastUpdateMSAAID !== msaaID) {
            this.#dirtyPipeline = true;
            this.#lastUpdateMSAAID = msaaID;
        }
    }

    #initGPURenderInfos() {
        const {resourceManager, redGPUContext} = this
        const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKYBOX_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
            'SKYBOX_VERTEX_BIND_GROUP_LAYOUT',
            getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
        )

        redGPUContext.globalVertexUniformBuffer.updateFloatData(
            this.#globalVertexBufferSlotIndex,
            new Float32Array(this.modelMatrix),
            UNIFORM_STRUCT.members.matrixList.members.modelMatrix.uniformOffset / 4
        );

        const vertexBindGroupDescriptor: GPUBindGroupDescriptor = {
            layout: vertex_BindGroupLayout,
            label: VERTEX_BIND_GROUP_DESCRIPTOR_NAME,
            entries: []
        }
        const vertexUniformBindGroup: GPUBindGroup = redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
        this.gpuRenderInfo = new VertexGPURenderInfo(
            null, SHADER_INFO.shaderSourceVariant, SHADER_INFO.conditionalBlocks, UNIFORM_STRUCT,
            vertex_BindGroupLayout, null, vertexUniformBindGroup, this.#updatePipeline(),
        )
        redGPUContext.globalVertexUniformBuffer.updateUintData(
            this.#globalVertexBufferSlotIndex,
            new Uint32Array([this.#material.globalFragmentBufferSlotIndex]),
            ResourceManager.GLOBAL_SSAO_VERTEX_STRUCT.members.globalFragmentBufferSlotIndex.uniformOffset / 4
        );

    }

    #updatePipeline(): GPURenderPipeline {
        const {resourceManager, gpuDevice, antialiasingManager} = this
        const vertexShaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
            VERTEX_SHADER_MODULE_NAME, {code: vertexModuleSource}
        )
        const vertexState: GPUVertexState = {
            module: vertexShaderModule,
            entryPoint: 'main',
            buffers: this.#geometry.gpuRenderInfo.buffers
        }
        const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKYBOX_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
            'SKYBOX_VERTEX_BIND_GROUP_LAYOUT',
            getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
        )
        const bindGroupLayouts: GPUBindGroupLayout[] = [
            resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
            vertex_BindGroupLayout,
            this.#material.gpuRenderInfo.fragmentBindGroupLayout
        ]
        const pipelineLayout: GPUPipelineLayout = resourceManager.createGPUPipelineLayout(
            'SKYBOX_PIPELINE_LAYOUT', {bindGroupLayouts}
        );
        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: PIPELINE_DESCRIPTOR_LABEL,
            layout: pipelineLayout,
            vertex: vertexState,
            fragment: this.#material.gpuRenderInfo.fragmentState,
            primitive: this.#primitiveState.state,
            depthStencil: this.#depthStencilState.state,
            multisample: {count: antialiasingManager.useMSAA ? 4 : 1},
        }

        return gpuDevice.createRenderPipeline(pipelineDescriptor)
    }
}

Object.freeze(SkyBox)
export default SkyBox
