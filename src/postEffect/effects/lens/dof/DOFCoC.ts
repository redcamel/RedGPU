import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createPostEffectCode from "../../../core/createPostEffectCode";

class DOFCoC extends ASinglePassPostEffect {
	#focusDistance: number = 15.0;
	#aperture: number = 1.4;
	#maxCoC: number = 32.0;
	#nearPlane: number = 0.1;
	#farPlane: number = 1000.0;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const computeCode = createPostEffectCode(
			this,
			`
				let index = vec2<u32>(global_id.xy);
				let coord = vec2<i32>(global_id.xy);
				
				let originalColor = textureLoad(sourceTexture, coord).xyzw;
				
				let depth = textureLoad(depthTexture, coord, 0);
				let linearDepth = linearizeDepth(depth);
				
				let coc = calculateCoC(linearDepth);
				
				textureStore(outputTexture, coord, vec4<f32>(originalColor.rgb, coc));
			`,
			`
				struct Uniforms {
					focusDistance: f32,
					aperture: f32,
					maxCoC: f32,
					nearPlane: f32,
					farPlane: f32,
				};
				
				fn linearizeDepth(depth: f32) -> f32 {
					let z = depth * 2.0 - 1.0;
					return (2.0 * uniforms.nearPlane * uniforms.farPlane) / 
						   (uniforms.farPlane + uniforms.nearPlane - z * (uniforms.farPlane - uniforms.nearPlane));
				}
				
				fn calculateCoC(linearDepth: f32) -> f32 {
					let subjectDistance = linearDepth;
					
					let focusRange = uniforms.focusDistance * 0.02;
					
					if (abs(subjectDistance - uniforms.focusDistance) < focusRange) {
						return 0.0; 
					}
					
					let focalLength = 50.0;
					let distanceDiff = abs(subjectDistance - uniforms.focusDistance);
					
					var cocSize = (uniforms.aperture * focalLength * distanceDiff) / 
								  (subjectDistance * (uniforms.focusDistance + focalLength));
					
					cocSize = cocSize * (1.0 + distanceDiff * 0.1);
					
					var signedCoC = cocSize / uniforms.maxCoC;
					
					if (subjectDistance < uniforms.focusDistance) {
						signedCoC = -signedCoC;
					}
					
					let absCoC = abs(signedCoC);
					if (absCoC > 0.1) {
						signedCoC = sign(signedCoC) * min(1.0, absCoC * 1.5);
					}
					
					return clamp(signedCoC, -1.0, 1.0);
				}
			`
		);

		this.init(
			redGPUContext,
			'POST_EFFECT_DOF_COC',
			computeCode
		);

		this.focusDistance = this.#focusDistance;
		this.aperture = this.#aperture;
		this.maxCoC = this.#maxCoC;
		this.nearPlane = this.#nearPlane;
		this.farPlane = this.#farPlane;
	}

	get focusDistance(): number {
		return this.#focusDistance;
	}

	set focusDistance(value: number) {
		validateNumberRange(value);
		this.#focusDistance = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.focusDistance, value);
	}

	get aperture(): number {
		return this.#aperture;
	}

	set aperture(value: number) {
		validateNumberRange(value);
		this.#aperture = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.aperture, value);
	}

	get maxCoC(): number {
		return this.#maxCoC;
	}

	set maxCoC(value: number) {
		validateNumberRange(value);
		this.#maxCoC = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.maxCoC, value);
	}

	get nearPlane(): number {
		return this.#nearPlane;
	}

	set nearPlane(value: number) {
		validateNumberRange(value);
		this.#nearPlane = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.nearPlane, value);
	}

	get farPlane(): number {
		return this.#farPlane;
	}

	set farPlane(value: number) {
		validateNumberRange(value);
		this.#farPlane = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.farPlane, value);
	}
}

Object.freeze(DOFCoC);
export default DOFCoC;
