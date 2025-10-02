import BitmapTexture from "../../../../texture/BitmapTexture";
import ANoiseTexture from "../../../../texture/noiseTexture/core/ANoiseTexture";
declare class ResourceStateBitmapTexture {
    texture: BitmapTexture | ANoiseTexture;
    src: string;
    cacheKey: string;
    useNum: number;
    uuid: string | number;
    constructor(texture: BitmapTexture | ANoiseTexture);
}
export default ResourceStateBitmapTexture;
