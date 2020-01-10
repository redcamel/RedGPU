/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.10 17:50:10
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
		let self = this;
		new RedGPU.TextureLoader(this,
			[
				'../../../assets/Brick03_col.jpg',
				'../../../assets/Brick03_nrm.jpg',
				'../../../assets/specular.png',
				'../../../assets/emissive.jpg',
				'../../../assets/Brick03_disp.jpg',
				[
					'../../../assets/cubemap/SwedishRoyalCastle/px.jpg',
					'../../../assets/cubemap/SwedishRoyalCastle/nx.jpg',
					'../../../assets/cubemap/SwedishRoyalCastle/py.jpg',
					'../../../assets/cubemap/SwedishRoyalCastle/ny.jpg',
					'../../../assets/cubemap/SwedishRoyalCastle/pz.jpg',
					'../../../assets/cubemap/SwedishRoyalCastle/nz.jpg'
				]
			],
			function(){
				const diffuseTexture = this.getTextureByIndex(0);
				const normalTexture = this.getTextureByIndex(1);
				const specularTexture = this.getTextureByIndex(2);
				const emissiveTexture = this.getTextureByIndex(3);
				const displacementTexture = this.getTextureByIndex(4);
				const environmentTexture = this.getTextureByIndex(5);
				tGeometry = new RedGPU.Sphere(self, 1, 16, 16, 16);
				let makeTestObject = (key, index, useFlatMode, distance) => {
					let tMaterial;
					let tMesh;
					tMaterial = new RedGPU[key](self);
					tMaterial.useFlatMode = useFlatMode;
					if (tMaterial.hasOwnProperty('_diffuseTexture')) tMaterial.diffuseTexture = diffuseTexture;
					if (tMaterial.hasOwnProperty('_normalTexture')) tMaterial.normalTexture = normalTexture;
					if (tMaterial.hasOwnProperty('_specularTexture')) tMaterial.specularTexture = specularTexture;
					if (tMaterial.hasOwnProperty('_emissiveTexture')) tMaterial.emissiveTexture = emissiveTexture;
					if (tMaterial.hasOwnProperty('_displacementTexture')) tMaterial.displacementTexture = displacementTexture;
					if (tMaterial.hasOwnProperty('_environmentTexture')) tMaterial.environmentTexture = environmentTexture;
					if (tMaterial.hasOwnProperty('_refractionTexture')) tMaterial.refractionTexture = environmentTexture;
					tMesh = new RedGPU.Mesh(
						self,
						tGeometry,
						tMaterial
					);
					tScene.addChild(tMesh);
					tMesh.x = Math.sin(Math.PI * 2 / 5 * index) * distance
					tMesh.z = Math.cos(Math.PI * 2 / 5 * index) * distance
					let tText = new RedGPU.Text(self, 512)
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
			}
		)

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
