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
		tCamera.distance = 30
		tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Line setup
		let pointList = [{"x": -3, "y": 3, "z": -3}, {"x": -3, "y": 1, "z": -3}, {"x": -1, "y": 1, "z": -3}, {"x": -1, "y": 3, "z": -3}, {"x": -1, "y": 3, "z": -1}, {"x": -1, "y": 1, "z": -1}, {"x": -3, "y": 1, "z": -1}, {"x": -3, "y": 3, "z": -1}, {"x": -3, "y": 3, "z": 1}, {"x": -1, "y": 3, "z": 1}, {"x": -1, "y": 3, "z": 3}, {"x": -3, "y": 3, "z": 3}, {"x": -3, "y": 1, "z": 3}, {"x": -1, "y": 1, "z": 3}, {"x": -1, "y": 1, "z": 1}, {"x": -3, "y": 1, "z": 1}, {"x": -3, "y": -1, "z": 1}, {"x": -1, "y": -1, "z": 1}, {"x": -1, "y": -1, "z": 3}, {"x": -3, "y": -1, "z": 3}, {"x": -3, "y": -3, "z": 3}, {"x": -1, "y": -3, "z": 3}, {"x": -1, "y": -3, "z": 1}, {"x": -3, "y": -3, "z": 1}, {"x": -3, "y": -3, "z": -1}, {"x": -3, "y": -3, "z": -3}, {"x": -3, "y": -1, "z": -3}, {"x": -3, "y": -1, "z": -1}, {"x": -1, "y": -1, "z": -1}, {"x": -1, "y": -1, "z": -3}, {"x": -1, "y": -3, "z": -3}, {"x": -1, "y": -3, "z": -1}, {"x": 1, "y": -3, "z": -1}, {"x": 1, "y": -3, "z": -3}, {"x": 1, "y": -1, "z": -3}, {"x": 1, "y": -1, "z": -1}, {"x": 3, "y": -1, "z": -1}, {"x": 3, "y": -1, "z": -3}, {"x": 3, "y": -3, "z": -3}, {"x": 3, "y": -3, "z": -1}, {"x": 3, "y": -3, "z": 1}, {"x": 1, "y": -3, "z": 1}, {"x": 1, "y": -3, "z": 3}, {"x": 3, "y": -3, "z": 3}, {"x": 3, "y": -1, "z": 3}, {"x": 1, "y": -1, "z": 3}, {"x": 1, "y": -1, "z": 1}, {"x": 3, "y": -1, "z": 1}, {"x": 3, "y": 1, "z": 1}, {"x": 1, "y": 1, "z": 1}, {"x": 1, "y": 1, "z": 3}, {"x": 3, "y": 1, "z": 3}, {"x": 3, "y": 3, "z": 3}, {"x": 1, "y": 3, "z": 3}, {"x": 1, "y": 3, "z": 1}, {"x": 3, "y": 3, "z": 1}, {"x": 3, "y": 3, "z": -1}, {"x": 3, "y": 1, "z": -1}, {"x": 1, "y": 1, "z": -1}, {"x": 1, "y": 3, "z": -1}, {"x": 1, "y": 3, "z": -3}, {"x": 1, "y": 1, "z": -3}, {"x": 3, "y": 1, "z": -3}, {"x": 3, "y": 3, "z": -3}]
		let makeInfo = [
			{position: [-9, 0, 0], color: '#00ff00'},
			{position: [9, 0, 0], color: '#ff0000'},
			{position: [0, 0, -9], color: '#ff0000'},
			{position: [0, 0, 9], color: '#0000ff'}
		]
		makeInfo.forEach(info => {
			let tLine;
			tLine = new RedGPU.Line(this);
			pointList.forEach(v => { tLine.addPoint(v.x, v.y, v.z, info.color) })
			tLine.setPosition(...info.position)
			tScene.addChild(tLine);
		})


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
