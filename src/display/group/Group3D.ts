import {mat4} from "gl-matrix";
import Object3DContainer from "../mesh/core/Object3DContainer";
import RenderViewStateData from "../view/core/RenderViewStateData";
import updateObject3DMatrix from "../../math/updateObject3DMatrix";

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
class Group3D extends Object3DContainer {
    /**
     * [KO] 그룹의 최종 전역 모델 변환 행렬
     * [EN] Final global model transformation matrix of the group
     */
    modelMatrix = mat4.create()
    /**
     * [KO] 그룹의 로컬 변환 행렬
     * [EN] Local transformation matrix of the group
     */
    localMatrix = mat4.create()

    #parent: Object3DContainer
    #x: number = 0
    #z: number = 0
    #y: number = 0
    #positionArray: [number, number, number] = [0, 0, 0]

    #pivotX: number = 0
    #pivotY: number = 0
    #pivotZ: number = 0

    #scaleX: number = 1
    #scaleY: number = 1
    #scaleZ: number = 1
    #scaleArray: number[] = [1, 1, 1]

    #rotationX: number = 0
    #rotationY: number = 0
    #rotationZ: number = 0
    #rotationArray: number[] = [0, 0, 0]

    #dirtyTransform: boolean = true

    /**
     * [KO] Group3D 인스턴스를 생성합니다.
     * [EN] Creates an instance of Group3D.
     * @param name -
     * [KO] 그룹의 식별 이름 (선택)
     * [EN] Identification name of the group (optional)
     */
    constructor(name?: string) {
        super()
        if (name) this.name = name
    }

    /**
     * [KO] 변환 행렬의 갱신이 필요한 상태(Dirty)인지 여부를 설정하거나 가져옵니다.
     * [EN] Sets or gets whether the transformation matrix is in a state requiring update (dirty).
     */
    get dirtyTransform(): boolean {
        return this.#dirtyTransform;
    }

    set dirtyTransform(value: boolean) {
        this.#dirtyTransform = value;
    }

    /**
     * [KO] 이 그룹 객체가 포함된 부모 컨테이너(Object3DContainer)를 설정하거나 가져옵니다.
     * [EN] Sets or gets the parent container (Object3DContainer) containing this group object.
     */
    get parent(): Object3DContainer {
        return this.#parent;
    }

    set parent(value: Object3DContainer) {
        this.#parent = value;
    }

    /**
     * [KO] X축 피벗(중심점) 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis pivot (center point) coordinate.
     */
    get pivotX(): number {
        return this.#pivotX;
    }

    set pivotX(value: number) {
        this.#pivotX = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] Y축 피벗(중심점) 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis pivot (center point) coordinate.
     */
    get pivotY(): number {
        return this.#pivotY;
    }

    set pivotY(value: number) {
        this.#pivotY = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] Z축 피벗(중심점) 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis pivot (center point) coordinate.
     */
    get pivotZ(): number {
        return this.#pivotZ;
    }

    set pivotZ(value: number) {
        this.#pivotZ = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 그룹의 X축 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis position coordinate of the group.
     */
    get x(): number {
        return this.#x;
    }

    set x(value: number) {
        this.#x = this.#positionArray[0] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 그룹의 Y축 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis position coordinate of the group.
     */
    get y(): number {
        return this.#y;
    }

    set y(value: number) {
        this.#y = this.#positionArray[1] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 그룹의 Z축 위치 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis position coordinate of the group.
     */
    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        this.#z = this.#positionArray[2] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 그룹의 X, Y, Z 위치 좌표 배열 [x, y, z]을 가져옵니다.
     * [EN] Gets the position coordinate array [x, y, z] of the group.
     */
    get position(): [number, number, number] {
        return this.#positionArray;
    }

    /**
     * [KO] X축 스케일 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the scale factor along the X-axis.
     */
    get scaleX(): number {
        return this.#scaleX;
    }

    set scaleX(value: number) {
        this.#scaleX = this.#scaleArray[0] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] Y축 스케일 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the scale factor along the Y-axis.
     */
    get scaleY(): number {
        return this.#scaleY;
    }

    set scaleY(value: number) {
        this.#scaleY = this.#scaleArray[1] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] Z축 스케일 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the scale factor along the Z-axis.
     */
    get scaleZ(): number {
        return this.#scaleZ;
    }

    set scaleZ(value: number) {
        this.#scaleZ = this.#scaleArray[2] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 그룹의 X, Y, Z 스케일 배율 배열 [scaleX, scaleY, scaleZ]을 가져옵니다.
     * [EN] Gets the scale factor array [scaleX, scaleY, scaleZ] of the group.
     */
    get scale(): number[] {
        return this.#scaleArray;
    }

    /**
     * [KO] X축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the X-axis.
     */
    get rotationX(): number {
        return this.#rotationX;
    }

    set rotationX(value: number) {
        this.#rotationX = this.#rotationArray[0] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] Y축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the Y-axis.
     */
    get rotationY(): number {
        return this.#rotationY;
    }

    set rotationY(value: number) {
        this.#rotationY = this.#rotationArray[1] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] Z축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the Z-axis.
     */
    get rotationZ(): number {
        return this.#rotationZ;
    }

    set rotationZ(value: number) {
        this.#rotationZ = this.#rotationArray[2] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 그룹의 회전각 [rotationX, rotationY, rotationZ] 배열(Degree)을 가져옵니다.
     * [EN] Gets the rotation angle array [rotationX, rotationY, rotationZ] of the group in degrees.
     */
    get rotation(): number[] {
        return this.#rotationArray;
    }

    /**
     * [KO] 그룹의 X, Y, Z축 스케일을 설정합니다. Y와 Z를 입력하지 않은 경우, X값과 동일하게 통일되어 적용됩니다.
     * [EN] Sets the scale factor along the X, Y, and Z axes. If Y and Z are omitted, they default to the value of X (uniform scaling).
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
    setScale(x: number, y?: number, z?: number) {
        y = y ?? x;
        z = z ?? x;
        const scaleArray = this.#scaleArray
        this.#scaleX = scaleArray[0] = x
        this.#scaleY = scaleArray[1] = y
        this.#scaleZ = scaleArray[2] = z
        this.dirtyTransform = true
    }

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
    setPosition(x: number, y?: number, z?: number) {
        y = y ?? x;
        z = z ?? x;
        const positionArray = this.#positionArray
        this.#x = positionArray[0] = x;
        this.#y = positionArray[1] = y;
        this.#z = positionArray[2] = z;
        this.dirtyTransform = true
    }

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
    setRotation(rotationX: number, rotationY?: number, rotationZ?: number) {
        rotationY = rotationY ?? rotationX;
        rotationZ = rotationZ ?? rotationX;
        const rotationArray = this.#rotationArray
        this.#rotationX = rotationArray[0] = rotationX
        this.#rotationY = rotationArray[1] = rotationY
        this.#rotationZ = rotationArray[2] = rotationZ
        this.dirtyTransform = true
    }

    /**
     * [KO] 이 그룹 노드 및 하위 자식 노드들의 트랜스폼 행렬 갱신을 실행하고 렌더링에 필요한 처리를 갱신합니다.
     * [EN] Executes transform matrix updates for this group node and its child nodes, updating processes required for rendering.
     * @param renderViewStateData -
     * [KO] 렌더링 상태 뷰 데이터
     * [EN] Rendering state view data
     */
    render(renderViewStateData: RenderViewStateData) {
        const {} = this
        const {
            view,
            isScene2DMode,
        } = renderViewStateData
        let dirtyTransformForChildren
        if (isScene2DMode) {
            this.#z = 0
            this.#pivotZ = 0
        }
        if (this.dirtyTransform) {
            dirtyTransformForChildren = true;
            updateObject3DMatrix(this, view)

        }
        if (this.dirtyTransform) {
            dirtyTransformForChildren = true
            this.dirtyTransform = false
        }
        renderViewStateData.renderResults.num3DGroups++
        // children render
        const {children} = this
        let i = 0
        const childNum = children.length
        // while (i--) {
        for (; i < childNum; i++) {
            if (dirtyTransformForChildren) children[i].dirtyTransform = dirtyTransformForChildren
            children[i].render(renderViewStateData)
        }
    }
}

Object.freeze(Group3D)
export default Group3D
