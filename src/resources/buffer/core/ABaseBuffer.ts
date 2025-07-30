import RedGPUContext from "../../../context/RedGPUContext";
import ManagementResourceBase from "../../ManagementResourceBase";

/**
 * @class
 * @classdesc Represents a uniform buffer in RedGPU.
 * @extends ResourceBase
 */
class ABaseBuffer extends ManagementResourceBase {
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
