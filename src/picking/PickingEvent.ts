import { vec3, vec2 } from "gl-matrix";
import Mesh from "../display/mesh/Mesh";
import { RayIntersectResult } from "./Raycaster";

/**
 * [KO] 마우스 이벤트 관련 정보를 캡슐화한 클래스입니다.
 * [EN] Class encapsulating information related to mouse events.
 *
 * [KO] 마우스 좌표, 이벤트 타입, 대상 메쉬 등 다양한 속성을 포함하며, 이벤트 처리 시 유용한 정보를 제공합니다.
 * [EN] Includes various properties such as mouse coordinates, event type, target mesh, providing useful information during event processing.
 * * ### Example
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
     * [KO] 피킹 ID
     * [EN] Picking ID
     */
    pickingId: number;
    /**
     * [KO] 마우스 X 좌표
     * [EN] Mouse X coordinate
     */
    mouseX: number;
    /**
     * [KO] 마우스 Y 좌표
     * [EN] Mouse Y coordinate
     */
    mouseY: number;
    /**
     * [KO] 이벤트 대상 메쉬
     * [EN] Event target mesh
     */
    target: Mesh;
    /**
     * [KO] 이벤트 발생 시간
     * [EN] Event occurrence time
     */
    time: number;
    /**
     * [KO] 이벤트 타입
     * [EN] Event type
     */
    type: string;
    /**
     * [KO] 마우스 X 이동량
     * [EN] Mouse X movement
     * @defaultValue 0
     */
    movementX: number = 0;
    /**
     * [KO] 마우스 Y 이동량
     * [EN] Mouse Y movement
     * @defaultValue 0
     */
    movementY: number = 0;
    /**
     * [KO] 월드 공간상의 교차 지점
     * [EN] Intersection point in world space
     */
    point: vec3 = vec3.create();
    /**
     * [KO] 카메라와 교차 지점 사이의 거리
     * [EN] Distance between camera and intersection point
     */
    distance: number = 0;
    /**
     * [KO] 로컬 공간상의 교차 지점
     * [EN] Intersection point in local space
     */
    localPoint: vec3 = vec3.create();
    /**
     * [KO] 로컬 X 좌표
     * [EN] Local X coordinate
     * @defaultValue 0
     */
    localX: number = 0;
    /**
     * [KO] 로컬 Y 좌표
     * [EN] Local Y coordinate
     * @defaultValue 0
     */
    localY: number = 0;
    /**
     * [KO] 로컬 Z 좌표
     * [EN] Local Z coordinate
     * @defaultValue 0
     */
    localZ: number = 0;
    /**
     * [KO] 교차 지점의 UV 좌표
     * [EN] UV coordinates of the intersection point
     */
    uv: vec2 = vec2.create();
    /**
     * [KO] 교차된 삼각형의 인덱스
     * [EN] Index of the intersected triangle
     */
    faceIndex: number = -1;
    /**
     * [KO] Alt 키 눌림 여부
     * [EN] Whether Alt key is pressed
     * @defaultValue false
     */
    altKey: boolean = false;
    /**
     * [KO] Ctrl 키 눌림 여부
     * [EN] Whether Ctrl key is pressed
     * @defaultValue false
     */
    ctrlKey: boolean = false;
    /**
     * [KO] Shift 키 눌림 여부
     * [EN] Whether Shift key is pressed
     * @defaultValue false
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
     * [KO] 마우스 X 좌표
     * [EN] Mouse X coordinate
     * @param mouseY -
     * [KO] 마우스 Y 좌표
     * [EN] Mouse Y coordinate
     * @param target -
     * [KO] 이벤트 대상 메쉬
     * [EN] Event target mesh
     * @param time -
     * [KO] 이벤트 발생 시간
     * [EN] Event occurrence time
     * @param type -
     * [KO] 이벤트 타입
     * [EN] Event type
     * @param nativeEvent -
     * [KO] 네이티브 마우스 이벤트
     * [EN] Native mouse event
     * @param hit -
     * [KO] 레이캐스팅 교차 결과 (선택적)
     * [EN] Raycasting intersection result (optional)
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
		}
    }
}

export default PickingEvent;