import drawDirectionalShadowDepth from '../../../../display/mesh/shader/core/drawDirectionalShadowDepth.wgsl'
import picking from '../../../../display/mesh/shader/core/entryPointPickingVertex.wgsl'
import entryPointPickingFragment from './entryPointPickingFragment.wgsl'
import FragmentOutput from './fragmentOutput.wgsl'

const SystemFragmentCode = Object.freeze({
    drawDirectionalShadowDepth,
    FragmentOutput,
    //
    picking,
    drawPicking: entryPointPickingFragment,
})
Object.freeze(SystemFragmentCode)
export default SystemFragmentCode
