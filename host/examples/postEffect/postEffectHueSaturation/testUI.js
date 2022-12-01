import * as RedGPU from "../../../../dist/RedGPU.mjs"

const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext
	const view = viewList[0]
	const testData = {
		usePostEffectHueSaturation: true,
		currentEffect: view.postEffectManager.children[0],
		hueController: null,
		saturationController: null
	}
	const root = gui.addFolder('PostEffectHueSaturation Test UI');
	const setController = () => {
		removeController()
		const effect = new RedGPU.PostEffectHueSaturation(redGPUContext)
		view.postEffectManager.addEffect(effect)
		testData.currentEffect = effect
		testData.hueController = targetDebugger.__gui_setItem(root.add(effect, 'hue',-180,180,0.01))
		testData.saturationController = targetDebugger.__gui_setItem(root.add(effect, 'saturation',-100,100,0.01))
	}
	const removeController = () => {
		testData.currentEffect = null
		if (testData.hueController) {
			root.remove(testData.hueController)
			testData.hueController = null
		}
		if (testData.saturationController) {
			root.remove(testData.saturationController)
			testData.saturationController = null
		}
	}
	targetDebugger.__gui_setItemBooleanNameSize(root.add(testData, 'usePostEffectHueSaturation')).onFinishChange(v => {
		testData['usePostEffectHueSaturation'] = v
		if (v) {
			setController()
		} else {
			if (view.postEffectManager.children[0]) {
				removeController()
				view.postEffectManager.removeEffect(view.postEffectManager.children[0])
			}
		}
	})
	setController()
	root.open()
}
export default testUI
