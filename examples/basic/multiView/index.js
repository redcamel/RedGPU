/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.8 15:12:22
 *
 */
"use strict"
import RedGPU from "../../../src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);
new RedGPU.RedGPUContext(
	cvs,
	function () {
		let tView, tView2, tView3, tScene, tCamera, tCamera2, tCamera3;
		let renderer, render;
		///////////////////////////////////////////////////////////////////////////////////////////
		// basic setup
		tScene = new RedGPU.Scene();
		tCamera = new RedGPU.ObitController(this);
		tCamera2 = new RedGPU.ObitController(this);
		tCamera3 = new RedGPU.ObitController(this);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Multi View setting
		tView = new RedGPU.View(this, tScene, tCamera);
		tCamera.targetView = tView;
		tView2 = new RedGPU.View(this, tScene, tCamera2);
		tCamera2.targetView = tView2;
		tView3 = new RedGPU.View(this, tScene, tCamera3);
		tCamera3.targetView = tView3;
		tView.setSize('50%', '100%')
		tView2.setSize('50%', '100%')
		tView2.setLocation('50%', 0)
		tView3.setSize('30%', '30%')
		this.addView(tView);
		this.addView(tView2);
		this.addView(tView3);
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
			let viewRect = tView3.viewRect;
			let tW = window.innerWidth;
			let tH = window.innerHeight;


			tView3.setLocation(Math.sin(time / 500) * viewRect[2] / 3 + tW / 2 - viewRect[2] / 2, Math.cos(time / 500) * viewRect[3] / 3 + tH / 2 - viewRect[3] / 2);
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
