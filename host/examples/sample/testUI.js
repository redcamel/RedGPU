const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext

	const root = gui.addFolder('MultiView Test UI');
	viewList.forEach(view => {
		const viewFolder = root.addFolder(view.label);
		['x', 'y'].forEach(key => {
			viewFolder.add(view, key, -100, 500, 0.01)
		});
		['width', 'height'].forEach(key => {
			targetDebugger.__gui_setItemDisableInput(viewFolder.add(view, key))
		})

		viewFolder.open()
	})
	root.open()
}
export default testUI
