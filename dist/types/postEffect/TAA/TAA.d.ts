import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import { ASinglePassPostEffectResult } from "../core/ASinglePassPostEffect";
declare class TAA {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get frameIndex(): number;
    get videoMemorySize(): number;
    get currentFrameTextureView(): GPUTextureView;
    get temporalBlendFactor(): number;
    set temporalBlendFactor(value: number);
    get jitterStrength(): number;
    set jitterStrength(value: number);
    get varianceClipping(): boolean;
    set varianceClipping(value: boolean);
    get useMotionVectors(): boolean;
    set useMotionVectors(value: boolean);
    get motionBlurReduction(): number;
    set motionBlurReduction(value: number);
    get disocclusionThreshold(): number;
    set disocclusionThreshold(value: number);
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
    clear(): void;
    updateUniform(key: string, value: number | number[] | boolean): void;
}
export default TAA;
