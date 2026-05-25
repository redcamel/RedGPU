import RedGPUContext from "../context/RedGPUContext";
import ResourceManager from "../resources/core/resourceManager/ResourceManager";
import AntialiasingManager from "../antialiasing/AntialiasingManager";
import CommandEncoderManager from "../renderer/commandEncoder/CommandEncoderManager";
import validateRedGPUContext from "../runtimeChecker/validateFunc/validateRedGPUContext";
import BaseObject from "./BaseObject";

/**
 * [KO] GPU 컨텍스트를 사용하는 모든 엔진 객체의 기반 클래스입니다.
 * [EN] Base class for all engine objects using GPU context.
 *
 * [KO] RedGPUContext 및 관련 매니저들(ResourceManager, AntialiasingManager 등)에 대한 공통 접근 경로를 제공합니다.
 * [EN] Provides common access paths to RedGPUContext and related managers (ResourceManager, AntialiasingManager, etc.).
 */
abstract class RedGPUObject extends BaseObject {
    readonly #redGPUContext: RedGPUContext;

    protected constructor(redGPUContext: RedGPUContext) {
        super()
        validateRedGPUContext(redGPUContext);
        this.#redGPUContext = redGPUContext;
    }

    /** [KO] RedGPUContext 인스턴스를 반환합니다. */
    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /** [KO] WebGPU 디바이스 객체를 반환합니다. (단축 경로) */
    get gpuDevice(): GPUDevice {
        return this.#redGPUContext.gpuDevice;
    }

    /** [KO] 리소스 매니저 인스턴스를 반환합니다. (단축 경로) */
    get resourceManager(): ResourceManager {
        return this.#redGPUContext.resourceManager;
    }

    /** [KO] 안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로) */
    get antialiasingManager(): AntialiasingManager {
        return this.#redGPUContext.antialiasingManager;
    }

    /** [KO] 커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로) */
    get commandEncoderManager(): CommandEncoderManager {
        return this.#redGPUContext.commandEncoderManager;
    }
}

Object.freeze(RedGPUObject);
export default RedGPUObject;
