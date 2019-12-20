/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.20 12:21:28
 *
 */

import RedGPU from "../src/RedGPU.js";

(async function () {
	const cvs = document.createElement('canvas');
	const glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.12/dist/web-devel/glslang.js');
	document.body.appendChild(cvs);

	const glslang = await glslangModule.default();
	console.log(glslang);
	let testMat
	let redGPUContext = new RedGPU.GPUContext(cvs, glslang,
		function (v, reason) {

			if (!v) {
				console.log('reason', reason)
				return alert(reason || `WebGPU is unsupported, or no adapters or devices are available.`)
			}
			let tView;
			let tScene = new RedGPU.Scene();
			let tGrid = new RedGPU.Grid(this)
			let tCamera = new RedGPU.ObitController(this)
			// tGrid.centerColor = '#ff0000'
			// tScene.backgroundColor = '#fff'
			// tScene.backgroundColorAlpha = 0

			tCamera.distance = 20
			tCamera.speedDistance = 1


			tView = new RedGPU.View(this, tScene, tCamera)

			tCamera.targetView = tView // optional

			tScene.grid = tGrid
			// tScene.axis = new RedGPU.Axis(redGPUContext)
			let tLight
			tLight = new RedGPU.DirectionalLight('#ffff00')
			tLight.x = 9
			tLight.y = 9
			tLight.z = 9
			// tScene.addLight(tLight)

			tLight = new RedGPU.PointLight('#ff0000',1,1,3)
			tLight.x = 1
			tLight.y = 1
			tLight.z = 1
			// tScene.addLight(tLight)

			tLight = new RedGPU.SpotLight('#00ff00',1,1)

			tLight.x = 0
			tLight.y = 10
			tLight.z = 0

			tScene.addLight(tLight)


			// tLight = new RedGPU.AmbientLight()
			// tScene.addLight(tLight)

			redGPUContext.addView(tView)

			let i = 0
			let len = 2000
			for (i; i < len; i++) {
				let tMesh = new RedGPU.Mesh(redGPUContext, new RedGPU.Sphere(redGPUContext,0.5,16,16,16), new RedGPU.ColorPhongMaterial(redGPUContext))
				tMesh.x = Math.random() * 30 - 15
				tMesh.y = Math.random() * 30 - 15
				tMesh.z = Math.random() * 30 - 15
				// tMesh.x = i * 1
				// tMesh.y = i * 1

				tScene.addChild(tMesh)
			}

			let tMesh = new RedGPU.Mesh(redGPUContext, new RedGPU.Plane(redGPUContext,50,50,50,50), new RedGPU.ColorPhongMaterial(redGPUContext))
			tMesh.rotationX = 90
			tScene.addChild(tMesh)

			let renderer = new RedGPU.Render();
			let render = function (time) {

				// tScene.children.forEach(mesh=>{
				// 	mesh.rotationX++
				// })
				// tLight.x = Math.sin(time / 1000)
				// tLight.y = Math.cos(time / 500)
				// tLight.z = Math.cos(time / 750)
				renderer.render(time, redGPUContext);
				requestAnimationFrame(render);
			}
			requestAnimationFrame(render);
		}
	)


})();