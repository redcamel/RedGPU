import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import {getVertexBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import Box from "../../../primitive/Box";
import Primitive from "../../../primitive/core/Primitive";
import DepthStencilState from "../../../renderState/DepthStencilState";
import PrimitiveState from "../../../renderState/PrimitiveState";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import CubeTexture from "../../../resources/texture/CubeTexture";
import DirectCubeTexture from "../../../resources/texture/DirectCubeTexture";
import ANoiseTexture from "../../../resources/texture/noiseTexture/core/ANoiseTexture";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import VertexGPURenderInfo from "../../mesh/core/VertexGPURenderInfo";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import SkyBoxMaterial from "./core/SkyBoxMaterial";
import vertexModuleSource from './shader/vertex.wgsl';
import RedGPUObject from "../../../base/RedGPUObject";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SKYBOX'
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_SKYBOX'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_SKYBOX'

/**
 * [KO] 큐브맵 텍스처를 사용하여 3D 씬의 무한 원경 배경을 렌더링하는 스카이박스 클래스입니다.
 * [EN] Skybox class that renders an infinite distant background for a 3D scene using a cubemap texture.
 *
 * [KO] 물리적 휘도(Nit), 강도 배율, 블러(Blur), 불투명도 조절 및 노이즈 마스크 기반의 실시간 텍스처 전환(Transition) 효과를 지원합니다.
 * [EN] Supports physical luminance (Nit), intensity multiplier, blur, opacity control, and real-time texture transition effects using a noise mask.
 *
 * ### Example
 * ```typescript
 * const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
 * view.skybox = skybox;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/" style="width:100%; height:500px;"></iframe>
 *
 * @see [SkyBox basic example](/RedGPU/examples/3d/skybox/skybox/)
 * @see [SkyBox IBL example](/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/)
 * @see [SkyBox transition example](/RedGPU/examples/3d/skybox/transition/skyboxTransition/)
 * @see [SkyBox transition with noise texture](/RedGPU/examples/3d/skybox/transition/skyboxTransitionWithNoiseTexture/)
 * @category SkyBox
 */
class SkyBox extends RedGPUObject {
    /**
     * [KO] 스카이박스 모델 변환 행렬
     * [EN] Skybox model transformation matrix
     */
    modelMatrix = mat4.create()
    /**
     * [KO] 버텍스 GPU 렌더링 정보 객체
     * [EN] Vertex GPU render info object
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
    #SHADER_INFO: any

    /**
     * [KO] SkyBox 인스턴스를 생성합니다.
     * [EN] Creates a SkyBox instance.
     *
     * ### Example
     * ```typescript
     * const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture, 25000);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param texture -
     * [KO] 배경으로 사용할 큐브 텍스처 객체
     * [EN] Cube texture object to use as the background
     * @param luminance -
     * [KO] 물리적 휘도 (단위: Nit, 기본값: 25000)
     * [EN] Physical luminance (unit: Nit, default: 25000)
     */
    constructor(redGPUContext: RedGPUContext, texture: CubeTexture | DirectCubeTexture, luminance: number = 25000) {
        super(redGPUContext)
        this.#geometry = new Box(redGPUContext)
        this.#texture = texture
        this.#material = new SkyBoxMaterial(redGPUContext, this.#texture)
        this.luminance = this.#luminance = luminance;
        this.#primitiveState = new PrimitiveState(this)
        this.#primitiveState.cullMode = GPU_CULL_MODE.FRONT
        this.#depthStencilState = new DepthStencilState(this)
        this.#depthStencilState.depthWriteEnabled = false
    }

    /**
     * [KO] 스카이박스 배경으로 적용된 현재 큐브 텍스처를 가져오거나 설정합니다.
     * [EN] Gets or sets the current cube texture applied as the skybox background.
     *
     * @returns
     * [KO] 현재 큐브 텍스처 인스턴스
     * [EN] Current cube texture instance
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
     *
     * @returns
     * [KO] 휘도 값 (단위: Nit)
     * [EN] Luminance value (unit: Nit)
     */
    get luminance(): number {
        return this.#luminance;
    }

    set luminance(value: number) {
        this.#luminance = value;
        this.#material.luminance = value;
    }

    /**
     * [KO] 시각적 밝기 조절을 위한 강도 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the intensity multiplier for visual brightness adjustment.
     *
     * @returns
     * [KO] 강도 배율
     * [EN] Intensity multiplier
     */
    get intensityMultiplier(): number {
        return this.#material.intensityMultiplier;
    }

    set intensityMultiplier(value: number) {
        this.#material.intensityMultiplier = value;
    }

    /**
     * [KO] 배경 텍스처의 블러 강도(0.0 ~ 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the blur strength (0.0 to 1.0) of the background texture.
     *
     * @returns
     * [KO] 블러 강도 (0.0 ~ 1.0)
     * [EN] Blur strength (0.0 to 1.0)
     */
    get blur(): number {
        return this.#material.blur;
    }

    set blur(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#material.blur = value;
    }

    /**
     * [KO] 스카이박스 배경의 불투명도(0.0 ~ 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the opacity (0.0 to 1.0) of the skybox background.
     *
     * @returns
     * [KO] 불투명도 (0.0 ~ 1.0)
     * [EN] Opacity (0.0 to 1.0)
     */
    get opacity(): number {
        return this.#material.opacity;
    }

    set opacity(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#material.opacity = value;
    }

    /**
     * [KO] 텍스처 전환 애니메이션의 목표 큐브 텍스처를 반환합니다.
     * [EN] Returns the target cube texture of the texture transition animation.
     *
     * @returns
     * [KO] 전환 목표 큐브 텍스처
     * [EN] Target cube texture for transition
     */
    get transitionTexture(): CubeTexture | DirectCubeTexture {
        return this.#transitionTexture;
    }

    /**
     * [KO] 지정된 대상 큐브 텍스처로 배경을 전환하는 애니메이션을 시작합니다.
     * [EN] Starts an animation that transitions the background to the specified target cube texture.
     *
     * ### Example
     * ```typescript
     * skybox.transition(nextCubeTexture, 500, noiseTexture);
     * ```
     *
     * @param targetTexture -
     * [KO] 전환할 대상 큐브 텍스처
     * [EN] Target cube texture to transition to
     * @param duration -
     * [KO] 전환 지속 시간 (단위: ms, 기본값: 300)
     * [EN] Transition duration (unit: ms, default: 300)
     * @param mask -
     * [KO] 전환 효과에 사용할 노이즈 마스크 텍스처
     * [EN] Noise mask texture to use for the transition effect
     */
    transition(targetTexture: CubeTexture | DirectCubeTexture, duration: number = 300, mask: ANoiseTexture) {
        this.#transitionTexture = targetTexture;
        this.#material.transitionTexture = targetTexture;
        this.#transitionDuration = duration;
        this.#transitionStartTime = performance.now();
        this.#material.transitionMask = mask;
    }

    /**
     * [KO] 스카이박스를 렌더링하고 진행 중인 텍스처 전환 상태를 갱신합니다.
     * [EN] Renders the skybox and updates any active texture transition state.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
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
                bundleEncoder.drawIndexed(indexBuffer.indexCount, 1, 0, 0, 0);
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

    /**
     * [KO] 스카이박스 인스턴스를 파기하고 할당된 GPU 리소스를 해제합니다.
     * [EN] Destroys the SkyBox instance and releases allocated GPU resources.
     */
    destroy() {
        this.#SHADER_INFO = null
        if (this.gpuRenderInfo) {
            if (this.gpuRenderInfo.vertexUniformBuffer) {
                this.gpuRenderInfo.vertexUniformBuffer.destroy();
            }
            this.gpuRenderInfo = null;
        }
        if (this.#material) {
            this.#material.destroy();
            this.#material = null;
        }
        if (this.#geometry) {
            // @ts-ignore
            if (typeof this.#geometry.destroy === 'function') {
                // @ts-ignore
                this.#geometry.destroy();
            }
            this.#geometry = null;
        }
        this.#renderBundle = null;
        this.#texture = null;
        this.#transitionTexture = null;
        this.#prevSystemUniform_Vertex_UniformBindGroup = null;
        console.log(`🧹 SkyBox destroy 완료`);
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

        this.#SHADER_INFO = resourceManager.wgslParser.parse('SKYBOX_VERTEX', vertexModuleSource)
        const UNIFORM_STRUCT = this.#SHADER_INFO.uniforms.vertexUniforms;
        const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKYBOX_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
            'SKYBOX_VERTEX_BIND_GROUP_LAYOUT',
            getVertexBindGroupLayoutDescriptorFromShaderInfo(this.#SHADER_INFO, 1)
        )
        const vertexUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
        const vertexUniformBuffer: UniformBuffer = new UniformBuffer(redGPUContext, vertexUniformData, 'SKYBOX_VERTEX_UNIFORM_BUFFER', 'SKYBOX_VERTEX_UNIFORM_BUFFER')
        mat4.identity(this.modelMatrix);
        vertexUniformBuffer.writeOnlyBuffer(UNIFORM_STRUCT.members.modelMatrix, this.modelMatrix)

        const vertexBindGroupDescriptor: GPUBindGroupDescriptor = {
            layout: vertex_BindGroupLayout,
            label: VERTEX_BIND_GROUP_DESCRIPTOR_NAME,
            entries: [{
                binding: 0,
                resource: {buffer: vertexUniformBuffer.gpuBuffer, offset: 0, size: vertexUniformBuffer.size},
            }]
        }
        const vertexUniformBindGroup: GPUBindGroup = redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
        this.gpuRenderInfo = new VertexGPURenderInfo(
            null, this.#SHADER_INFO.shaderSourceVariant, this.#SHADER_INFO.conditionalBlocks, UNIFORM_STRUCT,
            vertex_BindGroupLayout, vertexUniformBuffer, vertexUniformBindGroup, this.#updatePipeline(),
        )
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
            getVertexBindGroupLayoutDescriptorFromShaderInfo(this.#SHADER_INFO, 1)
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
