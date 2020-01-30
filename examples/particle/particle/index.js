/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.30 19:35:31
 *
 */
"use strict"
import RedGPU from "../../../src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);
new RedGPU.RedGPUContext(
	cvs,
	function () {
		let tView, tScene, tCamera,tLight;
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
		tCamera.distance = 50
		tCamera.tilt = 0;
		tLight = new RedGPU.DirectionalLight(this)
		tLight.x = 1
		tLight.y = 1
		tLight.z = 1
		tScene.addLight(tLight)
		tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh setup
		{
			let i = 200;
			while (i--) {
				let tMesh;
				tMesh = new RedGPU.Mesh(
					this,
					new RedGPU.Sphere(this, 1, 32, 32, 32),
					new RedGPU.StandardMaterial(this, new RedGPU.BitmapTexture(this, '../../../assets/Brick03_col.jpg'),new RedGPU.BitmapTexture(this, '../../../assets/Brick03_nrm.jpg'))
				);
				tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = Math.random()*3
				tScene.addChild(tMesh);
				tMesh.setPosition(Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25)
			}
		}
		///////////////////////////////////////////////////////////////////////////////////////////
		// Particle setup
		let particleTest = new RedGPU.Particle(this, 10000, {}, new RedGPU.BitmapTexture(this, '../../../assets/particle.png'))
		tScene.addChild(particleTest)
		let centerPoint = new RedGPU.Mesh(this, new RedGPU.Sphere(this, 0.5, 32, 32, 32), new RedGPU.ColorMaterial(this))
		centerPoint.setPosition(0, 0, 0)
		particleTest.addChild(centerPoint)
		///////////////////////////////////////////////////////////////////////////////////////////
		// renderer setup
		renderer = new RedGPU.Render();
		render = time => {
			particleTest.x = Math.sin(time / 2000 + Math.cos(time / 3000)) * Math.cos(time / 1000) * 30
			particleTest.y = Math.sin(time / 3000 + Math.cos(time / 2000)) * Math.cos(time / 1000) * 20
			particleTest.z = Math.cos(time / 1000 + Math.cos(time / 2000)) * Math.cos(time / 1000) * 30
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_Particle(RedGPU, this, particleTest, true);
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
