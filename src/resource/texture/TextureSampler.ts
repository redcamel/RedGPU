import RedGPUContext from "../../context/RedGPUContext";
import RedGPUContextBase from "../../context/RedGPUContextBase";

class TextureSampler extends RedGPUContextBase {
	#optionString: string
	#gpuSampler: GPUSampler

	constructor(redGPUContext: RedGPUContext, option: GPUSamplerDescriptor = {}) {
		super(redGPUContext);
		const {resourceManager} = redGPUContext
		option = {
			...option,
			magFilter: option['magFilter'] || "linear",
			minFilter: option['minFilter'] || "linear",
			mipmapFilter: option['mipmapFilter'] || "linear",
			addressModeU: option['addressModeU'] || "repeat",
			addressModeV: option['addressModeV'] || "repeat",
			addressModeW: option['addressModeW'] || "repeat",
		};
		this.#optionString = Object.keys(option).map(key => {
			return `${key}:${option[key]}`
		}, []).join(' ')
		const resource = resourceManager.getResource(this)
		if (resource) {
			console.log('TextureSampler 캐시된 녀석을씀', resource)
			return resource
		} else {
			option['label'] = this.#optionString
			this.#gpuSampler = redGPUContext.gpuDevice.createSampler(option);
			resourceManager.addResource(this)
		}
	}

	get optionString(): string {
		return this.#optionString;
	}

	get gpuSampler(): GPUSampler {
		return this.#gpuSampler;
	}
}

export default TextureSampler
