import { mat4 } from "gl-matrix";
import InstanceIdGenerator from "../../../utils/uuid/InstanceIdGenerator";
import Object3DContainer from "../../mesh/core/Object3DContainer";
import MESH_TYPE from "../../MESH_TYPE";
const CONVERT_RADIAN = Math.PI / 180;
/**
 * 그룹의 기본 동작과 변환(위치, 회전, 스케일, 피벗 등)을 제공하는 3D/2D 공통 베이스 클래스입니다.
 *
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.

 */
class GroupBase extends Object3DContainer {
    /** 모델 변환 행렬 */
    modelMatrix = mat4.create();
    /** 로컬 변환 행렬 */
    localMatrix = mat4.create();
    /** 인스턴스 고유 ID */
    #instanceId;
    /** 그룹 이름 */
    #name;
    /** 부모 객체 */
    #parent;
    /** X 좌표 */
    #x = 0;
    /** Z 좌표 */
    #z = 0;
    /** Y 좌표 */
    #y = 0;
    /** 위치 배열 [x, y, z] */
    #positionArray = [0, 0, 0];
    /** 피벗 X */
    #pivotX = 0;
    /** 피벗 Y */
    #pivotY = 0;
    /** 피벗 Z */
    #pivotZ = 0;
    /** X 스케일 */
    #scaleX = 1;
    /** Y 스케일 */
    #scaleY = 1;
    /** Z 스케일 */
    #scaleZ = 1;
    /** 스케일 배열 [x, y, z] */
    #scaleArray = [1, 1, 1];
    /** X축 회전 (deg) */
    #rotationX = 0;
    /** Y축 회전 (deg) */
    #rotationY = 0;
    /** Z축 회전 (deg) */
    #rotationZ = 0;
    /** 회전 배열 [x, y, z] (deg) */
    #rotationArray = [0, 0, 0];
    /** 변환 행렬 갱신 필요 여부 */
    #dirtyTransform = true;
    /**
     * 그룹을 생성합니다.
     * @param name 그룹 이름(선택)
     */
    constructor(name) {
        super();
        if (name)
            this.name = name;
    }
    /**
     * 변환 행렬 갱신 필요 여부 반환
     */
    get dirtyTransform() {
        return this.#dirtyTransform;
    }
    /**
     * 변환 행렬 갱신 필요 여부 설정
     */
    set dirtyTransform(value) {
        this.#dirtyTransform = value;
    }
    /**
     * 그룹 이름 반환
     */
    get name() {
        if (!this.#instanceId)
            this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }
    /**
     * 그룹 이름 설정
     */
    set name(value) {
        this.#name = value;
    }
    /**
     * 설정된 부모 객체 반환
     */
    get parent() {
        return this.#parent;
    }
    /**
     * 부모 객체 설정
     * @param value 부모 객체
     */
    set parent(value) {
        this.#parent = value;
    }
    /**
     * 피벗 X 반환
     */
    get pivotX() {
        return this.#pivotX;
    }
    /**
     * 피벗 X 설정
     */
    set pivotX(value) {
        this.#pivotX = value;
        this.dirtyTransform = true;
    }
    /**
     * 피벗 Y 반환
     */
    get pivotY() {
        return this.#pivotY;
    }
    /**
     * 피벗 Y 설정
     */
    set pivotY(value) {
        this.#pivotY = value;
        this.dirtyTransform = true;
    }
    /**
     * 피벗 Z 반환
     */
    get pivotZ() {
        return this.#pivotZ;
    }
    /**
     * 피벗 Z 설정
     */
    set pivotZ(value) {
        this.#pivotZ = value;
        this.dirtyTransform = true;
    }
    /**
     * X 좌표 반환
     */
    get x() {
        return this.#x;
    }
    /**
     * X 좌표 설정
     */
    set x(value) {
        this.#x = this.#positionArray[0] = value;
        this.dirtyTransform = true;
    }
    /**
     * Y 좌표 반환
     */
    get y() {
        return this.#y;
    }
    /**
     * Y 좌표 설정
     */
    set y(value) {
        this.#y = this.#positionArray[1] = value;
        this.dirtyTransform = true;
    }
    /**
     * Z 좌표 반환
     */
    get z() {
        return this.#z;
    }
    /**
     * Z 좌표 설정
     */
    set z(value) {
        this.#z = this.#positionArray[2] = value;
        this.dirtyTransform = true;
    }
    /**
     * 위치 배열 반환 [x, y, z]
     */
    get position() {
        return this.#positionArray;
    }
    /**
     * X 스케일 반환
     */
    get scaleX() {
        return this.#scaleX;
    }
    /**
     * X 스케일 설정
     */
    set scaleX(value) {
        this.#scaleX = this.#scaleArray[0] = value;
        this.dirtyTransform = true;
    }
    /**
     * Y 스케일 반환
     */
    get scaleY() {
        return this.#scaleY;
    }
    /**
     * Y 스케일 설정
     */
    set scaleY(value) {
        this.#scaleY = this.#scaleArray[1] = value;
        this.dirtyTransform = true;
    }
    /**
     * Z 스케일 반환
     */
    get scaleZ() {
        return this.#scaleZ;
    }
    /**
     * Z 스케일 설정
     */
    set scaleZ(value) {
        this.#scaleZ = this.#scaleArray[2] = value;
        this.dirtyTransform = true;
    }
    /**
     * 스케일 배열 반환 [x, y, z]
     */
    get scale() {
        return this.#positionArray;
    }
    /**
     * X축 회전 반환 (deg)
     */
    get rotationX() {
        return this.#rotationX;
    }
    /**
     * X축 회전 설정 (deg)
     */
    set rotationX(value) {
        this.#rotationX = this.#rotationArray[0] = value;
        this.dirtyTransform = true;
    }
    /**
     * Y축 회전 반환 (deg)
     */
    get rotationY() {
        return this.#rotationY;
    }
    /**
     * Y축 회전 설정 (deg)
     */
    set rotationY(value) {
        this.#rotationY = this.#rotationArray[1] = value;
        this.dirtyTransform = true;
    }
    /**
     * Z축 회전 반환 (deg)
     */
    get rotationZ() {
        return this.#rotationZ;
    }
    /**
     * Z축 회전 설정 (deg)
     */
    set rotationZ(value) {
        this.#rotationZ = this.#rotationArray[2] = value;
        this.dirtyTransform = true;
    }
    /**
     * 회전 배열 반환 [x, y, z] (deg)
     */
    get rotation() {
        return this.#rotationArray;
    }
    /**
     * 스케일을 설정합니다.
     * @param x X 스케일
     * @param y Y 스케일(생략 시 x와 동일)
     * @param z Z 스케일(생략 시 x와 동일)
     */
    setScale(x, y, z) {
        y = y ?? x;
        z = z ?? x;
        const scaleArray = this.#scaleArray;
        this.#scaleX = scaleArray[0] = x;
        this.#scaleY = scaleArray[1] = y;
        this.#scaleZ = scaleArray[2] = z;
        this.dirtyTransform = true;
    }
    /**
     * 위치를 설정합니다.
     * @param x X 좌표
     * @param y Y 좌표(생략 시 x와 동일)
     * @param z Z 좌표(생략 시 x와 동일)
     */
    setPosition(x, y, z) {
        y = y ?? x;
        z = z ?? x;
        const positionArray = this.#positionArray;
        this.#x = positionArray[0] = x;
        this.#y = positionArray[1] = y;
        this.#z = positionArray[2] = z;
        this.dirtyTransform = true;
    }
    /**
     * 회전을 설정합니다.
     * @param rotationX X축 회전(도)
     * @param rotationY Y축 회전(도, 생략 시 rotationX와 동일)
     * @param rotationZ Z축 회전(도, 생략 시 rotationX와 동일)
     */
    setRotation(rotationX, rotationY, rotationZ) {
        rotationY = rotationY ?? rotationX;
        rotationZ = rotationZ ?? rotationX;
        const rotationArray = this.#rotationArray;
        this.#rotationX = rotationArray[0] = rotationX;
        this.#rotationY = rotationArray[1] = rotationY;
        this.#rotationZ = rotationArray[2] = rotationZ;
        this.dirtyTransform = true;
    }
    /**
     * 렌더링 및 변환 행렬 계산을 수행합니다.
     * @param renderViewStateData 렌더 상태 데이터
     */
    render(renderViewStateData) {
        const {} = this;
        const { view, isScene2DMode, } = renderViewStateData;
        let dirtyTransformForChildren;
        if (isScene2DMode) {
            this.#z = 0;
            this.#pivotZ = 0;
        }
        if (this.dirtyTransform) {
            dirtyTransformForChildren = true;
            {
                const { pixelRectObject } = view;
                const parent = this.parent;
                const tLocalMatrix = this.localMatrix;
                // 초기화
                mat4.identity(tLocalMatrix);
                // Position 설정 (translate)
                mat4.translate(tLocalMatrix, tLocalMatrix, [
                    this.#x,
                    this.#y,
                    this.#z,
                ]);
                // Rotation 설정 (rotate)
                mat4.rotateX(tLocalMatrix, tLocalMatrix, this.#rotationX * CONVERT_RADIAN); // X축 회전
                mat4.rotateY(tLocalMatrix, tLocalMatrix, this.#rotationY * CONVERT_RADIAN); // Y축 회전
                mat4.rotateZ(tLocalMatrix, tLocalMatrix, this.#rotationZ * CONVERT_RADIAN); // Z축 회전
                // Scale 설정 (scale)
                let scaleVec = [this.#scaleX, this.#scaleY, this.#scaleZ];
                // @ts-ignore
                if (this.renderTextureWidth) {
                    // @ts-ignore
                    scaleVec[0] *= this.renderTextureWidth / pixelRectObject.height;
                    // @ts-ignore
                    scaleVec[1] *= this.renderTextureHeight / pixelRectObject.height;
                }
                // @ts-ignore
                mat4.scale(tLocalMatrix, tLocalMatrix, scaleVec);
                // Pivot 처리를 위한 번역 (pivot 적용)
                if (this.#pivotX || this.#pivotY || this.#pivotZ) {
                    const pivotTranslation = [-this.#pivotX, -this.#pivotY, -this.#pivotZ];
                    // @ts-ignore
                    mat4.translate(tLocalMatrix, tLocalMatrix, pivotTranslation);
                }
                // 부모 매트릭스와 합성 (modelMatrix 계산)
                if (parent?.modelMatrix) {
                    mat4.multiply(this.modelMatrix, parent.modelMatrix, this.localMatrix);
                }
                else {
                    mat4.copy(this.modelMatrix, this.localMatrix);
                }
            }
        }
        if (this.dirtyTransform) {
            dirtyTransformForChildren = true;
            this.dirtyTransform = false;
        }
        renderViewStateData.num3DGroups++;
        // children render
        const { children } = this;
        let i = 0;
        const childNum = children.length;
        // while (i--) {
        for (; i < childNum; i++) {
            if (dirtyTransformForChildren)
                children[i].dirtyTransform = dirtyTransformForChildren;
            children[i].render(renderViewStateData);
        }
    }
}
Object.defineProperty(GroupBase.prototype, 'meshType', {
    value: MESH_TYPE.MESH,
    writable: false
});
Object.freeze(GroupBase);
export default GroupBase;
