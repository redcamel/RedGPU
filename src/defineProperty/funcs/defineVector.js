import defineProperty_SETTING from "./defineProperty_SETTING";
function createSetter(propertyKey, symbol, isFragment) {
    return function (newValue) {
        this[symbol] = newValue;
        const { gpuRenderInfo } = this;
        if (isFragment) {
            const { fragmentUniformInfo, fragmentUniformBuffer } = gpuRenderInfo;
            fragmentUniformBuffer.writeOnlyBuffer(fragmentUniformInfo.members[propertyKey], newValue);
        }
        else if (gpuRenderInfo) {
            const { vertexUniformInfo, vertexUniformBuffer } = gpuRenderInfo;
            vertexUniformBuffer.writeOnlyBuffer(vertexUniformInfo.members[propertyKey], newValue);
        }
    };
}
function defineVector(propertyKey, initValue, forFragment = true) {
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
Object.freeze(defineVector);
export default defineVector;
