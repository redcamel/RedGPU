import RedGPUContext from "./RedGPUContext";

import throwErrorInstanceOf from "../util/errorFunc/throwErrorInstanceOf";

class RedGPUContextBase {
    #redGPUContext: RedGPUContext

    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    constructor(redGPUContext: RedGPUContext) {
        if (!(redGPUContext instanceof RedGPUContext)) throwErrorInstanceOf(this, 'redGPUContext', 'RedGPUContext')
        this.#redGPUContext = redGPUContext

    }
}

export default RedGPUContextBase
