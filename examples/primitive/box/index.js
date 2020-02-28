/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.2.28 21:0:29
 *
 */
"use strict"
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
		tCamera = new RedGPU.ObitController(this);
		tView = new RedGPU.View(this, tScene, tCamera);
		tScene.grid = new RedGPU.Grid(this);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh setup
		let tMesh, tGeometry, tMaterial;
		tGeometry = new RedGPU.Box(this);
		tMaterial = new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this,'../../../assets/UV_Grid_Sm.jpg'));
		tMesh = new RedGPU.Mesh(this, tGeometry, tMaterial);
		tScene.addChild(tMesh);
		///////////////////////////////////////////////////////////////////////////////////////////
		// renderer setup
		renderer = new RedGPU.Render();
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_PrimitiveBox(RedGPU, this, tMesh, true);
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
