import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
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
declare class FollowController extends AController {
    #private;
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
    constructor(redGPUContext: RedGPUContext, targetMesh: Mesh);
    /**
     * [KO] 타겟 메시로부터 카메라까지의 목표 거리를 가져오거나 설정합니다. (`0.1` 이상)
     * [EN] Gets or sets the target distance from the target mesh to the camera. (`0.1` or greater)
     *
     * @returns
     * [KO] 목표 거리 (기본값: `5`)
     * [EN] Target distance (default: `5`)
     */
    get distance(): number;
    set distance(value: number);
    /**
     * [KO] 거리 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for distance changes. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 거리 보간 계수 (기본값: `0.02`)
     * [EN] Distance interpolation factor (default: `0.02`)
     */
    get distanceInterpolation(): number;
    set distanceInterpolation(value: number);
    /**
     * [KO] 타겟 메시로부터 카메라까지의 목표 높이를 가져오거나 설정합니다.
     * [EN] Gets or sets the target height of the camera from the target mesh.
     *
     * @returns
     * [KO] 목표 높이 (기본값: `1`)
     * [EN] Target height (default: `1`)
     */
    get height(): number;
    set height(value: number);
    /**
     * [KO] 높이 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for height changes. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 높이 보간 계수 (기본값: `0.02`)
     * [EN] Height interpolation factor (default: `0.02`)
     */
    get heightInterpolation(): number;
    set heightInterpolation(value: number);
    /**
     * [KO] 타겟을 중심으로 한 카메라의 수평 회전(Pan) 목표 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's target horizontal rotation (Pan) angle around the target. (Unit: degrees)
     *
     * @returns
     * [KO] 팬 각도 (기본값: `0`)
     * [EN] Pan angle (default: `0`)
     */
    get pan(): number;
    set pan(value: number);
    /**
     * [KO] 팬(Pan) 회전의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for pan rotation. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 팬 보간 계수 (기본값: `0.02`)
     * [EN] Pan interpolation factor (default: `0.02`)
     */
    get panInterpolation(): number;
    set panInterpolation(value: number);
    /**
     * [KO] 타겟을 중심으로 한 카메라의 수직 회전(Tilt) 목표 각도를 가져오거나 설정합니다. (단위: 도, 범위: `-89` ~ `89`)
     * [EN] Gets or sets the camera's target vertical rotation (Tilt) angle around the target. (Unit: degrees, Range: `-89` ~ `89`)
     *
     * @returns
     * [KO] 틸트 각도 (기본값: `15`)
     * [EN] Tilt angle (default: `15`)
     */
    get tilt(): number;
    set tilt(value: number);
    /**
     * [KO] 틸트(Tilt) 회전의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for tilt rotation. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 틸트 보간 계수 (기본값: `0.02`)
     * [EN] Tilt interpolation factor (default: `0.02`)
     */
    get tiltInterpolation(): number;
    set tiltInterpolation(value: number);
    /**
     * [KO] 카메라 위치 추적의 전체 감쇄 보간 계수를 가져오거나 설정합니다. (`0.01` ~ `1`)
     * [EN] Gets or sets the overall damping interpolation factor for camera position tracking. (`0.01` ~ `1`)
     *
     * @returns
     * [KO] 위치 보간 계수 (기본값: `0.02`)
     * [EN] Position interpolation factor (default: `0.02`)
     */
    get interpolation(): number;
    set interpolation(value: number);
    /**
     * [KO] 타겟 메시의 회전을 따라 카메라 공전 기준축을 회전시킬지 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether to rotate the camera's orbital reference axes along with the target mesh's rotation.
     *
     * @returns
     * [KO] 타겟 회전 추적 여부 (기본값: `true`)
     * [EN] Whether target rotation tracking is enabled (default: `true`)
     */
    get followTargetRotation(): boolean;
    set followTargetRotation(value: boolean);
    /**
     * [KO] 카메라가 바라보는 타겟 지점의 X축 오프셋을 가져오거나 설정합니다.
     * [EN] Gets or sets the X-axis offset of the target point the camera looks at.
     *
     * @returns
     * [KO] X축 오프셋 (기본값: `0`)
     * [EN] X-axis offset (default: `0`)
     */
    get targetOffsetX(): number;
    set targetOffsetX(value: number);
    /**
     * [KO] 카메라가 바라보는 타겟 지점의 Y축 오프셋을 가져오거나 설정합니다.
     * [EN] Gets or sets the Y-axis offset of the target point the camera looks at.
     *
     * @returns
     * [KO] Y축 오프셋 (기본값: `0`)
     * [EN] Y-axis offset (default: `0`)
     */
    get targetOffsetY(): number;
    set targetOffsetY(value: number);
    /**
     * [KO] 카메라가 바라보는 타겟 지점의 Z축 오프셋을 가져오거나 설정합니다.
     * [EN] Gets or sets the Z-axis offset of the target point the camera looks at.
     *
     * @returns
     * [KO] Z축 오프셋 (기본값: `0`)
     * [EN] Z-axis offset (default: `0`)
     */
    get targetOffsetZ(): number;
    set targetOffsetZ(value: number);
    /**
     * [KO] 현재 추적 중인 타겟 메시를 가져오거나 설정합니다.
     * [EN] Gets or sets the target mesh currently being followed.
     *
     * @returns
     * [KO] 타겟 `Mesh` 인스턴스
     * [EN] Target `Mesh` instance
     */
    get targetMesh(): Mesh;
    set targetMesh(value: Mesh);
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
    setTargetOffset(x: number, y?: number, z?: number): void;
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
    update(view: View3D, time: number): void;
}
export default FollowController;
