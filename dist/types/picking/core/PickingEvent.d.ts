import Mesh from "../../display/mesh/Mesh";
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
