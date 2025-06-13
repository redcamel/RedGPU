import RedGPUContext from "../../../context/RedGPUContext";
import ManagedResourceBase from "../../ManagedResourceBase";

/**
 * @class
 * @classdesc Represents a uniform buffer in RedGPU.
 * @extends ResourceBase
 */
class ABaseBuffer extends ManagedResourceBase {
	readonly #usage: GPUBufferUsageFlags

	constructor(
		redGPUContext: RedGPUContext,
		managedStateKey: string,
		usage: GPUBufferUsageFlags,
	) {
		super(redGPUContext, managedStateKey)
		this.#usage = usage
	}

	get usage(): GPUBufferUsageFlags {
		return this.#usage;
	}
}

export default ABaseBuffer
