import VertexBuffer from "../../../buffer/vertexBuffer/VertexBuffer";
declare class ResourceStateVertexBuffer {
    #private;
    static dirtyList: any[];
    buffer: VertexBuffer;
    label: string | number;
    uuid: string | number;
    constructor(buffer: VertexBuffer);
    get useNum(): number;
    set useNum(value: number);
}
export default ResourceStateVertexBuffer;
