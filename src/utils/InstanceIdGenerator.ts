class InstanceIdGenerator {
    private static idMaps: Map<Function, number> = new Map();

    static getNextId(type: Function): number {
        let currentId = this.idMaps.get(type) || 0;
        this.idMaps.set(type, currentId + 1);
        return currentId;
    }
}

Object.freeze(InstanceIdGenerator);
export default InstanceIdGenerator
