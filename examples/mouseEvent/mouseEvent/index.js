/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.10 21:49:1
 *
 */
"use strict"
import RedGPU from "../../../src/RedGPU.js";

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
		// Mesh & MouseEvent setup
		let i = 100;
		while (i--) {
			let tMesh, tGeometry, tMaterial;
			tGeometry = new RedGPU.Sphere(this, 0.5, 32, 32, 32);
			tMaterial = new RedGPU.ColorPhongMaterial(this);
			tMesh = new RedGPU.Mesh(
				this,
				tGeometry,
				tMaterial
			);
			tScene.addChild(tMesh);
			tMesh.setPosition(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5)
			tMesh.addEventListener('over', function () {
				let tValue = 1.5
				TweenMax.to(this, 0.5, {scaleX: tValue, scaleY: tValue, scaleZ: tValue, ease: Back.easeOut});
			})
			tMesh.addEventListener('out', function () {
				let tValue = 1
				TweenMax.to(this, 0.5, {scaleX: tValue, scaleY: tValue, scaleZ: tValue, ease: Back.easeOut});
			})
			tMesh.addEventListener('down', function () {
				let tValue = 2
				TweenMax.to(this, 0.5, {scaleX: tValue, scaleY: tValue, scaleZ: tValue, ease: Back.easeOut});
			})
			tMesh.addEventListener('up', function () {
				let tValue = 1.25
				TweenMax.to(this, 0.5, {scaleX: tValue, scaleY: tValue, scaleZ: tValue, ease: Back.easeOut});
			})
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
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
