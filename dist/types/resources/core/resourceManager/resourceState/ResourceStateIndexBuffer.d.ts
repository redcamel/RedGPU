import IndexBuffer from "../../../buffer/indexBuffer/IndexBuffer";
declare class ResourceStateIndexBuffer {
    #private;
    static dirtyList: any[];
    buffer: IndexBuffer;
    label: string | number;
    uuid: string | number;
    constructor(buffer: IndexBuffer);
    get useNum(): number;
    set useNum(value: number);
}
export default ResourceStateIndexBuffer;
