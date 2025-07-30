import BitmapTexture from "../../../texture/BitmapTexture";
import ANoiseTexture from "../../../texture/noiseTexture/core/ANoiseTexture";

class ResourceStateBitmapTexture {
	texture: BitmapTexture | ANoiseTexture
	src: string
	cacheKey: string
	useNum: number = 0
	uuid: string | number

	constructor(bitmapTexture: BitmapTexture | ANoiseTexture) {
		this.texture = bitmapTexture
		this.src = bitmapTexture.src
		this.cacheKey = bitmapTexture.cacheKey
		this.useNum = 0
		this.uuid = bitmapTexture.uuid
	}
}

export default ResourceStateBitmapTexture;
