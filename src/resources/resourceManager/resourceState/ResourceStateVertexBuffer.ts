import VertexBuffer from "../../buffer/vertexBuffer/VertexBuffer";

class ResourceStateVertexBuffer {
    static dirtyList = []
    buffer: VertexBuffer
    label: string | number
    uuid: string | number
    #useNum: number = 0

    constructor(buffer: VertexBuffer) {
        this.buffer = buffer
        this.label = buffer.name
        this.uuid = buffer.uuid
    }

    get useNum(): number {
        return this.#useNum;
    }

    set useNum(value: number) {
        this.#useNum = value;
        ResourceStateVertexBuffer.dirtyList.push(this)
    }
}

export default ResourceStateVertexBuffer;
