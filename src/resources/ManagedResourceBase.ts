import RedGPUContext from "../context/RedGPUContext";
import consoleAndThrowError from "../utils/consoleAndThrowError";
import ResourceBase from "./ResourceBase";
import ResourceStatusInfo from "./resourceManager/resourceState/ResourceStatusInfo";

/**
 * The ResourceBase class manages the RedGPUContext instance.
 *
 * @class
 */
class ManagedResourceBase extends ResourceBase {
	readonly #targetResourceManagedState: ResourceStatusInfo

	constructor(redGPUContext: RedGPUContext, managedStateKey: string,) {
		super(redGPUContext)
		this.#targetResourceManagedState = redGPUContext.resourceManager[managedStateKey]
		if (!this.#targetResourceManagedState) {
			consoleAndThrowError('need managedStateKey', this.constructor.name)
		}
	}

	get targetResourceManagedState(): ResourceStatusInfo {
		return this.#targetResourceManagedState;
	}
}

export default ManagedResourceBase


