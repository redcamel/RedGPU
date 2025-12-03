import StorageBuffer from "../../../buffer/storageBuffer/StorageBuffer";

class ResourceStateStorageBuffer {
    static dirtyList = []
    buffer: StorageBuffer
    uuid: string | number
    #useNum: number = 0

    constructor(buffer: StorageBuffer) {
        this.buffer = buffer
        this.uuid = buffer.uuid
    }

    get useNum(): number {
        return this.#useNum;
    }

    set useNum(value: number) {
        this.#useNum = value;
        ResourceStateStorageBuffer.dirtyList.push(this)
    }
}

export default ResourceStateStorageBuffer;
