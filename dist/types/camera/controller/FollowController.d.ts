import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
/**
 * 특정 타겟 메시를 따라다니는 3D 카메라 컨트롤러
 *
 * 카메라는 타겟 메시 주변을 구면 좌표계로 회전하며,
 * 거리(distance), 높이(height), 팬(pan), 틸트(tilt) 값을 통해 위치를 제어합니다.
 * 타겟 메시의 이동과 회전을 자동으로 추적하며, 부드러운 카메라 움직임을 위한
 * 보간(interpolation) 기능을 지원합니다.
 *
 * @category Controller
 * @example
 * ```typescript
 * const followController = new new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
 * followController.distance = 15;
 * followController.height = 8;
 * followController.pan = 45;
 * followController.tilt = 30;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/followController/"></iframe>
 */
declare class FollowController extends AController {
    #private;
    /**
     * FollowController 생성자
     *
     * @param {RedGPUContext} redGPUContext - RedGPU 컨텍스트
     * @param {Mesh} targetMesh - 따라갈 대상 메시
     * @throws {Error} targetMesh가 null이거나 undefined일 경우 에러 발생
     */
    constructor(redGPUContext: RedGPUContext, targetMesh: Mesh);
    /**
     * 타겟으로부터의 카메라 거리를 가져옵니다.
     *
     * @returns {number} 목표 거리 (0.1 이상)
     */
    get distance(): number;
    /**
     * 타겟으로부터의 카메라 거리를 설정합니다.
     *
     * @param {number} value - 설정할 거리 (0.1 이상)
     */
    set distance(value: number);
    /**
     * 거리 값의 보간 계수를 가져옵니다.
     *
     * @returns {number} 거리 보간 계수 (0.01 ~ 1)
     */
    get distanceInterpolation(): number;
    /**
     * 거리 값의 보간 계수를 설정합니다.
     * 낮을수록 부드러운 움직임, 높을수록 빠른 응답
     *
     * @param {number} value - 보간 계수 (0.01 ~ 1)
     */
    set distanceInterpolation(value: number);
    /**
     * 타겟으로부터의 카메라 높이를 가져옵니다.
     *
     * @returns {number} 목표 높이
     */
    get height(): number;
    /**
     * 타겟으로부터의 카메라 높이를 설정합니다.
     *
     * @param {number} value - 설정할 높이
     */
    set height(value: number);
    /**
     * 높이 값의 보간 계수를 가져옵니다.
     *
     * @returns {number} 높이 보간 계수 (0.01 ~ 1)
     */
    get heightInterpolation(): number;
    /**
     * 높이 값의 보간 계수를 설정합니다.
     *
     * @param {number} value - 보간 계수 (0.01 ~ 1)
     */
    set heightInterpolation(value: number);
    /**
     * 타겟을 중심으로 한 카메라의 가로 회전(팬) 각도를 가져옵니다.
     *
     * @returns {number} 팬 각도 (도 단위)
     */
    get pan(): number;
    /**
     * 타겟을 중심으로 한 카메라의 가로 회전(팬) 각도를 설정합니다.
     *
     * @param {number} value - 팬 각도 (도 단위)
     */
    set pan(value: number);
    /**
     * 팬 값의 보간 계수를 가져옵니다.
     *
     * @returns {number} 팬 보간 계수 (0.01 ~ 1)
     */
    get panInterpolation(): number;
    /**
     * 팬 값의 보간 계수를 설정합니다.
     *
     * @param {number} value - 보간 계수 (0.01 ~ 1)
     */
    set panInterpolation(value: number);
    /**
     * 타겟을 중심으로 한 카메라의 세로 회전(틸트) 각도를 가져옵니다.
     *
     * @returns {number} 틸트 각도 (도 단위, -89 ~ 89)
     */
    get tilt(): number;
    /**
     * 타겟을 중심으로 한 카메라의 세로 회전(틸트) 각도를 설정합니다.
     * -89도에서 89도 범위로 제한됩니다.
     *
     * @param {number} value - 틸트 각도 (도 단위)
     */
    set tilt(value: number);
    /**
     * 틸트 값의 보간 계수를 가져옵니다.
     *
     * @returns {number} 틸트 보간 계수 (0.01 ~ 1)
     */
    get tiltInterpolation(): number;
    /**
     * 틸트 값의 보간 계수를 설정합니다.
     *
     * @param {number} value - 보간 계수 (0.01 ~ 1)
     */
    set tiltInterpolation(value: number);
    /**
     * 전체 카메라 위치의 보간 계수를 가져옵니다.
     *
     * @returns {number} 보간 계수 (0.01 ~ 1)
     */
    get interpolation(): number;
    /**
     * 전체 카메라 위치의 보간 계수를 설정합니다.
     * 낮을수록 부드러운 움직임, 높을수록 빠른 응답
     *
     * @param {number} value - 보간 계수 (0.01 ~ 1)
     */
    set interpolation(value: number);
    /**
     * 타겟 메시의 회전을 따를지 여부를 가져옵니다.
     *
     * @returns {boolean} true일 경우 타겟의 회전을 따름
     */
    get followTargetRotation(): boolean;
    /**
     * 타겟 메시의 회전을 따를지 여부를 설정합니다.
     *
     * @param {boolean} value - true일 경우 타겟의 회전을 따름
     */
    set followTargetRotation(value: boolean);
    /**
     * 타겟으로부터의 카메라 X축 오프셋을 가져옵니다.
     *
     * @returns {number} X축 오프셋
     */
    get targetOffsetX(): number;
    /**
     * 타겟으로부터의 카메라 X축 오프셋을 설정합니다.
     *
     * @param {number} value - X축 오프셋
     */
    set targetOffsetX(value: number);
    /**
     * 타겟으로부터의 카메라 Y축 오프셋을 가져옵니다.
     *
     * @returns {number} Y축 오프셋
     */
    get targetOffsetY(): number;
    /**
     * 타겟으로부터의 카메라 Y축 오프셋을 설정합니다.
     *
     * @param {number} value - Y축 오프셋
     */
    set targetOffsetY(value: number);
    /**
     * 타겟으로부터의 카메라 Z축 오프셋을 가져옵니다.
     *
     * @returns {number} Z축 오프셋
     */
    get targetOffsetZ(): number;
    /**
     * 타겟으로부터의 카메라 Z축 오프셋을 설정합니다.
     *
     * @param {number} value - Z축 오프셋
     */
    set targetOffsetZ(value: number);
    /**
     * 따라갈 대상 메시를 가져옵니다.
     *
     * @returns {Mesh} 현재 타겟 메시
     */
    get targetMesh(): Mesh;
    /**
     * 따라갈 대상 메시를 설정합니다.
     * 새로운 타겟을 설정하면 카메라 위치가 재계산됩니다.
     *
     * @param {Mesh} value - 설정할 타겟 메시
     * @throws {Error} value가 null이거나 undefined일 경우 에러 발생
     */
    set targetMesh(value: Mesh);
    /**
     * 카메라의 타겟 오프셋을 한 번에 설정합니다.
     *
     * @param {number} x - X축 오프셋
     * @param {number} [y=0] - Y축 오프셋 (기본값: 0)
     * @param {number} [z=0] - Z축 오프셋 (기본값: 0)
     */
    setTargetOffset(x: number, y?: number, z?: number): void;
    /**
     * 매 프레임마다 카메라의 위치와 방향을 업데이트합니다.
     *
     * 현재 값들을 목표 값으로 보간하고, 카메라의 위치와 lookAt 대상을 설정합니다.
     *
     * @param {View3D} view - 카메라가 속한 3D 뷰
     * @param {number} time - 현재 시간 (ms)
     */
    update(view: View3D, time: number): void;
}
export default FollowController;
