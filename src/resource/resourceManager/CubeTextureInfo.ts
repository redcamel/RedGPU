import {BitmapCubeTexture} from "../texture";

class CubeTextureInfo {
    resource?: BitmapCubeTexture
    textureView?: GPUTextureView

    constructor(resource, textureView = null) {
        this.resource = resource
        this.textureView = textureView
    }
}

export default CubeTextureInfo