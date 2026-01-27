import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import AController from "../core/AController";
/**
 * [KO] 특정 지점을 중심으로 회전하는 궤도형 카메라 컨트롤러입니다.
 * [EN] Orbital camera controller that rotates around a specific point.
 *
 * [KO] 제품 모델링 뷰어나 3D 객체 관찰용으로 주로 사용되며, 중심점을 기준으로 줌, 회전, 팬(Pan) 동작을 통해 대상을 다각도에서 살펴볼 수 있습니다.
 * [EN] Primarily used for product modeling viewers or observing 3D objects, allowing the user to inspect the target from various angles via zoom, rotation, and pan operations around a center point.
 *
 * * ### Example
 * ```typescript
 * const controller = new RedGPU.Camera.OrbitController(redGPUContext);
 * controller.centerX = 0;
 * controller.centerY = 0;
 * controller.centerZ = 0;
 * controller.distance = 20;
 * controller.tilt = -30;
 * controller.pan = 45;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/orbitController/"></iframe>
 * @category Controller
 */
declare class OrbitController extends AController {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 회전 중심의 X축 좌표를 가져옵니다.
     * [EN] Gets the X-axis coordinate of the rotation center.
     *
     * @returns
     * [KO] 중심점 X축 좌표
     * [EN] Center point X-axis coordinate
     */
    get centerX(): number;
    /**
     * [KO] 회전 중심의 X축 좌표를 설정합니다.
     * [EN] Sets the X-axis coordinate of the rotation center.
     *
     * @param value -
     * [KO] 중심점 X축 좌표
     * [EN] Center point X-axis coordinate
     */
    set centerX(value: number);
    /**
     * [KO] 회전 중심의 Y축 좌표를 가져옵니다.
     * [EN] Gets the Y-axis coordinate of the rotation center.
     *
     * @returns
     * [KO] 중심점 Y축 좌표
     * [EN] Center point Y-axis coordinate
     */
    get centerY(): number;
    /**
     * [KO] 회전 중심의 Y축 좌표를 설정합니다.
     * [EN] Sets the Y-axis coordinate of the rotation center.
     *
     * @param value -
     * [KO] 중심점 Y축 좌표
     * [EN] Center point Y-axis coordinate
     */
    set centerY(value: number);
    /**
     * [KO] 회전 중심의 Z축 좌표를 가져옵니다.
     * [EN] Gets the Z-axis coordinate of the rotation center.
     *
     * @returns
     * [KO] 중심점 Z축 좌표
     * [EN] Center point Z-axis coordinate
     */
    get centerZ(): number;
    /**
     * [KO] 회전 중심의 Z축 좌표를 설정합니다.
     * [EN] Sets the Z-axis coordinate of the rotation center.
     *
     * @param value -
     * [KO] 중심점 Z축 좌표
     * [EN] Center point Z-axis coordinate
     */
    set centerZ(value: number);
    /**
     * [KO] 중심점으로부터 카메라까지의 거리를 가져옵니다.
     * [EN] Gets the distance from the center point to the camera.
     *
     * @returns
     * [KO] 거리 값
     * [EN] Distance value
     */
    get distance(): number;
    /**
     * [KO] 중심점으로부터 카메라까지의 거리를 설정합니다.
     * [EN] Sets the distance from the center point to the camera.
     *
     * @param value -
     * [KO] 거리 값 (0 이상)
     * [EN] Distance value (min 0)
     */
    set distance(value: number);
    /**
     * [KO] 거리 조절 속도를 가져옵니다.
     * [EN] Gets the distance adjustment speed.
     *
     * @returns
     * [KO] 거리 변화 속도
     * [EN] Distance change speed
     */
    get speedDistance(): number;
    /**
     * [KO] 거리 조절 속도를 설정합니다. 높을수록 빠른 줌 속도
     * [EN] Sets the distance adjustment speed. Higher values for faster zoom speed.
     *
     * @param value -
     * [KO] 거리 변화 속도 (0.01 이상)
     * [EN] Distance change speed (min 0.01)
     */
    set speedDistance(value: number);
    /**
     * [KO] 거리 보간 계수를 가져옵니다.
     * [EN] Gets the distance interpolation factor.
     *
     * @returns
     * [KO] 거리 보간 계수 (0.01 ~ 1)
     * [EN] Distance interpolation factor (0.01 ~ 1)
     */
    get distanceInterpolation(): number;
    /**
     * [KO] 거리 보간 계수를 설정합니다. 낮을수록 부드러운 줌 이동
     * [EN] Sets the distance interpolation factor. Lower values for smoother zoom movement.
     *
     * @param value -
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    set distanceInterpolation(value: number);
    /**
     * [KO] 회전 속도를 가져옵니다.
     * [EN] Gets the rotation speed.
     *
     * @returns
     * [KO] 회전 속도 값
     * [EN] Rotation speed value
     */
    get speedRotation(): number;
    /**
     * [KO] 회전 속도를 설정합니다. 높을수록 빠른 회전 속도
     * [EN] Sets the rotation speed. Higher values for faster rotation speed.
     *
     * @param value -
     * [KO] 회전 속도 값 (0.01 이상)
     * [EN] Rotation speed value (min 0.01)
     */
    set speedRotation(value: number);
    /**
     * [KO] 회전 보간 계수를 가져옵니다.
     * [EN] Gets the rotation interpolation factor.
     *
     * @returns
     * [KO] 회전 보간 계수 (0.01 ~ 1)
     * [EN] Rotation interpolation factor (0.01 ~ 1)
     */
    get rotationInterpolation(): number;
    /**
     * [KO] 회전 보간 계수를 설정합니다. 낮을수록 부드러운 회전
     * [EN] Sets the rotation interpolation factor. Lower values for smoother rotation.
     *
     * @param value -
     * [KO] 보간 계수 (0.01 ~ 1)
     * [EN] Interpolation factor (0.01 ~ 1)
     */
    set rotationInterpolation(value: number);
    /**
     * [KO] 카메라의 팬(가로 회전) 각도를 가져옵니다. (단위: 도)
     * [EN] Gets the camera's pan (horizontal rotation) angle. (Unit: degrees)
     *
     * @returns
     * [KO] 팬 각도 값
     * [EN] Pan angle value
     */
    get pan(): number;
    /**
     * [KO] 카메라의 팬(가로 회전) 각도를 설정합니다. (단위: 도)
     * [EN] Sets the camera's pan (horizontal rotation) angle. (Unit: degrees)
     *
     * @param value -
     * [KO] 팬 각도 값
     * [EN] Pan angle value
     */
    set pan(value: number);
    /**
     * [KO] 카메라의 틸트(세로 회전) 각도를 가져옵니다. (단위: 도, 범위: -90 ~ 90)
     * [EN] Gets the camera's tilt (vertical rotation) angle. (Unit: degrees, Range: -90 ~ 90)
     *
     * @returns
     * [KO] 틸트 각도 값
     * [EN] Tilt angle value
     */
    get tilt(): number;
    /**
     * [KO] 카메라의 틸트(세로 회전) 각도를 설정합니다. (단위: 도)
     * [EN] Sets the camera's tilt (vertical rotation) angle. (Unit: degrees)
     *
     * @param value -
     * [KO] 틸트 각도 값 (-90 ~ 90 범위로 제한됨)
     * [EN] Tilt angle value (limited to -90 ~ 90 range)
     */
    set tilt(value: number);
    /**
     * [KO] 최소 틸트 각도를 가져옵니다.
     * [EN] Gets the minimum tilt angle.
     *
     * @returns
     * [KO] 최소 틸트 각도
     * [EN] Minimum tilt angle
     */
    get minTilt(): number;
    /**
     * [KO] 최소 틸트 각도를 설정합니다.
     * [EN] Sets the minimum tilt angle.
     *
     * @param value -
     * [KO] 최소 틸트 각도 (-90 ~ 90)
     * [EN] Minimum tilt angle (-90 ~ 90)
     */
    set minTilt(value: number);
    /**
     * [KO] 최대 틸트 각도를 가져옵니다.
     * [EN] Gets the maximum tilt angle.
     *
     * @returns
     * [KO] 최대 틸트 각도
     * [EN] Maximum tilt angle
     */
    get maxTilt(): number;
    /**
     * [KO] 최대 틸트 각도를 설정합니다.
     * [EN] Sets the maximum tilt angle.
     *
     * @param value -
     * [KO] 최대 틸트 각도 (-90 ~ 90)
     * [EN] Maximum tilt angle (-90 ~ 90)
     */
    set maxTilt(value: number);
    /**
     * [KO] 메쉬가 화면 중앙에 꽉 차도록 카메라 거리를 자동으로 조절합니다.
     * [EN] Automatically adjusts the camera distance so that the mesh fills the screen center.
     *
     * * ### Example
     * ```typescript
     * controller.fitMeshToScreenCenter(mesh, view);
     * ```
     *
     * @param mesh -
     * [KO] 화면에 맞출 대상 메쉬
     * [EN] Target mesh to fit to the screen
     * @param view -
     * [KO] 현재 뷰 인스턴스
     * [EN] Current view instance
     */
    fitMeshToScreenCenter(mesh: Mesh, view: View3D): void;
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
    update(view: View3D, time: number): void;
}
export default OrbitController;
