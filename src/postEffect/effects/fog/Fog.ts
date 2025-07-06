import PerspectiveCamera from "../../../camera/camera/PerspectiveCamera";
import ColorRGB from "../../../color/ColorRGB";
import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";

class Fog extends ASinglePassPostEffect {
	static LINEAR = 0;
	static EXPONENTIAL = 1;
	static EXPONENTIAL_SQUARED = 2;
	#fogType: number = Fog.LINEAR;
	#density: number = 0.5;
	#nearDistance: number = 5.0;
	#farDistance: number = 50.0;
	#fogColor: ColorRGB;
	#cameraNear: number = 0.1;
	#cameraFar: number = 1000.0;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.useDepthTexture = true;
		const computeCode = `
				let index = vec2<u32>(global_id.xy);
				let coord = vec2<i32>(global_id.xy);
				
				var sceneColor: vec4<f32> = textureLoad(sourceTexture, coord);
				let depth = textureLoad(depthTexture, coord, 0);
				
				let linearDepth = linearizeDepth(depth);
				let fogFactor = calculateFogFactor(linearDepth);
				
				let finalColor = mix(uniforms.fogColor.rgb, sceneColor.rgb, fogFactor);
				textureStore(outputTexture, coord, vec4<f32>(finalColor, sceneColor.a));
			`
		const uniformStructCode = `
	struct Uniforms {
		fogType: u32,
		density: f32,
		nearDistance: f32,
		farDistance: f32,
		fogColor: vec3<f32>,
		cameraNear: f32,
		cameraFar: f32,
		padding1: f32,
	};
	
	fn linearizeDepth(depth: f32) -> f32 {
		let z = depth * 2.0 - 1.0;
		return (2.0 * uniforms.cameraNear * uniforms.cameraFar) / 
			   (uniforms.cameraFar + uniforms.cameraNear - z * (uniforms.cameraFar - uniforms.cameraNear));
	}
	
	fn calculateFogFactor(linearDepth: f32) -> f32 {
    var fogFactor: f32 = 1.0;
    
    /* 배경/스카이박스 감지 */
    let isBackground = linearDepth >= (uniforms.cameraFar * 0.99);
    
    if (isBackground) {
        /* 배경은 density에 따라 부분적으로만 포그 적용 */
        let backgroundFogAmount = clamp(uniforms.density, 0.0, 1.0);
        fogFactor = 1.0 - backgroundFogAmount;
    } else {
        /* 일반 객체 처리 */
        if (uniforms.fogType == 0u) {
            /* Linear Fog */
            if (linearDepth >= uniforms.nearDistance) {
                if (linearDepth >= uniforms.farDistance) {
                    fogFactor = 0.0;
                } else {
                    let distanceRatio = (linearDepth - uniforms.nearDistance) / 
                                      (uniforms.farDistance - uniforms.nearDistance);
                    let adjustedDensity = clamp(uniforms.density, 0.01, 10.0);
                    let fogStrength = pow(distanceRatio, 1.0 / adjustedDensity);
                    fogFactor = 1.0 - fogStrength;
                }
            }
        } else if (uniforms.fogType == 1u) {
            /* Exponential Fog */
            let distance = max(0.0, linearDepth - uniforms.nearDistance);
            /* density 스케일링으로 더 직관적인 조절 */
            let adjustedDensity = uniforms.density * 0.01; 
            fogFactor = exp(-adjustedDensity * distance);
        } else if (uniforms.fogType == 2u) {
            /* Exponential Squared Fog */
            let distance = max(0.0, linearDepth - uniforms.nearDistance);
            /* density 스케일링으로 더 직관적인 조절 */
            let adjustedDensity = uniforms.density * 0.01; 
            let densityDistance = adjustedDensity * distance;
            fogFactor = exp(-(densityDistance * densityDistance));
        }
    }
    
    return clamp(fogFactor, 0.0, 1.0);
}
`
		this.init(
			redGPUContext,
			'POST_EFFECT_FOG',
			createBasicPostEffectCode(
				this,
				computeCode,
				uniformStructCode
			)
		);
		// ColorRGB 초기화 (onChange 콜백과 함께)
		this.#fogColor = new ColorRGB(178, 178, 204, () => {
			this.updateUniform('fogColor', this.#fogColor.rgbNormal);
		});
		// 초기값 설정
		this.fogType = this.#fogType;
		this.density = this.#density;
		this.nearDistance = this.#nearDistance;
		this.farDistance = this.#farDistance;
		this.cameraNear = this.#cameraNear;
		this.cameraFar = this.#cameraFar;
	}

	get fogType(): number {
		return this.#fogType;
	}

	set fogType(value: number) {
		validateNumberRange(value, 0, 2);
		this.#fogType = Math.floor(value);
		this.updateUniform('fogType', this.#fogType);
	}

	get density(): number {
		return this.#density;
	}

	set density(value: number) {
		validateNumberRange(value);
		this.#density = Math.max(0, Math.min(10, value));
		this.updateUniform('density', this.#density);
	}

	get nearDistance(): number {
		return this.#nearDistance;
	}

	set nearDistance(value: number) {
		validateNumberRange(value);
		this.#nearDistance = Math.max(0.1, value);
		if (this.#farDistance <= this.#nearDistance) {
			this.#farDistance = this.#nearDistance + 0.1;
			this.updateUniform('farDistance', this.#farDistance);
		}
		this.updateUniform('nearDistance', this.#nearDistance);
	}

	get farDistance(): number {
		return this.#farDistance;
	}

	set farDistance(value: number) {
		validateNumberRange(value);
		this.#farDistance = Math.max(this.#nearDistance + 0.1, value);
		this.updateUniform('farDistance', this.#farDistance);
	}

	get fogColor(): ColorRGB {
		return this.#fogColor;
	}

	get cameraNear(): number {
		return this.#cameraNear;
	}

	set cameraNear(value: number) {
		validateNumberRange(value);
		this.#cameraNear = Math.max(0.001, value);
		this.updateUniform('cameraNear', this.#cameraNear);
	}

	get cameraFar(): number {
		return this.#cameraFar;
	}

	set cameraFar(value: number) {
		validateNumberRange(value);
		this.#cameraFar = Math.max(this.#cameraNear + 0.1, value);
		this.updateUniform('cameraFar', this.#cameraFar);
	}

	updateCameraInfo(view: View3D): void {
		const cameraData = this.#getCameraData(view);
		this.cameraNear = cameraData.near;
		this.cameraFar = cameraData.far;
	}

	#getCameraData(view: View3D): { near: number; far: number } {
		if (!view?.camera) {
			return {near: 0.1, far: 1000.0};
		}
		const cameraInstance = view.camera;
		const actualCamera = 'camera' in cameraInstance
			? cameraInstance.camera
			: cameraInstance as PerspectiveCamera;
		return {
			near: actualCamera.nearClipping,
			far: actualCamera.farClipping
		};
	}
}

Object.freeze(Fog);
export default Fog;
