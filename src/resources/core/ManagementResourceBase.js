import consoleAndThrowError from "../../utils/consoleAndThrowError";
import ResourceBase from "./ResourceBase";
/**
 * The ResourceBase class manages the RedGPUContext instance.
 *
 * @class
 */
class ManagementResourceBase extends ResourceBase {
    #targetResourceManagedState;
    constructor(redGPUContext, resourceManagerKey) {
        super(redGPUContext, resourceManagerKey);
        if (!resourceManagerKey) {
            consoleAndThrowError('need managedStateKey', this.constructor.name);
        }
        this.#targetResourceManagedState = redGPUContext.resourceManager[resourceManagerKey];
        if (!this.#targetResourceManagedState) {
            consoleAndThrowError(resourceManagerKey, 'is not exist in RedGPUContext.resourceManager', this.constructor.name);
        }
    }
    get targetResourceManagedState() {
        return this.#targetResourceManagedState;
    }
}
export default ManagementResourceBase;
