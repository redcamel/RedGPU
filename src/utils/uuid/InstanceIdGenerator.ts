/**
 * [KO] 타입별 고유 인스턴스 ID를 순차적으로 생성하는 유틸리티 클래스입니다.
 * [EN] Utility class that sequentially generates unique instance IDs for each type.
 *
 * [KO] 각 생성자 타입마다 별도의 카운터를 관리하여 0부터 시작하는 고유 ID를 부여합니다.
 * [EN] Manages a separate counter for each constructor type to assign unique IDs starting from 0.
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
     * [KO] 지정한 타입에 대해 다음 고유 인스턴스 ID를 반환합니다.
     * [EN] Returns the next unique instance ID for the specified type.
     *
     * @param type
     * [KO] 고유 ID를 생성할 타입(생성자 함수)
     * [EN] Type (constructor function) to generate a unique ID for
     *
     * @returns
     * [KO] 해당 타입에 대한 고유 인스턴스 ID (0부터 시작)
     * [EN] Unique instance ID for the type (starts from 0)
     */
    static getNextId(type: Function): number {
        let currentId = this.idMaps.get(type) || 0;
        this.idMaps.set(type, currentId + 1);
        return currentId;
    }
}

Object.freeze(InstanceIdGenerator);
export default InstanceIdGenerator