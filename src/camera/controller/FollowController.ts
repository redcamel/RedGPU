import {mat4, vec3} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import updateObject3DMatrix from "../../math/updateObject3DMatrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import AController from "../core/AController";

const PER_PI = Math.PI / 180;
const TEMP_MAT4 = mat4.create();
const TEMP_VEC3 = vec3.create();
const DUMMY_VIEW = {pixelRectObject: {height: 1}} as unknown as View3D;

/**
 * [KO] 지정된 타겟 메시(Mesh)의 이동과 회전을 부드럽게 추적하는 3인칭 시점 카메라 컨트롤러 클래스입니다.
 * [EN] Third-person camera controller class that smoothly tracks the movement and rotation of a specified target `Mesh`.
 *
 * ### Example
 * ```typescript
 * const controller = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
 * controller.distance = 15;
 * controller.height = 8;
 * controller.pan = 45;
 * controller.tilt = 30;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/controller/followController/" style="width:100%; height:500px;"></iframe>
 * @see [FollowController example](/RedGPU/examples/3d/controller/followController/)
 * @category Controller
 */
class FollowController extends AController {
    #currentDistance: number = 5;
    #targetDistance: number = 5;
    #distanceInterpolation: number = 0.02;

    #currentHeight: number = 1;
    #targetHeight: number = 1;
    #heightInterpolation: number = 0.02;

    #interpolation: number = 0.02;

    #currentPan: number = 0;
    #targetPan: number = 0;
    #panInterpolation: number = 0.02;

    #currentTilt: number = 15;
    #targetTilt: number = 15;
    #tiltInterpolation: number = 0.02;

    #isFollowingTargetRotation: boolean = true;
    #targetOffsetX: number = 0;
    #targetOffsetY: number = 0;
    #targetOffsetZ: number = 0;
    #targetMesh: Mesh;
    #currentPosition = vec3.create();
    #cameraPosition = vec3.create();
    #lookAtTargetPosition = vec3.create();

    /**
     * [KO] FollowController 인스턴스를 생성합니다.
     * [EN] Creates a FollowController instance.
     *
     * ### Example
     * ```typescript
     * const controller = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param targetMesh -
     * [KO] 추적할 대상 `Mesh` 인스턴스
     * [EN] Target `Mesh` instance to follow
     */
    constructor(redGPUContext: RedGPUContext, targetMesh: Mesh) {
        super(redGPUContext, {
            HD_Wheel: (e: WheelEvent) => {
                this.#targetDistance += e.deltaY / 100;
                if (this.#targetDistance < 0.1) this.#targetDistance = 0.1;
            },
            HD_TouchPinch: (deltaScale: number) => {
                const scaleChange = (deltaScale - 1);
                this.#targetDistance -= scaleChange * this.#targetDistance;
                if (this.#targetDistance < 0.1) this.#targetDistance = 0.1;
            },
        });
        this.targetMesh = targetMesh || new Mesh(redGPUContext);
        this.#targetMesh.setIgnoreFrustumCullingRecursively(true);
    }

    /**
     * [KO] 타겟 메시로부터 카메라까지의 목표 거리를 가져오거나 설정합니다. (`0.1` 이상)
     * [EN] Gets or sets the target distance from the target mesh to the camera. (`0.1` or greater)
     *
     * @returns
     * [KO] 목표 거리 (기본값: `5`)
     * [EN] Target distance (default: `5`)
     */
    get distance(): number {
        return this.#targetDistance;
    }

    set distance(value: number) {
        validateNumberRange(value, 0.1);
        this.#targetDistance = value;
    }

    /**
     * [KO] 거리 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for distance changes. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 거리 보간 계수 (기본값: `0.02`)
     * [EN] Distance interpolation factor (default: `0.02`)
     */
    get distanceInterpolation(): number {
        return this.#distanceInterpolation;
    }

    set distanceInterpolation(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#distanceInterpolation = value;
    }

    /**
     * [KO] 타겟 메시로부터 카메라까지의 목표 높이를 가져오거나 설정합니다.
     * [EN] Gets or sets the target height of the camera from the target mesh.
     *
     * @returns
     * [KO] 목표 높이 (기본값: `1`)
     * [EN] Target height (default: `1`)
     */
    get height(): number {
        return this.#targetHeight;
    }

    set height(value: number) {
        validateNumber(value);
        this.#targetHeight = value;
    }

    /**
     * [KO] 높이 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for height changes. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 높이 보간 계수 (기본값: `0.02`)
     * [EN] Height interpolation factor (default: `0.02`)
     */
    get heightInterpolation(): number {
        return this.#heightInterpolation;
    }

    set heightInterpolation(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#heightInterpolation = value;
    }

    /**
     * [KO] 타겟을 중심으로 한 카메라의 수평 회전(Pan) 목표 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's target horizontal rotation (Pan) angle around the target. (Unit: degrees)
     *
     * @returns
     * [KO] 팬 각도 (기본값: `0`)
     * [EN] Pan angle (default: `0`)
     */
    get pan(): number {
        return this.#targetPan;
    }

    set pan(value: number) {
        validateNumber(value);
        this.#targetPan = value;
    }

    /**
     * [KO] 팬(Pan) 회전의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for pan rotation. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 팬 보간 계수 (기본값: `0.02`)
     * [EN] Pan interpolation factor (default: `0.02`)
     */
    get panInterpolation(): number {
        return this.#panInterpolation;
    }

    set panInterpolation(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#panInterpolation = value;
    }

    /**
     * [KO] 타겟을 중심으로 한 카메라의 수직 회전(Tilt) 목표 각도를 가져오거나 설정합니다. (단위: 도, 범위: `-89` ~ `89`)
     * [EN] Gets or sets the camera's target vertical rotation (Tilt) angle around the target. (Unit: degrees, Range: `-89` ~ `89`)
     *
     * @returns
     * [KO] 틸트 각도 (기본값: `15`)
     * [EN] Tilt angle (default: `15`)
     */
    get tilt(): number {
        return this.#targetTilt;
    }

    set tilt(value: number) {
        validateNumber(value);
        this.#targetTilt = Math.max(-89, Math.min(89, value));
    }

    /**
     * [KO] 틸트(Tilt) 회전의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for tilt rotation. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 틸트 보간 계수 (기본값: `0.02`)
     * [EN] Tilt interpolation factor (default: `0.02`)
     */
    get tiltInterpolation(): number {
        return this.#tiltInterpolation;
    }

    set tiltInterpolation(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#tiltInterpolation = value;
    }

    /**
     * [KO] 카메라 위치 추적의 전체 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the overall damping interpolation factor for camera position tracking. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 위치 보간 계수 (기본값: `0.02`)
     * [EN] Position interpolation factor (default: `0.02`)
     */
    get interpolation(): number {
        return this.#interpolation;
    }

    set interpolation(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#interpolation = value;
    }

    /**
     * [KO] 타겟 메시의 회전을 따라 카메라 공전 기준축을 회전시킬지 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether to rotate the camera's orbital reference axes along with the target mesh's rotation.
     *
     * @returns
     * [KO] 타겟 회전 추적 여부 (기본값: `true`)
     * [EN] Whether target rotation tracking is enabled (default: `true`)
     */
    get followTargetRotation(): boolean {
        return this.#isFollowingTargetRotation;
    }

    set followTargetRotation(value: boolean) {
        this.#isFollowingTargetRotation = value;
    }

    /**
     * [KO] 카메라가 바라보는 타겟 지점의 X축 오프셋을 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis offset of the target point the camera looks at.
     *
     * @returns
     * [KO] X축 오프셋 (기본값: `0`)
     * [EN] X-axis offset (default: `0`)
     */
    get targetOffsetX(): number {
        return this.#targetOffsetX;
    }

    set targetOffsetX(value: number) {
        validateNumber(value);
        this.#targetOffsetX = value;
    }

    /**
     * [KO] 카메라가 바라보는 타겟 지점의 Y축 오프셋을 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis offset of the target point the camera looks at.
     *
     * @returns
     * [KO] Y축 오프셋 (기본값: `0`)
     * [EN] Y-axis offset (default: `0`)
     */
    get targetOffsetY(): number {
        return this.#targetOffsetY;
    }

    set targetOffsetY(value: number) {
        validateNumber(value);
        this.#targetOffsetY = value;
    }

    /**
     * [KO] 카메라가 바라보는 타겟 지점의 Z축 오프셋을 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis offset of the target point the camera looks at.
     *
     * @returns
     * [KO] Z축 오프셋 (기본값: `0`)
     * [EN] Z-axis offset (default: `0`)
     */
    get targetOffsetZ(): number {
        return this.#targetOffsetZ;
    }

    set targetOffsetZ(value: number) {
        validateNumber(value);
        this.#targetOffsetZ = value;
    }

    /**
     * [KO] 현재 추적 중인 타겟 메시를 가져오거나 설정합니다.
     * [EN] Gets or sets the target mesh currently being followed.
     *
     * @returns
     * [KO] 타겟 `Mesh` 인스턴스
     * [EN] Target `Mesh` instance
     */
    get targetMesh(): Mesh {
        return this.#targetMesh;
    }

    set targetMesh(value: Mesh) {
        if (!value) throw new Error('FollowController: targetMesh cannot be null or undefined');
        this.#targetMesh = value;
        this.#targetMesh.setIgnoreFrustumCullingRecursively(true);
        this.#snapToTarget();
    }

    /**
     * [KO] 카메라가 바라보는 타겟 지점의 3축 오프셋을 한 번에 설정합니다.
     * [EN] Sets the 3-axis offset of the target point the camera looks at all at once.
     *
     * ### Example
     * ```typescript
     * controller.setTargetOffset(0, 2, 0);
     * ```
     *
     * @param x -
     * [KO] X축 오프셋
     * [EN] X-axis offset
     * @param y -
     * [KO] Y축 오프셋 (기본값: `0`)
     * [EN] Y-axis offset (default: `0`)
     * @param z -
     * [KO] Z축 오프셋 (기본값: `0`)
     * [EN] Z-axis offset (default: `0`)
     */
    setTargetOffset(x: number, y: number = 0, z: number = 0): void {
        validateNumber(x);
        validateNumber(y);
        validateNumber(z);
        this.#targetOffsetX = x;
        this.#targetOffsetY = y;
        this.#targetOffsetZ = z;
    }

    /**
     * [KO] 매 프레임 추적 카메라의 위치와 시선 방향을 갱신합니다.
     * [EN] Updates the follow camera's position and look-at direction every frame.
     *
     * @param view -
     * [KO] 컨트롤러가 연결된 `View3D` 인스턴스
     * [EN] `View3D` instance connected to the controller
     * @param time -
     * [KO] 현재 경과 시간 (ms)
     * [EN] Current elapsed time (ms)
     */
    update(view: View3D, time: number): void {
        super.update(view, time, this.#updateAnimation);
    }

    #updateAnimation = (view: View3D, deltaTime: number): void => {
        const {targetMesh} = this;
        if (targetMesh) {
            updateObject3DMatrix(targetMesh, view);
        }

        this.#currentDistance = this.#targetDistance + (this.#currentDistance - this.#targetDistance) * Math.pow(this.#distanceInterpolation, deltaTime);
        this.#currentHeight = this.#targetHeight + (this.#currentHeight - this.#targetHeight) * Math.pow(this.#heightInterpolation, deltaTime);

        let panDelta = (this.#targetPan - this.#currentPan) % 360;
        if (panDelta > 180) panDelta -= 360;
        if (panDelta < -180) panDelta += 360;
        this.#currentPan += panDelta * (1 - Math.pow(this.#panInterpolation, deltaTime));

        this.#currentTilt = this.#targetTilt + (this.#currentTilt - this.#targetTilt) * Math.pow(this.#tiltInterpolation, deltaTime);

        const targetPosition = this.#calculateCameraPosition();
        const positionSmoothing = Math.pow(this.#interpolation, deltaTime);

        this.#currentPosition[0] = targetPosition[0] + (this.#currentPosition[0] - targetPosition[0]) * positionSmoothing;
        this.#currentPosition[1] = targetPosition[1] + (this.#currentPosition[1] - targetPosition[1]) * positionSmoothing;
        this.#currentPosition[2] = targetPosition[2] + (this.#currentPosition[2] - targetPosition[2]) * positionSmoothing;

        this.camera.setPosition(this.#currentPosition[0], this.#currentPosition[1], this.#currentPosition[2]);

        const lookAt = this.#calculateLookAtTarget();
        this.camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
    };

    #calculateCameraPosition(): vec3 {
        const panRad = this.#currentPan * PER_PI;
        const tiltRad = this.#currentTilt * PER_PI;
        const cosT = Math.cos(tiltRad);
        const sinT = Math.sin(tiltRad);
        const cosP = Math.cos(panRad);
        const sinP = Math.sin(panRad);

        const worldMatrix = this.#targetMesh.modelMatrix;
        const targetWorldX = worldMatrix[12];
        const targetWorldY = worldMatrix[13];
        const targetWorldZ = worldMatrix[14];

        if (this.#isFollowingTargetRotation) {
            vec3.set(TEMP_VEC3,
                sinP * this.#currentDistance * cosT,
                sinT * this.#currentDistance + this.#currentHeight,
                cosP * this.#currentDistance * cosT
            );

            mat4.copy(TEMP_MAT4, worldMatrix);
            TEMP_MAT4[12] = TEMP_MAT4[13] = TEMP_MAT4[14] = 0;
            vec3.transformMat4(TEMP_VEC3, TEMP_VEC3, TEMP_MAT4);

            return vec3.set(
                this.#cameraPosition,
                targetWorldX + TEMP_VEC3[0],
                targetWorldY + TEMP_VEC3[1],
                targetWorldZ + TEMP_VEC3[2]
            );
        }

        return vec3.set(
            this.#cameraPosition,
            targetWorldX + this.#currentDistance * cosT * sinP,
            targetWorldY + this.#currentHeight + this.#currentDistance * sinT,
            targetWorldZ + this.#currentDistance * cosT * cosP
        );
    }

    #calculateLookAtTarget(): vec3 {
        vec3.set(TEMP_VEC3, this.#targetOffsetX, this.#targetOffsetY, this.#targetOffsetZ);

        const worldMatrix = this.#targetMesh.modelMatrix;
        const targetWorldX = worldMatrix[12];
        const targetWorldY = worldMatrix[13];
        const targetWorldZ = worldMatrix[14];

        if (this.#isFollowingTargetRotation && (this.#targetOffsetX !== 0 || this.#targetOffsetY !== 0 || this.#targetOffsetZ !== 0)) {
            mat4.copy(TEMP_MAT4, worldMatrix);
            TEMP_MAT4[12] = TEMP_MAT4[13] = TEMP_MAT4[14] = 0;
            vec3.transformMat4(TEMP_VEC3, TEMP_VEC3, TEMP_MAT4);
        }

        return vec3.set(
            this.#lookAtTargetPosition,
            targetWorldX + TEMP_VEC3[0],
            targetWorldY + TEMP_VEC3[1],
            targetWorldZ + TEMP_VEC3[2]
        );
    }

    #snapToTarget(): void {
        updateObject3DMatrix(this.#targetMesh, DUMMY_VIEW);

        this.#currentDistance = this.#targetDistance;
        this.#currentHeight = this.#targetHeight;
        this.#currentPan = this.#targetPan;
        this.#currentTilt = this.#targetTilt;

        const initialPosition = this.#calculateCameraPosition();
        vec3.copy(this.#currentPosition, initialPosition);

        this.camera.setPosition(this.#currentPosition[0], this.#currentPosition[1], this.#currentPosition[2]);
        const lookAt = this.#calculateLookAtTarget();
        this.camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
    }

}

Object.freeze(FollowController);
export default FollowController;