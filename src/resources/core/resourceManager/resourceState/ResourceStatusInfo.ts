class ResourceStatusInfo {
    table: Map<string, any> = new Map();
    videoMemory: number = 0;

    constructor() {
    }
}

Object.freeze(ResourceStatusInfo);
export default ResourceStatusInfo;
