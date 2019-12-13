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

new RedGPU.RedGPUContext(
	cvs,
	function (successYn, reason) {
		if (!successYn) {
			console.log('reason', reason)
			return alert(reason || `WebGPU is unsupported, or no adapters or devices are available.`)
		}
		let tView;
		let tScene = new RedGPU.RedScene();
		let tGrid = new RedGPU.RedGrid(this)
		let tCamera = new RedGPU.RedObitController(this)
		tCamera.distance = 20
		tCamera.speedDistance = 1
		tView = new RedGPU.RedView(this, tScene, tCamera)
		this.addView(tView)
		tCamera.targetView = tView // optional
		tScene.grid = tGrid
		tScene.axis = new RedGPU.RedAxis(this)

		let tLight
		tLight = new RedGPU.RedDirectionalLight()
		tLight.x = 9
		tLight.y = 9
		tLight.z = 9
		tScene.addLight(tLight)


		let i = 0
		let len = 100
		for (i; i < len; i++) {
			let tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this, 0.5, 16, 16, 16), new RedGPU.RedColorPhongMaterial(this))
			tMesh.x = i * 1.1
			tMesh.y = i * 1.1

			tScene.addChild(tMesh)
		}

		setTimeout(_ => {
			let tMesh = new RedGPU.RedMesh(this, new RedGPU.RedSphere(this, 0.5, 16, 16, 16), new RedGPU.RedColorMaterial(this))
			tMesh.x = 1
			tScene.addChild(tMesh)
		}, 500)

		let renderer = new RedGPU.RedRender();
		let render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);
	}
)

