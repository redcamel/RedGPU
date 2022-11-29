import SkyBox from "./skyBox/SkyBox";
import DisplayContainer from "../../object3d/base/DisplayContainer";
import Grid from "./sceneHelper/grid/Grid";
import Axis from "./sceneHelper/asix/Axis";
import LightManager from "../../light/LightManager";
import hexadecimalToRgb from "../../util/color/hexadecimalToRgb";

let UUID: number = 0

/**
 * @description
 * - 장면을 구상하는 Scene 객체입니다.
 * - 메쉬와 같은 각종 오브젝트를 설정하고 배치하는 공간입니다.
 */
class Scene extends DisplayContainer {
    /**
     * Scene의 axis 값
     * @private
     */
    #axis: Axis
    /**
     * Scene에 설정된 axis 값을 반환 합니다.
     */
    get axis(): Axis {
        return this.#axis;
    }

    /**
     * Scene에 Axis 객체를 설정합니다.
     * @param value
     */
    set axis(value: Axis) {
        this.#axis = value;
    }

    /**
     * Scene의 skyBox 값
     * @private
     */
    #skyBox: SkyBox
    /**
     * Scene에 설정된 skybox 값을 반환 합니다.
     */
    get skyBox(): SkyBox {
        return this.#skyBox;
    }

    /**
     * Scene에 SkyBox 객체를 설정합니다.
     * @param value
     */
    set skyBox(value: SkyBox) {
        this.#skyBox = value;
    }

    /**
     * Scene의 grid 값
     * @private
     */
    #grid: Grid
    /**
     * Scene에 설정된 grid 값을 반환 합니다.
     */
    get grid(): Grid {
        return this.#grid;
    }

    /**
     * Scene에 Grid 객체를 설정합니다.
     * @param value
     */
    set grid(value: Grid) {
        this.#grid = value;
    }


    /**
     * Scene의 label 값
     * @private
     */
    #label: string

    /**
     * Scene의 label을 반환 합니다.
     */
    get label(): string {
        return this.#label;
    }

    /**
     * Scene에 label을 설정합니다.
     * @param value
     */
    set label(value: string) {
        this.#label = value;
    }

    /**
     * lightManager
     * Scene에 사용되는 Light 객체를 관리하는 매니저 객체
     * @private
     */
    #lightManager: LightManager

    /**
     * lightManager 반환
     */
    get lightManager(): LightManager {
        return this.#lightManager;
    }

    #backgroundColorRGB: number[] = [0, 0, 0]
    /**
     * backgroundColor 설정시 세팅되는 RGB값 반환
     * GPU 렌더링시 사용됨
     */
    get backgroundColorRGB(): number[] {
        return this.#backgroundColorRGB;
    }

    /**
     * Scene의 배경 색상
     * @private
     */
    #backgroundColor = 0x000000;

    /**
     * Scene의 배경 색상을 반환
     */
    get backgroundColor(): number {
        return this.#backgroundColor;
    }

    /**
     * Scene의  배경 색상을 값을 설정 합니다.
     * 렌더링시 Scene의 배경 색상이 됩니다.
     * 값을 입력하고 조건을 통과하면 backgroundColorRGB를 자동으로 생성합니다.
     * ex) 0xffffff
     * @param value
     */
    set backgroundColor(value) {
        this.#backgroundColor = value;
        let rgb = hexadecimalToRgb(value);
        this.#backgroundColorRGB[0] = rgb.r;
        this.#backgroundColorRGB[1] = rgb.g;
        this.#backgroundColorRGB[2] = rgb.b;
    }

    /**
     * Scene의 배경 색상 알파 값
     * @private
     */
    #backgroundAlpha: number = 1
    /**
     * Scene의 배경 색상 알파값을 반환 합니다.
     * 렌더링시 Scene의 배경색상의 알파값으로 사용됩니다
     * ```ex) backgroundColor가 0x000000 이고 backgroundAlpha 값이 0.5일 경우 rgba(0,0,0,0.5)로 배경색상이 결정됩니다.```
     */
    get backgroundAlpha(): number {
        return this.#backgroundAlpha;
    }

    /**
     * Scene의 배경 색상 알파 값을 설정합니다.
     * @param value
     */

    set backgroundAlpha(value: number) {
        this.#backgroundAlpha = value;
    }


    /**
     * @constructor 새로운 Scene 오브젝트를 생성합니다.
     * @param label
     */
    constructor(label?: string) {
        super()
        this.#label = label || `Scene${UUID++}`
        this.#lightManager = new LightManager()
    }

}

export default Scene
