import defineProperty_SETTING from "./defineProperty_SETTING";

function createSetter(propertyKey: string, symbol: symbol, isFragment: boolean) {
    const useKey = `use${propertyKey.charAt(0).toUpperCase()}${propertyKey.substring(1)}`
    return function (texture: any) {
        const prevTexture: any = this[symbol]
        this[symbol] = texture
        this.updateTexture(prevTexture, texture)
        const {gpuRenderInfo} = this
        if (isFragment) {
            const {fragmentUniformInfo, fragmentUniformBuffer} = gpuRenderInfo
            if (useKey in this) {
                this[useKey] = !!texture
            } else {
                if (fragmentUniformInfo.members[useKey]) {
                    fragmentUniformBuffer.writeOnlyBuffer(fragmentUniformInfo.members[useKey], texture ? 1 : 0)
                }
            }
        } else if (gpuRenderInfo) {
            const {vertexUniformInfo, vertexUniformBuffer} = gpuRenderInfo;
            if (vertexUniformInfo.members[useKey]) {
                vertexUniformBuffer.writeOnlyBuffer(vertexUniformBuffer.members[useKey], texture ? 1 : 0)
            }
        }
    }
}

function defineTexture3D(propertyKey: string, forFragment: boolean = true) {
    const symbol = Symbol(propertyKey);
    return {
        get: function (): any {
            return this[symbol]
        },
        set: createSetter(propertyKey, symbol, forFragment),
        ...defineProperty_SETTING
    }
}

Object.freeze(defineTexture3D)
export default defineTexture3D;
