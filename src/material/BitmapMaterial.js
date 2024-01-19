/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
"use strict";
import BaseMaterial from "../base/BaseMaterial.js";
import Mix from "../base/Mix.js";
import ShareGLSL from "../base/ShareGLSL.js";
import RedGPUContext from "../RedGPUContext.js";
import TypeSize from "../resources/TypeSize.js";

let float1_Float32Array = new Float32Array(1);
export default class BitmapMaterial extends Mix.mix(
  BaseMaterial,
  Mix.diffuseTexture,
  Mix.alpha
) {
  static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out float vMouseColorID;	
	layout( location = 3 ) out float vSumOpacity;
	void main() {
		vNormal = normal;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
	}
	`;
  static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	const float TRUTHY = 1.0;
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vMouseColorID;	
	layout( location = 3 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 0 ) uniform FragmentUniforms {
        float alpha;
        //
        float __diffuseTextureRenderYn;
    } fragmentUniforms;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		outColor = diffuseColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);
		
	}
`;
  static PROGRAM_OPTION_LIST = {
    vertex: [],
    fragment: []
    // vertex: [],
    // fragment: ['diffuseTexture']
  };
  static uniformsBindGroupLayoutDescriptor_material = {
    entries: [
      {
        binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: {
          type: 'uniform',
        },
      },
      {
        binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {
          type: 'filtering',
        },
      },
      {
        binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {
          type: "float"
        }
      }
    ]
  };
  static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
  static uniformBufferDescriptor_fragment = [
    {size: TypeSize.float32, valueName: 'alpha'},
    //
    {size: TypeSize.float32, valueName: '__diffuseTextureRenderYn'},
  ];

  constructor(redGPUContext, diffuseTexture) {
    super(redGPUContext);
    this.diffuseTexture = diffuseTexture;
    this.needResetBindingInfo = true;
  }

  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        let tKey;
        switch (textureName) {
          case 'diffuseTexture' :
            this._diffuseTexture = texture;
            tKey = textureName;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        if (tKey) {
          float1_Float32Array[0] = this[`__${textureName}RenderYn`] = 1;
          if (tKey == 'displacementTexture') {
            // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          } else {
            // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array)
            this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          }
        }
        this.needResetBindingInfo = true;
      } else {
        texture.addUpdateTarget(this, textureName);
      }
    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        float1_Float32Array[0] = this[`__${textureName}RenderYn`] = 0;
        if (textureName == 'displacementTexture') {
          // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
        } else {
          // this.uniformBuffer_fragment.GPUBuffer.setSubData(this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
          this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_fragment.GPUBuffer, this.uniformBufferDescriptor_fragment.redStructOffsetMap[`__${textureName}RenderYn`], float1_Float32Array);
        }
        this.needResetBindingInfo = true;
      }
    }
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
      },
      {
        binding: 1,
        resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
      },
      {
        binding: 2,
        resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
      }
    ];
    this._afterResetBindingInfo();
  }
}
