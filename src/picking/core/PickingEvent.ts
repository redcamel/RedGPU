import Mesh from "../../display/mesh/Mesh";

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
