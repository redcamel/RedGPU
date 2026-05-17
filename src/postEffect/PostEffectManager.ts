import {mat4} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import View3D from "../display/view/View3D";
import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../resources/wgslParser/parseWGSL";
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
import PostEffectTexturePool from "./PostEffectTexturePool";
import {keepLog} from "../utils";
import {COMMAND_ENCODER_TYPE} from "../renderer/commandEncoder/COMMAND_ENCODER_TYPE";


/**
 * [KO] 후처리 이펙트(PostEffect) 관리 클래스입니다.
 * [EN] Class for managing post-processing effects.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다. <br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system. <br/> Do not create an instance directly using the 'new' keyword.
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
     * [KO] 내부 스토리지 텍스처
     * [EN] Internal storage texture
     */
    #storageTexture: GPUTexture
    /**
     * [KO] 소스 텍스처 뷰
     * [EN] Source texture view
     */
    #sourceTextureView: GPUTextureView
    /**
     * [KO] 스토리지 텍스처 뷰
     * [EN] Storage texture view
     */
    #storageTextureView: GPUTextureView
    /**
     * [KO] 이전 프레임 텍스처 크기
     * [EN] Texture size of the previous frame
     */
    #previousDimensions: { width: number, height: number }
    /**
     * [KO] 시스템 유니폼 버퍼
     * [EN] System uniform buffer
     */
    #postEffectSystemUniformBuffer: UniformBuffer;
    /**
     * [KO] 시스템 유니폼 버퍼 구조 정보
     * [EN] System uniform buffer struct info
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
        this.#init()
    }

    /**
     * [KO] 텍스처 풀 인스턴스를 반환합니다.
     * [EN] Returns the texture pool instance.
     */
    get texturePool(): PostEffectTexturePool {
        return this.#texturePool;
    }

    /**
     * [KO] 자동 노출(Auto Exposure) 인스턴스를 반환합니다.
     * [EN] Returns the Auto Exposure instance.
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
     * [EN] Returns the system uniform buffer.
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

    // addEffectAt(v: ASinglePassPostEffect | AMultiPassPostEffect) {
    //     //TODO
    // }

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

    // removeEffect(v: ASinglePassPostEffect | AMultiPassPostEffect) {
    //     //TODO
    // }
    //
    // removeEffectAt(v: ASinglePassPostEffect | AMultiPassPostEffect) {
    //     //TODO
    // }

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
    render() {
        const {viewRenderTextureManager, redGPUContext, taa, fxaa} = this.#view;
        const {antialiasingManager} = redGPUContext
        const {useMSAA, useFXAA, useTAA} = antialiasingManager;
        const gBufferColorTexture = viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);
        const {width, height} = gBufferColorTexture;

        // 초기 텍스처 설정 (MSAA 여부에 따라 소스 결정)
        const initialSourceTexture = useMSAA
            ? viewRenderTextureManager.getGBufferResolveTexture(GBUFFER_TYPE.COLOR)
            : viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);

        this.#updateSystemUniforms()
        this.#sourceTextureView = this.#renderToStorageTexture(this.#view, initialSourceTexture);

        const {useAutoExposure} = this.#view.rawCamera;

        let currentTextureView = {
            texture: this.#storageTexture,
            textureView: this.#sourceTextureView,
        };

        // SkyAtmosphere 전용 처리 (톤 매핑 전 HDR 공간에서 실행)
        if (this.#view.skyAtmosphere) {
            currentTextureView = this.#view.skyAtmosphere.render(
                this.#view,
                width,
                height,
                currentTextureView
            );
        }


        this.#postEffects.forEach(effect => {
            currentTextureView = effect.render(
                this.#view,
                width,
                height,
                currentTextureView,
            );
        });
        // Auto Exposure 처리 (HDR 공간에서 수행)
        if (useAutoExposure) {
            this.autoExposure.render(currentTextureView);
        }

        {
            currentTextureView = this.#view.toneMappingManager.render(
                width,
                height,
                currentTextureView
            );
        }


        if (useFXAA) {
            currentTextureView = fxaa.render(
                this.#view,
                width,
                height,
                currentTextureView
            );
        }
        if (this.#useSSAO) {
            currentTextureView = this.ssao.render(
                this.#view,
                width,
                height,
                currentTextureView
            );
        }
        if (this.#useSSR) {
            currentTextureView = this.ssr.render(
                this.#view,
                width,
                height,
                currentTextureView
            );
        }

        if (useTAA) {
            if (this.#view.constructor.name === 'View3D') { // View2D에는 TAA적용 안함{
                currentTextureView = taa.render(
                    this.#view,
                    width,
                    height,
                    currentTextureView
                );
                if (!this.#taaSharpenEffect) {
                    this.#taaSharpenEffect = new TAASharpen(redGPUContext)
                }
                currentTextureView = this.#taaSharpenEffect.render(
                    this.#view,
                    width,
                    height,
                    currentTextureView
                )
            } else {
                currentTextureView = fxaa.render(
                    this.#view,
                    width,
                    height,
                    currentTextureView
                );
            }
        }

        // 프레임 렌더링 종료 후 사용된 텍스처 일괄 회수
        this.#texturePool.releaseAll();

        keepLog(this.#view.name, this.#texturePool)
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
        this.#storageTexture = null;
        this.#storageTextureView = null;
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
            taa
        } = this.#view
        rawCamera.updateExposure(this.#view);
        const {gpuDevice} = redGPUContext
        const {viewMatrix} = rawCamera
        const structInfo = this.#postEffectSystemUniformBufferStructInfo
        const gpuBuffer = this.#postEffectSystemUniformBuffer.gpuBuffer;

        const projectionViewMatrix = mat4.multiply(temp, projectionMatrix, viewMatrix);
        const noneJitterProjectionViewMatrix = mat4.multiply(temp2, noneJitterProjectionMatrix, viewMatrix);
        {
            const {members} = structInfo;
            const cameraMembers = members.camera.members;
            SystemUniformUpdater.updateCamera(rawCamera, cameraMembers, this.#uniformDataF32, this.#uniformDataU32)
            SystemUniformUpdater.updateTime(
                this.#view.renderViewStateData,
                members.time.members,
                this.#uniformDataF32,
                this.#uniformDataU32
            )
            SystemUniformUpdater.updateProjection(
                {
                    projectionMatrix,
                    projectionViewMatrix,
                    noneJitterProjectionMatrix,
                    noneJitterProjectionViewMatrix,
                    inverseProjectionMatrix,
                    inverseProjectionViewMatrix: mat4.invert(temp3, projectionViewMatrix),
                    prevNoneJitterProjectionViewMatrix: redGPUContext.antialiasingManager.useTAA ? taa.prevNoneJitterProjectionViewMatrix : noneJitterProjectionViewMatrix
                },
                members.projection.members,
                this.#uniformDataF32,
                this.#uniformDataU32
            )
            SystemUniformUpdater.updateSkyAtmosphere(
                this.#view.skyAtmosphere,
                members,
                this.#uniformDataF32,
                this.#uniformDataU32
            )
            updateSystemUniformData(members, this.#uniformDataF32, this.#uniformDataU32, [
                {
                    key: 'preExposure',
                    value: this.autoExposure.preExposure
                }
            ]);
        }
        gpuDevice.queue.writeBuffer(gpuBuffer, 0, this.#uniformData);
    }

    #init() {
        const {redGPUContext} = this.#view;
        const SHADER_INFO = parseWGSL('POST_EFFECT_SYSTEM_UNIFORM', ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM)
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

    #renderToStorageTexture(view: View3D, sourceTexture: GPUTexture) {
        const {redGPUContext, viewRenderTextureManager} = view;
        const gBufferColorTexture = viewRenderTextureManager.getGBufferTexture(GBUFFER_TYPE.COLOR);
        const {resourceManager} = redGPUContext;
        const {width, height} = gBufferColorTexture;

        const dimensionsChanged = width !== this.#previousDimensions?.width || height !== this.#previousDimensions?.height;
        if (dimensionsChanged) {
            this.#texturePool.clear();
            this.#previousDimensions = {width, height};
        }

        this.#storageTexture = this.#texturePool.alloc(width, height, 'rgba16float');
        this.#storageTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#storageTexture);

        // [KO] Compute Shader 대신 copyTextureToTexture를 사용하여 성능 최적화
        // [EN] Performance optimization by using copyTextureToTexture instead of Compute Shader
        redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, encoder => {
            encoder.copyTextureToTexture(
                {texture: sourceTexture},
                {texture: this.#storageTexture},
                [width, height]
            );
        });


        return this.#storageTextureView;
    }
}

let temp = mat4.create()
let temp2 = mat4.create()
let temp3 = mat4.create()
Object.freeze(PostEffectManager)
export default PostEffectManager
