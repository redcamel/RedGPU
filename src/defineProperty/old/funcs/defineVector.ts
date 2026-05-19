import defineProperty_SETTING from "./defineProperty_SETTING";

function createSetter(propertyKey: string, symbol: symbol, isFragment: boolean) {
    return function (newValue: number) {
        this[symbol] = newValue;
        const {gpuRenderInfo} = this
        if (isFragment) {
            const {fragmentUniformInfo, fragmentUniformBuffer} = gpuRenderInfo;
            fragmentUniformBuffer.writeOnlyBuffer(fragmentUniformInfo.members[propertyKey], newValue)
        } else if (gpuRenderInfo) {
            const {vertexUniformInfo, vertexUniformBuffer} = gpuRenderInfo;
            vertexUniformBuffer.writeOnlyBuffer(vertexUniformInfo.members[propertyKey], newValue)
        }
    }
}

function defineVector(propertyKey: string, initValue: number[], forFragment: boolean = true) {
    const symbol = Symbol(propertyKey);
    return {
        get: function (): number[] {
            if (this[symbol] === undefined) this[symbol] = initValue
            return this[symbol]
        },
        set: createSetter(propertyKey, symbol, forFragment),
        ...defineProperty_SETTING
    }
}

Object.freeze(defineVector)
export default defineVector;
