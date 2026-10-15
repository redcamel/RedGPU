import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import AController from "../core/AController";

const PER_PI = Math.PI / 180;
const ROTATION_THRESHOLD = 0.0001;
const DISTANCE_THRESHOLD = 0.0001;

/**
 * [KO] 특정 지점을 중심으로 회전하는 궤도형 카메라 컨트롤러입니다.
 * [EN] Orbital camera controller that rotates around a specific point.
 *
 * [KO] 제품 모델링 뷰어나 3D 객체 관찰용으로 주로 사용되며, 중심점을 기준으로 줌, 회전, 팬(Pan) 동작을 통해 대상을 다각도에서 살펴볼 수 있습니다.
 * [EN] Primarily used for product modeling viewers or observing 3D objects, allowing the user to inspect the target from various angles via zoom, rotation, and pan operations around a center point.
 *
 * ### Example
 * ```typescript
 * const controller = new RedGPU.OrbitController(redGPUContext);
 * controller.centerX = 0;
 * controller.centerY = 0;
 * controller.centerZ = 0;
 * controller.distance = 20;
 * controller.tilt = -30;
 * controller.pan = 45;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/orbitController/" style="width:100%; height:500px;"></iframe>
 * @category Controller
 */
class OrbitController extends AController {
    // ==================== 카메라 위치 및 중심점 ====================
    #centerX = 0;
    #centerY = 0;
    #centerZ = 0;
    // ==================== 거리(줌) 관련 ====================
    #distance = 15;
    #speedDistance = 1.5;
    #distanceInterpolation = 0.02;
    #minDistance = 0.1;
    #maxDistance = Infinity;
    // ==================== 회전(팬/틸트) 관련 ====================
    #pan = 0;
    #tilt = -35;
    #speedRotation = 3;
    #rotationInterpolation = 0.02;
    #minTilt = -90;
    #maxTilt = 90;
    // ==================== 애니메이션 상태 ====================
    #currentPan = 0;
    #currentTilt = 0;
    #currentDistance = 0;

    // ==================== 라이프사이클 ====================
    /**
     * [KO] OrbitController 인스턴스를 생성합니다.
     * [EN] Creates an instance of OrbitController.
     *
     * ### Example
     * ```typescript
     * const controller = new RedGPU.OrbitController(redGPUContext);
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

    // ==================== 센터 좌표 Getter/Setter ====================
    /**
     * [KO] 회전 중심의 X축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis coordinate of the rotation center.
     *
     * @returns
     * [KO] 중심점 X축 좌표
     * [EN] Center point X-axis coordinate
     */
    get centerX(): number {
        return this.#centerX;
    }

    set centerX(value: number) {
        validateNumber(value);
        this.#centerX = value;
    }

    /**
     * [KO] 회전 중심의 Y축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis coordinate of the rotation center.
     *
     * @returns
     * [KO] 중심점 Y축 좌표
     * [EN] Center point Y-axis coordinate
     */
    get centerY(): number {
        return this.#centerY;
    }

    set centerY(value: number) {
        validateNumber(value);
        this.#centerY = value;
    }

    /**
     * [KO] 회전 중심의 Z축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis coordinate of the rotation center.
     *
     * @returns
     * [KO] 중심점 Z축 좌표
     * [EN] Center point Z-axis coordinate
     */
    get centerZ(): number {
        return this.#centerZ;
    }

    set centerZ(value: number) {
        validateNumber(value);
        this.#centerZ = value;
    }

    // ==================== 거리(줌) Getter/Setter ====================
    /**
     * [KO] 중심점으로부터 카메라까지의 거리를 가져오거나 설정합니다. (0 이상)
     * [EN] Gets or sets the distance from the center point to the camera. (min 0)
     *
     * @returns
     * [KO] 거리 값
     * [EN] Distance value
     */
    get distance(): number {
        return this.#distance;
    }

    set distance(value: number) {
        validateNumberRange(value, 0);
        this.#distance = value;
    }

    /**
     * [KO] 거리 조절 속도를 가져오거나 설정합니다. 높을수록 빠른 줌 속도 (0.01 이상)
     * [EN] Gets or sets the distance adjustment speed. Higher values for faster zoom speed. (min 0.01)
     *
     * @returns
     * [KO] 거리 변화 속도
     * [EN] Distance change speed
     */
    get speedDistance(): number {
        return this.#speedDistance;
    }

    set speedDistance(value: number) {
        validateNumberRange(value, 0.01);
        this.#speedDistance = value;
    }

    /**
     * [KO] 거리 보간 계수를 가져오거나 설정합니다. 낮을수록 부드러운 줌 이동 (0.01 ~ 1)
     * [EN] Gets or sets the distance interpolation factor. Lower values for smoother zoom movement. (0.01 ~ 1)
     *
     * @returns
     * [KO] 거리 보간 계수 (0.01 ~ 1)
     * [EN] Distance interpolation factor (0.01 ~ 1)
     */
    get distanceInterpolation(): number {
        return this.#distanceInterpolation;
    }

    set distanceInterpolation(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#distanceInterpolation = value;
    }

    /**
     * [KO] 최소 줌 거리를 가져오거나 설정합니다. (0.1 이상)
     * [EN] Gets or sets the minimum zoom distance. (min 0.1)
     *
     * @returns
     * [KO] 최소 거리
     * [EN] Minimum distance
     */
    get minDistance(): number {
        return this.#minDistance;
    }

    set minDistance(value: number) {
        validateNumberRange(value, 0.1);
        this.#minDistance = value;
    }

    /**
     * [KO] 최대 줌 거리를 가져오거나 설정합니다. (0.1 이상)
     * [EN] Gets or sets the maximum zoom distance. (min 0.1)
     *
     * @returns
     * [KO] 최대 거리
     * [EN] Maximum distance
     */
    get maxDistance(): number {
        return this.#maxDistance;
    }

    set maxDistance(value: number) {
        validateNumberRange(value, 0.1);
        this.#maxDistance = value;
    }

    // ==================== 회전 속도 Getter/Setter ====================
    /**
     * [KO] 회전 속도를 가져오거나 설정합니다. 높을수록 빠른 회전 속도 (0.01 이상)
     * [EN] Gets or sets the rotation speed. Higher values for faster rotation speed. (min 0.01)
     *
     * @returns
     * [KO] 회전 속도 값
     * [EN] Rotation speed value
     */
    get speedRotation(): number {
        return this.#speedRotation;
    }

    set speedRotation(value: number) {
        validateNumberRange(value, 0.01);
        this.#speedRotation = value;
    }

    /**
     * [KO] 회전 보간 계수를 가져오거나 설정합니다. 낮을수록 부드러운 회전 (0.01 ~ 1)
     * [EN] Gets or sets the rotation interpolation factor. Lower values for smoother rotation. (0.01 ~ 1)
     *
     * @returns
     * [KO] 회전 보간 계수 (0.01 ~ 1)
     * [EN] Rotation interpolation factor (0.01 ~ 1)
     */
    get rotationInterpolation(): number {
        return this.#rotationInterpolation;
    }

    set rotationInterpolation(value: number) {
        validateNumberRange(value, 0.01, 1);
        this.#rotationInterpolation = value;
    }

    // ==================== 팬/틸트 Getter/Setter ====================
    /**
     * [KO] 카메라의 팬(가로 회전) 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's pan (horizontal rotation) angle. (Unit: degrees)
     *
     * @returns
     * [KO] 팬 각도 값
     * [EN] Pan angle value
     */
    get pan(): number {
        return this.#pan;
    }

    set pan(value: number) {
        validateNumber(value);
        this.#pan = value;
    }

    /**
     * [KO] 카메라의 틸트(세로 회전) 각도를 가져오거나 설정합니다. (단위: 도, 범위: -90 ~ 90)
     * [EN] Gets or sets the camera's tilt (vertical rotation) angle. (Unit: degrees, Range: -90 ~ 90)
     *
     * @returns
     * [KO] 틸트 각도 값
     * [EN] Tilt angle value
     */
    get tilt(): number {
        return this.#tilt;
    }

    set tilt(value: number) {
        validateNumberRange(value, -90, 90);
        this.#tilt = value;
    }

    /**
     * [KO] 최소 틸트 각도를 가져오거나 설정합니다. (-90 ~ 90)
     * [EN] Gets or sets the minimum tilt angle. (-90 ~ 90)
     *
     * @returns
     * [KO] 최소 틸트 각도
     * [EN] Minimum tilt angle
     */
    get minTilt(): number {
        return this.#minTilt;
    }

    set minTilt(value: number) {
        validateNumberRange(value, -90, 90);
        this.#minTilt = value;
    }

    /**
     * [KO] 최대 틸트 각도를 가져오거나 설정합니다. (-90 ~ 90)
     * [EN] Gets or sets the maximum tilt angle. (-90 ~ 90)
     *
     * @returns
     * [KO] 최대 틸트 각도
     * [EN] Maximum tilt angle
     */
    get maxTilt(): number {
        return this.#maxTilt;
    }

    set maxTilt(value: number) {
        validateNumberRange(value, -90, 90);
        this.#maxTilt = value;
    }

    // ==================== 업데이트 및 애니메이션 ====================
    /**
     * [KO] 매 프레임마다 오빗 카메라를 업데이트합니다.
     * [EN] Updates the orbit camera every frame.
     *
     * @param view -
     * [KO] 카메라가 속한 3D 뷰
     * [EN] The 3D view the camera belongs to
     * @param time -
     * [KO] 현재 시간 (ms)
     * [EN] Current time (ms)
     */
    update(view: View3D, time: number): void {
        super.update(view, time, this.#updateAnimation);
    }

    #updateAnimation = (view: View3D, deltaTime: number): void => {
        // 틸트 범위 제한
        if (this.#tilt < this.#minTilt) this.#tilt = this.#minTilt;
        if (this.#tilt > this.#maxTilt) this.#tilt = this.#maxTilt;
        const {camera} = this;

        // 팬(Pan) 보간 - 지수적 감쇄
        const panDelta = this.#pan - this.#currentPan;

        if (Math.abs(panDelta) > ROTATION_THRESHOLD) {
            this.#currentPan += panDelta * (1 - Math.pow(this.#rotationInterpolation, deltaTime));
        } else {
            this.#currentPan = this.#pan;
        }

        // 틸트(Tilt) 보간
        const tiltDelta = this.#tilt - this.#currentTilt;
        if (Math.abs(tiltDelta) > ROTATION_THRESHOLD) {
            this.#currentTilt += tiltDelta * (1 - Math.pow(this.#rotationInterpolation, deltaTime));
        } else {
            this.#currentTilt = this.#tilt;
        }

        // 거리(줌) 범위 및 보간
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

        // 구면 좌표계 직접 삼각함수 연산 (4x4 행렬 곱셈 4회 및 임시 배열 2회 제거)
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