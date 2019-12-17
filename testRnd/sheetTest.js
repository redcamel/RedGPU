/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.17 11:18:30
 *
 */
import RedGPU from "../src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);


new RedGPU.RedGPUContext(cvs,
	function (v, reason) {
		let tView;
		let tScene = new RedGPU.RedScene();
		let tGrid = new RedGPU.RedGrid(this)
		let tCamera = new RedGPU.RedCamera(this)


		tView = new RedGPU.RedView(this, tScene, tCamera)
		tCamera.targetView = tView // optional
		tScene.grid = tGrid

		this.addView(tView)


		let i = 100
		while(i--){
			let tMesh
			tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedSheetMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/sheet/spriteSheet.png'), 24, 5, 3, 15))
			tMesh.x = Math.random() * 10 - 5
			tMesh.y = Math.random() * 10 - 5
			tMesh.z = Math.random() * 10 - 5
			tScene.addChild(tMesh)
		}


		let renderer = new RedGPU.RedRender();
		let render = time => {

			tCamera.x = Math.sin(time / 11500) * 10
			tCamera.z = Math.cos(time / 11500) * 10
			tCamera.y = 10
			tCamera.lookAt(0, 0, 0)
			renderer.render(time, this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);


	}
)
