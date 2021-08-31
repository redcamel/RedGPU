/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.24 19:45:8
 *
 */

"use strict";
import TypeSize from "../resources/TypeSize.js";
import ShareGLSL from "../base/ShareGLSL.js";

import Mix from "../base/Mix.js";
import BaseMaterial from "../base/BaseMaterial.js";

export default class ColorPhongMaterial extends Mix.mix(
  BaseMaterial,
  Mix.color,
  Mix.alpha,
  Mix.basicLightPropertys
) {

  static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec4 vVertexPosition;
	layout( location = 2 ) out float vMouseColorID;
	layout( location = 3 ) out float vSumOpacity;
	void main() {
		vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
		vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ] * vec4(normal,1.0)).xyz;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;
	}
	`;
  static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        vec4 color;
        float shininess; 
        float specularPower;
	    vec4 specularColor;
        float alpha;
        float useFlatMode;
        //
    } fragmentUniforms;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec4 vVertexPosition;
	layout( location = 2 ) in float vMouseColorID;	
	layout( location = 3 ) in float vSumOpacity;
	layout( location = 0 ) out vec4 outColor;	
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		float testAlpha = fragmentUniforms.color.a * vSumOpacity;

		vec3 N = normalize(vNormal);
		if(fragmentUniforms.useFlatMode == TRUTHY) N = getFlatNormal(vVertexPosition.xyz);
		
		float specularTextureValue = 1.0;
		
		vec4 finalColor = 
		calcDirectionalLight(
			fragmentUniforms.color,
			N,		
			systemUniforms.directionalLightCount,
			systemUniforms.directionalLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue
		)
		+
	    calcPointLight(
			fragmentUniforms.color,
			N,		
			systemUniforms.pointLightCount,
			systemUniforms.pointLightList,
			fragmentUniforms.shininess,
			fragmentUniforms.specularPower,
			fragmentUniforms.specularColor,
			specularTextureValue,
			vVertexPosition.xyz
		)
		+ la;
			
		finalColor.a = testAlpha;
		outColor = finalColor;
		outColor.a *= fragmentUniforms.alpha;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`;
  // static PROGRAM_OPTION_LIST = {vertex: [], fragment: ['useFlatMode']};
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
    {size: TypeSize.float32, valueName: 'shininess'},
    {size: TypeSize.float32, valueName: 'specularPower'},
    {
      size: TypeSize.float32x4,
      valueName: 'specularColorRGBA',
    },
    {size: TypeSize.float32, valueName: 'alpha'},
    {size: TypeSize.float32, valueName: 'useFlatMode'}
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
