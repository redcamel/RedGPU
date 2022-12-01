import * as RedGPU from "../../../../dist/RedGPU.mjs"

const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext
	const view = viewList[0]
	const testData = {
		usePostEffectGray: true
	}
	const root = gui.addFolder('PostEffectGray Test UI');
	targetDebugger.__gui_setItemBooleanNameSize(gui.add(testData, 'usePostEffectGray')).onChange(v => {
		testData['usePostEffectGray'] = v
		if (v) {
			view.postEffectManager.addEffect(new RedGPU.PostEffectGray(redGPUContext))
		} else {
			view.postEffectManager.removeEffect(view.postEffectManager.children[0])
		}
	})
	root.open()
}
export default testUI
