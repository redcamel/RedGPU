/**
 * `PickingEvent` 클래스는 마우스 이벤트와 관련된 정보를 캡슐화합니다.
 * - 마우스 좌표, 이벤트 타입, 대상 메쉬 등 다양한 속성을 포함합니다.
 * - 마우스 이벤트 처리 시 유용한 정보를 제공합니다.
 */
class PickingEvent {
    pickingId;
    mouseX;
    mouseY;
    target;
    time;
    type;
    movementX = 0;
    movementY = 0;
    localX = 0;
    localY = 0;
    localZ = 0;
    altKey = false;
    ctrlKey = false;
    shiftKey = false;
    constructor(pickingId, mouseX, mouseY, target, time, type, nativeEvent) {
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
