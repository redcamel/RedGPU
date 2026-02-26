import BitmapTexture from "../../../../texture/BitmapTexture";
import DirectTexture from "../../../../texture/DirectTexture";
import ANoiseTexture from "../../../../texture/noiseTexture/core/ANoiseTexture";

class ResourceStateBitmapTexture {
    texture: BitmapTexture | ANoiseTexture | DirectTexture
    src: string
    cacheKey: string
    useNum: number = 0
    uuid: string | number

    constructor(texture: BitmapTexture | ANoiseTexture | DirectTexture) {
        this.texture = texture
        this.src = (texture as any).src
        this.cacheKey = texture.cacheKey
        this.useNum = 0
        this.uuid = texture.uuid
    }
}

export default ResourceStateBitmapTexture;
