import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
export type ASinglePassPostEffectResult = {
    texture: GPUTexture;
    textureView: GPUTextureView;
};
/**
 * 단일 패스 후처리 이펙트(ASinglePassPostEffect) 추상 클래스입니다.
 * 한 번의 compute 패스로 동작하는 후처리 이펙트의 기반이 됩니다.
 *
 *
 */
declare abstract class ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get useGBufferNormalTexture(): boolean;
    set useGBufferNormalTexture(value: boolean);
    get videoMemorySize(): number;
    get useDepthTexture(): boolean;
    set useDepthTexture(value: boolean);
    get redGPUContext(): RedGPUContext;
    get storageInfo(): any;
    get shaderInfo(): any;
    get uniformBuffer(): UniformBuffer;
    get uniformsInfo(): any;
    get systemUuniformsInfo(): any;
    get WORK_SIZE_X(): number;
    set WORK_SIZE_X(value: number);
    get WORK_SIZE_Y(): number;
    set WORK_SIZE_Y(value: number);
    get WORK_SIZE_Z(): number;
    set WORK_SIZE_Z(value: number);
    get outputTextureView(): GPUTextureView;
    clear(): void;
    init(redGPUContext: RedGPUContext, name: string, computeCodes: {
        msaa: string;
        nonMsaa: string;
    }, bindGroupLayout?: GPUBindGroupLayout): void;
    execute(view: View3D, gpuDevice: GPUDevice, width: number, height: number): void;
    render(view: View3D, width: number, height: number, ...sourceTextureInfo: ASinglePassPostEffectResult[]): ASinglePassPostEffectResult;
    update(deltaTime: number): void;
    updateUniform(key: string, value: number | number[] | boolean): void;
}
export default ASinglePassPostEffect;
