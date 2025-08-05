import RedGPUContext from "../../../context/RedGPUContext";
import calculateTextureByteSize from "../../../utils/math/calculateTextureByteSize";
import ManagementResourceBase from "../../ManagementResourceBase";
import ResourceStateCubeTexture from "../../resourceManager/resourceState/texture/ResourceStateCubeTexture";
import CubeTexture from "../CubeTexture";

const MANAGED_STATE_KEY = 'managedCubeTextureState'

class IBLCubeTexture extends ManagementResourceBase {
	#gpuTexture: GPUTexture
	#mipLevelCount: number
	#useMipmap: boolean = true
	#videoMemorySize: number = 0
	#format: GPUTextureFormat

	constructor(
		redGPUContext: RedGPUContext,
		cacheKey: string,
		gpuTexture?: GPUTexture,
	) {
		super(redGPUContext, MANAGED_STATE_KEY);
		this.cacheKey = cacheKey;
		const {table} = this.targetResourceManagedState
		if (cacheKey) {
			let target: ResourceStateCubeTexture = table.get(cacheKey)
			if (target) {
				const targetTexture = target.texture as IBLCubeTexture
				return targetTexture
			} else {
				if (gpuTexture) {
					this.#setGpuTexture(gpuTexture)
				}
				this.#registerResource()
			}
		}
	}

	get viewDescriptor() {
		return {
			...CubeTexture.defaultViewDescriptor,
			mipLevelCount: this.#mipLevelCount
		}
	}

	get format(): GPUTextureFormat {
		return this.#format;
	}

	get videoMemorySize(): number {
		return this.#videoMemorySize;
	}

	get gpuTexture(): GPUTexture {
		return this.#gpuTexture;
	}

	set gpuTexture(gpuTexture: GPUTexture) {
		this.#setGpuTexture(gpuTexture)
	}

	get mipLevelCount(): number {
		return this.#mipLevelCount;
	}

	get useMipmap(): boolean {
		return this.#useMipmap;
	}

	destroy() {
		const temp = this.#gpuTexture
		this.#setGpuTexture(null);
		this.__fireListenerList(true)
		this.#unregisterResource()
		this.cacheKey = null
		if (temp) temp.destroy()
	}

	#setGpuTexture(value: GPUTexture) {
		this.targetResourceManagedState.videoMemory -= this.#videoMemorySize;
		this.#gpuTexture = value;
		if (value) {
			this.#mipLevelCount = value.mipLevelCount
			this.#useMipmap = value.mipLevelCount > 1
			this.#format = value.format
			this.#videoMemorySize = calculateTextureByteSize(value)
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

Object.freeze(IBLCubeTexture)
export default IBLCubeTexture
