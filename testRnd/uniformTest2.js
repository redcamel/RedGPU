/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */

import RedGPU from "../src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);
let testMat_color, testMat_bitmap;
new RedGPU.RedGPUContext(
	cvs,
	function () {
		let MAX = 8000;
		let i = MAX;
		let tView;
		let tScene = new RedGPU.RedScene();

		let tGrid = new RedGPU.RedGrid(this)
		let tAxis = new RedGPU.RedAxis(this)
		let tCamera = new RedGPU.RedObitController(this)
		tGrid.centerColor = '#ff0000'

		tView = new RedGPU.RedView(this, tScene, tCamera)


		tCamera.targetView = tView // optional
		tCamera.speedDistance = 5

		tScene.grid = tGrid;
		tScene.axis = tAxis;
		tScene.skyBox = new RedGPU.RedSkyBox(this)
		let tLight
		tLight = new RedGPU.RedDirectionalLight()
		tLight.x = 10
		tLight.y = 10
		tLight.z = 10
		tScene.addLight(tLight)

		tScene.skyBox = new RedGPU.RedSkyBox(this, new RedGPU.RedBitmapCubeTexture(this, [
			'../assets/cubemap/SwedishRoyalCastle/px.jpg',
			'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
			'../assets/cubemap/SwedishRoyalCastle/py.jpg',
			'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
			'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
			'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
		]))

		this.addView(tView)


		testMat_color = new RedGPU.RedColorMaterial(this, '#ffff12');
		let testTextureList = [
			new RedGPU.RedBitmapTexture(this, '../assets/UV_Grid_Sm.jpg'),
			new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg'),
			new RedGPU.RedBitmapTexture(this, '../assets/Brick03_nrm.jpg'),
			new RedGPU.RedBitmapTexture(this, '../assets/crate.png'),
			new RedGPU.RedBitmapTexture(this, '../assets/Brick03_disp.jpg'),
			new RedGPU.RedBitmapTexture(this, '../assets/specular.png'),
			new RedGPU.RedBitmapTexture(this, '../assets/emissive.jpg')
		]
		setTimeout(_ => {
			// testMat_bitmap = new RedGPU.RedStandardMaterial(this, testTextureList[1], testTextureList[2],testTextureList[5], testTextureList[6], testTextureList[4]);
			testMat_bitmap = new RedGPU.RedStandardMaterial(this, testTextureList[1], testTextureList[2], testTextureList[5], testTextureList[6], testTextureList[4]);
			// testMat_bitmap = new RedGPU.RedStandardMaterial(this, testTextureList[0]);
			while (i--) {
				let testMesh = new RedGPU.RedMesh(
					this,
					new RedGPU.RedSphere(this, 0.5, 16, 16, 16),
					testMat_bitmap
				);
				testMesh.x = Math.random() * 3000 - 1500;
				testMesh.y = Math.random() * 3000 - 1500;
				testMesh.z = Math.random() * 3000 - 1500;
				testMesh.rotationX = testMesh.rotationY = testMesh.rotationZ = Math.random() * 360;
				testMesh.scaleX = testMesh.scaleY = testMesh.scaleZ = Math.random() * 25 + 35;
				tScene.addChild(testMesh)
			}
			let renderer = new RedGPU.RedRender();
			let render = time => {
				tLight.x = Math.sin(time / 1000)
				tLight.y = Math.cos(time / 500)
				tLight.z = Math.cos(time / 750)
				renderer.render(time, this);
				let tChildren = tView.scene.children
				i = tChildren.length
				while (i--) {
					tChildren[i]._rotationX += 1
					tChildren[i]._rotationY += 1
					tChildren[i]._rotationZ += 1
					tChildren[i].dirtyTransform = 1
				}
				requestAnimationFrame(render);
			};
			requestAnimationFrame(render);
		}, 500)
	}
);
