const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext

	const root = gui.addFolder('MultiView Test UI');
	viewList.forEach(view => {
		const viewFolder = root.addFolder(view.label);
		const pixelViewRectTestData = {
			pixelViewRect : view.pixelViewRect.toString()
		};
		['x', 'y'].forEach(key => {
			viewFolder.add(view, key, -200, 200, 0.01).onChange(v=> pixelViewRectTestData.pixelViewRect = view.pixelViewRect.map(v=>v.toFixed(2)))
		});
		['width', 'height'].forEach(key => {
			targetDebugger.__gui_setItemDisableInput(viewFolder.add(view, key))
		});
		targetDebugger.__gui_setItemDisableInput(viewFolder.add(pixelViewRectTestData, 'pixelViewRect'),'auto','11px')
		targetDebugger.__gui_setItemDisableInput(viewFolder.add(view.scene, 'label').name('scene'), 'auto')
		targetDebugger.__gui_setItemDisableInput(viewFolder.add(view.camera.constructor, 'name').name('camera type'), 'auto')
		///
		const methodFolder = viewFolder.addFolder('setSize & setLocation Test');
		const testData = {
			setLocationTest1: function () {
				view.setLocation(0, 0)
			},
			setLocationTest2: function () {
				view.setLocation(100, 100)

			},
			setLocationTest3: function () {
				view.setLocation('50%', 100)

			},
			setLocationTest4: function () {
				view.setLocation('40%', '40%')

			},
			setSizeTest1: function () {
				view.setSize(200, 200)

			},
			setSizeTest2: function () {
				view.setSize('50%', '100%')

			},
			setSizeTest3: function () {
				view.setSize('50%', '50%')

			},
			setSizeTest4: function () {
				view.setSize('20%', '20%')

			},
			setSizeTest5: function () {
				view.setSize('100%', '100%')

			}
		};
		methodFolder.add(testData, 'setLocationTest1').name('setLocation(0,0)');
		methodFolder.add(testData, 'setLocationTest2').name('setLocation(100,100)');
		methodFolder.add(testData, 'setLocationTest3').name('setLocation(50%,100)');
		methodFolder.add(testData, 'setLocationTest4').name('setLocation(40%,40%)');
		methodFolder.add(testData, 'setSizeTest1').name('setSize(200,200)');
		methodFolder.add(testData, 'setSizeTest2').name('setSize(50%,100%)');
		methodFolder.add(testData, 'setSizeTest3').name('setSize(50%,50%)');
		methodFolder.add(testData, 'setSizeTest4').name('setSize(20%,20%)');
		methodFolder.add(testData, 'setSizeTest5').name('setSize(100%,100%)');

		viewFolder.open()
	})
	root.open()
}
export default testUI
