import CubeTexture from "../../../../texture/CubeTexture";
import IBLCubeTexture from "../../../../texture/ibl/IBLCubeTexture";
declare class ResourceStateCubeTexture {
    texture: CubeTexture | IBLCubeTexture;
    srcList: string[];
    cacheKey: string;
    useNum: number;
    uuid: string | number;
    constructor(cubeTexture: CubeTexture | IBLCubeTexture);
}
export default ResourceStateCubeTexture;
