/**
 * [KO] 리소스 카테고리별 캐시 테이블과 비디오 메모리 사용량을 관리하는 상태 정보 클래스입니다.
 * [EN] Status information class that manages the cache table and video memory usage per resource category.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Resource
 */
declare class ResourceStatusInfo {
    /**
     * [KO] 캐시 키별 리소스 상태를 저장하는 맵 (`Map<string, any>`)
     * [EN] Map storing resource states by cache key (`Map<string, any>`)
     */
    table: Map<string, any>;
    /**
     * [KO] 해당 리소스 카테고리의 총 비디오 메모리 사용량(바이트)
     * [EN] Total video memory usage (in bytes) of the resource category
     */
    videoMemory: number;
    /**
     * [KO] ResourceStatusInfo 인스턴스를 생성합니다.
     * [EN] Creates a ResourceStatusInfo instance.
     */
    constructor();
}
export default ResourceStatusInfo;
