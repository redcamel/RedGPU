import RedGPUContext from "../RedGPUContext";

class Antialiasing {
    #redGPUContext: RedGPUContext;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;

    }
}

Object.freeze(Antialiasing)
export default Antialiasing