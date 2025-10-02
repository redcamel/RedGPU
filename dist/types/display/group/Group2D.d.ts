import AGroupBase from "./core/AGroupBase";
/**
 * 2D 공간에서의 그룹(계층) 노드로, 변환(transform)과 자식 객체만을 관리하는 구조체입니다.
 *
 *  geometry(버텍스/메시 데이터) 없이 오직 트랜스폼(위치, 회전, 스케일)과 자식 계층만을 가집니다.
 *
 * 실제 렌더링 데이터는 포함하지 않으며, 씬 내에서 계층적 구조와 변환만을 담당합니다.
 *
 * <iframe src="/RedGPU/examples/2d/group2D/basic/" ></iframe>
 * @category Group
 */
declare class Group2D extends AGroupBase {
    #private;
    /**
     * Group2D 인스턴스를 생성합니다.
     * @param name 그룹 이름(선택)
     */
    constructor(name?: string);
    /**
     * 그룹 이름을 반환합니다.
     */
    get name(): string;
    /**
     * 그룹 이름을 설정합니다.
     */
    set name(value: string);
    /**
     * 그룹의 회전 값을 반환합니다.
     */
    get rotation(): number;
    /**
     * 그룹의 회전 값을 설정합니다.
     * @param value 회전 값(라디안)
     */
    set rotation(value: number);
    /**
     * 그룹의 스케일을 설정합니다.
     * @param x X축 스케일
     * @param y Y축 스케일(생략 시 x와 동일)
     */
    setScale(x: number, y?: number): void;
    /**
     * 그룹의 위치를 설정합니다.
     * @param x X 좌표
     * @param y Y 좌표(생략 시 x와 동일)
     */
    setPosition(x: number, y?: number): void;
    /**
     * 그룹의 회전 값을 설정합니다.
     * @param value 회전 값(라디안)
     */
    setRotation(value: number): void;
}
export default Group2D;
