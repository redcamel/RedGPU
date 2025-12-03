import Mesh from "../../display/mesh/Mesh";

/**
 * `PickingEvent` 클래스는 마우스 이벤트와 관련된 정보를 캡슐화합니다.
 * - 마우스 좌표, 이벤트 타입, 대상 메쉬 등 다양한 속성을 포함합니다.
 * - 마우스 이벤트 처리 시 유용한 정보를 제공합니다.
 */
class PickingEvent {
    pickingId: number;
    mouseX: number;
    mouseY: number;
    target: Mesh;
    time: number;
    type: string;
    movementX: number = 0;
    movementY: number = 0;
    localX: number = 0;
    localY: number = 0;
    localZ: number = 0;
    altKey: boolean = false;
    ctrlKey: boolean = false;
    shiftKey: boolean = false;

    constructor(pickingId: number, mouseX: number, mouseY: number, target: Mesh, time: number, type: string, nativeEvent: MouseEvent) {
        this.pickingId = pickingId;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.target = target;
        this.time = time;
        this.type = type;
        this.altKey = nativeEvent.altKey;
        this.ctrlKey = nativeEvent.ctrlKey;
        this.shiftKey = nativeEvent.shiftKey;
    }
}

export default PickingEvent;
