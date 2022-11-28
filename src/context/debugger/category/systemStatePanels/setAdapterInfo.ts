import gui_setItemDisableInput from "../../funcs/gui_setItemDisableInput";
import RedGPUContextDebugger from "../../RedGPUContextDebugger";

const setAdapterInfo = (gui,targetDebugger:RedGPUContextDebugger)=>{
	const {adapterInfo} = targetDebugger
	const tFolder = gui.addFolder('Adapter Info')
	tFolder.open()
	for (const key in adapterInfo) gui_setItemDisableInput(tFolder.add(adapterInfo, key))
}

export default setAdapterInfo