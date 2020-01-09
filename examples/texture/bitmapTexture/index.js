/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 14:4:9
 *
 */
"use strict"
import RedGPU from "../../../src/RedGPU.js";

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
		tCamera = new RedGPU.ObitController(this);
		tCamera.distance = 10
		tCamera.tilt = -10
		tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh setup
		let tMesh, tGeometry, tMaterial;
		tGeometry = new RedGPU.Box(this, 1, 1, 1, 1, 1, 1, 3)
		tMaterial = new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, '../../../assets/crate.png'));
		let i = 10;
		while (i--) {
			tMesh = new RedGPU.Mesh(
				this,
				tGeometry,
				tMaterial
			);
			tMesh.cullMode = 'none';
			tScene.addChild(tMesh);
			tMesh.x = Math.sin(Math.PI * 2 / 10 * i) * 5
			tMesh.z = Math.cos(Math.PI * 2 / 10 * i) * 5
		}

		///////////////////////////////////////////////////////////////////////////////////////////
		renderer = new RedGPU.Render();
		// renderer setup
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_BitmapTexture(RedGPU, this, tMaterial, true);
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
