import RedGPUContext from "../../../context/RedGPUContext";
import basicUnregisterResource from "../../resourceManager/core/basicUnregisterResource";
import ABaseBuffer from "./ABaseBuffer";

/**
 * @class
 * @classdesc Represents a uniform buffer in RedGPU.
 * @extends ResourceBase
 */
class AUniformBaseBuffer extends ABaseBuffer {
    readonly #uniformBufferDescriptor: GPUBufferDescriptor
    readonly #size: number
    #data: ArrayBuffer
    #gpuBuffer: GPUBuffer

    constructor(
        redGPUContext: RedGPUContext,
        MANAGED_STATE_KEY: string,
        usage: GPUBufferUsageFlags,
        data: ArrayBuffer,
        label: string = ''
    ) {
        super(redGPUContext, MANAGED_STATE_KEY, usage)
        this.#size = data.byteLength
        this.#uniformBufferDescriptor = {
            size: this.#size,
            usage: this.usage,
            label
        };
        try {
            this.#gpuBuffer = redGPUContext.gpuDevice.createBuffer(this.#uniformBufferDescriptor);
        } catch (error) {
            console.error('GPU 버퍼 생성에 실패했습니다:', error);
        }
        redGPUContext.gpuDevice.queue.writeBuffer(this.#gpuBuffer, 0, data);
    }

    get gpuBuffer(): GPUBuffer {
        return this.#gpuBuffer;
    }

    get data() {
        return this.#data
    }

    get size(): number {
        return this.#size;
    }

    get uniformBufferDescriptor(): GPUBufferDescriptor {
        return this.#uniformBufferDescriptor;
    }

    destroy() {
        const temp = this.#gpuBuffer
        if (temp) {
            this.#gpuBuffer = null
            this.__fireListenerList(true)
            basicUnregisterResource(this)
            if (temp) temp.destroy()
        }
    }

    writeBuffers(targetList: [taregt: any, value: any][]) {
        const {gpuDevice} = this.redGPUContext
        let i = targetList.length
        while (i--) {
            const [target, value] = targetList[i]
            gpuDevice.queue.writeBuffer(
                this.gpuBuffer,
                target.uniformOffset,
                new target.View(typeof value === "number" ? [value] : value),
            )
        }
    }

    writeBuffer(target: any, value: any) {
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.gpuBuffer,
            target.uniformOffset,
            new target.View(typeof value === "number" ? [value] : value),
        )
    }
}

export default AUniformBaseBuffer
