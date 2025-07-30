import RedGPUContext from "../context/RedGPUContext";
import consoleAndThrowError from "../utils/consoleAndThrowError";
import ResourceBase from "./ResourceBase";
import ResourceStatusInfo from "./resourceManager/resourceState/ResourceStatusInfo";

/**
 * The ResourceBase class manages the RedGPUContext instance.
 *
 * @class
 */
class ManagementResourceBase extends ResourceBase {
	readonly #targetResourceManagedState: ResourceStatusInfo

	constructor(redGPUContext: RedGPUContext, resourceManagerKey: string,) {
		super(redGPUContext,resourceManagerKey)
		if (!resourceManagerKey) {
			consoleAndThrowError('need managedStateKey', this.constructor.name)
		}
		this.#targetResourceManagedState = redGPUContext.resourceManager[resourceManagerKey]
		if (!this.#targetResourceManagedState) {
			consoleAndThrowError(resourceManagerKey , 'is not exist in RedGPUContext.resourceManager', this.constructor.name)
		}
	}

	get targetResourceManagedState(): ResourceStatusInfo {
		return this.#targetResourceManagedState;
	}
}

export default ManagementResourceBase


