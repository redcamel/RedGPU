/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.24 21:43:4
 *
 */
import RedGPU from "https://redcamel.github.io/RedGPU/src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);


new RedGPU.RedGPUContext(cvs,
	function () {
		let tScene = new RedGPU.Scene();
		tScene.backgroundColor = '#fff';

		let tCamera = new RedGPU.ObitController(this);
		let tView = new RedGPU.View(this, tScene, tCamera);
		this.addView(tView);
		tCamera.distance = 2;


		// Cube data
		//             1.0 y
		//              ^  -1.0
		//              | / z
		//              |/       x
		// -1.0 -----------------> +1.0
		//            / |
		//      +1.0 /  |
		//           -1.0
		//
		//         [7]------[6]
		//        / |      / |
		//      [3]------[2] |
		//       |  |     |  |
		//       | [4]----|-[5]
		//       |/       |/
		//      [0]------[1]
		//
		let interleaveData = new Float32Array(
			[
				// Front face
				-0.5, -0.5,  0.5,    0.0,  0.0,  1.0,   0.0, 0.0, // v0
				0.5, -0.5,  0.5,    0.0,  0.0,  1.0,   1.0, 0.0, // v1
				0.5,  0.5,  0.5,    0.0,  0.0,  1.0,   1.0, 1.0, // v2
				-0.5,  0.5,  0.5,    0.0,  0.0,  1.0,   0.0, 1.0, // v3
				// Back face
				-0.5, -0.5, -0.5,    0.0,  0.0, -1.0,   1.0, 0.0, // v4
				0.5, -0.5, -0.5,    0.0,  0.0, -1.0,   1.0, 1.0, // v5
				0.5,  0.5, -0.5,    0.0,  0.0, -1.0,   0.0, 1.0, // v6
				-0.5,  0.5, -0.5,    0.0,  0.0, -1.0,   0.0, 0.0, // v7
				// Top face
				0.5,  0.5,  0.5,    0.0,  1.0,  0.0,   0.0, 1.0, // v2
				-0.5,  0.5,  0.5,    0.0,  1.0,  0.0,   0.0, 0.0, // v3
				-0.5,  0.5, -0.5,    0.0,  1.0,  0.0,   1.0, 0.0, // v7
				0.5,  0.5, -0.5,    0.0,  1.0,  0.0,   1.0, 1.0, // v6
				// Bottom face
				-0.5, -0.5,  0.5,    0.0,  1.5,  0.0,   1.0, 1.0, // v0
				0.5, -0.5,  0.5,    0.0,  1.5,  0.0,   0.0, 1.0, // v1
				0.5, -0.5, -0.5,    0.0,  1.5,  0.0,   0.0, 0.0, // v5
				-0.5, -0.5, -0.5,    0.0,  1.5,  0.0,   1.0, 0.0, // v4
				// Right face
				0.5, -0.5,  0.5,    1.0,  0.0,  0.0,   1.0, 0.0, // v1
				0.5,  0.5,  0.5,    1.0,  0.0,  0.0,   1.0, 1.0, // v2
				0.5,  0.5, -0.5,    1.0,  0.0,  0.0,   0.0, 1.0, // v6
				0.5, -0.5, -0.5,    1.0,  0.0,  0.0,   0.0, 0.0, // v5
				// Left face
				-0.5, -0.5,  0.5,   -1.0,  0.0,  0.0,   0.0, 0.0, // v0
				-0.5,  0.5,  0.5,   -1.0,  0.0,  0.0,   1.0, 0.0, // v3
				-0.5,  0.5, -0.5,   -1.0,  0.0,  0.0,   1.0, 1.0, // v7
				-0.5, -0.5, -0.5,   -1.0,  0.0,  0.0,   0.0, 1.0  // v4
			]
		);
		let indexData = new Uint16Array(
			[
				0,  1,  2,    0,  2 , 3,  // Front face
				4,  5,  6,    4,  6 , 7,  // Back face
				8,  9, 10,    8, 10, 11,  // Top face
				12, 13, 14,   12, 14, 15,  // Bottom face
				16, 17, 18,   16, 18, 19,  // Right face
				20, 21, 22,   20, 22, 23   // Left face
			]
		);

		let geometry = new RedGPU.Geometry(
			this,
			new RedGPU.Buffer(
				this,
				'interleaveBuffer',
				RedGPU.Buffer.TYPE_VERTEX,
				new Float32Array(interleaveData),
				[
					new RedGPU.InterleaveInfo('vertexPosition', 'float3'),
					new RedGPU.InterleaveInfo('vertexNormal', 'float3'),
					new RedGPU.InterleaveInfo('texcoord', 'float2')
				]
			),
			new RedGPU.Buffer(
				this,
				'indexBuffer',
				RedGPU.Buffer.TYPE_INDEX,
				new Uint32Array(indexData)
			)
		);
		let texture = new RedGPU.BitmapTexture(this, 'https://cx20.github.io/webgpu-test/assets/textures/frog.jpg');
		let textureMat = new RedGPU.BitmapMaterial(this, texture);
		let tMesh = new RedGPU.Mesh(this, geometry, textureMat);
		tMesh.cullMode = 'none';
		tScene.addChild(tMesh);

		let renderer = new RedGPU.Render();
		let render =  (time)=> {
			tMesh.rotationX += 1;
			tMesh.rotationY += 1;
			tMesh.rotationZ += 1;
			renderer.render(time, this);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);


	}
)
