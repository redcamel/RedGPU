import RedGPUContext from "../../context/RedGPUContext";
/**
 * The ResourceBase class manages the RedGPUContext instance.
 *
 * @class
 */
declare class ResourceBase {
    #private;
    constructor(redGPUContext: RedGPUContext, resourceManagerKey?: string);
    get cacheKey(): string;
    set cacheKey(value: string);
    get resourceManagerKey(): string;
    get name(): string;
    set name(value: string);
    /**
     * Retrieves the UUID of the object.
     *
     * @returns {string} The UUID of the object.
     */
    get uuid(): string;
    /** Retrieves the GPU device associated with the current instance.
     *
     * @returns {GPUDevice} The GPU device.
     */
    get gpuDevice(): GPUDevice;
    /**
     * Retrieves the RedGPUContext instance.
     *
     * @returns {RedGPUContext} The RedGPUContext instance.
     */
    get redGPUContext(): RedGPUContext;
    /**
     * Adds a listener function to the dirty pipeline listeners array.
     * This function will be called when the pipeline becomes dirty.
     *
     * @param {Function} listener - The listener function to be added.
     */
    __addDirtyPipelineListener(listener: () => void): void;
    /**
     * Removes a dirty pipeline listener from the list of listeners.
     *
     * @param {Function} listener - The listener function to be removed.
     */
    __removeDirtyPipelineListener(listener: () => void): void;
    /**
     * Fires the dirty listeners list.
     *
     * @param {boolean} [resetList=false] - Indicates whether to reset the dirty listeners list after firing.
     */
    __fireListenerList(resetList?: boolean): void;
}
export default ResourceBase;
