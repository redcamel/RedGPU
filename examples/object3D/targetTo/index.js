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
		let tView, tScene, tCamera, tLight;
		let renderer, render;
		///////////////////////////////////////////////////////////////////////////////////////////
		// basic setup
		tScene = new RedGPU.Scene();
		tScene.grid = new RedGPU.Grid(this);
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
		tCamera.tilt = 0;
		tCamera.distance = 50
		tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// light setup
		tLight = new RedGPU.DirectionalLight(this)
		tLight.x = 5;
		tLight.y = 5;
		tLight.z = 5;
		tScene.addLight(tLight)
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh setup
		let i = 500;
		let testList = []
		while (i--) {
			let tMesh = new RedGPU.Mesh(this, new RedGPU.Box(this, 1, 1, 3), new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, '../../../assets/crate.png')))
			tMesh.x = Math.random() * 50 - 25
			tMesh.y = Math.random() * 50 - 25
			tMesh.z = Math.random() * 50 - 25
			tMesh.targetTo(0, 0, 0)
			tScene.addChild(tMesh)
			testList.push(tMesh)
		}
		let centerMesh = new RedGPU.Mesh(this, new RedGPU.Sphere(this, 0.5, 16, 16, 16), new RedGPU.ColorPhongMaterial(this))
		tScene.addChild(centerMesh)
		///////////////////////////////////////////////////////////////////////////////////////////
		renderer = new RedGPU.Render();
		// renderer setup
		render = time => {
			let tPosition = [Math.sin(time / 1000) * 5, Math.cos(time / 1000) * 5, Math.sin(time / 1000) * 5]
			centerMesh.setPosition(...tPosition)

			testList.forEach(v => { v.targetTo(...tPosition) })
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup

		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
