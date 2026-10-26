import { mat4 } from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import InstancingMesh from "../InstancingMesh";
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
declare class InstancingMeshObject3D {
    #private;
    /**
     * [KO] 인스턴스의 모델 행렬
     * [EN] Model matrix of the instance
     */
    modelMatrix: mat4;
    /**
     * [KO] 인스턴스의 로컬 행렬
     * [EN] Local matrix of the instance
     */
    localMatrix: mat4;
    /**
     * [KO] 인스턴스의 노말 모델 행렬
     * [EN] Normal model matrix of the instance
     */
    normalModelMatrix: mat4;
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
    constructor(redGPUContext: RedGPUContext, location: number, instancingMesh: InstancingMesh);
    /**
     * [KO] 인스턴스의 불투명도(0.0 ~ 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the opacity (0.0 to 1.0) of the instance.
     *
     * @returns
     * [KO] 불투명도 값
     * [EN] Opacity value
     */
    get opacity(): number;
    set opacity(value: number);
    /**
     * [KO] 인스턴스의 X축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis position of the instance.
     *
     * @returns
     * [KO] X축 좌표
     * [EN] X-axis coordinate
     */
    get x(): number;
    set x(value: number);
    /**
     * [KO] 인스턴스의 Y축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis position of the instance.
     *
     * @returns
     * [KO] Y축 좌표
     * [EN] Y-axis coordinate
     */
    get y(): number;
    set y(value: number);
    /**
     * [KO] 인스턴스의 Z축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis position of the instance.
     *
     * @returns
     * [KO] Z축 좌표
     * [EN] Z-axis coordinate
     */
    get z(): number;
    set z(value: number);
    /**
     * [KO] 인스턴스의 위치 배열(`[x, y, z]`)을 가져오거나 모든 축의 위치를 단일 값으로 설정합니다.
     * [EN] Gets the position array (`[x, y, z]`) of the instance or sets all axes to a single value.
     *
     * @returns
     * [KO] 위치 배열 (`[x, y, z]`)
     * [EN] Position array (`[x, y, z]`)
     */
    get position(): number[];
    set position(value: number);
    /**
     * [KO] 인스턴스의 X축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis scale of the instance.
     *
     * @returns
     * [KO] X축 스케일
     * [EN] X-axis scale
     */
    get scaleX(): number;
    set scaleX(value: number);
    /**
     * [KO] 인스턴스의 Y축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis scale of the instance.
     *
     * @returns
     * [KO] Y축 스케일
     * [EN] Y-axis scale
     */
    get scaleY(): number;
    set scaleY(value: number);
    /**
     * [KO] 인스턴스의 Z축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis scale of the instance.
     *
     * @returns
     * [KO] Z축 스케일
     * [EN] Z-axis scale
     */
    get scaleZ(): number;
    set scaleZ(value: number);
    /**
     * [KO] 인스턴스의 스케일 배열(`[scaleX, scaleY, scaleZ]`)을 가져오거나 모든 축의 스케일을 단일 값으로 설정합니다.
     * [EN] Gets the scale array (`[scaleX, scaleY, scaleZ]`) of the instance or sets all axes to a single value.
     *
     * @returns
     * [KO] 스케일 배열 (`[scaleX, scaleY, scaleZ]`)
     * [EN] Scale array (`[scaleX, scaleY, scaleZ]`)
     */
    get scale(): number[];
    set scale(value: number);
    /**
     * [KO] 인스턴스의 X축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis rotation angle (in degrees) of the instance.
     *
     * @returns
     * [KO] X축 회전각 (도)
     * [EN] X-axis rotation angle (in degrees)
     */
    get rotationX(): number;
    set rotationX(value: number);
    /**
     * [KO] 인스턴스의 Y축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis rotation angle (in degrees) of the instance.
     *
     * @returns
     * [KO] Y축 회전각 (도)
     * [EN] Y-axis rotation angle (in degrees)
     */
    get rotationY(): number;
    set rotationY(value: number);
    /**
     * [KO] 인스턴스의 Z축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis rotation angle (in degrees) of the instance.
     *
     * @returns
     * [KO] Z축 회전각 (도)
     * [EN] Z-axis rotation angle (in degrees)
     */
    get rotationZ(): number;
    set rotationZ(value: number);
    /**
     * [KO] 인스턴스의 회전각 배열(`[rotationX, rotationY, rotationZ]`)을 가져오거나 모든 축의 회전각을 단일 값으로 설정합니다.
     * [EN] Gets the rotation angle array (`[rotationX, rotationY, rotationZ]`) of the instance or sets all axes to a single value.
     *
     * @returns
     * [KO] 회전각 배열 (`[rotationX, rotationY, rotationZ]`)
     * [EN] Rotation angle array (`[rotationX, rotationY, rotationZ]`)
     */
    get rotation(): number[];
    set rotation(value: number);
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
    setScale(x: number, y?: number, z?: number): void;
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
    setPosition(x: number, y?: number, z?: number): void;
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
    setRotation(rotationX: number, rotationY?: number, rotationZ?: number): void;
    /**
     * [KO] 인스턴스 내부 참조를 해제합니다.
     * [EN] Releases internal references of the instance.
     */
    destroy(): void;
}
export default InstancingMeshObject3D;
