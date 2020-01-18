/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.18 17:23:53
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
		tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////

		// PointLight setup
		tLight = new RedGPU.PointLight(this,'#ff0000')
		tLight.x = 3;
		tLight.y = 3;
		tLight.z = 3;
		tLight.radius = 5
		tScene.addLight(tLight)
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh setup
		let setMeshs = _ => {
			let tMaterial
			let MAX;
			let i, j;
			let tMesh;
			tMaterial = new RedGPU.StandardMaterial(this)
			tMaterial.diffuseTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_col.jpg');
			tMaterial.normalTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_nrm.jpg');
			tMaterial.specularTexture = new RedGPU.BitmapTexture(this, '../../../assets/specular.png');
			tMaterial.displacementTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_disp.jpg');
			i = j = MAX = 10;
			while (i--) {
				j = MAX
				while (j--) {
					tMesh = new RedGPU.Mesh(
						this,
						new RedGPU.Sphere(this, 1, 32, 32, 32),
						tMaterial
					);
					tScene.addChild(tMesh);
					tMesh.x = Math.sin(Math.PI * 2 / (MAX - 1) * i) * j * 3;
					tMesh.z = Math.cos(Math.PI * 2 / (MAX - 1) * i) * j * 3;
				}
			}
		}
		setMeshs()
		///////////////////////////////////////////////////////////////////////////////////////////
		// renderer setup
		renderer = new RedGPU.Render();
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_PointLight(RedGPU, tScene, tLight, true);
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
