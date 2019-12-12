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
import RedDirectionalLight from "../src/light/RedDirectionalLight.js";
import RedMesh from "../src/object3D/RedMesh.js";
import RedColorPhongMaterial from "../src/material/RedColorPhongMaterial.js";
import RedSphere from "../src/primitives/RedSphere.js";
import RedAmbientLight from "../src/light/RedAmbientLight.js";
import RedPlane from "../src/primitives/RedPlane.js";
import RedPointLight from "../src/light/RedPointLight.js";
import RedSpotLight from "../src/light/RedSpotLight.js";

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


			tView = new RedView(this, tScene, tCamera)

			tCamera.targetView = tView // optional

			tScene.grid = tGrid
			// tScene.axis = new RedAxis(redGPU)
			let tLight
			tLight = new RedDirectionalLight('#ffff00')
			tLight.x = 9
			tLight.y = 9
			tLight.z = 9
			// tScene.addLight(tLight)

			tLight = new RedPointLight('#ff0000',1,1,3)
			tLight.x = 1
			tLight.y = 1
			tLight.z = 1
			// tScene.addLight(tLight)

			tLight = new RedSpotLight('#00ff00',1,1)

			tLight.x = 0
			tLight.y = 10
			tLight.z = 0

			tScene.addLight(tLight)


			// tLight = new RedAmbientLight()
			// tScene.addLight(tLight)

			redGPU.addView(tView)

			let i = 0
			let len = 2000
			for (i; i < len; i++) {
				let tMesh = new RedMesh(redGPU, new RedSphere(redGPU,0.5,16,16,16), new RedColorPhongMaterial(redGPU))
				tMesh.x = Math.random() * 30 - 15
				tMesh.y = Math.random() * 30 - 15
				tMesh.z = Math.random() * 30 - 15
				// tMesh.x = i * 1
				// tMesh.y = i * 1

				tScene.addChild(tMesh)
			}

			let tMesh = new RedMesh(redGPU, new RedPlane(redGPU,50,50,50,50), new RedColorPhongMaterial(redGPU))
			tMesh.rotationX = 90
			tScene.addChild(tMesh)

			let renderer = new RedRender();
			let render = function (time) {

				// tScene.children.forEach(mesh=>{
				// 	mesh.rotationX++
				// })
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