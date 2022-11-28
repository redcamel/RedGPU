import RedGPUContext from "../../../context/RedGPUContext";
// import VertexBufferDescriptor from "./VertexBufferDescriptor";
import RedGPUContextBase from "../../../context/RedGPUContextBase";
import InterleaveInfo from "../interleaveInfo/InterleaveInfo";


/**
 * VertexBuffer
 */
class VertexBuffer extends RedGPUContextBase {
    #gpuBuffer: GPUBuffer
    get gpuBuffer(): GPUBuffer {
        return this.#gpuBuffer;
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

    #vertexCount = 0;
    get vertexCount() {
        return this.#vertexCount;
    }


    #interleaveInfo: InterleaveInfo

    get interleaveInfo(): InterleaveInfo {
        return this.#interleaveInfo;
    }

    get arrayStride(): number {
        return this.#interleaveInfo.arrayStride;
    }

    get attributes(): any[] {
        return this.#interleaveInfo.attributes;
    }

    constructor(redGPUContext: RedGPUContext, data: Float32Array, interleaveInfo: InterleaveInfo, usage: GPUSize64 = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) {
        super(redGPUContext)
        this.#interleaveInfo = interleaveInfo;
        this.#vertexCount = data.length / this.#interleaveInfo.stride;

        this.#byteLength = data.byteLength
        this.#usage = usage
        this.#descriptor = {
            size: this.#byteLength,
            usage: usage
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

export default VertexBuffer

