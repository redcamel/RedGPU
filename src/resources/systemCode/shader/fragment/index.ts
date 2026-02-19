import drawDirectionalShadowDepth from '../../../../display/mesh/shader/core/drawDirectionalShadowDepth.wgsl'
import picking from '../../../../display/mesh/shader/core/picking.wgsl'
import drawPicking from './drawPicking.wgsl'
import FragmentOutput from './fragmentOutput.wgsl'

const SystemFragmentCode = Object.freeze({
    drawDirectionalShadowDepth,
    FragmentOutput,
    //
    picking,
    drawPicking,
})
Object.freeze(SystemFragmentCode)
export default SystemFragmentCode
