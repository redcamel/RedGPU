import BitmapTexture from "../../../../texture/BitmapTexture";
import DirectTexture from "../../../../texture/DirectTexture";
import ANoiseTexture from "../../../../texture/noiseTexture/core/ANoiseTexture";
declare class ResourceStateBitmapTexture {
    texture: BitmapTexture | ANoiseTexture | DirectTexture;
    src: string;
    cacheKey: string;
    useNum: number;
    uuid: string | number;
    constructor(texture: BitmapTexture | ANoiseTexture | DirectTexture);
}
export default ResourceStateBitmapTexture;
