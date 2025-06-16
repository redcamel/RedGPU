import GPU_BLEND_FACTOR from "../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../gpuConst/GPU_BLEND_OPERATION";
import consoleAndThrowError from "../utils/consoleAndThrowError";

const BLEND_FACTOR_LIST = Object.values(GPU_BLEND_FACTOR)
const BLEND_OPERATION_LIST = Object.values(GPU_BLEND_OPERATION)

class BlendState {
	state: GPUBlendComponent
	#srcFactor: GPUBlendFactor
	#dstFactor: GPUBlendFactor
	#operation: GPUBlendOperation
	#targetMaterial

	constructor(targetMaterial, srcFactor?: GPUBlendFactor, dstFactor?: GPUBlendFactor, operation?: GPUBlendOperation) {
		this.#targetMaterial = targetMaterial
		this.srcFactor = srcFactor
		this.dstFactor = dstFactor
		this.operation = operation
	}

	get operation(): GPUBlendOperation {
		return this.#operation;
	}

	set operation(newOperation: GPUBlendOperation) {
		if (!BLEND_OPERATION_LIST.includes(newOperation)) {
			consoleAndThrowError(`Invalid GPUBlendOperation: ${newOperation}. Valid operations are ${BLEND_OPERATION_LIST.join(', ')}`);
		}
		this.#operation = newOperation;
		this.#update();
	}

	get srcFactor(): GPUBlendFactor {
		return this.#srcFactor;
	}

	set srcFactor(newSrcFactor: GPUBlendFactor) {
		if (!BLEND_FACTOR_LIST.includes(newSrcFactor)) {
			consoleAndThrowError(`Invalid GPUBlendFactor: ${newSrcFactor}. Valid srcFactor factors are ${BLEND_FACTOR_LIST.join(', ')}`);
		}
		this.#srcFactor = newSrcFactor;
		this.#update();
	}

	get dstFactor(): GPUBlendFactor {
		return this.#dstFactor;
	}

	set dstFactor(newDstFactor: GPUBlendFactor) {
		if (!BLEND_FACTOR_LIST.includes(newDstFactor)) {
			consoleAndThrowError(`Invalid GPUBlendFactor: ${newDstFactor}. Valid dstFactor factors are ${BLEND_FACTOR_LIST.join(', ')}`);
		}
		this.#dstFactor = newDstFactor;
		this.#update();
	}

	#update() {
		const operationValue = this.#operation ? {operation: this.#operation} : {};
		const srcFactorValue = this.#srcFactor ? {srcFactor: this.#srcFactor} : {};
		const dstFactorValue = this.#dstFactor ? {dstFactor: this.#dstFactor} : {};
		this.state = {...operationValue, ...srcFactorValue, ...dstFactorValue};
		this.#targetMaterial.dirtyPipeline = true
	}
}

export default BlendState
