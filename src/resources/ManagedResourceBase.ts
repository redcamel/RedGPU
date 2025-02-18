import RedGPUContext from "../context/RedGPUContext";
import ResourceBase from "./ResourceBase";
import ResourceState from "./resourceManager/resourceState/ResourceState";

/**
 * The ResourceBase class manages the RedGPUContext instance.
 *
 * @class
 */
class ManagedResourceBase extends ResourceBase {
    readonly #targetResourceManagedState: ResourceState

    constructor(redGPUContext: RedGPUContext, managedStateKey: string,) {
        super(redGPUContext)
        this.#targetResourceManagedState = redGPUContext.resourceManager[managedStateKey]
    }

    get targetResourceManagedState(): ResourceState {
        return this.#targetResourceManagedState;
    }
}

export default ManagedResourceBase


