import Group3D from "./Group3D";
/**
 * [KO] 2D 공간에서 자식 객체들을 계층적으로 그룹화하고 일괄 변환(위치, 회전, 스케일)을 적용하는 컨테이너 클래스입니다.
 * [EN] Container class that hierarchically groups child objects and applies collective transformations (position, rotation, scale) in 2D space.
 *
 * ### Example
 * ```typescript
 * const group = new RedGPU.Display.Group2D();
 * group.addChild(sprite1);
 * group.addChild(sprite2);
 * scene.addChild(group);
 * ```
 *
 * <iframe src="/RedGPU/examples/2d/group2D/basic/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Group2D basic example](/RedGPU/examples/2d/group2D/basic/)
 * @category Group
 */
declare class Group2D extends Group3D {
    #private;
    /**
     * [KO] `Group2D` 인스턴스를 생성합니다.
     * [EN] Creates a `Group2D` instance.
     *
     * ### Example
     * ```typescript
     * const group = new RedGPU.Display.Group2D('myGroup2D');
     * ```
     *
     * @param name -
     * [KO] 그룹 식별 이름 (선택)
     * [EN] Group identification name (optional)
     */
    constructor(name?: string);
    /**
     * [KO] 그룹의 2D 회전각(단위: Degree)을 가져오거나 설정합니다. 설정 시 내부적으로 Z축 회전(`rotationZ`)에 연동됩니다.
     * [EN] Gets or sets the 2D rotation angle (unit: Degree) of the group. Setting this internally maps to the Z-axis rotation (`rotationZ`).
     *
     * @returns
     * [KO] 2D 회전각 (Degree)
     * [EN] 2D rotation angle (Degree)
     */
    get rotation(): number;
    set rotation(value: number);
    /**
     * [KO] 그룹의 2D 스케일을 설정합니다. `y`를 생략하면 `x`와 동일한 값으로 설정됩니다.
     * [EN] Sets the 2D scale of the group. If `y` is omitted, it is set to the same value as `x`.
     *
     * ### Example
     * ```typescript
     * group.setScale(2, 2);
     * ```
     *
     * @param x -
     * [KO] X축 스케일 배율
     * [EN] Scale factor along the X-axis
     * @param y -
     * [KO] Y축 스케일 배율 (선택, 기본값: `x`)
     * [EN] Scale factor along the Y-axis (optional, default: `x`)
     */
    setScale(x: number, y?: number): void;
    /**
     * [KO] 그룹의 2D 위치를 설정합니다. `y`를 생략하면 `x`와 동일한 값으로 설정됩니다.
     * [EN] Sets the 2D position of the group. If `y` is omitted, it is set to the same value as `x`.
     *
     * ### Example
     * ```typescript
     * group.setPosition(100, 200);
     * ```
     *
     * @param x -
     * [KO] X축 좌표
     * [EN] X-axis coordinate
     * @param y -
     * [KO] Y축 좌표 (선택, 기본값: `x`)
     * [EN] Y-axis coordinate (optional, default: `x`)
     */
    setPosition(x: number, y?: number): void;
    /**
     * [KO] 그룹의 2D 회전각(단위: Degree)을 설정합니다.
     * [EN] Sets the 2D rotation angle (unit: Degree) of the group.
     *
     * ### Example
     * ```typescript
     * group.setRotation(45);
     * ```
     *
     * @param value -
     * [KO] 회전각 (단위: Degree)
     * [EN] Rotation angle (unit: Degree)
     */
    setRotation(value: number): void;
}
export default Group2D;
