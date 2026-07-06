import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import InstancingMesh from "../InstancingMesh";

/**
 * Math constants used for optimized matrix calculations.
 */
const CPI = 3.141592653589793,
    CPI2 = 6.283185307179586,
    C225 = 0.225,
    C127 = 1.27323954,
    C045 = 0.405284735,
    C157 = 1.5707963267948966;

/**
 * Conversions factor from degrees to radians.
 */
const TO_RADIANS = Math.PI / 180;

/**
 * [KO] 인스턴싱된 메시의 개별 인스턴스를 제어하기 위한 클래스입니다.
 * [EN] Class for controlling individual instances of an instanced mesh.
 *
 * [KO] InstancingMesh 내에서 특정 단일 인스턴스의 위치, 회전, 스케일 및 불투명도(Opacity)와 같은 개별적인 트랜스폼 상태를 관리하고, 인스턴스의 모델 행렬을 업데이트하여 GPU Storage Buffer에 동적으로 반영합니다.
 * [EN] Manages the individual transform states, such as position, rotation, scale, and opacity of a single instance within an InstancingMesh, updating and writing its model matrix dynamically to the GPU Storage Buffer.
 *
 * @category Mesh
 */
class InstancingMeshObject3D {
    /**
     * [KO] 인스턴스의 모델 행렬 (Model Matrix)
     * [EN] Model matrix of the instance
     */
    modelMatrix = mat4.create()
    /**
     * [KO] 인스턴스의 로컬 행렬 (Local Matrix)
     * [EN] Local matrix of the instance
     */
    localMatrix = mat4.create()
    /**
     * [KO] 인스턴스의 노말 모델 행렬 (Normal Model Matrix)
     * [EN] Normal model matrix of the instance
     */
    normalModelMatrix = mat4.create()

    #x: number = 0
    #z: number = 0
    #y: number = 0
    #positionArray: number[] = [0, 0, 0]

    #scaleX: number = 1
    #scaleY: number = 1
    #scaleZ: number = 1
    #scaleArray: number[] = [1, 1, 1]

    #rotationX: number = 0
    #rotationY: number = 0
    #rotationZ: number = 0
    #rotationArray: number[] = [0, 0, 0]

    readonly #location: number = 0
    #instancingMesh: InstancingMesh
    #redGPUContext: RedGPUContext
    #opacity: number = 1

    /**
     * [KO] InstancingMeshObject3D 인스턴스를 생성합니다.
     * [EN] Creates an instance of InstancingMeshObject3D.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param location -
     * [KO] 인스턴싱 메시 내에서의 인덱스 위치
     * [EN] Index location within the instanced mesh
     * @param instancingMesh -
     * [KO] 부모 InstancingMesh 객체
     * [EN] Parent InstancingMesh object
     */
    constructor(redGPUContext: RedGPUContext, location: number, instancingMesh: InstancingMesh) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.#instancingMesh = instancingMesh
        this.#location = location
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 불투명도(Opacity) 값을 가져오거나 설정합니다. 허용 범위는 0.0에서 1.0 사이입니다.
     * [EN] Gets or sets the opacity of the instance. The allowed range is from 0.0 to 1.0.
     */
    get opacity(): number {
        return this.#opacity;
    }

    set opacity(value: number) {
        validatePositiveNumberRange(value, 0, 1)
        this.#opacity = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 X축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis position of the instance.
     */
    get x(): number {
        return this.#x;
    }

    set x(value: number) {
        this.#x = this.#positionArray[0] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 Y축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis position of the instance.
     */
    get y(): number {
        return this.#y;
    }

    set y(value: number) {
        this.#y = this.#positionArray[1] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 Z축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis position of the instance.
     */
    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        this.#z = this.#positionArray[2] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 X, Y, Z 위치 배열 [x, y, z]을 가져오거나, 모든 축의 위치를 단일 값으로 동일하게 설정합니다.
     * [EN] Gets the position array [x, y, z] of the instance, or sets the position on all axes to the same single value.
     */
    get position(): number[] {
        return this.#positionArray;
    }

    set position(value: number) {
        this.#x = this.#positionArray[0] = value
        this.#y = this.#positionArray[1] = value
        this.#z = this.#positionArray[2] = value
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 X축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis scale of the instance.
     */
    get scaleX(): number {
        return this.#scaleX;
    }

    set scaleX(value: number) {
        this.#scaleX = this.#scaleArray[0] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 Y축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis scale of the instance.
     */
    get scaleY(): number {
        return this.#scaleY;
    }

    set scaleY(value: number) {
        this.#scaleY = this.#scaleArray[1] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 Z축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis scale of the instance.
     */
    get scaleZ(): number {
        return this.#scaleZ;
    }

    set scaleZ(value: number) {
        this.#scaleZ = this.#scaleArray[2] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 스케일 [scaleX, scaleY, scaleZ] 배열을 가져오거나, 모든 축의 스케일을 단일 값으로 일괄 설정합니다.
     * [EN] Gets the scale array [scaleX, scaleY, scaleZ] of the instance, or sets the scale on all axes to the same single value.
     */
    get scale(): number[] {
        return this.#scaleArray;
    }

    set scale(value: number) {
        this.#scaleX = this.#scaleArray[0] = value
        this.#scaleY = this.#scaleArray[1] = value
        this.#scaleZ = this.#scaleArray[2] = value
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 X축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the X-axis of the instance.
     */
    get rotationX(): number {
        return this.#rotationX;
    }

    set rotationX(value: number) {
        this.#rotationX = this.#rotationArray[0] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 Y축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the Y-axis of the instance.
     */
    get rotationY(): number {
        return this.#rotationY;
    }

    set rotationY(value: number) {
        this.#rotationY = this.#rotationArray[1] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 Z축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the Z-axis of the instance.
     */
    get rotationZ(): number {
        return this.#rotationZ;
    }

    set rotationZ(value: number) {
        this.#rotationZ = this.#rotationArray[2] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 회전각 [rotationX, rotationY, rotationZ] 배열을 가져오거나, 모든 축의 회전각을 단일 값으로 일괄 설정합니다.
     * [EN] Gets the rotation array [rotationX, rotationY, rotationZ] of the instance, or sets the rotation on all axes to the same single value.
     */
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
     * [KO] 인스턴스의 X, Y, Z축 스케일을 설정합니다. Y와 Z를 입력하지 않은 경우, X값과 동일하게 통일되어 적용됩니다.
     * [EN] Sets the scale of the object along the X, Y, and Z axes. If Y and Z are omitted, they default to the value of X (globalStruct scaling).
     * @param x -
     * [KO] X축 스케일 값
     * [EN] Scale factor along the X-axis
     * @param y -
     * [KO] Y축 스케일 값 (선택, 기본값: x)
     * [EN] Scale factor along the Y-axis (optional, default: x)
     * @param z -
     * [KO] Z축 스케일 값 (선택, 기본값: x)
     * [EN] Scale factor along the Z-axis (optional, default: x)
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
     * [KO] 인스턴스의 X, Y, Z축 위치를 설정합니다. Y와 Z를 입력하지 않은 경우, X값과 동일하게 설정됩니다.
     * [EN] Sets the position of the object along the X, Y, and Z axes. If Y and Z are omitted, they default to the value of X.
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
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 X, Y, Z축 회전각(Degree)을 설정합니다. Y와 Z를 입력하지 않은 경우, X값과 동일하게 설정됩니다.
     * [EN] Sets the rotation of the object around the X, Y, and Z axes in degrees. If Y and Z are omitted, they default to the value of X.
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
        this.#updateMatrix()
    }

    #updateMatrix() {
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
                b00 = aCy * aCz;
            b01 = aCx * aSz + aSx * aSy * aCz;
            b02 = aSx * aSz - aCx * aSy * aCz;

            b10 = -aCy * aSz;
            b11 = aCx * aCz - aSx * aSy * aSz;
            b12 = aSx * aCz + aCx * aSy * aSz;

            b20 = aSy;
            b21 = -aSx * aCy;
            b22 = aCx * aCy;
            let sX = this.#scaleX, sY = this.#scaleY, sZ = this.#scaleZ;

            tLocalMatrix[0] = b00 * sX;
            tLocalMatrix[1] = b01 * sX;
            tLocalMatrix[2] = b02 * sX;
            tLocalMatrix[3] = 0;

            tLocalMatrix[4] = b10 * sY;
            tLocalMatrix[5] = b11 * sY;
            tLocalMatrix[6] = b12 * sY;
            tLocalMatrix[7] = 0;

            tLocalMatrix[8] = b20 * sZ;
            tLocalMatrix[9] = b21 * sZ;
            tLocalMatrix[10] = b22 * sZ;
            tLocalMatrix[11] = 0;
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
            const {dataViewF32} = vertexUniformBuffer
            const {members} = vertexUniformInfo
            const dateByLocation = members.instanceModelMatrixs
            const dateByLocation2 = members.instanceNormalModelMatrix
            const dateByLocation3 = members.instanceOpacity
            dataViewF32.set(this.modelMatrix, (dateByLocation.uniformOffset + dateByLocation.stride * this.#location) / 4)
            dataViewF32.set(this.normalModelMatrix, (dateByLocation2.uniformOffset + dateByLocation2.stride * this.#location) / 4)
            dataViewF32.set([this.opacity], (dateByLocation3.uniformOffset + dateByLocation3.stride * this.#location) / 4)
            this.#instancingMesh.dirtyInstanceMeshObject3D = true
        }
    }
}

Object.freeze(InstancingMeshObject3D)
export default InstancingMeshObject3D
