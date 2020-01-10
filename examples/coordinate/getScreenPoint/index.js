/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.10 20:9:14
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
		let rootMesh, childMesh, tMaterial;
		let localPointMesh_0_0_0, localPointMesh_1_1_1;
		let localPointMesh_0_0_0_child, localPointMesh_1_1_1_child;
		tMaterial = new RedGPU.ColorMaterial(this);
		rootMesh = new RedGPU.Mesh(
			this,
			new RedGPU.Sphere(this, 1, 32, 32, 32),
			tMaterial
		);
		rootMesh.primitiveTopology = 'line-list'
		tScene.addChild(rootMesh);
		localPointMesh_0_0_0 = new RedGPU.Mesh(this, new RedGPU.Sphere(this, 0.1, 32, 32, 32), new RedGPU.ColorMaterial(this))
		rootMesh.addChild(localPointMesh_0_0_0)
		localPointMesh_1_1_1 = new RedGPU.Mesh(this, new RedGPU.Sphere(this, 0.1, 32, 32, 32), new RedGPU.ColorMaterial(this, '#00ff00'))
		localPointMesh_1_1_1.setPosition(1, 1, 1)
		rootMesh.addChild(localPointMesh_1_1_1)

		childMesh = new RedGPU.Mesh(
			this,
			new RedGPU.Sphere(this, 1, 32, 32, 32),
			tMaterial
		);
		childMesh.setScale(0.5, 0.5, 0.5)
		childMesh.setPosition(-2,-2,-2)
		childMesh.primitiveTopology = 'line-list'
		rootMesh.addChild(childMesh);
		localPointMesh_0_0_0_child = new RedGPU.Mesh(this, new RedGPU.Sphere(this, 0.1, 32, 32, 32), new RedGPU.ColorMaterial(this))
		childMesh.addChild(localPointMesh_0_0_0_child)
		localPointMesh_1_1_1_child = new RedGPU.Mesh(this, new RedGPU.Sphere(this, 0.1, 32, 32, 32), new RedGPU.ColorMaterial(this, '#0000ff'))
		localPointMesh_1_1_1_child.setPosition(1, 1, 1)
		childMesh.addChild(localPointMesh_1_1_1_child)

		///////////////////////////////////////////////////////////////////////////////////////////
		let resultBox_0_0_0, resultBox_1_1_1,resultBox_1_1_1_child;
		resultBox_0_0_0 = document.createElement('div');
		resultBox_0_0_0.style.cssText = 'position:absolute;padding:10px;color:#fff;background:rgba(255,0,0,0.9);top:0;left:0;font-size:12px;font-weight:bold;width:190px'
		document.body.appendChild(resultBox_0_0_0)
		resultBox_1_1_1 = document.createElement('div');
		resultBox_1_1_1.style.cssText = 'position:absolute;padding:10px;color:#fff;background:rgba(0,255,0,0.9);top:0;left:0;font-size:12px;font-weight:bold;width:190px'
		document.body.appendChild(resultBox_1_1_1)
		resultBox_1_1_1_child = document.createElement('div');
		resultBox_1_1_1_child.style.cssText = 'position:absolute;padding:10px;color:#fff;background:rgba(0,0,255,0.9);top:0;left:0;font-size:12px;font-weight:bold;width:190px'
		document.body.appendChild(resultBox_1_1_1_child)
		///////////////////////////////////////////////////////////////////////////////////////////
		// renderer setup
		renderer = new RedGPU.Render();
		render = time => {
			// getScreenPoint
			let screenPoint;
			screenPoint = rootMesh.getScreenPoint(tView);
			resultBox_0_0_0.style.transform = `translate(${screenPoint[0]}px,${screenPoint[1]}px)`;
			resultBox_0_0_0.innerHTML = `
				getScreenPoint<br>
				localX : 0, localY : 0, localZ : 0<br>
				x : ${screenPoint[0]}<br>
				y : ${screenPoint[1]}
			`;
			screenPoint = rootMesh.getScreenPoint(tView, 1, 1, 1);
			resultBox_1_1_1.style.transform = `translate(${screenPoint[0]}px,${screenPoint[1]}px)`;
			resultBox_1_1_1.innerHTML = `
				getScreenPoint<br>
				localX : 1, localY : 1, localZ : 1<br>
				x : ${screenPoint[0]}<br>
				y : ${screenPoint[1]}
			`;
			screenPoint = childMesh.getScreenPoint(tView, 1, 1, 1);
			resultBox_1_1_1_child.style.transform = `translate(${screenPoint[0]}px,${screenPoint[1]}px)`;
			resultBox_1_1_1_child.innerHTML = `
				getScreenPoint<br>
				localX : 1, localY : 1, localZ : 1<br>
				x : ${screenPoint[0]}<br>
				y : ${screenPoint[1]}
			`;
			// render
			rootMesh.setPosition(Math.sin(time / 5000) * 3, 0, Math.cos(time / 5000) * 3)
			rootMesh.rotationX += 0.5;
			rootMesh.rotationY += 0.5;
			rootMesh.rotationZ += 0.5;
			childMesh.rotationX += 0.5;
			childMesh.rotationY += 0.5;
			childMesh.rotationZ += 0.5;
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
