import RedGPUContext from "../context/RedGPUContext";
import validateRedGPUContext from "../runtimeChecker/validateFunc/validateRedGPUContext";
import createUUID from "../utils/createUUID";
import InstanceIdGenerator from "../utils/InstanceIdGenerator";

/**
 * The ResourceBase class manages the RedGPUContext instance.
 *
 * @class
 */
class ResourceBase {
    /**
     * Generates a Universally Unique Identifier (UUID).
     *
     * @returns {string} A string representing a UUID in the form "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".
     */
    #uuid: string = createUUID()
    readonly #redGPUContext: RedGPUContext
    readonly #gpuDevice: GPUDevice
    #name: string = ''
    #instanceId: number
    /**
     * An array to keep track of dirty listeners.
     *
     * @type {Array}
     */
    #dirtyListeners: any[] = [];

    constructor(redGPUContext: RedGPUContext) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.#gpuDevice = redGPUContext.gpuDevice
    }

    get name(): string {
        if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }

    set name(value: string) {
        this.#name = value;
    }

    /**
     * Retrieves the UUID of the object.
     *
     * @returns {string} The UUID of the object.
     */
    get uuid(): string {
        return this.#uuid;
    }

    /** Retrieves the GPU device associated with the current instance.
     *
     * @returns {GPUDevice} The GPU device.
     */
    get gpuDevice(): GPUDevice {
        return this.#gpuDevice;
    }

    /**
     * Retrieves the RedGPUContext instance.
     *
     * @returns {RedGPUContext} The RedGPUContext instance.
     */
    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /**
     * Adds a listener function to the dirty pipeline listeners array.
     * This function will be called when the pipeline becomes dirty.
     *
     * @param {Function} listener - The listener function to be added.
     */
    __addDirtyPipelineListener(listener: Function) {
        this.#manageResourceState(true);
        this.#dirtyListeners.push(listener);
    }

    /**
     * Removes a dirty pipeline listener from the list of listeners.
     *
     * @param {Function} listener - The listener function to be removed.
     */
    __removeDirtyPipelineListener(listener: Function) {
        const index = this.#dirtyListeners.indexOf(listener);
        if (index > -1) {
            this.#dirtyListeners.splice(index, 1);
            this.#manageResourceState(false);
        }
    }

    /**
     * Fires the dirty listeners list.
     *
     * @param {boolean} [resetList=false] - Indicates whether to reset the dirty listeners list after firing.
     */
    __fireListenerList(resetList: boolean = false) {
        // console.log('this.#dirtyListeners', this, this.#dirtyListeners)
        for (const listener of this.#dirtyListeners) listener(this);
        if (resetList) this.#dirtyListeners.length = 0
    }

    /**
     * Manages the state of a resource.
     *
     * @param {boolean} isAddingListener - Whether to add or remove a listener.
     */
    #manageResourceState(isAddingListener: boolean) {
        const {resourceManager} = this.#redGPUContext;
        // console.log('`managed${this.constructor.name}State`', `managed${this.constructor.name}State`)
        if (resourceManager) {
            const targetState = resourceManager[`managed${this.constructor.name}State`]?.table?.[this.#uuid];
            if (targetState) {
                isAddingListener ? targetState.useNum++ : targetState.useNum--;
            }
        }
    }
}

export default ResourceBase


