import ColorMaterial from "../../../material/colorMaterial/ColorMaterial.js";
import RedGPUContext from "../../../context/RedGPUContext.js";

/**
 * [KO] LandscapeMaterial (지형 전용 와이어프레임/디버그 재질)
 * [EN] LandscapeMaterial (Terrain Wireframe / Debug Material)
 */
export class LandscapeMaterial extends ColorMaterial {
    constructor(redGPUContext: RedGPUContext, color: string = '#38bdf8') {
        super(redGPUContext, color);
    }
}
