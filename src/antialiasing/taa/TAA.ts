import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
import {IPostEffectResult} from "../../postEffect/core/types";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";
import TAACASPass from "./cas/TAACASPass";

/**
 * [KO] TAA(Temporal Anti-Aliasing) 후처리 안티앨리어싱 이펙트 클래스입니다.
 * [EN] TAA (Temporal Anti-Aliasing) post-processing anti-aliasing effect class.
 *
 * [KO] 서브픽셀 지터링(Jittering)이 적용된 투영 행렬과 모션 벡터(Motion Vector), 선형 깊이 검증, 및 YCoCg 색공간 3D Ray-Box 클리핑을 결합하여 이전 프레임들의 샘플을 현재 프레임에 누적함으로써 공간적·시간적 계단 현상과 깜빡임(Shimmering)을 제거합니다. 톤매핑 이후에는 후속 `TAACASPass`(AMD FidelityFX CAS)를 통해 시간적 누적으로 인한 미세 블러를 복원합니다.
 * [EN] Combines subpixel-jittered projection matrices, motion vectors, linear depth rejection, and YCoCg 3D Ray-Box clipping to accumulate samples from previous frames into the current frame, eliminating spatial and temporal aliasing as well as shimmering. After tone mapping, a subsequent `TAACASPass` (AMD FidelityFX CAS) restores fine sharpness lost during temporal accumulation.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * redGPUContext.antialiasingManager.useTAA = true;
 *
 * const taa = view.taa;
 * taa.sharpness = 0.5;
 * taa.jitterStrength = 1.0;
 * ```
 *
 * @category Antialiasing
 */
class TAA extends ASinglePassPostEffect {
    #historyTextures: [GPUTexture, GPUTexture] = [null, null];
    #historyTextureViews: [GPUTextureView, GPUTextureView] = [null, null];
    #historyResults: [IPostEffectResult, IPostEffectResult] = [null, null];
    #historyIndex: number = 0;
    #frameIndex: number = 0;
    #jitterStrength: number = 1.0;
    #casPass: TAACASPass;
    #prevJitterOffset: [number, number] = [0, 0];
    #prevNoneJitterProjectionViewMatrix: mat4 = mat4.create();
    #videoMemorySize: number = 0;
    #prevInfo: { width: number, height: number };

    /**
     * [KO] `TAA` 인스턴스를 생성합니다.
     * [EN] Creates a `TAA` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {x: 8, y: 8, z: 1});
        this.isLdr = false;
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
                ],
                false
            )
        );
        this.#casPass = new TAACASPass(redGPUContext);
        this.jitterStrength = this.#jitterStrength;
    }

    /**
     * [KO] TAA 후속 AMD FidelityFX CAS 선명도 복원 강도를 반환합니다.
     * [EN] Returns the sharpening strength of the subsequent AMD FidelityFX CAS pass.
     *
     * ### Example
     * ```typescript
     * const sharpness = view.taa.sharpness;
     * ```
     *
     * @returns
     * [KO] 샤프닝 강도 (`0.0` ~ `1.0`, 기본값: `0.5`)
     * [EN] Sharpening strength (`0.0` to `1.0`, default: `0.5`)
     */
    get sharpness(): number {
        return this.#casPass.sharpness;
    }

    /**
     * [KO] TAA 후속 AMD FidelityFX CAS 선명도 복원 강도를 설정합니다. `0.0`으로 설정하면 CAS 패스가 생략됩니다.
     * [EN] Sets the sharpening strength of the subsequent AMD FidelityFX CAS pass. Setting to `0.0` skips the CAS pass.
     *
     * ### Example
     * ```typescript
     * view.taa.sharpness = 0.6;
     * ```
     *
     * @param value -
     * [KO] 샤프닝 강도 (`0.0` ~ `1.0`)
     * [EN] Sharpening strength (`0.0` to `1.0`)
     */
    set sharpness(value: number) {
        this.#casPass.sharpness = value;
    }

    /**
     * [KO] TAA 후속 선명도 복원을 담당하는 `TAACASPass` 인스턴스를 반환합니다.
     * [EN] Returns the `TAACASPass` instance responsible for post-TAA sharpness restoration.
     *
     * @returns
     * [KO] `TAACASPass` 인스턴스
     * [EN] `TAACASPass` instance
     */
    get casPass(): TAACASPass {
        return this.#casPass;
    }

    /**
     * [KO] 이전 프레임의 지터링이 제거된 투영-뷰(Projection-View) 행렬을 반환합니다.
     * [EN] Returns the non-jittered projection-view matrix from the previous frame.
     *
     * @returns
     * [KO] 이전 프레임의 비-지터 투영-뷰 행렬 (`mat4`)
     * [EN] Non-jittered projection-view matrix (`mat4`) of the previous frame
     */
    get prevNoneJitterProjectionViewMatrix(): mat4 {
        return this.#prevNoneJitterProjectionViewMatrix;
    }

    /**
     * [KO] 현재 누적된 TAA 프레임 인덱스를 반환합니다.
     * [EN] Returns the currently accumulated TAA frame index.
     *
     * @returns
     * [KO] 누적 프레임 인덱스
     * [EN] Accumulated frame index
     */
    get frameIndex(): number {
        return this.#frameIndex;
    }

    /**
     * [KO] 서브픽셀 카메라 지터링 강도를 반환합니다.
     * [EN] Returns the subpixel camera jitter strength.
     *
     * ### Example
     * ```typescript
     * const jitterStrength = view.taa.jitterStrength;
     * ```
     *
     * @returns
     * [KO] 지터링 강도 (기본값: `1.0`)
     * [EN] Jitter strength (default: `1.0`)
     */
    get jitterStrength(): number {
        return this.#jitterStrength;
    }
    #targetAllocResult: IPostEffectResult = null;

    /**
     * [KO] 서브픽셀 카메라 지터링 강도를 설정합니다.
     * [EN] Sets the subpixel camera jitter strength.
     *
     * ### Example
     * ```typescript
     * view.taa.jitterStrength = 1.0;
     * ```
     *
     * @param value -
     * [KO] 설정할 지터링 강도
     * [EN] Jitter strength to set
     */
    set jitterStrength(value: number) {
        this.#jitterStrength = value;
    }

    /**
     * [KO] TAA 유니폼 버퍼 및 핑퐁 히스토리 텍스처가 점유 중인 총 비디오 메모리 크기(Bytes)를 반환합니다.
     * [EN] Returns the total video memory size in bytes occupied by the TAA uniform buffer and ping-pong history textures.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (Bytes)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] TAA 누적 프레임 인덱스를 `0`으로 초기화하여 이전 프레임 히스토리를 즉시 폐기합니다.
     * [EN] Resets the TAA accumulated frame index to `0`, immediately discarding previous frame history.
     *
     * ### Example
     * ```typescript
     * view.taa.reset();
     * ```
     */
    reset(): void {
        this.#frameIndex = 0;
    }

    /**
     * [KO] TAA 컴퓨트 패스를 실행하고 핑퐁 히스토리 텍스처 결과를 반환합니다.
     * [EN] Executes the TAA compute pass and returns the ping-pong history texture result.
     *
     * @param view -
     * [KO] 렌더링 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance for rendering
     * @param width -
     * [KO] 렌더 타겟 너비 (픽셀)
     * [EN] Render target width in pixels
     * @param height -
     * [KO] 렌더 타겟 높이 (픽셀)
     * [EN] Render target height in pixels
     * @param sourceTextureInfo -
     * [KO] 현재 프레임의 입력 소스 텍스처 정보
     * [EN] Input source texture information of the current frame
     * @returns
     * [KO] TAA가 적용된 출력 텍스처 결과 (`IPostEffectResult`)
     * [EN] Output texture result (`IPostEffectResult`) with TAA applied
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        this.#frameIndex++;

        this.updateUniform('frameIndex', this.#frameIndex);
        this.updateUniform('currJitterOffset', view.jitterOffset);
        this.updateUniform('prevJitterOffset', this.#prevJitterOffset);
        mat4.copy(this.#prevNoneJitterProjectionViewMatrix, view.noneJitterProjectionViewMatrix);
        this.#prevJitterOffset[0] = view.jitterOffset[0];
        this.#prevJitterOffset[1] = view.jitterOffset[1];

        this.#updateHistoryTextures(width, height);

        const readIndex = this.#historyIndex;
        const writeIndex = 1 - this.#historyIndex;

        const historyInfo = this.#historyResults[readIndex];
        const targetOutputResult = this.#historyResults[writeIndex];

        const pool = view.postEffectManager.texturePool;
        const originalAlloc = pool.allocResult;

        this.#targetAllocResult = targetOutputResult;
        pool.allocResult = this.#hookedAllocResult;

        const result = super.render(view, width, height, sourceTextureInfo, historyInfo);

        pool.allocResult = originalAlloc;
        this.#targetAllocResult = null;

        this.#historyIndex = writeIndex;

        return result;
    }

    /**
     * [KO] TAA 히스토리 텍스처 및 후속 `TAACASPass`의 캐시 리소스를 정리합니다.
     * [EN] Clears TAA history textures and cached resources of the subsequent `TAACASPass`.
     */
    clear() {
        super.clear();
        this.#casPass.clear();
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
        this.#frameIndex = 0;
    }

    #hookedAllocResult: (width: number, height: number, format?: GPUTextureFormat) => IPostEffectResult = () => this.#targetAllocResult;

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

    #calcTAAVideoMemory() {
        this.#videoMemorySize = this.uniformBuffer ? this.uniformBuffer.size : 0;
        if (this.#historyTextures[0]) {
            this.#videoMemorySize += calculateTextureByteSize(this.#historyTextures[0]) * 2;
        }
    }
}

Object.freeze(TAA);
export default TAA;

