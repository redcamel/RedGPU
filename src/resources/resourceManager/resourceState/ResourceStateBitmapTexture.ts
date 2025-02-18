import BitmapTexture from "../../texture/BitmapTexture";

class ResourceStateBitmapTexture {
    texture: BitmapTexture
    src: string
    cacheKey: string
    useNum: number = 0
    uuid: string | number

    constructor(bitmapTexture: BitmapTexture) {
        this.texture = bitmapTexture
        this.src = bitmapTexture.src
        this.cacheKey = bitmapTexture.cacheKey
        this.useNum = 0
        this.uuid = bitmapTexture.uuid
    }
}

export default ResourceStateBitmapTexture;
