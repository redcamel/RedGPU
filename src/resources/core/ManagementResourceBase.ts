import RedGPUContext from "../../context/RedGPUContext";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import ResourceBase from "./ResourceBase";
import ResourceStatusInfo from "./resourceManager/resourceState/ResourceStatusInfo";

/**
 * [KO] ResourceManager에 의해 관리되는 리소스의 기본 추상 클래스입니다.
 * [EN] Base abstract class for resources managed by the ResourceManager.
 *
 * ::: warning
 * [KO] 이 클래스는 직접 인스턴스를 생성하지 마십시오.
 * [EN] Do not create an instance of this class directly.
 * :::
 *
 * @category Resource
 */
class ManagementResourceBase extends ResourceBase {
    readonly #targetResourceManagedState: ResourceStatusInfo

    /**
     * [KO] ManagementResourceBase 인스턴스를 생성합니다.
     * [EN] Creates a ManagementResourceBase instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param resourceManagerKey -
     * [KO] 관리 상태 키
     * [EN] Managed state key
     */
    protected constructor(redGPUContext: RedGPUContext, resourceManagerKey: string,) {
        super(redGPUContext, resourceManagerKey)
        if (!resourceManagerKey) {
            consoleAndThrowError('need managedStateKey', this.constructor.name)
        }
        this.#targetResourceManagedState = redGPUContext.resourceManager[resourceManagerKey]
        if (!this.#targetResourceManagedState) {
            consoleAndThrowError(resourceManagerKey, 'is not exist in RedGPUContext.resourceManager', this.constructor.name)
        }
    }

    /**
     * [KO] 리소스의 관리 상태 정보를 반환합니다.
     * [EN] Returns the managed state information of the resource.
     */
    get targetResourceManagedState(): ResourceStatusInfo {
        return this.#targetResourceManagedState;
    }
}

export default ManagementResourceBase