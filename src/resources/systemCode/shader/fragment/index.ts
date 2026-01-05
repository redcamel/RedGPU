import drawDirectionalShadowDepth from '../../../../display/mesh/shader/core/drawDirectionalShadowDepth.wgsl'
import picking from '../../../../display/mesh/shader/core/picking.wgsl'
import calcDirectionalShadowVisibility from "./calcDirectionalShadowVisibility.wgsl";
import calcPrePathBackground from './calcPrePathBackground.wgsl'
import calcTintBlendMode from './calcTintBlendMode.wgsl'
import drawPicking from './drawPicking.wgsl'
import FragmentOutput from './fragmentOutput.wgsl'
import normalFunctions from './normalFunctions.wgsl'
import calculateMotionVector from './calculateMotionVector.wgsl'

const SystemFragmentCode = Object.freeze({
    calcTintBlendMode,
    calcDirectionalShadowVisibility,
    drawDirectionalShadowDepth,
    normalFunctions,
    calcPrePathBackground,
    calculateMotionVector,
    FragmentOutput,
    //
    picking,
    drawPicking,
})
Object.freeze(SystemFragmentCode)
export default SystemFragmentCode

