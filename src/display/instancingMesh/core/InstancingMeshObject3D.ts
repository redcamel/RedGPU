import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import InstancingMesh from "../InstancingMesh";

const CPI = 3.141592653589793,
    CPI2 = 6.283185307179586,
    C225 = 0.225,
    C127 = 1.27323954,
    C045 = 0.405284735,
    C157 = 1.5707963267948966;

const TO_RADIANS = Math.PI / 180;

/**
 * [KO] 인스턴싱된 메시의 개별 인스턴스 트랜스폼 및 불투명도를 제어하는 클래스입니다.
 * [EN] Class that controls the transform and opacity of an individual instance in an instanced mesh.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const instance = instancingMesh.instanceChildren[0];
 * instance.setPosition(10, 0, 0);
 * ```
 *
 * @category Mesh
 */
class InstancingMeshObject3D {
    /**
     * [KO] 인스턴스의 모델 행렬
     * [EN] Model matrix of the instance
     */
    modelMatrix = mat4.create()
    /**
     * [KO] 인스턴스의 로컬 행렬
     * [EN] Local matrix of the instance
     */
    localMatrix = mat4.create()
    /**
     * [KO] 인스턴스의 노말 모델 행렬
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
     * [EN] Creates an InstancingMeshObject3D instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param location -
     * [KO] 인스턴싱 메시 내의 인덱스 위치
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
     * [KO] 인스턴스의 불투명도(0.0 ~ 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the opacity (0.0 to 1.0) of the instance.
     *
     * @returns
     * [KO] 불투명도 값
     * [EN] Opacity value
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
     *
     * @returns
     * [KO] X축 좌표
     * [EN] X-axis coordinate
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
     *
     * @returns
     * [KO] Y축 좌표
     * [EN] Y-axis coordinate
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
     *
     * @returns
     * [KO] Z축 좌표
     * [EN] Z-axis coordinate
     */
    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        this.#z = this.#positionArray[2] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 위치 배열(`[x, y, z]`)을 가져오거나 모든 축의 위치를 단일 값으로 설정합니다.
     * [EN] Gets the position array (`[x, y, z]`) of the instance or sets all axes to a single value.
     *
     * @returns
     * [KO] 위치 배열 (`[x, y, z]`)
     * [EN] Position array (`[x, y, z]`)
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
     *
     * @returns
     * [KO] X축 스케일
     * [EN] X-axis scale
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
     *
     * @returns
     * [KO] Y축 스케일
     * [EN] Y-axis scale
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
     *
     * @returns
     * [KO] Z축 스케일
     * [EN] Z-axis scale
     */
    get scaleZ(): number {
        return this.#scaleZ;
    }

    set scaleZ(value: number) {
        this.#scaleZ = this.#scaleArray[2] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 스케일 배열(`[scaleX, scaleY, scaleZ]`)을 가져오거나 모든 축의 스케일을 단일 값으로 설정합니다.
     * [EN] Gets the scale array (`[scaleX, scaleY, scaleZ]`) of the instance or sets all axes to a single value.
     *
     * @returns
     * [KO] 스케일 배열 (`[scaleX, scaleY, scaleZ]`)
     * [EN] Scale array (`[scaleX, scaleY, scaleZ]`)
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
     * [KO] 인스턴스의 X축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis rotation angle (in degrees) of the instance.
     *
     * @returns
     * [KO] X축 회전각 (도)
     * [EN] X-axis rotation angle (in degrees)
     */
    get rotationX(): number {
        return this.#rotationX;
    }

    set rotationX(value: number) {
        this.#rotationX = this.#rotationArray[0] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 Y축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis rotation angle (in degrees) of the instance.
     *
     * @returns
     * [KO] Y축 회전각 (도)
     * [EN] Y-axis rotation angle (in degrees)
     */
    get rotationY(): number {
        return this.#rotationY;
    }

    set rotationY(value: number) {
        this.#rotationY = this.#rotationArray[1] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 Z축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis rotation angle (in degrees) of the instance.
     *
     * @returns
     * [KO] Z축 회전각 (도)
     * [EN] Z-axis rotation angle (in degrees)
     */
    get rotationZ(): number {
        return this.#rotationZ;
    }

    set rotationZ(value: number) {
        this.#rotationZ = this.#rotationArray[2] = value;
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 회전각 배열(`[rotationX, rotationY, rotationZ]`)을 가져오거나 모든 축의 회전각을 단일 값으로 설정합니다.
     * [EN] Gets the rotation angle array (`[rotationX, rotationY, rotationZ]`) of the instance or sets all axes to a single value.
     *
     * @returns
     * [KO] 회전각 배열 (`[rotationX, rotationY, rotationZ]`)
     * [EN] Rotation angle array (`[rotationX, rotationY, rotationZ]`)
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
     * [KO] 인스턴스의 X, Y, Z축 스케일을 설정합니다. `y`, `z` 생략 시 `x`와 동일한 값으로 설정됩니다.
     * [EN] Sets the X, Y, and Z-axis scale of the instance. If `y` and `z` are omitted, they default to `x`.
     *
     * ### Example
     * ```typescript
     * instance.setScale(2, 2, 2);
     * ```
     *
     * @param x -
     * [KO] X축 스케일
     * [EN] X-axis scale
     * @param y -
     * [KO] Y축 스케일 (선택, 기본값: `x`)
     * [EN] Y-axis scale (optional, default: `x`)
     * @param z -
     * [KO] Z축 스케일 (선택, 기본값: `x`)
     * [EN] Z-axis scale (optional, default: `x`)
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
     * [KO] 인스턴스의 X, Y, Z축 위치를 설정합니다. `y`, `z` 생략 시 `x`와 동일한 값으로 설정됩니다.
     * [EN] Sets the X, Y, and Z-axis position of the instance. If `y` and `z` are omitted, they default to `x`.
     *
     * ### Example
     * ```typescript
     * instance.setPosition(10, 20, 30);
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
        this.#updateMatrix()
    }

    /**
     * [KO] 인스턴스의 X, Y, Z축 회전각(도)을 설정합니다. `rotationY`, `rotationZ` 생략 시 `rotationX`와 동일한 값으로 설정됩니다.
     * [EN] Sets the X, Y, and Z-axis rotation angles (in degrees) of the instance. If `rotationY` and `rotationZ` are omitted, they default to `rotationX`.
     *
     * ### Example
     * ```typescript
     * instance.setRotation(45, 90, 0);
     * ```
     *
     * @param rotationX -
     * [KO] X축 회전각 (도)
     * [EN] X-axis rotation angle (in degrees)
     * @param rotationY -
     * [KO] Y축 회전각 (도, 선택, 기본값: `rotationX`)
     * [EN] Y-axis rotation angle (in degrees, optional, default: `rotationX`)
     * @param rotationZ -
     * [KO] Z축 회전각 (도, 선택, 기본값: `rotationX`)
     * [EN] Z-axis rotation angle (in degrees, optional, default: `rotationX`)
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

    /**
     * [KO] 인스턴스 내부 참조를 해제합니다.
     * [EN] Releases internal references of the instance.
     */
    destroy() {
        this.#instancingMesh = null;
        this.#redGPUContext = null;
    }

    #updateMatrix() {
        let aSx, aSy, aSz, aCx, aCy, aCz, aX, aY, aZ,
            a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33,
            b0, b1, b2, b3,
            b00, b01, b02, b10, b11, b12, b20, b21, b22;
        {
            const tLocalMatrix = this.localMatrix;
            let tRadian;
            a00 = 1, a01 = 0, a02 = 0,
                a10 = 0, a11 = 1, a12 = 0,
                a20 = 0, a21 = 0, a22 = 1,
                tLocalMatrix[12] = this.#x ,
                tLocalMatrix[13] = this.#y ,
                tLocalMatrix[14] = this.#z ,
                tLocalMatrix[15] = 1 ,
                aX = this.#rotationX * TO_RADIANS;
            aY = this.#rotationY * TO_RADIANS, aZ = this.#rotationZ * TO_RADIANS;
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
