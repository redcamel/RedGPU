/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.8 22:30:15
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
		let tMesh, tGeometry, tMaterial;
		tGeometry = new RedGPU.Sphere(this, 1, 32, 32, 32);
		tMaterial = new RedGPU.RefractionMaterial(this);
		tMaterial.diffuseTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_col.jpg');
		tMaterial.refractionTexture = new RedGPU.BitmapCubeTexture(
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
		tMaterial.normalTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_nrm.jpg');
		tMaterial.specularTexture = new RedGPU.BitmapTexture(this, '../../../assets/specular.png');
		tMaterial.emissiveTexture = new RedGPU.BitmapTexture(this, '../../../assets/emissive.jpg');
		tMaterial.displacementTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_disp.jpg');
		tMesh = new RedGPU.Mesh(
			this,
			tGeometry,
			tMaterial
		);
		tScene.addChild(tMesh);
		///////////////////////////////////////////////////////////////////////////////////////////
		renderer = new RedGPU.Render();
		// renderer setup
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_RefractionMaterial(RedGPU, this, tMaterial, true);
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
