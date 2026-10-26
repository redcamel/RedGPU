import RedGPUContext from "../../context/RedGPUContext";
import ResourceBase from "./ResourceBase";
import ResourceStatusInfo from "./resourceManager/resourceState/ResourceStatusInfo";
/**
 * [KO] `ResourceManager`에 의해 관리되는 리소스의 기본 클래스입니다.
 * [EN] Base class for resources managed by `ResourceManager`.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Resource
 */
declare class ManagementResourceBase extends ResourceBase {
    #private;
    /**
     * [KO] ManagementResourceBase 인스턴스를 생성합니다.
     * [EN] Creates a ManagementResourceBase instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param resourceManagerKey -
     * [KO] 리소스 매니저 내 관리 상태 키
     * [EN] Managed state key in ResourceManager
     */
    protected constructor(redGPUContext: RedGPUContext, resourceManagerKey: string);
    /**
     * [KO] 리소스의 관리 상태 정보를 반환합니다.
     * [EN] Returns the managed state information of the resource.
     *
     * @returns
     * [KO] 리소스 관리 상태 정보 객체
     * [EN] Resource managed status info object
     */
    get targetResourceManagedState(): ResourceStatusInfo;
}
export default ManagementResourceBase;
