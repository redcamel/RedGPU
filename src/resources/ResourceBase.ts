import RedGPUContext from "../context/RedGPUContext";
import validateRedGPUContext from "../runtimeChecker/validateFunc/validateRedGPUContext";
import consoleAndThrowError from "../utils/consoleAndThrowError";
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
	#cacheKey: string
	get cacheKey(): string {
		return this.#cacheKey;
	}

	set cacheKey(value: string) {
		this.#cacheKey = value;
	}

	/**
	 * An array to keep track of dirty listeners.
	 *
	 * @type {Array}
	 */
	#dirtyListeners: any[] = [];
	#resourceManagerKey:string
	get resourceManagerKey(): string {
		return this.#resourceManagerKey;
	}

	constructor(redGPUContext: RedGPUContext,resourceManagerKey?:string) {
		validateRedGPUContext(redGPUContext)
		this.#resourceManagerKey = resourceManagerKey
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
	__addDirtyPipelineListener(listener:  ()=>void) {
		this.#manageResourceState(true);
		this.#dirtyListeners.push(listener);
	}

	/**
	 * Removes a dirty pipeline listener from the list of listeners.
	 *
	 * @param {Function} listener - The listener function to be removed.
	 */
	__removeDirtyPipelineListener(listener: ()=>void) {
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
		if(this.constructor.name ==='Sampler'){
			return
		}
		if (resourceManager ) {
			const targetResourceManagedState = resourceManager[this.#resourceManagerKey]
			if (!targetResourceManagedState) {
				consoleAndThrowError('need managedStateKey', this.constructor.name)
			}
			const targetState = targetResourceManagedState?.table.get(this.#cacheKey);

			if (targetState) {
				isAddingListener ? targetState.useNum++ : targetState.useNum--;
			}
		}
	}
}

export default ResourceBase


