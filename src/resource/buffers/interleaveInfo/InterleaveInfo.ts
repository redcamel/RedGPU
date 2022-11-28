import InterleaveUnit from "./InterleaveUnit";

class InterleaveInfo {

    #stride = 0;
    get stride() {
        return this.#stride;
    }

    #arrayStride = 0;
    get arrayStride(): number {
        return this.#arrayStride;
    }

    #attributes = [];
    get attributes(): any[] {
        return this.#attributes;
    }

    constructor(dataList: InterleaveUnit[]) {
        dataList.forEach((v, index) => {
            this.#stride += v.stride / Float32Array.BYTES_PER_ELEMENT;
            //
            this.#attributes.push(
                {
                    attributeHint: v['attributeHint'],
                    shaderLocation: index,
                    offset: this.#arrayStride,
                    format: v['format']
                }
            );
            this.#arrayStride += v['stride'];
        })

    }
}

export default InterleaveInfo