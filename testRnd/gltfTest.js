/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.29 22:10:29
 *
 */

import RedGPU from "../src/RedGPU.js";


const cvs = document.createElement('canvas');
document.body.appendChild(cvs);

new RedGPU.RedGPUContext(
	cvs,
	function (v, reason) {
		RedGPU.Debugger.visible(true)
		if (!v) {
			console.log('reason', reason)
			return alert(reason || `WebGPU is unsupported, or no adapters or devices are available.`)
		}
		let tView;
		let tScene = new RedGPU.Scene();
		let tGrid = new RedGPU.Grid(this)
		let tCamera = new RedGPU.ObitController(this)
		let tCamera2 = new RedGPU.ObitController(this)
		tGrid.centerColor = '#ff0000'
		// tScene.backgroundColor = '#fff'
		// tScene.backgroundColorAlpha = 0

		tCamera.distance = 150
		tCamera.speedDistance = 10


		tView = new RedGPU.View(this, tScene, tCamera)

		tCamera.targetView = tView // optional

		// tScene.grid = tGrid

		// tScene.axis = new RedGPU.Axis(this)
		let tLight
		tLight = new RedGPU.DirectionalLight(this)
		tLight.x = 0
		tLight.y = 2
		tLight.z = 3
		tScene.addLight(tLight)
		//
		tLight = new RedGPU.DirectionalLight(this)
		tLight.x = 0
		tLight.y = 2
		tLight.z = -3
		tScene.addLight(tLight)

		// tLight = new RedGPU.DirectionalLight(this)
		// tLight.x = 100
		// tLight.y = -100
		// tLight.z = 100
		// tScene.addLight(tLight)


		// tScene.addLight(tLight)

		let matList = [
			new RedGPU.ColorMaterial(this),
			new RedGPU.ColorPhongMaterial(this),
			new RedGPU.ColorPhongTextureMaterial(
				this, '#ff0000', 1,
				new RedGPU.BitmapTexture(this, '../assets/Brick03_nrm.jpg'),
				new RedGPU.BitmapTexture(this, '../assets/specular.png'),
				new RedGPU.BitmapTexture(this, '../assets/emissive.jpg')
			),
			new RedGPU.BitmapMaterial(
				this,
				new RedGPU.BitmapTexture(this, '../assets/Brick03_col.jpg')
			),
			new RedGPU.StandardMaterial(
				this,
				new RedGPU.BitmapTexture(this, '../assets/Brick03_col.jpg'),
				new RedGPU.BitmapTexture(this, '../assets/Brick03_nrm.jpg'),
				new RedGPU.BitmapTexture(this, '../assets/specular.png'),
				new RedGPU.BitmapTexture(this, '../assets/emissive.jpg')
			),
			new RedGPU.EnvironmentMaterial(
				this,
				new RedGPU.BitmapTexture(this, '../assets/Brick03_col.jpg'),
				new RedGPU.BitmapCubeTexture(this, [
					'../assets/cubemap/posx.jpg',
					'../assets/cubemap/negx.jpg',
					'../assets/cubemap/posy.jpg',
					'../assets/cubemap/negy.jpg',
					'../assets/cubemap/posz.jpg',
					'../assets/cubemap/negz.jpg'
				]),
				new RedGPU.BitmapTexture(this, '../assets/Brick03_nrm.jpg'),
				new RedGPU.BitmapTexture(this, '../assets/specular.png'),
				new RedGPU.BitmapTexture(this, '../assets/emissive.jpg')
			)
		]
		let skyBox = new RedGPU.SkyBox(this, new RedGPU.BitmapCubeTexture(this, [
			'../assets/cubemap/posx.jpg',
			'../assets/cubemap/negx.jpg',
			'../assets/cubemap/posy.jpg',
			'../assets/cubemap/negy.jpg',
			'../assets/cubemap/posz.jpg',
			'../assets/cubemap/negz.jpg'
		]))
		tScene.skyBox = skyBox
		let max = matList.length
		this.addView(tView)


		// let testMesh;
		// testMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this, 1, 32, 32), new RedGPU.RefractionMaterial(this, null, new RedGPU.BitmapCubeTexture(this, [
		// 	'../assets/cubemap/posx.jpg',
		// 	'../assets/cubemap/negx.jpg',
		// 	'../assets/cubemap/posy.jpg',
		// 	'../assets/cubemap/negy.jpg',
		// 	'../assets/cubemap/posz.jpg',
		// 	'../assets/cubemap/negz.jpg'
		// ])))
		// testMesh.x = -1.5
		// tScene.addChild(testMesh)
		//
		// testMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this, 1, 32, 32), new RedGPU.EnvironmentMaterial(this, null, new RedGPU.BitmapCubeTexture(this, [
		// 	'../assets/cubemap/posx.jpg',
		// 	'../assets/cubemap/negx.jpg',
		// 	'../assets/cubemap/posy.jpg',
		// 	'../assets/cubemap/negy.jpg',
		// 	'../assets/cubemap/posz.jpg',
		// 	'../assets/cubemap/negz.jpg'
		// ])))
		// testMesh.x = 1.5
		// tScene.addChild(testMesh)

		// new RedGPU.GLTFLoader(
		// 	this, // redGL
		// 	'../assets/gltf/gold_paint_test/', // assetRootPath
		// 	'scene.gltf', // fileName
		//
		// 	v => { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.x = (max) * 30 - 30 * max / 2
		// 		tScene.addChild(tMesh)
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 25
		//
		// 		let i = matList.length
		// 		while (i--) {
		// 			let t0 = i
		// 			new RedGPU.GLTFLoader(
		// 				this, // redGL
		// 				'../assets/gltf/gold_paint_test/', // assetRootPath
		// 				'scene.gltf', // fileName
		// 				function (v) { // callBack
		// 					console.log(v)
		// 					let tMesh = v['resultMesh']
		// 					// tMesh.opacity = 0.5
		// 					tMesh.x = (t0) * 30 - 30 * max / 2
		// 					tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 25
		//
		// 					let targetMaterial = matList[t0]
		// 					console.log(targetMaterial)
		// 					var setMaterial = function (target, reculsive) {
		// 						if (target['material']) {
		// 							target.material = targetMaterial
		//
		// 						}
		// 						if (reculsive) target._children.forEach(function (v) {
		// 							if (v['material']) {
		// 								v.material = targetMaterial
		//
		// 							}
		// 							setMaterial(v, reculsive)
		// 						})
		//
		// 					};
		// 					setMaterial(tMesh, true)
		// 					setTimeout(_=>{
		// 						tScene.addChild(tMesh)
		// 					},100*t0)
		// 				},
		// 				new RedGPU.BitmapCubeTexture(this, [
		// 					'../assets/cubemap/posx.jpg',
		// 					'../assets/cubemap/negx.jpg',
		// 					'../assets/cubemap/posy.jpg',
		// 					'../assets/cubemap/negy.jpg',
		// 					'../assets/cubemap/posz.jpg',
		// 					'../assets/cubemap/negz.jpg'
		// 				])
		// 			);
		// 		}
		//
		// 	},
		// 	new RedGPU.BitmapCubeTexture(this, [
		// 		'../assets/cubemap/posx.jpg',
		// 		'../assets/cubemap/negx.jpg',
		// 		'../assets/cubemap/posy.jpg',
		// 		'../assets/cubemap/negy.jpg',
		// 		'../assets/cubemap/posz.jpg',
		// 		'../assets/cubemap/negz.jpg'
		// 	])
		// );


		// let self = this
		// new RedGPU.GLTFLoader(self, '../assets/gltf/breakDance/', 'scene.gltf', function (v) {
		// 	tScene.addChild(v['resultMesh'])
		// 	v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
		//
		// 	v['resultMesh'].x = 2
		//
		// 	var i = matList.length
		// 	while (i--) {
		// 		let t0 = i
		// 		setTimeout(_ => {
		// 			new RedGPU.GLTFLoader(self, '../assets/gltf/breakDance/', 'scene.gltf', function (v) {
		// 					tScene.addChild(v['resultMesh'])
		// 					v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.01
		// 					v['resultMesh'].x = (t0) * 30 - 30 * max / 2
		// 					v['resultMesh'].z = 30
		// 					// v['resultMesh'].x = Math.random() * 80 - 40
		// 					// v['resultMesh'].y = Math.random() * 80-40
		// 					// v['resultMesh'].z = Math.random() * 80 - 40
		// 					let targetMaterial = matList[t0]
		// 					console.log(targetMaterial)
		// 				},
		//
		// 			)
		// 		}, i * 50)
		// 	}
		// })
		//
		// new RedGPU.GLTFLoader(
		// 	this, // redGL
		// 	'../assets/gltf/', // assetRootPath
		// 	'NormalTangentMirrorTest.gltf', // fileName
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 50
		//
		// 		tMesh.z = -100
		// 		tMesh.y = 60
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	new RedGPU.BitmapCubeTexture(this, [
		// 		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// 	])
		// );
		//
		// new RedGPU.GLTFLoader(
		// 	this, // redGL
		// 	'https://cdn.rawgit.com/KhronosGroup/glTF-Blender-Exporter/0e23c773bf27dad67d2c25f060370d6fa012d87d/polly/', 'project_polly.gltf',
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 100
		//
		// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 1
		// 		// tScene.addChild({_children:[tMesh._children[2],tMesh._children[8]]})
		// 		// tScene.addChild({_children:[tMesh._children[2]]})
		//
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	new RedGPU.BitmapCubeTexture(this, [
		// 		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// 	])
		// );

		// new RedGPU.GLTFLoader(
		// 	this, // redGL
		// 	'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/', // assetRootPath
		// 	// '../assets/gltf/Sponza/glTF/', // assetRootPath
		// 	'Sponza.gltf', // fileName
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 15
		// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
		// 		// tScene.addChild({_children:[tMesh._children[2],tMesh._children[8]]})
		// 		// tScene.addChild({_children:[tMesh._children[2]]})
		//
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	new RedGPU.BitmapCubeTexture(this, [
		// 		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// 	])
		// );
		// new RedGPU.GLTFLoader(
		// 	this, // redGL
		// 	'../assets/gltf/', // assetRootPath
		// 	'AlphaBlendModeTest.gltf', // fileName
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
		//
		// 		tMesh.z = 10
		// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
		// 		// tScene.addChild({_children:[tMesh._children[2],tMesh._children[8]]})
		// 		// tScene.addChild({_children:[tMesh._children[2]]})
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	new RedGPU.BitmapCubeTexture(this, [
		// 		'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 		'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// 	])
		// );


		// new RedGPU.GLTFLoader(
		// 	this, // redGL
		// 	'../assets/gltf/', // assetRootPath
		// 	// '2CylinderEngine.gltf', // fileName
		// 	// 'AlphaBlendModeTest.gltf', // fileName
		// 	// 'animation.gltf', // fileName
		// 	// 'basic.gltf', // fileName
		// 	// 'BoxAnimated.gltf', // fileName
		// 	// 'BoxTextured.gltf', // fileName
		// 	// 'BoxVertexColors.gltf', // fileName
		// 	'BrainStem.gltf', // fileName
		// 	// 'Buggy.gltf', // fileName
		// 	// 'Cameras.gltf', // fileName
		// 	// 'CesiumMan.gltf', // fileName
		// 	// 'CesiumMilkTruck.gltf', // fileName
		// 	// 'DamagedHelmet.gltf', // fileName  - 소스 최신으로 받아야함
		// 	// 'Duck.gltf', // fileName
		// 	// 'GearboxAssy.gltf', // fileName
		// 	// 'InterpolationTest.glb', // fileName
		// 	// 'MetalRoughSpheres.gltf', // fileName
		// 	// 'Monster.gltf', // fileName - 소스 최신으로 받아야함
		// 	// 'MultiUVTest.gltf',
		// 	// 'NormalTangentMirrorTest.gltf',
		// 	// 'NormalTangentTest.gltf',
		// 	// 'OrientationTest.gltf',
		// 	// 'ReciprocatingSaw.gltf',
		// 	// 'RiggedFigure.gltf',
		// 	// 'RiggedSimple.gltf',
		// 	// 'simpleMesh.gltf',
		// 	// 'SimpleMorph.gltf',
		// 	// 'SimpleSkin.gltf',
		// 	// 'SimpleSparseAccessor.gltf',
		// 	// 'simpleTexture.gltf',
		// 	// 'TextureCoordinateTest.gltf',
		// 	// 'TextureSettingsTest.gltf',
		// 	// 'VC.gltf',
		// 	// 'VertexColorTest.gltf',
		//
		//
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		tMesh.z = -15
		// 		// tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
		// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
		// 		// tScene.addChild({_children:[tMesh._children[2],tMesh._children[8]]})
		// 		// tScene.addChild({_children:[tMesh._children[2]]})
		// 		tScene.addChild(tMesh)
		//
		// 	},
		// 	// new RedGPU.BitmapCubeTexture(this, [
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 	// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		// 	//
		// 	// ])
		// );

		//
		// tScene.skyBox = new RedGPU.SkyBox(this, new RedGPU.BitmapCubeTexture(this, [
		// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// ]))
		// new RedGPU.BitmapCubeTexture(this, [
		// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		//
		// ])

		let renderer = new RedGPU.Render();
		let render = time => {
			// tCamera.pan += 1
			// tLight.x = Math.sin(time / 1000)
			// tLight.y = Math.cos(time / 500)
			// tLight.z = Math.cos(time / 750)
			renderer.render(time, this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);
	}
)
