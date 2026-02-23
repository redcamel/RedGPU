import calcBillboard from '../../../../systemCodeManager/shader/math/billboard/getBillboardResult.wgsl'

import getBillboardMatrix from '../../../../systemCodeManager/shader/math/billboard/getBillboardMatrix.wgsl'
import meshVertexBasicUniform from '../../../../display/mesh/shader/meshVertexBasicUniform.wgsl'

const SystemVertexCode = Object.freeze({
    calcBillboard,

    getBillboardMatrix,
    meshVertexBasicUniform,
})
Object.freeze(SystemVertexCode)
export default SystemVertexCode