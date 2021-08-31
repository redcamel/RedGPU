/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 18:59:49
 *
 */

"use strict";
import TypeSize from "../resources/TypeSize.js";
import BaseMaterial from "../base/BaseMaterial.js";
import ShareGLSL from "../base/ShareGLSL.js";
import Mix from "../base/Mix.js";

export default class ColorMaterial extends Mix.mix(
  BaseMaterial,
  Mix.color,
  Mix.alpha
) {
  static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 0 ) out float vMouseColorID;	
	layout( location = 1 ) out float vSumOpacity;
	void main() {
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
	
	}
	`;
  static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        vec4 color;
        float alpha;
    } fragmentUniforms;
	layout( location = 0 ) in float vMouseColorID;
	layout( location = 1 ) in float vSumOpacity;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;

	void main() {
		outColor = fragmentUniforms.color;
		outColor.a *= vSumOpacity;
		outColor.a *= fragmentUniforms.alpha;	
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
	`;
  static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};
  static uniformsBindGroupLayoutDescriptor_material = {
    entries: [
      {
        binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: {
          type: 'uniform',
        },
      }
    ]
  };
  static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
  static uniformBufferDescriptor_fragment = [
    {size: TypeSize.float32x4, valueName: 'colorRGBA'},
    {size: TypeSize.float32, valueName: 'alpha'}
  ];


  constructor(redGPUContext, color = '#ff0000', colorAlpha = 1) {
    super(redGPUContext);
    this.color = color;
    this.colorAlpha = colorAlpha;
    this.needResetBindingInfo = true;
  }

  resetBindingInfo() {
    this.entries = [
      {
        binding: 0,
        resource: {
          buffer: this.uniformBuffer_fragment.GPUBuffer,
          offset: 0,
          size: this.uniformBufferDescriptor_fragment.size
        }
      }
    ];
    this._afterResetBindingInfo();
  }
}
