/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 22:48:40
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
		///////////////////////////////////////////////////////////////////////////////////////////
		// basic setup
		tScene = new RedGPU.Scene();
		tCamera = new RedGPU.ObitController(this);
		tView = new RedGPU.View(this, tScene, tCamera);
		renderer = new RedGPU.Render();
		this.addView(tView);

		///////////////////////////////////////////////////////////////////////////////////////////
		// Scene property setting
		tScene.grid = new RedGPU.Grid(this);
		tScene.axis = new RedGPU.Axis(this);
		tScene.skyBox = new RedGPU.SkyBox(
			this, new RedGPU.BitmapCubeTexture(
				this,
				[
					'../../assets/cubemap/SwedishRoyalCastle/px.jpg',
					'../../assets/cubemap/SwedishRoyalCastle/nx.jpg',
					'../../assets/cubemap/SwedishRoyalCastle/py.jpg',
					'../../assets/cubemap/SwedishRoyalCastle/ny.jpg',
					'../../assets/cubemap/SwedishRoyalCastle/pz.jpg',
					'../../assets/cubemap/SwedishRoyalCastle/nz.jpg'
				]
			)
		);
		///////////////////////////////////////////////////////////////////////////////////////////

		// renderer setup
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_Scene(RedGPU, this, tScene, null, true);
	}
);
