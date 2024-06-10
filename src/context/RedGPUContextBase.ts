import throwErrorInstanceOf from "../util/errorFunc/throwErrorInstanceOf";
import RedGPUContext from "./RedGPUContext";

class RedGPUContextBase {
	#redGPUContext: RedGPUContext

	constructor(redGPUContext: RedGPUContext) {
		if (!(redGPUContext instanceof RedGPUContext)) throwErrorInstanceOf(this, 'redGPUContext', 'RedGPUContext')
		this.#redGPUContext = redGPUContext
	}

	get redGPUContext(): RedGPUContext {
		return this.#redGPUContext;
	}
}

export default RedGPUContextBase
