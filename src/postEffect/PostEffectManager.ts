import {mat4} from "gl-matrix";
import RedGPUObject from "../base/RedGPUObject";
import View3D from "../display/view/View3D";
import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";
import AMultiPassPostEffect from "./core/AMultiPassPostEffect";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";
import ShaderLibrary from "../systemCodeManager/ShaderLibrary";
import SSAO from "./effects/ssao/SSAO";
import SSR from "./effects/ssr/SSR";
import SystemUniformUpdater from "../renderer/helperFunc/SystemUniformUpdater";
import updateSystemUniformData from "../renderer/helperFunc/updateSystemUniformData";
import AutoExposure from "../camera/core/autoExposure/AutoExposure";
import GBUFFER_TYPE from "../display/view/core/GBUFFER_TYPE";
import PostEffectTexturePool from "./core/PostEffectTexturePool";
import {IPostEffectResult} from "./core/types";
import keepLog from "../utils/keepLog";

/**
 * [KO] `View3D`의 HDR/LDR 후처리 파이프라인(SSAO, SSR, TAA, ToneMapping, FXAA 및 사용자 이펙트)을 통합 관리하는 클래스입니다.
 * [EN] Class that manages the HDR/LDR post-processing pipeline (SSAO, SSR, TAA, ToneMapping, FXAA, and user effects) of a `View3D`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 postEffectManager를 통해 접근
 * // [EN] Access via View3D's postEffectManager
 * const postEffectManager = view.postEffectManager;
 * postEffectManager.addEffect(new RedGPU.PostEffect.Sharpen(redGPUContext));
 * ```
 *
 * @category PostEffect
 */
class PostEffectManager extends RedGPUObject {
    #view: View3D
    #postEffects: Array<ASinglePassPostEffect | AMultiPassPostEffect> = []
    #texturePool: PostEffectTexturePool

    #prevWidth: number = 0
    #prevHeight: number = 0
    #postEffectSystemUniformBuffer: UniformBuffer;
    #postEffectSystemUniformBufferStructInfo;
    #videoMemorySize: number = 0
    #uniformData: ArrayBuffer
    #uniformDataF32: Float32Array
    #uniformDataU32: Uint32Array
    #ssao: SSAO;
    #useSSAO: boolean = false;
    #ssr: SSR;
    #useSSR: boolean = false;
    #autoExposure: AutoExposure;
    #initialResult: IPostEffectResult = {texture: null as any, textureView: null as any};

    #gbufferBindGroupLayoutMSAA: GPUBindGroupLayout;
    #gbufferBindGroupLayoutNonMSAA: GPUBindGroupLayout;
    #gbufferBindGroup_swap0: GPUBindGroup;
    #gbufferBindGroup_swap1: GPUBindGroup;
    #prevMSAAID_for_gbuffer: string;
    #destroyed: boolean = false

    /**
     * [KO] PostEffectManager 인스턴스를 생성합니다.
     * [EN] Creates a PostEffectManager instance.
     *
     * @param view -
     * [KO] 연결할 `View3D` 인스턴스
     * [EN] `View3D` instance to bind
     */
    constructor(view: View3D) {
        super(view.redGPUContext);
        this.#view = view;
        this.#texturePool = new PostEffectTexturePool(this.redGPUContext);
        this.#init();
        this.#initGBufferLayouts();
    }

    /**
     * [KO] 현재 MSAA 상태에 맞는 공유 G-Buffer 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the shared G-Buffer bind group layout matching the current MSAA state.
     *
     * @returns
     * [KO] G-Buffer `GPUBindGroupLayout`
     * [EN] G-Buffer `GPUBindGroupLayout`
     */
    get gbufferBindGroupLayout(): GPUBindGroupLayout {
        return this.antialiasingManager.useMSAA ? this.#gbufferBindGroupLayoutMSAA : this.#gbufferBindGroupLayoutNonMSAA;
    }

    /**
     * [KO] 현재 스왑 버퍼 인덱스에 맞는 공유 G-Buffer 바인드 그룹을 반환합니다.
     * [EN] Returns the shared G-Buffer bind group for the current swap buffer index.
     *
     * @returns
     * [KO] 공유 G-Buffer `GPUBindGroup`
     * [EN] Shared G-Buffer `GPUBindGroup`
     */
    get gbufferBindGroup(): GPUBindGroup {
        return this.#view.renderViewStateData.swapBufferIndex ? this.#gbufferBindGroup_swap1 : this.#gbufferBindGroup_swap0;
    }

    /**
     * [KO] 후처리 텍스처 풀 인스턴스를 반환합니다.
     * [EN] Returns the post-effect texture pool instance.
     *
     * @returns
     * [KO] `PostEffectTexturePool` 인스턴스
     * [EN] `PostEffectTexturePool` instance
     */
    get texturePool(): PostEffectTexturePool {
        return this.#texturePool;
    }

    /**
     * [KO] 자동 노출(`AutoExposure`) 인스턴스를 반환합니다.
     * [EN] Returns the `AutoExposure` instance.
     *
     * @returns
     * [KO] `AutoExposure` 인스턴스
     * [EN] `AutoExposure` instance
     */
    get autoExposure(): AutoExposure {
        if (!this.#autoExposure) {
            this.#autoExposure = new AutoExposure(this.#view);
        }
        return this.#autoExposure;
    }

    /**
     * [KO] SSAO(Screen Space Ambient Occlusion) 활성화 여부입니다.
     * [EN] Whether SSAO (Screen Space Ambient Occlusion) is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] SSAO 활성화 여부
     * [EN] Whether SSAO is enabled
     */
    get useSSAO(): boolean {
        return this.#useSSAO;
    }

    set useSSAO(value: boolean) {
        this.#useSSAO = value;
        this.#checkSSAO()
    }

    /**
     * [KO] SSAO 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSAO effect instance.
     *
     * @returns
     * [KO] `SSAO` 인스턴스
     * [EN] `SSAO` instance
     */
    get ssao(): SSAO {
        if (!this.#ssao) {
            this.#ssao = new SSAO(this.#view.redGPUContext)
        }
        return this.#ssao;
    }

    /**
     * [KO] SSR(Screen Space Reflection) 활성화 여부입니다.
     * [EN] Whether SSR (Screen Space Reflection) is enabled.
     *
     * @defaultValue false
     * @returns
     * [KO] SSR 활성화 여부
     * [EN] Whether SSR is enabled
     */
    get useSSR(): boolean {
        return this.#useSSR;
    }

    set useSSR(value: boolean) {
        this.#useSSR = value;
        this.#checkSSR()
    }

    /**
     * [KO] SSR 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSR effect instance.
     *
     * @returns
     * [KO] `SSR` 인스턴스
     * [EN] `SSR` instance
     */
    get ssr(): SSR {
        if (!this.#ssr) {
            this.#ssr = new SSR(this.#view.redGPUContext)
        }
        return this.#ssr;
    }

    /**
     * [KO] 후처리 시스템 공용 유니폼 버퍼를 반환합니다.
     * [EN] Returns the post-effect system common uniform buffer.
     *
     * @returns
     * [KO] 시스템 `UniformBuffer` 인스턴스
     * [EN] System `UniformBuffer` instance
     */
    get postEffectSystemUniformBuffer(): UniformBuffer {
        return this.#postEffectSystemUniformBuffer;
    }

    /**
     * [KO] 연결된 `View3D` 인스턴스를 반환합니다.
     * [EN] Returns the bound `View3D` instance.
     *
     * @returns
     * [KO] `View3D` 인스턴스
     * [EN] `View3D` instance
     */
    get view(): View3D {
        return this.#view;
    }

    /**
     * [KO] 등록된 사용자 후처리 이펙트 배열을 반환합니다.
     * [EN] Returns the array of registered user post-processing effects.
     *
     * @returns
     * [KO] 후처리 이펙트 배열 (`Array<ASinglePassPostEffect | AMultiPassPostEffect>`)
     * [EN] Array of post-processing effects (`Array<ASinglePassPostEffect | AMultiPassPostEffect>`)
     */
    get effectList(): Array<ASinglePassPostEffect | AMultiPassPostEffect> {
        return this.#postEffects;
    }

    /**
     * [KO] 텍스처 풀과 등록된 이펙트들의 총 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the total video memory usage (in bytes) of the texture pool and registered effects.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number {
        this.#calcVideoMemory()
        return this.#videoMemorySize;
    }

    /**
     * [KO] 등록된 모든 후처리 이펙트, 텍스처 풀, 시스템 버퍼를 파기합니다.
     * [EN] Destroys all registered post-processing effects, texture pool, and system buffers.
     */
    destroy() {
        if (this.#destroyed) return;
        this.#destroyed = true

        this.#postEffects.forEach(effect => {
            effect.destroy()
        })
        this.#postEffects = null

        if (this.#ssao) {
            this.#ssao.destroy();
            this.#ssao = null;
        }
        if (this.#ssr) {
            this.#ssr.destroy();
            this.#ssr = null;
        }
        if (this.#autoExposure) {
            this.#autoExposure.destroy();
            this.#autoExposure = null;
        }

        this.#texturePool.clear();
        this.#texturePool = null

        this.#postEffectSystemUniformBuffer.destroy()
        this.#postEffectSystemUniformBuffer = null
        this.#postEffectSystemUniformBufferStructInfo = null
        keepLog(`🧹 ${this.view.name} PostEffectManager destroy 완료`)
    }

    /**
     * [KO] 후처리 파이프라인에 이펙트를 추가합니다.
     * [EN] Adds an effect to the post-processing pipeline.
     *
     * ### Example
     * ```typescript
     * view.postEffectManager.addEffect(new RedGPU.PostEffect.Sharpen(redGPUContext));
     * ```
     *
     * @param v -
     * [KO] 추가할 후처리 이펙트 인스턴스
     * [EN] Post-processing effect instance to add
     */
    addEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        this.#postEffects.push(v)
    }

    /**
     * [KO] 지정된 인덱스의 후처리 이펙트를 반환합니다.
     * [EN] Returns the post-processing effect at the specified index.
     *
     * @param index -
     * [KO] 조회할 인덱스
     * [EN] Index to retrieve
     * @returns
     * [KO] 해당 인덱스의 후처리 이펙트 인스턴스
     * [EN] Post-processing effect instance at the specified index
     */
    getEffectAt(index: number): ASinglePassPostEffect | AMultiPassPostEffect {
        return this.#postEffects[index]
    }

    /**
     * [KO] 특정 후처리 이펙트를 파이프라인에서 제거하고 리소스를 정리합니다.
     * [EN] Removes a specific post-processing effect from the pipeline and clears its resources.
     *
     * @param v -
     * [KO] 제거할 후처리 이펙트 인스턴스
     * [EN] Post-processing effect instance to remove
     */
    removeEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        const index = this.#postEffects.indexOf(v);
        if (index > -1) {
            v.clear();
            this.#postEffects.splice(index, 1);
        }
    }

    /**
     * [KO] 지정된 인덱스의 후처리 이펙트를 파이프라인에서 제거하고 리소스를 정리합니다.
     * [EN] Removes the post-processing effect at the specified index from the pipeline and clears its resources.
     *
     * @param index -
     * [KO] 제거할 이펙트의 인덱스
     * [EN] Index of the effect to remove
     */
    removeEffectAt(index: number) {
        if (this.#postEffects[index]) {
            this.#postEffects[index].clear();
            this.#postEffects.splice(index, 1);
        }
    }

    /**
     * [KO] 등록된 모든 후처리 이펙트를 제거하고 리소스를 정리합니다.
     * [EN] Removes all registered post-processing effects and clears their resources.
     */
    removeAllEffect() {
        this.#postEffects.forEach(effect => {
            effect.clear()
        })
        this.#postEffects.length = 0
    }

    /**
     * [KO] 전체 후처리 파이프라인을 실행하고 최종 출력 텍스처 정보를 반환합니다.
     * [EN] Executes the entire post-processing pipeline and returns the final output texture information.
     *
     * @returns
     * [KO] 최종 렌더링 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Final rendering result texture information (`IPostEffectResult`)
     */
    render(): IPostEffectResult {
        const {viewRenderTextureManager, redGPUContext, taa, fxaa} = this.#view;
        const {antialiasingManager} = redGPUContext
        const {useMSAA, useFXAA, useTAA, msaaID} = antialiasingManager;
        const gBufferColorTexture = viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);
        const {width, height} = gBufferColorTexture;

        if (this.#prevMSAAID_for_gbuffer !== msaaID) {
            this.#texturePool.clear();
        }

        this.#updateSystemUniforms();
        this.#updateGbufferBindGroup();
        const {useAutoExposure} = this.#view.rawCamera;

        let currentTextureView = this.#renderToStorageTexture(this.#view);

        if (this.#view.skyAtmosphere) {
            currentTextureView = this.#applySingleEffect(this.#view.skyAtmosphere, currentTextureView, width, height);
        }

        if (this.#useSSAO) {
            currentTextureView = this.#applySingleEffect(this.ssao, currentTextureView, width, height);
        }
        if (this.#useSSR) {
            currentTextureView = this.#applySingleEffect(this.ssr, currentTextureView, width, height);
        }

        if (useTAA && this.#view.constructor.name === 'View3D') {
            currentTextureView = this.#applySingleEffect(taa, currentTextureView, width, height);
        }

        if (useAutoExposure) {
            this.autoExposure.render(currentTextureView);
        }

        let toneMapped = false;
        const effects = this.#postEffects;
        for (let i = 0, len = effects.length; i < len; i++) {
            const effect = effects[i];
            if (effect.isLdr && !toneMapped) {
                currentTextureView = this.#applySingleEffect(this.#view.toneMappingManager, currentTextureView, width, height);
                toneMapped = true;
            }

            currentTextureView = this.#applySingleEffect(effect, currentTextureView, width, height);
        }

        if (!toneMapped) {
            currentTextureView = this.#applySingleEffect(this.#view.toneMappingManager, currentTextureView, width, height);
        }

        if (this.#view.grid) {
            const singleSampleDepthView = useMSAA
                ? viewRenderTextureManager.renderPath1DepthResultTextureView
                : viewRenderTextureManager.depthTextureView;
            this.#view.grid.render(this.#view, currentTextureView.textureView, singleSampleDepthView);
        }

        if (useFXAA || (useTAA && this.#view.constructor.name !== 'View3D')) {
            currentTextureView = this.#applySingleEffect(fxaa, currentTextureView, width, height);
        }

        if (useTAA && this.#view.constructor.name === 'View3D' && taa.sharpness > 0) {
            currentTextureView = this.#applySingleEffect(taa.casPass, currentTextureView, width, height);
        }

        this.#texturePool.releaseAll();

        return currentTextureView;
    }

    /**
     * [KO] 등록된 모든 이펙트와 텍스처 풀의 캐시된 리소스를 비웁니다.
     * [EN] Clears cached resources of all registered effects and the texture pool.
     */
    clear() {
        this.#postEffects.forEach(effect => {
            effect.clear()
        })
        if (this.#texturePool) {
            this.#texturePool.clear();
        }
    }

    #applySingleEffect(
        effect: {
            render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult
        },
        currentTextureView: IPostEffectResult,
        width: number,
        height: number
    ): IPostEffectResult {
        const nextTextureView = effect.render(this.#view, width, height, currentTextureView);
        if (currentTextureView && currentTextureView.texture) {
            this.#texturePool.release(currentTextureView.texture);
        }
        return nextTextureView;
    }

    #initGBufferLayouts() {
        const {gpuDevice} = this.#view.redGPUContext;

        const getEntries = (useMSAA: boolean): GPUBindGroupLayoutEntry[] => [
            {
                binding: 0,
                visibility: GPUShaderStage.COMPUTE,
                texture: {sampleType: 'depth', multisampled: useMSAA}
            },
            {binding: 1, visibility: GPUShaderStage.COMPUTE, texture: {}},
            {binding: 2, visibility: GPUShaderStage.COMPUTE, texture: {}},
            {
                binding: 3,
                visibility: GPUShaderStage.COMPUTE,
                texture: {sampleType: 'depth', multisampled: useMSAA}
            },
            {binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
            {binding: 5, visibility: GPUShaderStage.COMPUTE, sampler: {}}
        ];

        this.#gbufferBindGroupLayoutMSAA = gpuDevice.createBindGroupLayout({
            label: 'PostEffect_Shared_GBuffer_BGL_MSAA',
            entries: getEntries(true)
        });
        this.#gbufferBindGroupLayoutNonMSAA = gpuDevice.createBindGroupLayout({
            label: 'PostEffect_Shared_GBuffer_BGL_NonMSAA',
            entries: getEntries(false)
        });
    }

    #updateGbufferBindGroup() {
        const {viewRenderTextureManager, redGPUContext} = this.#view;
        const {gpuDevice, antialiasingManager, resourceManager} = redGPUContext;
        const {useMSAA, msaaID} = antialiasingManager;

        const gBufferColorTexture = viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);
        const {width, height} = gBufferColorTexture;

        const msaaChanged = this.#prevMSAAID_for_gbuffer !== msaaID;
        const dimensionsChanged = this.#prevWidth !== width || this.#prevHeight !== height;

        if (msaaChanged || dimensionsChanged) {
            const depthView0 = viewRenderTextureManager.depthTextureView;
            const depthView1 = viewRenderTextureManager.prevDepthTextureView;

            const normalView = useMSAA
                ? viewRenderTextureManager.getGBufferResolveTextureView(GBUFFER_TYPE.NORMAL)
                : viewRenderTextureManager.getGBufferTextureView(GBUFFER_TYPE.NORMAL);

            const motionVectorView = useMSAA
                ? viewRenderTextureManager.getGBufferResolveTextureView(GBUFFER_TYPE.MOTION_VECTOR)
                : viewRenderTextureManager.getGBufferTextureView(GBUFFER_TYPE.MOTION_VECTOR);

            const basicSampler = resourceManager.basicSampler.gpuSampler;
            const systemUniformBuffer = {
                buffer: this.#postEffectSystemUniformBuffer.gpuBuffer,
                offset: 0,
                size: this.#postEffectSystemUniformBuffer.size
            };

            const getEntries = (currentDepth: GPUTextureView, prevDepth: GPUTextureView) => [
                {binding: 0, resource: currentDepth},
                {binding: 1, resource: normalView},
                {binding: 2, resource: motionVectorView},
                {binding: 3, resource: prevDepth},
                {binding: 4, resource: systemUniformBuffer},
                {binding: 5, resource: basicSampler}
            ];

            const layout = useMSAA ? this.#gbufferBindGroupLayoutMSAA : this.#gbufferBindGroupLayoutNonMSAA;

            this.#gbufferBindGroup_swap0 = gpuDevice.createBindGroup({
                label: 'PostEffect_Shared_GBuffer_BG_Swap0',
                layout,
                entries: getEntries(depthView0, depthView1)
            });

            this.#gbufferBindGroup_swap1 = gpuDevice.createBindGroup({
                label: 'PostEffect_Shared_GBuffer_BG_Swap1',
                layout,
                entries: getEntries(depthView1, depthView0)
            });

            this.#prevMSAAID_for_gbuffer = msaaID;
        }
    }

    #checkSSAO() {
        if (!this.#ssao && this.#useSSAO) {
            this.#ssao = new SSAO(this.#view.redGPUContext)
        }
    }

    #checkSSR() {
        if (!this.#ssr && this.#useSSR) {
            this.#ssr = new SSR(this.#view.redGPUContext)
        }
    }

    #updateSystemUniforms() {
        const {
            inverseProjectionMatrix,
            projectionMatrix,
            noneJitterProjectionMatrix,
            rawCamera,
            redGPUContext,
            taa,
            renderViewStateData,
            skyAtmosphere
        } = this.#view;
        const {gpuDevice, antialiasingManager} = redGPUContext;
        const {viewMatrix} = rawCamera;
        const {gpuBuffer} = this.#postEffectSystemUniformBuffer;
        const {members} = this.#postEffectSystemUniformBufferStructInfo;
        const {camera, time, projection} = members;

        rawCamera.updateExposure(this.#view);

        const projectionViewMatrix = mat4.multiply(temp, projectionMatrix, viewMatrix);
        const noneJitterProjectionViewMatrix = mat4.multiply(temp2, noneJitterProjectionMatrix, viewMatrix);

        SystemUniformUpdater.updateCamera(rawCamera, camera.members, this.#uniformDataF32, this.#uniformDataU32);

        SystemUniformUpdater.updateTime(renderViewStateData, time.members, this.#uniformDataF32, this.#uniformDataU32);

        SystemUniformUpdater.updateProjection(
            {
                projectionMatrix,
                projectionViewMatrix,
                noneJitterProjectionMatrix,
                noneJitterProjectionViewMatrix,
                inverseProjectionMatrix,
                inverseProjectionViewMatrix: mat4.invert(temp3, projectionViewMatrix),
                prevNoneJitterProjectionViewMatrix: antialiasingManager.useTAA ? taa.prevNoneJitterProjectionViewMatrix : noneJitterProjectionViewMatrix
            },
            projection.members,
            this.#uniformDataF32,
            this.#uniformDataU32
        );

        SystemUniformUpdater.updateSkyAtmosphere(skyAtmosphere, members, this.#uniformDataF32, this.#uniformDataU32);

        updateSystemUniformData(members, this.#uniformDataF32, this.#uniformDataU32, [
            {key: 'preExposure', value: this.autoExposure.preExposure},
            {key: 'devicePixelRatio', value: devicePixelRatio}
        ]);

        gpuDevice.queue.writeBuffer(gpuBuffer, 0, this.#uniformData);
    }

    #init() {
        const {redGPUContext} = this.#view;
        const {resourceManager} = redGPUContext
        const SHADER_INFO = resourceManager.wgslParser.parse('POST_EFFECT_SYSTEM_UNIFORM', ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM)
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.systemUniforms;
        const postEffectSystemUniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
        this.#postEffectSystemUniformBufferStructInfo = UNIFORM_STRUCT;
        this.#postEffectSystemUniformBuffer = new UniformBuffer(redGPUContext, postEffectSystemUniformData, `${this.#view.name}_POST_EFFECT_SYSTEM_UNIFORM_BUFFER`);
        this.#uniformData = new ArrayBuffer(this.#postEffectSystemUniformBufferStructInfo.endOffset)
        this.#uniformDataF32 = new Float32Array(this.#uniformData)
        this.#uniformDataU32 = new Uint32Array(this.#uniformData)
    }

    #calcVideoMemory() {
        this.#videoMemorySize = 0;
        if (this.#texturePool) {
            this.#videoMemorySize += this.#texturePool.videoMemorySize;
        }
        this.#postEffects.forEach(effect => {
            this.#videoMemorySize += effect.videoMemorySize
        })
    }

    #renderToStorageTexture(view: View3D): IPostEffectResult {
        const {redGPUContext, viewRenderTextureManager} = view;
        const gBufferColorTexture = viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);
        const {antialiasingManager} = redGPUContext;
        const {width, height} = gBufferColorTexture;

        const dimensionsChanged = width !== this.#prevWidth || height !== this.#prevHeight;
        if (dimensionsChanged) {
            this.#texturePool.clear();
            this.#prevWidth = width;
            this.#prevHeight = height;
        }
        const initialSourceTexture = antialiasingManager.useMSAA
            ? viewRenderTextureManager.getGBufferResolveTexture(GBUFFER_TYPE.COLOR)
            : viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);

        this.#initialResult.texture = initialSourceTexture;
        this.#initialResult.textureView = antialiasingManager.useMSAA
            ? viewRenderTextureManager.getGBufferResolveTextureView(GBUFFER_TYPE.COLOR)
            : viewRenderTextureManager.getGBufferTextureView(GBUFFER_TYPE.COLOR);

        return this.#initialResult;
    }
}

let temp = mat4.create()
let temp2 = mat4.create()
let temp3 = mat4.create()
Object.freeze(PostEffectManager)
export default PostEffectManager
