import billboardPicking from './billboardPicking.wgsl'
import billboardShadow from './billboardShadow.wgsl'
import calcBillboard from './calcBillboard.wgsl'
import calcDisplacements from './calcDisplacements.wgsl'

import extractScaleAndTranslation from './extractScaleAndTranslation.wgsl'
import getBillboardMatrix from './getBillboardMatrix.wgsl'
import meshVertexBasicUniform from '../../../../display/mesh/shader/meshVertexBasicUniform.wgsl'

const SystemVertexCode = Object.freeze({
    billboardPicking,
    billboardShadow,
    calcBillboard,
    calcDisplacements,

    getBillboardMatrix,
    extractScaleAndTranslation,
    meshVertexBasicUniform,
})
Object.freeze(SystemVertexCode)
export default SystemVertexCode