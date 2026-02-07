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
import {IBLCubeTexture} from "../../../resources/texture/ibl/core";
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
 * [KO] 3D 씬의 배경으로 사용되는 스카이박스 클래스입니다.
 * [EN] Skybox class used as the background for 3D scenes.
 *
 * [KO] 큐브 텍스처를 사용하여 360도 환경을 렌더링하며, 텍스처 간 부드러운 전환 효과와 블러, 노출, 투명도 조절 기능을 제공합니다.
 * [EN] Renders a 360-degree environment using cube textures, providing smooth transitions between textures, blur, exposure, and transparency control.
 *
 * [KO] 일반적인 6장 이미지 큐브맵(`CubeTexture`)과 HDR 파일로부터 변환된 IBL 큐브맵(`IBLCubeTexture`)을 모두 지원합니다.
 * [EN] Supports both regular 6-image cubemaps (`CubeTexture`) and IBL cubemaps (`IBLCubeTexture`) converted from HDR files.
 *
 * ::: info
 * [KO] HDR(.hdr) 파일을 사용하려는 경우, `RedGPU.Resource.IBL`을 통해 큐브맵으로 변환된 `environmentTexture`를 전달해야 합니다.
 * [EN] To use an HDR (.hdr) file, you must pass the `environmentTexture` converted to a cubemap via `RedGPU.Resource.IBL`.
 * :::
 *
 * ### Example
 * ```typescript
 * // 1. 일반 큐브 텍스처 사용 (Using regular CubeTexture)
 * const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
 * 
 * // 2. HDR 파일을 IBL을 통해 사용 (Using HDR file via IBL)
 * const ibl = new RedGPU.Resource.IBL(redGPUContext, 'assets/env.hdr');
 * const skyboxHDR = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
 * 
 * view.skybox = skybox;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/skybox/skybox/"></iframe>
 *
 * @see
 * [KO] 아래는 Skybox의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of Skybox.
 * @see [Skybox using HDRTexture](/RedGPU/examples/3d/skybox/skyboxWithHDRTexture/)
 * @see [Skybox using IBL](/RedGPU/examples/3d/skybox/skyboxWithIbl/)
 *
 * @category SkyBox
 */
class SkyBox {
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
     * [KO] 스카이박스의 기하학적 형태 (박스)
     * [EN] Geometric shape of the skybox (box)
     */
    #geometry: Primitive
    /**
     * [KO] 스카이박스 머티리얼
     * [EN] Skybox material
     */
    #material: SkyBoxMaterial
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
    /**
     * [KO] 현재 스카이박스 텍스처 (일반 또는 IBL)
     * [EN] Current skybox texture (Regular or IBL)
     */
    #skyboxTexture: CubeTexture | IBLCubeTexture
    /**
     * [KO] 전환 대상 텍스처 (일반 또는 IBL)
     * [EN] Transition target texture (Regular or IBL)
     */
    #transitionTexture: CubeTexture | IBLCubeTexture
    /**
     * [KO] 전환 시작 시간 (밀리초)
     * [EN] Transition start time (ms)
     */
    #transitionStartTime: number = 0
    /**
     * [KO] 전환 지속 시간 (밀리초)
     * [EN] Transition duration (ms)
     */
    #transitionDuration: number = 0
    /**
     * [KO] 전환 경과 시간 (밀리초)
     * [EN] Transition elapsed time (ms)
     */
    #transitionElapsed: number = 0
    #prevSystemUniform_Vertex_UniformBindGroup: GPUBindGroup

    /**
     * [KO] 새로운 SkyBox 인스턴스를 생성합니다.
     * [EN] Creates a new SkyBox instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param cubeTexture -
     * [KO] 스카이박스에 사용할 큐브 텍스처 (일반 또는 IBL)
     * [EN] Cube texture to use for the skybox (Regular or IBL)
     *
     * @throws
     * [KO] redGPUContext가 유효하지 않은 경우 Error 발생
     * [EN] Throws Error if redGPUContext is invalid
     *
     */
    constructor(redGPUContext: RedGPUContext, cubeTexture: CubeTexture | IBLCubeTexture) {
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
     * [KO] 전환 지속 시간을 반환합니다. (ms)
     * [EN] Returns the transition duration (in ms).
     */
    get transitionDuration(): number {
        return this.#transitionDuration;
    }

    /**
     * [KO] 전환 경과 시간을 반환합니다. (ms)
     * [EN] Returns the transition elapsed time (in ms).
     */
    get transitionElapsed(): number {
        return this.#transitionElapsed;
    }

    /**
     * [KO] 현재 진행 중인 전환 진행률을 반환합니다. (0.0 ~ 1.0)
     * [EN] Returns the progress of the transition currently in progress (0.0 to 1.0).
     */
    get transitionProgress(): number {
        return this.#material.transitionProgress;
    }

    /**
     * [KO] 스카이박스 블러 정도를 반환합니다.
     * [EN] Returns the skybox blur amount.
     */
    get blur(): number {
        return this.#material.blur;
    }

    /**
     * [KO] 스카이박스 블러 정도를 설정합니다.
     * [EN] Sets the skybox blur amount.
     * @param value -
     * [KO] 0.0에서 1.0 사이의 블러 값
     * [EN] Blur value between 0.0 and 1.0
     * @throws
     * [KO] 값이 범위를 벗어나는 경우 Error 발생
     * [EN] Throws Error if value is out of range
     */
    set blur(value: number) {
        validatePositiveNumberRange(1, 0, 1)
        this.#material.blur = value;
    }


    /**
     * [KO] 스카이박스의 불투명도를 반환합니다.
     * [EN] Returns the skybox opacity.
     */
    get opacity(): number {
        return this.#material.opacity;
    }

    /**
     * [KO] 스카이박스의 불투명도를 설정합니다.
     * [EN] Sets the skybox opacity.
     * @param value -
     * [KO] 0.0에서 1.0 사이의 불투명도 값
     * [EN] Opacity value between 0.0 and 1.0
     * @throws
     * [KO] 값이 범위를 벗어나는 경우 Error 발생
     * [EN] Throws Error if value is out of range
     */
    set opacity(value: number) {
        validatePositiveNumberRange(1, 0, 1)
        this.#material.opacity = value;
    }

    /**
     * [KO] 현재 스카이박스 텍스처를 반환합니다.
     * [EN] Returns the current skybox texture.
     */
    get skyboxTexture(): CubeTexture | IBLCubeTexture {
        return this.#skyboxTexture
    }

    /**
     * [KO] 스카이박스 텍스처를 설정합니다.
     * [EN] Sets the skybox texture.
     * @param texture -
     * [KO] 새로운 큐브 텍스처 (일반 또는 IBL)
     * [EN] New cube texture (Regular or IBL)
     * @throws
     * [KO] 텍스처가 유효하지 않은 경우 Error 발생
     * [EN] Throws Error if texture is invalid
     */
    set skyboxTexture(texture: CubeTexture | IBLCubeTexture) {
        if (!texture) {
            consoleAndThrowError('SkyBox requires a valid CubeTexture | IBLCubeTexture')
        } else {
            this.#skyboxTexture = texture
            this.#material.skyboxTexture = texture
        }
    }

    /**
     * [KO] 전환 대상 텍스처를 반환합니다.
     * [EN] Returns the transition target texture.
     */
    get transitionTexture(): CubeTexture | IBLCubeTexture {
        return this.#transitionTexture
    }

    /**
     * [KO] 다른 텍스처로의 부드러운 전환을 시작합니다.
     * [EN] Starts a smooth transition to another texture.
     *
     * ### Example
     * ```typescript
     * // 1초 동안 새 텍스처로 전환
     * skybox.transition(newTexture, 1000, noiseTexture);
     * ```
     * @param transitionTexture -
     * [KO] 전환할 대상 큐브 텍스처 (일반 또는 IBL)
     * [EN] Target cube texture to transition to (Regular or IBL)
     * @param duration -
     * [KO] 전환 지속 시간 (밀리초, 기본값: 300)
     * [EN] Transition duration (ms, Default: 300)
     * @param transitionAlphaTexture -
     * [KO] 전환 효과에 사용할 알파 노이즈 텍스처
     * [EN] Alpha noise texture to use for the transition effect
     */
    transition(transitionTexture: CubeTexture | IBLCubeTexture, duration: number = 300, transitionAlphaTexture: ANoiseTexture) {
        this.#transitionTexture = transitionTexture
        this.#material.transitionTexture = transitionTexture
        this.#transitionDuration = duration
        this.#transitionStartTime = performance.now()
        this.#material.transitionAlphaTexture = transitionAlphaTexture
    }

    /**
     * [KO] 스카이박스를 렌더링합니다.
     * [EN] Renders the skybox.
     *
     * [KO] 이 메서드는 매 프레임마다 호출되어야 하며, MSAA 상태, 텍스처 전환 진행 상황 업데이트 및 실제 렌더링 명령 실행을 수행합니다.
     * [EN] This method should be called every frame, performing MSAA state check, texture transition updates, and executing actual rendering commands.
     *
     * ### Example
     * ```typescript
     * skybox.render(renderViewState);
     * ```
     * @param renderViewStateData -
     * [KO] 렌더링 상태 및 디버그 정보
     * [EN] Rendering state and debug info
     */
    render(renderViewStateData: RenderViewStateData) {
        const {currentRenderPassEncoder, startTime, view} = renderViewStateData
        const {indexBuffer} = this.#geometry
        const {triangleCount, indexCount, format} = indexBuffer
        const {gpuDevice, antialiasingManager} = this.#redGPUContext
        const {useMSAA, changedMSAA} = antialiasingManager
        this.#updateMSAAStatus();
        if (!this.gpuRenderInfo) this.#initGPURenderInfos(this.#redGPUContext)
        // keepLog(this.#dirtyPipeline , this.#material.dirtyPipeline)
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
                bundleEncoder.setBindGroup(1, vertexUniformBindGroup); // 버텍스 유니폼 버퍼 1번 고정
                bundleEncoder.setBindGroup(2, this.#material.gpuRenderInfo.fragmentUniformBindGroup)
                bundleEncoder.setIndexBuffer(indexBuffer.gpuBuffer, format)
                bundleEncoder.drawIndexed(indexBuffer.indexCount, 1, 0, 0, 0);
                this.#renderBundle = bundleEncoder.finish({
                    label: 'renderBundle skybox',
                })
            }
        }
        currentRenderPassEncoder.executeBundles([this.#renderBundle])
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