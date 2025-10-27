import Mesh from "../../display/mesh/Mesh";
/**
 * `PickingEvent` 클래스는 마우스 이벤트와 관련된 정보를 캡슐화합니다.
 * - 마우스 좌표, 이벤트 타입, 대상 메쉬 등 다양한 속성을 포함합니다.
 * - 마우스 이벤트 처리 시 유용한 정보를 제공합니다.
 */
declare class PickingEvent {
    pickingId: number;
    mouseX: number;
    mouseY: number;
    target: Mesh;
    time: number;
    type: string;
    movementX: number;
    movementY: number;
    localX: number;
    localY: number;
    localZ: number;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    constructor(pickingId: number, mouseX: number, mouseY: number, target: Mesh, time: number, type: string, nativeEvent: MouseEvent);
}
export default PickingEvent;
