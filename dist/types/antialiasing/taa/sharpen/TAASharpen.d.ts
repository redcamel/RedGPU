import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../postEffect/core/ASinglePassPostEffect";
interface TAASharpen {
    /**
     * [KO] TAA 샤프닝 강도 (0 ~ 1). 값이 클수록 이미지가 더 선명해지고 경계선이 뚜렷해집니다.
     * [EN] TAA sharpening intensity (0 - 1). Higher values make the image sharper and edge boundaries more distinct.
     */
    sharpness: number;
}
/**
 * [KO] TAA 전용 샤프닝(Sharpening) 후처리 이펙트입니다.
 * [EN] TAA-specific Sharpening post-processing effect.
 *
 * [KO] TAA 누적 과정에서 발생할 수 있는 이미지의 미세한 흐림(Blur) 현상을 복구하여 선명도를 되찾아줍니다. 엣지 보존형 샤프닝 알고리즘을 사용하여 후광(Halo) 현상을 최소화합니다.
 * [EN] Restores fine blur that may occur during the TAA accumulation process to regain sharpness. It uses an edge-preserving sharpening algorithm to minimize halo artifacts.
 *
 * [KO] 이 효과는 톤매핑 후인 LDR 공간에서 동작하여 색상 경계를 더욱 뚜렷하게 보정합니다.
 * [EN] This effect operates in LDR space after tone mapping to more clearly correct color boundaries.
 *
 * ::: warning
 * [KO] 이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
 * :::
 *
 * @category PostEffect
 */
declare class TAASharpen extends ASinglePassPostEffect {
    /**
     * [KO] TAASharpen 인스턴스를 생성합니다.
     * [EN] Creates a TAASharpen instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
}
export default TAASharpen;
