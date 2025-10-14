import ABaseMaterial from "../../../material/core/ABaseMaterial";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from '../shader/fragment.wgsl';
const SHADER_INFO = parseWGSL(fragmentModuleSource);
class LineMaterial extends ABaseMaterial {
    constructor(redGPUContext, name) {
        super(redGPUContext, 'LINE_MATERIAL', SHADER_INFO, 2);
        if (name)
            this.name = name;
        this.initGPURenderInfos();
    }
}
Object.freeze(LineMaterial);
export default LineMaterial;
