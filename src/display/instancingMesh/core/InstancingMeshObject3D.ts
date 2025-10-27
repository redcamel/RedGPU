import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import InstancingMesh from "../InstancingMesh";

/**
 * The CPI2 variable represents the value of 2 times PI (π).
 *
 * @type {number}
 * @constant
 * @default 6.283185307179586
 *
 * @description
 * The CPI2 variable is a convenience constant that stores the value of 2 times PI (π), which is approximately equal to 6.283185307179586.
 *
 * This constant is commonly used in mathematical calculations and can be used in place of manually calculating the value of PI and multiplying it by 2.
 *
 * @createExample
 * // Calculate the circumference of a circle with a radius of 5 units
 * const circumference = CPI2 * 5;
 *
 */
const CPI = 3.141592653589793,
    CPI2 = 6.283185307179586,
    C225 = 0.225,
    C127 = 1.27323954,
    C045 = 0.405284735,
    C157 = 1.5707963267948966;
/**
 * Converts degrees to radians.
 *
 * @constant {number} TO_RADIANS - The conversion factor to convert degrees to radians.
 */
const TO_RADIANS = Math.PI / 180;

/**
 * Represents an instance of a 3D mesh object with instancing capabilities.
 */
class InstancingMeshObject3D {
    modelMatrix = mat4.create()
    localMatrix = mat4.create()
    normalModelMatrix = mat4.create()
    inited: boolean = false
    //
    #x: number = 0
    #z: number = 0
    #y: number = 0
    #positionArray: number[] = [0, 0, 0]
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
    readonly #location: number = 0
    #instancingMesh: InstancingMesh
    #redGPUContext: RedGPUContext
    #opacity: number = 1

    /**
     *
     * @param {RedGPUContext} redGPUContext - The RedGPUContext of the instance.
     * @param {number} location - The location of the instance.
     * @param {InstancingMesh} instancingMesh - The InstancingMesh of the instance.
     */
    constructor(redGPUContext: RedGPUContext, location: number, instancingMesh: InstancingMesh) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.#instancingMesh = instancingMesh
        this.#location = location
    }

    get opacity(): number {
        return this.#opacity;
    }

    set opacity(value: number) {
        validatePositiveNumberRange(value, 0, 1)
        this.#opacity = value;
        this.#updateMatrix()
    }

    get x(): number {
        return this.#x;
    }

    set x(value: number) {
        this.#x = this.#positionArray[0] = value;
        this.#updateMatrix()
    }

    get y(): number {
        return this.#y;
    }

    set y(value: number) {
        this.#y = this.#positionArray[1] = value;
        this.#updateMatrix()
    }

    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        this.#z = this.#positionArray[2] = value;
        this.#updateMatrix()
    }

    get position(): number[] {
        return this.#positionArray;
    }

    set position(value: number) {
        this.#x = this.#positionArray[0] = value
        this.#y = this.#positionArray[1] = value
        this.#z = this.#positionArray[2] = value
        this.#updateMatrix()
    }

    get scaleX(): number {
        return this.#scaleX;
    }

    set scaleX(value: number) {
        this.#scaleX = this.#scaleArray[0] = value;
        this.#updateMatrix()
    }

    get scaleY(): number {
        return this.#scaleY;
    }

    set scaleY(value: number) {
        this.#scaleY = this.#scaleArray[1] = value;
        this.#updateMatrix()
    }

    get scaleZ(): number {
        return this.#scaleZ;
    }

    set scaleZ(value: number) {
        this.#scaleZ = this.#scaleArray[2] = value;
        this.#updateMatrix()
    }

    get scale(): number[] {
        return this.#positionArray;
    }

    set scale(value: number) {
        this.#scaleX = this.#scaleArray[0] = value
        this.#scaleY = this.#scaleArray[1] = value
        this.#scaleZ = this.#scaleArray[2] = value
        this.#updateMatrix()
    }

    get rotationX(): number {
        return this.#rotationX;
    }

    set rotationX(value: number) {
        this.#rotationX = this.#rotationArray[0] = value;
        this.#updateMatrix()
    }

    get rotationY(): number {
        return this.#rotationY;
    }

    set rotationY(value: number) {
        this.#rotationY = this.#rotationArray[1] = value;
        this.#updateMatrix()
    }

    get rotationZ(): number {
        return this.#rotationZ;
    }

    set rotationZ(value: number) {
        this.#rotationZ = this.#rotationArray[2] = value;
        this.#updateMatrix()
    }

    get rotation(): number[] {
        return this.#rotationArray;
    }

    set rotation(value: number) {
        this.#rotationX = this.#rotationArray[0] = value
        this.#rotationY = this.#rotationArray[1] = value
        this.#rotationZ = this.#rotationArray[2] = value
        this.#updateMatrix()
    }

    /**
     * Set the scale of the object along the x, y, and z axes.
     * If only the x parameter is provided, the object is uniformly scaled along all axes.
     *
     * @param {number} x - The scale factor along the x-axis.
     * @param {number} [y] - The scale factor along the y-axis. Defaults to the value of x.
     * @param {number} [z] - The scale factor along the z-axis. Defaults to the value of x.
     */
    setScale(x: number, y?: number, z?: number) {
        y = y ?? x;
        z = z ?? x;
        const scaleArray = this.#scaleArray
        this.#scaleX = scaleArray[0] = x
        this.#scaleY = scaleArray[1] = y
        this.#scaleZ = scaleArray[2] = z
        this.#updateMatrix()
    }

    /**
     * Sets the position of the object.
     *
     * @param {number} x - The x coordinate of the position.
     * @param {number} [y=x] - The y coordinate of the position, defaults to x if not provided.
     * @param {number} [z=x] - The z coordinate of the position, defaults to x if not provided.
     *
     * @return {void}
     */
    setPosition(x: number, y?: number, z?: number) {
        y = y ?? x;
        z = z ?? x;
        const positionArray = this.#positionArray
        this.#x = positionArray[0] = x;
        this.#y = positionArray[1] = y;
        this.#z = positionArray[2] = z;
        this.#updateMatrix()
    }

    /**
     * Sets the rotation of an object in three-dimensional space.
     *
     * @param {number} rotationX - The rotation around the x-axis, in degrees.
     * @param {number} [rotationY] - The rotation around the y-axis, in degrees. Defaults to rotationX if not provided.
     * @param {number} [rotationZ] - The rotation around the z-axis, in degrees. Defaults to rotationX if not provided.
     */
    setRotation(rotationX: number, rotationY?: number, rotationZ?: number) {
        rotationY = rotationY ?? rotationX;
        rotationZ = rotationZ ?? rotationX;
        const rotationArray = this.#rotationArray
        this.#rotationX = rotationArray[0] = rotationX
        this.#rotationY = rotationArray[1] = rotationY
        this.#rotationZ = rotationArray[2] = rotationZ
        this.#updateMatrix()
    }

    #updateMatrix() {
        this.inited = true
        // mat4.identity(this.localMatrix);
        // mat4.translate(this.localMatrix, this.localMatrix, [this.#x, this.#y, this.#z]);
        // mat4.rotateX(this.localMatrix, this.localMatrix, this.#rotationX);
        // mat4.rotateY(this.localMatrix, this.localMatrix, this.#rotationY);
        // mat4.rotateZ(this.localMatrix, this.localMatrix, this.#rotationZ);
        // mat4.scale(this.localMatrix, this.localMatrix, [this.#scaleX, this.#scaleY, this.#scaleZ]);
        let aSx, aSy, aSz, aCx, aCy, aCz, aX, aY, aZ,
            a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33,
            b0, b1, b2, b3,
            b00, b01, b02, b10, b11, b12, b20, b21, b22;
        {
            const tLocalMatrix = this.localMatrix;
            // sin,cos 관련
            let tRadian;
            a00 = 1, a01 = 0, a02 = 0,
                a10 = 0, a11 = 1, a12 = 0,
                a20 = 0, a21 = 0, a22 = 1,
                // tLocalMatrix translate
                tLocalMatrix[12] = this.#x ,
                tLocalMatrix[13] = this.#y ,
                tLocalMatrix[14] = this.#z ,
                tLocalMatrix[15] = 1 ,
                // tLocalMatrix rotate
                aX = this.#rotationX * TO_RADIANS;
            aY = this.#rotationY * TO_RADIANS, aZ = this.#rotationZ * TO_RADIANS;
            /////////////////////////
            tRadian = aX % CPI2,
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
                aSx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
                tRadian = (aX + C157) % CPI2,
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
                aCx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
                tRadian = aY % CPI2,
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
                aSy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
                tRadian = (aY + C157) % CPI2,
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
                aCy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
                tRadian = aZ % CPI2,
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
                aSz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
                tRadian = (aZ + C157) % CPI2,
                tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
                tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
                aCz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
                /////////////////////////
                b00 = aCy * aCz, b01 = aSx * aSy * aCz - aCx * aSz, b02 = aCx * aSy * aCz + aSx * aSz,
                b10 = aCy * aSz, b11 = aSx * aSy * aSz + aCx * aCz, b12 = aCx * aSy * aSz - aSx * aCz,
                b20 = -aSy, b21 = aSx * aCy, b22 = aCx * aCy,
                // tLocalMatrix scale
                aX = this.#scaleX, aY = this.#scaleY , aZ = this.#scaleZ,
                tLocalMatrix[0] = (a00 * b00 + a10 * b01 + a20 * b02) * aX,
                tLocalMatrix[1] = (a01 * b00 + a11 * b01 + a21 * b02) * aX,
                tLocalMatrix[2] = (a02 * b00 + a12 * b01 + a22 * b02) * aX,
                tLocalMatrix[3] = tLocalMatrix[3] * aX,
                tLocalMatrix[4] = (a00 * b10 + a10 * b11 + a20 * b12) * aY,
                tLocalMatrix[5] = (a01 * b10 + a11 * b11 + a21 * b12) * aY,
                tLocalMatrix[6] = (a02 * b10 + a12 * b11 + a22 * b12) * aY,
                tLocalMatrix[7] = tLocalMatrix[7] * aY,
                tLocalMatrix[8] = (a00 * b20 + a10 * b21 + a20 * b22) * aZ,
                tLocalMatrix[9] = (a01 * b20 + a11 * b21 + a21 * b22) * aZ,
                tLocalMatrix[10] = (a02 * b20 + a12 * b21 + a22 * b22) * aZ,
                tLocalMatrix[11] = tLocalMatrix[11] * aZ
        }
        this.modelMatrix = this.localMatrix
        {
            {
                let tNMatrix = this.normalModelMatrix;
                let tMVMatrix = this.modelMatrix;
                a00 = tMVMatrix[0], a01 = tMVMatrix[1], a02 = tMVMatrix[2], a03 = tMVMatrix[3],
                    a10 = tMVMatrix[4], a11 = tMVMatrix[5], a12 = tMVMatrix[6], a13 = tMVMatrix[7],
                    a20 = tMVMatrix[8], a21 = tMVMatrix[9], a22 = tMVMatrix[10], a23 = tMVMatrix[11],
                    a31 = tMVMatrix[12], a32 = tMVMatrix[13], a33 = tMVMatrix[14], b0 = tMVMatrix[15],
                    a30 = a00 * a11 - a01 * a10,
                    b1 = a00 * a12 - a02 * a10, b2 = a00 * a13 - a03 * a10, b3 = a01 * a12 - a02 * a11,
                    b00 = a01 * a13 - a03 * a11, b01 = a02 * a13 - a03 * a12, b02 = a20 * a32 - a21 * a31,
                    b10 = a20 * a33 - a22 * a31, b11 = a20 * b0 - a23 * a31, a21 * a33 - a22 * a32,
                    b20 = a21 * b0 - a23 * a32, b12 = a22 * b0 - a23 * a33, b22 = a30 * b12 - b1 * b20 + b2 * b12 + b3 * b11 - b00 * b10 + b01 * b02,
                    b22 = 1 / b22,
                    tNMatrix[0] = (a11 * b12 - a12 * b20 + a13 * b12) * b22,
                    tNMatrix[4] = (-a01 * b12 + a02 * b20 - a03 * b12) * b22,
                    tNMatrix[8] = (a32 * b01 - a33 * b00 + b0 * b3) * b22,
                    tNMatrix[12] = (-a21 * b01 + a22 * b00 - a23 * b3) * b22,
                    tNMatrix[1] = (-a10 * b12 + a12 * b11 - a13 * b10) * b22,
                    tNMatrix[5] = (a00 * b12 - a02 * b11 + a03 * b10) * b22,
                    tNMatrix[9] = (-a31 * b01 + a33 * b2 - b0 * b1) * b22,
                    tNMatrix[13] = (a20 * b01 - a22 * b2 + a23 * b1) * b22,
                    tNMatrix[2] = (a10 * b20 - a11 * b11 + a13 * b02) * b22,
                    tNMatrix[6] = (-a00 * b20 + a01 * b11 - a03 * b02) * b22,
                    tNMatrix[10] = (a31 * b00 - a32 * b2 + b0 * a30) * b22,
                    tNMatrix[14] = (-a20 * b00 + a21 * b2 - a23 * a30) * b22,
                    tNMatrix[3] = (-a10 * b12 + a11 * b10 - a12 * b02) * b22,
                    tNMatrix[7] = (a00 * b12 - a01 * b10 + a02 * b02) * b22,
                    tNMatrix[11] = (-a31 * b3 + a32 * b1 - a33 * a30) * b22,
                    tNMatrix[15] = (a20 * b3 - a21 * b1 + a22 * a30) * b22;
            }
        }
        if (this.#instancingMesh.gpuRenderInfo) {
            const {vertexUniformBuffer, vertexUniformInfo} = this.#instancingMesh.gpuRenderInfo
            const dateByLocation = vertexUniformInfo.members.instanceModelMatrixs
            const dateByLocation2 = vertexUniformInfo.members.instanceNormalModelMatrix
            const dateByLocation3 = vertexUniformInfo.members.instanceOpacity
            //TODO 이걸한방에 해봐야할듯
            this.#redGPUContext.gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                dateByLocation.uniformOffset + dateByLocation.stride * this.#location,
                new dateByLocation.View(this.modelMatrix)
            )
            this.#redGPUContext.gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                dateByLocation2.uniformOffset + dateByLocation2.stride * this.#location,
                new dateByLocation2.View(this.normalModelMatrix),
            )
            this.#redGPUContext.gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                dateByLocation3.uniformOffset + dateByLocation3.stride * this.#location,
                new dateByLocation3.View([this.opacity]),
            )
        }
    }
}

export default InstancingMeshObject3D
