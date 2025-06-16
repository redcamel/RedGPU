import createBitmapTextureTest from "./createBitmapTextureTest.js";
import createCameraTest from "./createCameraTest.js";
import createGridTest from "./createGridTest.js";
import setSceneListTest from "./scene/setSceneListTest.js";
import setSingleSceneTest from "./scene/setSingleSceneTest.js";
import setAntialiasing_pane from "./setAntialiasing_pane.js";
import setRedGPUTest_pane from "./setRedGPUTest_pane.js";
import setSingleViewTest from "./view/setSingleViewTest.js";
import setViewListTest from "./view/setViewListTest.js";
import setViewListTest_Pane from "./view/setViewListTest.js";

/**
 * Sets a separator in the given pane.
 *
 * @param {object} pane - The pane to add the separator to.
 *
 * @return {void}
 */
export function setSeparator(pane) {
	pane.addBlade({view: 'separator',});
}

export {
	setViewListTest_Pane,
	setViewListTest,
	setSingleViewTest,
	createCameraTest,
	setSingleSceneTest,
	setSceneListTest,
	createGridTest,
	createBitmapTextureTest,
	setRedGPUTest_pane,
	setAntialiasing_pane
}
