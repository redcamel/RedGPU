import Sampler from "../../sampler/Sampler";
import defineProperty_SETTING from "./defineProperty_SETTING";

function defineSampler(propertyKey: string) {
	const symbol = Symbol(propertyKey)
	return {
		get: function (): Sampler {
			return this[symbol]
		},
		set: function (sampler: Sampler) {
			const prevSampler: Sampler = this[symbol]
			this[symbol] = sampler;
			this.updateSampler(prevSampler, sampler)
		},
		...defineProperty_SETTING
	}
}

Object.freeze(defineSampler)
export default defineSampler;
