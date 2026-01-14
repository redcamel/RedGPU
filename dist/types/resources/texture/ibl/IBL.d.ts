import RedGPUContext from "../../../context/RedGPUContext";
import IBLCubeTexture from "./IBLCubeTexture";
/**
 * @category IBL
 */
declare class IBL {
    #private;
    constructor(redGPUContext: RedGPUContext, srcInfo: string | [string, string, string, string, string, string], envCubeSize?: number, iblCubeSize?: number);
    get envCubeSize(): number;
    get iblCubeSize(): number;
    get irradianceTexture(): IBLCubeTexture;
    get environmentTexture(): IBLCubeTexture;
    get iblTexture(): IBLCubeTexture;
}
export default IBL;
