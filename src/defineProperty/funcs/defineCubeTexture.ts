import CubeTexture from "../../resources/texture/CubeTexture";
import defineProperty_SETTING from "./defineProperty_SETTING";

function createSetter(propertyKey: string, symbol: symbol, isFragment: boolean) {
    const useKey = `use${propertyKey.charAt(0).toUpperCase()}${propertyKey.substring(1)}`
    return function (texture: CubeTexture) {
        const prevTexture: CubeTexture = this[symbol]
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
                } else {
                    // console.warn(this.material, useKey, '는 fragment shader에 정의 되어있지 않습니다. 문제가 되지 않을수 있으나 확인 필요')
                }
            }
        } else if (gpuRenderInfo) {
            const {vertexUniformInfo, vertexUniformBuffer} = gpuRenderInfo;
            if (vertexUniformInfo.members[useKey]) {
                vertexUniformBuffer.writeOnlyBuffer(vertexUniformBuffer.members[useKey], texture ? 1 : 0)
            } else {
                // console.warn(this.material, useKey, '는 vertex shader에 정의 되어있지 않습니다. 문제가 되지 않을수 있으나 확인 필요')
            }
        }
    }
}

function defineCubeTexture(propertyKey: string, forFragment: boolean = true) {
    const symbol = Symbol(propertyKey);
    return {
        get: function (): CubeTexture {
            return this[symbol]
        },
        set: createSetter(propertyKey, symbol, forFragment),
        ...defineProperty_SETTING
    }
}

Object.freeze(defineCubeTexture)
export default defineCubeTexture;
