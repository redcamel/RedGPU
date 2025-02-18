import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";
import PerspectiveCamera from "./PerspectiveCamera";

class OrthographicCamera extends PerspectiveCamera {
    #instanceId: number
    #name: string
    #top: number = 1
    #bottom: number = -1
    #left: number = -1
    #right: number = 1

    constructor() {
        super()
        this.nearClipping = 0.01
        this.farClipping = 2000
    }

    get top(): number {
        return this.#top;
    }

    set top(value: number) {
        validateNumber(value)
        this.#top = value;
    }

    get bottom(): number {
        return this.#bottom;
    }

    set bottom(value: number) {
        validateNumber(value)
        this.#bottom = value;
    }

    get left(): number {
        return this.#left;
    }

    set left(value: number) {
        validateNumber(value)
        this.#left = value;
    }

    get right(): number {
        return this.#right;
    }

    set right(value: number) {
        validateNumber(value)
        this.#right = value;
    }

    get name(): string {
        if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }

    set name(value: string) {
        this.#name = value;
    }
}

export default OrthographicCamera
