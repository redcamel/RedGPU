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
 * [KO] 이전 프레임의 화면 정보와 픽셀 이동 경로(모션 벡터)를 활용해 고품질 안티앨리어싱을 수행하는 TAA(Temporal Anti-Aliasing) 클래스입니다.
 * [EN] TAA (Temporal Anti-Aliasing) class that delivers high-quality anti-aliasing by combining previous frame history with pixel motion vectors.
 *
 * [KO] 물체 외곽선의 계단 현상은 물론, 빛 반사(하이라이트)가 깜빡이거나 얇은 선이 끊어져 보이는 현상까지 자연스럽게 잡아주며, 내장된 샤프닝(CAS) 처리로 원본의 선명함을 유지합니다.
 * [EN] Smooths out not only jagged object edges, but also flickering specular highlights and broken thin lines, while preserving image sharpness through built-in Contrast Adaptive Sharpening (CAS).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] TAA 활성화 및 뷰별 TAA 샤프닝 강도 설정
 * // [EN] Enable TAA and configure per-view TAA sharpening strength
 * redGPUContext.antialiasingManager.useTAA = true;
 * view.taa.sharpness = 0.5;
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
    #casPass: TAACASPass;
    #prevNoneJitterProjectionViewMatrix: mat4 = mat4.create();
    #videoMemorySize: number = 0;
    #prevWidth: number = 0;
    #prevHeight: number = 0;
    #targetAllocResult: IPostEffectResult = null;

    /**
     * [KO] TAA 후속 CAS(Contrast Adaptive Sharpening) 패스의 선명도 강도를 반환하거나 설정합니다. 허용 범위는 `0.0` ~ `1.0`이며 기본값은 `0.5`입니다.
     * [EN] Gets or sets the sharpening strength of the post-TAA CAS (Contrast Adaptive Sharpening) pass. Valid range is `0.0` to `1.0`, and the default value is `0.5`.
     *
     * ### Example
     * ```typescript
     * // [KO] TAA 샤프닝 강도 조절
     * // [EN] Adjust TAA sharpening strength
     * view.taa.sharpness = 0.6;
     * ```
     *
     * @returns
     * [KO] CAS 선명도 강도 (`0.0` ~ `1.0`)
     * [EN] CAS sharpening strength (`0.0` to `1.0`)
     */
    get sharpness(): number {
        return this.#casPass.sharpness;
    }

    /**
     * [KO] `TAA` 인스턴스 및 내부 `TAACASPass`를 초기화합니다.
     * [EN] Initializes the `TAA` instance and its internal `TAACASPass`.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1});
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
    }

    set sharpness(value: number) {
        this.#casPass.sharpness = value;
    }

    /**
     * [KO] 현재 프레임의 소스 텍스처와 이전 프레임 히스토리를 결합하여 TAA 패스를 렌더링합니다.
     * [EN] Renders the TAA pass by combining the current frame's source texture with the previous frame's history.
     *
     * @param view -
     * [KO] 렌더링 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance for rendering
     * @param width -
     * [KO] 렌더 타겟 너비 (픽셀 단위)
     * [EN] Render target width in pixels
     * @param height -
     * [KO] 렌더 타겟 높이 (픽셀 단위)
     * [EN] Render target height in pixels
     * @param sourceTextureInfo -
     * [KO] 입력 소스 텍스처 및 뷰 정보
     * [EN] Input source texture and view information
     * @returns
     * [KO] TAA가 적용된 출력 텍스처 결과(`IPostEffectResult`)
     * [EN] Output texture result (`IPostEffectResult`) with TAA applied
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        this.#frameIndex++;

        this.updateUniform('frameIndex', this.#frameIndex);
        this.updateUniform('currJitterOffset', view.jitterOffset);
        mat4.copy(this.#prevNoneJitterProjectionViewMatrix, view.noneJitterProjectionViewMatrix);

        this.#updateHistoryTextures(width, height);

        const readIndex = this.#historyIndex;
        const writeIndex = 1 - this.#historyIndex;

        const historyInfo = this.#historyResults[readIndex];
        const targetOutputResult = this.#historyResults[writeIndex];

        const pool = view.postEffectManager.texturePool;
        const originalAlloc = pool.allocResult;

        this.#targetAllocResult = targetOutputResult;
        pool.allocResult = this.#hookedAllocResult;

        let result: IPostEffectResult;
        try {
            result = super.render(view, width, height, sourceTextureInfo, historyInfo);
        } finally {
            pool.allocResult = originalAlloc;
            this.#targetAllocResult = null;
        }

        this.#historyIndex = writeIndex;

        return result;
    }

    /**
     * [KO] TAA의 시간적 블렌딩 블러를 보완하는 내장 `TAACASPass` 인스턴스를 반환합니다.
     * [EN] Returns the built-in `TAACASPass` instance that compensates for TAA temporal blending blur.
     *
     * @returns
     * [KO] 내장 `TAACASPass` 인스턴스
     * [EN] Built-in `TAACASPass` instance
     */
    get casPass(): TAACASPass {
        return this.#casPass;
    }

    /**
     * [KO] 이전 프레임의 지터가 제거된 투영-뷰 행렬(`mat4`)을 반환합니다.
     * [EN] Returns the unjittered projection-view matrix (`mat4`) from the previous frame.
     *
     * @returns
     * [KO] 이전 프레임의 투영-뷰 행렬(`mat4`)
     * [EN] Previous frame's projection-view matrix (`mat4`)
     */
    get prevNoneJitterProjectionViewMatrix(): mat4 {
        return this.#prevNoneJitterProjectionViewMatrix;
    }

    /**
     * [KO] 현재까지 누적된 TAA 렌더링 프레임 인덱스를 반환합니다.
     * [EN] Returns the accumulated TAA rendering frame index.
     *
     * @returns
     * [KO] 누적 프레임 인덱스
     * [EN] Accumulated frame index
     */
    get frameIndex(): number {
        return this.#frameIndex;
    }

    /**
     * [KO] TAA 히스토리 텍스처, 유니폼 버퍼 및 CAS 패스가 점유 중인 총 비디오 메모리 크기(Byte)를 반환합니다.
     * [EN] Returns the total video memory size (in bytes) occupied by the TAA history textures, uniform buffer, and CAS pass.
     *
     * @returns
     * [KO] 점유 중인 총 비디오 메모리 크기 (Byte)
     * [EN] Total occupied video memory size in bytes
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] 누적된 프레임 인덱스를 `0`으로 초기화하여 다음 프레임에서 이전 히스토리 블렌딩 없이 새로 수렴하도록 설정합니다.
     * [EN] Resets the accumulated frame index to `0` so that the next frame starts fresh convergence without blending previous history.
     *
     * ### Example
     * ```typescript
     * // [KO] TAA 누적 히스토리 초기화
     * // [EN] Reset accumulated TAA history
     * view.taa.reset();
     * ```
     */
    reset(): void {
        this.#frameIndex = 0;
    }

    /**
     * [KO] 할당된 핑퐁 히스토리 텍스처와 CAS 패스의 캐시 리소스를 모두 정리하고 초기 상태로 되돌립니다.
     * [EN] Clears all allocated ping-pong history textures and CAS pass cache resources, restoring the initial state.
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
        this.#prevWidth = 0;
        this.#prevHeight = 0;
        this.#historyIndex = 0;
        this.#frameIndex = 0;
    }

    #hookedAllocResult: (width: number, height: number, format?: GPUTextureFormat) => IPostEffectResult = () => this.#targetAllocResult;

    /**
     * [KO] TAA 인스턴스와 내부 CAS 패스 및 모든 GPU 리소스를 영구 파기합니다.
     * [EN] Permanently destroys the TAA instance, internal CAS pass, and all associated GPU resources.
     */
    destroy(): void {
        if (this.#casPass) {
            this.#casPass.destroy();
        }
        super.destroy();
    }

    #updateHistoryTextures(width: number, height: number) {
        if (this.#prevWidth !== width || this.#prevHeight !== height || !this.#historyTextures[0]) {
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

            this.#prevWidth = width;
            this.#prevHeight = height;
            this.#historyIndex = 0;
            this.#calcTAAVideoMemory();
        }
    }

    #calcTAAVideoMemory() {
        this.#videoMemorySize = (this.uniformBuffer ? this.uniformBuffer.size : 0) + (this.#casPass ? this.#casPass.videoMemorySize : 0);
        if (this.#historyTextures[0]) {
            this.#videoMemorySize += calculateTextureByteSize(this.#historyTextures[0]) * 2;
        }
    }
}

Object.freeze(TAA);
export default TAA;
