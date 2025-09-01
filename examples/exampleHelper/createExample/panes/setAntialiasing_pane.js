/**
 * Sets the size of the GPU context test pane.
 *
 * @param {Object} pane - The pane object to set the size for.
 * @param {Object} redGPUContext - The redGPU context object.
 * @param {boolean} [openYn=false] - Determines whether the pane should be initially expanded.
 *
 * @return {void}
 */
const setAntialiasing_pane = (pane, redGPUContext, openYn = false) => {

	const folder = pane.addFolder({
		title: 'antialiasing',
		expanded: openYn
	});

	folder.addBinding(redGPUContext.antialiasingManager, 'useMSAA')
	////////////////////////
	folder.addBinding(redGPUContext.antialiasingManager, 'useFXAA')
	// folder.addBinding(redGPUContext.antialiasingManager, 'fxaa_subpix', {
	// 	min: 0,
	// 	max: 1,
	// 	step: 0.01
	// }).on('change', (info) => {
	// 	redGPUContext.fxaa_subpix = info.value
	// })
	// folder.addBinding(redGPUContext.antialiasingManager, 'fxaa_edgeThreshold', {
	// 	min: .0001,
	// 	max: 0.25,
	// 	step: 0.0001
	// }).on('change', (info) => {
	// 	redGPUContext.edgeThreshold = info.value
	// })
	// folder.addBinding(redGPUContext.antialiasingManager, 'fxaa_edgeThresholdMin', {
	// 	min: .00001,
	// 	max: 0.1,
	// 	step: 0.00001
	// }).on('change', (info) => {
	// 	redGPUContext.edgeThresholdMin = info.value
	// })
	/////////////////////////

	const taaFolder = folder.addFolder({
		title: 'TAA',
		expanded: true
	});
	taaFolder.addBinding(redGPUContext.antialiasingManager, 'useTAA')
	const taaEffect = redGPUContext.antialiasingManager.taa;
	taaFolder.addBinding(taaEffect, 'jitterStrength', {min: 0, max: 1, step: 0.01})
		.on('change', (v) => {
			taaEffect.jitterStrength = v.value;
		});
	taaFolder.addBinding(taaEffect, 'temporalBlendFactor', {min: 0, max: 1, step: 0.01})
		.on('change', (v) => {
			taaEffect.temporalBlendFactor = v.value;
		});
	taaFolder.addBinding(taaEffect, 'motionBlurReduction', {min: 0.0, max: 1, step: 0.01})
		.on('change', (v) => {
			taaEffect.motionBlurReduction = v.value;
		});
	taaFolder.addBinding(taaEffect, 'disocclusionThreshold', {min: 0.1, max: 1, step: 0.01})
		.on('change', (v) => {
			taaEffect.disocclusionThreshold = v.value;
		});
	taaFolder.addBinding(taaEffect, 'varianceClipping');
	taaFolder.addBinding(taaEffect, 'useMotionVectors');

}
export default setAntialiasing_pane
