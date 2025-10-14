import CubeTexture from "../../../../texture/CubeTexture";
class ResourceStateCubeTexture {
    texture;
    srcList;
    cacheKey;
    useNum = 0;
    uuid;
    constructor(cubeTexture) {
        this.texture = cubeTexture;
        this.srcList = cubeTexture instanceof CubeTexture ? cubeTexture.srcList : undefined;
        this.cacheKey = cubeTexture.cacheKey;
        this.useNum = 0;
        this.uuid = cubeTexture.uuid;
    }
}
export default ResourceStateCubeTexture;
