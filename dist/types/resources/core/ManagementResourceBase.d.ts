import RedGPUContext from "../../context/RedGPUContext";
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
declare class ManagementResourceBase extends ResourceBase {
    #private;
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
    protected constructor(redGPUContext: RedGPUContext, resourceManagerKey: string);
    /**
     * [KO] 리소스의 관리 상태 정보를 반환합니다.
     * [EN] Returns the managed state information of the resource.
     */
    get targetResourceManagedState(): ResourceStatusInfo;
}
export default ManagementResourceBase;
