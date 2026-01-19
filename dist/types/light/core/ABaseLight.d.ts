import ColorRGB from "../../color/ColorRGB";
import ADrawDebuggerLight from "../../display/drawDebugger/light/ADrawDebuggerLight";
/**
 * [KO] 모든 광원 클래스의 기본이 되는 추상 클래스입니다.
 * [EN] Abstract class serving as the base for all light classes.
 *
 * [KO] 색상, 세기(intensity), 디버깅 시각화 기능 등을 포함하며, DirectionalLight, PointLight 등 다양한 조명 클래스의 기반으로 사용됩니다.
 * [EN] Includes color, intensity, and debugging visualization features, serving as a base for various light classes like DirectionalLight and PointLight.
 * @category Light
 */
declare abstract class ABaseLight {
    #private;
    /**
     * [KO] 광원의 디버깅 시각화를 위한 도우미 객체입니다.
     * [EN] Helper object for debugging visualization of the light.
     *
     * [KO] 외부에서 설정되며, 광원의 위치나 방향을 시각적으로 표시할 수 있습니다.
     * [EN] Set externally, it can visually display the position or direction of the light.
     */
    drawDebugger: ADrawDebuggerLight;
    /**
     * [KO] 새로운 ABaseLight 인스턴스를 생성합니다.
     * [EN] Creates a new ABaseLight instance.
     * @param color -
     * [KO] 광원의 색상 (ColorRGB 객체)
     * [EN] Color of the light (ColorRGB object)
     * @param intensity -
     * [KO] 광원의 세기 (기본값: 1)
     * [EN] Intensity of the light (default: 1)
     */
    constructor(color: ColorRGB, intensity?: number);
    /**
     * [KO] 디버깅 시각화 기능의 활성화 여부를 반환합니다.
     * [EN] Returns whether the debugging visualization feature is enabled.
     * @returns
     * [KO] 활성화 여부
     * [EN] Whether enabled
     */
    get enableDebugger(): boolean;
    /**
     * [KO] 디버깅 시각화 기능을 활성화하거나 비활성화합니다.
     * [EN] Enables or disables the debugging visualization feature.
     * @param value -
     * [KO] true면 디버깅 기능 활성화
     * [EN] If true, enables debugging feature
     */
    set enableDebugger(value: boolean);
    /**
     * [KO] 광원의 색상을 반환합니다.
     * [EN] Returns the color of the light.
     * @returns
     * [KO] ColorRGB 객체
     * [EN] ColorRGB object
     */
    get color(): ColorRGB;
    /**
     * [KO] 광원의 색상을 설정합니다.
     * [EN] Sets the color of the light.
     * @param value -
     * [KO] ColorRGB 객체
     * [EN] ColorRGB object
     */
    set color(value: ColorRGB);
    /**
     * [KO] 광원의 세기를 반환합니다.
     * [EN] Returns the intensity of the light.
     * @returns
     * [KO] 세기 값
     * [EN] Intensity value
     */
    get intensity(): number;
    /**
     * [KO] 광원의 세기를 설정합니다.
     * [EN] Sets the intensity of the light.
     * @param value -
     * [KO] 숫자 값 (예: 1.0)
     * [EN] Number value (e.g., 1.0)
     */
    set intensity(value: number);
}
export default ABaseLight;
