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
		let tView1,tView2, tScene, tCamera, tLight;
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
		tView1 = new RedGPU.View(this, tScene, tCamera);
		tView1.setSize('50%','100%');
		this.addView(tView1);
		tView2 = new RedGPU.View(this, tScene, tCamera);
		tView2.setSize('50%','100%');
		tView2.setLocation('50%','0%');
		this.addView(tView2);
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
			tMesh.addEventListener('over', function (e) {
				console.log(e)
				let tValue = 1.5
				TweenMax.to(this, 0.5, {scaleX: tValue, scaleY: tValue, scaleZ: tValue, ease: Back.easeOut});
			})
			tMesh.addEventListener('out', function (e) {
				console.log(e)
				let tValue = 1
				TweenMax.to(this, 0.5, {scaleX: tValue, scaleY: tValue, scaleZ: tValue, ease: Back.easeOut});
			})
			tMesh.addEventListener('down', function (e) {
				console.log(e)
				let tValue = 2
				TweenMax.to(this, 0.5, {scaleX: tValue, scaleY: tValue, scaleZ: tValue, ease: Back.easeOut});
			})
			tMesh.addEventListener('up', function (e) {
				console.log(e)
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
