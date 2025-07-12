import defineProperty_SETTING from "./defineProperty_SETTING";

function createSetter(propertyKey: string, symbol: symbol, isFragment: boolean) {
	return function (newValue: boolean) {
		this[symbol] = newValue;
		const {gpuRenderInfo} = this;
		if (isFragment) {
			const {fragmentUniformInfo, fragmentUniformBuffer} = gpuRenderInfo;
			fragmentUniformBuffer.writeBuffer(fragmentUniformInfo.members[propertyKey], newValue ? 1 : 0);
			this.dirtyPipeline = true
		} else if (gpuRenderInfo) {
			const {vertexUniformInfo, vertexUniformBuffer} = gpuRenderInfo;
			vertexUniformBuffer.writeBuffer(vertexUniformInfo.members[propertyKey], newValue ? 1 : 0);
		}
	}
}

function defineBoolean(propertyKey: string, initValue: boolean = false, forFragment: boolean = true) {
	const symbol = Symbol(propertyKey);
	return {
		get: function (): boolean {
			if (this[symbol] === undefined) this[symbol] = initValue;
			return this[symbol];
		},
		set: createSetter(propertyKey, symbol, forFragment),
		...defineProperty_SETTING
	}
}

Object.freeze(defineBoolean)
export default defineBoolean;
