/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.6 19:2:34
 *
 */

import RedGPU from "../src/RedGPU.js";
import RedRender from "../src/renderer/RedRender.js";
import RedScene from "../src/RedScene.js";
import RedObitController from "../src/controller/RedObitController.js";
import RedView from "../src/RedView.js";
import RedMesh from "../src/object3D/RedMesh.js";
import RedBaseMaterial from "../src/base/RedBaseMaterial.js";
import RedShareGLSL from "../src/base/RedShareGLSL.js";
import RedGeometry from "../src/geometry/RedGeometry.js";
import RedBuffer from "../src/buffer/RedBuffer.js";
import RedInterleaveInfo from "../src/geometry/RedInterleaveInfo.js";



/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.29 12:46:41
 *
 */

"use strict";

// define testMaterial
class TestMaterial extends RedBaseMaterial {
	static vertexShaderGLSL = `
	#version 460
	${RedShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    layout(set=2,binding = 0) uniform Uniforms {
        mat4 modelMatrix;
    } uniforms;
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec4 vertexColor;
	layout(location = 0) out vec4 vVertexColor;

	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * uniforms.modelMatrix* vec4(position,1.0);
		vVertexColor = vertexColor;
	}
	`;
	static fragmentShaderGLSL = `
	#version 460
	layout(location = 0) in vec4 vVertexColor;
	layout(location = 0) out vec4 outColor;
	void main() {
		outColor = vVertexColor;
	}
	`;
	static PROGRAM_OPTION_LIST = [];
	static uniformsBindGroupLayoutDescriptor_material = {
		bindings: [

		]
	};
	static uniformBufferDescriptor_vertex = RedBaseMaterial.uniformBufferDescriptor_empty;
	static uniformBufferDescriptor_fragment = RedBaseMaterial.uniformBufferDescriptor_empty;

	constructor(redGPU) {
		super(redGPU);
		this.resetBindingInfo()
	}
	resetBindingInfo() {
		this.bindings = [

		];
		this._afterResetBindingInfo();
	}
}

(async function () {
	const cvs = document.createElement('canvas');
	const glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.9/dist/web-devel/glslang.js');
	document.body.appendChild(cvs);
	const glslang = await glslangModule.default();

	let redGPU = new RedGPU(cvs, glslang,
		function (v,reason) {

			if(!v){
				console.log('reason',reason)
				return alert(reason || `WebGPU is unsupported, or no adapters or devices are available.`)
			}
			let tView;
			let tScene = new RedScene();
			let tCamera = new RedObitController(this);
			let tMesh;
			tView = new RedView(this, tScene, tCamera);
			redGPU.addView(tView);

			let interleaveData = new Float32Array(
				[
					// x,   y,   z,    r,   g,   b
					-0.5, 0.5, 0.0,  1.0, 0.0, 0.0,  0.0, 0.0, // v0
					0.5, 0.5, 0.0,  0.0, 1.0, 0.0,  0.0, 0.0, // v1
					-0.5,-0.5, 0.0,  0.0, 0.0, 1.0,  0.0, 0.0, // v2
					0.5,-0.5, 0.0,  1.0, 1.0, 0.0,  0.0, 0.0  // v3
				]
			);
			let indexData = new Uint16Array(
				[
					2, 1, 0, // v2-v1-v0
					2, 3, 1  // v2-v3-v1
				]
			);
			let geometry = new RedGeometry(
				redGPU,
				new RedBuffer(
					redGPU,
					'interleaveBuffer',
					RedBuffer.TYPE_VERTEX,
					new Float32Array(interleaveData),
					[
						// TODO: Investigate how to set the vertex color
						new RedInterleaveInfo('vertexPosition', 'float3'),
						new RedInterleaveInfo('vertexColor', 'float3'),
						new RedInterleaveInfo('texcoord', 'float2')
					]
				),
				new RedBuffer(
					redGPU,
					'indexBuffer',
					RedBuffer.TYPE_INDEX,
					new Uint32Array(indexData)
				)
			);

			tMesh = new RedMesh(redGPU,geometry, new TestMaterial(redGPU))
			tScene.addChild(tMesh)
			let renderer = new RedRender();
			let render = function (time) {
				renderer.render(time, redGPU);
				requestAnimationFrame(render);
			};
			requestAnimationFrame(render);

		}
	);
})()