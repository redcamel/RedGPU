/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.18 19:33:34
 *
 */
import RedGPU from "../src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);


new RedGPU.RedGPUContext(cvs,
	function (v, reason) {
		console.log(this.context)
		let tView;
		let tScene = new RedGPU.RedScene();
		let tGrid = new RedGPU.RedGrid(this)
		let tCamera = new RedGPU.RedObitController(this)
		// tGrid.centerColor = '#ff0000'
		// tScene.backgroundColor = '#fff'
		// tScene.backgroundColorAlpha = 0
		let tLight
		tLight = new RedGPU.RedDirectionalLight()
		tLight.x = 100
		tLight.y = 100
		tLight.z = 100
		tScene.addLight(tLight)

		tView = new RedGPU.RedView(this, tScene, tCamera)
		tCamera.targetView = tView // optional
		tScene.grid = tGrid

		this.addView(tView)


		let tMesh
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/UV_Grid_Sm.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/Brick03_col.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/Brick03_nrm.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/crate.png')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/Brick03_disp.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/specular.png')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/emissive.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)

		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/UV_Gri1d_Sm.jpg', null, true,
		// 	function () {
		// 		console.log('로딩완료', this)
		// 	},
		// 	function (e) {
		// 		console.log('로딩에러', this )
		// 		console.log(e)
		// 		console.log(JSON.parse(`"${e}"`))
		// 	}
		// )))
		//
		// tScene.addChild(tMesh)

		// let textureLoader = new RedGPU.RedTextureLoader(
		// 	this,
		// 	[
		// 		'../assets/UV_Grid_Sm.jpg',
		// 		'../assets/UV_Grid_Sm.jpg',
		// 		'../assets/UV_Grid_Sm.jpg'
		// 	],
		// 	_ => {
		// 		console.log('여긴오겠고?')
		// 		new RedGPU.RedTextureLoader(
		// 			this,
		// 			[
		// 				'../assets/UV_Grid_Sm.jpg',
		// 				'../assets/UV_Grid_Sm.jpg',
		// 				'../assets/UV_Grid_Sm.jpg'
		// 			],
		// 			_ => {
		// 				console.log('안오겠지?')
		// 				tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg')))
		// 				tMesh.x = -2
		// 				tScene.addChild(tMesh)
		//
		// 				tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg')))
		//
		// 				tMesh.x = 2
		// 				tScene.addChild(tMesh)
		//
		// 				tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedStandardMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg')))
		// 				tMesh.z = -2
		//
		// 				tScene.addChild(tMesh)
		//
		// 				tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedColorMaterial(this, '#00ff00'))
		// 				tMesh.z = 2
		// 				tScene.addChild(tMesh)
		//
		// 				let tMesh2 = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedColorMaterial(this, '#ff00ff'))
		// 				tMesh2.x = 3
		// 				tMesh2.scaleX = tMesh2.scaleY = tMesh2.scaleZ = 0.5;
		// 				tMesh.addChild(tMesh2)
		//
		// 				tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedColorPhongMaterial(this))
		// 				tMesh.z = 4
		//
		// 				tScene.addChild(tMesh)
		//
		// 				tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedColorPhongTextureMaterial(this))
		// 				tMesh.z = -4
		//
		// 				tScene.addChild(tMesh)
		//
		// 				tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this,), new RedGPU.RedEnvironmentMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg'), new RedGPU.RedBitmapCubeTexture(this, [
		// 					'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 					'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 					'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 					'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 					'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 					'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		// 				])))
		// 				tMesh.z = -6
		// 				tScene.addChild(tMesh)
		// 				tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedSheetMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/sheet/spriteSheet.png'), 24, 5, 3, 15))
		// 				tMesh.z = 0
		//
		// 				tScene.addChild(tMesh)
		//
		//
		// 			}
		// 		)
		// 	}
		// )

		// let t0 = new RedGPU.RedBitmapTexture(
		// 	this,
		// 	'../assets/UV_Grid_Sm.jpg',
		// 	null,
		// 	true,
		// 	_=>{
		// 		console.log('성공')
		// 		tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this), new RedGPU.RedBitmapMaterial(this, t0))
		// 		tScene.addChild(tMesh)
		// 	},
		// 	e => console.log(e)
		// )


		// new RedGPU.RedBitmapCubeTexture(this,[
		// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		// ],null, true,_=>{console.log('성공')},e=>console.log('실패닷',e))


		// let textureLoader = new RedGPU.RedTextureLoader(
		// 	this,
		// 	[
		// 		'../assets/UV_Grid_Sm.jpg',
		// 		'../assets/Brick03_col.jpg',
		// 		'../assets/Brick03_nrm.jpg',
		// 		'../assets/crate.png',
		// 		'../assets/Brick03_disp.jp1g',
		// 		'../assets/specular.png',
		// 		'../assets/emissive.jpg',
		// 		[
		// 			'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 			'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 			'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 			'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 			'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 			'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		// 		],
		// 		[
		// 			'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 			'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 			'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 			'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 			'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 			'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		// 		]
		// 	],
		// 	_ => {
		// 		console.log(textureLoader)
		// 	}
		// )

		let i = 1
		while (i--) {
			// let tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this), new RedGPU.RedColorMaterial(this))
			// let tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg')))
			// let tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this), new RedGPU.RedStandardMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg')))
			let tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this), new RedGPU.RedEnvironmentMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg'), new RedGPU.RedBitmapCubeTexture(this, [
				'../assets/cubemap/SwedishRoyalCastle/px.jpg',
				'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
				'../assets/cubemap/SwedishRoyalCastle/py.jpg',
				'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
				'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
				'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
			])))
			// tMesh.x = Math.random() * 10 - 5
			// tMesh.y = Math.random() * 10 - 5
			// tMesh.z = Math.random() * 10 - 5
			tScene.addChild(tMesh)

			tMesh.addEventListener('down', function () {
				console.log('down', this)
				this.scaleX = this.scaleY = this.scaleZ = 0.5
			})
			tMesh.addEventListener('up', function () {
				console.log('up', this)
				this.scaleX = this.scaleY = this.scaleZ = 1
			})
			tMesh.addEventListener('over', function () {
				console.log('over', this)
				this.material.alpha = 0.5
			})
			tMesh.addEventListener('out', function () {
				console.log('out', this)
				this.material.alpha = 1
			})
		}

		let renderer = new RedGPU.RedRender();
		let render = time => {
			tScene.children.forEach(tMesh => {
				tMesh.rotationZ += 0.1
				// tMesh.material.alpha = RedGPU.RedUTIL.clamp(Math.sin(time / 500), 0, 1)

			})
			tCamera.x = 10
			tCamera.z = 10
			tCamera.y = 10
			tCamera.lookAt(0, 0, 0)
			renderer.render(time, this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);


	}
)
