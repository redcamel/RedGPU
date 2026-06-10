import StorageBuffer from "../../../buffer/storageBuffer/StorageBuffer";
declare class ResourceStateStorageBuffer {
    #private;
    static dirtyList: any[];
    buffer: StorageBuffer;
    uuid: string | number;
    constructor(buffer: StorageBuffer);
    get useNum(): number;
    set useNum(value: number);
}
export default ResourceStateStorageBuffer;
