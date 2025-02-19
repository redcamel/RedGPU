import calcDirectionalShadowVisibility from './shader/fragment/calcDirectionalShadowVisibility.wgsl'
import drawPicking from './shader/fragment/drawPicking.wgsl'
import normalFunctions from './shader/fragment/normalFunctions.wgsl'
import SYSTEM_UNIFORM from './shader/SYSTEM_UNIFORM.wgsl'
import calcTintBlendMode from './shader/calcTintBlendMode.wgsl'
import drawDirectionalShadowDepth from './shader/vertex/drawDirectionalShadowDepth.wgsl'
import getBillboardMatrix from './shader/vertex/getBillboardMatrix.wgsl'
import extractScaleAndTranslation from './shader/vertex/extractScaleAndTranslation.wgsl'

const SystemCode = Object.freeze({
    SYSTEM_UNIFORM,
    calcTintBlendMode,
    //
    drawDirectionalShadowDepth,
    getBillboardMatrix,
    extractScaleAndTranslation,
    calcDirectionalShadowVisibility,
    //
    drawPicking,
    //
    normalFunctions
})
Object.freeze(SystemCode)
export default SystemCode

