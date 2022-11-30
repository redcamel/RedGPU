const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext

	const root = gui.addFolder('MultiView Test UI');
	viewList.forEach(view => {
		const viewFolder = root.addFolder(view.label);
		const pixelViewRectTestData = {
			pixelViewRect : view.pixelViewRect.toString(),
			x:view.x.toString(),
			y:view.y.toString(),
			width:view.width.toString(),
			height:view.height.toString()
		};
		const updateData = ()=>{
			pixelViewRectTestData.pixelViewRect = view.pixelViewRect.map(v=>v.toFixed(2))
			pixelViewRectTestData.x = view.x.toString()
			pixelViewRectTestData.y = view.y.toString()
			pixelViewRectTestData.width = view.width.toString()
			pixelViewRectTestData.height = view.height.toString()
		}
		['x', 'y'].forEach(key => {
			viewFolder.add(view, key, -200, 200, 0.01).onChange(v=> {

				updateData()
			})
		});
		['x','y','width', 'height'].forEach(key => {
			targetDebugger.__gui_setItemDisableInput(viewFolder.add(pixelViewRectTestData, key).name(`current ${key}`)).onChange(v=>{
				const updateData = ()=>{
					pixelViewRectTestData.pixelViewRect = view.pixelViewRect.toString()
				}
			})
		});
		targetDebugger.__gui_setItemDisableInput(viewFolder.add(pixelViewRectTestData, 'pixelViewRect'),'auto','11px')
		targetDebugger.__gui_setItemDisableInput(viewFolder.add(view.scene, 'label').name('scene'), 'auto')
		targetDebugger.__gui_setItemDisableInput(viewFolder.add(view.camera.constructor, 'name').name('camera type'), 'auto')
		///
		const methodFolder = viewFolder.addFolder('setSize & setLocation Test');
		const testData = {
			setLocationTest1: function () {
				view.setLocation(0, 0)
				updateData()
			},
			setLocationTest2: function () {
				view.setLocation(100, 100)
				updateData()
			},
			setLocationTest3: function () {
				view.setLocation('50%', 100)
				updateData()
			},
			setLocationTest4: function () {
				view.setLocation('40%', '40%')
				updateData()
			},
			setSizeTest1: function () {
				view.setSize(200, 200)
				updateData()
			},
			setSizeTest2: function () {
				view.setSize('50%', '100%')
				updateData()
			},
			setSizeTest3: function () {
				view.setSize('50%', '50%')
				updateData()
			},
			setSizeTest4: function () {
				view.setSize('20%', '20%')
				updateData()
			},
			setSizeTest5: function () {
				view.setSize('100%', '100%')
				updateData()
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
