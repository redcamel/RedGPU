import ColorRGB from "../../../color/ColorRGB";
import isHexColor from "../../../runtimeChecker/isFunc/isHexColor";
import convertHexToRgb from "../../../utils/convertColor/convertHexToRgb";
import defineProperty_SETTING from "./defineProperty_SETTING";

function defineColorRGB(propertyKey: string, initValue: string = '#fff', forFragment: boolean = true) {
    const symbol = Symbol(propertyKey);
    return {
        get: function (): number {
            if (this[symbol] === undefined) {
                let r = 255
                let g = 255
                let b = 255
                if (isHexColor(initValue)) {
                    const t0 = convertHexToRgb(initValue)
                    r = t0.r
                    g = t0.g
                    b = t0.b
                }
                this[symbol] = new ColorRGB(r, g, b, () => {
                    const {gpuRenderInfo} = this
                    if (gpuRenderInfo) {
                        if (forFragment) {
                            const {fragmentUniformInfo, fragmentUniformBuffer} = gpuRenderInfo
                            fragmentUniformBuffer.writeBuffer(fragmentUniformInfo.members[propertyKey], this[symbol].rgbNormal)
                        } else {
                            const {vertexUniformInfo, vertexUniformBuffer} = gpuRenderInfo
                            vertexUniformBuffer.writeBuffer(vertexUniformInfo.members[propertyKey], this[symbol].rgbNormal)
                        }
                    }
                })
            }
            return this[symbol]
        },
        ...defineProperty_SETTING
    }
}

Object.freeze(defineColorRGB)
export default defineColorRGB;
