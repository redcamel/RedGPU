import AGroupBase from "./core/AGroupBase";
/**
 * [KO] 2D 공간에서의 그룹(계층) 노드입니다.
 * [EN] Group (hierarchical) node in 2D space.
 *
 * [KO] geometry(버텍스/메시 데이터) 없이 오직 트랜스폼(위치, 회전, 스케일)과 자식 계층만을 관리합니다. 실제 렌더링 데이터는 포함하지 않으며, 씬 내에서 계층적 구조와 변환만을 담당합니다.
 * [EN] Manages only transform (position, rotation, scale) and child hierarchy without geometry (vertex/mesh data). It does not contain actual rendering data and is only responsible for hierarchical structure and transformation within the scene.
 *
 * * ### Example
 * ```typescript
 * const group = new RedGPU.Display.Group2D();
 * group.addChild(sprite1);
 * group.addChild(sprite2);
 * scene.addChild(group);
 * ```
 *
 * <iframe src="/RedGPU/examples/2d/group2D/basic/" ></iframe>
 * @category Group
 */
declare class Group2D extends AGroupBase {
    #private;
    /**
     * [KO] Group2D 인스턴스를 생성합니다.
     * [EN] Creates an instance of Group2D.
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
    /**
     * [KO] 그룹의 회전 값을 반환합니다. (라디안)
     * [EN] Returns the rotation value of the group (radians).
     */
    get rotation(): number;
    /**
     * [KO] 그룹의 회전 값을 설정합니다.
     * [EN] Sets the rotation value of the group.
     * @param value -
     * [KO] 회전 값 (라디안)
     * [EN] Rotation value (radians)
     */
    set rotation(value: number);
    /**
     * [KO] 그룹의 스케일을 설정합니다.
     * [EN] Sets the scale of the group.
     * @param x -
     * [KO] X축 스케일
     * [EN] X-axis scale
     * @param y -
     * [KO] Y축 스케일 (생략 시 x와 동일)
     * [EN] Y-axis scale (if omitted, same as x)
     */
    setScale(x: number, y?: number): void;
    /**
     * [KO] 그룹의 위치를 설정합니다.
     * [EN] Sets the position of the group.
     * @param x -
     * [KO] X 좌표
     * [EN] X coordinate
     * @param y -
     * [KO] Y 좌표 (생략 시 x와 동일)
     * [EN] Y coordinate (if omitted, same as x)
     */
    setPosition(x: number, y?: number): void;
    /**
     * [KO] 그룹의 회전 값을 설정합니다.
     * [EN] Sets the rotation value of the group.
     * @param value -
     * [KO] 회전 값 (라디안)
     * [EN] Rotation value (radians)
     */
    setRotation(value: number): void;
}
export default Group2D;
