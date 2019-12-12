/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.12 21:19:8
 *
 */

import RedGPU from "../src/RedGPU.js";
import RedRender from "../src/renderer/RedRender.js";
import RedScene from "../src/RedScene.js";
import RedView from "../src/RedView.js";
import RedGrid from "../src/object3D/RedGrid.js";
import RedObitController from "../src/controller/RedObitController.js";
import RedBitmapTexture from "../src/resources/RedBitmapTexture.js";
import RedMesh from "../src/object3D/RedMesh.js";
import RedBox from "../src/primitives/RedBox.js";
import RedBitmapMaterial from "../src/material/RedBitmapMaterial.js";

(async function () {
	const cvs = document.createElement('canvas');
	const glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.12/dist/web-devel/glslang.js');
	document.body.appendChild(cvs);

	const glslang = await glslangModule.default();
	console.log(glslang);
	let testMat
	let redGPU = new RedGPU(cvs, glslang,
		function (v, reason) {

			if (!v) {
				console.log('reason', reason)
				return alert(reason || `WebGPU is unsupported, or no adapters or devices are available.`)
			}
			let tView;
			let tScene = new RedScene();
			let tGrid = new RedGrid(this)
			let tCamera = new RedObitController(this)
			// tGrid.centerColor = '#ff0000'
			// tScene.backgroundColor = '#fff'
			// tScene.backgroundColorAlpha = 0

			tCamera.distance = 20
			tCamera.speedDistance = 1
			tCamera.tilt = -45


			tView = new RedView(this, tScene, tCamera)
			tCamera.targetView = tView // optional
			tScene.grid = tGrid

			this.addView(tView)


			let t = [
				new RedBitmapTexture(redGPU, '../assets/Brick03_col.jpg'),
				new RedBitmapTexture(redGPU, '../assets/Brick03_col.jpg'),
				new RedBitmapTexture(redGPU, '../assets/Brick03_col.jpg'),
				new RedBitmapTexture(redGPU, '../assets/Brick03_col.jpg'),
				new RedBitmapTexture(redGPU, '../assets/Brick03_col.jpg'),
				new RedBitmapTexture(redGPU, '../assets/Brick03_col.jpg')
			]


			let tMesh = new RedMesh(redGPU, new RedBox(redGPU,), new RedBitmapMaterial(redGPU, new RedBitmapTexture(redGPU, '../assets/Brick03_col.jpg'),))

			tScene.addChild(tMesh)

			let renderer = new RedRender();
			let render = function (time) {
				tMesh.rotationZ += 0
				renderer.render(time, redGPU);
				requestAnimationFrame(render);
			}
			requestAnimationFrame(render);
		}
	)


})();