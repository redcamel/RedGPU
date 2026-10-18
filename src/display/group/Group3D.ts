import {mat4} from "gl-matrix";
import Object3DContainer from "../mesh/core/Object3DContainer";
import RenderViewStateData from "../view/core/RenderViewStateData";
import updateObject3DMatrix from "../../math/updateObject3DMatrix";

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
 * <iframe src="/RedGPU/examples/3d/group3D/basic/" ></iframe>
 *
 * @see [Group3D basic example](/RedGPU/examples/3d/group3D/basic/)
 * @category Group
 */
class Group3D extends Object3DContainer {
    /**
     * [KO] 그룹의 월드 변환 행렬(`mat4`)
     * [EN] World transformation matrix (`mat4`) of the group
     */
    modelMatrix = mat4.create()
    /**
     * [KO] 그룹의 로컬 변환 행렬(`mat4`)
     * [EN] Local transformation matrix (`mat4`) of the group
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
    constructor(name?: string) {
        super()
        if (name) this.name = name
    }

    /**
     * [KO] 변환 행렬의 갱신이 필요한 상태(Dirty)인지 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether the transformation matrix requires an update (dirty).
     *
     * @returns
     * [KO] 변환 행렬 갱신 필요 여부
     * [EN] Whether the transformation matrix requires an update
     */
    get dirtyTransform(): boolean {
        return this.#dirtyTransform;
    }

    set dirtyTransform(value: boolean) {
        this.#dirtyTransform = value;
    }

    /**
     * [KO] 이 그룹 객체가 속한 부모 컨테이너(`Object3DContainer`)를 가져오거나 설정합니다.
     * [EN] Gets or sets the parent container (`Object3DContainer`) to which this group object belongs.
     *
     * @returns
     * [KO] 부모 컨테이너 객체
     * [EN] Parent container object
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
     *
     * @returns
     * [KO] X축 피벗 좌표
     * [EN] X-axis pivot coordinate
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
     *
     * @returns
     * [KO] Y축 피벗 좌표
     * [EN] Y-axis pivot coordinate
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
     *
     * @returns
     * [KO] Z축 피벗 좌표
     * [EN] Z-axis pivot coordinate
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
     *
     * @returns
     * [KO] X축 위치 좌표
     * [EN] X-axis position coordinate
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
     *
     * @returns
     * [KO] Y축 위치 좌표
     * [EN] Y-axis position coordinate
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
     *
     * @returns
     * [KO] Z축 위치 좌표
     * [EN] Z-axis position coordinate
     */
    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        this.#z = this.#positionArray[2] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 그룹의 위치 좌표 배열(`[x, y, z]`)을 반환합니다.
     * [EN] Returns the position coordinate array (`[x, y, z]`) of the group.
     *
     * @returns
     * [KO] `[x, y, z]` 위치 좌표 배열
     * [EN] `[x, y, z]` position coordinate array
     */
    get position(): [number, number, number] {
        return this.#positionArray;
    }

    /**
     * [KO] X축 스케일 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the scale factor along the X-axis.
     *
     * @returns
     * [KO] X축 스케일 배율
     * [EN] X-axis scale factor
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
     *
     * @returns
     * [KO] Y축 스케일 배율
     * [EN] Y-axis scale factor
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
     *
     * @returns
     * [KO] Z축 스케일 배율
     * [EN] Z-axis scale factor
     */
    get scaleZ(): number {
        return this.#scaleZ;
    }

    set scaleZ(value: number) {
        this.#scaleZ = this.#scaleArray[2] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 그룹의 스케일 배율 배열(`[scaleX, scaleY, scaleZ]`)을 반환합니다.
     * [EN] Returns the scale factor array (`[scaleX, scaleY, scaleZ]`) of the group.
     *
     * @returns
     * [KO] `[scaleX, scaleY, scaleZ]` 스케일 배열
     * [EN] `[scaleX, scaleY, scaleZ]` scale array
     */
    get scale(): number[] {
        return this.#scaleArray;
    }

    /**
     * [KO] X축 회전각(단위: Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (unit: Degree) around the X-axis.
     *
     * @returns
     * [KO] X축 회전각 (Degree)
     * [EN] X-axis rotation angle (Degree)
     */
    get rotationX(): number {
        return this.#rotationX;
    }

    set rotationX(value: number) {
        this.#rotationX = this.#rotationArray[0] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] Y축 회전각(단위: Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (unit: Degree) around the Y-axis.
     *
     * @returns
     * [KO] Y축 회전각 (Degree)
     * [EN] Y-axis rotation angle (Degree)
     */
    get rotationY(): number {
        return this.#rotationY;
    }

    set rotationY(value: number) {
        this.#rotationY = this.#rotationArray[1] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] Z축 회전각(단위: Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (unit: Degree) around the Z-axis.
     *
     * @returns
     * [KO] Z축 회전각 (Degree)
     * [EN] Z-axis rotation angle (Degree)
     */
    get rotationZ(): number {
        return this.#rotationZ;
    }

    set rotationZ(value: number) {
        this.#rotationZ = this.#rotationArray[2] = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 그룹의 회전각 배열(`[rotationX, rotationY, rotationZ]`, 단위: Degree)을 반환합니다.
     * [EN] Returns the rotation angle array (`[rotationX, rotationY, rotationZ]`, unit: Degree) of the group.
     *
     * @returns
     * [KO] `[rotationX, rotationY, rotationZ]` 회전각 배열 (Degree)
     * [EN] `[rotationX, rotationY, rotationZ]` rotation angle array (Degree)
     */
    get rotation(): number[] {
        return this.#rotationArray;
    }

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
     * [KO] 그룹의 변환 행렬을 갱신하고 하위 자식 객체들을 순회하며 렌더링합니다.
     * [EN] Updates the group's transformation matrix and traverses child objects to render them.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
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
        const {children} = this
        let i = 0
        const childNum = children.length
        for (; i < childNum; i++) {
            if (dirtyTransformForChildren) children[i].dirtyTransform = dirtyTransformForChildren
            children[i].render(renderViewStateData)
        }
    }
}

Object.freeze(Group3D)
export default Group3D
