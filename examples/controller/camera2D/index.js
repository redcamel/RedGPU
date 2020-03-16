/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */
"use strict"
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
		tCamera = new RedGPU.Camera2D(this);
		tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		///////////////////////////////////////////////////////////////////////////////////////////
		// Mesh setup
		var testTween = function (view, target) {
			var tScale = Math.random() * 32 + 6
			TweenMax.to(target, Math.random() * 2 + 1, {
				x: Math.random() * view.viewRect[2],
				y: Math.random() * view.viewRect[3],
				scaleX: tScale,
				scaleY: tScale,
				rotationZ: Math.random() * 360,
				ease: Ease.QuintInOut,
				onComplete: function () {
					testTween(view, this.target)
				}
			})
		}
		let tMesh, tGeometry, tMaterial;
		tGeometry = new RedGPU.Plane(this);
		tMaterial = new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, '../../../assets/UV_Grid_Sm.jpg'));
		let i = 5000;
		while(i--){


			tMesh = new RedGPU.Mesh(this, tGeometry, tMaterial);

			tMesh.setScale(100, 100, 1)
			tScene.addChild(tMesh);
			testTween(tView,tMesh)
		}


		tMaterial = new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, '../../../assets/crate.png'));
		tMesh = new RedGPU.Mesh(this, tGeometry, tMaterial);

		tMesh.setScale(200, 200, 1)
		tMesh.setPosition(100, 100, 0)
		tScene.addChild(tMesh);
		///////////////////////////////////////////////////////////////////////////////////////////
		// renderer setup
		renderer = new RedGPU.Render();
		render = time => {
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		// TestUI setup
		ExampleHelper.setTestUI_Camera2D(RedGPU, this, tMesh, true);
		ExampleHelper.setTestUI_Debugger(RedGPU);
	}
);
