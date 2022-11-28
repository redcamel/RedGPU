import {mat4} from "../../util/gl-matrix";
import DisplayContainer from "./DisplayContainer";
import CONST_DIRTY_TRANSFORM_STATE from "./CONST_DIRTY_TRANSFORM_STATE";

class BaseObject3DTransform extends DisplayContainer {

    dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
    ///////////////
    #scaleX: number = 1
    get scaleX(): number {
        return this.#scaleX;
    }

    set scaleX(value: number) {
        this.#scaleX = value;
        this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
    }

    #scaleY: number = 1
    get scaleY(): number {
        return this.#scaleY;
    }

    set scaleY(value: number) {
        this.#scaleY = value;
        this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
    }

    #scaleZ: number = 1
    get scaleZ(): number {
        return this.#scaleZ;
    }

    set scaleZ(value: number) {
        this.#scaleZ = value;
        this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
    }

    setScale(x: number, y: number, z: number) {
        this.#scaleX = x
        this.#scaleY = y
        this.#scaleZ = z
        this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
    }

    #x: number = 0
    get x(): number {
        return this.#x;
    }

    set x(value: number) {
        this.#x = value;
        this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
    }

    #y: number = 0
    get y(): number {
        return this.#y;
    }

    set y(value: number) {
        this.#y = value;
        this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
    }

    #z: number = 0

    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        this.#z = value;
        this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
    }

    get position(): number[] {
        return [this.#x, this.#y, this.#z];
    }


    ///////////////

    #rotationX: number = 0

    get rotationX(): number {
        return this.#rotationX;
    }

    set rotationX(value: number) {
        this.#rotationX = value;
        this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
    }

    #rotationY: number = 0

    get rotationY(): number {
        return this.#rotationY;
    }

    set rotationY(value: number) {
        this.#rotationY = value;
        this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
    }

    #rotationZ: number = 0

    get rotationZ(): number {
        return this.#rotationZ;
    }

    set rotationZ(value: number) {
        this.#rotationZ = value;
        this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.DIRTY
    }


    ///////////////
    matrix = mat4.create()
    normalMatrix = mat4.create()

    constructor() {
        super()
    }

    setPosition(x: number, y: number, z: number) {
        this.#x = x
        this.#y = y
        this.#z = z
    }

}

export default BaseObject3DTransform
