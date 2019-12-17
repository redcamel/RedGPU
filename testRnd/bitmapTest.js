/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.17 14:27:8
 *
 */
import RedGPU from "../src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);


new RedGPU.RedGPUContext(cvs,
	function (v, reason) {
		let tView;
		let tScene = new RedGPU.RedScene();
		let tGrid = new RedGPU.RedGrid(this)
		let tCamera = new RedGPU.RedObitController(this)
		// tGrid.centerColor = '#ff0000'
		// tScene.backgroundColor = '#fff'
		// tScene.backgroundColorAlpha = 0


		tView = new RedGPU.RedView(this, tScene, tCamera)
		tCamera.targetView = tView // optional
		tScene.grid = tGrid

		this.addView(tView)


		let tMesh
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/UV_Grid_Sm.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/Brick03_col.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/Brick03_nrm.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/crate.png')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/Brick03_disp.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/specular.png')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/emissive.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)

		// tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/UV_Gri1d_Sm.jpg', null, true,
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

		let textureLoader = new RedGPU.RedTextureLoader(
			this,
			[
				'../assets/UV_Grid_Sm.jpg',
				'../assets/UV_Grid_Sm.jpg',
				'../assets/UV_Grid_Sm.jpg'
			],
			_=>{
				console.log('여긴오겠고?')
				new RedGPU.RedTextureLoader(
					this,
					[
						'../assets/UV_Grid_Sm.jpg',
						'../assets/UV_Grid_Sm.jpg',
						'../assets/UV_Grid_Sm.jpg'
					],
					_=> {
						console.log('안오겠지?')
						tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this,'../assets/Brick03_col.jpg')))

						tScene.addChild(tMesh)
					}
				)
			}
		)

		// let t0 = new RedGPU.RedBitmapTexture(
		// 	this,
		// 	'../assets/UV_Grid_Sm.jpg',
		// 	null,
		// 	true,
		// 	_=>{
		// 		console.log('성공')
		// 		tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this), new RedGPU.RedBitmapMaterial(this, t0))
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

		let renderer = new RedGPU.RedRender();
		let render = time => {
			if (tMesh) tMesh.rotationZ += 0
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
