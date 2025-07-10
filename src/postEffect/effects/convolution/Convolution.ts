import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

const NORMAL = ([
	0, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 0, 0
]);
const SHARPEN = ([
	0, -1, 0, 0,
	-1, 5, -1, 0,
	0, -1, 0, 0,
])
const BLUR = ([
	1, 1, 1, 0,
	1, 1, 1, 0,
	1, 1, 1, 0
])
const EDGE = ([
	0, 1, 0, 0,
	1, -4, 1, 0,
	0, 1, 0, 0
]);
const EMBOSE = ([
	-2, -1, 0, 0,
	-1, 1, 1, 0,
	0, 1, 2, 0
]);

class Convolution extends ASinglePassPostEffect {
	static NORMAL = NORMAL
	static SHARPEN = SHARPEN
	static BLUR = BLUR
	static EDGE = EDGE
	static EMBOSE = EMBOSE
	#kernel: number[] = BLUR;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_CONVOLUTION',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.kernel = this.#kernel
	}

	get kernel(): number[] {
		return this.#kernel;
	}

	set kernel(value: number[]) {
		this.#kernel = value;
		let kernelWeight = 0;
		for (const k in this.#kernel) kernelWeight += this.#kernel[k];
		console.log('kernelWeight', kernelWeight);
		this.updateUniform('kernelWeight', kernelWeight)
		this.updateUniform('kernel', value)
	}
}

Object.freeze(Convolution)
export default Convolution

