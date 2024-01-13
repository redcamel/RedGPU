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
		let tView1, tView2, tScene, tCamera, tLight;
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
		tCamera.distance = 20;
		tView1 = new RedGPU.View(this, tScene, tCamera);
		tView1.setSize('50%', '100%');
		this.addView(tView1);
		tView2 = new RedGPU.View(this, tScene, tCamera);
		tView2.setSize('50%', '100%');
		tView2.setLocation('50%', '0%');
		this.addView(tView2);
		///////////////////////////////////////////////////////////////////////////////////////////
		// light setup
		tLight = new RedGPU.DirectionalLight(this)
		tLight.x = 5;
		tLight.y = 5;
		tLight.z = 5;
		tScene.addLight(tLight)
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh
		let self = this
		new RedGPU.TextureLoader(this,
			[
				'../../../assets/Brick03_col.jpg',
				'../../../assets/Brick03_nrm.jpg',
				'../../../assets/specular.png',
				'../../../assets/emissive.jpg',
				'../../../assets/Brick03_disp.jpg'
			],
			function () {
				const diffuseTexture = this.getTextureByIndex(0);
				const normalTexture = this.getTextureByIndex(1);
				const specularTexture = this.getTextureByIndex(2);
				const emissiveTexture = this.getTextureByIndex(3);
				const displacementTexture = this.getTextureByIndex(4);
				let i = 1000;
				let tMaterial = new RedGPU.StandardMaterial(self, diffuseTexture, normalTexture, specularTexture, emissiveTexture, displacementTexture);
				tMaterial.normalPower = 2
				let setMeshs = function () {
					let MAX;
					let i, j;
					let tMesh;
					i = j = MAX = 10;
					while (i--) {
						j = MAX
						while (j--) {
							tMesh = new RedGPU.Mesh(
								self,
								new RedGPU.Sphere(self, 1, 32, 32, 32),
								tMaterial
							);
							tScene.addChild(tMesh);
							tMesh.x = Math.sin(Math.PI * 2 / (MAX - 1) * i) * j * 3;
							tMesh.z = Math.cos(Math.PI * 2 / (MAX - 1) * i) * j * 3;
						}
					}
				};
				setMeshs()
			}
		);
		///////////////////////////////////////////////////////////////////////////////////////////
		// renderer setup
		renderer = new RedGPU.Render();
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);
		ExampleHelper.setTestUI_Debugger(RedGPU);
		// PostEffect & TestUI setup
		let effect = new RedGPU.PostEffect_BlurX(this)
		tView1.postEffect.addEffect(effect)
		ExampleHelper.setTestUI_PostEffectBy(RedGPU, 'PostEffect_BlurX', tView1, effect);
	}
);
