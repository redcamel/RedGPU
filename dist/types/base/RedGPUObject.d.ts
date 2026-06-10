import RedGPUContext from "../context/RedGPUContext";
import ResourceManager from "../resources/core/resourceManager/ResourceManager";
import AntialiasingManager from "../antialiasing/AntialiasingManager";
import CommandEncoderManager from "../commandEncoderManager/CommandEncoderManager";
import BaseObject from "./BaseObject";
/**
 * [KO] GPU 컨텍스트를 사용하는 모든 엔진 객체의 기반 클래스입니다.
 * [EN] Base class for all engine objects using GPU context.
 *
 * [KO] RedGPUContext 및 관련 매니저들(ResourceManager, AntialiasingManager 등)에 대한 공통 접근 경로를 제공합니다.
 * [EN] Provides common access paths to RedGPUContext and related managers (ResourceManager, AntialiasingManager, etc.).
 */
declare abstract class RedGPUObject extends BaseObject {
    #private;
    /**
     * [KO] RedGPUObject 생성자입니다. (추상 클래스로 직접 인스턴스 생성은 불가합니다)
     * [EN] RedGPUObject constructor. (Abstract class, cannot be instantiated directly)
     *
     * @param redGPUContext -
     * [KO] 사용할 RedGPUContext 인스턴스
     * [EN] RedGPUContext instance to use
     */
    protected constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] RedGPUContext 인스턴스를 반환합니다.
     * [EN] Returns the RedGPUContext instance.
     *
     * @returns
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    get redGPUContext(): RedGPUContext;
    /**
     * [KO] WebGPU 디바이스 객체를 반환합니다. (단축 경로)
     * [EN] Returns the WebGPU device object. (Short-cut path)
     *
     * @returns
     * [KO] GPUDevice 인스턴스
     * [EN] GPUDevice instance
     */
    get gpuDevice(): GPUDevice;
    /**
     * [KO] 리소스 매니저 인스턴스를 반환합니다. (단축 경로)
     * [EN] Returns the ResourceManager instance. (Short-cut path)
     *
     * @returns
     * [KO] ResourceManager 인스턴스
     * [EN] ResourceManager instance
     */
    get resourceManager(): ResourceManager;
    /**
     * [KO] 안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)
     * [EN] Returns the AntialiasingManager instance. (Short-cut path)
     *
     * @returns
     * [KO] AntialiasingManager 인스턴스
     * [EN] AntialiasingManager instance
     */
    get antialiasingManager(): AntialiasingManager;
    /**
     * [KO] 커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)
     * [EN] Returns the CommandEncoderManager instance. (Short-cut path)
     *
     * @returns
     * [KO] CommandEncoderManager 인스턴스
     * [EN] CommandEncoderManager instance
     */
    get commandEncoderManager(): CommandEncoderManager;
}
export default RedGPUObject;
