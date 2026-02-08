import {mat4} from "gl-matrix";
import InstanceIdGenerator from "../../../utils/uuid/InstanceIdGenerator";
import Object3DContainer from "../../mesh/core/Object3DContainer";
import MESH_TYPE from "../../MESH_TYPE";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import updateObject3DMatrix from "../../../math/updateObject3DMatrix";

interface AGroupBase {
}

const CONVERT_RADIAN = Math.PI / 180;

/**
 * [KO] 그룹의 기본 동작과 변환(위치, 회전, 스케일, 피벗 등)을 제공하는 3D/2D 공통 추상 클래스입니다.
 * [EN] Abstract base class providing common group behavior and transformations (position, rotation, scale, pivot, etc.) for both 3D and 2D.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 추상 클래스입니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class used internally by the system.<br/>Do not create instances directly.
 * :::
 *
 * @category Core
 */
abstract class GroupBase extends Object3DContainer {
    /**
     * [KO] 모델 변환 행렬
     * [EN] Model transformation matrix
     */
    modelMatrix = mat4.create()
    /**
     * [KO] 로컬 변환 행렬
     * [EN] Local transformation matrix
     */
    localMatrix = mat4.create()
    /**
     * [KO] 인스턴스 고유 ID
     * [EN] Instance unique ID
     */
    #instanceId: number
    /**
     * [KO] 그룹 이름
     * [EN] Group name
     */
    #name: string
    /**
     * [KO] 부모 객체
     * [EN] Parent object
     */
    #parent: Object3DContainer
    /**
     * [KO] X 좌표
     * [EN] X coordinate
     */
    #x: number = 0
    /**
     * [KO] Z 좌표
     * [EN] Z coordinate
     */
    #z: number = 0
    /**
     * [KO] Y 좌표
     * [EN] Y coordinate
     */
    #y: number = 0
    /**
     * [KO] 위치 배열 [x, y, z]
     * [EN] Position array [x, y, z]
     */
    #positionArray: [number, number, number] = [0, 0, 0]
    /**
     * [KO] 피벗 X
     * [EN] Pivot X
     */
    #pivotX: number = 0
    /**
     * [KO] 피벗 Y
     * [EN] Pivot Y
     */
    #pivotY: number = 0
    /**
     * [KO] 피벗 Z
     * [EN] Pivot Z
     */
    #pivotZ: number = 0
    /**
     * [KO] X 스케일
     * [EN] X scale
     */
    #scaleX: number = 1
    /**
     * [KO] Y 스케일
     * [EN] Y scale
     */
    #scaleY: number = 1
    /**
     * [KO] Z 스케일
     * [EN] Z scale
     */
    #scaleZ: number = 1
    /**
     * [KO] 스케일 배열 [x, y, z]
     * [EN] Scale array [x, y, z]
     */
    #scaleArray: number[] = [1, 1, 1]
    /**
     * [KO] X축 회전 (deg)
     * [EN] X-axis rotation (deg)
     */
    #rotationX: number = 0
    /**
     * [KO] Y축 회전 (deg)
     * [EN] Y-axis rotation (deg)
     */
    #rotationY: number = 0
    /**
     * [KO] Z축 회전 (deg)
     * [EN] Z-axis rotation (deg)
     */
    #rotationZ: number = 0
    /**
     * [KO] 회전 배열 [x, y, z] (deg)
     * [EN] Rotation array [x, y, z] (deg)
     */
    #rotationArray: number[] = [0, 0, 0]
    /**
     * [KO] 변환 행렬 갱신 필요 여부
     * [EN] Whether transform matrix needs update
     */
    #dirtyTransform: boolean = true

    /**
     * [KO] GroupBase 생성자
     * [EN] GroupBase constructor
     * @param name -
     * [KO] 그룹 이름(선택)
     * [EN] Group name (optional)
     */
    constructor(name?: string) {
        super()
        if (name) this.name = name
    }

    /**
     * 변환 행렬 갱신 필요 여부 반환
     */
    get dirtyTransform(): boolean {
        return this.#dirtyTransform;
    }

    /**
     * 변환 행렬 갱신 필요 여부 설정
     */
    set dirtyTransform(value: boolean) {
        this.#dirtyTransform = value;
    }

    /**
     * 그룹 이름 반환
     */
    get name(): string {
        if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }

    /**
     * 그룹 이름 설정
     */
    set name(value: string) {
        this.#name = value;
    }

    /**
     * 설정된 부모 객체 반환
     */
    get parent(): Object3DContainer {
        return this.#parent;
    }

    /**
     * 부모 객체 설정
     * @param value 부모 객체
     */
    set parent(value: Object3DContainer) {
        this.#parent = value;
    }

    /**
     * 피벗 X 반환
     */
    get pivotX(): number {
        return this.#pivotX;
    }

    /**
     * 피벗 X 설정
     */
    set pivotX(value: number) {
        this.#pivotX = value;
        this.dirtyTransform = true
    }

    /**
     * 피벗 Y 반환
     */
    get pivotY(): number {
        return this.#pivotY;
    }

    /**
     * 피벗 Y 설정
     */
    set pivotY(value: number) {
        this.#pivotY = value;
        this.dirtyTransform = true
    }

    /**
     * 피벗 Z 반환
     */
    get pivotZ(): number {
        return this.#pivotZ;
    }

    /**
     * 피벗 Z 설정
     */
    set pivotZ(value: number) {
        this.#pivotZ = value;
        this.dirtyTransform = true
    }

    /**
     * X 좌표 반환
     */
    get x(): number {
        return this.#x;
    }

    /**
     * X 좌표 설정
     */
    set x(value: number) {
        this.#x = this.#positionArray[0] = value;
        this.dirtyTransform = true
    }

    /**
     * Y 좌표 반환
     */
    get y(): number {
        return this.#y;
    }

    /**
     * Y 좌표 설정
     */
    set y(value: number) {
        this.#y = this.#positionArray[1] = value;
        this.dirtyTransform = true
    }

    /**
     * Z 좌표 반환
     */
    get z(): number {
        return this.#z;
    }

    /**
     * Z 좌표 설정
     */
    set z(value: number) {
        this.#z = this.#positionArray[2] = value;
        this.dirtyTransform = true
    }

    /**
     * 위치 배열 반환 [x, y, z]
     */
    get position(): [number, number, number] {
        return this.#positionArray;
    }

    /**
     * X 스케일 반환
     */
    get scaleX(): number {
        return this.#scaleX;
    }

    /**
     * X 스케일 설정
     */
    set scaleX(value: number) {
        this.#scaleX = this.#scaleArray[0] = value;
        this.dirtyTransform = true
    }

    /**
     * Y 스케일 반환
     */
    get scaleY(): number {
        return this.#scaleY;
    }

    /**
     * Y 스케일 설정
     */
    set scaleY(value: number) {
        this.#scaleY = this.#scaleArray[1] = value;
        this.dirtyTransform = true
    }

    /**
     * Z 스케일 반환
     */
    get scaleZ(): number {
        return this.#scaleZ;
    }

    /**
     * Z 스케일 설정
     */
    set scaleZ(value: number) {
        this.#scaleZ = this.#scaleArray[2] = value;
        this.dirtyTransform = true
    }

    /**
     * 스케일 배열 반환 [x, y, z]
     */
    get scale(): number[] {
        return this.#positionArray;
    }

    /**
     * X축 회전 반환 (deg)
     */
    get rotationX(): number {
        return this.#rotationX;
    }

    /**
     * X축 회전 설정 (deg)
     */
    set rotationX(value: number) {
        this.#rotationX = this.#rotationArray[0] = value;
        this.dirtyTransform = true
    }

    /**
     * Y축 회전 반환 (deg)
     */
    get rotationY(): number {
        return this.#rotationY;
    }

    /**
     * Y축 회전 설정 (deg)
     */
    set rotationY(value: number) {
        this.#rotationY = this.#rotationArray[1] = value;
        this.dirtyTransform = true
    }

    /**
     * Z축 회전 반환 (deg)
     */
    get rotationZ(): number {
        return this.#rotationZ;
    }

    /**
     * Z축 회전 설정 (deg)
     */
    set rotationZ(value: number) {
        this.#rotationZ = this.#rotationArray[2] = value;
        this.dirtyTransform = true
    }

    /**
     * 회전 배열 반환 [x, y, z] (deg)
     */
    get rotation(): number[] {
        return this.#rotationArray;
    }

    /**
     * 스케일을 설정합니다.
     * @param x X 스케일
     * @param y Y 스케일(생략 시 x와 동일)
     * @param z Z 스케일(생략 시 x와 동일)
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
     * 위치를 설정합니다.
     * @param x X 좌표
     * @param y Y 좌표(생략 시 x와 동일)
     * @param z Z 좌표(생략 시 x와 동일)
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
     * 회전을 설정합니다.
     * @param rotationX X축 회전(도)
     * @param rotationY Y축 회전(도, 생략 시 rotationX와 동일)
     * @param rotationZ Z축 회전(도, 생략 시 rotationX와 동일)
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
     * 렌더링 및 변환 행렬 계산을 수행합니다.
     * @param renderViewStateData 렌더 상태 데이터
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
            updateObject3DMatrix(this,view)

        }
        if (this.dirtyTransform) {
            dirtyTransformForChildren = true
            this.dirtyTransform = false
        }
        renderViewStateData.num3DGroups++
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

Object.defineProperty(GroupBase.prototype, 'meshType', {
    value: MESH_TYPE.MESH,
    writable: false
});
Object.freeze(GroupBase)
export default GroupBase
