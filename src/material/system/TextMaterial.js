/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 18:59:49
 *
 */

import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import Mix from "../../base/Mix.js";
import RedGPUContext from "../../RedGPUContext.js";
import TypeSize from "../../resources/TypeSize.js";

let float1_Float32Array = new Float32Array(1);
export default class TextMaterial extends Mix.mix(
  BaseMaterial,
  Mix.diffuseTexture,
  Mix.alpha
) {
  static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float width;
        float height;
    } vertexUniforms;
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( location = 2 ) out float vMouseColorID;
	layout( location = 3 ) out float vSumOpacity;
    ${ShareGLSL.GLSL_SystemUniforms_vertex.getSprite3DMatrix}
	void main() {
		float w = vertexUniforms.width ;
		float h = vertexUniforms.height ;
		mat4 modelMatrix = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ];
		mat4 targetMatrix;

		// 기본
		targetMatrix = modelMatrix * mat4( w / max( w, h ), 0.0, 0.0, 0.0,   0.0, h / max( w, h ), 0.0, 0.0,    0.0, 0.0, 1.0, 0.0,    0.0, 0.0, 0.0, 1.0 );
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * targetMatrix * vec4(position,1.0);

		// sprite3D
		//#RedGPU#useSprite3DMode#  targetMatrix = modelMatrix * mat4( w / systemUniforms.resolution.y, 0.0, 0.0, 0.0,    0.0, h / systemUniforms.resolution.y, 0.0, 0.0,    0.0, 0.0, 1.0, 0.0,    0.0, 0.0, 0.0, 1.0);
		//#RedGPU#useSprite3DMode#  gl_Position = systemUniforms.perspectiveMTX * getSprite3DMatrix( systemUniforms.cameraMTX, targetMatrix ) * vec4(position,1.0);


		//#RedGPU#useSprite3DMode#  //#RedGPU#useFixedScale#  gl_Position /= gl_Position.w;
		//#RedGPU#useSprite3DMode#  //#RedGPU#useFixedScale#  gl_Position.xy += position.xy * vec2((systemUniforms.perspectiveMTX * targetMatrix)[0][0],(systemUniforms.perspectiveMTX * targetMatrix)[1][1]);


		vNormal = normal;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
	}
	`;
  static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in float vMouseColorID;
	layout( location = 3 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform FragmentUniforms {
        float alpha;
    } fragmentUniforms;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform texture2D uDiffuseTexture;
	layout( location = 0 ) out vec4 outColor;

	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		vec4 diffuseColor = vec4(0.0);
		//#RedGPU#diffuseTexture# diffuseColor = texture(sampler2D(uDiffuseTexture, uSampler), vUV) ;
		// if(diffuseColor.a < 0.05) discard;
		outColor = diffuseColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;
		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);

	}
`;
  static PROGRAM_OPTION_LIST = {
    vertex: ['useFixedScale', 'useSprite3DMode'],
    fragment: ['diffuseTexture']
  };
  static uniformsBindGroupLayoutDescriptor_material = {
    entries: [
      {
        binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {
          type: 'uniform',
        },
      },
      {
        binding: 1, visibility: GPUShaderStage.FRAGMENT, buffer: {
          type: 'uniform',
        },
      },
      {
        binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {
          type: 'filtering',
        },
      },
      {
        binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: {
          type: "float"
        }
      }
    ]
  };
  static uniformBufferDescriptor_vertex = [
    {size: TypeSize.float32, valueName: 'width'},
    {size: TypeSize.float32, valueName: 'height'}

  ];
  static uniformBufferDescriptor_fragment = [
    {size: TypeSize.float32, valueName: 'alpha'}
  ];
  #useFixedScale = false;
  #useSprite3DMode = false;

  constructor(redGPUContext, diffuseTexture) {
    super(redGPUContext);
    this.diffuseTexture = diffuseTexture;
    this.needResetBindingInfo = true;
  }

  _width = 256;

  get width() {return this._width;}

  set width(value) {
    this._width = value;
    float1_Float32Array[0] = this._width;
    // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['width'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['width'], float1_Float32Array);
  }

  _height = 256;

  get height() {return this._height;}

  set height(value) {
    this._height = value;
    float1_Float32Array[0] = this._height;
    // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['height'], float1_Float32Array)
    this.redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['height'], float1_Float32Array);
  }

  get useFixedScale() {return this.#useFixedScale;}

  set useFixedScale(value) {
    this.#useFixedScale = value;
    this.needResetBindingInfo = true;
  }

  get useSprite3DMode() {return this.#useSprite3DMode;}

  set useSprite3DMode(value) {
    this.#useSprite3DMode = value;
    this.needResetBindingInfo = true;
  }

  checkTexture(texture, textureName) {
    if (texture) {
      if (texture._GPUTexture) {
        switch (textureName) {
          case 'diffuseTexture' :
            this._diffuseTexture = texture;
            break;
        }
        if (RedGPUContext.useDebugConsole) console.log("로딩완료or로딩에러확인 textureName", textureName, texture ? texture._GPUTexture : '');
        this.needResetBindingInfo = true;
      } else {
        texture.addUpdateTarget(this, textureName);
      }

    } else {
      if (this['_' + textureName]) {
        this['_' + textureName] = null;
        this.needResetBindingInfo = true;
      }
    }
  }

  resetBindingInfo() {
    this.entries = [
      {
        binding: 0,
        resource: {
          buffer: this.uniformBuffer_vertex.GPUBuffer,
          offset: 0,
          size: this.uniformBufferDescriptor_vertex.size
        }
      },
      {
        binding: 1,
        resource: {
          buffer: this.uniformBuffer_fragment.GPUBuffer,
          offset: 0,
          size: this.uniformBufferDescriptor_fragment.size
        }
      },
      {
        binding: 2,
        resource: this.redGPUContext.state.emptySampler.GPUSampler
      },
      {
        binding: 3,
        resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
      }
    ];
    this._afterResetBindingInfo();
  }
}
