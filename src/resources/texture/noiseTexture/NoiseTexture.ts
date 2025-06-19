import RedGPUContext from "../../../context/RedGPUContext";
import ANoiseTexture, {NoiseDefine} from "./core/ANoiseTexture";

class NoiseTexture extends ANoiseTexture {
	constructor(
		redGPUContext: RedGPUContext,
		width: number = 1024,
		height: number = 1024,
		define?: NoiseDefine
	) {
		const uniformStruct = define?.uniformStruct || ``;
		const mainLogic = define?.mainLogic || `
					 let noise = getNoiseByDimension(
					  uv,uniforms
					);
            
            /* 최종 색상 (그레이스케일) */
            let color = vec4<f32>(noise, noise, noise, 1.0);
        `;
		const uniformDefaults = {
			...define?.uniformDefaults || {}
		};
		const helperFunctions = define?.helperFunctions || ''
		super(redGPUContext, width, height, {
			uniformStruct,
			mainLogic,
			uniformDefaults,
			helperFunctions
		});
	}
}

export default NoiseTexture;
