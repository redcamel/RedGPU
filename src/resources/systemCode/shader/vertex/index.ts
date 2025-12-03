import calcDisplacements from './calcDisplacements.wgsl'
import calculateMotionVector from './calculateMotionVector.wgsl'
import extractScaleAndTranslation from './extractScaleAndTranslation.wgsl'
import getBillboardMatrix from './getBillboardMatrix.wgsl'
import meshVertexBasicUniform from '../../../../display/mesh/shader/meshVertexBasicUniform.wgsl'

const SystemVertexCode = Object.freeze({
    calcDisplacements,
    calculateMotionVector,
    getBillboardMatrix,
    extractScaleAndTranslation,
    meshVertexBasicUniform,
})
Object.freeze(SystemVertexCode)
export default SystemVertexCode

