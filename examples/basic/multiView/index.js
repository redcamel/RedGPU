/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.8 11:32:56
 *
 */
"use strict"
import RedGPU from "../../../src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);
new RedGPU.RedGPUContext(
	cvs,
	function () {
		let tView, tView2, tScene, tCamera, tCamera2;
		let renderer, render;
		///////////////////////////////////////////////////////////////////////////////////////////
		// basic setup
		tScene = new RedGPU.Scene();
		tCamera = new RedGPU.ObitController(this);
		tCamera2 = new RedGPU.ObitController(this);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Multi View setting
		tView = new RedGPU.View(this, tScene, tCamera);
		tCamera.targetView = tView; // optional
		tView2 = new RedGPU.View(this, tScene, tCamera2);
		tCamera2.targetView = tView2; // optional
		tView.setSize('50%', '100%')
		tView2.setSize('50%', '100%')
		tView2.setLocation('50%', 0)
		this.addView(tView);
		this.addView(tView2);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Scene property setting
		tScene.grid = new RedGPU.Grid(this);
		tScene.axis = new RedGPU.Axis(this);
		tScene.skyBox = new RedGPU.SkyBox(
			this, new RedGPU.BitmapCubeTexture(
				this,
				[
					'../../../assets/cubemap/SwedishRoyalCastle/px.jpg',
					'../../../assets/cubemap/SwedishRoyalCastle/nx.jpg',
					'../../../assets/cubemap/SwedishRoyalCastle/py.jpg',
					'../../../assets/cubemap/SwedishRoyalCastle/ny.jpg',
					'../../../assets/cubemap/SwedishRoyalCastle/pz.jpg',
					'../../../assets/cubemap/SwedishRoyalCastle/nz.jpg'
				]
			)
		);
		///////////////////////////////////////////////////////////////////////////////////////////
		// renderer setup
		renderer = new RedGPU.Render();
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_View(tView, true);
	}
);
