/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.14 17:51:9
 *
 */
import RedGPU from "../src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);


new RedGPU.RedGPUContext(cvs,
	function (v, reason) {
		console.log(this.context)
		let tView;
		let tScene = new RedGPU.Scene();
		let tGrid = new RedGPU.Grid(this)
		let tCamera = new RedGPU.ObitController(this)
		let tLight
		tScene.backgroundColor = '#fff'
		tLight = new RedGPU.DirectionalLight(this)
		tLight.x = 0
		tLight.y = 100
		tLight.z = 0
		tScene.addLight(tLight)
		// tScene.axis = new RedGPU.Axis(this)
		tView = new RedGPU.View(this, tScene, tCamera)
		tCamera.targetView = tView // optional
		tScene.grid = tGrid

		this.addView(tView)


		let i = 1
		let tMesh
		while (i--) {
			 tMesh = new RedGPU.Text(this,512,512)
			tMesh.fontSize = 36
			tMesh.text = i%2 ? '가나다라마바사' : 'ABCDEFG'
			tScene.addChild(tMesh)

		}
		tMesh.scaleX = 10
		tMesh.scaleY = 10


		let renderer = new RedGPU.Render();
		let render = time => {
			tScene._children.forEach(tMesh => {

				// tMesh.material.alpha = RedGPU.UTIL.clamp(Math.sin(time / 500), 0, 1)

			})
			// console.log(tCamera.getPosition())
			renderer.render(time, this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);


	}
)
