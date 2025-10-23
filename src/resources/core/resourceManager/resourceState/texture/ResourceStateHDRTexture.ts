import HDRTexture from "../../../../texture/hdr/HDRTexture";

class ResourceStateHDRTexture {
    texture: HDRTexture
    src: string
    cacheKey: string
    useNum: number = 0
    uuid: string | number

    constructor(texture: HDRTexture) {
        this.texture = texture
        this.src = texture.src
        this.cacheKey = texture.cacheKey
        this.useNum = 0
        this.uuid = texture.uuid
    }
}

export default ResourceStateHDRTexture;
