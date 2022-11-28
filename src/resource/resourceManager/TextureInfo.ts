import {BitmapTexture} from "../texture";

class TextureInfo {
    resource?: BitmapTexture
    textureView?: GPUTextureView

    constructor(resource, textureView = null) {
        this.resource = resource
        this.textureView = textureView
    }
}

export default TextureInfo