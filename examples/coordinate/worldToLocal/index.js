/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.10 21:21:4
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
		tScene.grid = new RedGPU.Grid(this);
		tCamera = new RedGPU.ObitController(this);
		tCamera.y = 15;
		tCamera.z = 15;
		tCamera.lookAt(0, 0, 0);
		tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh setup
		let rootMesh, testPoint, tMaterial;
		tMaterial = new RedGPU.ColorMaterial(this);
		rootMesh = new RedGPU.Mesh(
			this,
			new RedGPU.Sphere(this, 1, 32, 32, 32),
			tMaterial
		);
		rootMesh.primitiveTopology = 'line-list'
		tScene.addChild(rootMesh);
		testPoint = new RedGPU.Mesh(
			this,
			new RedGPU.Sphere(this, 0.1, 32, 32, 32),
			tMaterial
		);
		testPoint.setScale(0.5, 0.5, 0.5)
		testPoint.setPosition(1,1,1)
		tScene.addChild(testPoint);

		///////////////////////////////////////////////////////////////////////////////////////////
		let resultBox0, resultBox1;
		resultBox0 = document.createElement('div');
		resultBox0.style.cssText = 'position:absolute;padding:10px;color:#fff;background:rgba(255,0,0,0.9);top:0;left:0;font-size:12px;font-weight:bold;width:190px'
		document.body.appendChild(resultBox0)
		resultBox1 = document.createElement('div');
		resultBox1.style.cssText = 'position:absolute;padding:10px;color:#fff;background:rgba(0,255,0,0.9);top:0;left:0;font-size:12px;font-weight:bold;width:190px'
		document.body.appendChild(resultBox1)
		///////////////////////////////////////////////////////////////////////////////////////////
		// renderer setup
		renderer = new RedGPU.Render();
		render = time => {
			// worldToLocal
			let screenPoint, worldPoint,localPoint;
			worldPoint = [1,1,1]
			localPoint = rootMesh.worldToLocal(...worldPoint)
			screenPoint = rootMesh.getScreenPoint(tView,...localPoint)
			resultBox0.style.transform = `translate(${screenPoint[0]}px,${screenPoint[1]}px)`;
			resultBox0.innerHTML = `
				worldToLocal<br>
				worldX : ${worldPoint[0]}, worldY : ${worldPoint[1]}, worldZ : ${worldPoint[2]}<br>
				x : ${localPoint[0]}<br>
				y : ${localPoint[1]}<br>
				z : ${localPoint[2]}
			`;
			screenPoint = rootMesh.getScreenPoint(tView)
			resultBox1.style.transform = `translate(${screenPoint[0]}px,${screenPoint[1]}px)`;
			resultBox1.innerHTML = `
				meshPosition<br>
				mesh.x : ${rootMesh.x}<br>
				mesh.y : ${rootMesh.y}<br>
			    mesh.z : ${rootMesh.z}
			`;
			// render
			rootMesh.setPosition(Math.sin(time / 5000) * 3, 0, Math.cos(time / 5000) * 3)
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
