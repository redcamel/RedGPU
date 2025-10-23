import defineProperty_SETTING from "./defineProperty_SETTING";
function createSetter(propertyKey, symbol, isFragment) {
    return function (newValue) {
        this[symbol] = newValue;
        const { gpuRenderInfo } = this;
        if (isFragment) {
            const { fragmentUniformInfo, fragmentUniformBuffer } = gpuRenderInfo;
            fragmentUniformBuffer.writeOnlyBuffer(fragmentUniformInfo.members[propertyKey], newValue ? 1 : 0);
            this.dirtyPipeline = true;
        }
        else if (gpuRenderInfo) {
            const { vertexUniformInfo, vertexUniformBuffer } = gpuRenderInfo;
            if (vertexUniformInfo.members[propertyKey]) {
                vertexUniformBuffer.writeOnlyBuffer(vertexUniformInfo.members[propertyKey], newValue ? 1 : 0);
                this.dirtyPipeline = true;
            }
        }
    };
}
function defineBoolean(propertyKey, initValue = false, forFragment = true) {
    const symbol = Symbol(propertyKey);
    return {
        get: function () {
            if (this[symbol] === undefined)
                this[symbol] = initValue;
            return this[symbol];
        },
        set: createSetter(propertyKey, symbol, forFragment),
        ...defineProperty_SETTING
    };
}
Object.freeze(defineBoolean);
export default defineBoolean;
