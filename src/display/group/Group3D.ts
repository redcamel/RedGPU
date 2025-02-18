import InstanceIdGenerator from "../../utils/InstanceIdGenerator";
import GroupBase from "./GroupBase";

class Group3D extends GroupBase {
    #instanceId: number
    #name: string

    constructor(name?: string) {
        super()
        if (name) this.name = name
    }

    get name(): string {
        if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }

    set name(value: string) {
        this.#name = value;
    }

}

Object.defineProperty(Group3D.prototype, 'meshType', {
    value: 'mesh',
    writable: false
});
Object.freeze(Group3D)
export default Group3D
