import UniformBuffer from "../../../buffer/uniformBuffer/UniformBuffer";

class ResourceStateUniformBuffer {
    buffer: UniformBuffer
    uuid: string | number
    #useNum: number = 0

    constructor(buffer: UniformBuffer) {
        this.buffer = buffer
        this.uuid = buffer.uuid
    }

    get useNum(): number {
        return this.#useNum;
    }

    set useNum(value: number) {
        this.#useNum = value;
    }
}

export default ResourceStateUniformBuffer;
