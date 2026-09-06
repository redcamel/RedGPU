import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
import {IPostEffectResult} from "../../postEffect/core/types";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";

/**
 * [KO] TAA(Temporal Anti-Aliasing) 후처리 이펙트입니다.
 * [EN] TAA (Temporal Anti-Aliasing) post-processing effect.
 *
 * [KO] 이전 프레임들의 정보를 현재 프레임에 누적하여 계단 현상을 제거하는 고품질 안티앨리어싱 기법입니다. 화면이 정지해 있을 때도 부드러운 외곽선을 유지하며, MSAA보다 적은 비용으로 우수한 품질을 제공합니다.
 * [EN] A high-quality anti-aliasing technique that removes aliasing by accumulating information from previous frames into the current frame. It maintains smooth edges even when the screen is static and provides superior quality at a lower cost than MSAA.
 *
 * [KO] 이 효과는 지터링(Jittering)된 투영 행렬과 모션 벡터(Motion Vector)를 활용하여 프레임 간의 픽셀 대응점을 추적합니다.
 * [EN] This effect utilizes jittered projection matrices and motion vectors to track pixel correspondences between frames.
 *
 * ::: warning
 * [KO] 이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
 * :::
 *
 * * ### Example
 * ```typescript
 * // [KO] AntialiasingManager를 통해 TAA를 활성화합니다.
 * // [EN] Enable TAA via AntialiasingManager.
 * redGPUContext.antialiasingManager.useTAA = true;
 * ```
 *
 * @category PostEffect
 */
class TAA extends ASinglePassPostEffect {
    #historyTextures: [GPUTexture, GPUTexture] = [null, null];
    #historyTextureViews: [GPUTextureView, GPUTextureView] = [null, null];
    #historyResults: [IPostEffectResult, IPostEffectResult] = [null, null];
    #historyIndex: number = 0;
    /** [KO] 현재 프레임 누적 인덱스 [EN] Current frame accumulation index */
    #frameIndex: number = 0;
    /** [KO] 지터링 강도 [EN] Jitter strength */
    #jitterStrength: number = 0.5;
    #prevJitterOffset: [number, number] = [0, 0];
    #prevNoneJitterProjectionViewMatrix: mat4 = mat4.create();
    #videoMemorySize: number = 0;
    #prevInfo: { width: number, height: number };

    /**
     * [KO] TAA 인스턴스를 생성합니다.
     * [EN] Creates a TAA instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {x: 8, y: 8, z: 1});
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_TAA',
            createBasicPostEffectCode(
                this,
                computeCode,
                uniformStructCode,
                [
                    {name: 'sourceTexture'},
                    {name: 'historyTexture'}
                ]
            )
        );
        this.jitterStrength = this.#jitterStrength;
    }

    /**
     * [KO] 이전 프레임의 지터링 없는 투영 뷰(Projection-View) 행렬을 반환합니다.
     * [EN] Returns the non-jittered projection-view matrix of the previous frame.
     *
     * @returns
     * [KO] 이전 프레임의 투영 뷰 행렬
     * [EN] Non-jittered projection-view matrix of the previous frame
     */
    get prevNoneJitterProjectionViewMatrix(): mat4 {
        return this.#prevNoneJitterProjectionViewMatrix;
    }

    /**
     * [KO] 프레임 인덱스를 반환합니다.
     * [EN] Returns the frame index.
     *
     * @returns
     * [KO] 프레임 인덱스
     * [EN] Frame index
     */
    get frameIndex(): number {
        return this.#frameIndex;
    }
    #targetAllocResult: IPostEffectResult = null;

    /**
     * [KO] 지터링 강도를 반환합니다.
     * [EN] Returns the jitter strength.
     *
     * @returns
     * [KO] 지터링 강도 (기본값: 0.5)
     * [EN] Jitter strength (default: 0.5)
     */
    get jitterStrength(): number {
        return this.#jitterStrength;
    }

    /**
     * [KO] 지터링 강도를 설정합니다.
     * [EN] Sets the jitter strength.
     *
     * @param value -
     * [KO] 지터링 강도
     * [EN] Jitter strength to set
     */
    set jitterStrength(value: number) {
        this.#jitterStrength = value;
    }

    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns the video memory usage.
     *
     * @returns
     * [KO] 비디오 메모리 바이트 수
     * [EN] Video memory size in bytes
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] TAA 이펙트를 렌더링합니다 (Zero-Copy 핑퐁 스왑).
     * [EN] Renders the TAA effect (Zero-Copy Ping-Pong swap).
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width -
     * [KO] 렌더링 너비
     * [EN] Rendering width
     * @param height -
     * [KO] 렌더링 높이
     * [EN] Rendering height
     * @param sourceTextureInfo -
     * [KO] 입력으로 사용될 소스 텍스처 정보
     * [EN] Source texture information to be used as input
     * @returns
     * [KO] 렌더링 결과 (텍스처 및 뷰)
     * [EN] Rendering result (texture and view)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        this.#frameIndex++;

        // 유니폼 업데이트
        this.updateUniform('frameIndex', this.#frameIndex);
        this.updateUniform('currJitterOffset', view.jitterOffset);
        this.updateUniform('prevJitterOffset', this.#prevJitterOffset);
        mat4.copy(this.#prevNoneJitterProjectionViewMatrix, view.noneJitterProjectionViewMatrix);
        this.#prevJitterOffset[0] = view.jitterOffset[0];
        this.#prevJitterOffset[1] = view.jitterOffset[1];

        // 🌟 히스토리 텍스처 2장 확보 (Zero-Copy 핑퐁)
        this.#updateHistoryTextures(width, height);

        const readIndex = this.#historyIndex;
        const writeIndex = 1 - this.#historyIndex;

        const historyInfo = this.#historyResults[readIndex];
        const targetOutputResult = this.#historyResults[writeIndex];

        // 🌟 [방법 2] ASinglePassPostEffect 원본을 100% 유지하면서 풀 할당 함수만 일시 가로채기 (Zero-GC Hooking)
        const pool = view.postEffectManager.texturePool;
        const originalAlloc = pool.allocResult;

        this.#targetAllocResult = targetOutputResult;
        pool.allocResult = this.#hookedAllocResult;

        // ASinglePassPostEffect 원본의 super.render() 호출
        const result = super.render(view, width, height, sourceTextureInfo, historyInfo);

        // 원래 풀 함수 및 임시 참조 원복
        pool.allocResult = originalAlloc;
        this.#targetAllocResult = null;

        // 다음 프레임을 위한 히스토리 인덱스 스왑
        this.#historyIndex = writeIndex;

        return result;
    }

    /**
     * [KO] TAA 리소스를 해제합니다.
     * [EN] Clears TAA resources.
     */
    clear() {
        super.clear();
        for (let i = 0; i < 2; i++) {
            if (this.#historyTextures[i]) {
                this.#historyTextures[i].destroy();
                this.#historyTextures[i] = null;
                this.#historyTextureViews[i] = null;
                this.#historyResults[i] = null;
            }
        }
        this.#prevInfo = null;
        this.#historyIndex = 0;
    }

    #hookedAllocResult: (width: number, height: number, format?: GPUTextureFormat) => IPostEffectResult = () => this.#targetAllocResult;

    /**
     * [KO] 핑퐁 스왑용 히스토리 텍스처 2장을 관리합니다.
     * [EN] Manages 2 history textures for ping-pong swapping.
     *
     * @param width -
     * [KO] 텍스처 너비
     * [EN] Texture width
     * @param height -
     * [KO] 텍스처 높이
     * [EN] Texture height
     */
    #updateHistoryTextures(width: number, height: number) {
        if (this.#prevInfo?.width !== width || this.#prevInfo?.height !== height || !this.#historyTextures[0]) {
            if (this.#historyTextures[0]) this.#historyTextures[0].destroy();
            if (this.#historyTextures[1]) this.#historyTextures[1].destroy();

            const {resourceManager} = this.redGPUContext;
            for (let i = 0; i < 2; i++) {
                const texture = resourceManager.createManagedTexture({
                    size: {width, height},
                    format: 'rgba16float',
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
                    label: `TAA_HistoryTexture_${i}_${width}x${height}`
                });
                const textureView = resourceManager.getGPUResourceBitmapTextureView(texture, {
                    dimension: '2d',
                    format: 'rgba16float',
                    label: `TAA_HistoryTextureView_${i}`
                });
                this.#historyTextures[i] = texture;
                this.#historyTextureViews[i] = textureView;
                this.#historyResults[i] = {texture, textureView};
            }

            this.#prevInfo = {width, height};
            this.#historyIndex = 0;
            this.#calcTAAVideoMemory();
        }
    }

    /**
     * [KO] TAA에 사용되는 비디오 메모리 사용량을 계산합니다.
     * [EN] Calculates the video memory usage for TAA.
     */
    #calcTAAVideoMemory() {
        this.#videoMemorySize = this.uniformBuffer ? this.uniformBuffer.size : 0;
        if (this.#historyTextures[0]) {
            this.#videoMemorySize += calculateTextureByteSize(this.#historyTextures[0]) * 2;
        }
    }
}

Object.freeze(TAA);
export default TAA;
