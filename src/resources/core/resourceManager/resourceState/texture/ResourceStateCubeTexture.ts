import CubeTexture from "../../../../texture/CubeTexture";
import IBLCubeTexture from "../../../../texture/ibl/IBLCubeTexture";

class ResourceStateCubeTexture {
    texture: CubeTexture | IBLCubeTexture
    srcList: string[]
    cacheKey: string
    useNum: number = 0
    uuid: string | number

    constructor(cubeTexture: CubeTexture | IBLCubeTexture) {
        this.texture = cubeTexture
        this.srcList = cubeTexture instanceof CubeTexture ? cubeTexture.srcList : undefined
        this.cacheKey = cubeTexture.cacheKey
        this.useNum = 0
        this.uuid = cubeTexture.uuid
    }
}

export default ResourceStateCubeTexture;
