import {mat4} from "gl-matrix";
import View3D from "../display/view/View3D";
import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";
import AMultiPassPostEffect from "./core/AMultiPassPostEffect";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";
import ShaderLibrary from "../systemCodeManager/ShaderLibrary";
import SSAO from "./effects/ssao/SSAO";
import SSR from "./effects/ssr/SSR";
import TAASharpen from "../antialiasing/taa/sharpen/TAASharpen";
import SystemUniformUpdater from "../renderer/helperFunc/SystemUniformUpdater";
import updateSystemUniformData from "../renderer/helperFunc/updateSystemUniformData";
import AutoExposure from "../camera/core/autoExposure/AutoExposure";
import GBUFFER_TYPE from "../display/view/core/GBUFFER_TYPE";
import PostEffectTexturePool from "./core/PostEffectTexturePool";
import {IPostEffectResult} from "./core/types";
import {keepLog} from "../utils";


/**
 * [KO] 후처리 이펙트(PostEffect) 관리 클래스입니다.
 * [EN] Class for managing post-processing effects.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
 * const effect = new RedGPU.PostEffect.OldBloom(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * @category Core
 */
class PostEffectManager {
    /**
     * [KO] 연결된 View3D 인스턴스 (읽기 전용)
     * [EN] Connected View3D instance (read-only)
     */
    readonly #view: View3D
    /**
     * [KO] 등록된 후처리 이펙트 리스트
     * [EN] List of registered post-processing effects
     */
    #postEffects: Array<ASinglePassPostEffect | AMultiPassPostEffect> = []
    /**
     * [KO] 텍스처 풀
     * [EN] Texture pool
     */
    #texturePool: PostEffectTexturePool

    /**
     * [KO] 이전 프레임 텍스처 크기
     * [EN] Texture size of the previous frame
     */
    #previousDimensions: { width: number, height: number }
    /**
     * [KO] 시스템 유니폼 버퍼
     * [EN] System globalStruct buffer
     */
    #postEffectSystemUniformBuffer: UniformBuffer;
    /**
     * [KO] 시스템 유니폼 버퍼 구조 정보
     * [EN] System globalStruct buffer struct info
     */
    #postEffectSystemUniformBufferStructInfo;
    /**
     * [KO] 비디오 메모리 사용량 (byte)
     * [EN] Video memory usage (bytes)
     */
    #videoMemorySize: number = 0
    #uniformData: ArrayBuffer
    #uniformDataF32: Float32Array
    #uniformDataU32: Uint32Array
    #taaSharpenEffect: TAASharpen
    #ssao: SSAO;
    #useSSAO: boolean = false;
    #ssr: SSR;
    #useSSR: boolean = false;
    #autoExposure: AutoExposure;

    // G-Buffer 공유 자원 관련
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
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     */
    constructor(view: View3D) {
        this.#view = view;
        this.#texturePool = new PostEffectTexturePool(this.#view.redGPUContext);
        this.#init();
        this.#initGBufferLayouts();
    }

    destroy() {
        if (this.#destroyed) return;
        this.#destroyed = true

        // 1. 사용자 추가 이펙트들 파괴
        this.#postEffects.forEach(effect => {
            effect.destroy()
        })
        this.#postEffects = null

        // 2. 내부 고정 멤버 필터들의 명시적 파괴 연동
        if (this.#ssao) {
            this.#ssao.destroy();
            this.#ssao = null;
        }
        if (this.#ssr) {
            this.#ssr.destroy();
            this.#ssr = null;
        }
        if (this.#taaSharpenEffect) {
            this.#taaSharpenEffect.destroy();
            this.#taaSharpenEffect = null;
        }
        if (this.#autoExposure) {
            this.#autoExposure.destroy();
            this.#autoExposure = null;
        }

        // 3. 텍스처 풀 및 시스템 버퍼 파괴
        this.#texturePool.clear();
        this.#texturePool = null

        this.#postEffectSystemUniformBuffer.destroy()
        this.#postEffectSystemUniformBuffer = null
        this.#postEffectSystemUniformBufferStructInfo = null
        keepLog(`🧹 ${this.view.name} PostEffectManager destroy 완료`)
    }

    /**
     * [KO] 현재 MSAA 상태에 맞는 표준 G-Buffer 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the standard G-Buffer bind group layout for the current MSAA state.
     *
     * @returns
     * [KO] G-Buffer 바인드 그룹 레이아웃
     * [EN] G-Buffer bind group layout
     */
    get gbufferBindGroupLayout(): GPUBindGroupLayout {
        return this.#view.redGPUContext.antialiasingManager.useMSAA ? this.#gbufferBindGroupLayoutMSAA : this.#gbufferBindGroupLayoutNonMSAA;
    }

    /**
     * [KO] 현재 스왑 인덱스에 맞는 공유 G-Buffer 바인드 그룹을 반환합니다.
     * [EN] Returns the shared G-Buffer bind group for the current swap index.
     *
     * @returns
     * [KO] 공유 G-Buffer 바인드 그룹
     * [EN] Shared G-Buffer bind group
     */
    get gbufferBindGroup(): GPUBindGroup {
        return this.#view.renderViewStateData.swapBufferIndex ? this.#gbufferBindGroup_swap1 : this.#gbufferBindGroup_swap0;
    }

    /**
     * [KO] 텍스처 풀 인스턴스를 반환합니다.
     * [EN] Returns the texture pool instance.
     *
     * @returns
     * [KO] 포스트 이펙트 텍스처 풀 인스턴스
     * [EN] Post-effect texture pool instance
     */
    get texturePool(): PostEffectTexturePool {
        return this.#texturePool;
    }

    /**
     * [KO] 자동 노출(Auto Exposure) 인스턴스를 반환합니다.
     * [EN] Returns the Auto Exposure instance.
     *
     * @returns
     * [KO] 자동 노출 인스턴스
     * [EN] Auto Exposure instance
     */
    get autoExposure(): AutoExposure {
        if (!this.#autoExposure) {
            this.#autoExposure = new AutoExposure(this.#view);
        }
        return this.#autoExposure;
    }

    /**
     * [KO] SSAO 사용 여부를 반환합니다.
     * [EN] Returns whether SSAO is used.
     *
     * @returns
     * [KO] SSAO 사용 여부
     * [EN] Whether SSAO is used
     */
    get useSSAO(): boolean {
        return this.#useSSAO;
    }

    /**
     * [KO] SSAO 사용 여부를 설정합니다.
     * [EN] Sets whether SSAO is used.
     *
     * @param value -
     * [KO] SSAO 사용 여부
     * [EN] Whether SSAO is used
     */
    set useSSAO(value: boolean) {
        this.#useSSAO = value;
        this.#checkSSAO()
    }

    /**
     * [KO] SSAO 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSAO effect instance.
     *
     * @returns
     * [KO] SSAO 인스턴스
     * [EN] SSAO instance
     */
    get ssao(): SSAO {
        if (!this.#ssao) {
            this.#ssao = new SSAO(this.#view.redGPUContext)
        }
        return this.#ssao;
    }

    /**
     * [KO] SSR 사용 여부를 반환합니다.
     * [EN] Returns whether SSR is used.
     *
     * @returns
     * [KO] SSR 사용 여부
     * [EN] Whether SSR is used
     */
    get useSSR(): boolean {
        return this.#useSSR;
    }

    /**
     * [KO] SSR 사용 여부를 설정합니다.
     * [EN] Sets whether SSR is used.
     *
     * @param value -
     * [KO] SSR 사용 여부
     * [EN] Whether SSR is used
     */
    set useSSR(value: boolean) {
        this.#useSSR = value;
        this.#checkSSR()
    }

    /**
     * [KO] SSR 이펙트 인스턴스를 반환합니다.
     * [EN] Returns the SSR effect instance.
     *
     * @returns
     * [KO] SSR 인스턴스
     * [EN] SSR instance
     */
    get ssr(): SSR {
        if (!this.#ssr) {
            this.#ssr = new SSR(this.#view.redGPUContext)
        }
        return this.#ssr;
    }

    /**
     * [KO] 시스템 유니폼 버퍼를 반환합니다.
     * [EN] Returns the system globalStruct buffer.
     *
     * @returns
     * [KO] UniformBuffer 인스턴스
     * [EN] UniformBuffer instance
     */
    get postEffectSystemUniformBuffer(): UniformBuffer {
        return this.#postEffectSystemUniformBuffer;
    }

    /**
     * [KO] 연결된 View3D 인스턴스를 반환합니다.
     * [EN] Returns the connected View3D instance.
     *
     * @returns
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     */
    get view(): View3D {
        return this.#view;
    }

    /**
     * [KO] 등록된 이펙트 리스트를 반환합니다.
     * [EN] Returns the list of registered effects.
     *
     * @returns
     * [KO] 후처리 이펙트 배열
     * [EN] Array of post-processing effects
     */
    get effectList(): Array<ASinglePassPostEffect | AMultiPassPostEffect> {
        return this.#postEffects;
    }

    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns video memory usage.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (bytes)
     * [EN] Video memory usage (bytes)
     */
    get videoMemorySize(): number {
        this.#calcVideoMemory()
        return this.#videoMemorySize;
    }

    /**
     * [KO] 이펙트를 추가합니다.
     * [EN] Adds an effect.
     *
     * * ### Example
     * ```typescript
     * view.postEffectManager.addEffect(new RedGPU.PostEffect.Bloom(redGPUContext));
     * ```
     *
     * @param v -
     * [KO] 추가할 이펙트
     * [EN] Effect to add
     */
    addEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        this.#postEffects.push(v)
    }

    /**
     * [KO] 특정 인덱스의 이펙트를 반환합니다.
     * [EN] Returns the effect at a specific index.
     *
     * @param index -
     * [KO] 인덱스
     * [EN] Index
     * @returns
     * [KO] 해당 인덱스의 이펙트
     * [EN] Effect at the given index
     */
    getEffectAt(index: number): ASinglePassPostEffect | AMultiPassPostEffect {
        return this.#postEffects[index]
    }

    /**
     * [KO] 특정 이펙트를 제거합니다.
     * [EN] Removes a specific effect.
     *
     * @param v -
     * [KO] 제거할 이펙트
     * [EN] Effect to remove
     */
    removeEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
        const index = this.#postEffects.indexOf(v);
        if (index > -1) {
            v.clear();
            this.#postEffects.splice(index, 1);
        }
    }

    /**
     * [KO] 특정 인덱스의 이펙트를 제거합니다.
     * [EN] Removes the effect at a specific index.
     *
     * @param index -
     * [KO] 인덱스
     * [EN] Index
     */
    removeEffectAt(index: number) {
        if (this.#postEffects[index]) {
            this.#postEffects[index].clear();
            this.#postEffects.splice(index, 1);
        }
    }

    /**
     * [KO] 모든 이펙트를 제거합니다.
     * [EN] Removes all effects.
     */
    removeAllEffect() {
        this.#postEffects.forEach(effect => {
            effect.clear()
        })
        this.#postEffects.length = 0
    }

    /**
     * [KO] 후처리 파이프라인을 렌더링합니다.
     * [EN] Renders the post-processing pipeline.
     *
     * @returns
     * [KO] 렌더링 결과 텍스처 정보
     * [EN] Rendering result texture information
     */
    render(): IPostEffectResult {
        const {viewRenderTextureManager, redGPUContext, taa, fxaa} = this.#view;
        const {antialiasingManager} = redGPUContext
        const {useMSAA, useFXAA, useTAA, msaaID} = antialiasingManager;
        const gBufferColorTexture = viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);
        const {width, height} = gBufferColorTexture;

        // MSAA 상태가 바뀌면 텍스처 풀을 클리어 (리소스 규격이나 처리 흐름이 바뀔 수 있음)
        if (this.#prevMSAAID_for_gbuffer !== msaaID) {
            this.#texturePool.clear();
        }

        // 초기 텍스처 설정 (MSAA 여부에 따라 소스 결정)
        const initialSourceTexture = useMSAA
            ? viewRenderTextureManager.getGBufferResolveTexture(GBUFFER_TYPE.COLOR)
            : viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);

        this.#updateSystemUniforms();
        this.#updateGbufferBindGroup();
        const {useAutoExposure} = this.#view.rawCamera;

        let currentTextureView = this.#renderToStorageTexture(this.#view);

        // [KO] 1. HDR 단계: SkyAtmosphere, SSAO, SSR (장면 구성 요소)
        // [EN] 1. HDR Phase: SkyAtmosphere, SSAO, SSR (Scene components)
        if (this.#view.skyAtmosphere) {
            currentTextureView = this.#applyEffect(currentTextureView, () => this.#view.skyAtmosphere.render(
                this.#view,
                width,
                height,
                currentTextureView
            ));
        }

        if (this.#useSSAO) {
            currentTextureView = this.#applyEffect(currentTextureView, () => this.ssao.render(
                this.#view,
                width,
                height,
                currentTextureView
            ));
        }
        if (this.#useSSR) {
            currentTextureView = this.#applyEffect(currentTextureView, () => this.ssr.render(
                this.#view,
                width,
                height,
                currentTextureView
            ));
        }

        // [KO] 2. 노출 및 사용자 이펙트 단계 (Smart Tone Mapping Transition)
        // [EN] 2. Exposure and User Effects Phase (Smart Tone Mapping Transition)
        if (useAutoExposure) {
            this.autoExposure.render(currentTextureView);
        }

        let toneMapped = false;
        this.#postEffects.forEach(effect => {
            // [KO] 처음으로 LDR 이펙트를 만나면 그 즉시 톤매핑 수행
            // [EN] Perform tone mapping immediately upon encountering the first LDR effect
            if (effect.isLdr && !toneMapped) {
                currentTextureView = this.#applyEffect(currentTextureView, () => this.#view.toneMappingManager.render(
                    this.#view,
                    width,
                    height,
                    currentTextureView
                ));
                toneMapped = true;
            }

            currentTextureView = this.#applyEffect(currentTextureView, () => effect.render(
                this.#view,
                width,
                height,
                currentTextureView,
            ));
        });

        // [KO] 루프가 끝날 때까지 톤매핑이 수행되지 않았다면 마지막에 수행
        // [EN] If tone mapping hasn't been performed by the end of the loop, perform it at the end
        if (!toneMapped) {
            currentTextureView = this.#applyEffect(currentTextureView, () => this.#view.toneMappingManager.render(
                this.#view,
                width,
                height,
                currentTextureView
            ));
        }


        // [KO] 3. LDR 단계: AA (FXAA / TAA)
        // [EN] 3. LDR Phase: AA (FXAA / TAA)
        if (useFXAA) {
            currentTextureView = this.#applyEffect(currentTextureView, () => fxaa.render(
                this.#view,
                width,
                height,
                currentTextureView
            ));
        }

        if (useTAA) {
            if (this.#view.constructor.name === 'View3D') { // View2D에는 TAA적용 안함{
                currentTextureView = this.#applyEffect(currentTextureView, () => taa.render(
                    this.#view,
                    width,
                    height,
                    currentTextureView
                ));
                if (!this.#taaSharpenEffect) {
                    this.#taaSharpenEffect = new TAASharpen(redGPUContext)
                }
                currentTextureView = this.#applyEffect(currentTextureView, () => this.#taaSharpenEffect.render(
                    this.#view,
                    width,
                    height,
                    currentTextureView
                ));
            } else {
                currentTextureView = this.#applyEffect(currentTextureView, () => fxaa.render(
                    this.#view,
                    width,
                    height,
                    currentTextureView
                ));
            }
        }

        // 프레임 렌더링 종료 후 사용된 텍스처 일괄 회수
        this.#texturePool.releaseAll();

        // keepLog(this.#view.name, this.#texturePool)
        return currentTextureView;
    }

    /**
     * [KO] 모든 이펙트 리소스를 정리합니다.
     * [EN] Clears all effect resources.
     */
    clear() {
        this.#postEffects.forEach(effect => {
            effect.clear()
        })
        if (this.#texturePool) {
            this.#texturePool.clear();
        }
    }

    #applyEffect(currentTextureView: IPostEffectResult, renderFn: () => IPostEffectResult): IPostEffectResult {
        const nextTextureView = renderFn();
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
            }, // depthTexture
            {binding: 1, visibility: GPUShaderStage.COMPUTE, texture: {}}, // gBufferNormalTexture
            {binding: 2, visibility: GPUShaderStage.COMPUTE, texture: {}}, // gBufferMotionVector
            {
                binding: 3,
                visibility: GPUShaderStage.COMPUTE,
                texture: {sampleType: 'depth', multisampled: useMSAA}
            }, // prevDepthTexture
            {binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}, // systemUniforms
            {binding: 5, visibility: GPUShaderStage.COMPUTE, sampler: {}} // basicSampler
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
        const dimensionsChanged = this.#previousDimensions?.width !== width || this.#previousDimensions?.height !== height;

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

        // Update Camera
        SystemUniformUpdater.updateCamera(rawCamera, camera.members, this.#uniformDataF32, this.#uniformDataU32);

        // Update Time
        SystemUniformUpdater.updateTime(renderViewStateData, time.members, this.#uniformDataF32, this.#uniformDataU32);

        // Update Projection
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

        // Update SkyAtmosphere
        SystemUniformUpdater.updateSkyAtmosphere(skyAtmosphere, members, this.#uniformDataF32, this.#uniformDataU32);

        // Update Exposure and DPR
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
        // 텍스처 풀의 전체 메모리 합산 (활성 + 유휴 텍스처 모두 포함)
        if (this.#texturePool) {
            this.#videoMemorySize += this.#texturePool.videoMemorySize;
        }
        // 개별 이펙트들이 풀링되지 않는 별도의 자원(버퍼 등)을 가지고 있을 경우를 위해 호출 유지
        // ASinglePassPostEffect의 videoMemorySize는 이미 풀 텍스처를 중복 계산하지 않음
        this.#postEffects.forEach(effect => {
            this.#videoMemorySize += effect.videoMemorySize
        })
    }

    #renderToStorageTexture(view: View3D): IPostEffectResult {
        const {redGPUContext, viewRenderTextureManager} = view;
        const gBufferColorTexture = viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);
        const {antialiasingManager} = redGPUContext;
        const {width, height} = gBufferColorTexture;

        const dimensionsChanged = width !== this.#previousDimensions?.width || height !== this.#previousDimensions?.height;
        if (dimensionsChanged) {
            this.#texturePool.clear();
            this.#previousDimensions = {width, height};
        }
        const initialSourceTexture = antialiasingManager.useMSAA
            ? viewRenderTextureManager.getGBufferResolveTexture(GBUFFER_TYPE.COLOR)
            : viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);

        return {
            texture: initialSourceTexture,
            textureView: antialiasingManager.useMSAA ? viewRenderTextureManager.getGBufferResolveTextureView(GBUFFER_TYPE.COLOR) : viewRenderTextureManager.getGBufferTextureView(GBUFFER_TYPE.COLOR)
        };
    }
}

let temp = mat4.create()
let temp2 = mat4.create()
let temp3 = mat4.create()
Object.freeze(PostEffectManager)
export default PostEffectManager
