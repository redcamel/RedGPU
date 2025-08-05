import drawDirectionalShadowDepth from '../../display/mesh/shader/core/drawDirectionalShadowDepth.wgsl'
import picking from '../../display/mesh/shader/core/picking.wgsl'
import calcTintBlendMode from './shader/calcTintBlendMode.wgsl'
import calcDirectionalShadowVisibility from './shader/fragment/calcDirectionalShadowVisibility.wgsl'
import calcPrePathBackground from './shader/fragment/calcPrePathBackground.wgsl'
import drawPicking from './shader/fragment/drawPicking.wgsl'
import normalFunctions from './shader/fragment/normalFunctions.wgsl'
import SYSTEM_UNIFORM from './shader/SYSTEM_UNIFORM.wgsl'
import calcDisplacements from './shader/vertex/calcDisplacements.wgsl'
import extractScaleAndTranslation from './shader/vertex/extractScaleAndTranslation.wgsl'
import getBillboardMatrix from './shader/vertex/getBillboardMatrix.wgsl'

const SystemCode = Object.freeze({
	SYSTEM_UNIFORM,
	calcTintBlendMode,
	calcDisplacements,
	//
	drawDirectionalShadowDepth,
	picking,
	//
	getBillboardMatrix,
	extractScaleAndTranslation,
	calcDirectionalShadowVisibility,
	//
	drawPicking,
	//
	normalFunctions,
	//
	calcPrePathBackground
})
Object.freeze(SystemCode)
export default SystemCode

