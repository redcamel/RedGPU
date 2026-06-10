import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
import {IPostEffectResult} from "../../postEffect/core/types";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {COMMAND_ENCODER_TYPE} from "../../commandEncoderManager/COMMAND_ENCODER_TYPE";
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
    #historyTexture: GPUTexture
    #historyTextureView: GPUTextureView
    /** [KO] 현재 프레임 누적 인덱스 [EN] Current frame accumulation index */
    #frameIndex: number = 0
    /** [KO] 지터링 강도 [EN] Jitter strength */
    #jitterStrength: number = 0.5;
    #prevJitterOffset: [number, number] = [0, 0]
    #prevNoneJitterProjectionViewMatrix: mat4 = mat4.create();
    #videoMemorySize: number = 0
    #prevInfo: { width: number, height: number }

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

    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns the video memory usage.
     *
     * @returns
     * [KO] 비디오 메모리 바이트 수
     * [EN] Video memory size in bytes
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize
    }

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
     * [KO] TAA 이펙트를 렌더링합니다.
     * [EN] Renders the TAA effect.
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
        const {redGPUContext} = this;
        const {commandEncoderManager} = redGPUContext;

        this.#frameIndex++;

        // 유니폼 업데이트
        this.updateUniform('frameIndex', this.#frameIndex);
        this.updateUniform('currJitterOffset', view.jitterOffset);
        this.updateUniform('prevJitterOffset', this.#prevJitterOffset);
        mat4.copy(this.#prevNoneJitterProjectionViewMatrix, view.noneJitterProjectionViewMatrix)
        this.#prevJitterOffset = [...view.jitterOffset]

        // 히스토리 텍스처 관리
        this.#updateHistoryTexture(width, height);

        // 부모 렌더 호출 (Pool 사용)
        const historyInfo: IPostEffectResult = {
            texture: this.#historyTexture,
            textureView: this.#historyTextureView
        };
        const result = super.render(view, width, height, sourceTextureInfo, historyInfo);

        //TODO - 이거 스왑버퍼로해서 복사비용을 삭제해야겠다
        // 결과를 히스토리에 복사
        commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, encoder => {
            encoder.copyTextureToTexture(
                {texture: result.texture},
                {texture: this.#historyTexture},
                [width, height, 1]
            );
        });

        if (this.#frameIndex <= 20 || this.#frameIndex % 60 === 0) {
            console.log(`TAA Frame ${this.#frameIndex}: HistoryUpdated, JitterStrength=${this.#jitterStrength}`);
        }

        return result;
    }

    /**
     * [KO] TAA 리소스를 해제합니다.
     * [EN] Clears TAA resources.
     */
    clear() {
        super.clear();
        if (this.#historyTexture) {
            this.#historyTexture.destroy();
            this.#historyTexture = null;
            this.#historyTextureView = null;
        }
        this.#prevInfo = null;
    }

    /**
     * [KO] 히스토리 텍스처를 업데이트합니다.
     * [EN] Updates the history texture.
     *
     * @param width -
     * [KO] 텍스처 너비
     * [EN] Texture width
     * @param height -
     * [KO] 텍스처 높이
     * [EN] Texture height
     */
    #updateHistoryTexture(width: number, height: number) {
        if (this.#prevInfo?.width !== width || this.#prevInfo?.height !== height || !this.#historyTexture) {
            if (this.#historyTexture) this.#historyTexture.destroy();

            const {resourceManager} = this.redGPUContext;
            this.#historyTexture = resourceManager.createManagedTexture({
                size: {width, height},
                format: 'rgba16float',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
                label: `TAA_HistoryTexture_${width}x${height}`
            });
            this.#historyTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#historyTexture, {
                dimension: '2d',
                format: 'rgba16float',
                label: `TAA_HistoryTextureView`
            });

            this.#prevInfo = {width, height};
            this.#calcTAAVideoMemory();
        }
    }

    /**
     * [KO] TAA에 사용되는 비디오 메모리 사용량을 계산합니다.
     * [EN] Calculates the video memory usage for TAA.
     */
    #calcTAAVideoMemory() {
        this.#videoMemorySize = this.uniformBuffer ? this.uniformBuffer.size : 0;
        if (this.#historyTexture) {
            this.#videoMemorySize += calculateTextureByteSize(this.#historyTexture);
        }
    }
}

Object.freeze(TAA);
export default TAA;
