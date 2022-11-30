import * as RedGPU from "../../../../dist/RedGPU.mjs"

const testUI = (gui, redGPUContext, targetDebugger) => {
	const {viewList} = redGPUContext
	const view = viewList[0]
	const testData = {
		usePostEffectInvert: true
	}
	const root = gui.addFolder('PostEffectInvert Test UI');
	targetDebugger.__gui_setItemBooleanNameSize(gui.add(testData, 'usePostEffectInvert')).onChange(v => {
		testData['usePostEffectInvert'] = v
		if (v) {
			view.postEffectManager.addEffect(new RedGPU.PostEffectInvert(redGPUContext))
		} else {
			view.postEffectManager.removeEffect(view.postEffectManager.children[0])
		}
	})
	root.open()
}
export default testUI
