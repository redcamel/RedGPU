import createBitmapTextureTest from "./createBitmapTextureTest.js";
import createCameraTest from "./createCameraTest.js";
import createFieldOfView from "./createFieldOfView.js";
import createGridTest from "./createGridTest.js";
import createIblHelper from "./createIblHelper.js";
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

const hdrImages = [
	{name: 'the sky is on fire', path: 'assets/hdr/4k/the_sky_is_on_fire_4k.hdr'},
	{name: 'furstenstein', path: 'assets/hdr/4k/furstenstein.hdr'},
	{name: 'Cannon_Exterior', path: 'assets/hdr/Cannon_Exterior.hdr'},
	{name: 'field', path: 'assets/hdr/field.hdr'},
	{name: 'neutral.37290948', path: 'assets/hdr/neutral.37290948.hdr'},
	{name: 'pisa', path: 'assets/hdr/pisa.hdr'},
	{name: '6 cube face asset', path:  [
			"assets/skybox/px.jpg",
			"assets/skybox/nx.jpg",
			"assets/skybox/py.jpg",
			"assets/skybox/ny.jpg",
			"assets/skybox/pz.jpg",
			"assets/skybox/nz.jpg",
		]},
];
export {
	setViewListTest_Pane,
	setViewListTest,
	setSingleViewTest,
	createCameraTest,
	setSingleSceneTest,
	setSceneListTest,
	createGridTest,
	createBitmapTextureTest,
	createFieldOfView,
	setRedGPUTest_pane,
	setAntialiasing_pane,
	createIblHelper,
	hdrImages
}
