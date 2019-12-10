/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.10 14:18:48
 *
 */

import RedGPU from "../src/RedGPU.js";
import RedRender from "../src/renderer/RedRender.js";
import RedScene from "../src/RedScene.js";
import RedView from "../src/RedView.js";
import RedGrid from "../src/object3D/RedGrid.js";
import RedObitController from "../src/controller/RedObitController.js";
import RedDirectionalLight from "../src/light/RedDirectionalLight.js";
import RedTypeSize from "../src/resources/RedTypeSize.js";
import RedMesh from "../src/object3D/RedMesh.js";
import RedBox from "../src/primitives/RedBox.js";
import RedColorMaterial from "../src/material/RedColorMaterial.js";
import RedColorPhongMaterial from "../src/material/RedColorPhongMaterial.js";
import RedBitmapMaterial from "../src/material/RedBitmapMaterial.js";
import RedBitmapTexture from "../src/resources/RedBitmapTexture.js";

(async function () {
	const cvs = document.createElement('canvas');
	const glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.9/dist/web-devel/glslang.js');
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
			// let tGrid = new RedGrid(this)
			let tCamera = new RedObitController(this)
			// tGrid.centerColor = '#ff0000'
			// tScene.backgroundColor = '#fff'
			// tScene.backgroundColorAlpha = 0

			tCamera.distance = 20
			tCamera.speedDistance = 1


			tView = new RedView(this, tScene, tCamera)

			tCamera.targetView = tView // optional

			// tScene.grid = tGrid
			// tScene.axis = new RedAxis(redGPU)
			let tLight
			tLight = new RedDirectionalLight()
			tLight.x = 3
			tLight.y = 2
			tLight.z = 3
			tScene.addLight(tLight)

			redGPU.addView(tView)

			let i = 0
			let len = 10
			for(i;i<len;i++){
				// new RedBitmapMaterial(redGPU, new RedBitmapTexture(redGPU,'../assets/crate.png'))
				let tMesh = new RedMesh(redGPU, new RedBox(redGPU), new RedColorPhongMaterial(redGPU))
				tMesh.x = i * (1.5)
				tMesh.y = i * (1.5)
				console.log('tMesh',tMesh)

				tScene.addChild(tMesh)
			}


			let renderer = new RedRender();
			let render = function (time) {

				tScene.children.forEach(mesh=>{
					mesh.rotationX++
				})
				// tLight.x = Math.sin(time / 1000)
				// tLight.y = Math.cos(time / 500)
				// tLight.z = Math.cos(time / 750)
				renderer.render(time, redGPU);
				requestAnimationFrame(render);
			}
			requestAnimationFrame(render);
		}
	)


})();