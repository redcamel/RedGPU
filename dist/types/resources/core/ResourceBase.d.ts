import RedGPUContext from "../../context/RedGPUContext";
/**
 * [KO] RedGPU의 모든 리소스 클래스가 상속받는 최상위 기본 클래스입니다.
 * [EN] The top-level base class inherited by all resource classes in RedGPU.
 *
 * ::: warning
 * [KO] 이 클래스는 직접 인스턴스를 생성하지 마십시오.
 * [EN] Do not create an instance of this class directly.
 * :::
 *
 * @category Resource
 */
declare class ResourceBase {
    #private;
    /**
     * [KO] ResourceBase 인스턴스를 생성합니다.
     * [EN] Creates a ResourceBase instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param resourceManagerKey -
     * [KO] 관리 상태 키 (선택)
     * [EN] Managed state key (optional)
     */
    protected constructor(redGPUContext: RedGPUContext, resourceManagerKey?: string);
    /**
     * [KO] 캐시 키를 반환합니다.
     * [EN] Returns the cache key.
     */
    get cacheKey(): string;
    /**
     * [KO] 캐시 키를 설정합니다.
     * [EN] Sets the cache key.
     */
    set cacheKey(value: string);
    /**
     * [KO] 리소스 매니저 키를 반환합니다.
     * [EN] Returns the resource manager key.
     */
    get resourceManagerKey(): string;
    /**
     * [KO] 인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.
     * [EN] Returns the name of the instance. If no name exists, it is generated using the class name and ID.
     */
    get name(): string;
    /**
     * [KO] 인스턴스의 이름을 설정합니다.
     * [EN] Sets the name of the instance.
     */
    set name(value: string);
    /**
     * [KO] 고유 식별자(UUID)를 반환합니다.
     * [EN] Returns the UUID.
     */
    get uuid(): string;
    /**
     * [KO] 연관된 GPU 디바이스를 반환합니다.
     * [EN] Returns the associated GPU device.
     */
    get gpuDevice(): GPUDevice;
    /**
     * [KO] RedGPUContext 인스턴스를 반환합니다.
     * [EN] Returns the RedGPUContext instance.
     */
    get redGPUContext(): RedGPUContext;
    /**
     * [KO] 파이프라인이 더티해질 때 호출될 리스너를 추가합니다.
     * [EN] Adds a listener function to be called when the pipeline becomes dirty.
     * @param listener -
     * [KO] 리스너 함수
     * [EN] Listener function
     */
    __addDirtyPipelineListener(listener: () => void): void;
    /**
     * [KO] 더티 파이프라인 리스너를 제거합니다.
     * [EN] Removes a dirty pipeline listener.
     * @param listener -
     * [KO] 제거할 리스너 함수
     * [EN] Listener function to be removed
     */
    __removeDirtyPipelineListener(listener: () => void): void;
    /**
     * [KO] 등록된 더티 리스너들을 실행합니다.
     * [EN] Fires the registered dirty listeners.
     * @param resetList -
     * [KO] 실행 후 리스너 목록 초기화 여부 (기본값: false)
     * [EN] Whether to reset the listener list after firing (default: false)
     */
    __fireListenerList(resetList?: boolean): void;
}
export default ResourceBase;
