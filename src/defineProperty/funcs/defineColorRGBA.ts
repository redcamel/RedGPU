import ColorRGBA from "../../color/ColorRGBA";
import isHexColor from "../../runtimeChecker/isFunc/isHexColor";
import convertHexToRgb from "../../utils/convertColor/convertHexToRgb";
import defineProperty_SETTING from "./defineProperty_SETTING";

function defineColorRGBA(propertyKey: string, initValue: string = '#fff', forFragment: boolean = true) {
	const symbol = Symbol(propertyKey);
	return {
		get: function (): number {
			if (this[symbol] === undefined) {
				let r = 255
				let g = 255
				let b = 255
				let a = 1
				if (isHexColor(initValue)) {
					const t0 = convertHexToRgb(initValue)
					r = t0.r
					g = t0.g
					b = t0.b
				}
				this[symbol] = new ColorRGBA(r, g, b, a, () => {
					const {gpuRenderInfo} = this
					if (gpuRenderInfo) {
						if (forFragment) {
							const {fragmentUniformInfo, fragmentUniformBuffer} = gpuRenderInfo
							fragmentUniformBuffer.writeOnlyBuffer(fragmentUniformInfo.members[propertyKey], this[symbol].rgbaNormal)
						} else {
							const {vertexUniformInfo, vertexUniformBuffer} = gpuRenderInfo
							vertexUniformBuffer.writeOnlyBuffer(vertexUniformInfo.members[propertyKey], this[symbol].rgbaNormal)
						}
					}
				})
			}
			return this[symbol]
		},
		...defineProperty_SETTING
	}
}

Object.freeze(defineColorRGBA)
export default defineColorRGBA;
