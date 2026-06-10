/**
 * [KO] 타입(Constructor)별로 고유한 인스턴스 ID를 생성하는 유틸리티입니다.
 * [EN] Utility for generating unique instance IDs per type (Constructor).
 *
 * [KO] 각 클래스 타입마다 독립적인 카운터를 유지하여 0부터 순차적인 ID를 부여합니다.
 * [EN] Maintains an independent counter for each class type and assigns IDs sequentially starting from 0.
 *
 * * ### Example
 * ```typescript
 * const id = RedGPU.Util.InstanceIdGenerator.getNextId(RedMesh);
 * ```
 *
 * @category UUID
 */
declare class InstanceIdGenerator {
    private static idMaps;
    /**
     * [KO] 해당 타입의 다음 고유 ID를 반환합니다.
     * [EN] Returns the next unique ID for the given type.
     *
     * @param type - [KO] 대상 타입 [EN] Target type
     * @returns [KO] 고유 ID [EN] Unique ID
     */
    static getNextId(type: Function): number;
}
export default InstanceIdGenerator;
