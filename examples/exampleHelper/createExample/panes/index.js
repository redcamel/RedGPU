import createBitmapTextureTest from "./createBitmapTextureTest.js?t=1767864574385";
import createCameraTest from "./createCameraTest.js?t=1767864574385";
import createFieldOfView from "./createFieldOfView.js?t=1767864574385";
import createGridTest from "./createGridTest.js?t=1767864574385";
import createIblHelper from "./createIblHelper.js?t=1767864574385";
import setSceneListTest from "./scene/setSceneListTest.js?t=1767864574385";
import setSingleSceneTest from "./scene/setSingleSceneTest.js?t=1767864574385";
import setAntialiasing_pane from "./setAntialiasing_pane.js?t=1767864574385";
import setRedGPUTest_pane from "./setRedGPUTest_pane.js?t=1767864574385";
import setSingleViewTest from "./view/setSingleViewTest.js?t=1767864574385";
import setViewListTest from "./view/setViewListTest.js?t=1767864574385";
import setViewListTest_Pane from "./view/setViewListTest.js?t=1767864574385";

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

const setDebugButtons = (redGPUContext) => {
	const check = () => {
		const container = document.querySelector('.navigation-bar');
		if (container) {
			const rightContainer = document.createElement('div');
			rightContainer.style.display = 'flex';
			rightContainer.style.alignItems = 'center';
			rightContainer.style.gap = '1px';
			rightContainer.style.position = 'absolute';
			rightContainer.style.right = '0px';
			rightContainer.style.top = '0px';
			rightContainer.style.bottom = '0px';
			container.appendChild(rightContainer);

			requestAnimationFrame(() => {
				setAntialiasingSelect(redGPUContext, rightContainer)
				setAO(redGPUContext, rightContainer)
				setDebugButton(redGPUContext, rightContainer)
				setAxis(redGPUContext, rightContainer)
				setGrid(redGPUContext, rightContainer)
				setSettingView(redGPUContext, rightContainer)

			})
		} else {
			setTimeout(check, 100)
		}

	}
	setTimeout(check, 100)

}

const setDebugButton = (redGPUContext, rightContainer) => {
	let openYn = redGPUContext.useDebugPanel
	const debugViewButton = document.createElement('div');
	debugViewButton.className = 'nav-button example-setting-button';
	debugViewButton.innerText = 'Debug Panel';
	debugViewButton.innerHTML = '<img src="/RedGPU/examples/assets/icons/debug.svg" width="20"/>'
	rightContainer.appendChild(debugViewButton);
	const check = () => {

		redGPUContext.useDebugPanel = openYn;
		debugViewButton.children[0].style.opacity = openYn ? 1 : 0.25

	}
	if (debugViewButton && redGPUContext) {
		debugViewButton.addEventListener('click', async () => {
			openYn = !redGPUContext.useDebugPanel
			check()
		});
	}
	setTimeout(check, 1000);
}
const setGrid = (redGPUContext, rightContainer) => {
	if (redGPUContext.viewList.length > 1) return;
	const targetView = redGPUContext.viewList[0]
	let openYn = !!targetView.grid
	const button = document.createElement('div');
	button.className = 'nav-button example-setting-button';
	button.innerHTML = '<img src="/RedGPU/examples/assets/icons/grid.svg" width="24"/>'
	button.addEventListener('click', () => {
		openYn = !openYn;
		check()
	})
	rightContainer.appendChild(button);
	const check = () => {
		button.children[0].style.opacity = openYn ? 1 : 0.25
		targetView.grid = openYn
	}
	check()
}
const setAxis = (redGPUContext, rightContainer) => {
	if (redGPUContext.viewList.length > 1) return;
	const targetView = redGPUContext.viewList[0]
	let openYn = !!targetView.axis
	const button = document.createElement('div');
	button.className = 'nav-button example-setting-button';
	button.innerHTML = '<img src="/RedGPU/examples/assets/icons/axis.svg" width="23"/>'
	button.addEventListener('click', () => {
		openYn = !openYn;
		check()
	})
	rightContainer.appendChild(button);
	const check = () => {
		button.children[0].style.opacity = openYn ? 1 : 0.25
		targetView.axis = openYn
	}
	check()
}
const setSettingView = (redGPUContext, rightContainer) => {
	const panel = document.querySelector('.tp-dfwv')
	if (!panel) return
	let openYn = (redGPUContext.detector.isMobile || (window?.self !== window?.top)) ? false : true;
	const button = document.createElement('div');
	button.className = 'nav-button example-setting-button';
	button.innerHTML = '<img src="/RedGPU/examples/assets/icons/gears-solid-full.svg" width="20"/>'
	button.addEventListener('click', () => {
		openYn = !openYn;
		check()
	})
	rightContainer.appendChild(button);
	const check = () => {
		button.children[0].style.opacity = openYn ? 1 : 0.25
		panel.style.right = openYn ? '8px' : 'calc(-100% - 10px)'
	}
	check()
}
const setAO = (redGPUContext, rightContainer) => {
	if (redGPUContext.viewList.length > 1) return;
	if (redGPUContext.viewList[0].constructor.name === 'View2D') return;
	const targetView = redGPUContext.viewList[0]
	let openYn = !!targetView.postEffectManager.useSSAO
	const button = document.createElement('div');
	button.className = 'nav-button example-setting-button';
	button.innerHTML = 'SSAO'
	button.addEventListener('click', () => {
		openYn = !openYn;
		check()
	})
	rightContainer.appendChild(button);
	const check = () => {
		button.style.opacity = openYn ? 1 : 0.25
		targetView.postEffectManager.useSSAO = openYn
	}
	check()
}
const setAntialiasingSelect = (redGPUContext, rightContainer) => {
	const antialiasing = document.createElement('select');
	antialiasing.className = 'nav-button antialiasing-button';
	antialiasing.innerHTML = `
		<option value="useMSAA" ${redGPUContext.antialiasingManager.useMSAA ? 'selected="true"' : ''}>MSAA</option>
		<option value="useFXAA" ${redGPUContext.antialiasingManager.useFXAA ? 'selected="true"' : ''}>FXAA</option>
		<option value="useTAA" ${redGPUContext.antialiasingManager.useTAA ? 'selected="true"' : ''}>TAA</option>
		<option value="NONE" >NONE</option>
	`
	antialiasing.addEventListener('change', (e) => {
		const targetAntialiasing = e.target.value
		console.log(e.target.value)
		const {antialiasingManager} = redGPUContext
		antialiasingManager.useMSAA = false
		antialiasingManager.useFXAA = false
		antialiasingManager.useTAA = false
		if (targetAntialiasing !== 'NONE') {
			antialiasingManager[targetAntialiasing] = true
		}

	})
	rightContainer.appendChild(antialiasing);
}
const hdrImages = [
	{name: '2K - the sky is on fire', path: 'assets/hdr/2k/the_sky_is_on_fire_2k.hdr'},
	{name: '2K - furstenstein', path: 'assets/hdr/2k/furstenstein_2k.hdr'},
	{name: '4K - the sky is on fire', path: 'assets/hdr/4k/the_sky_is_on_fire_4k.hdr'},
	{name: '4K - furstenstein', path: 'assets/hdr/4k/furstenstein_4k.hdr'},
	{name: 'Cannon_Exterior', path: 'assets/hdr/Cannon_Exterior.hdr'},
	{name: 'field', path: 'assets/hdr/field.hdr'},
	{name: 'neutral.37290948', path: 'assets/hdr/neutral.37290948.hdr'},
	{name: 'pisa', path: 'assets/hdr/pisa.hdr'},
	{
		name: '6 cube face asset', path: [
			"assets/skybox/px.jpg",
			"assets/skybox/nx.jpg",
			"assets/skybox/py.jpg",
			"assets/skybox/ny.jpg",
			"assets/skybox/pz.jpg",
			"assets/skybox/nz.jpg",
		]
	},
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
	hdrImages,
	setDebugButtons
}
