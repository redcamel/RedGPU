import View3D from "../../display/view/View3D";
/**
 * [KO] TAA(Temporal Anti-Aliasing)를 위해 Halton 시퀀스 기반의 서브픽셀 지터(Jitter) 오프셋(`[-0.5, 0.5]`)을 계산하여 `View3D`에 적용합니다.
 * [EN] Calculates sub-pixel jitter offsets (`[-0.5, 0.5]`) based on the Halton sequence for TAA (Temporal Anti-Aliasing) and applies them to `View3D`.
 *
 * @param view -
 * [KO] 지터 오프셋을 적용할 대상 `View3D` 인스턴스
 * [EN] Target `View3D` instance to apply jitter offsets
 * @category Renderer
 */
declare const updateJitter: (view: View3D) => void;
export default updateJitter;
