import CubeTexture from "../../../../texture/CubeTexture";
import DirectCubeTexture from "../../../../texture/DirectCubeTexture";
declare class ResourceStateCubeTexture {
    texture: CubeTexture | DirectCubeTexture;
    srcList: string[];
    cacheKey: string;
    useNum: number;
    uuid: string | number;
    constructor(cubeTexture: CubeTexture | DirectCubeTexture);
}
export default ResourceStateCubeTexture;
