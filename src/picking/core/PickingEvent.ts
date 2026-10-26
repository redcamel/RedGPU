import {vec2, vec3} from "gl-matrix";
import Mesh from "../../display/mesh/Mesh";
import {RayIntersectResult} from "../Raycaster3D";
import Ray from "../../math/Ray";

/**
 * [KO] 마우스 피킹 및 레이캐스팅 교차 결과 정보를 담는 이벤트 클래스입니다.
 * [EN] Event class containing mouse picking and raycasting intersection result information.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
 *     console.log(e.pickingId, e.target);
 *     console.log(e.localX, e.localY, e.localZ);
 *     console.log(e.distance, e.uv, e.localPoint);
 * });
 * ```
 *
 * @category Picking
 */
class PickingEvent {
    /**
     * [KO] 색상 기반 피킹에 사용되는 고유 피킹 ID
     * [EN] Unique picking ID used for color-based picking
     */
    pickingId: number;
    /**
     * [KO] 캔버스 기준 마우스 X 좌표
     * [EN] Canvas-relative mouse X coordinate
     */
    mouseX: number;
    /**
     * [KO] 캔버스 기준 마우스 Y 좌표
     * [EN] Canvas-relative mouse Y coordinate
     */
    mouseY: number;
    /**
     * [KO] 이벤트가 발생한 대상 메시
     * [EN] Target mesh where the event occurred
     */
    target: Mesh;
    /**
     * [KO] 이벤트 발생 시각 (ms)
     * [EN] Event occurrence time (ms)
     */
    time: number;
    /**
     * [KO] 피킹 이벤트 타입 (`PICKING_EVENT_TYPE`)
     * [EN] Picking event type (`PICKING_EVENT_TYPE`)
     */
    type: string;
    /**
     * [KO] 이전 이벤트 대비 마우스 X축 이동량 (기본값: `0`)
     * [EN] Mouse X-axis movement relative to the previous event (default: `0`)
     */
    movementX: number = 0;
    /**
     * [KO] 이전 이벤트 대비 마우스 Y축 이동량 (기본값: `0`)
     * [EN] Mouse Y-axis movement relative to the previous event (default: `0`)
     */
    movementY: number = 0;
    /**
     * [KO] 월드 공간상의 교차 지점 좌표
     * [EN] Intersection point coordinates in world space
     */
    point: vec3 = vec3.create();
    /**
     * [KO] 카메라와 교차 지점 사이의 거리
     * [EN] Distance between the camera and the intersection point
     */
    distance: number = 0;
    /**
     * [KO] 대상 객체 로컬 공간상의 교차 지점 좌표
     * [EN] Intersection point coordinates in the target object's local space
     */
    localPoint: vec3 = vec3.create();
    /**
     * [KO] 로컬 교차 지점의 X 좌표 (기본값: `0`)
     * [EN] Local X coordinate of the intersection point (default: `0`)
     */
    localX: number = 0;
    /**
     * [KO] 로컬 교차 지점의 Y 좌표 (기본값: `0`)
     * [EN] Local Y coordinate of the intersection point (default: `0`)
     */
    localY: number = 0;
    /**
     * [KO] 로컬 교차 지점의 Z 좌표 (기본값: `0`)
     * [EN] Local Z coordinate of the intersection point (default: `0`)
     */
    localZ: number = 0;
    /**
     * [KO] 교차 지점의 텍스처 UV 좌표
     * [EN] Texture UV coordinates at the intersection point
     */
    uv: vec2 = vec2.create();
    /**
     * [KO] 교차 검사에 사용된 월드 광선(`Ray`)
     * [EN] World `Ray` used for the intersection test
     */
    ray: Ray;
    /**
     * [KO] 교차된 삼각형 면의 인덱스 (기본값: `-1`)
     * [EN] Index of the intersected triangle face (default: `-1`)
     */
    faceIndex: number = -1;
    /**
     * [KO] 이벤트 발생 시 `Alt` 키 눌림 여부 (기본값: `false`)
     * [EN] Whether the `Alt` key was pressed when the event occurred (default: `false`)
     */
    altKey: boolean = false;
    /**
     * [KO] 이벤트 발생 시 `Ctrl` 키 눌림 여부 (기본값: `false`)
     * [EN] Whether the `Ctrl` key was pressed when the event occurred (default: `false`)
     */
    ctrlKey: boolean = false;
    /**
     * [KO] 이벤트 발생 시 `Shift` 키 눌림 여부 (기본값: `false`)
     * [EN] Whether the `Shift` key was pressed when the event occurred (default: `false`)
     */
    shiftKey: boolean = false;

    /**
     * [KO] PickingEvent 인스턴스를 생성합니다.
     * [EN] Creates a PickingEvent instance.
     *
     * @param pickingId -
     * [KO] 피킹 ID
     * [EN] Picking ID
     * @param mouseX -
     * [KO] 캔버스 기준 마우스 X 좌표
     * [EN] Canvas-relative mouse X coordinate
     * @param mouseY -
     * [KO] 캔버스 기준 마우스 Y 좌표
     * [EN] Canvas-relative mouse Y coordinate
     * @param target -
     * [KO] 이벤트 대상 메시
     * [EN] Event target mesh
     * @param time -
     * [KO] 이벤트 발생 시각 (ms)
     * [EN] Event occurrence time (ms)
     * @param type -
     * [KO] 피킹 이벤트 타입
     * [EN] Picking event type
     * @param nativeEvent -
     * [KO] 원본 브라우저 `MouseEvent` 객체
     * [EN] Native browser `MouseEvent` object
     * @param hit -
     * [KO] 레이캐스팅 교차 상세 결과 (선택)
     * [EN] Detailed raycasting intersection result (optional)
     */
    constructor(pickingId: number, mouseX: number, mouseY: number, target: Mesh, time: number, type: string, nativeEvent: MouseEvent, hit?: RayIntersectResult) {
        this.pickingId = pickingId;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.target = target;
        this.time = time;
        this.type = type;
        this.altKey = nativeEvent.altKey;
        this.ctrlKey = nativeEvent.ctrlKey;
        this.shiftKey = nativeEvent.shiftKey;

        if (hit) {
            this.point = hit.point;
            this.localPoint = hit.localPoint;
            this.localX = hit.localPoint[0];
            this.localY = hit.localPoint[1];
            this.localZ = hit.localPoint[2];
            this.distance = hit.distance;
            this.faceIndex = hit.faceIndex;
            this.uv = hit.uv;
            this.ray = hit.ray;
        }
    }
}

Object.freeze(PickingEvent);
export default PickingEvent;