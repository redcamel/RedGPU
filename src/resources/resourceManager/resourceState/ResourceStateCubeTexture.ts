import CubeTexture from "../../texture/CubeTexture";

class ResourceStateCubeTexture {
    texture: CubeTexture
    srcList: string[]
    cacheKey: string
    useNum: number = 0
    uuid: string | number

    constructor(cubeTexture: CubeTexture) {
        this.texture = cubeTexture
        this.srcList = cubeTexture.srcList
        this.cacheKey = cubeTexture.cacheKey
        this.useNum = 0
        this.uuid = cubeTexture.uuid
    }
}

export default ResourceStateCubeTexture;
