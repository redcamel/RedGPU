import { mat4 } from "gl-matrix";
import Object3DContainer from "../mesh/core/Object3DContainer";
import RenderViewStateData from "../view/core/RenderViewStateData";
interface Group3D {
}
/**
 * [KO] 3D 공간에서 자식 객체들을 계층적으로 그룹화하고 일괄 변환(위치, 회전, 스케일, 피벗)을 적용하는 컨테이너 클래스입니다.
 * [EN] Container class that hierarchically groups child objects and applies collective transformations (position, rotation, scale, pivot) in 3D space.
 *
 * ### Example
 * ```typescript
 * const group = new RedGPU.Display.Group3D();
 * group.addChild(mesh1);
 * group.addChild(mesh2);
 * group.setPosition(0, 5, 0);
 * scene.addChild(group);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/group3D/basic/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Group3D basic example](/RedGPU/examples/3d/group3D/basic/)
 * @category Group
 */
declare class Group3D extends Object3DContainer {
    #private;
    /**
     * [KO] 그룹의 월드 변환 행렬(`mat4`)
     * [EN] World transformation matrix (`mat4`) of the group
     */
    modelMatrix: mat4;
    /**
     * [KO] 그룹의 로컬 변환 행렬(`mat4`)
     * [EN] Local transformation matrix (`mat4`) of the group
     */
    localMatrix: mat4;
    /**
     * [KO] `Group3D` 인스턴스를 생성합니다.
     * [EN] Creates a `Group3D` instance.
     *
     * ### Example
     * ```typescript
     * const group = new RedGPU.Display.Group3D('myGroup3D');
     * ```
     *
     * @param name -
     * [KO] 그룹 식별 이름 (선택)
     * [EN] Group identification name (optional)
     */
    constructor(name?: string);
    /**
     * [KO] 변환 행렬의 갱신이 필요한 상태(Dirty)인지 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether the transformation matrix requires an update (dirty).
     *
     * @returns
     * [KO] 변환 행렬 갱신 필요 여부
     * [EN] Whether the transformation matrix requires an update
     */
    get dirtyTransform(): boolean;
    set dirtyTransform(value: boolean);
    /**
     * [KO] 이 그룹 객체가 속한 부모 컨테이너(`Object3DContainer`)를 가져오거나 설정합니다.
     * [EN] Gets or sets the parent container (`Object3DContainer`) to which this group object belongs.
     *
     * @returns
     * [KO] 부모 컨테이너 객체
     * [EN] Parent container object
     */
    get parent(): Object3DContainer;
    set parent(value: Object3DContainer);
    /**
     * [KO] X축 피벗(중심점) 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis pivot (center point) coordinate.
     *
     * @returns
     * [KO] X축 피벗 좌표
     * [EN] X-axis pivot coordinate
     */
    get pivotX(): number;
    set pivotX(value: number);
    /**
     * [KO] Y축 피벗(중심점) 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis pivot (center point) coordinate.
     *
     * @returns
     * [KO] Y축 피벗 좌표
     * [EN] Y-axis pivot coordinate
     */
    get pivotY(): number;
    set pivotY(value: number);
    /**
     * [KO] Z축 피벗(중심점) 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis pivot (center point) coordinate.
     *
     * @returns
     * [KO] Z축 피벗 좌표
     * [EN] Z-axis pivot coordinate
     */
    get pivotZ(): number;
    set pivotZ(value: number);
    /**
     * [KO] 그룹의 X축 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis position coordinate of the group.
     *
     * @returns
     * [KO] X축 위치 좌표
     * [EN] X-axis position coordinate
     */
    get x(): number;
    set x(value: number);
    /**
     * [KO] 그룹의 Y축 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis position coordinate of the group.
     *
     * @returns
     * [KO] Y축 위치 좌표
     * [EN] Y-axis position coordinate
     */
    get y(): number;
    set y(value: number);
    /**
     * [KO] 그룹의 Z축 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis position coordinate of the group.
     *
     * @returns
     * [KO] Z축 위치 좌표
     * [EN] Z-axis position coordinate
     */
    get z(): number;
    set z(value: number);
    /**
     * [KO] 그룹의 위치 좌표 배열(`[x, y, z]`)을 반환합니다.
     * [EN] Returns the position coordinate array (`[x, y, z]`) of the group.
     *
     * @returns
     * [KO] `[x, y, z]` 위치 좌표 배열
     * [EN] `[x, y, z]` position coordinate array
     */
    get position(): [number, number, number];
    /**
     * [KO] X축 스케일 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the scale factor along the X-axis.
     *
     * @returns
     * [KO] X축 스케일 배율
     * [EN] X-axis scale factor
     */
    get scaleX(): number;
    set scaleX(value: number);
    /**
     * [KO] Y축 스케일 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the scale factor along the Y-axis.
     *
     * @returns
     * [KO] Y축 스케일 배율
     * [EN] Y-axis scale factor
     */
    get scaleY(): number;
    set scaleY(value: number);
    /**
     * [KO] Z축 스케일 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the scale factor along the Z-axis.
     *
     * @returns
     * [KO] Z축 스케일 배율
     * [EN] Z-axis scale factor
     */
    get scaleZ(): number;
    set scaleZ(value: number);
    /**
     * [KO] 그룹의 스케일 배율 배열(`[scaleX, scaleY, scaleZ]`)을 반환합니다.
     * [EN] Returns the scale factor array (`[scaleX, scaleY, scaleZ]`) of the group.
     *
     * @returns
     * [KO] `[scaleX, scaleY, scaleZ]` 스케일 배열
     * [EN] `[scaleX, scaleY, scaleZ]` scale array
     */
    get scale(): number[];
    /**
     * [KO] X축 회전각(단위: Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (unit: Degree) around the X-axis.
     *
     * @returns
     * [KO] X축 회전각 (Degree)
     * [EN] X-axis rotation angle (Degree)
     */
    get rotationX(): number;
    set rotationX(value: number);
    /**
     * [KO] Y축 회전각(단위: Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (unit: Degree) around the Y-axis.
     *
     * @returns
     * [KO] Y축 회전각 (Degree)
     * [EN] Y-axis rotation angle (Degree)
     */
    get rotationY(): number;
    set rotationY(value: number);
    /**
     * [KO] Z축 회전각(단위: Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (unit: Degree) around the Z-axis.
     *
     * @returns
     * [KO] Z축 회전각 (Degree)
     * [EN] Z-axis rotation angle (Degree)
     */
    get rotationZ(): number;
    set rotationZ(value: number);
    /**
     * [KO] 그룹의 회전각 배열(`[rotationX, rotationY, rotationZ]`, 단위: Degree)을 반환합니다.
     * [EN] Returns the rotation angle array (`[rotationX, rotationY, rotationZ]`, unit: Degree) of the group.
     *
     * @returns
     * [KO] `[rotationX, rotationY, rotationZ]` 회전각 배열 (Degree)
     * [EN] `[rotationX, rotationY, rotationZ]` rotation angle array (Degree)
     */
    get rotation(): number[];
    /**
     * [KO] 그룹의 X, Y, Z축 스케일을 설정합니다. `y`, `z`를 생략하면 `x`와 동일한 값으로 설정됩니다.
     * [EN] Sets the scale of the group along the X, Y, and Z axes. If `y` and `z` are omitted, they are set to the same value as `x`.
     *
     * ### Example
     * ```typescript
     * group.setScale(2, 2, 2);
     * ```
     *
     * @param x -
     * [KO] X축 스케일 배율
     * [EN] Scale factor along the X-axis
     * @param y -
     * [KO] Y축 스케일 배율 (선택, 기본값: `x`)
     * [EN] Scale factor along the Y-axis (optional, default: `x`)
     * @param z -
     * [KO] Z축 스케일 배율 (선택, 기본값: `x`)
     * [EN] Scale factor along the Z-axis (optional, default: `x`)
     */
    setScale(x: number, y?: number, z?: number): void;
    /**
     * [KO] 그룹의 X, Y, Z축 위치를 설정합니다. `y`, `z`를 생략하면 `x`와 동일한 값으로 설정됩니다.
     * [EN] Sets the position of the group along the X, Y, and Z axes. If `y` and `z` are omitted, they are set to the same value as `x`.
     *
     * ### Example
     * ```typescript
     * group.setPosition(0, 10, 0);
     * ```
     *
     * @param x -
     * [KO] X축 좌표
     * [EN] X-axis coordinate
     * @param y -
     * [KO] Y축 좌표 (선택, 기본값: `x`)
     * [EN] Y-axis coordinate (optional, default: `x`)
     * @param z -
     * [KO] Z축 좌표 (선택, 기본값: `x`)
     * [EN] Z-axis coordinate (optional, default: `x`)
     */
    setPosition(x: number, y?: number, z?: number): void;
    /**
     * [KO] 그룹의 X, Y, Z축 회전각(단위: Degree)을 설정합니다. `rotationY`, `rotationZ`를 생략하면 `rotationX`와 동일한 값으로 설정됩니다.
     * [EN] Sets the rotation angle (unit: Degree) of the group around the X, Y, and Z axes. If `rotationY` and `rotationZ` are omitted, they are set to the same value as `rotationX`.
     *
     * ### Example
     * ```typescript
     * group.setRotation(0, 45, 0);
     * ```
     *
     * @param rotationX -
     * [KO] X축 회전각 (단위: Degree)
     * [EN] Rotation angle around the X-axis (unit: Degree)
     * @param rotationY -
     * [KO] Y축 회전각 (단위: Degree, 선택, 기본값: `rotationX`)
     * [EN] Rotation angle around the Y-axis (unit: Degree, optional, default: `rotationX`)
     * @param rotationZ -
     * [KO] Z축 회전각 (단위: Degree, 선택, 기본값: `rotationX`)
     * [EN] Rotation angle around the Z-axis (unit: Degree, optional, default: `rotationX`)
     */
    setRotation(rotationX: number, rotationY?: number, rotationZ?: number): void;
    /**
     * [KO] 그룹의 변환 행렬을 갱신하고 하위 자식 객체들을 순회하며 렌더링합니다.
     * [EN] Updates the group's transformation matrix and traverses child objects to render them.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    render(renderViewStateData: RenderViewStateData): void;
}
export default Group3D;
