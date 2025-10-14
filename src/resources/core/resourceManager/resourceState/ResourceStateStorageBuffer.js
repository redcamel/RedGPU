class ResourceStateStorageBuffer {
    static dirtyList = [];
    buffer;
    uuid;
    #useNum = 0;
    constructor(buffer) {
        this.buffer = buffer;
        this.uuid = buffer.uuid;
    }
    get useNum() {
        return this.#useNum;
    }
    set useNum(value) {
        this.#useNum = value;
        ResourceStateStorageBuffer.dirtyList.push(this);
    }
}
export default ResourceStateStorageBuffer;
