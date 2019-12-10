/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.10 20:8:18
 *
 */

import RedGPU from "../src/RedGPU.js";
import RedMesh from "../src/object3D/RedMesh.js";
import RedRender from "../src/renderer/RedRender.js";
import RedSphere from "../src/primitives/RedSphere.js";
import RedBitmapTexture from "../src/resources/RedBitmapTexture.js";
import RedScene from "../src/RedScene.js";
import RedView from "../src/RedView.js";
import RedGrid from "../src/object3D/RedGrid.js";
import RedObitController from "../src/controller/RedObitController.js";
import RedDirectionalLight from "../src/light/RedDirectionalLight.js";
import RedSkyBox from "../src/object3D/RedSkyBox.js";
import RedBitmapCubeTexture from "../src/resources/RedBitmapCubeTexture.js";
import RedColorPhongTextureMaterial from "../src/material/RedColorPhongTextureMaterial.js";
import RedColorPhongMaterial from "../src/material/RedColorPhongMaterial.js";
import RedStandardMaterial from "../src/material/RedStandardMaterial.js";
import RedAxis from "../src/object3D/RedAxis.js";

(async function () {
	const cvs = document.createElement('canvas');
	const glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.11/dist/web-devel/glslang.js');
	document.body.appendChild(cvs);

	const glslang = await glslangModule.default();
	console.log(glslang);
	let testMat
	let redGPU = new RedGPU(cvs, glslang,
		function (v,reason) {

			if(!v){
				console.log('reason',reason)
				return alert(reason || `WebGPU is unsupported, or no adapters or devices are available.`)
			}
			let tView;
			let tScene = new RedScene();
			let tGrid = new RedGrid(this)
			let tCamera = new RedObitController(this)
			let tCamera2 = new RedObitController(this)
			tGrid.centerColor = '#ff0000'


			tView = new RedView(this, tScene, tCamera)

			tCamera.targetView = tView // optional

			tScene.grid = tGrid
			// tScene.axis = new RedAxis(redGPU)
			let tLight
			tLight = new RedDirectionalLight('#ff0000', 1)
			tLight.x = 10
			tLight.y = 10
			tLight.z = 10
			tScene.addLight(tLight)
			//
			tLight = new RedDirectionalLight('#00ff00', 1)
			tLight.x = -10
			tLight.y = -10
			tLight.z = -10
			tScene.addLight(tLight)

			tLight = new RedDirectionalLight('#0000ff', 1)
			tLight.x = 0
			tLight.y = 30
			tLight.z = 0
			tScene.addLight(tLight)

			redGPU.addView(tView)
			let testTextureList = [
				new RedBitmapTexture(redGPU, 'assets/Brick03_col.jpg'),
				new RedBitmapTexture(redGPU, 'assets/Brick03_nrm.jpg'),
				new RedBitmapTexture(redGPU, 'assets/specular.png')
			];


			// testMat = new RedColorPhongTextureMaterial(redGPU, '#ffffff', 1, testTextureList[1], testTextureList[2])
			// testMat = new RedColorPhongMaterial(redGPU, '#ffffff', 1, testTextureList[1], testTextureList[2])
			testMat = new RedStandardMaterial(redGPU, testTextureList[0], testTextureList[1], testTextureList[2])
			testMat.shininess = 6
			let testMesh = new RedMesh(
				redGPU,
				new RedSphere(redGPU, 0.5, 16, 16, 16),
				testMat
			);

			tScene.addChild(testMesh)

			let renderer = new RedRender();
			let render = function (time) {
				tLight.x = Math.sin(time / 1000)
				tLight.y = Math.cos(time / 500)
				tLight.z = Math.cos(time / 750)
				renderer.render(time, redGPU);
				requestAnimationFrame(render);
			}
			requestAnimationFrame(render);
		}
	)

	let setTestUI = function (redGPU, tView, tScene) {

		let tFolder;

		let testCubeTexture = new RedBitmapCubeTexture(redGPU, [
			'./assets/cubemap/SwedishRoyalCastle/px.jpg',
			'./assets/cubemap/SwedishRoyalCastle/nx.jpg',
			'./assets/cubemap/SwedishRoyalCastle/py.jpg',
			'./assets/cubemap/SwedishRoyalCastle/ny.jpg',
			'./assets/cubemap/SwedishRoyalCastle/pz.jpg',
			'./assets/cubemap/SwedishRoyalCastle/nz.jpg'
			// './assets/cubemap/posx.jpg',
			// './assets/cubemap/negx.jpg',
			// './assets/cubemap/posy.jpg',
			// './assets/cubemap/negy.jpg',
			// './assets/cubemap/posz.jpg',
			// './assets/cubemap/negz.jpg'
		])
		console.log('RedBitmapCubeTexture', testCubeTexture)

		let skyBox = new RedSkyBox(redGPU, testCubeTexture)
		tScene.skyBox = skyBox
		let testSceneUI = new dat.GUI({});
		let testSceneData = {
			useSkyBox: true,
			useGrid: true,
		}
		testSceneUI.width = 350
		tFolder = testSceneUI.addFolder('RedScene')
		tFolder.open()
		tFolder.add(testSceneData, 'useSkyBox').onChange(v => tScene.skyBox = v ? skyBox : null)
		tFolder.add(testSceneData, 'useGrid').onChange(v => tScene.grid = v ? new RedGrid(redGPU) : null)
		tFolder.addColor(tScene, 'backgroundColor')
		tFolder.add(tScene, 'backgroundColorAlpha', 0, 1, 0.01)
		tFolder = testSceneUI.addFolder('RedView')
		tFolder.open()
		let viewTestData = {
			setLocationTest1: function () {
				tView.setLocation(0, 0)
			},
			setLocationTest2: function () {
				tView.setLocation(100, 100)
			},
			setLocationTest3: function () {
				tView.setLocation('50%', 100)
			},
			setLocationTest4: function () {
				tView.setLocation('40%', '40%')
			},
			setSizeTest1: function () {
				tView.setSize(200, 200)
			},
			setSizeTest2: function () {
				tView.setSize('50%', '100%')
			},
			setSizeTest3: function () {
				tView.setSize('50%', '50%')
			},
			setSizeTest4: function () {
				tView.setSize('20%', '20%')
			},
			setSizeTest5: function () {
				tView.setSize('100%', '100%')
			}
		}
		tFolder.add(viewTestData, 'setLocationTest1').name('setLocation(0,0)');
		tFolder.add(viewTestData, 'setLocationTest2').name('setLocation(100,100)');
		tFolder.add(viewTestData, 'setLocationTest3').name('setLocation(50%,100)');
		tFolder.add(viewTestData, 'setLocationTest4').name('setLocation(40%,40%)');
		tFolder.add(viewTestData, 'setSizeTest1').name('setSize(200,200)');
		tFolder.add(viewTestData, 'setSizeTest2').name('setSize(50%,100%)');
		tFolder.add(viewTestData, 'setSizeTest3').name('setSize(50%,50%)');
		tFolder.add(viewTestData, 'setSizeTest4').name('setSize(20%,20%)');
		tFolder.add(viewTestData, 'setSizeTest5').name('setSize(100%,100%)');

		let testUI = new dat.GUI({});
		let testData = {
			useDepthTest: true,
			depthTestFunc: "less",
			cullMode: "back",
			primitiveTopology: "triangle-list"
		};
		tFolder = testUI.addFolder('RedMesh')
		tFolder.open()

		tFolder.add(testData, 'useDepthTest').onChange(v => tScene.children.forEach(tMesh => tMesh.useDepthTest = v));

		tFolder.add(testData, 'depthTestFunc', [
			"never",
			"less",
			"equal",
			"less-equal",
			"greater",
			"not-equal",
			"greater-equal",
			"always"
		]).onChange(v => tScene.children.forEach(tMesh => tMesh.depthTestFunc = v));
		tFolder.add(testData, 'cullMode', [
			"none",
			"front",
			"back"
		]).onChange(v => tScene.children.forEach(tMesh => tMesh.cullMode = v));

		tFolder.add(testData, 'primitiveTopology', [
			"point-list",
			"line-list",
			"line-strip",
			"triangle-list",
			"triangle-strip"
		]).onChange(v => tScene.children.forEach(tMesh => tMesh.primitiveTopology = v));
	}


})();