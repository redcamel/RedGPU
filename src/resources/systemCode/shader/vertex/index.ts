import calcDisplacements from './calcDisplacements.wgsl'
import calculateMotionVector from './calculateMotionVector.wgsl'
import extractScaleAndTranslation from './extractScaleAndTranslation.wgsl'
import getBillboardMatrix from './getBillboardMatrix.wgsl'

const SystemVertexCode = Object.freeze({
    calcDisplacements,
    calculateMotionVector,
    getBillboardMatrix,
    extractScaleAndTranslation,
})
Object.freeze(SystemVertexCode)
export default SystemVertexCode

