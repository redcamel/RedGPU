/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.2.28 21:0:29
 *
 */
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
		tScene.grid = new RedGPU.Grid(this)
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
		let makeInfo = [
			{position: [-9, -19, 0], color: '#00ff00'},
			{position: [9, -19, 0], color: '#ff0000'},
			{position: [0, -19, -9], color: '#ff0000'},
			{position: [0, -19, 9], color: '#0000ff'}
		]
		makeInfo.forEach(info => {
			let tLine;
			let i = 100
			tLine = new RedGPU.Line(this);
			tLine.type = RedGPU.Line.BEZIER
			tLine.addPoint(4.4, 37.1, 0, info.color, 1, 0, 0, 0, 6.2, 33.8, 0);
			tLine.addPoint(5.9, 26.0, 0, info.color, 1, 6.3, 30.5, 0, 5.5, 21.5, 0);
			tLine.addPoint(2.0, 12.8, 0, info.color, 1, 2.2, 15.6, 0, 1.8, 10.0, 0);
			tLine.addPoint(3.6, 4.7, 0, info.color, 1, 3.2, 7.7, 0, 4.1, 1.7, 0);
			tLine.addPoint(0, -1.6, 0, info.color, 1, 3.6, -1.6, 0, 0, 0, 0);
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
		ExampleHelper.setTextUI_LINE_BEZIER(RedGPU, tScene.children, true)
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
