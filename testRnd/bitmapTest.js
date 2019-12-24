/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.24 18:50:1
 *
 */
import RedGPU from "../src/RedGPU.js";
import Line from "../src/object3D/Line.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);


new RedGPU.RedGPUContext(cvs,
	function (v, reason) {
		console.log(this.context)
		let tView;
		let tScene = new RedGPU.Scene();
		let tGrid = new RedGPU.Grid(this)
		let tCamera = new RedGPU.ObitController(this)
		// tGrid.centerColor = '#ff0000'
		// tScene.backgroundColor = '#fff'
		// tScene.backgroundColorAlpha = 0
		let tLight
		tLight = new RedGPU.DirectionalLight()
		tLight.x = 0
		tLight.y = 100
		tLight.z = 0
		tScene.addLight(tLight)
		// tScene.axis = new RedGPU.Axis(this)
		tView = new RedGPU.View(this, tScene, tCamera)
		tCamera.targetView = tView // optional
		tScene.grid = tGrid

		this.addView(tView)


		var addLine_random, addLine_circle;
		// 60번 포인트를 랜덤으로 정의하고 라인추가
		addLine_random = function (redGPUContext,color) {
			var tLine;
			var tX, tY, tZ;
			var i = 50;
			// 라인객체 생성
			tLine = new Line(redGPUContext,color,Line.CATMULL_ROM);

			tX = tY = tZ = 0
			while (i--) {
				tX += Math.random() - 0.5;
				tY += Math.random() - 0.5;
				tZ += Math.random() - 0.5;
				// 라인에 포인트 추가
				tLine.addPoint(Math.random() * 5 - 2.5, Math.random() * 5 - 2.5, Math.random() * 5 - 2.5,i%3==0 ? color : i%3==1 ?'#ff0000' :'#00ff00',Math.max(Math.random(),0.5));
			}
			tScene.addChild(tLine);
			tLine.tension = 1
			tLine.distance = 0.01

		};


		addLine_random(this, '#0000ff');
		//
		// addLine_random(this, '#ff0000');
		// addLine_random(this, '#00ff00');
		// addLine_random(this, '#0000ff');
		// addLine_random(this, '#ff00ff');


		let tMesh
		// tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this,'../assets/UV_Grid_Sm.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this,'../assets/Brick03_col.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this,'../assets/Brick03_nrm.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this,'../assets/crate.png')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this,'../assets/Brick03_disp.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this,'../assets/specular.png')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)
		// tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this,'../assets/emissive.jpg')))
		// tMesh.x = Math.random()*10-5
		// tMesh.y = Math.random()*10-5
		// tMesh.z = Math.random()*10-5
		// tScene.addChild(tMesh)

		// tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, '../assets/UV_Gri1d_Sm.jpg', null, true,
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

		// let textureLoader = new RedGPU.TextureLoader(
		// 	this,
		// 	[
		// 		'../assets/UV_Grid_Sm.jpg',
		// 		'../assets/UV_Grid_Sm.jpg',
		// 		'../assets/UV_Grid_Sm.jpg'
		// 	],
		// 	_ => {
		// 		console.log('여긴오겠고?')
		// 		new RedGPU.TextureLoader(
		// 			this,
		// 			[
		// 				'../assets/UV_Grid_Sm.jpg',
		// 				'../assets/UV_Grid_Sm.jpg',
		// 				'../assets/UV_Grid_Sm.jpg'
		// 			],
		// 			_ => {
		// 				console.log('안오겠지?')
		// 				tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, '../assets/Brick03_col.jpg')))
		// 				tMesh.x = -2
		// 				tScene.addChild(tMesh)
		//
		// 				tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, '../assets/Brick03_col.jpg')))
		//
		// 				tMesh.x = 2
		// 				tScene.addChild(tMesh)
		//
		// 				tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.StandardMaterial(this, new RedGPU.BitmapTexture(this, '../assets/Brick03_col.jpg')))
		// 				tMesh.z = -2
		//
		// 				tScene.addChild(tMesh)
		//
		// 				tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.ColorMaterial(this, '#00ff00'))
		// 				tMesh.z = 2
		// 				tScene.addChild(tMesh)
		//
		// 				let tMesh2 = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.ColorMaterial(this, '#ff00ff'))
		// 				tMesh2.x = 3
		// 				tMesh2.scaleX = tMesh2.scaleY = tMesh2.scaleZ = 0.5;
		// 				tMesh.addChild(tMesh2)
		//
		// 				tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.ColorPhongMaterial(this))
		// 				tMesh.z = 4
		//
		// 				tScene.addChild(tMesh)
		//
		// 				tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.ColorPhongTextureMaterial(this))
		// 				tMesh.z = -4
		//
		// 				tScene.addChild(tMesh)
		//
		// 				tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this,), new RedGPU.EnvironmentMaterial(this, new RedGPU.BitmapTexture(this, '../assets/Brick03_col.jpg'), new RedGPU.BitmapCubeTexture(this, [
		// 					'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 					'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 					'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 					'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 					'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 					'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		// 				])))
		// 				tMesh.z = -6
		// 				tScene.addChild(tMesh)
		// 				tMesh = new RedGPU.Mesh(this, new RedGPU.Box(this,), new RedGPU.SheetMaterial(this, new RedGPU.BitmapTexture(this, '../assets/sheet/spriteSheet.png'), 24, 5, 3, 15))
		// 				tMesh.z = 0
		//
		// 				tScene.addChild(tMesh)
		//
		//
		// 			}
		// 		)
		// 	}
		// )

		// let t0 = new RedGPU.BitmapTexture(
		// 	this,
		// 	'../assets/UV_Grid_Sm.jpg',
		// 	null,
		// 	true,
		// 	_=>{
		// 		console.log('성공')
		// 		tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this), new RedGPU.BitmapMaterial(this, t0))
		// 		tScene.addChild(tMesh)
		// 	},
		// 	e => console.log(e)
		// )


		// new RedGPU.BitmapCubeTexture(this,[
		// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
		// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		// ],null, true,_=>{console.log('성공')},e=>console.log('실패닷',e))


		// let textureLoader = new RedGPU.TextureLoader(
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
			// let tMesh = new RedGPU.Mesh(this, new RedGPU.Box(this), new RedGPU.ColorMaterial(this))
			// let tMesh = new RedGPU.Mesh(this, new RedGPU.Box(this), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, '../assets/Brick03_col.jpg')))
			let tMesh = new RedGPU.Mesh(this, new RedGPU.Box(this), new RedGPU.StandardMaterial(this, new RedGPU.BitmapTexture(this, '../assets/Brick03_col.jpg'), new RedGPU.BitmapTexture(this, '../assets/Brick03_nrm.jpg')))
			// let tMesh = new RedGPU.Mesh(this, new RedGPU.Box(this), new RedGPU.EnvironmentMaterial(this, new RedGPU.BitmapTexture(this, '../assets/Brick03_col.jpg'), new RedGPU.BitmapCubeTexture(this, [
			// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
			// ])))
			// let tMesh = new RedGPU.Sprite3D(this, new RedGPU.Box(this), new RedGPU.Sprite3DMaterial(this, new RedGPU.BitmapTexture(this, '../assets/Brick03_col.jpg')))

			// tMesh.x = Math.random() * 10 - 5
			// tMesh.y = Math.random() * 10 - 5
			// tMesh.z = Math.random() * 10 - 5
			// tMesh.setRotation(Math.random() * 360, Math.random() * 360, Math.random() * 360)
			// tScene.addChild(tMesh)

			// tMesh.addEventListener('down', function () {
			// 	console.log('down', this)
			// 	this.scaleX = this.scaleY = this.scaleZ = 0.5
			// })
			// tMesh.addEventListener('up', function () {
			// 	console.log('up', this)
			// 	this.scaleX = this.scaleY = this.scaleZ = 1
			// })
			// tMesh.addEventListener('over', function () {
			// 	console.log('over', this)
			// 	this.material.alpha = 0.5
			// })
			// tMesh.addEventListener('out', function () {
			// 	console.log('out', this)
			// 	this.material.alpha = 1
			// })
		}


		let renderer = new RedGPU.Render();
		let render = time => {
			tScene.children.forEach(tMesh => {
				tMesh.rotationZ += 0.1
				// tMesh.material.alpha = RedGPU.UTIL.clamp(Math.sin(time / 500), 0, 1)

			})
			// console.log(tCamera.getPosition())
			renderer.render(time, this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);


	}
)
