import RedGPUContext from "../../context/RedGPUContext";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import RedGPUObject from "../../base/RedGPUObject";

/**
 * [KO] RedGPU의 모든 리소스 클래스가 상속받는 최상위 기본 클래스입니다.
 * [EN] The top-level base class inherited by all resource classes in RedGPU.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Resource
 */
class ResourceBase extends RedGPUObject {

    readonly #gpuDevice: GPUDevice
    #cacheKey: string
    #dirtyListeners: any[] = [];
    #resourceManagerKey: string
    #revision: number = 0

    /**
     * [KO] ResourceBase 인스턴스를 생성합니다.
     * [EN] Creates a ResourceBase instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param resourceManagerKey -
     * [KO] 관리 상태 키 (선택)
     * [EN] Managed state key (optional)
     */
    protected constructor(redGPUContext: RedGPUContext, resourceManagerKey?: string) {
        super(redGPUContext)
        this.#resourceManagerKey = resourceManagerKey
        this.#gpuDevice = redGPUContext.gpuDevice
    }

    /**
     * [KO] 리소스의 리비전(업데이트 횟수)을 반환합니다.
     * [EN] Returns the revision (update count) of the resource.
     *
     * @returns
     * [KO] 리소스 리비전 번호
     * [EN] Resource revision number
     */
    get revision(): number {
        return this.#revision;
    }

    /**
     * [KO] 캐시 키를 반환하거나 설정합니다.
     * [EN] Gets or sets the cache key.
     *
     * @returns
     * [KO] 캐시 키 문자열
     * [EN] Cache key string
     */
    get cacheKey(): string {
        return this.#cacheKey;
    }

    set cacheKey(value: string) {
        this.#cacheKey = value;
    }

    /**
     * [KO] 리소스 매니저 키를 반환합니다.
     * [EN] Returns the resource manager key.
     *
     * @returns
     * [KO] 리소스 매니저 키 문자열
     * [EN] Resource manager key string
     */
    get resourceManagerKey(): string {
        return this.#resourceManagerKey;
    }

    /**
     * [KO] 연관된 GPUDevice를 반환합니다.
     * [EN] Returns the associated GPUDevice.
     *
     * @returns
     * [KO] GPUDevice 인스턴스
     * [EN] GPUDevice instance
     */
    get gpuDevice(): GPUDevice {
        return this.#gpuDevice;
    }


    /**
     * [KO] 리소스 변경 시 호출될 파이프라인 더티 리스너를 추가합니다.
     * [EN] Adds a pipeline dirty listener to be called when the resource changes.
     *
     * @param listener -
     * [KO] 등록할 리스너 함수
     * [EN] Listener function to register
     */
    __addDirtyPipelineListener(listener: () => void) {
        this.#manageResourceState(true);
        this.#dirtyListeners.push(listener);
    }

    /**
     * [KO] 등록된 파이프라인 더티 리스너를 제거합니다.
     * [EN] Removes a registered pipeline dirty listener.
     *
     * @param listener -
     * [KO] 제거할 리스너 함수
     * [EN] Listener function to remove
     */
    __removeDirtyPipelineListener(listener: () => void) {
        const index = this.#dirtyListeners.indexOf(listener);
        if (index > -1) {
            this.#dirtyListeners.splice(index, 1);
            this.#manageResourceState(false);
        }
    }

    /**
     * [KO] 리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.
     * [EN] Notifies registered listeners that the resource has been updated.
     *
     * @param resetList -
     * [KO] 알림 실행 후 리스너 목록 초기화 여부 (기본값: false)
     * [EN] Whether to reset the listener list after notification (default: false)
     */
    notifyUpdate(resetList: boolean = false) {
        this.#revision++;
        for (const listener of this.#dirtyListeners) listener(this);
        if (resetList) this.#dirtyListeners.length = 0
    }

    #manageResourceState(isAddingListener: boolean) {
        if (!this.#resourceManagerKey) {
            return;
        }
        const {resourceManager} = this;
        if (resourceManager) {
            const targetResourceManagedState = resourceManager[this.#resourceManagerKey];
            if (!targetResourceManagedState) {
                consoleAndThrowError('need managedStateKey', this.#resourceManagerKey);
            }
            const targetState = targetResourceManagedState?.table.get(this.cacheKey);
            if (targetState) {
                isAddingListener ? targetState.useNum++ : targetState.useNum--;
            }
        }
    }
}

export default ResourceBase