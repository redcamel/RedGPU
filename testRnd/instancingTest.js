/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.13 14:36:13
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
		RedGPU.Debugger.visible(true)
		// tGrid.centerColor = '#ff0000'
		tCamera.speedDistance = 0.3
		// tScene.backgroundColor = '#fff'
		// tScene.backgroundColorAlpha = 0
		let tLight
		tLight = new RedGPU.DirectionalLight(this, '#ff0000', 0.1)
		tLight.x = 0
		tLight.y = 5
		tLight.z = 0
		tScene.addLight(tLight)

		tLight = new RedGPU.DirectionalLight(this)
		tLight.x = 0
		tLight.y = 5
		tLight.z = 0
		tScene.addLight(tLight)
		// tScene.axis = new RedGPU.Axis(this)
		tView = new RedGPU.View(this, tScene, tCamera)
		tCamera.targetView = tView // optional
		// tScene.grid = tGrid

		this.addView(tView)

		let instancingMesh;
		instancingMesh = new InstancingMesh(this, new RedGPU.Sphere(this, 1), new RedGPU.ColorMaterial(this))
		{
			let i = 1000;
			while(i--){
				let tScale = Math.random() * 5
				let position = [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5]
				let scale = [tScale, tScale, tScale]
				let rotation = [Math.random() * 360, Math.random() * 360, Math.random() * 360]
				instancingMesh.addItem({
					// custom Information
					position: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5],
					scale: [tScale, tScale, tScale],
					rotation: [Math.random() * 360, Math.random() * 360, Math.random() * 360]
				})
			}
		}

		tScene.addChild(instancingMesh)


		let renderer = new RedGPU.Render();

		let render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);


	}
)
