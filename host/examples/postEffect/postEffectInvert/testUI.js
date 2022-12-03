import * as RedGPU from "../../../../dist/RedGPU.mjs"

const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext
	const view = viewList[0]
	const testData = {
		usePostEffectInvert: true,
		currentEffect: view.postEffectManager.children[0],
		effectRenderTimeController: null,
	}
	const root = gui.addFolder('PostEffectInvert Test UI');
	const setController = () => {
		removeController()
		const effect = new RedGPU.PostEffectInvert(redGPUContext)
		view.postEffectManager.addEffect(effect)
		testData.currentEffect = effect
		testData.effectRenderTimeController = targetDebugger.__gui_setItemDisableInput(root.add(effect, 'effectRenderTimeString'), 'auto')

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
	}
	targetDebugger.__gui_setItemBooleanNameSize(root.add(testData, 'usePostEffectInvert')).onFinishChange(v => {
		testData['usePostEffectInvert'] = v
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
