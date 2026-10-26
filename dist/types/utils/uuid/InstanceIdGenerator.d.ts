/**
 * [KO] 클래스 타입(생성자)별로 0부터 순차 증가하는 고유 인스턴스 ID를 발급하는 유틸리티입니다.
 * [EN] Utility that issues unique instance IDs, incrementing sequentially from 0 per class type (constructor).
 *
 * ### Example
 * ```typescript
 * const id = RedGPU.Util.InstanceIdGenerator.getNextId(RedGPU.Display.Mesh);
 * ```
 *
 * @category UUID
 */
declare class InstanceIdGenerator {
    private static idMaps;
    /**
     * [KO] 지정한 타입의 다음 ID를 반환하고 내부 카운터를 1 증가시킵니다.
     * [EN] Returns the next ID for the given type and increments its internal counter by 1.
     *
     * ### Example
     * ```typescript
     * const id = RedGPU.Util.InstanceIdGenerator.getNextId(RedGPU.Display.Mesh);
     * ```
     *
     * @param type -
     * [KO] ID를 발급할 대상 클래스 생성자
     * [EN] Target class constructor to issue the ID for
     * @returns
     * [KO] 발급된 인스턴스 ID
     * [EN] Issued instance ID
     */
    static getNextId(type: Function): number;
}
export default InstanceIdGenerator;
