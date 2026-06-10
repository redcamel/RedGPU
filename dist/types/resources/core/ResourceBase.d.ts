import RedGPUContext from "../../context/RedGPUContext";
import RedGPUObject from "../../base/RedGPUObject";
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
declare class ResourceBase extends RedGPUObject {
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
    /** [KO] 리소스의 리비전(업데이트 횟수)을 반환합니다. [EN] Returns the revision (update count) of the resource. */
    get revision(): number;
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
     * [KO] 연관된 GPU 디바이스를 반환합니다.
     * [EN] Returns the associated GPU device.
     */
    get gpuDevice(): GPUDevice;
    /**
     * [KO] 파이프라인이 더티해질 때 호출될 리스너를 추가합니다.
     * [EN] Adds a listener function to be called when the pipeline becomes dirty.
     * @param listener -
     * [KO] 리스너 함수
     * [EN] Listener function
     */
    __addDirtyPipelineListener(listener: () => void): void;
    /**
     * [KO] 리소스 업데이트 리스너를 제거합니다.
     * [EN] Removes a resource update listener.
     * @param listener -
     * [KO] 제거할 리스너 함수
     * [EN] Listener function to be removed
     */
    __removeDirtyPipelineListener(listener: () => void): void;
    /**
     * [KO] 리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.
     * [EN] Notifies registered listeners that the resource has been updated.
     * @param resetList -
     * [KO] 실행 후 리스너 목록 초기화 여부 (기본값: false)
     * [EN] Whether to reset the listener list after firing (default: false)
     */
    notifyUpdate(resetList?: boolean): void;
}
export default ResourceBase;
