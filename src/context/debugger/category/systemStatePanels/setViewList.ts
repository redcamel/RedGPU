import RedGPUContextDebugger from "../../RedGPUContextDebugger";
import RedGPUContext from "../../../RedGPUContext";
import gui_setItemDisableInput from "../../funcs/gui_setItemDisableInput";

const setViewList = (gui,redGPUContext:RedGPUContext,targetDebugger:RedGPUContextDebugger)=>{
	const viewListFolder = gui.addFolder('viewList');
	viewListFolder.open();
	const viewItemList = []
	const HD_ViewList = () => {
		viewItemList.forEach(item => {
			viewListFolder.removeFolder(item)
		})
		viewItemList.length = 0
		redGPUContext.viewList.forEach(view => {
			const folder = viewListFolder.addFolder(view.label)
			gui_setItemDisableInput(folder.add(view,'label'))
			gui_setItemDisableInput(folder.add(view.scene,'label').name('scene label'))
			gui_setItemDisableInput(folder.add(view.camera.constructor,'name').name('camera type'),'auto')
			folder.open()
			viewItemList.push(folder)
		})
	}
	targetDebugger.temp_HD_ViewList = HD_ViewList
	window.addEventListener('changeViewList', HD_ViewList)
}

export default setViewList