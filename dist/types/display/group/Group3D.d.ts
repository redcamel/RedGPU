import AGroupBase from "./core/AGroupBase";
/**
 * 3D 공간에서의 그룹(계층) 노드로, 변환(transform)과 자식 객체만을 관리하는 구조체입니다.
 *
 * geometry(버텍스/메시 데이터) 없이 오직 트랜스폼(위치, 회전, 스케일)과 자식 계층만을 가집니다.
 *
 * 실제 렌더링 데이터는 포함하지 않으며, 씬 내에서 계층적 구조와 변환만을 담당합니다.
 *
 * <iframe src="/RedGPU/examples/3d/group3D/basic/" ></iframe>
 * @category Group
 */
declare class Group3D extends AGroupBase {
    #private;
    /**
     * Group3D 인스턴스를 생성합니다.
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
}
export default Group3D;
