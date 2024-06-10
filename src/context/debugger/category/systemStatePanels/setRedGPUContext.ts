import RedGPUContext from "../../../RedGPUContext";
import gui_setItem from "../../funcs/gui_setItem";
import gui_setItemDisableInput from "../../funcs/gui_setItemDisableInput";

const setRedGPUContext = (gui, redGPUContext: RedGPUContext) => {
	const redGPUContextFolder = gui.addFolder('redGPUContext');
	{
		const configurationDescriptionFolder = redGPUContextFolder.addFolder('configurationDescription');
		const t0 = redGPUContext.configurationDescription
		for (const key in t0) {
			if (typeof t0[key] === 'string') gui_setItemDisableInput(configurationDescriptionFolder.add(t0, key))
		}
	}
	gui_setItem(redGPUContextFolder.add(redGPUContext, 'renderScale', 0.01, 1, 0.01));
	gui_setItem(redGPUContextFolder.add(redGPUContext, 'useMultiSample'));
	// size
	gui_setItemDisableInput(redGPUContextFolder.add(redGPUContext, 'width'))
	gui_setItemDisableInput(redGPUContextFolder.add(redGPUContext, 'height'))
	gui_setItemDisableInput(redGPUContextFolder.add(redGPUContext.pixelSizeInt, 'width').name('pixelSizeInt.width'))
	gui_setItemDisableInput(redGPUContextFolder.add(redGPUContext.pixelSizeInt, 'height').name('pixelSizeInt.height'))
	redGPUContextFolder.open()
}
export default setRedGPUContext
