/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.27 19:6:22
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
		new RedGPU.GLTFLoader(
			this, // redGL
			'../assets/gltf/material_ball_in_3d-coat/', // assetRootPath
			'scene.gltf', // fileName

			v => { // callBack
				console.log(v)
				let tMesh = v['resultMesh']
				tMesh.y = 7.7
				tMesh.x = (max) * 20 - 20 * max / 2
				tScene.addChild(tMesh)
				tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1.5

				let i = matList.length
				while (i--) {
					let t0 = i
					new RedGPU.GLTFLoader(
						this, // redGL
						'../assets/gltf/material_ball_in_3d-coat/', // assetRootPath
						'scene.gltf', // fileName
						function (v) { // callBack
							console.log(v)
							let tMesh = v['resultMesh']
							tMesh.y = 7.7
							tMesh.x = (t0) * 20 - 20 * max / 2
							tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1.5
							tScene.addChild(tMesh)
							let targetMaterial = matList[t0]
							console.log(targetMaterial)
							var setMaterial = function (target, reculsive) {
								if (target['material']) {
									target.material = targetMaterial

								}
								if (reculsive) target.children.forEach(function (v) {
									if (v['material']) {
										v.material = targetMaterial

									}
									setMaterial(v, reculsive)
								})

							};
							setMaterial(tMesh, true)
						},
						new RedGPU.BitmapCubeTexture(this, [
							'../assets/cubemap/posx.jpg',
							'../assets/cubemap/negx.jpg',
							'../assets/cubemap/posy.jpg',
							'../assets/cubemap/negy.jpg',
							'../assets/cubemap/posz.jpg',
							'../assets/cubemap/negz.jpg'
						])
					);
				}

			},
			new RedGPU.BitmapCubeTexture(this, [
				'../assets/cubemap/posx.jpg',
				'../assets/cubemap/negx.jpg',
				'../assets/cubemap/posy.jpg',
				'../assets/cubemap/negy.jpg',
				'../assets/cubemap/posz.jpg',
				'../assets/cubemap/negz.jpg'
			])
		);
		new RedGPU.GLTFLoader(
			this, // redGL
			'../assets/gltf/', // assetRootPath
			'NormalTangentMirrorTest.gltf', // fileName
			function (v) { // callBack
				console.log(v)
				let tMesh = v['resultMesh']
				tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 50

				tMesh.z = -100
				tMesh.y = 60
				tScene.addChild(tMesh)

			},
			new RedGPU.BitmapCubeTexture(this, [
				'../assets/cubemap/SwedishRoyalCastle/px.jpg',
				'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
				'../assets/cubemap/SwedishRoyalCastle/py.jpg',
				'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
				'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
				'../assets/cubemap/SwedishRoyalCastle/nz.jpg'

			])
		);
		// new RedGPU.GLTFLoader(
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


		new RedGPU.GLTFLoader(
			this, // redGL
			'https://cdn.rawgit.com/KhronosGroup/glTF-Blender-Exporter/0e23c773bf27dad67d2c25f060370d6fa012d87d/polly/', 'project_polly.gltf',
			function (v) { // callBack
				console.log(v)
				let tMesh = v['resultMesh']
				tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 100
				tMesh.y= -4.5
				// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 1
				// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
				// tScene.addChild({children:[tMesh.children[2]]})

				tScene.addChild(tMesh)

			},
			// new RedGPU.BitmapCubeTexture(this, [
			// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
			//
			// ])
		);

		// new RedGPU.GLTFLoader(
		// 	this, // redGL
		// 	'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/', // assetRootPath
		// 	// '../assets/gltf/Sponza/glTF/', // assetRootPath
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
		// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
		// 		// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
		// 		// tScene.addChild({children:[tMesh.children[2]]})
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
		let self = this
		new RedGPU.GLTFLoader(self, '../assets/gltf/breakDance/', 'scene.gltf', function (v) {
			tScene.addChild(v['resultMesh'])
			v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.01
			v['resultMesh'].z = 30

		})

		// new RedGPU.GLTFLoader(
		// 	this, // redGL
		// 	'../assets/gltf/', // assetRootPath
		// 	'DamagedHelmet.gltf', // fileName
		// 	function (v) { // callBack
		// 		console.log(v)
		// 		let tMesh = v['resultMesh']
		// 		// tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 1
		// 		// v['resultMesh'].scaleX = v['resultMesh'].scaleY = v['resultMesh'].scaleZ = 0.001
		// 		// tScene.addChild({children:[tMesh.children[2],tMesh.children[8]]})
		// 		// tScene.addChild({children:[tMesh.children[2]]})
		// 		tScene.addChild(tMesh)
		// 		tMesh = tMesh.children[0]
		// 		tMesh.addEventListener('down', function (e) {
		// 			console.log(e)
		// 			var tValue = 3
		// 			TweenMax.to(this, 0.5, {scaleX: tValue, scaleY: tValue, scaleZ: tValue, ease: Back.easeOut});
		// 		})
		// 		tMesh.addEventListener('up', function (e) {
		// 			console.log(e)
		// 			var tValue = 2
		// 			TweenMax.to(this, 0.5, {scaleX: tValue, scaleY: tValue, scaleZ: tValue, ease: Back.easeOut});
		// 		})
		// 		tMesh.addEventListener('over', function (e) {
		// 			console.log(e)
		// 			var tValue = 2
		// 			TweenMax.to(this, 0.5, {scaleX: tValue, scaleY: tValue, scaleZ: tValue, ease: Back.easeOut});
		// 		})
		// 		tMesh.addEventListener('out', function (e) {
		// 			console.log(e)
		// 			var tValue = 1
		// 			TweenMax.to(this, 0.5, {scaleX: tValue, scaleY: tValue, scaleZ: tValue, ease: Back.easeOut});
		// 		})
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

			// tLight.x = Math.sin(time / 1000)
			// tLight.y = Math.cos(time / 500)
			// tLight.z = Math.cos(time / 750)
			renderer.render(time, this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);
	}
)
