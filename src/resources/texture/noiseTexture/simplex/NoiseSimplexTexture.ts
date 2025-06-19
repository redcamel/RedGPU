import RedGPUContext from "../../../../context/RedGPUContext";
import {NoiseDefine} from "../core/ANoiseTexture";
import ASimplexTexture from "../core/ASimplexTexture";
import {mergerNoiseUniformDefault, mergerNoiseUniformStruct} from "../core/noiseDegineMerges";
const BASIC_OPTIONS = {}
class NoiseSimplexTexture extends ASimplexTexture {
	constructor(
		redGPUContext: RedGPUContext,
		width: number = 1024,
		height: number = 1024,
		define?: NoiseDefine
	) {
		const mainLogic = define?.mainLogic || `
					 let noise = getNoiseByDimension(
					  uv,uniforms
					);
            
            /* 최종 색상 (그레이스케일) */
            let color = vec4<f32>(noise, noise, noise, 1.0);
        `;
		const uniformStruct = mergerNoiseUniformStruct(``, define?.uniformStruct);
		const uniformDefaults = mergerNoiseUniformDefault(BASIC_OPTIONS, define?.uniformDefaults)
		const helperFunctions = define?.helperFunctions || ''
		super(redGPUContext, width, height, {
			uniformStruct,
			mainLogic,
			uniformDefaults,
			helperFunctions
		});
	}
}

export default NoiseSimplexTexture;
