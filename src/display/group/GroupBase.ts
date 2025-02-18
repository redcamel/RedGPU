import {mat4} from "gl-matrix";
import RenderViewStateData from "../../renderer/RenderViewStateData";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";
import Object3DContainer from "../mesh/core/Object3DContainer";

interface GroupBase {
}

const CONVERT_RADIAN = Math.PI / 180;

class GroupBase extends Object3DContainer {
    //
    modelMatrix = mat4.create()
    localMatrix = mat4.create()
    #instanceId: number
    #name: string
    #parent: Object3DContainer
    //
    #x: number = 0
    #z: number = 0
    #y: number = 0
    #positionArray: [number, number, number] = [0, 0, 0]
    //
    #pivotX: number = 0
    #pivotY: number = 0
    #pivotZ: number = 0
    //
    #scaleX: number = 1
    #scaleY: number = 1
    #scaleZ: number = 1
    //
    #scaleArray: number[] = [1, 1, 1]
    //
    #rotationX: number = 0
    #rotationY: number = 0
    #rotationZ: number = 0
    #rotationArray: number[] = [0, 0, 0]
    //
    #dirtyTransform: boolean = true

//
    constructor(name?: string) {
        super()
        if (name) this.name = name
    }

    get dirtyTransform(): boolean {
        return this.#dirtyTransform;
    }

    set dirtyTransform(value: boolean) {
        this.#dirtyTransform = value;
    }

    get name(): string {
        if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }

    set name(value: string) {
        this.#name = value;
    }

    /**
     * 설정된 부모 객체값을 반환합니다.
     */
    get parent(): Object3DContainer {
        return this.#parent;
    }

    /**
     * 부모 객체를 설정합니다.
     * @param value
     */
    set parent(value: Object3DContainer) {
        this.#parent = value;
    }

    get pivotX(): number {
        return this.#pivotX;
    }

    set pivotX(value: number) {
        this.#pivotX = value;
        this.dirtyTransform = true
    }

    get pivotY(): number {
        return this.#pivotY;
    }

    set pivotY(value: number) {
        this.#pivotY = value;
        this.dirtyTransform = true
    }

    get pivotZ(): number {
        return this.#pivotZ;
    }

    set pivotZ(value: number) {
        this.#pivotZ = value;
        this.dirtyTransform = true
    }

    get x(): number {
        return this.#x;
    }

    set x(value: number) {
        this.#x = this.#positionArray[0] = value;
        this.dirtyTransform = true
    }

    get y(): number {
        return this.#y;
    }

    set y(value: number) {
        this.#y = this.#positionArray[1] = value;
        this.dirtyTransform = true
    }

    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        this.#z = this.#positionArray[2] = value;
        this.dirtyTransform = true
    }

    get position(): [number, number, number] {
        return this.#positionArray;
    }

    get scaleX(): number {
        return this.#scaleX;
    }

    set scaleX(value: number) {
        this.#scaleX = this.#scaleArray[0] = value;
        this.dirtyTransform = true
    }

    get scaleY(): number {
        return this.#scaleY;
    }

    set scaleY(value: number) {
        this.#scaleY = this.#scaleArray[1] = value;
        this.dirtyTransform = true
    }

    get scaleZ(): number {
        return this.#scaleZ;
    }

    set scaleZ(value: number) {
        this.#scaleZ = this.#scaleArray[2] = value;
        this.dirtyTransform = true
    }

    get scale(): number[] {
        return this.#positionArray;
    }

    get rotationX(): number {
        return this.#rotationX;
    }

    set rotationX(value: number) {
        this.#rotationX = this.#rotationArray[0] = value;
        this.dirtyTransform = true
    }

    get rotationY(): number {
        return this.#rotationY;
    }

    set rotationY(value: number) {
        this.#rotationY = this.#rotationArray[1] = value;
        this.dirtyTransform = true
    }

    get rotationZ(): number {
        return this.#rotationZ;
    }

    set rotationZ(value: number) {
        this.#rotationZ = this.#rotationArray[2] = value;
        this.dirtyTransform = true
    }

    get rotation(): number[] {
        return this.#rotationArray;
    }

    setScale(x: number, y?: number, z?: number) {
        y = y ?? x;
        z = z ?? x;
        const scaleArray = this.#scaleArray
        this.#scaleX = scaleArray[0] = x
        this.#scaleY = scaleArray[1] = y
        this.#scaleZ = scaleArray[2] = z
        this.dirtyTransform = true
    }

    setPosition(x: number, y?: number, z?: number) {
        y = y ?? x;
        z = z ?? x;
        const positionArray = this.#positionArray
        this.#x = positionArray[0] = x;
        this.#y = positionArray[1] = y;
        this.#z = positionArray[2] = z;
        this.dirtyTransform = true
    }

    setRotation(rotationX: number, rotationY?: number, rotationZ?: number) {
        rotationY = rotationY ?? rotationX;
        rotationZ = rotationZ ?? rotationX;
        const rotationArray = this.#rotationArray
        this.#rotationX = rotationArray[0] = rotationX
        this.#rotationY = rotationArray[1] = rotationY
        this.#rotationZ = rotationArray[2] = rotationZ
        this.dirtyTransform = true
    }

    render(debugViewRenderState: RenderViewStateData) {
        const {} = this
        const {
            view,
            isScene2DMode,
        } = debugViewRenderState
        let dirtyTransformForChildren
        if (isScene2DMode) {
            this.#z = 0
            this.#pivotZ = 0
        }
        if (this.dirtyTransform) {
            dirtyTransformForChildren = true;
            {
                const {pixelRectObject} = view;
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
                } else {
                    mat4.copy(this.modelMatrix, this.localMatrix);
                }
            }
        }
        if (this.dirtyTransform) {
            dirtyTransformForChildren = true
            this.dirtyTransform = false
        }
        debugViewRenderState.num3DGroups++
        // children render
        const {children} = this
        let i = 0
        const childNum = children.length
        // while (i--) {
        for (; i < childNum; i++) {
            if (dirtyTransformForChildren) children[i].dirtyTransform = dirtyTransformForChildren
            children[i].render(debugViewRenderState)
        }
    }
}

Object.defineProperty(GroupBase.prototype, 'meshType', {
    value: 'mesh',
    writable: false
});
Object.freeze(GroupBase)
export default GroupBase
