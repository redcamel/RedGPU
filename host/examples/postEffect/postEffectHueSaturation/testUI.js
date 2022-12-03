import * as RedGPU from "../../../../dist/RedGPU.mjs"

const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext
	const view = viewList[0]
	const testData = {
		usePostEffectHueSaturation: true,
		currentEffect: view.postEffectManager.children[0],
		effectRenderTimeController:null,
		hueController: null,
		saturationController: null
	}
	const root = gui.addFolder('PostEffectHueSaturation Test UI');
	const setController = () => {
		removeController()
		const effect = new RedGPU.PostEffectHueSaturation(redGPUContext)
		view.postEffectManager.addEffect(effect)
		testData.currentEffect = effect
		testData.effectRenderTimeController = targetDebugger.__gui_setItemDisableInput(root.add(effect, 'effectRenderTimeString'), 'auto')
		testData.hueController = targetDebugger.__gui_setItem(root.add(effect, 'hue',-180,180,0.01))
		testData.saturationController = targetDebugger.__gui_setItem(root.add(effect, 'saturation',-100,100,0.01))
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
			removeController()
		}
	})
	setController()
	root.open()
}
export default testUI
