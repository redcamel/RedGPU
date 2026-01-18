/**
 * [KO] 타입별 고유 인스턴스 ID를 생성하는 유틸리티 클래스입니다.
 * [EN] Utility class for generating unique instance IDs per type.
 *
 * [KO] 각 생성자 타입마다 별도의 카운터를 관리하여 0부터 ID를 부여합니다.
 * [EN] Manages separate counters for each constructor to assign IDs from 0.
 *
 * * ### Example
 * ```typescript
 * const id = InstanceIdGenerator.getNextId(RedMesh);
 * ```
 *
 * @category UUID
 */
class InstanceIdGenerator {
    /**
     * [KO] 타입별 현재 ID 맵
     * [EN] Current ID map per type
     */
    private static idMaps: Map<Function, number> = new Map();

    /**
     * [KO] 다음 고유 인스턴스 ID를 반환합니다.
     * [EN] Returns the next unique instance ID.
     *
     * @param type -
     * [KO] ID를 생성할 타입
     * [EN] Type to generate ID for
     * @returns
     * [KO] 고유 인스턴스 ID
     * [EN] Unique instance ID
     */
    static getNextId(type: Function): number {
        let currentId = this.idMaps.get(type) || 0;
        this.idMaps.set(type, currentId + 1);
        return currentId;
    }
}

Object.freeze(InstanceIdGenerator);
export default InstanceIdGenerator