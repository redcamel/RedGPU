/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:34:20
 *
 */

import RedGPU from "../src/RedGPU.js";


const cvs = document.createElement('canvas');
document.body.appendChild(cvs);

new RedGPU.RedGPUContext(
	cvs,
	function (v, reason) {

		if (!v) {
			console.log('reason', reason)
			return alert(reason || `WebGPU is unsupported, or no adapters or devices are available.`)
		}
		let tView;
		let tScene = new RedGPU.RedScene();
		let tGrid = new RedGPU.RedGrid(this)
		let tCamera = new RedGPU.RedObitController(this)
		let tCamera2 = new RedGPU.RedObitController(this)
		tGrid.centerColor = '#ff0000'
		// tScene.backgroundColor = '#fff'
		// tScene.backgroundColorAlpha = 0

		tCamera.distance = 10
		tCamera.speedDistance = 1


		tView = new RedGPU.RedView(this, tScene, tCamera)

		tCamera.targetView = tView // optional

		tScene.grid = tGrid

		tScene.axis = new RedGPU.RedAxis(this)
		let tLight
		tLight = new RedGPU.RedDirectionalLight()
		tLight.x = 3
		tLight.y = 2
		tLight.z = 3
		tScene.addLight(tLight)
		//
		tLight = new RedGPU.RedDirectionalLight()
		tLight.x = -100
		tLight.y = -100
		tLight.z = -100
		tScene.addLight(tLight)

		// tLight = new RedGPU.RedDirectionalLight()
		// tLight.x = 100
		// tLight.y = -100
		// tLight.z = 100
		// tScene.addLight(tLight)

		tLight = new RedGPU.RedAmbientLight()
		tScene.addLight(tLight)

		this.addView(tView)

		// new RedGPU.RedGLTFLoader(
		// 	this, // redGL
		// 	'../assets/gltf/', // assetRootPath
		// 	'NormalTangentMirrorTest.gltf', // fileName
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
		//
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	new RedGPU.RedBitmapCubeTexture(this, [
		// 		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// 	])
		// );
		// new RedGPU.RedGLTFLoader(
		// 	this, // redGL
		// 	'../assets/gltf/', // assetRootPath
		// 	'TextureSettingsTest.gltf', // fileName
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
		// 		tMesh.z = -5
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	new RedGPU.RedBitmapCubeTexture(this, [
		// 		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// 	])
		// );


		// new RedGPU.RedGLTFLoader(
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
		// 	new RedGPU.RedBitmapCubeTexture(this, [
		// 		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// 	])
		// );

		// new RedGPU.RedGLTFLoader(
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
		// 	new RedGPU.RedBitmapCubeTexture(this, [
		// 		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// 	])
		// );
		new RedGPU.RedGLTFLoader(
			this, // redGL
			'../assets/gltf/', // assetRootPath
			'AlphaBlendModeTest.gltf', // fileName
			function (v) { // callBack
				console.log(v)
				let tMesh = v['resultMesh']
				tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
				// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
				// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
				// tScene.addChild({children:[tMesh.children[2]]})
				tScene.addChild(tMesh)

			},
			// new RedGPU.RedBitmapCubeTexture(this, [
			// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
			//
			// ])
		);
		// let self = this
		// new RedGPU.RedGLTFLoader(self, '../assets/gltf/breakDance/', 'scene.gltf', function (v) {
		// 	tScene.addChild(v['resultMesh'])
		// 	v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.0012
		// 	v['resultMesh'].x = 0
		// 	var i = 40
		// 	while (i--) {
		// 		new RedGPU.RedGLTFLoader(self,  '../assets/gltf/breakDance/', 'scene.gltf', function (v) {
		// 			tScene.addChild(v['resultMesh'])
		// 			v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.002
		// 			v['resultMesh'].x = Math.random() * 30 - 15
		// 			v['resultMesh'].z = Math.random() * 30 - 15
		//
		// 		})
		// 	}
		// })

		new RedGPU.RedGLTFLoader(
			this, // redGL
			'../assets/gltf/', // assetRootPath
			'DamagedHelmet.gltf', // fileName
			function (v) { // callBack
				console.log(v)
				let tMesh = v['resultMesh']
				// tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
				// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
				// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
				// tScene.addChild({children:[tMesh.children[2]]})
				tScene.addChild(tMesh)


			},
			new RedGPU.RedBitmapCubeTexture(this, [
				'../assets/cubemap/SwedishRoyalCastle/px.jpg',
				'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
				'../assets/cubemap/SwedishRoyalCastle/py.jpg',
				'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
				'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
				'../assets/cubemap/SwedishRoyalCastle/nz.jpg'

			])
		);

		tScene.skyBox = new RedGPU.RedSkyBox(this, new RedGPU.RedBitmapCubeTexture(this, [
			'../assets/cubemap/SwedishRoyalCastle/px.jpg?t=1',
			'../assets/cubemap/SwedishRoyalCastle/nx.jpg?t=1',
			'../assets/cubemap/SwedishRoyalCastle/py.jpg?t=1',
			'../assets/cubemap/SwedishRoyalCastle/ny.jpg?t=1',
			'../assets/cubemap/SwedishRoyalCastle/pz.jpg?t=1',
			'../assets/cubemap/SwedishRoyalCastle/nz.jpg?t=1'

		]))

		let renderer = new RedGPU.RedRender();
		let render = time => {

			// tLight.x = Math.sin(time / 1000)
			// tLight.y = Math.cos(time / 500)
			// tLight.z = Math.cos(time / 750)
			renderer.render(time, this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);
	}
)

let setTestUI = function (redGPUContextContext, tView, tScene) {

	let tFolder;

	let testCubeTexture = new RedGPU.RedBitmapCubeTexture(this, [
		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		// '../assets/cubemap/posx.jpg',
		// '../assets/cubemap/negx.jpg',
		// '../assets/cubemap/posy.jpg',
		// '../assets/cubemap/negy.jpg',
		// '../assets/cubemap/posz.jpg',
		// '../assets/cubemap/negz.jpg'
	])
	console.log('RedBitmapCubeTexture', testCubeTexture)

	let skyBox = new RedGPU.RedSkyBox(this, testCubeTexture)
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
	tFolder.add(testSceneData, 'useGrid').onChange(v => tScene.grid = v ? new RedGPU.RedGrid(this) : null)
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