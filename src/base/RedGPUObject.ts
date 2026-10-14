import RedGPUContext from "../context/RedGPUContext";
import ResourceManager from "../resources/core/resourceManager/ResourceManager";
import AntialiasingManager from "../antialiasing/AntialiasingManager";
import CommandEncoderManager from "../commandEncoderManager/CommandEncoderManager";
import validateRedGPUContext from "../runtimeChecker/validateFunc/validateRedGPUContext";
import BaseObject from "./BaseObject";

/**
 * [KO] `RedGPUContext`를 기반으로 동작하는 모든 엔진 객체의 기반 추상 클래스입니다.
 * [EN] Abstract base class for all engine objects that operate based on `RedGPUContext`.
 *
 * [KO] 생성 시점에 `RedGPUContext` 인스턴스의 유효성을 검증하며, `gpuDevice`, `resourceManager`, `antialiasingManager`, `commandEncoderManager` 등 컨텍스트 하위 시스템에 대한 공통 접근자(Getter)를 제공합니다.
 * [EN] Validates the `RedGPUContext` instance upon creation and provides common getters for context subsystems such as `gpuDevice`, `resourceManager`, `antialiasingManager`, and `commandEncoderManager`.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
abstract class RedGPUObject extends BaseObject {
    #redGPUContext: RedGPUContext;

    /**
     * [KO] `RedGPUObject` 인스턴스를 초기화하고 전달된 `RedGPUContext`의 유효성을 검증합니다.
     * [EN] Initializes the `RedGPUObject` instance and validates the provided `RedGPUContext`.
     *
     * @param redGPUContext -
     * [KO] 바인딩할 `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance to bind
     */
    constructor(redGPUContext: RedGPUContext) {
        super()
        validateRedGPUContext(redGPUContext);
        this.#redGPUContext = redGPUContext;
    }

    /**
     * [KO] 현재 객체에 바인딩된 `RedGPUContext` 인스턴스를 반환합니다.
     * [EN] Returns the `RedGPUContext` instance bound to the current object.
     *
     * @returns
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /**
     * [KO] `RedGPUContext`에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.
     * [EN] Returns the logical WebGPU device (`GPUDevice`) assigned to `RedGPUContext`.
     *
     * @returns
     * [KO] `GPUDevice` 인스턴스
     * [EN] `GPUDevice` instance
     */
    get gpuDevice(): GPUDevice {
        return this.#redGPUContext.gpuDevice;
    }

    /**
     * [KO] 전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.
     * [EN] Returns the `ResourceManager` instance that manages global GPU resources.
     *
     * @returns
     * [KO] `ResourceManager` 인스턴스
     * [EN] `ResourceManager` instance
     */
    get resourceManager(): ResourceManager {
        return this.#redGPUContext.resourceManager;
    }

    /**
     * [KO] 안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.
     * [EN] Returns the `AntialiasingManager` instance that manages anti-aliasing settings.
     *
     * @returns
     * [KO] `AntialiasingManager` 인스턴스
     * [EN] `AntialiasingManager` instance
     */
    get antialiasingManager(): AntialiasingManager {
        return this.#redGPUContext.antialiasingManager;
    }

    /**
     * [KO] WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.
     * [EN] Returns the `CommandEncoderManager` instance that manages WebGPU command encoding.
     *
     * @returns
     * [KO] `CommandEncoderManager` 인스턴스
     * [EN] `CommandEncoderManager` instance
     */
    get commandEncoderManager(): CommandEncoderManager {
        return this.#redGPUContext.commandEncoderManager;
    }
}

Object.freeze(RedGPUObject);
export default RedGPUObject;
