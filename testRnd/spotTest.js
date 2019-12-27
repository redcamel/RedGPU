/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.27 19:6:22
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


		// tLight = new RedGPU.DirectionalLight(this, '#ff0000')
		// tLight.x = 5
		// tLight.y = 5
		// tLight.z = 0
		// tScene.addLight(tLight)

		tLight = new RedGPU.SpotLight(this)
		tLight.useDebugMesh=true
		tLight.x = 0
		tLight.y = 30
		tLight.z = 0
		tScene.addLight(tLight)
		// tScene.axis = new RedGPU.Axis(this)
		tView = new RedGPU.View(this, tScene, tCamera)
		tCamera.targetView = tView // optional
		tScene.grid = tGrid

		this.addView(tView)


		let tMesh
		tMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this), new RedGPU.ColorPhongMaterial(this))
		tMesh.x = 0
		tMesh.y = 0
		tMesh.z = 0
		tScene.addChild(tMesh)

		tMesh = new RedGPU.Mesh(this, new RedGPU.Plane(this,100,100), new RedGPU.ColorPhongMaterial(this))
		tMesh.rotationX = 90
		tScene.addChild(tMesh)


		let renderer = new RedGPU.Render();

		let render = time => {

			renderer.render(time, this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);


	}
)
