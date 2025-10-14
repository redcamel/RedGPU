class ResourceStateVertexBuffer {
    static dirtyList = [];
    buffer;
    label;
    uuid;
    #useNum = 0;
    constructor(buffer) {
        this.buffer = buffer;
        this.label = buffer.name;
        this.uuid = buffer.uuid;
    }
    get useNum() {
        return this.#useNum;
    }
    set useNum(value) {
        this.#useNum = value;
        ResourceStateVertexBuffer.dirtyList.push(this);
    }
}
export default ResourceStateVertexBuffer;
