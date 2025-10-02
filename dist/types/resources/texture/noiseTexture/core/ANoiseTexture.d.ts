import RedGPUContext from "../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../core/ManagementResourceBase";
export interface NoiseDefine {
    mainLogic: string;
    uniformStruct: string;
    uniformDefaults: {};
    helperFunctions?: string;
}
/**
 * @experimental
 */
declare abstract class ANoiseTexture extends ManagementResourceBase {
    #private;
    mipLevelCount: any;
    useMipmap: any;
    src: any;
    constructor(redGPUContext: RedGPUContext, width: number, height: number, define: NoiseDefine);
    get videoMemorySize(): number;
    get resourceManagerKey(): string;
    get animationSpeed(): number;
    set animationSpeed(value: number);
    get animationX(): number;
    set animationX(value: number);
    get animationY(): number;
    set animationY(value: number);
    get uniformInfo(): any;
    get gpuTexture(): GPUTexture;
    get time(): number;
    set time(value: number);
    updateUniform(name: string, value: any): void;
    updateUniforms(uniforms: Record<string, any>): void;
    render(time: number): void;
    destroy(): void;
}
export default ANoiseTexture;
