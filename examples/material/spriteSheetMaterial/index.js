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
		let tMesh,  tMaterial;
		tMaterial = new RedGPU.SpriteSheetMaterial(this);
		tMaterial.addAction(
			'walk', new RedGPU.SpriteSheetAction(
				new RedGPU.BitmapTexture(this, '../../../assets/sheet/actionTest/walk.png'),
				30, 8, 1, 8
			)
		);
		tMaterial.addAction(
			'attack', new RedGPU.SpriteSheetAction(
				new RedGPU.BitmapTexture(this, '../../../assets/sheet/actionTest/attack.png'),
				30, 6, 1, 6
			)
		);
		tMaterial.addAction(
			'jump', new RedGPU.SpriteSheetAction(
				new RedGPU.BitmapTexture(this, '../../../assets/sheet/actionTest/jump.png'),
				30, 8, 1, 8
			)
		);
		tMaterial.setAction('walk')
		tMesh = new RedGPU.Mesh(
			this,
			new RedGPU.Plane(this),
			tMaterial
		);
		tMesh.cullMode = 'none';
		tScene.addChild(tMesh);
		let tChildMesh = new RedGPU.Mesh(
			this,
			new RedGPU.Plane(this),
			new RedGPU.SpriteSheetMaterial(
				this,
				new RedGPU.SpriteSheetAction(
					new RedGPU.BitmapTexture(this, '../../../assets/sheet/spriteSheet.png'),
					30, 5, 3, 15
				)
			)
		);
		tChildMesh.cullMode = 'none';
		tChildMesh.x = -0.5
		tChildMesh.z = -1
		tMesh.addChild(tChildMesh);

		tMesh.renderDrawLayerIndex = RedGPU.Render.DRAW_LAYER_INDEX2_Z_POINT_SORT
		tChildMesh.renderDrawLayerIndex = RedGPU.Render.DRAW_LAYER_INDEX2_Z_POINT_SORT
		///////////////////////////////////////////////////////////////////////////////////////////
		renderer = new RedGPU.Render();
		// renderer setup
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_SpriteSheetMaterial(RedGPU, this, tMesh, tMesh.material, true);
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
