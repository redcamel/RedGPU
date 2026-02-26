import CubeTexture from "../../../../texture/CubeTexture";
import DirectCubeTexture from "../../../../texture/DirectCubeTexture";

class ResourceStateCubeTexture {
    texture: CubeTexture | DirectCubeTexture
    srcList: string[]
    cacheKey: string
    useNum: number = 0
    uuid: string | number

    constructor(cubeTexture: CubeTexture | DirectCubeTexture) {
        this.texture = cubeTexture
        this.srcList = cubeTexture instanceof CubeTexture ? cubeTexture.srcList : undefined
        this.cacheKey = cubeTexture.cacheKey
        this.useNum = 0
        this.uuid = cubeTexture.uuid
    }
}

export default ResourceStateCubeTexture;
