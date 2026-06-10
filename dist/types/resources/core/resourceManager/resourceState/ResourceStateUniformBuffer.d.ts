import UniformBuffer from "../../../buffer/uniformBuffer/UniformBuffer";
declare class ResourceStateUniformBuffer {
    #private;
    static dirtyList: any[];
    buffer: UniformBuffer;
    uuid: string | number;
    constructor(buffer: UniformBuffer);
    get useNum(): number;
    set useNum(value: number);
}
export default ResourceStateUniformBuffer;
