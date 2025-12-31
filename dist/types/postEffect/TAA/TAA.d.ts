import { mat4 } from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import { ASinglePassPostEffectResult } from "../core/ASinglePassPostEffect";
declare class TAA {
    #private;
    get prevNoneJitterProjectionCameraMatrix(): mat4;
    constructor(redGPUContext: RedGPUContext);
    get frameIndex(): number;
    get videoMemorySize(): number;
    get jitterStrength(): number;
    set jitterStrength(value: number);
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
    clear(): void;
    updateUniform(key: string, value: number | number[] | boolean): void;
}
export default TAA;
