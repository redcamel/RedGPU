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
		tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh setup
		let tMesh;
		let tChildMesh;
		tMesh = new RedGPU.Mesh(
			this,
			new RedGPU.Sphere(this, 1, 32, 32, 32),
			new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, '../../../assets/Brick03_col.jpg'), new RedGPU.BitmapTexture(this, '../../../assets/Brick03_col.jpg'))
		);
		tScene.addChild(tMesh);
		tChildMesh = new RedGPU.Mesh(
			this,
			new RedGPU.Sphere(this, 0.5, 32, 32, 32),
			new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, '../../../assets/Brick03_col.jpg'))
		);
		tChildMesh.x = 2;
		tMesh.addChild(tChildMesh);

		tMesh.renderDrawLayerIndex = RedGPU.Render.DRAW_LAYER_INDEX2_Z_POINT_SORT
		tChildMesh.renderDrawLayerIndex = RedGPU.Render.DRAW_LAYER_INDEX2_Z_POINT_SORT
		///////////////////////////////////////////////////////////////////////////////////////////
		// renderer setup
		renderer = new RedGPU.Render();
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_BitmapMaterial(RedGPU, this, tMesh, tMesh.material, true);
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
