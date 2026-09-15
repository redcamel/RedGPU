import { mat4 } from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import InstancingMesh from "../InstancingMesh";
/**
 * [KO] 인스턴싱된 메시의 개별 인스턴스를 제어하기 위한 클래스입니다.
 * [EN] Class for controlling individual instances of an instanced mesh.
 *
 * [KO] InstancingMesh 내에서 특정 단일 인스턴스의 위치, 회전, 스케일 및 불투명도(Opacity)와 같은 개별적인 트랜스폼 상태를 관리하고, 인스턴스의 모델 행렬을 업데이트하여 GPU Storage Buffer에 동적으로 반영합니다.
 * [EN] Manages the individual transform states, such as position, rotation, scale, and opacity of a single instance within an InstancingMesh, updating and writing its model matrix dynamically to the GPU Storage Buffer.
 *
 * @category Mesh
 */
declare class InstancingMeshObject3D {
    #private;
    /**
     * [KO] 인스턴스의 모델 행렬 (Model Matrix)
     * [EN] Model matrix of the instance
     */
    modelMatrix: mat4;
    /**
     * [KO] 인스턴스의 로컬 행렬 (Local Matrix)
     * [EN] Local matrix of the instance
     */
    localMatrix: mat4;
    /**
     * [KO] 인스턴스의 노말 모델 행렬 (Normal Model Matrix)
     * [EN] Normal model matrix of the instance
     */
    normalModelMatrix: mat4;
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
    constructor(redGPUContext: RedGPUContext, location: number, instancingMesh: InstancingMesh);
    /**
     * [KO] 인스턴스의 불투명도(Opacity) 값을 가져오거나 설정합니다. 허용 범위는 0.0에서 1.0 사이입니다.
     * [EN] Gets or sets the opacity of the instance. The allowed range is from 0.0 to 1.0.
     */
    get opacity(): number;
    set opacity(value: number);
    /**
     * [KO] 인스턴스의 X축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis position of the instance.
     */
    get x(): number;
    set x(value: number);
    /**
     * [KO] 인스턴스의 Y축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis position of the instance.
     */
    get y(): number;
    set y(value: number);
    /**
     * [KO] 인스턴스의 Z축 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis position of the instance.
     */
    get z(): number;
    set z(value: number);
    /**
     * [KO] 인스턴스의 X, Y, Z 위치 배열 [x, y, z]을 가져오거나, 모든 축의 위치를 단일 값으로 동일하게 설정합니다.
     * [EN] Gets the position array [x, y, z] of the instance, or sets the position on all axes to the same single value.
     */
    get position(): number[];
    set position(value: number);
    /**
     * [KO] 인스턴스의 X축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis scale of the instance.
     */
    get scaleX(): number;
    set scaleX(value: number);
    /**
     * [KO] 인스턴스의 Y축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis scale of the instance.
     */
    get scaleY(): number;
    set scaleY(value: number);
    /**
     * [KO] 인스턴스의 Z축 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis scale of the instance.
     */
    get scaleZ(): number;
    set scaleZ(value: number);
    /**
     * [KO] 인스턴스의 스케일 [scaleX, scaleY, scaleZ] 배열을 가져오거나, 모든 축의 스케일을 단일 값으로 일괄 설정합니다.
     * [EN] Gets the scale array [scaleX, scaleY, scaleZ] of the instance, or sets the scale on all axes to the same single value.
     */
    get scale(): number[];
    set scale(value: number);
    /**
     * [KO] 인스턴스의 X축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the X-axis of the instance.
     */
    get rotationX(): number;
    set rotationX(value: number);
    /**
     * [KO] 인스턴스의 Y축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the Y-axis of the instance.
     */
    get rotationY(): number;
    set rotationY(value: number);
    /**
     * [KO] 인스턴스의 Z축 회전각(Degree)을 가져오거나 설정합니다.
     * [EN] Gets or sets the rotation angle (in degrees) around the Z-axis of the instance.
     */
    get rotationZ(): number;
    set rotationZ(value: number);
    /**
     * [KO] 인스턴스의 회전각 [rotationX, rotationY, rotationZ] 배열을 가져오거나, 모든 축의 회전각을 단일 값으로 일괄 설정합니다.
     * [EN] Gets the rotation array [rotationX, rotationY, rotationZ] of the instance, or sets the rotation on all axes to the same single value.
     */
    get rotation(): number[];
    set rotation(value: number);
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
    setScale(x: number, y?: number, z?: number): void;
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
    setPosition(x: number, y?: number, z?: number): void;
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
    setRotation(rotationX: number, rotationY?: number, rotationZ?: number): void;
    destroy(): void;
}
export default InstancingMeshObject3D;
