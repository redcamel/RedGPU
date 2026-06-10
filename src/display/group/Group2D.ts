import Group3D from "./Group3D";

/**
 * [KO] 2D 공간 내에서 자식 객체들을 계층적으로 구성하고 그룹 제어하기 위한 컨테이너 클래스입니다.
 * [EN] Container class for hierarchically organizing and group-controlling child objects in 2D space.
 *
 * [KO] 자체적인 geometry나 material 없이 오직 트랜스폼(위치, 회전, 스케일) 정보와 자식 계층만을 관리합니다. 씬 내에서 논리적인 그룹을 지정하고 자식 노드들에게 2D 변환을 일괄 적용할 때 사용됩니다.
 * [EN] Manages only transform (position, rotation, scale) details and child hierarchy without its own geometry or material. Used to designate logical groups in a scene and apply 2D transformations to child nodes collectively.
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
class Group2D extends Group3D {
    /**
     * [KO] 그룹의 2D 회전 값 (라디안 단위)
     * [EN] Rotation value of the group (in radians)
     */
    #rotation: number = 0;

    /**
     * [KO] Group2D 인스턴스를 생성합니다.
     * [EN] Creates an instance of Group2D.
     * @param name -
     * [KO] 그룹의 식별 이름 (선택)
     * [EN] Identification name of the group (optional)
     */
    constructor(name?: string) {
        super();
        if (name) this.name = name;
    }

    /**
     * [KO] 그룹의 회전 값(라디안)을 반환하거나 설정합니다. 설정 시 내부적으로 Z축 회전에 연동됩니다.
     * [EN] Returns or sets the rotation value of the group in radians. Setting this internally maps to the Z-axis rotation.
     */
    // @ts-ignore
    get rotation(): number {
        return this.#rotation;
    }

    // @ts-ignore
    set rotation(value: number) {
        this.#rotation = value;
        super.rotationZ = value;
    }

    /**
     * [KO] 그룹의 2D 스케일을 일괄적으로 설정합니다. Y값을 생략하면 X값과 동일하게 통일되어 적용됩니다.
     * [EN] Sets the 2D scale of the group. If Y is omitted, it defaults to the value of X (uniform scaling).
     * @param x -
     * [KO] X축 스케일 배율
     * [EN] Scale factor along the X-axis
     * @param y -
     * [KO] Y축 스케일 배율 (선택, 기본값: x)
     * [EN] Scale factor along the Y-axis (optional, default: x)
     */
    setScale(x: number, y?: number) {
        y = y ?? x;
        // @ts-ignore
        super.setScale(x, y, 1);
    }

    /**
     * [KO] 그룹의 2D 위치(X, Y 좌표)를 설정합니다. Y값을 생략하면 X값과 동일하게 대입됩니다.
     * [EN] Sets the 2D position (X and Y coordinates) of the group. If Y is omitted, it defaults to the value of X.
     * @param x -
     * [KO] X축 좌표값
     * [EN] X coordinate of the position
     * @param y -
     * [KO] Y축 좌표값 (선택, 기본값: x)
     * [EN] Y coordinate of the position (optional, default: x)
     */
    setPosition(x: number, y?: number) {
        y = y ?? x;
        // @ts-ignore
        super.setPosition(x, y, 0);
    }

    /**
     * [KO] 그룹의 2D 회전 값을 라디안(Radian) 단위로 설정합니다.
     * [EN] Sets the 2D rotation of the group in radians.
     * @param value -
     * [KO] 회전각 (라디안 단위)
     * [EN] Rotation angle in radians
     */
    setRotation(value: number) {
        this.rotation = value;
    }
}

/**
 * 이 객체가 2D Mesh 타입의 그룹임을 나타내는 플래그입니다.\
 * geometry/vertex 데이터 없이 transform과 자식만을 가지는 구조임을 구분하기 위해 사용됩니다.
 */
Object.defineProperty(Group2D.prototype, 'is2DMeshType', {
    value: true,
    writable: false
});
Object.freeze(Group2D);
export default Group2D;
