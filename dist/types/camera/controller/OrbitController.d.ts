import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
/**
 * 오빗(Orbit) 카메라 컨트롤러 클래스입니다.
 * 마우스/터치 드래그로 회전, 휠로 줌, 중심점/거리/회전/틸트 등 다양한 파라미터를 지원합니다.
 * 여러 View3D에서 동시에 사용할 수 있습니다.
 *
 * @category Controller
 *
 * @example
 * ```javascript
 * const controller = new RedGPU.Camera.OrbitController(redGPUContext);
 * controller.centerX = 0;
 * controller.centerY = 0;
 * controller.centerZ = 0;
 * controller.distance = 20;
 * controller.tilt = -30;
 * controller.pan = 45;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/orbitController/"></iframe>
 */
declare class OrbitController extends AController {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /**
     * 회전 중심의 X축 좌표를 가져옵니다.
     * @returns {number} 중심점 X축 좌표
     */
    get centerX(): number;
    /**
     * 회전 중심의 X축 좌표를 설정합니다.
     * @param {number} value - 중심점 X축 좌표
     */
    set centerX(value: number);
    /**
     * 회전 중심의 Y축 좌표를 가져옵니다.
     * @returns {number} 중심점 Y축 좌표
     */
    get centerY(): number;
    /**
     * 회전 중심의 Y축 좌표를 설정합니다.
     * @param {number} value - 중심점 Y축 좌표
     */
    set centerY(value: number);
    /**
     * 회전 중심의 Z축 좌표를 가져옵니다.
     * @returns {number} 중심점 Z축 좌표
     */
    get centerZ(): number;
    /**
     * 회전 중심의 Z축 좌표를 설정합니다.
     * @param {number} value - 중심점 Z축 좌표
     */
    set centerZ(value: number);
    /**
     * 중심점으로부터 카메라까지의 거리를 가져옵니다.
     * @returns {number} 거리 값
     */
    get distance(): number;
    /**
     * 중심점으로부터 카메라까지의 거리를 설정합니다.
     * @param {number} value - 거리 값 (0 이상)
     */
    set distance(value: number);
    /**
     * 거리 조절 속도를 가져옵니다.
     * @returns {number} 거리 변화 속도
     */
    get speedDistance(): number;
    /**
     * 거리 조절 속도를 설정합니다. 높을수록 빠른 줌 속도
     * @param {number} value - 거리 변화 속도 (0.01 이상)
     */
    set speedDistance(value: number);
    /**
     * 거리 보간 계수를 가져옵니다.
     * @returns {number} 거리 보간 계수 (0.01 ~ 1)
     */
    get distanceInterpolation(): number;
    /**
     * 거리 보간 계수를 설정합니다. 낮을수록 부드러운 줌 이동
     * @param {number} value - 보간 계수 (0.01 ~ 1)
     */
    set distanceInterpolation(value: number);
    /**
     * 회전 속도를 가져옵니다.
     * @returns {number} 회전 속도 값
     */
    get speedRotation(): number;
    /**
     * 회전 속도를 설정합니다. 높을수록 빠른 회전 속도
     * @param {number} value - 회전 속도 값 (0.01 이상)
     */
    set speedRotation(value: number);
    /**
     * 회전 보간 계수를 가져옵니다.
     * @returns {number} 회전 보간 계수 (0.01 ~ 1)
     */
    get rotationInterpolation(): number;
    /**
     * 회전 보간 계수를 설정합니다. 낮을수록 부드러운 회전
     * @param {number} value - 보간 계수 (0.01 ~ 1)
     */
    set rotationInterpolation(value: number);
    /**
     * 카메라의 팬(가로 회전) 각도를 가져옵니다. (단위: 도)
     * @returns {number} 팬 각도 값
     */
    get pan(): number;
    /**
     * 카메라의 팬(가로 회전) 각도를 설정합니다. (단위: 도)
     * @param {number} value - 팬 각도 값
     */
    set pan(value: number);
    /**
     * 카메라의 틸트(세로 회전) 각도를 가져옵니다. (단위: 도, 범위: -90 ~ 90)
     * @returns {number} 틸트 각도 값
     */
    get tilt(): number;
    /**
     * 카메라의 틸트(세로 회전) 각도를 설정합니다. (단위: 도)
     * @param {number} value - 틸트 각도 값 (-90 ~ 90 범위로 제한됨)
     */
    set tilt(value: number);
    /**
     * 최소 틸트 각도를 가져옵니다.
     * @returns {number} 최소 틸트 각도
     */
    get minTilt(): number;
    /**
     * 최소 틸트 각도를 설정합니다.
     * @param {number} value - 최소 틸트 각도 (-90 ~ 90)
     */
    set minTilt(value: number);
    /**
     * 최대 틸트 각도를 가져옵니다.
     * @returns {number} 최대 틸트 각도
     */
    get maxTilt(): number;
    /**
     * 최대 틸트 각도를 설정합니다.
     * @param {number} value - 최대 틸트 각도 (-90 ~ 90)
     */
    set maxTilt(value: number);
    fitMeshToScreenCenter(mesh: Mesh, view: View3D): void;
    /**
     * 매 프레임마다 오빗 카메라를 업데이트합니다.
     * 회전(팬/틸트), 거리, 보간을 처리하고 카메라 위치를 계산합니다.
     *
     * @param {View3D} view - 카메라가 속한 3D 뷰
     * @param {number} time - 현재 시간 (ms)
     */
    update(view: View3D, time: number): void;
}
export default OrbitController;
