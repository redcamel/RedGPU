const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext
	const {scene} = viewList[0]

	const root = gui.addFolder('Scene Test UI');
	targetDebugger.__gui_setItem(gui.addColor(scene,'backgroundColor'))
	targetDebugger.__gui_setItem(gui.add(scene,'backgroundAlpha',0,1,0.01))
	root.open()
}
export default testUI
