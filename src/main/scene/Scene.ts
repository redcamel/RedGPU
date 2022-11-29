import SkyBox from "./skyBox/SkyBox";
import DisplayContainer from "../../object3d/base/DisplayContainer";
import Grid from "./sceneHelper/grid/Grid";
import Axis from "./sceneHelper/asix/Axis";
import LightManager from "../../light/LightManager";
import hexadecimalToRgb from "../../util/color/hexadecimalToRgb";

let UUID: number = 0


class Scene extends DisplayContainer {
    #axis: Axis
    get axis(): Axis {
        return this.#axis;
    }

    set axis(value: Axis) {
        this.#axis = value;
    }

    #skyBox: SkyBox
    get skyBox(): SkyBox {
        return this.#skyBox;
    }

    set skyBox(value: SkyBox) {
        this.#skyBox = value;
    }

    #grid: Grid


    get grid(): Grid {
        return this.#grid;
    }

    set grid(value: Grid) {
        this.#grid = value;
    }


    #label: string

    get label(): string {
        return this.#label;
    }

    /**
     * lightManager
     * @private
     */
    #lightManager: LightManager

    /**
     * lightManager
     */
    get lightManager(): LightManager {
        return this.#lightManager;
    }

    #backgroundColorRGB:number[] = [0, 0, 0]
    get backgroundColorRGB(): number[] {
        return this.#backgroundColorRGB;
    }

    #backgroundColor = 0x000000;

    get backgroundColor(): number {
        return this.#backgroundColor;
    }

    set backgroundColor(value) {
        this.#backgroundColor = value;
        let rgb = hexadecimalToRgb(value);
        this.#backgroundColorRGB[0] = rgb.r;
        this.#backgroundColorRGB[1] = rgb.g;
        this.#backgroundColorRGB[2] = rgb.b;
    }

    #backgroundAlpha: number = 1
    get backgroundAlpha(): number {
        return this.#backgroundAlpha;
    }

    set backgroundAlpha(value: number) {
        this.#backgroundAlpha = value;
    }

    /**
     * @constructor scene
     *

     */
    constructor(label?: string) {
        super()
        this.#label = label || `Scene${UUID++} (Label input is recommended.)`
        this.#lightManager = new LightManager()
    }

}

export default Scene
