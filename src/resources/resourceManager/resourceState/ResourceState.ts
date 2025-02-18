class ResourceState {
    table: {} = {}
    videoMemory: number = 0;
    length: number = 0;

    constructor() {
    }
}

Object.freeze(ResourceState)
export default ResourceState;
