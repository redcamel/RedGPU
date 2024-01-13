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
		tCamera.distance = 1.5;
		tCamera.speedDistance = 0.05;
		tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Text setup

		let tText;
		tText = new RedGPU.Text(this, 512, 1024);
		tText.setScale(0.5, 0.5, 0.5);
		tText.text = `RedGPU - Text Instance
		<br>br Tag ==> Empty DIV<br>
		hr Tag is not allow
		<pre>pre test      test pre</pre>
		<h1 style="color:#fff">My First Heading</h1>
		<h2 style="color:red">Heading 2</h2><h3 style="color:#fff">Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><h6>Heading 6</h6>
		<p>My first paragraph.</p>
		<ul><li>Coffee</li><li>Tea</li><li>Milk</li></ul>
		<button>this is Button</button><br>
		<img src="../../../assets/crate.png">
		`;
		tText.fontSize = 30
		tText.color = '#fff';
		tText.background = 'rgba(91, 82, 170,0.5)';
		tScene.addChild(tText);

		///////////////////////////////////////////////////////////////////////////////////////////
		renderer = new RedGPU.Render();
		// renderer setup
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_Text(RedGPU, this, tText, true);
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
