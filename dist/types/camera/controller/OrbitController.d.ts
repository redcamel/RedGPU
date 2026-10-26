import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
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
declare class OrbitController extends AController {
    #private;
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
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 회전 중심점의 X축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis coordinate of the rotation center point.
     *
     * @returns
     * [KO] 중심점 X축 좌표 (기본값: `0`)
     * [EN] Center point X-axis coordinate (default: `0`)
     */
    get centerX(): number;
    set centerX(value: number);
    /**
     * [KO] 회전 중심점의 Y축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis coordinate of the rotation center point.
     *
     * @returns
     * [KO] 중심점 Y축 좌표 (기본값: `0`)
     * [EN] Center point Y-axis coordinate (default: `0`)
     */
    get centerY(): number;
    set centerY(value: number);
    /**
     * [KO] 회전 중심점의 Z축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis coordinate of the rotation center point.
     *
     * @returns
     * [KO] 중심점 Z축 좌표 (기본값: `0`)
     * [EN] Center point Z-axis coordinate (default: `0`)
     */
    get centerZ(): number;
    set centerZ(value: number);
    /**
     * [KO] 중심점으로부터 카메라까지의 목표 거리를 가져오거나 설정합니다. (`0` 이상)
     * [EN] Gets or sets the target distance from the center point to the camera. (`0` or greater)
     *
     * @returns
     * [KO] 목표 거리 (기본값: `15`)
     * [EN] Target distance (default: `15`)
     */
    get distance(): number;
    set distance(value: number);
    /**
     * [KO] 줌 거리 조절 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the zoom distance adjustment speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 거리 조절 속도 (기본값: `1.5`)
     * [EN] Distance adjustment speed (default: `1.5`)
     */
    get speedDistance(): number;
    set speedDistance(value: number);
    /**
     * [KO] 줌 거리 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for zoom distance changes. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 거리 보간 계수 (기본값: `0.02`)
     * [EN] Distance interpolation factor (default: `0.02`)
     */
    get distanceInterpolation(): number;
    set distanceInterpolation(value: number);
    /**
     * [KO] 최소 줌 거리를 가져오거나 설정합니다. (`0.1` 이상)
     * [EN] Gets or sets the minimum zoom distance. (`0.1` or greater)
     *
     * @returns
     * [KO] 최소 거리 (기본값: `0.1`)
     * [EN] Minimum distance (default: `0.1`)
     */
    get minDistance(): number;
    set minDistance(value: number);
    /**
     * [KO] 최대 줌 거리를 가져오거나 설정합니다. (`0.1` 이상)
     * [EN] Gets or sets the maximum zoom distance. (`0.1` or greater)
     *
     * @returns
     * [KO] 최대 거리 (기본값: `Infinity`)
     * [EN] Maximum distance (default: `Infinity`)
     */
    get maxDistance(): number;
    set maxDistance(value: number);
    /**
     * [KO] 회전 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the rotation speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 회전 속도 (기본값: `3`)
     * [EN] Rotation speed (default: `3`)
     */
    get speedRotation(): number;
    set speedRotation(value: number);
    /**
     * [KO] 회전 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for rotation changes. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 회전 보간 계수 (기본값: `0.02`)
     * [EN] Rotation interpolation factor (default: `0.02`)
     */
    get rotationInterpolation(): number;
    set rotationInterpolation(value: number);
    /**
     * [KO] 카메라의 수평 회전(Pan) 목표 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's target horizontal rotation (Pan) angle. (Unit: degrees)
     *
     * @returns
     * [KO] 팬 각도 (기본값: `0`)
     * [EN] Pan angle (default: `0`)
     */
    get pan(): number;
    set pan(value: number);
    /**
     * [KO] 카메라의 수직 회전(Tilt) 목표 각도를 가져오거나 설정합니다. (단위: 도, 범위: `-90` ~ `90`)
     * [EN] Gets or sets the camera's target vertical rotation (Tilt) angle. (Unit: degrees, Range: `-90` ~ `90`)
     *
     * @returns
     * [KO] 틸트 각도 (기본값: `-35`)
     * [EN] Tilt angle (default: `-35`)
     */
    get tilt(): number;
    set tilt(value: number);
    /**
     * [KO] 최소 틸트(Tilt) 제한 각도를 가져오거나 설정합니다. (`-90` ~ `90`)
     * [EN] Gets or sets the minimum tilt angle limit. (`-90` ~ `90`)
     *
     * @returns
     * [KO] 최소 틸트 각도 (기본값: `-90`)
     * [EN] Minimum tilt angle (default: `-90`)
     */
    get minTilt(): number;
    set minTilt(value: number);
    /**
     * [KO] 최대 틸트(Tilt) 제한 각도를 가져오거나 설정합니다. (`-90` ~ `90`)
     * [EN] Gets or sets the maximum tilt angle limit. (`-90` ~ `90`)
     *
     * @returns
     * [KO] 최대 틸트 각도 (기본값: `90`)
     * [EN] Maximum tilt angle (default: `90`)
     */
    get maxTilt(): number;
    set maxTilt(value: number);
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
    update(view: View3D, time: number): void;
}
export default OrbitController;
