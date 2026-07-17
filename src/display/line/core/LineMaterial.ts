import RedGPUContext from "../../../context/RedGPUContext";
import ABaseMaterial from "../../../material/core/ABaseMaterial";
import fragmentModuleSource from '../shader/fragment.wgsl'

class LineMaterial extends ABaseMaterial {
    constructor(redGPUContext: RedGPUContext, name?: string) {
        super(
            redGPUContext,
            'LINE_MATERIAL',
            fragmentModuleSource,
            2
        )
        if (name) this.name = name
        this.initGPURenderInfos()
    }
}

Object.freeze(LineMaterial)
export default LineMaterial
