import ColorRGB from "../../../../color/ColorRGB";
import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class HeightFog extends ASinglePassPostEffect {
	// HeightFog 타입 상수
	static EXPONENTIAL = 0;
	static LINEAR = 1;

	#fogType: number = HeightFog.EXPONENTIAL;
	#density: number = 1.0;
	#fogColor: ColorRGB;

	// 🎯 Unity 스타일 Height Fog 속성들
	#baseHeight: number = 0.0;        // 안개 시작 높이 (Unity: Base Height)
	#thickness: number = 100.0;       // 안개 레이어 두께 (Unity: Thickness)
	#falloff: number = 0.1;           // 높이별 감쇠율 (Unity: Falloff)

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.useDepthTexture = true;
		this.init(
			redGPUContext,
			'POST_EFFECT_HEIGHT_FOG',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		);

		this.#fogColor = new ColorRGB(178, 178, 204, () => {
			this.updateUniform('fogColor', this.#fogColor.rgbNormal);
		});

		// 초기값 설정
		this.fogType = this.#fogType;
		this.density = this.#density;
		this.baseHeight = this.#baseHeight;
		this.thickness = this.#thickness;
		this.falloff = this.#falloff;
	}

	// 🎨 Fog Mode (Unity: Mode)
	get fogType(): number { return this.#fogType; }
	set fogType(value: number) {
		validateNumberRange(value, 0, 1);
		this.#fogType = Math.floor(value);
		this.updateUniform('fogType', this.#fogType);
	}

	// 🌫️ Fog Density (Unity: Density)
	get density(): number { return this.#density; }
	set density(value: number) {
		validateNumberRange(value, 0, 5);
		this.#density = Math.max(0, Math.min(5, value));
		this.updateUniform('density', this.#density);
	}

	get fogColor(): ColorRGB { return this.#fogColor; }

	get baseHeight(): number { return this.#baseHeight; }
	set baseHeight(value: number) {
		validateNumberRange(value);
		this.#baseHeight = value;
		this.updateUniform('baseHeight', this.#baseHeight);
		// thickness 기반으로 maxHeight 자동 계산
		this.updateUniform('maxHeight', this.maxHeight);
	}

	get maxHeight():number {
		return this.#baseHeight + this.#thickness
	}

	// 📏 Thickness - 안개 레이어 두께 (Unity: Thickness)
	get thickness(): number { return this.#thickness; }
	set thickness(value: number) {
		validateNumberRange(value, 0.1);
		this.#thickness = Math.max(0.1, value);
		// baseHeight + thickness로 maxHeight 계산
		this.updateUniform('maxHeight', this.#baseHeight + this.#thickness);
	}


	// 📉 Falloff - 높이별 감쇠율 (Unity: Falloff)
	get falloff(): number { return this.#falloff; }
	set falloff(value: number) {
		validateNumberRange(value, 0, 2);
		this.#falloff = Math.max(0.001, Math.min(2, value));
		this.updateUniform('falloff', this.#falloff);
	}


	render(view: View3D, width: number, height: number, sourceTextureView: GPUTextureView) {
		return super.render(view, width, height, sourceTextureView);
	}
}
Object.freeze(HeightFog);
export default HeightFog;
