/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */
import RedGPU from "../../../dist/RedGPU.min.mjs";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);
new RedGPU.RedGPUContext(
	cvs,
	function () {
		let tView, tScene, tCamera;
		let renderer, render;
		///////////////////////////////////////////////////////////////////////////////////////////
		// basic setup
		tScene = new RedGPU.Scene();
		tCamera = new RedGPU.Camera2D(this);
		tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh setup
		let rootMesh, childMesh, tMaterial;
		tMaterial = new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, '../../../assets/UV_Grid_Sm.jpg'));
		rootMesh = new RedGPU.Mesh(
			this,
			new RedGPU.Plane(this),
			tMaterial
		);
		rootMesh.x = 500
		rootMesh.y = 500
		rootMesh.scaleX = 200
		rootMesh.scaleY = 200
		rootMesh.pivotX = 0.5
		tScene.addChild(rootMesh);

		childMesh = new RedGPU.Mesh(
			this,
			new RedGPU.Plane(this),
			tMaterial
		);
		childMesh.x = 1
		childMesh.scaleX = 1
		childMesh.scaleY = 1
		childMesh.pivotX = 0.5
		rootMesh.addChild(childMesh);
		///////////////////////////////////////////////////////////////////////////////////////////
		// renderer setup
		renderer = new RedGPU.Render();
		render = time => {
			// render
			rootMesh.rotationZ += 0.5;
			childMesh.rotationZ += 0.5;
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_PivotPoint2D(RedGPU, this,rootMesh,childMesh,true);
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
