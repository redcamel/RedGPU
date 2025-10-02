import HDRTexture from "../../../../texture/hdr/HDRTexture";
declare class ResourceStateHDRTexture {
    texture: HDRTexture;
    src: string;
    cacheKey: string;
    useNum: number;
    uuid: string | number;
    constructor(texture: HDRTexture);
}
export default ResourceStateHDRTexture;
