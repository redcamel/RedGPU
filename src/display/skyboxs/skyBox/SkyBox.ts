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
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import VertexGPURenderInfo from "../../mesh/core/VertexGPURenderInfo";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import SkyBoxMaterial from "./core/SkyBoxMaterial";
import vertexModuleSource from './shader/vertex.wgsl';

/** 파싱된 WGSL 셰이더 정보 */
const SHADER_INFO = parseWGSL('SKYBOX_VERTEX', vertexModuleSource)
/** 버텍스 유니폼 구조체 정보 */
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
/** 버텍스 셰이더 모듈 이름 */
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SKYBOX'
/** 버텍스 바인드 그룹 디스크립터 이름 */
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_SKYBOX'
/** 파이프라인 디스크립터 레이블 */
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_SKYBOX'

/**
 * [KO] 3D 씬의 배경으로 사용되는 스카이박스 클래스입니다.
 * [EN] Skybox class used as the background for 3D scenes.
 *
 * @category SkyBox
 */
class SkyBox {
    /** [KO] 모델 변환 행렬 [EN] Model transformation matrix */
    modelMatrix = mat4.create()
    /** [KO] GPU 렌더링 정보 객체 [EN] GPU rendering information object */
    gpuRenderInfo: VertexGPURenderInfo

    #dirtyPipeline: boolean = true
    #renderBundle: GPURenderBundle
    #geometry: Primitive
    #material: SkyBoxMaterial
    #redGPUContext: RedGPUContext
    #primitiveState: PrimitiveState
    #depthStencilState: DepthStencilState
    #texture: CubeTexture | DirectCubeTexture
    #transitionTexture: CubeTexture | DirectCubeTexture
    #transitionStartTime: number = 0
    #transitionDuration: number = 0
    #transitionElapsed: number = 0
    #prevSystemUniform_Vertex_UniformBindGroup: GPUBindGroup
    #isAnalyzing: boolean = false;
    #prevAnalyzedTexture: GPUTexture | null = null;
    #luminance: number = 10000.0;

    /**
     * [KO] 새로운 SkyBox 인스턴스를 생성합니다.
     * [EN] Creates a new SkyBox instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU context
     * @param texture - [KO] 사용할 큐브 텍스처 [EN] Cube texture to use
     * @param luminance - [KO] 물리적 휘도 (Nit) [EN] Physical luminance (Nit)
     */
    constructor(redGPUContext: RedGPUContext, texture: CubeTexture | DirectCubeTexture, luminance: number = 10000) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.#geometry = new Box(redGPUContext)
        this.#texture = texture
        this.#material = new SkyBoxMaterial(redGPUContext, this.#texture)
        this.luminance = this.#luminance = luminance;
        this.#primitiveState = new PrimitiveState(this)
        this.#primitiveState.cullMode = GPU_CULL_MODE.NONE
        this.#depthStencilState = new DepthStencilState(this)
    }

    /** [KO] 스카이박스 텍스처 [EN] Skybox texture */
    get texture(): CubeTexture | DirectCubeTexture {
        return this.#texture;
    }

    set texture(texture: CubeTexture | DirectCubeTexture) {
        if (!texture) consoleAndThrowError('SkyBox requires a valid CubeTexture | DirectCubeTexture');
        this.#texture = texture;
        this.#material.texture0 = texture;
    }

    /** [KO] 물리적 휘도 (단위: cd/m²) [EN] Physical luminance (Unit: cd/m²) */
    get luminance(): number {
        return this.#luminance;
    }

    set luminance(value: number) {
        this.#luminance = value;
        this.#material.luminance = value;
    }

    /** [KO] 아티스트 제어를 위한 강도 배율 [EN] Intensity multiplier for artist control */
    get intensityMultiplier(): number {
        return this.#material.intensityMultiplier;
    }

    set intensityMultiplier(value: number) {
        this.#material.intensityMultiplier = value;
    }

    /** [KO] 스카이박스 블러 정도 (0.0 ~ 1.0) [EN] Skybox blur amount (0.0 to 1.0) */
    get blur(): number {
        return this.#material.blur;
    }

    set blur(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#material.blur = value;
    }

    /** [KO] 불투명도 (0.0 ~ 1.0) [EN] Opacity (0.0 to 1.0) */
    get opacity(): number {
        return this.#material.opacity;
    }

    set opacity(value: number) {
        validatePositiveNumberRange(value, 0, 1);
        this.#material.opacity = value;
    }

    /** [KO] 분석된 텍스처의 평균 휘도 (정규화용) [EN] Average luminance of analyzed texture (for normalization) */
    get averageLuminance(): number {
        return this.#material.averageLuminance;
    }

    /** [KO] 전환 대상 텍스처 [EN] Transition target texture */
    get transitionTexture(): CubeTexture | DirectCubeTexture {
        return this.#transitionTexture;
    }

    /**
     * [KO] 다른 텍스처로의 부드러운 전환을 시작합니다.
     * [EN] Starts a smooth transition to another texture.
     */
    transition(targetTexture: CubeTexture | DirectCubeTexture, duration: number = 300, mask: ANoiseTexture) {
        this.#transitionTexture = targetTexture;
        this.#material.transitionTexture = targetTexture;
        this.#transitionDuration = duration;
        this.#transitionStartTime = performance.now();
        this.#material.transitionMask = mask;
    }

    /** [KO] 스카이박스를 렌더링합니다. [EN] Renders the skybox. */
    render(renderViewStateData: RenderViewStateData) {
        const {currentRenderPassEncoder, startTime, view} = renderViewStateData
        const {indexBuffer} = this.#geometry
        const {triangleCount, indexCount, format} = indexBuffer
        const {gpuDevice, resourceManager} = this.#redGPUContext

        const currentTexture = this.#material.texture0.gpuTexture;
        if (currentTexture && currentTexture !== this.#prevAnalyzedTexture && !this.#isAnalyzing) {
            this.#isAnalyzing = true;
            this.#prevAnalyzedTexture = currentTexture;
            resourceManager.iblLuminanceAnalyzer.analyze(currentTexture).then(lum => {
                this.#material.averageLuminance = lum || 1.0;
                this.#isAnalyzing = false;
            });
        }

        this.#updateMSAAStatus();
        if (!this.gpuRenderInfo) this.#initGPURenderInfos(this.#redGPUContext)

        if (this.#transitionStartTime) {
            this.#transitionElapsed = Math.max(startTime - this.#transitionStartTime, 0)
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
            renderViewStateData.numDirtyPipelines++
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

        renderViewStateData.num3DObjects++
        renderViewStateData.numDrawCalls++
        renderViewStateData.numTriangles += triangleCount
        renderViewStateData.numPoints += indexCount
    }

    #updateMSAAStatus() {
        if (this.#redGPUContext.antialiasingManager.changedMSAA) this.#dirtyPipeline = true;
    }

    #initGPURenderInfos(redGPUContext: RedGPUContext) {
        const {resourceManager} = this.#redGPUContext
        const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout('SKYBOX_VERTEX_BIND_GROUP_LAYOUT') || resourceManager.createBindGroupLayout(
            'SKYBOX_VERTEX_BIND_GROUP_LAYOUT',
            getVertexBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
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
            null, SHADER_INFO.shaderSourceVariant, SHADER_INFO.conditionalBlocks, UNIFORM_STRUCT,
            vertex_BindGroupLayout, vertexUniformBuffer, vertexUniformBindGroup, this.#updatePipeline(),
        )
    }

    #updatePipeline(): GPURenderPipeline {
        const {resourceManager, gpuDevice, antialiasingManager} = this.#redGPUContext
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
