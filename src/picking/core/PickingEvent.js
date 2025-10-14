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
