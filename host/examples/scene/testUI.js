import * as RedGPU from "../../../dist/RedGPU.mjs"

const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext
	const {scene} = viewList[0]
	const testData = {
		grid: true,
		axis: true,
		skyBox: false,
	}
	const root = gui.addFolder('Scene Test UI');
	targetDebugger.__gui_setItem(gui.addColor(scene, 'backgroundColor'))
	targetDebugger.__gui_setItem(gui.add(scene, 'backgroundAlpha', 0, 1, 0.01))
	targetDebugger.__gui_setItemBooleanNameSize(gui.add(testData, 'grid')).onChange(v => {
		console.log(redGPUContext)
		scene['grid'] = v ? new RedGPU.Grid(redGPUContext) : null
	})
	targetDebugger.__gui_setItemBooleanNameSize(gui.add(testData, 'axis')).onChange(v => {
		console.log(redGPUContext)
		scene['axis'] = v ? new RedGPU.Axis(redGPUContext) : null
	})
	targetDebugger.__gui_setItemBooleanNameSize(gui.add(testData, 'skyBox')).onChange(v => {
		console.log(redGPUContext)
		scene['skyBox'] = v
			? new RedGPU.SkyBox(
				redGPUContext,
				[
					'../../assets/cubemap/SwedishRoyalCastle/px.jpg',
					'../../assets/cubemap/SwedishRoyalCastle/nx.jpg',
					'../../assets/cubemap/SwedishRoyalCastle/py.jpg',
					'../../assets/cubemap/SwedishRoyalCastle/ny.jpg',
					'../../assets/cubemap/SwedishRoyalCastle/pz.jpg',
					'../../assets/cubemap/SwedishRoyalCastle/nz.jpg'
				])
			: null
	})
	root.open()
}
export default testUI
