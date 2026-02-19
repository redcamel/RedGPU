import calcBillboard from './calcBillboard.wgsl'
import calcDisplacements from './calcDisplacements.wgsl'

import getBillboardMatrix from './getBillboardMatrix.wgsl'
import meshVertexBasicUniform from '../../../../display/mesh/shader/meshVertexBasicUniform.wgsl'

const SystemVertexCode = Object.freeze({
    calcBillboard,
    calcDisplacements,

    getBillboardMatrix,
    meshVertexBasicUniform,
})
Object.freeze(SystemVertexCode)
export default SystemVertexCode