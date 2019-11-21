import RedGPU from "./src/RedGPU.js";
import RedMesh from "./src/object/RedMesh.js";
import RedStandardMaterial from "./src/material/RedStandardMaterial.js";
import RedRender from "./src/renderer/RedRender.js";
import RedBitmapMaterial from "./src/material/RedBitmapMaterial.js";
import RedCamera from "./src/controller/RedCamera.js";
import RedSphere from "./src/primitives/RedSphere.js";
import RedBitmapTexture from "./src/resources/RedBitmapTexture.js";


(async function () {
	const cvs = document.createElement('canvas');
	const glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.9/dist/web-devel/glslang.js');
	document.body.appendChild(cvs);

	const glslang = await glslangModule.default();
	console.log(glslang);
	let redGPU = new RedGPU(cvs, glslang);
	redGPU.camera = new RedCamera();
	requestAnimationFrame(function () {
		let MAX = 1000;
		let i = MAX;
		let testTextureList = [
			new RedBitmapTexture(redGPU, 'assets/UV_Grid_Sm.jpg'),
			new RedBitmapTexture(redGPU, 'assets/Brick03_col.jpg'),
			new RedBitmapTexture(redGPU, 'assets/Brick03_nrm.jpg'),
			new RedBitmapTexture(redGPU, 'assets/crate.png')
		]

		let tMat1 = new RedStandardMaterial(redGPU, testTextureList[1]);
		let tMat2 = new RedStandardMaterial(redGPU, testTextureList[1], testTextureList[2]);
		let tMat3 = new RedBitmapMaterial(redGPU, testTextureList[0]);
		let tMat4 = new RedStandardMaterial(redGPU, testTextureList[0], testTextureList[2]);
		// setTimeout(function(){
		// 	tMat2.normalTexture = null
		// },3000)

		// setInterval(function () {
		// 	i = MAX;
		// 	if (i > 2000) i = 2000;
		// 	while (i--) {
		// 		let testMesh = redGPU.children[i];
		// 		testMesh.material = Math.random() > 0.5 ? tMat : tMat2
		//
		// 	}
		// }, 2000);
		if (i > 2000) i = 2000;
		while (i--) {
			let testMesh = new RedMesh(
				redGPU,
				new RedSphere(redGPU, Math.random() > 0.5 ? 1 : 0.5, 16, 16, 16),
				i > MAX / 2 ? tMat1 : Math.random() > 0.5 ? tMat2 : Math.random() > 0.5 ? tMat3 : tMat4

			);
			testMesh.x = Math.random() * 30 - 15;
			testMesh.y = Math.random() * 30 - 15;
			testMesh.z = Math.random() * 30 - 15;
			testMesh.rotationX = testMesh.rotationY = testMesh.rotationZ = Math.random() * 360
			// testMesh.scaleX = testMesh.scaleY = testMesh.scaleZ = Math.random();
			redGPU.addChild(testMesh)

		}

		let renderer = new RedRender();
		let render = function (time) {

			redGPU.camera.x = Math.sin(time / 3000) * 20;
			redGPU.camera.y = Math.cos(time / 4000) * 20;
			redGPU.camera.z = Math.cos(time / 3000) * 20;
			redGPU.camera.lookAt(0, 0, 0);
			renderer.render(time, redGPU);
			let i = MAX / 5;
			while (i--) {
				redGPU.children[i].rotationX += 1
				redGPU.children[i].rotationY += 1
				redGPU.children[i].rotationZ += 1
			}
			requestAnimationFrame(render)
		};
		requestAnimationFrame(render)
	}, 1000)

})();
