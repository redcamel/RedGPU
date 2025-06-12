import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";

class DOFCoC extends ASinglePassPostEffect {
	#focusDistance: number = 15.0;
	#aperture: number = 1.4;
	#maxCoC: number = 32.0;
	#nearPlane: number = 0.1;
	#farPlane: number = 1000.0;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.useDepthTexture = true
		const computeCode = createBasicPostEffectCode(
			this,
			`
				let index = vec2<u32>(global_id.xy);
				let coord = vec2<i32>(global_id.xy);
				
				let originalColor = textureLoad(sourceTexture, coord).xyzw;
				
				let depth = textureLoad(depthTexture, coord, 0);
				let linearDepth = linearizeDepth(depth);
				
				let coc = calculateCoC(linearDepth);
				
				/* CoC를 0~1 범위로 인코딩해서 저장 */
				let encodedCoC = encodeCoC(coc);
				
				textureStore(outputTexture, coord, vec4<f32>(originalColor.rgb, encodedCoC));
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
				
				/* CoC 값을 0~1 범위로 인코딩 */
				fn encodeCoC(coc: f32) -> f32 {
					return (coc + 1.0) * 0.5;
				}
				
				fn calculateCoC(linearDepth: f32) -> f32 {
					let subjectDistance = linearDepth;
					let focalLength = 50.0;
					
					let focusRange = uniforms.focusDistance * 0.15;     
					let transitionRange = uniforms.focusDistance * 0.35; 
					
					let distanceFromFocus = abs(subjectDistance - uniforms.focusDistance);
					
				
					if (distanceFromFocus < focusRange) {
						let focusFactor = smoothstep(0.0, focusRange, distanceFromFocus);
						return mix(0.0, 0.02, focusFactor); /* 완전히 0이 아닌 미세한 값 */
					}
					
			
					var rawCoC: f32;
					var signedCoC: f32;
					
					if (subjectDistance < uniforms.focusDistance) {
						/* Near field 처리 */
						let nearDistance = uniforms.focusDistance - subjectDistance;
						let nearFactor = nearDistance / uniforms.focusDistance;
						
						rawCoC = (uniforms.aperture * focalLength * nearDistance) / 
								 (subjectDistance * (uniforms.focusDistance - focalLength));
						
						/* Near 필드 강화 (하지만 부드럽게) */
						rawCoC = rawCoC * (1.0 + nearFactor * 1.5); /* 2.0 → 1.5로 완화 */
						
						signedCoC = -(rawCoC / uniforms.maxCoC);
						
						/* 🎯 부드러운 강화 적용 */
						let absCoC = abs(signedCoC);
						if (absCoC > 0.05) {
							/* 급격한 증폭 대신 부드러운 곡선 사용 */
							signedCoC = -min(1.0, absCoC * smoothstep(0.05, 0.3, absCoC) * 1.5);
						}
						
						/* 🎯 전환 영역에서 추가 부드러움 */
						if (distanceFromFocus < transitionRange) {
							let transitionFactor = smoothstep(focusRange, transitionRange, distanceFromFocus);
							signedCoC = mix(0.0, signedCoC, transitionFactor);
						}
						
						return clamp(signedCoC, -1.0, 0.0);
					} else {
						/* Far field 처리 */
						let farDistance = subjectDistance - uniforms.focusDistance;
						
						rawCoC = (uniforms.aperture * focalLength * farDistance) / 
								 (subjectDistance * (uniforms.focusDistance + focalLength));
						
						rawCoC = rawCoC * (1.0 + farDistance * 0.08); /* 0.1 → 0.08로 완화 */
						
						signedCoC = rawCoC / uniforms.maxCoC;
						
						
						let absCoC = abs(signedCoC);
						if (absCoC > 0.1) {
							signedCoC = min(1.0, absCoC * smoothstep(0.1, 0.5, absCoC) * 1.2);
						}
						
				
						if (distanceFromFocus < transitionRange) {
							let transitionFactor = smoothstep(focusRange, transitionRange, distanceFromFocus);
							signedCoC = mix(0.0, signedCoC, transitionFactor);
						}
						
						return clamp(signedCoC, 0.0, 1.0);
					}
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
		this.updateUniform('focusDistance', value)
	}

	get aperture(): number {
		return this.#aperture;
	}

	set aperture(value: number) {
		validateNumberRange(value);
		this.#aperture = value;
		this.updateUniform('aperture', value)
	}

	get maxCoC(): number {
		return this.#maxCoC;
	}

	set maxCoC(value: number) {
		validateNumberRange(value);
		this.#maxCoC = value;
		this.updateUniform('maxCoC', value)
	}

	get nearPlane(): number {
		return this.#nearPlane;
	}

	set nearPlane(value: number) {
		validateNumberRange(value);
		this.#nearPlane = value;
		this.updateUniform('nearPlane', value)
	}

	get farPlane(): number {
		return this.#farPlane;
	}

	set farPlane(value: number) {
		validateNumberRange(value);
		this.#farPlane = value;
		this.updateUniform('farPlane', value)
	}
}

Object.freeze(DOFCoC);
export default DOFCoC;
