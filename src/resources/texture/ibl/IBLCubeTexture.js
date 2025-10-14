import calculateTextureByteSize from "../../../utils/texture/calculateTextureByteSize";
import ManagementResourceBase from "../../core/ManagementResourceBase";
import ResourceStateCubeTexture from "../../core/resourceManager/resourceState/texture/ResourceStateCubeTexture";
import CubeTexture from "../CubeTexture";
const MANAGED_STATE_KEY = 'managedCubeTextureState';
class IBLCubeTexture extends ManagementResourceBase {
    #gpuTexture;
    #mipLevelCount;
    #useMipmap = true;
    #videoMemorySize = 0;
    #format;
    constructor(redGPUContext, cacheKey, gpuTexture) {
        super(redGPUContext, MANAGED_STATE_KEY);
        this.cacheKey = cacheKey;
        const { table } = this.targetResourceManagedState;
        if (cacheKey) {
            let target = table.get(cacheKey);
            if (target) {
                const targetTexture = target.texture;
                return targetTexture;
            }
            else {
                if (gpuTexture) {
                    this.#setGpuTexture(gpuTexture);
                }
                this.#registerResource();
            }
        }
    }
    get viewDescriptor() {
        return {
            ...CubeTexture.defaultViewDescriptor,
            mipLevelCount: this.#mipLevelCount
        };
    }
    get format() {
        return this.#format;
    }
    get videoMemorySize() {
        return this.#videoMemorySize;
    }
    get gpuTexture() {
        return this.#gpuTexture;
    }
    set gpuTexture(gpuTexture) {
        this.#setGpuTexture(gpuTexture);
    }
    get mipLevelCount() {
        return this.#mipLevelCount;
    }
    get useMipmap() {
        return this.#useMipmap;
    }
    destroy() {
        const temp = this.#gpuTexture;
        this.#setGpuTexture(null);
        this.__fireListenerList(true);
        this.#unregisterResource();
        this.cacheKey = null;
        if (temp)
            temp.destroy();
    }
    #setGpuTexture(value) {
        this.targetResourceManagedState.videoMemory -= this.#videoMemorySize;
        this.#gpuTexture = value;
        if (value) {
            this.#mipLevelCount = value.mipLevelCount;
            this.#useMipmap = value.mipLevelCount > 1;
            this.#format = value.format;
            this.#videoMemorySize = calculateTextureByteSize(value);
        }
        this.targetResourceManagedState.videoMemory += this.#videoMemorySize;
        this.__fireListenerList();
    }
    #registerResource() {
        this.redGPUContext.resourceManager.registerManagementResource(this, new ResourceStateCubeTexture(this));
    }
    #unregisterResource() {
        this.redGPUContext.resourceManager.unregisterManagementResource(this);
    }
}
Object.freeze(IBLCubeTexture);
export default IBLCubeTexture;
