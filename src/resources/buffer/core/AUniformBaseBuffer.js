import ABaseBuffer, { GPU_BUFFER_DATA_SYMBOL, GPU_BUFFER_SYMBOL } from "./ABaseBuffer";
/**
 * @class
 * @classdesc Represents a uniform buffer in RedGPU.
 * @extends ResourceBase
 */
class AUniformBaseBuffer extends ABaseBuffer {
    [GPU_BUFFER_DATA_SYMBOL];
    #uniformBufferDescriptor;
    #size;
    constructor(redGPUContext, MANAGED_STATE_KEY, usage, data, label = '') {
        super(redGPUContext, MANAGED_STATE_KEY, usage);
        this.#size = data.byteLength;
        this.#uniformBufferDescriptor = {
            size: this.#size,
            usage: this.usage,
            label
        };
        try {
            this[GPU_BUFFER_SYMBOL] = redGPUContext.gpuDevice.createBuffer(this.#uniformBufferDescriptor);
        }
        catch (error) {
            console.error('GPU 버퍼 생성에 실패했습니다:', error);
        }
        redGPUContext.gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], 0, data);
        this[GPU_BUFFER_DATA_SYMBOL] = data;
    }
    get data() {
        // TODO 굳이 열어주긴했따만... 유니폼버퍼의 데이터를 열어줄 필요가 있는가?
        return this[GPU_BUFFER_DATA_SYMBOL];
    }
    get size() {
        return this.#size;
    }
    get uniformBufferDescriptor() {
        return this.#uniformBufferDescriptor;
    }
    writeOnlyBuffer(target, value) {
        this.redGPUContext.gpuDevice.queue.writeBuffer(this.gpuBuffer, target.uniformOffset, new target.View(typeof value === "number" ? [value] : value));
    }
}
export default AUniformBaseBuffer;
