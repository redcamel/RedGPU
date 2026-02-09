import { vec3, vec2 } from "gl-matrix";
import Mesh from "../../display/mesh/Mesh";
import { RayIntersectResult } from "../Raycaster3D";
import Ray from "../../math/Ray";
/**
 * [KO] 마우스 이벤트 관련 정보를 캡슐화한 클래스입니다.
 * [EN] Class encapsulating information related to mouse events.
 *
 * [KO] 마우스 좌표, 이벤트 타입, 대상 메쉬 등 다양한 속성을 포함하며, 이벤트 처리 시 유용한 정보를 제공합니다.
 * [EN] Includes various properties such as mouse coordinates, event type, target mesh, providing useful information during event processing.
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
declare class PickingEvent {
    /**
     * [KO] 피킹 ID (색상 기반 피킹에 사용되는 고유 값)
     * [EN] Picking ID (Unique value used for color-based picking)
     */
    pickingId: number;
    /**
     * [KO] 마우스 X 좌표 (캔버스 기준)
     * [EN] Mouse X coordinate (Canvas relative)
     */
    mouseX: number;
    /**
     * [KO] 마우스 Y 좌표 (캔버스 기준)
     * [EN] Mouse Y coordinate (Canvas relative)
     */
    mouseY: number;
    /**
     * [KO] 이벤트가 발생한 대상 메쉬
     * [EN] The target mesh where the event occurred
     */
    target: Mesh;
    /**
     * [KO] 이벤트 발생 시간
     * [EN] Event occurrence time
     */
    time: number;
    /**
     * [KO] 이벤트 타입 (PICKING_EVENT_TYPE 참조)
     * [EN] Event type (See PICKING_EVENT_TYPE)
     */
    type: string;
    /**
     * [KO] 이전 이벤트 대비 마우스 X 이동량
     * [EN] Mouse X movement compared to the previous event
     * @defaultValue 0
     */
    movementX: number;
    /**
     * [KO] 이전 이벤트 대비 마우스 Y 이동량
     * [EN] Mouse Y movement compared to the previous event
     * @defaultValue 0
     */
    movementY: number;
    /**
     * [KO] 월드 공간상의 교차 지점 좌표
     * [EN] Intersection point coordinates in world space
     */
    point: vec3;
    /**
     * [KO] 카메라와 교차 지점 사이의 거리
     * [EN] Distance between the camera and the intersection point
     */
    distance: number;
    /**
     * [KO] 객체의 로컬 공간상의 교차 지점 좌표
     * [EN] Intersection point coordinates in the object's local space
     */
    localPoint: vec3;
    /**
     * [KO] 로컬 X 좌표
     * [EN] Local X coordinate
     * @defaultValue 0
     */
    localX: number;
    /**
     * [KO] 로컬 Y 좌표
     * [EN] Local Y coordinate
     * @defaultValue 0
     */
    localY: number;
    /**
     * [KO] 로컬 Z 좌표
     * [EN] Local Z coordinate
     * @defaultValue 0
     */
    localZ: number;
    /**
     * [KO] 교차 지점의 UV 좌표 (텍스처 좌표)
     * [EN] UV coordinates at the intersection point (Texture coordinates)
     */
    uv: vec2;
    /**
     * [KO] 교차 검사에 사용된 월드 광선
     * [EN] World ray used for intersection test
     */
    ray: Ray;
    /**
     * [KO] 교차된 삼각형의 인덱스 (3D의 경우)
     * [EN] Index of the intersected triangle (For 3D)
     */
    faceIndex: number;
    /**
     * [KO] Alt 키 눌림 여부
     * [EN] Whether the Alt key is pressed
     * @defaultValue false
     */
    altKey: boolean;
    /**
     * [KO] Ctrl 키 눌림 여부
     * [EN] Whether the Ctrl key is pressed
     * @defaultValue false
     */
    ctrlKey: boolean;
    /**
     * [KO] Shift 키 눌림 여부
     * [EN] Whether the Shift key is pressed
     * @defaultValue false
     */
    shiftKey: boolean;
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
    constructor(pickingId: number, mouseX: number, mouseY: number, target: Mesh, time: number, type: string, nativeEvent: MouseEvent, hit?: RayIntersectResult);
}
export default PickingEvent;
