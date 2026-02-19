import drawDirectionalShadowDepth from '../../../../display/mesh/shader/core/drawDirectionalShadowDepth.wgsl'
import FragmentOutput from './fragmentOutput.wgsl'

const SystemFragmentCode = Object.freeze({
    drawDirectionalShadowDepth,
    FragmentOutput,
})
Object.freeze(SystemFragmentCode)
export default SystemFragmentCode
