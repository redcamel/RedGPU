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
		tScene.grid = new RedGPU.Grid(this);
		tCamera = new RedGPU.Camera(this);
		tCamera.y = 15;
		tCamera.z = 15;
		tCamera.lookAt(0, 0, 0);
		tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh setup
		let tMesh, tGeometry, tMaterial;
		tGeometry = new RedGPU.Sphere(this, 1, 32, 32, 32);
		tMaterial = new RedGPU.ColorMaterial(this);
		tMesh = new RedGPU.Mesh(
			this,
			tGeometry,
			tMaterial
		);
		tScene.addChild(tMesh);
		///////////////////////////////////////////////////////////////////////////////////////////
		// screenToWorld
		let tText = document.createElement('div');
		tText.style.cssText = `position:absolute;background:#000;padding:5px;color:#fff;transform:translate(-50%,50px);white-space:nowrap`;
		document.body.appendChild(tText)
		document.querySelector('canvas').addEventListener(
			'mousemove',
			function (e) {
				let currentPosition = RedGPU.UTIL.screenToWorld(
					e.layerX * window.devicePixelRatio,
					e.layerY * window.devicePixelRatio,
					tView
				);
				tMesh.setPosition(...currentPosition);
				tText.style.left = e.layerX+'px';
				tText.style.top = e.layerY+'px';
				tText.innerHTML = 'x : ' + currentPosition[0].toFixed(2) + ' / y : ' + currentPosition[1].toFixed(2) + ' / z : ' + currentPosition[2].toFixed(2);
			}
		);
		renderer = new RedGPU.Render();
		///////////////////////////////////////////////////////////////////////////////////////////
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
