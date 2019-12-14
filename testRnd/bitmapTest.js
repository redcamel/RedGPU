/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 18:31:10
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
		let tCamera = new RedGPU.RedObitController(this)
		// tGrid.centerColor = '#ff0000'
		// tScene.backgroundColor = '#fff'
		// tScene.backgroundColorAlpha = 0

		tCamera.distance = 20
		tCamera.speedDistance = 1
		tCamera.tilt = -45


		tView = new RedGPU.RedView(this, tScene, tCamera)
		tCamera.targetView = tView // optional
		tScene.grid = tGrid

		this.addView(tView)



		let t = [
			new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg'),
			new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg'),
			new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg'),
			new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg'),
			new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg'),
			new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg')
		]


		let tMesh = new RedGPU.RedMesh(this, new RedGPU.RedBox(this,), new RedGPU.RedBitmapMaterial(this, new RedGPU.RedBitmapTexture(this, '../assets/Brick03_col.jpg'),))

		tScene.addChild(tMesh)

		let renderer = new RedGPU.RedRender();
		let render = time=> {
			tMesh.rotationZ += 0
			renderer.render(time,this);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);
	}
)
