import { mat4 } from "gl-matrix";
import Object3DContainer from "../mesh/core/Object3DContainer";
import RenderViewStateData from "../view/core/RenderViewStateData";
interface Group3D {
}
/**
 * [KO] 3D 공간 상에서 객체들을 구조적으로 그룹화하기 위한 컨테이너 클래스입니다.
 * [EN] Container class for structurally grouping objects in 3D space.
 *
 * [KO] 자체적인 geometry나 material을 갖지 않고, 여러 개의 자식 3D 객체(Mesh, Sprite3D 등)들을 자식으로 포함하여 이들에게 일괄적인 트랜스폼(위치, 회전, 스케일, 피벗)을 적용하는 씬 그래프 노드의 역할을 수행합니다.
 * [EN] Does not have its own geometry or material, but acts as a scene graph node containing multiple child 3D objects (Mesh, Sprite3D, etc.) to apply collective transformations (position, rotation, scale, pivot) to them.
 *
 * * ### Example
 * ```typescript
 * const group = new RedGPU.Display.Group3D();
 * group.addChild(mesh1);
 * group.addChild(mesh2);
 * group.setPosition(0, 5, 0);
 * scene.addChild(group);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/group3D/basic/" ></iframe>
 * @category Group
 */
declare class Group3D extends Object3DContainer {
    #private;
    /**
     * [KO] 그룹의 최종 전역 모델 변환 행렬
     * [EN] Final global model transformation matrix of the group
     */
    modelMatrix: mat4;
    /**
     * [KO] 그룹의 로컬 변환 행렬
     * [EN] Local transformation matrix of the group
     */
    localMatrix: mat4;
    /**
     * [KO] Group3D 인스턴스를 생성합니다.
     * [EN] Creates an instance of Group3D.
     * @param name -
     * [KO] 그룹의 식별 이름 (선택)
     * [EN] Identification name of the group (optional)
     */
    constructor(name?: string);
    /**
     * [KO] 변환 행렬의 갱신이 필요한 상태(Dirty)인지 여부를 설정하거나 가져옵니다.
     * [EN] Sets or gets whether the transformation matrix is in a state requiring update (dirty).
     */
    get dirtyTransform(): boolean;
    set dirtyTransform(value: boolean);
    /**
     * [KO] 이 그룹 객체가 포함된 부모 컨테이너(Object3DContainer)를 설정하거나 가져옵니다.
     * [EN] Sets or gets the parent container (Object3DContainer) containing this group object.
     */
    get parent(): Object3DContainer;
    set parent(value: Object3DContainer);
    /**
     * [KO] X축 피벗(중심점) 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis pivot (center point) coordinate.
     */
    get pivotX(): number;
    set pivotX(value: number);
    /**
     * [KO] Y축 피벗(중심점) 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis pivot (center point) coordinate.
     */
    get pivotY(): number;
    set pivotY(value: number);
    /**
     * [KO] Z축 피벗(중심점) 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis pivot (center point) coordinate.
     */
    get pivotZ(): number;
    set pivotZ(value: number);
    /**
     * [KO] 그룹의 X축 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis position coordinate of the group.
     */
    get x(): number;
    set x(value: number);
    /**
     * [KO] 그룹의 Y축 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis position coordinate of the group.
     */
    get y(): number;
    set y(value: number);
    /**
     * [KO] 그룹의 Z축 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis position coordinate of the group.
     */
    get z(): number;
    set z(value: number);
    /**
     * [KO] 그룹의 X, Y, Z 위치 좌표 배열 [x, y, z]을 가져옵니다.
     * [EN] Gets the position coordinate array [x, y, z] of the group.
     */
    get position(): [number, number, number];
    /**
     * [KO] X축 스케일 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the scale factor along the X-axis.
     */
    get scaleX(): number;
    set scaleX(value: number);
    /**
     * [KO] Y축 스케일 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the scale factor along the Y-axis.
     */
    get scaleY(): number;
    set scaleY(value: number);
    /**
     * [KO] Z축 스케일 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the scale factor along the Z-axis.
     */
    get scaleZ(): number;
    set scaleZ(value: number);
    /**
     * [KO] 그룹의 X, Y, Z 스케일 배율 배열 [scaleX, scaleY, scaleZ]을 가져옵니다.
     * [EN] Gets the scale factor array [scaleX, scaleY, scaleZ] of the group.
     */
    get scale(): number[];
    /**
     * [KO] X축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the X-axis.
     */
    get rotationX(): number;
    set rotationX(value: number);
    /**
     * [KO] Y축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the Y-axis.
     */
    get rotationY(): number;
    set rotationY(value: number);
    /**
     * [KO] Z축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the Z-axis.
     */
    get rotationZ(): number;
    set rotationZ(value: number);
    /**
     * [KO] 그룹의 회전각 [rotationX, rotationY, rotationZ] 배열(Degree)을 가져옵니다.
     * [EN] Gets the rotation angle array [rotationX, rotationY, rotationZ] of the group in degrees.
     */
    get rotation(): number[];
    /**
     * [KO] 그룹의 X, Y, Z축 스케일을 설정합니다. Y와 Z를 입력하지 않은 경우, X값과 동일하게 통일되어 적용됩니다.
     * [EN] Sets the scale factor along the X, Y, and Z axes. If Y and Z are omitted, they default to the value of X (globalStruct scaling).
     * @param x -
     * [KO] X축 스케일 배율
     * [EN] Scale factor along the X-axis
     * @param y -
     * [KO] Y축 스케일 배율 (선택, 기본값: x)
     * [EN] Scale factor along the Y-axis (optional, default: x)
     * @param z -
     * [KO] Z축 스케일 배율 (선택, 기본값: x)
     * [EN] Scale factor along the Z-axis (optional, default: x)
     */
    setScale(x: number, y?: number, z?: number): void;
    /**
     * [KO] 그룹의 X, Y, Z축 위치를 설정합니다. Y와 Z를 입력하지 않은 경우, X값과 동일하게 설정됩니다.
     * [EN] Sets the position of the group along the X, Y, and Z axes. If Y and Z are omitted, they default to the value of X.
     * @param x -
     * [KO] X축 위치 좌표
     * [EN] X coordinate of the position
     * @param y -
     * [KO] Y축 위치 좌표 (선택, 기본값: x)
     * [EN] Y coordinate of the position (optional, default: x)
     * @param z -
     * [KO] Z축 위치 좌표 (선택, 기본값: x)
     * [EN] Z coordinate of the position (optional, default: x)
     */
    setPosition(x: number, y?: number, z?: number): void;
    /**
     * [KO] 그룹의 X, Y, Z축 회전각(Degree)을 설정합니다. Y와 Z를 입력하지 않은 경우, X값과 동일하게 설정됩니다.
     * [EN] Sets the rotation of the group around the X, Y, and Z axes in degrees. If Y and Z are omitted, they default to the value of X.
     * @param rotationX -
     * [KO] X축 회전각 (Degree)
     * [EN] Rotation angle around the X-axis (in degrees)
     * @param rotationY -
     * [KO] Y축 회전각 (Degree, 선택, 기본값: rotationX)
     * [EN] Rotation angle around the Y-axis (in degrees, optional, default: rotationX)
     * @param rotationZ -
     * [KO] Z축 회전각 (Degree, 선택, 기본값: rotationX)
     * [EN] Rotation angle around the Z-axis (in degrees, optional, default: rotationX)
     */
    setRotation(rotationX: number, rotationY?: number, rotationZ?: number): void;
    /**
     * [KO] 이 그룹 노드 및 하위 자식 노드들의 트랜스폼 행렬 갱신을 실행하고 렌더링에 필요한 처리를 갱신합니다.
     * [EN] Executes transform matrix updates for this group node and its child nodes, updating processes required for rendering.
     * @param renderViewStateData -
     * [KO] 렌더링 상태 뷰 데이터
     * [EN] Rendering state view data
     */
    render(renderViewStateData: RenderViewStateData): void;
}
export default Group3D;
