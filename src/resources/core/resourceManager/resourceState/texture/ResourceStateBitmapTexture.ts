import BitmapTexture from "../../../../texture/BitmapTexture";
import ANoiseTexture from "../../../../texture/noiseTexture/core/ANoiseTexture";

class ResourceStateBitmapTexture {
    texture: BitmapTexture | ANoiseTexture
    src: string
    cacheKey: string
    useNum: number = 0
    uuid: string | number

    constructor(texture: BitmapTexture | ANoiseTexture) {
        this.texture = texture
        this.src = texture.src
        this.cacheKey = texture.cacheKey
        this.useNum = 0
        this.uuid = texture.uuid
    }
}

export default ResourceStateBitmapTexture;
