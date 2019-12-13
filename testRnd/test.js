/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 13:21:23
 *
 */

import RedGPU from "../src/RedGPU.js";
import RedMesh from "../src/object3D/RedMesh.js";
import RedRender from "../src/renderer/RedRender.js";
import RedSphere from "../src/primitives/RedSphere.js";
import RedScene from "../src/RedScene.js";
import RedView from "../src/RedView.js";
import RedColorMaterial from "../src/material/RedColorMaterial.js";
import RedObitController from "../src/controller/RedObitController.js";
import RedDirectionalLight from "../src/light/RedDirectionalLight.js";
import RedBitmapTexture from "../src/resources/RedBitmapTexture.js";
import RedStandardMaterial from "../src/material/RedStandardMaterial.js";


(async function () {
	const cvs = document.createElement('canvas');
	const glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.12/dist/web-devel/glslang.js');
	document.body.appendChild(cvs);

	const glslang = await glslangModule.default();
	console.log(glslang);
	let testMat_color, testMat_colorPhong, testMat_bitmap, testMat_standard_diffuse, testMat_standard_diffuse_normal,
		testMat_standard_diffuse_normal_displacement, testMat_colorPhongTexture_normal,
		testMat_colorPhongTexture_normal_displacement,
		testMat_environment;
	let redGPU = new RedGPU(cvs, glslang,
		function () {
			let MAX = 1000;
			let i = MAX;
			let tView;
			let tScene = new RedScene();
			let tCamera = new RedObitController(this);
			tView = new RedView(this, tScene, tCamera);
			tCamera.targetView = tView; // optional
			tCamera.speedDistance = 5;
			let tLight;
			tLight = new RedDirectionalLight();
			tLight.x = 10;
			tLight.y = 10;
			tLight.z = 10;
			tScene.addLight(tLight);
			redGPU.addView(tView);
			// testMat_color = new RedColorMaterial(redGPU, '#ffff12');
			// let testTextureList = [
			// 	new RedBitmapTexture(redGPU, '../assets/UV_Grid_Sm.jpg'),
			// 	new RedBitmapTexture(redGPU, '../assets/Brick03_col.jpg'),
			// 	// new RedBitmapTexture(redGPU, '../assets/Brick03_nrm.jpg'),
			// 	// new RedBitmapTexture(redGPU, '../assets/crate.png'),
			// 	// new RedBitmapTexture(redGPU, '../assets/Brick03_disp.jpg'),
			// 	// new RedBitmapTexture(redGPU, '../assets/specular.png'),
			// 	// new RedBitmapTexture(redGPU, '../assets/emissive.jpg')
			// ];
			let testTextureList = [
				new RedBitmapTexture(redGPU, '../assets/Brick03_col.jpg'),
				new RedBitmapTexture(redGPU, '../assets/Brick03_nrm.jpg'),
				new RedBitmapTexture(redGPU, '../assets/specular.png'),
				new RedBitmapTexture(redGPU, '../assets/emissive.jpg'),
				new RedBitmapTexture(redGPU, '../assets/Brick03_disp.jpg')
			];
			testMat_bitmap = new RedStandardMaterial(redGPU, ...testTextureList);


			while (i--) {
				let testMesh = new RedMesh(
					redGPU,
					new RedSphere(redGPU, 0.5, 16, 16, 16),
					// new RedColorMaterial(redGPU, '#ffff12')
					// testMat_bitmap = new RedStandardMaterial(redGPU, ...testTextureList)
					// testMat_bitmap = new RedStandardMaterial(redGPU, testTextureList[0],testTextureList[1])
					testMat_bitmap
				);
				testMesh.x = Math.random() * 30 - 15;
				testMesh.y = Math.random() * 30 - 15;
				testMesh.z = Math.random() * 30 - 15;
				tScene.addChild(testMesh)
			}

			let renderer = new RedRender();
			let render = function (time) {

				renderer.render(time, redGPU);

				let tChildren = tView.scene.children;
				i = tChildren.length;
				while (i--) {
					tChildren[i]._rotationX += 1;
					tChildren[i]._rotationY += 1;
					tChildren[i]._rotationZ += 1;
					tChildren[i].dirtyTransform = 1
				}
				requestAnimationFrame(render);
			};
			requestAnimationFrame(render);
		}
	);


})();