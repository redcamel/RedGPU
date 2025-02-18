import CubeTextureFromSphericalSky from "../../texture/CubeTextureFromSphericalSky";

class ResourceStateCubeTextureFromSphericalSky {
    texture: CubeTextureFromSphericalSky
    src: string
    cacheKey: string
    useNum: number = 0
    uuid: string | number

    constructor(cubeTexture: CubeTextureFromSphericalSky) {
        this.texture = cubeTexture
        this.src = cubeTexture.src
        this.cacheKey = cubeTexture.cacheKey
        this.useNum = 0
        this.uuid = cubeTexture.uuid
    }
}

export default ResourceStateCubeTextureFromSphericalSky;
