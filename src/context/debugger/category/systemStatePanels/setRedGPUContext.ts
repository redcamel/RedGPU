import gui_setItemDisableInput from "../../funcs/gui_setItemDisableInput";
import gui_setItem from "../../funcs/gui_setItem";
import RedGPUContext from "../../../RedGPUContext";

const setRedGPUContext = (gui,redGPUContext:RedGPUContext)=>{
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
	gui_setItemDisableInput(redGPUContextFolder.add(redGPUContext.pixelSize, 'width').name('pixelSize.width'))
	gui_setItemDisableInput(redGPUContextFolder.add(redGPUContext.pixelSize, 'height').name('pixelSize.height'))
	// size test
	{
		const sizeTestFolder = redGPUContextFolder.addFolder('setSize Method Test');
		const sizeTest = {
			setSizeTest1: function () {
				redGPUContext.setSize(300, 300);
			},
			setSizeTest2: function () {
				redGPUContext.setSize(600, 300);
			},
			setSizeTest3: function () {
				redGPUContext.setSize('50%', 300);
			},
			setSizeTest4: function () {
				redGPUContext.setSize(300, '50%');
			},
			setSizeTest5: function () {
				redGPUContext.setSize('100%', '100%');
			}
		};
		sizeTestFolder.add(sizeTest, 'setSizeTest1').name('setSize(300,300)');
		sizeTestFolder.add(sizeTest, 'setSizeTest2').name('setSize(600,300)');
		sizeTestFolder.add(sizeTest, 'setSizeTest3').name('setSize(50%,300)');
		sizeTestFolder.add(sizeTest, 'setSizeTest4').name('setSize(300,50%)');
		sizeTestFolder.add(sizeTest, 'setSizeTest5').name('setSize(100%,100%)');
	}
	redGPUContextFolder.open()
}

export default setRedGPUContext