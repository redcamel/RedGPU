/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 22:3:4
 *
 */
"use strict"
import RedGPU from "../../src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);
new RedGPU.RedGPUContext(
	cvs,
	function () {
		let tView, tScene, tCamera;
		let renderer, render;
		let testMesh;
		///////////////////////////////////////////////////////////////////////////////////////////
		// basic setup
		tScene = new RedGPU.Scene();
		tCamera = new RedGPU.Camera(this);
		tCamera.x = 5;
		tCamera.y = 5;
		tCamera.z = 5;
		tCamera.lookAt(0, 0, 0);
		tView = new RedGPU.View(this, tScene, tCamera);
		renderer = new RedGPU.Render();
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// mesh setup
		testMesh = new RedGPU.Mesh(this, new RedGPU.Box(this), new RedGPU.ColorMaterial(this));
		tScene.addChild(testMesh);
		///////////////////////////////////////////////////////////////////////////////////////////
		// renderer setup
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI(RedGPU, this, tView, tScene, tCamera);
	}
);
