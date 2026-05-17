import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../postEffect/core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {COMMAND_ENCODER_TYPE} from "../../renderer/commandEncoder/COMMAND_ENCODER_TYPE";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";

/**
 * [KO] TAA(Temporal Anti-Aliasing) 후처리 이펙트입니다.
 * [EN] TAA (Temporal Anti-Aliasing) post-processing effect.
 *
 * [KO] 이전 프레임들의 정보를 누적하여 현재 프레임의 계단 현상을 제거하는 고품질 안티앨리어싱 기법입니다.
 * [EN] A high-quality anti-aliasing technique that removes aliasing in the current frame by accumulating information from previous frames.
 *
 * ::: warning
 * [KO] 이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
 * :::
 *
 * @category PostEffect
 */
class TAA extends ASinglePassPostEffect {
    #historyTexture: GPUTexture
    #historyTextureView: GPUTextureView
    #frameIndex: number = 0
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
        this.useDepthTexture = true;
        this.useMotionVectorTexture = true;
        this.usePrevDepthTexture = true;

        this.init(
            redGPUContext,
            'POST_EFFECT_TAA',
            createBasicPostEffectCode(
                this,
                computeCode,
                uniformStructCode,
                ['sourceTexture', 'historyTexture'],
                true // useSampledTexture
            )
        );
        this.jitterStrength = this.#jitterStrength;
    }

    /** [KO] 이전 프레임의 지터링 없는 프로젝션 카메라 행렬을 반환합니다. [EN] Returns the non-jittered projection camera matrix of the previous frame. */
    get prevNoneJitterProjectionViewMatrix(): mat4 {
        return this.#prevNoneJitterProjectionViewMatrix;
    }

    /** [KO] 프레임 인덱스를 반환합니다. [EN] Returns the frame index. */
    get frameIndex(): number {
        return this.#frameIndex;
    }

    /** [KO] 비디오 메모리 사용량을 반환합니다. [EN] Returns the video memory usage. */
    get videoMemorySize(): number {
        return this.#videoMemorySize
    }

    /** [KO] 지터링 강도를 반환합니다. [EN] Returns the jitter strength. */
    get jitterStrength(): number {
        return this.#jitterStrength;
    }

    /** [KO] 지터링 강도를 설정합니다. [EN] Sets the jitter strength. */
    set jitterStrength(value: number) {
        this.#jitterStrength = value;
    }

    /**
     * [KO] TAA 이펙트를 렌더링합니다.
     * [EN] Renders the TAA effect.
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
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
        const historyInfo: ASinglePassPostEffectResult = {
            texture: this.#historyTexture,
            textureView: this.#historyTextureView
        };
        const result = super.render(view, width, height, sourceTextureInfo, historyInfo);

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

    /** [KO] TAA 리소스를 해제합니다. [EN] Clears TAA resources. */
    clear() {
        super.clear();
        if (this.#historyTexture) {
            this.#historyTexture.destroy();
            this.#historyTexture = null;
            this.#historyTextureView = null;
        }
        this.#prevInfo = null;
    }

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

    #calcTAAVideoMemory() {
        this.#videoMemorySize = this.uniformBuffer ? this.uniformBuffer.size : 0;
        if (this.#historyTexture) {
            this.#videoMemorySize += calculateTextureByteSize(this.#historyTexture);
        }
    }
}

Object.freeze(TAA);
export default TAA;
