import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
/**
 * [KO] 특정 타겟 메시를 추적하는 카메라 컨트롤러입니다.
 * [EN] Camera controller that tracks a specific target mesh.
 *
 * [KO] 3인칭 게임의 캐릭터 카메라처럼 타겟의 뒤를 쫓거나 주변을 회전하며 관찰하는 데 사용됩니다. 타겟의 이동과 회전을 부드럽게 따라가며, 거리와 높이, 각도를 조절하여 다양한 연출이 가능합니다.
 * [EN] Used to follow behind or rotate around a target, like a character camera in a 3rd person game. It smoothly tracks the target's movement and rotation, allowing for various cinematic effects by adjusting distance, height, and angles.
 *
 * ### Example
 * ```typescript
 * const followController = new RedGPU.FollowController(redGPUContext, targetMesh);
 * followController.distance = 15;
 * followController.height = 8;
 * followController.pan = 45;
 * followController.tilt = 30;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/followController/" style="width:100%; height:500px;"></iframe>
 * @category Controller
 */
declare class FollowController extends AController {
    #private;
    /**
     * [KO] FollowController 인스턴스를 생성합니다.
     * [EN] Creates an instance of FollowController.
     *
     * ### Example
     * ```typescript
     * const controller = new RedGPU.FollowController(redGPUContext, targetMesh);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param targetMesh -
     * [KO] 따라갈 대상 메시
     * [EN] Target mesh to follow
     * @throws
     * [KO] targetMesh가 null이거나 undefined일 경우 에러 발생
     * [EN] Throws Error if targetMesh is null or undefined
     */
    constructor(redGPUContext: RedGPUContext, targetMesh: Mesh);
    /**
     * [KO] 타겟으로부터의 카메라 거리를 가져옵니다.
     * [EN] Gets the camera distance from the target.
     *
     * @returns
     * [KO] 목표 거리 (0.1 이상)
     * [EN] Target distance (min 0.1)
     */
    get distance(): number;
    /**
     * [KO] 타겟으로부터의 카메라 거리를 설정합니다.
     * [EN] Sets the camera distance from the target.
     *
     * @param value -
     * [KO] 설정할 거리 (0.1 이상)
     * [EN] Distance to set (min 0.1)
     */
    set distance(value: number);
    /**
     * [KO] 거리 값의 보간 계수를 가져옵니다.
     * [EN] Gets the interpolation factor for the distance value.
     *
     * @returns
     * [KO] 거리 보간 계수 (0.01 ~ 1)
     * [EN] Distance interpolation factor (0.01 ~ 1)
     */
    get distanceInterpolation(): number;
    /**
     * [KO] 거리 값의 보간 계수를 설정합니다.
     * [EN] Sets the interpolation factor for the distance value.
     *
     * @param value -
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    set distanceInterpolation(value: number);
    /**
     * [KO] 타겟으로부터의 카메라 높이를 가져옵니다.
     * [EN] Gets the camera height from the target.
     *
     * @returns
     * [KO] 목표 높이
     * [EN] Target height
     */
    get height(): number;
    /**
     * [KO] 타겟으로부터의 카메라 높이를 설정합니다.
     * [EN] Sets the camera height from the target.
     *
     * @param value -
     * [KO] 설정할 높이
     * [EN] Height to set
     */
    set height(value: number);
    /**
     * [KO] 높이 값의 보간 계수를 가져옵니다.
     * [EN] Gets the interpolation factor for the height value.
     *
     * @returns
     * [KO] 높이 보간 계수 (0.01 ~ 1)
     * [EN] Height interpolation factor (0.01 ~ 1)
     */
    get heightInterpolation(): number;
    /**
     * [KO] 높이 값의 보간 계수를 설정합니다.
     * [EN] Sets the interpolation factor for the height value.
     *
     * @param value -
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    set heightInterpolation(value: number);
    /**
     * [KO] 타겟을 중심으로 한 카메라의 가로 회전(팬) 각도를 가져옵니다. (도 단위)
     * [EN] Gets the camera's horizontal rotation (pan) angle around the target (in degrees).
     *
     * @returns
     * [KO] 팬 각도 (도 단위)
     * [EN] Pan angle (in degrees)
     */
    get pan(): number;
    /**
     * [KO] 타겟을 중심으로 한 카메라의 가로 회전(팬) 각도를 설정합니다.
     * [EN] Sets the camera's horizontal rotation (pan) angle around the target.
     *
     * @param value -
     * [KO] 팬 각도 (도 단위)
     * [EN] Pan angle (in degrees)
     */
    set pan(value: number);
    /**
     * [KO] 팬 값의 보간 계수를 가져옵니다.
     * [EN] Gets the interpolation factor for the pan value.
     *
     * @returns
     * [KO] 팬 보간 계수 (0.01 ~ 1)
     * [EN] Pan interpolation factor (0.01 ~ 1)
     */
    get panInterpolation(): number;
    /**
     * [KO] 팬 값의 보간 계수를 설정합니다.
     * [EN] Sets the interpolation factor for the pan value.
     *
     * @param value -
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    set panInterpolation(value: number);
    /**
     * [KO] 타겟을 중심으로 한 카메라의 세로 회전(틸트) 각도를 가져옵니다. (도 단위)
     * [EN] Gets the camera's vertical rotation (tilt) angle around the target (in degrees).
     *
     * @returns
     * [KO] 틸트 각도 (도 단위, -89 ~ 89)
     * [EN] Tilt angle (in degrees, -89 ~ 89)
     */
    get tilt(): number;
    /**
     * [KO] 타겟을 중심으로 한 카메라의 세로 회전(틸트) 각도를 설정합니다.
     * [EN] Sets the camera's vertical rotation (tilt) angle around the target.
     *
     * @param value -
     * [KO] 틸트 각도 (도 단위)
     * [EN] Tilt angle (in degrees)
     */
    set tilt(value: number);
    /**
     * [KO] 틸트 값의 보간 계수를 가져옵니다.
     * [EN] Gets the interpolation factor for the tilt value.
     *
     * @returns
     * [KO] 틸트 보간 계수 (0.01 ~ 1)
     * [EN] Tilt interpolation factor (0.01 ~ 1)
     */
    get tiltInterpolation(): number;
    /**
     * [KO] 틸트 값의 보간 계수를 설정합니다.
     * [EN] Sets the interpolation factor for the tilt value.
     *
     * @param value -
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    set tiltInterpolation(value: number);
    /**
     * [KO] 전체 카메라 위치의 보간 계수를 가져옵니다.
     * [EN] Gets the interpolation factor for the overall camera position.
     *
     * @returns
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    get interpolation(): number;
    /**
     * [KO] 전체 카메라 위치의 보간 계수를 설정합니다.
     * [EN] Sets the interpolation factor for the overall camera position.
     *
     * @param value -
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    set interpolation(value: number);
    /**
     * [KO] 타겟 메시의 회전을 따를지 여부를 가져옵니다.
     * [EN] Gets whether to follow the target mesh's rotation.
     *
     * @returns
     * [KO] true일 경우 타겟의 회전을 따름
     * [EN] If true, follows the target's rotation
     */
    get followTargetRotation(): boolean;
    /**
     * [KO] 타겟 메시의 회전을 따를지 여부를 설정합니다.
     * [EN] Sets whether to follow the target mesh's rotation.
     *
     * @param value -
     * [KO] true일 경우 타겟의 회전을 따름
     * [EN] If true, follows the target's rotation
     */
    set followTargetRotation(value: boolean);
    /**
     * [KO] 타겟으로부터의 카메라 X축 오프셋을 가져옵니다.
     * [EN] Gets the camera's X-axis offset from the target.
     *
     * @returns
     * [KO] X축 오프셋
     * [EN] X-axis offset
     */
    get targetOffsetX(): number;
    /**
     * [KO] 타겟으로부터의 카메라 X축 오프셋을 설정합니다.
     * [EN] Sets the camera's X-axis offset from the target.
     *
     * @param value -
     * [KO] X축 오프셋
     * [EN] X-axis offset
     */
    set targetOffsetX(value: number);
    /**
     * [KO] 타겟으로부터의 카메라 Y축 오프셋을 가져옵니다.
     * [EN] Gets the camera's Y-axis offset from the target.
     *
     * @returns
     * [KO] Y축 오프셋
     * [EN] Y-axis offset
     */
    get targetOffsetY(): number;
    /**
     * [KO] 타겟으로부터의 카메라 Y축 오프셋을 설정합니다.
     * [EN] Sets the camera's Y-axis offset from the target.
     *
     * @param value -
     * [KO] Y축 오프셋
     * [EN] Y-axis offset
     */
    set targetOffsetY(value: number);
    /**
     * [KO] 타겟으로부터의 카메라 Z축 오프셋을 가져옵니다.
     * [EN] Gets the camera's Z-axis offset from the target.
     *
     * @returns
     * [KO] Z축 오프셋
     * [EN] Z-axis offset
     */
    get targetOffsetZ(): number;
    /**
     * [KO] 타겟으로부터의 카메라 Z축 오프셋을 설정합니다.
     * [EN] Sets the camera's Z-axis offset from the target.
     *
     * @param value -
     * [KO] Z축 오프셋
     * [EN] Z-axis offset
     */
    set targetOffsetZ(value: number);
    /**
     * [KO] 따라갈 대상 메시를 가져옵니다.
     * [EN] Gets the target mesh to follow.
     *
     * @returns
     * [KO] 현재 타겟 메시
     * [EN] Current target mesh
     */
    get targetMesh(): Mesh;
    /**
     * [KO] 따라갈 대상 메시를 설정합니다.
     * [EN] Sets the target mesh to follow.
     *
     * @param value -
     * [KO] 설정할 타겟 메시
     * [EN] Target mesh to set
     * @throws
     * [KO] value가 null이거나 undefined일 경우 에러 발생
     * [EN] Throws Error if value is null or undefined
     */
    set targetMesh(value: Mesh);
    /**
     * [KO] 카메라의 타겟 오프셋을 한 번에 설정합니다.
     * [EN] Sets the camera's target offset at once.
     *
     * ### Example
     * ```typescript
     * controller.setTargetOffset(0, 5, 0);
     * ```
     *
     * @param x -
     * [KO] X축 오프셋
     * [EN] X-axis offset
     * @param y -
     * [KO] Y축 오프셋 (기본값: 0)
     * [EN] Y-axis offset (default: 0)
     * @param z -
     * [KO] Z축 오프셋 (기본값: 0)
     * [EN] Z-axis offset (default: 0)
     */
    setTargetOffset(x: number, y?: number, z?: number): void;
    /**
     * [KO] 매 프레임마다 카메라의 위치와 방향을 업데이트합니다.
     * [EN] Updates the camera's position and orientation every frame.
     *
     * @param view -
     * [KO] 카메라가 속한 3D 뷰
     * [EN] The 3D view the camera belongs to
     * @param time -
     * [KO] 현재 시간 (ms)
     * [EN] Current time (ms)
     */
    update(view: View3D, time: number): void;
}
export default FollowController;
