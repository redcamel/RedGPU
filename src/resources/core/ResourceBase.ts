import RedGPUContext from "../../context/RedGPUContext";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import createUUID from "../../utils/uuid/createUUID";
import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";

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
class ResourceBase {
    /**
     * [KO] 고유 식별자(UUID)를 생성합니다.
     * [EN] Generates a Universally Unique Identifier (UUID).
     */
    #uuid: string = createUUID()
    readonly #redGPUContext: RedGPUContext
    readonly #gpuDevice: GPUDevice
    #name: string = ''
    #instanceId: number
    #cacheKey: string
    /**
     * [KO] 더티 상태 리스너 배열입니다.
     * [EN] Array of dirty state listeners.
     */
    #dirtyListeners: any[] = [];
    #resourceManagerKey: string

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
    protected constructor(redGPUContext: RedGPUContext, resourceManagerKey?: string) {
        validateRedGPUContext(redGPUContext)
        this.#resourceManagerKey = resourceManagerKey
        this.#redGPUContext = redGPUContext
        this.#gpuDevice = redGPUContext.gpuDevice
    }

    /**
     * [KO] 캐시 키를 반환합니다.
     * [EN] Returns the cache key.
     */
    get cacheKey(): string {
        return this.#cacheKey;
    }

    /**
     * [KO] 캐시 키를 설정합니다.
     * [EN] Sets the cache key.
     */
    set cacheKey(value: string) {
        this.#cacheKey = value;
    }

    /**
     * [KO] 리소스 매니저 키를 반환합니다.
     * [EN] Returns the resource manager key.
     */
    get resourceManagerKey(): string {
        return this.#resourceManagerKey;
    }

    /**
     * [KO] 인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.
     * [EN] Returns the name of the instance. If no name exists, it is generated using the class name and ID.
     */
    get name(): string {
        if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }

    /**
     * [KO] 인스턴스의 이름을 설정합니다.
     * [EN] Sets the name of the instance.
     */
    set name(value: string) {
        this.#name = value;
    }

    /**
     * [KO] 고유 식별자(UUID)를 반환합니다.
     * [EN] Returns the UUID.
     */
    get uuid(): string {
        return this.#uuid;
    }

    /**
     * [KO] 연관된 GPU 디바이스를 반환합니다.
     * [EN] Returns the associated GPU device.
     */
    get gpuDevice(): GPUDevice {
        return this.#gpuDevice;
    }

    /**
     * [KO] RedGPUContext 인스턴스를 반환합니다.
     * [EN] Returns the RedGPUContext instance.
     */
    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /**
     * [KO] 파이프라인이 더티해질 때 호출될 리스너를 추가합니다.
     * [EN] Adds a listener function to be called when the pipeline becomes dirty.
     * @param listener -
     * [KO] 리스너 함수
     * [EN] Listener function
     */
    __addDirtyPipelineListener(listener: () => void) {
        this.#manageResourceState(true);
        this.#dirtyListeners.push(listener);
    }

    /**
     * [KO] 더티 파이프라인 리스너를 제거합니다.
     * [EN] Removes a dirty pipeline listener.
     * @param listener -
     * [KO] 제거할 리스너 함수
     * [EN] Listener function to be removed
     */
    __removeDirtyPipelineListener(listener: () => void) {
        const index = this.#dirtyListeners.indexOf(listener);
        if (index > -1) {
            this.#dirtyListeners.splice(index, 1);
            this.#manageResourceState(false);
        }
    }

    /**
     * [KO] 등록된 더티 리스너들을 실행합니다.
     * [EN] Fires the registered dirty listeners.
     * @param resetList -
     * [KO] 실행 후 리스너 목록 초기화 여부 (기본값: false)
     * [EN] Whether to reset the listener list after firing (default: false)
     */
    __fireListenerList(resetList: boolean = false) {
        for (const listener of this.#dirtyListeners) listener(this);
        if (resetList) this.#dirtyListeners.length = 0
    }

    /**
     * [KO] 리소스 상태를 관리합니다 (참조 횟수 증감).
     * [EN] Manages the state of a resource (increments/decrements reference count).
     * @param isAddingListener -
     * [KO] 리스너 추가 여부
     * [EN] Whether adding a listener
     */
    #manageResourceState(isAddingListener: boolean) {
        const {resourceManager} = this.#redGPUContext;
        if (this.constructor.name === 'Sampler') {
            return
        }
        if (resourceManager) {
            const targetResourceManagedState = resourceManager[this.#resourceManagerKey]
            if (!targetResourceManagedState) {
                consoleAndThrowError('need managedStateKey', this.constructor.name)
            }
            const targetState = targetResourceManagedState?.table.get(this.cacheKey);
            if (targetState) {
                isAddingListener ? targetState.useNum++ : targetState.useNum--;
            }
        }
    }
}

export default ResourceBase