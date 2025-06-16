import BitmapTexture from "../../texture/BitmapTexture";
import NoiseTexture from "../../texture/NoiseTexture";

class ResourceStateBitmapTexture {
	texture: BitmapTexture|NoiseTexture
	src: string
	cacheKey: string
	useNum: number = 0
	uuid: string | number

	constructor(bitmapTexture: BitmapTexture|NoiseTexture) {
		this.texture = bitmapTexture
		this.src = bitmapTexture.src
		this.cacheKey = bitmapTexture.cacheKey
		this.useNum = 0
		this.uuid = bitmapTexture.uuid
	}
}

export default ResourceStateBitmapTexture;
