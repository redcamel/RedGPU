/**
 * [KO] 타입별로 고유한 인스턴스 ID를 순차적으로 생성하는 유틸리티 클래스입니다.
 * [EN] Utility class that sequentially generates unique instance IDs for each type.
 *
 * [KO] 각 타입(생성자 함수)마다 별도의 카운터를 관리하며, getNextId(type)을 호출할 때마다 해당 타입에 대한 고유 ID(0부터 시작)를 반환합니다.
 * [EN] Manages a separate counter for each type (constructor function) and returns a unique ID (starting from 0) for that type whenever getNextId(type) is called.
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
     * [KO] 지정한 타입(생성자 함수)에 대해 다음 인스턴스 ID를 반환합니다.
     * [EN] Returns the next instance ID for the specified type (constructor function).
     * @param type
     * [KO] 고유 ID를 생성할 타입(생성자 함수)
     * [EN] Type (constructor function) to generate a unique ID for
     * @returns
     * [KO] 해당 타입에 대한 고유 인스턴스 ID(0부터 시작)
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