import RedGPUContext from "../../context/RedGPUContext";
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
 */
declare class OrbitController extends AController {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get name(): string;
    set name(value: string);
    get centerX(): number;
    set centerX(value: number);
    get centerY(): number;
    set centerY(value: number);
    get centerZ(): number;
    set centerZ(value: number);
    get distance(): number;
    set distance(value: number);
    get speedDistance(): number;
    set speedDistance(value: number);
    get delayDistance(): number;
    set delayDistance(value: number);
    get speedRotation(): number;
    set speedRotation(value: number);
    get delayRotation(): number;
    set delayRotation(value: number);
    get minTilt(): number;
    set minTilt(value: number);
    get maxTilt(): number;
    set maxTilt(value: number);
    get pan(): number;
    set pan(value: number);
    get tilt(): number;
    set tilt(value: number);
    update(view: View3D, time: number): void;
}
export default OrbitController;
