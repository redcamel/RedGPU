import RedGPUContext from "../context/RedGPUContext";
import ResourceManager from "../resources/core/resourceManager/ResourceManager";
import AntialiasingManager from "../antialiasing/AntialiasingManager";
import CommandEncoderManager from "../commandEncoderManager/CommandEncoderManager";
import BaseObject from "./BaseObject";
/**
 * [KO] `RedGPUContext`를 기반으로 동작하는 모든 엔진 객체의 추상 베이스 클래스로, 디바이스 및 주요 매니저에 대한 공통 접근자를 제공합니다.
 * [EN] Abstract base class for all engine objects operating on `RedGPUContext`, providing common getters for the GPU device and core managers.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
declare abstract class RedGPUObject extends BaseObject {
    #private;
    /**
     * [KO] 새로운 RedGPUObject 인스턴스를 초기화하고 `RedGPUContext`의 유효성을 검증합니다.
     * [EN] Initializes a new RedGPUObject instance and validates the provided `RedGPUContext`.
     *
     * @param redGPUContext -
     * [KO] 바인딩할 `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance to bind
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 바인딩된 `RedGPUContext` 인스턴스를 반환합니다.
     * [EN] Returns the bound `RedGPUContext` instance.
     *
     * @returns
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    get redGPUContext(): RedGPUContext;
    /**
     * [KO] 컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.
     * [EN] Returns the logical WebGPU device (`GPUDevice`) assigned to the context.
     *
     * @returns
     * [KO] `GPUDevice` 인스턴스
     * [EN] `GPUDevice` instance
     */
    get gpuDevice(): GPUDevice;
    /**
     * [KO] 전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.
     * [EN] Returns the `ResourceManager` instance managing global GPU resources.
     *
     * @returns
     * [KO] `ResourceManager` 인스턴스
     * [EN] `ResourceManager` instance
     */
    get resourceManager(): ResourceManager;
    /**
     * [KO] 안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.
     * [EN] Returns the `AntialiasingManager` instance managing anti-aliasing settings.
     *
     * @returns
     * [KO] `AntialiasingManager` 인스턴스
     * [EN] `AntialiasingManager` instance
     */
    get antialiasingManager(): AntialiasingManager;
    /**
     * [KO] WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.
     * [EN] Returns the `CommandEncoderManager` instance managing WebGPU command encoding.
     *
     * @returns
     * [KO] `CommandEncoderManager` 인스턴스
     * [EN] `CommandEncoderManager` instance
     */
    get commandEncoderManager(): CommandEncoderManager;
}
export default RedGPUObject;
