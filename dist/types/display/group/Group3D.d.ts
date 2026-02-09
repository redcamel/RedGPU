import AGroupBase from "./core/AGroupBase";
/**
 * [KO] 3D 공간에서의 그룹(계층) 노드입니다.
 * [EN] Group (hierarchical) node in 3D space.
 *
 * [KO] geometry(버텍스/메시 데이터) 없이 오직 트랜스폼(위치, 회전, 스케일)과 자식 계층만을 관리합니다. 실제 렌더링 데이터는 포함하지 않으며, 씬 내에서 계층적 구조와 변환만을 담당합니다.
 * [EN] Manages only transform (position, rotation, scale) and child hierarchy without geometry (vertex/mesh data). It does not contain actual rendering data and is only responsible for hierarchical structure and transformation within the scene.
 *
 * * ### Example
 * ```typescript
 * const group = new RedGPU.Display.Group3D();
 * group.addChild(mesh1);
 * group.addChild(mesh2);
 * scene.addChild(group);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/group3D/basic/" ></iframe>
 * @category Group
 */
declare class Group3D extends AGroupBase {
    #private;
    /**
     * [KO] Group3D 인스턴스를 생성합니다.
     * [EN] Creates an instance of Group3D.
     * @param name -
     * [KO] 그룹 이름(선택)
     * [EN] Group name (optional)
     */
    constructor(name?: string);
    /**
     * [KO] 그룹 이름을 반환합니다.
     * [EN] Returns the group name.
     */
    get name(): string;
    /**
     * [KO] 그룹 이름을 설정합니다.
     * [EN] Sets the group name.
     * @param value -
     * [KO] 설정할 이름
     * [EN] Name to set
     */
    set name(value: string);
}
export default Group3D;
