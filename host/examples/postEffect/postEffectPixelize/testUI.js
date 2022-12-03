import * as RedGPU from "../../../../dist/RedGPU.mjs"

const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext
	const view = viewList[0]
	const testData = {
		usePostEffectPixelize: true,
		currentEffect: view.postEffectManager.children[0],
		effectRenderTimeController: null,
		widthController: null,
		heightController: null
	}
	const root = gui.addFolder('PostEffectPixelize Test UI');
	const setController = () => {
		removeController()
		const effect = new RedGPU.PostEffectPixelize(redGPUContext)
		view.postEffectManager.addEffect(effect)
		testData.currentEffect = effect
		testData.effectRenderTimeController = targetDebugger.__gui_setItemDisableInput(root.add(effect, 'effectRenderTime', 0, 3, 0.0001), 'auto')
		testData.widthController = targetDebugger.__gui_setItem(root.add(effect, 'width', 1, 30, 0.01))
		testData.heightController = targetDebugger.__gui_setItem(root.add(effect, 'height', 1, 30, 0.01))
	}
	const removeController = () => {
		if (testData.currentEffect) {
			view.postEffectManager.removeEffect(testData.currentEffect)
		}
		testData.currentEffect = null
		if (testData.effectRenderTimeController) {
			root.remove(testData.effectRenderTimeController)
			testData.effectRenderTimeController = null
		}
		if (testData.widthController) {
			root.remove(testData.widthController)
			testData.widthController = null
		}
		if (testData.heightController) {
			root.remove(testData.heightController)
			testData.heightController = null
		}
	}
	targetDebugger.__gui_setItemBooleanNameSize(root.add(testData, 'usePostEffectPixelize')).onFinishChange(v => {
		testData['usePostEffectPixelize'] = v
		if (v) {
			setController()
		} else {
			removeController()
		}
	})
	setController()
	root.open()
}
export default testUI
