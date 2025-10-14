/**
 * 타입별로 고유한 인스턴스 ID를 순차적으로 생성하는 유틸리티 클래스입니다.
 *
 * 각 타입(생성자 함수)마다 별도의 카운터를 관리하며,
 *
 * getNextId(type)을 호출할 때마다 해당 타입에 대한 고유 ID(0부터 시작)를 반환합니다.
 *
 * @category UUID
 */
class InstanceIdGenerator {
    /** 타입별 현재 ID 맵 */
    static idMaps = new Map();
    /**
     * 지정한 타입(생성자 함수)에 대해 다음 인스턴스 ID를 반환합니다.
     * @param type 고유 ID를 생성할 타입(생성자 함수)
     * @returns 해당 타입에 대한 고유 인스턴스 ID(0부터 시작)
     */
    static getNextId(type) {
        let currentId = this.idMaps.get(type) || 0;
        this.idMaps.set(type, currentId + 1);
        return currentId;
    }
}
Object.freeze(InstanceIdGenerator);
export default InstanceIdGenerator;
