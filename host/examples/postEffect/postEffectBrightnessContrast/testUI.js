import * as RedGPU from "../../../../dist/RedGPU.mjs"

const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext
	const view = viewList[0]
	const testData = {
		usePostEffectBrightnessContrast: true,
		currentEffect: view.postEffectManager.children[0],
		brightnessController: null,
		contrastController: null
	}
	const root = gui.addFolder('PostEffectBrightnessContrast Test UI');
	const setController = () => {
		removeController()
		const effect = new RedGPU.PostEffectBrightnessContrast(redGPUContext)
		view.postEffectManager.addEffect(effect)
		testData.currentEffect = effect
		testData.brightnessController = targetDebugger.__gui_setItem(root.add(effect, 'brightness',-150,150,0.01))
		testData.contrastController = targetDebugger.__gui_setItem(root.add(effect, 'contrast',-50,100,0.01))
	}
	const removeController = () => {
		if (testData.currentEffect) {
			view.postEffectManager.removeEffect(testData.currentEffect)
		}
		testData.currentEffect = null
		if (testData.brightnessController) {
			root.remove(testData.brightnessController)
			testData.brightnessController = null
		}
		if (testData.contrastController) {
			root.remove(testData.contrastController)
			testData.contrastController = null
		}
	}
	targetDebugger.__gui_setItemBooleanNameSize(root.add(testData, 'usePostEffectBrightnessContrast')).onFinishChange(v => {
		testData['usePostEffectBrightnessContrast'] = v
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
