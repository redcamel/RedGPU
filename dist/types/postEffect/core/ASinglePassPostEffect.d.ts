import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
export type ASinglePassPostEffectResult = {
    texture: GPUTexture;
    textureView: GPUTextureView;
};
/**
 * 단일 패스 후처리 이펙트(ASinglePassPostEffect) 추상 클래스
 * 한 번의 compute 패스로 동작하는 후처리 이펙트의 기반이 됩니다.
 */
declare abstract class ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get useGBufferNormalTexture(): boolean;
    set useGBufferNormalTexture(value: boolean);
    get useDepthTexture(): boolean;
    set useDepthTexture(value: boolean);
    get videoMemorySize(): number;
    get redGPUContext(): RedGPUContext;
    get storageInfo(): any;
    get uniformBuffer(): UniformBuffer;
    get uniformsInfo(): any;
    get systemUuniformsInfo(): any;
    get outputTextureView(): GPUTextureView;
    get shaderInfo(): any;
    get WORK_SIZE_X(): number;
    set WORK_SIZE_X(value: number);
    get WORK_SIZE_Y(): number;
    set WORK_SIZE_Y(value: number);
    get WORK_SIZE_Z(): number;
    set WORK_SIZE_Z(value: number);
    /**
     * 이펙트 초기화: 셰이더 생성 및 메타데이터 파싱
     */
    init(redGPUContext: RedGPUContext, name: string, computeCodes: {
        msaa: string;
        nonMsaa: string;
    }): void;
    /**
     * 매 프레임 렌더링 호출
     */
    render(view: View3D, width: number, height: number, ...sourceTextureInfo: ASinglePassPostEffectResult[]): ASinglePassPostEffectResult;
    execute(view: View3D, gpuDevice: GPUDevice, width: number, height: number): void;
    update(deltaTime: number): void;
    updateUniform(key: string, value: number | number[] | boolean): void;
    clear(): void;
}
export default ASinglePassPostEffect;
