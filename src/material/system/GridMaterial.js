/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 13:54:48
 *
 */

import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";

export default class GridMaterial extends BaseMaterial {

  static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec4 color;
	layout( location = 0 ) out vec4 vColor;

	void main() {
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
		vColor = color;
	}
	`;
  static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( location = 0 ) in vec4 vColor;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		outColor = vColor;
			out_MouseColorID_Depth = vec4(0.0);

	}
	`;
  static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};
  static uniformsBindGroupLayoutDescriptor_material = {entries: []};
  static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
  static uniformBufferDescriptor_fragment = BaseMaterial.uniformBufferDescriptor_empty;

  constructor(redGPUContext) {
    super(redGPUContext);
    this.needResetBindingInfo = true;
  }

  resetBindingInfo() {
    this.entries = [];
    this._afterResetBindingInfo();
  }
}
