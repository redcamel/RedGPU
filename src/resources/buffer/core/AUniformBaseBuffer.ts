import RedGPUContext from "../../../context/RedGPUContext";
import ABaseBuffer, {GPU_BUFFER_DATA_SYMBOL, GPU_BUFFER_SYMBOL} from "./ABaseBuffer";

/**
 * @class
 * @classdesc Represents a uniform buffer in RedGPU.
 * @extends ResourceBase
 * @category Buffer
 */
abstract class AUniformBaseBuffer extends ABaseBuffer {
	[GPU_BUFFER_DATA_SYMBOL]: ArrayBuffer
	readonly #uniformBufferDescriptor: GPUBufferDescriptor
	readonly #size: number

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
			this[GPU_BUFFER_SYMBOL] = redGPUContext.gpuDevice.createBuffer(this.#uniformBufferDescriptor);
		} catch (error) {
			console.error('GPU 버퍼 생성에 실패했습니다:', error);
		}
		redGPUContext.gpuDevice.queue.writeBuffer(this[GPU_BUFFER_SYMBOL], 0, data);
	}

	get size(): number {
		return this.#size;
	}

	get uniformBufferDescriptor(): GPUBufferDescriptor {
		return this.#uniformBufferDescriptor;
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
