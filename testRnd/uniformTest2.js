/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.11 18:4:20
 *
 */

import RedGPU from "../src/RedGPU.js";
import RedMesh from "../src/object3D/RedMesh.js";
import RedRender from "../src/renderer/RedRender.js";
import RedSphere from "../src/primitives/RedSphere.js";
import RedBox from "../src/primitives/RedBox.js";
import RedCylinder from "../src/primitives/RedCylinder.js";
import RedPlane from "../src/primitives/RedPlane.js";
import RedScene from "../src/RedScene.js";
import RedView from "../src/RedView.js";
import RedColorMaterial from "../src/material/RedColorMaterial.js";
import RedGrid from "../src/object3D/RedGrid.js";
import RedObitController from "../src/controller/RedObitController.js";
import RedSkyBox from "../src/object3D/RedSkyBox.js";
import RedAxis from "../src/object3D/RedAxis.js";
import RedDirectionalLight from "../src/light/RedDirectionalLight.js";
import RedBitmapTexture from "../src/resources/RedBitmapTexture.js";
import RedBitmapMaterial from "../src/material/RedBitmapMaterial.js";
import RedBitmapCubeTexture from "../src/resources/RedBitmapCubeTexture.js";


(async function () {
	const cvs = document.createElement('canvas');
	const glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.11/dist/web-devel/glslang.js');
	document.body.appendChild(cvs);

	const glslang = await glslangModule.default();
	console.log(glslang);
	let testMat_color, testMat_colorPhong, testMat_bitmap, testMat_standard_diffuse, testMat_standard_diffuse_normal,
		testMat_standard_diffuse_normal_displacement, testMat_colorPhongTexture_normal,
		testMat_colorPhongTexture_normal_displacement,
		testMat_environment;
	let redGPU = new RedGPU(cvs, glslang,
		function () {
			let MAX = 8000;
			let i = MAX;
			let tView;
			let tScene = new RedScene();

			let tGrid = new RedGrid(this)
			let tAxis = new RedAxis(this)
			let tCamera = new RedObitController(this)
			tGrid.centerColor = '#ff0000'

			tView = new RedView(this, tScene, tCamera)


			tCamera.targetView = tView // optional
			tCamera.speedDistance = 5

			tScene.grid = tGrid;
			tScene.axis = tAxis;
			tScene.skyBox = new RedSkyBox(redGPU)
			let tLight
			tLight = new RedDirectionalLight('#0000ff', 0.5)
			tLight.x = 10
			tLight.y = 10
			tLight.z = 10
			tScene.addLight(tLight)

			// tScene.skyBox = new RedSkyBox(redGPU, new RedBitmapCubeTexture(redGPU, [
			// 	'../assets/cubemap/SwedishRoyalCastle/px.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/nx.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/py.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/ny.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/pz.jpg',
			// 	'../assets/cubemap/SwedishRoyalCastle/nz.jpg'
			// ]))

			redGPU.addView(tView)


			testMat_color = new RedColorMaterial(redGPU, '#ffff12');
			let testTextureList = [
				new RedBitmapTexture(redGPU, '../assets/UV_Grid_Sm.jpg'),
				new RedBitmapTexture(redGPU, '../assets/Brick03_col.jpg'),
				new RedBitmapTexture(redGPU, '../assets/Brick03_nrm.jpg'),
				new RedBitmapTexture(redGPU, '../assets/crate.png'),
				new RedBitmapTexture(redGPU, '../assets/Brick03_disp.jpg'),
				new RedBitmapTexture(redGPU, '../assets/specular.png'),
				new RedBitmapTexture(redGPU, '../assets/emissive.jpg')
			]
			testMat_bitmap = new RedBitmapMaterial(redGPU, testTextureList[0]);


			let randomGeometry = function () {
				return new RedSphere(redGPU, 0.5, 16, 16, 16)
				return Math.random() > 0.5
					? new RedSphere(redGPU, 0.5, 16, 16, 16) :
					Math.random() > 0.5
						? new RedCylinder(redGPU, 0, 1, 2, 16, 16) :
						Math.random() > 0.5 ? new RedBox(redGPU) : new RedPlane(redGPU)
			}

			while (i--) {
				let testMesh = new RedMesh(
					redGPU,
					randomGeometry(),
					testMat_bitmap
				);
				testMesh.x = Math.random() * 3000 - 1500;
				testMesh.y = Math.random() * 3000 - 1500;
				testMesh.z = Math.random() * 3000 - 1500;
				testMesh.rotationX = testMesh.rotationY = testMesh.rotationZ = Math.random() * 360;
				testMesh.scaleX = testMesh.scaleY = testMesh.scaleZ = Math.random() * 25 + 35;
				if (testMesh.material == testMat_standard_diffuse_normal_displacement) testMesh.scaleX = testMesh.scaleY = testMesh.scaleZ = 55
				tScene.addChild(testMesh)


			}


			let renderer = new RedRender();
			let render = function (time) {


				tLight.x = Math.sin(time / 1000)
				tLight.y = Math.cos(time / 500)
				tLight.z = Math.cos(time / 750)
				renderer.render(time, redGPU);

				let tChildren = tView.scene.children
				i = tChildren.length


				while (i--) {
					// if(i%5==0){
					tChildren[i]._rotationX += 1
					tChildren[i]._rotationY += 1
					tChildren[i]._rotationZ += 1
					tChildren[i].dirtyTransform = 1
					// }

				}


				requestAnimationFrame(render);
			};
			requestAnimationFrame(render);
		}
	);


})();