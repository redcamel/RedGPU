import VertexBuffer from "../../../buffer/vertexBuffer/VertexBuffer";
declare class ResourceStateVertexBuffer {
    #private;
    buffer: VertexBuffer;
    label: string | number;
    uuid: string | number;
    constructor(buffer: VertexBuffer);
    get useNum(): number;
    set useNum(value: number);
}
export default ResourceStateVertexBuffer;
