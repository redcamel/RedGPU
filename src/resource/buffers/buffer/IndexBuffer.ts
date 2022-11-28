import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUContextBase from "../../../context/RedGPUContextBase";


/**
 * IndexBuffer
 */
class IndexBuffer extends RedGPUContextBase {
    #gpuBuffer: GPUBuffer
    get gpuBuffer(): GPUBuffer {
        return this.#gpuBuffer;
    }

    #indexNum: GPUSize64
    get indexNum(): GPUSize64 {
        return this.#indexNum;
    }

    #byteLength: GPUSize64
    get byteLength(): GPUSize64 {
        return this.#byteLength;
    }

    #descriptor: GPUBufferDescriptor
    get descriptor(): GPUBufferDescriptor {
        return this.#descriptor;
    }

    #usage: GPUSize64
    get usage(): GPUSize64 {
        return this.#usage;
    }

    /**
     * IndexBuffer
     */
    constructor(redGPUContext: RedGPUContext, data: Uint32Array, usage: GPUSize64 = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST) {
        super(redGPUContext)

        this.#indexNum = data.length
        this.#byteLength = data.byteLength
        this.#usage = usage
        this.#descriptor = {
            size: data.byteLength,
            usage: this.#usage
        };


        this.#gpuBuffer = this.redGPUContext.gpuDevice.createBuffer(this.#descriptor);

        this.update(0, data)
        // console.log(this)
    }

    update(gpuBufferOffset: GPUSize64, data: | BufferSource | SharedArrayBuffer, dataOffset?: GPUSize64, size?: GPUSize64) {
        this.redGPUContext.gpuDevice.queue.writeBuffer(this.#gpuBuffer, gpuBufferOffset, data, dataOffset, size);
    }

    destroy() {
        //TODO
    }
}

export default IndexBuffer

