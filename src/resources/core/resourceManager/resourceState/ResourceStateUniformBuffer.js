class ResourceStateUniformBuffer {
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
        ResourceStateUniformBuffer.dirtyList.push(this);
    }
}
export default ResourceStateUniformBuffer;
