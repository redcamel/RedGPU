import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import AController from "../core/AController";

const PER_PI = Math.PI / 180;
const ROTATION_THRESHOLD = 0.0001;
const DISTANCE_THRESHOLD = 0.0001;

/**
 * [KO] 지정된 중심점을 기준으로 궤도 회전 및 줌을 수행하는 카메라 컨트롤러 클래스입니다.
 * [EN] Camera controller class that performs orbital rotation and zoom around a specified center point.
 *
 * ### Example
 * ```typescript
 * const controller = new RedGPU.Camera.OrbitController(redGPUContext);
 * controller.centerX = 0;
 * controller.centerY = 0;
 * controller.centerZ = 0;
 * controller.distance = 20;
 * controller.tilt = -30;
 * controller.pan = 45;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/controller/orbitController/" style="width:100%; height:500px;"></iframe>
 * @see [OrbitController example](/RedGPU/examples/3d/controller/orbitController/)
 * @category Controller
 */
class OrbitController extends AController {
    #centerX = 0;
    #centerY = 0;
    #centerZ = 0;
    #distance = 15;
    #speedDistance = 1.5;
    #distanceInterpolation = 0.02;
    #minDistance = 0.1;
    #maxDistance = Infinity;
    #pan = 0;
    #tilt = -35;
    #speedRotation = 3;
    #rotationInterpolation = 0.02;
    #minTilt = -90;
    #maxTilt = 90;
    #currentPan = 0;
    #currentTilt = 0;
    #currentDistance = 0;

    /**
     * [KO] OrbitController 인스턴스를 생성합니다.
     * [EN] Creates an OrbitController instance.
     *
     * ### Example
     * ```typescript
     * const controller = new RedGPU.Camera.OrbitController(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext,
            {
                HD_Move: (deltaX: number, deltaY: number) => {
                    this.#pan -= deltaX * this.#speedRotation * 0.1;
                    this.#tilt -= deltaY * this.#speedRotation * 0.1;
                },
                HD_Wheel: (e: WheelEvent) => {
                    this.#distance += e.deltaY / 100 * this.#speedDistance;
                    if (this.#distance < this.#minDistance) this.#distance = this.#minDistance;
                    if (this.#distance > this.#maxDistance) this.#distance = this.#maxDistance;
                },
                HD_TouchPinch: (deltaScale: number) => {
                    const scaleChange = (deltaScale - 1) * this.#speedDistance;
                    this.#distance -= scaleChange * this.#distance;
                    if (this.#distance < this.#minDistance) this.#distance = this.#minDistance;
                    if (this.#distance > this.#maxDistance) this.#distance = this.#maxDistance;
                },
            }
        );
        this.#currentPan = this.#pan;
        this.#currentTilt = this.#tilt;
        this.#currentDistance = this.#distance;
    }

    /**
     * [KO] 회전 중심점의 X축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis coordinate of the rotation center point.
     *
     * @returns
     * [KO] 중심점 X축 좌표 (기본값: `0`)
     * [EN] Center point X-axis coordinate (default: `0`)
     */
    get centerX(): number {
        return this.#centerX;
    }

    set centerX(value: number) {
        validateNumber(value);
        this.#centerX = value;
    }

    /**
     * [KO] 회전 중심점의 Y축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis coordinate of the rotation center point.
     *
     * @returns
     * [KO] 중심점 Y축 좌표 (기본값: `0`)
     * [EN] Center point Y-axis coordinate (default: `0`)
     */
    get centerY(): number {
        return this.#centerY;
    }

    set centerY(value: number) {
        validateNumber(value);
        this.#centerY = value;
    }

    /**
     * [KO] 회전 중심점의 Z축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis coordinate of the rotation center point.
     *
     * @returns
     * [KO] 중심점 Z축 좌표 (기본값: `0`)
     * [EN] Center point Z-axis coordinate (default: `0`)
     */
    get centerZ(): number {
        return this.#centerZ;
    }

    set centerZ(value: number) {
        validateNumber(value);
        this.#centerZ = value;
    }

    /**
     * [KO] 중심점으로부터 카메라까지의 목표 거리를 가져오거나 설정합니다. (`0` 이상)
     * [EN] Gets or sets the target distance from the center point to the camera. (`0` or greater)
     *
     * @returns
     * [KO] 목표 거리 (기본값: `15`)
     * [EN] Target distance (default: `15`)
     */
    get distance(): number {
        return this.#distance;
    }

    set distance(value: number) {
        validateNumberRange(value, 0);
        this.#distance = value;
    }

    /**
     * [KO] 줌 거리 조절 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the zoom distance adjustment speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 거리 조절 속도 (기본값: `1.5`)
     * [EN] Distance adjustment speed (default: `1.5`)
     */
    get speedDistance(): number {
        return this.#speedDistance;
    }

    set speedDistance(value: number) {
        validateNumberRange(value, 0.01);
        this.#speedDistance = value;
    }

    /**
     * [KO] 줌 거리 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for zoom distance changes. (`0.01` ~ `1`)
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
     * [KO] 최소 줌 거리를 가져오거나 설정합니다. (`0.1` 이상)
     * [EN] Gets or sets the minimum zoom distance. (`0.1` or greater)
     *
     * @returns
     * [KO] 최소 거리 (기본값: `0.1`)
     * [EN] Minimum distance (default: `0.1`)
     */
    get minDistance(): number {
        return this.#minDistance;
    }

    set minDistance(value: number) {
        validateNumberRange(value, 0.1);
        this.#minDistance = value;
    }

    /**
     * [KO] 최대 줌 거리를 가져오거나 설정합니다. (`0.1` 이상)
     * [EN] Gets or sets the maximum zoom distance. (`0.1` or greater)
     *
     * @returns
     * [KO] 최대 거리 (기본값: `Infinity`)
     * [EN] Maximum distance (default: `Infinity`)
     */
    get maxDistance(): number {
        return this.#maxDistance;
    }

    set maxDistance(value: number) {
        validateNumberRange(value, 0.1);
        this.#maxDistance = value;
    }

    /**
     * [KO] 회전 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the rotation speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 회전 속도 (기본값: `3`)
     * [EN] Rotation speed (default: `3`)
     */
    get speedRotation(): number {
        return this.#speedRotation;
    }

    set speedRotation(value: number) {
        validateNumberRange(value, 0.01);
        this.#speedRotation = value;
    }

    /**
     * [KO] 회전 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for rotation changes. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 회전 보간 계수 (기본값: `0.02`)
     * [EN] Rotation interpolation factor (default: `0.02`)
     */
    get rotationInterpolation(): number {
        return this.#rotationInterpolation;
    }

    set rotationInterpolation(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#rotationInterpolation = value;
    }

    /**
     * [KO] 카메라의 수평 회전(Pan) 목표 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's target horizontal rotation (Pan) angle. (Unit: degrees)
     *
     * @returns
     * [KO] 팬 각도 (기본값: `0`)
     * [EN] Pan angle (default: `0`)
     */
    get pan(): number {
        return this.#pan;
    }

    set pan(value: number) {
        validateNumber(value);
        this.#pan = value;
    }

    /**
     * [KO] 카메라의 수직 회전(Tilt) 목표 각도를 가져오거나 설정합니다. (단위: 도, 범위: `-90` ~ `90`)
     * [EN] Gets or sets the camera's target vertical rotation (Tilt) angle. (Unit: degrees, Range: `-90` ~ `90`)
     *
     * @returns
     * [KO] 틸트 각도 (기본값: `-35`)
     * [EN] Tilt angle (default: `-35`)
     */
    get tilt(): number {
        return this.#tilt;
    }

    set tilt(value: number) {
        validateNumberRange(value, -90, 90);
        this.#tilt = value;
    }

    /**
     * [KO] 최소 틸트(Tilt) 제한 각도를 가져오거나 설정합니다. (`-90` ~ `90`)
     * [EN] Gets or sets the minimum tilt angle limit. (`-90` ~ `90`)
     *
     * @returns
     * [KO] 최소 틸트 각도 (기본값: `-90`)
     * [EN] Minimum tilt angle (default: `-90`)
     */
    get minTilt(): number {
        return this.#minTilt;
    }

    set minTilt(value: number) {
        validateNumberRange(value, -90, 90);
        this.#minTilt = value;
    }

    /**
     * [KO] 최대 틸트(Tilt) 제한 각도를 가져오거나 설정합니다. (`-90` ~ `90`)
     * [EN] Gets or sets the maximum tilt angle limit. (`-90` ~ `90`)
     *
     * @returns
     * [KO] 최대 틸트 각도 (기본값: `90`)
     * [EN] Maximum tilt angle (default: `90`)
     */
    get maxTilt(): number {
        return this.#maxTilt;
    }

    set maxTilt(value: number) {
        validateNumberRange(value, -90, 90);
        this.#maxTilt = value;
    }

    /**
     * [KO] 매 프레임 궤도 카메라의 상태를 갱신합니다.
     * [EN] Updates the orbital camera state every frame.
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
        if (this.#tilt < this.#minTilt) this.#tilt = this.#minTilt;
        if (this.#tilt > this.#maxTilt) this.#tilt = this.#maxTilt;
        const {camera} = this;

        const panDelta = this.#pan - this.#currentPan;

        if (Math.abs(panDelta) > ROTATION_THRESHOLD) {
            this.#currentPan += panDelta * (1 - Math.pow(this.#rotationInterpolation, deltaTime));
        } else {
            this.#currentPan = this.#pan;
        }

        const tiltDelta = this.#tilt - this.#currentTilt;
        if (Math.abs(tiltDelta) > ROTATION_THRESHOLD) {
            this.#currentTilt += tiltDelta * (1 - Math.pow(this.#rotationInterpolation, deltaTime));
        } else {
            this.#currentTilt = this.#tilt;
        }

        if (this.#distance < camera.nearClipping) this.#distance = camera.nearClipping;
        if (this.#distance < this.#minDistance) this.#distance = this.#minDistance;
        if (this.#distance > this.#maxDistance) this.#distance = this.#maxDistance;

        const distanceDelta = this.#distance - this.#currentDistance;
        if (Math.abs(distanceDelta) > DISTANCE_THRESHOLD) {
            this.#currentDistance += distanceDelta * (1 - Math.pow(this.#distanceInterpolation, deltaTime));
        } else {
            this.#currentDistance = this.#distance;
        }

        if (this.#currentDistance < camera.nearClipping) this.#currentDistance = camera.nearClipping;

        const panRad = this.#currentPan * PER_PI;
        const tiltRad = this.#currentTilt * PER_PI;
        const cosTilt = Math.cos(tiltRad);
        const distCosTilt = this.#currentDistance * cosTilt;

        camera.setPosition(
            this.#centerX + Math.sin(panRad) * distCosTilt,
            this.#centerY - Math.sin(tiltRad) * this.#currentDistance,
            this.#centerZ + Math.cos(panRad) * distCosTilt
        );
        camera.lookAt(this.#centerX, this.#centerY, this.#centerZ);
    };
}

Object.freeze(OrbitController);
export default OrbitController;