/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.12 21:19:8
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
import RedEnvironmentMaterial from "../src/material/RedEnvironmentMaterial.js";
import RedPostEffect_Invert from "../src/postEffect/adjustments/RedPostEffect_Invert.js";
import RedPostEffect_Gray from "../src/postEffect/adjustments/RedPostEffect_Gray.js";
import RedPostEffect_BrightnessContrast from "../src/postEffect/adjustments/RedPostEffect_BrightnessContrast.js";
import RedPostEffect_Threshold from "../src/postEffect/adjustments/RedPostEffect_Threshold.js";
import RedPostEffect_HueSaturation from "../src/postEffect/adjustments/RedPostEffect_HueSaturation.js";
import RedPostEffect_Pixelize from "../src/postEffect/pixelate/RedPostEffect_Pixelize.js";
import RedPostEffect_HalfTone from "../src/postEffect/pixelate/RedPostEffect_HalfTone.js";
import RedPostEffect_Blur from "../src/postEffect/blur/RedPostEffect_Blur.js";
import RedPostEffect_BlurX from "../src/postEffect/blur/RedPostEffect_BlurX.js";
import RedPostEffect_BlurY from "../src/postEffect/blur/RedPostEffect_BlurY.js";
import RedPostEffect_GaussianBlur from "../src/postEffect/blur/RedPostEffect_GaussianBlur.js";
import RedPostEffect_ZoomBlur from "../src/postEffect/blur/RedPostEffect_ZoomBlur.js";
import RedPostEffect_DoF from "../src/postEffect/dof/RedPostEffect_DoF.js";
import RedPostEffect_Bloom from "../src/postEffect/bloom/RedPostEffect_Bloom.js";
import RedPostEffect_Vignetting from "../src/postEffect/RedPostEffect_Vignetting.js";
import RedPostEffect_Film from "../src/postEffect/RedPostEffect_Film.js";
import RedPostEffect_Convolution from "../src/postEffect/RedPostEffect_Convolution.js";
import RedGLTFLoader from "../src/loader/RedGLTFLoader.js";
import RedAxis from "../src/object3D/RedAxis.js";
import RedBox from "../src/primitives/RedBox.js";
import RedColorMaterial from "../src/material/RedColorMaterial.js";
import RedAmbientLight from "../src/light/RedAmbientLight.js";
import RedColorPhongMaterial from "../src/material/RedColorPhongMaterial.js";

(async function () {
	const cvs = document.createElement('canvas');
	const glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.12/dist/web-devel/glslang.js');
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
			// tScene.backgroundColor = '#fff'
			// tScene.backgroundColorAlpha = 0

			tCamera.distance = 10
			tCamera.speedDistance = 1


			tView = new RedView(this, tScene, tCamera)

			tCamera.targetView = tView // optional

			tScene.grid = tGrid

			tScene.axis = new RedAxis(redGPU)
			let tLight
			tLight = new RedDirectionalLight()
			tLight.x = 3
			tLight.y = 2
			tLight.z = 3
			tScene.addLight(tLight)
			//
			tLight = new RedDirectionalLight()
			tLight.x = -100
			tLight.y = -100
			tLight.z = -100
			tScene.addLight(tLight)

			// tLight = new RedDirectionalLight()
			// tLight.x = 100
			// tLight.y = -100
			// tLight.z = 100
			// tScene.addLight(tLight)

			tLight = new RedAmbientLight()
			tScene.addLight(tLight)

			redGPU.addView(tView)

			// new RedGLTFLoader(
			// 	this, // redGL
			// 	'assets/gltf/', // assetRootPath
			// 	'NormalTangentMirrorTest.gltf', // fileName
			// 	function (v) { // callBack
			// 		console.log(v)
			// 		let tMesh = v['resultMesh']
			// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
			//
			// 		tScene.addChild(tMesh)
			//
			// 	},
			// 	new RedBitmapCubeTexture(redGPU, [
			// 		'./assets/cubemap/SwedishRoyalCastle/px.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/nx.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/py.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/ny.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/pz.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/nz.jpg'
			//
			// 	])
			// );
			// new RedGLTFLoader(
			// 	this, // redGL
			// 	'assets/gltf/', // assetRootPath
			// 	'TextureSettingsTest.gltf', // fileName
			// 	function (v) { // callBack
			// 		console.log(v)
			// 		let tMesh = v['resultMesh']
			// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
			// 		tMesh.z = -5
			// 		tScene.addChild(tMesh)
			//
			// 	},
			// 	new RedBitmapCubeTexture(redGPU, [
			// 		'./assets/cubemap/SwedishRoyalCastle/px.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/nx.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/py.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/ny.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/pz.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/nz.jpg'
			//
			// 	])
			// );


			// new RedGLTFLoader(
			// 	this, // redGL
			// 	'https://cdn.rawgit.com/KhronosGroup/glTF-Blender-Exporter/0e23c773bf27dad67d2c25f060370d6fa012d87d/polly/', 'project_polly.gltf',
			// 	function (v) { // callBack
			// 		console.log(v)
			// 		let tMesh = v['resultMesh']
			// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
			// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
			// 		// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
			// 		// tScene.addChild({children:[tMesh.children[2]]})
			//
			// 		tScene.addChild(tMesh)
			//
			// 	},
			// 	new RedBitmapCubeTexture(redGPU, [
			// 		'./assets/cubemap/SwedishRoyalCastle/px.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/nx.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/py.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/ny.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/pz.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/nz.jpg'
			//
			// 	])
			// );

			// new RedGLTFLoader(
			// 	this, // redGL
			// 	'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/', // assetRootPath
			// 	'Sponza.gltf', // fileName
			// 	function (v) { // callBack
			// 		console.log(v)
			// 		let tMesh = v['resultMesh']
			// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
			// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
			// 		// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
			// 		// tScene.addChild({children:[tMesh.children[2]]})
			//
			// 		tScene.addChild(tMesh)
			//
			// 	},
			// 	new RedBitmapCubeTexture(redGPU, [
			// 		'./assets/cubemap/SwedishRoyalCastle/px.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/nx.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/py.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/ny.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/pz.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/nz.jpg'
			//
			// 	])
			// );
			// new RedGLTFLoader(
			// 	this, // redGL
			// 	'assets/gltf/', // assetRootPath
			// 	'AlphaBlendModeTest.gltf', // fileName
			// 	function (v) { // callBack
			// 		console.log(v)
			// 		let tMesh = v['resultMesh']
			// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
			// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
			// 		// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
			// 		// tScene.addChild({children:[tMesh.children[2]]})
			// 		tScene.addChild(tMesh)
			//
			// 	},
			// 	// new RedBitmapCubeTexture(redGPU, [
			// 	// 	'./assets/cubemap/SwedishRoyalCastle/px.jpg',
			// 	// 	'./assets/cubemap/SwedishRoyalCastle/nx.jpg',
			// 	// 	'./assets/cubemap/SwedishRoyalCastle/py.jpg',
			// 	// 	'./assets/cubemap/SwedishRoyalCastle/ny.jpg',
			// 	// 	'./assets/cubemap/SwedishRoyalCastle/pz.jpg',
			// 	// 	'./assets/cubemap/SwedishRoyalCastle/nz.jpg'
			// 	//
			// 	// ])
			// );
			let self = this
			new RedGLTFLoader(self, 'assets/gltf/breakDance/', 'scene.gltf', function (v) {
				tScene.addChild(v['resultMesh'])
				v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.0012
				v['resultMesh'].x = 0
				var i = 40
				while (i--) {
					new RedGLTFLoader(self,  'assets/gltf/breakDance/', 'scene.gltf', function (v) {
						tScene.addChild(v['resultMesh'])
						v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.002
						v['resultMesh'].x = Math.random() * 30 - 15
						v['resultMesh'].z = Math.random() * 30 - 15

					})
				}
			})

			// new RedGLTFLoader(
			// 	this, // redGL
			// 	'assets/gltf/', // assetRootPath
			// 	'DamagedHelmet.gltf', // fileName
			// 	function (v) { // callBack
			// 		console.log(v)
			// 		let tMesh = v['resultMesh']
			// 		// tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
			// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
			// 		// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
			// 		// tScene.addChild({children:[tMesh.children[2]]})
			// 		tScene.addChild(tMesh)
			//
			//
			// 	},
			// 	new RedBitmapCubeTexture(redGPU, [
			// 		'./assets/cubemap/SwedishRoyalCastle/px.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/nx.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/py.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/ny.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/pz.jpg',
			// 		'./assets/cubemap/SwedishRoyalCastle/nz.jpg'
			//
			// 	])
			// );
			//
			// tScene.skyBox = new RedSkyBox(this,new RedBitmapCubeTexture(redGPU, [
			// 	'./assets/cubemap/SwedishRoyalCastle/px.jpg?t=1',
			// 	'./assets/cubemap/SwedishRoyalCastle/nx.jpg?t=1',
			// 	'./assets/cubemap/SwedishRoyalCastle/py.jpg?t=1',
			// 	'./assets/cubemap/SwedishRoyalCastle/ny.jpg?t=1',
			// 	'./assets/cubemap/SwedishRoyalCastle/pz.jpg?t=1',
			// 	'./assets/cubemap/SwedishRoyalCastle/nz.jpg?t=1'
			//
			// ]))
			setTimeout(function(){
				let t = new RedMesh(redGPU, new RedBox(redGPU), new RedColorPhongMaterial(redGPU))
				tScene.addChild(t)
				t.x =1
			},3000)

			let renderer = new RedRender();
			let render = function (time) {

				// tLight.x = Math.sin(time / 1000)
				// tLight.y = Math.cos(time / 500)
				// tLight.z = Math.cos(time / 750)
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