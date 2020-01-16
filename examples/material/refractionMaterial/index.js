/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 18:59:49
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
		// Mesh setup
		let tMesh;
		let tChildMesh;
		tMesh = new RedGPU.Mesh(
			this,
			new RedGPU.Sphere(this, 1, 32, 32, 32),
			new RedGPU.RefractionMaterial(this)
		);
		tMesh.material.diffuseTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_col.jpg');
		tMesh.material.refractionTexture = new RedGPU.BitmapCubeTexture(
			this,
			[
				'../../../assets/cubemap/SwedishRoyalCastle/px.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/nx.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/py.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/ny.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/pz.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/nz.jpg'
			]
		);
		tMesh.material.normalTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_nrm.jpg');
		tMesh.material.specularTexture = new RedGPU.BitmapTexture(this, '../../../assets/specular.png');
		tMesh.material.emissiveTexture = new RedGPU.BitmapTexture(this, '../../../assets/emissive.jpg');
		tMesh.material.displacementTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_disp.jpg');
		tScene.addChild(tMesh);

		tChildMesh = new RedGPU.Mesh(
			this,
			new RedGPU.Sphere(this, 0.5, 32, 32, 32),
			new RedGPU.RefractionMaterial(this)
		);
		tChildMesh.material.diffuseTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_col.jpg');
		tChildMesh.material.refractionTexture = new RedGPU.BitmapCubeTexture(
			this,
			[
				'../../../assets/cubemap/SwedishRoyalCastle/px.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/nx.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/py.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/ny.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/pz.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/nz.jpg'
			]
		);
		tChildMesh.material.normalTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_nrm.jpg');
		tChildMesh.material.specularTexture = new RedGPU.BitmapTexture(this, '../../../assets/specular.png');
		tChildMesh.material.emissiveTexture = new RedGPU.BitmapTexture(this, '../../../assets/emissive.jpg');
		tChildMesh.material.displacementTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_disp.jpg');
		tChildMesh.x = 2;
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
		ExampleHelper.setTestUI_RefractionMaterial(RedGPU, this,tMesh, tMesh.material, true);
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
