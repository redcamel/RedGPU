/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 17:46:58
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
		// light setup
		tLight = new RedGPU.DirectionalLight(this)
		tLight.x = 5;
		tLight.y = 5;
		tLight.z = 5;
		tScene.addLight(tLight)
		tLight = new RedGPU.DirectionalLight(this)
		tLight.x = -5;
		tLight.y = -5;
		tLight.z = -5;
		tScene.addLight(tLight)
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh setup
		let tGeometry;
		const diffuseTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_col.jpg');
		const normalTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_nrm.jpg');
		const specularTexture = new RedGPU.BitmapTexture(this, '../../../assets/specular.png');
		const emissiveTexture = new RedGPU.BitmapTexture(this, '../../../assets/emissive.jpg');
		const displacementTexture = new RedGPU.BitmapTexture(this, '../../../assets/Brick03_disp.jpg');
		const environmentTexture = new RedGPU.BitmapCubeTexture(
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
		tGeometry = new RedGPU.Sphere(this, 1, 16, 16, 16);
		let makeTestObject = (key, index, useFlatMode, distance) => {
			let tMaterial;
			let tMesh;
			tMaterial = new RedGPU[key](this);
			tMaterial.useFlatMode = useFlatMode;
			if (tMaterial.hasOwnProperty('_diffuseTexture')) tMaterial.diffuseTexture = diffuseTexture;
			if (tMaterial.hasOwnProperty('_normalTexture')) tMaterial.normalTexture = normalTexture;
			if (tMaterial.hasOwnProperty('_specularTexture')) tMaterial.specularTexture = specularTexture;
			if (tMaterial.hasOwnProperty('_emissiveTexture')) tMaterial.emissiveTexture = emissiveTexture;
			if (tMaterial.hasOwnProperty('_displacementTexture')) tMaterial.displacementTexture = displacementTexture;
			if (tMaterial.hasOwnProperty('_environmentTexture')) tMaterial.environmentTexture = environmentTexture;
			if (tMaterial.hasOwnProperty('_refractionTexture')) tMaterial.refractionTexture = environmentTexture;
			tMesh = new RedGPU.Mesh(
				this,
				tGeometry,
				tMaterial
			);
			tScene.addChild(tMesh);
			tMesh.x = Math.sin(Math.PI * 2 / 5 * index) * distance
			tMesh.z = Math.cos(Math.PI * 2 / 5 * index) * distance
			let tText = new RedGPU.Text(this, 512)
			tText.color = '#fff'
			tText.fontSize = 36;
			tText.lineHeight = 28;
			tText.setScale(7, 7, 7)
			tText.text = key + `<span style="font-size: 26px"><br>useFlatMode = <span style="color:red">${useFlatMode}</span></span>`
			tText.y = 1.2
			tText.useSprite3DMode = true;
			// tText.useFixedScale = true;
			tMesh.addChild(tText)
		};
		['ColorPhongMaterial', 'ColorPhongTextureMaterial', 'StandardMaterial', 'EnvironmentMaterial', 'RefractionMaterial'].forEach((key, index) => {
			makeTestObject(key, index, true, 2.5)
			makeTestObject(key, index, false, 5)
		});

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
