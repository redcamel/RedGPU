/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */
import TypeSize from "../resources/TypeSize.js";
import BaseMaterial from "../base/BaseMaterial.js";
import ShareGLSL from "../base/ShareGLSL.js";
import Mix from "../base/Mix.js";
import RedGPUContext from "../RedGPUContext.js";

let float1_Float32Array = new Float32Array(1);
export default class EnvironmentMaterial extends Mix.mix(
  BaseMaterial,
  Mix.diffuseTexture,
  Mix.normalTexture,
  Mix.specularTexture,
  Mix.emissiveTexture,
  Mix.environmentTexture,
  Mix.displacementTexture,
  Mix.basicLightPropertys,
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
	layout( location = 2 ) out vec4 vVertexPosition;
	layout( location = 3 ) out float vMouseColorID;
	layout( location = 4 ) out float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 0 ) uniform VertexUniforms {
        float displacementFlowSpeedX;
        float displacementFlowSpeedY;
        float displacementPower;
		float __displacementTextureRenderYn;
    } vertexUniforms;

	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 1 ) uniform sampler uDisplacementSampler;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 2 ) uniform texture2D uDisplacementTexture;
	void main() {
		vVertexPosition = meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position, 1.0);
		vNormal = (meshMatrixUniforms.normalMatrix[ int(meshUniforms.index) ] * vec4(normal,1.0)).xyz;
		vUV = uv;
		vMouseColorID = meshUniforms.mouseColorID;
		vSumOpacity = meshUniforms.sumOpacity;
		if(vertexUniforms.__displacementTextureRenderYn == TRUTHY) vVertexPosition.xyz += ${ShareGLSL.GLSL_SystemUniforms_vertex.calcDisplacement('vNormal', 'vertexUniforms.displacementFlowSpeedX', 'vertexUniforms.displacementFlowSpeedY', 'vertexUniforms.displacementPower', 'uv', 'uDisplacementTexture', 'uDisplacementSampler')}
		gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * vVertexPosition;


	}
	`;
  static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_fragment.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_fragment.cotangent_frame}
	${ShareGLSL.GLSL_SystemUniforms_fragment.perturb_normal}
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 3 ) uniform FragmentUniforms {
        float normalPower;
        float shininess;
        float specularPower;
	    vec4 specularColor;
	    float emissivePower;
	    float environmentPower;
	    float alpha;
	    float useFlatMode;
	    //
	    float __diffuseTextureRenderYn;
		float __environmentTextureRenderYn;
		float __normalTextureRenderYn;
		float __specularTextureRenderYn;
		float __emissiveTextureRenderYn;
    } fragmentUniforms;

	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( location = 2 ) in vec4 vVertexPosition;
	layout( location = 3 ) in float vMouseColorID;
	layout( location = 4 ) in float vSumOpacity;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 4 ) uniform sampler uDiffuseSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 5 ) uniform texture2D uDiffuseTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 6 ) uniform sampler uNormalSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 7 ) uniform texture2D uNormalTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 8 ) uniform sampler uSpecularSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 9 ) uniform texture2D uSpecularTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 10 ) uniform sampler uEmissiveSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 11 ) uniform texture2D uEmissiveTexture;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 12 ) uniform sampler uEnvironmentSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 13 ) uniform textureCube uEnvironmentTexture;
	layout( location = 0 ) out vec4 outColor;
	layout( location = 1 ) out vec4 out_MouseColorID_Depth;
	void main() {
		float testAlpha = 0.0;
		vec4 diffuseColor = vec4(0.0);
		if(fragmentUniforms.__diffuseTextureRenderYn == TRUTHY) diffuseColor = texture(sampler2D(uDiffuseTexture, uDiffuseSampler), vUV) ;


	    vec3 N = normalize(vNormal);
		vec4 normalColor = vec4(0.0);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) normalColor = texture(sampler2D(uNormalTexture, uNormalSampler), vUV) ;
		if(fragmentUniforms.useFlatMode == TRUTHY) N = getFlatNormal(vVertexPosition.xyz);
		if(fragmentUniforms.__normalTextureRenderYn == TRUTHY) N = perturb_normal(N, vVertexPosition.xyz, vUV, normalColor.rgb, fragmentUniforms.normalPower) ;

		if(fragmentUniforms.__environmentTextureRenderYn == TRUTHY) {
			vec3 R = reflect( vVertexPosition.xyz - systemUniforms.cameraPosition, N);
			vec4 reflectionColor = texture(samplerCube(uEnvironmentTexture,uEnvironmentSampler), R);
			diffuseColor = mix(diffuseColor, reflectionColor, fragmentUniforms.environmentPower);
		}

		testAlpha = diffuseColor.a ;

		float specularTextureValue = 1.0;
		if(fragmentUniforms.__specularTextureRenderYn == TRUTHY) specularTextureValue = texture(sampler2D(uSpecularTexture, uSpecularSampler), vUV).r ;

		vec4 finalColor =
		calcDirectionalLight(
			diffuseColor,
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
			diffuseColor,
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

		if(fragmentUniforms.__emissiveTextureRenderYn == TRUTHY) {
			vec4 emissiveColor = texture(sampler2D(uEmissiveTexture, uEmissiveSampler), vUV);
			finalColor.rgb += emissiveColor.rgb * fragmentUniforms.emissivePower;
		}


		finalColor.a = testAlpha;
		outColor = finalColor;
		outColor.a *= fragmentUniforms.alpha * vSumOpacity;

		out_MouseColorID_Depth = vec4(vMouseColorID, gl_FragCoord.z/gl_FragCoord.w, 0.0, 0.0);

	}
`;
  static PROGRAM_OPTION_LIST = {
    // vertex: ['displacementTexture'],
    // fragment: ['diffuseTexture', 'emissiveTexture', 'environmentTexture', 'normalTexture', 'specularTexture', 'useFlatMode']
    vertex: [],
    fragment: []
  };
  static uniformsBindGroupLayoutDescriptor_material = {
    entries: [
      {
        binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {
          type: 'uniform',
        },
      },
      {
        binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {
          type: 'filtering',
        },
      },
      {
        binding: 2, visibility: GPUShaderStage.VERTEX, texture: {
          type: "float"
        }
      },
      {
        binding: 3, visibility: GPUShaderStage.FRAGMENT, buffer: {
          type: 'uniform',
        },
      },
      {
        binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: {
          type: 'filtering',
        },
      },
      {
        binding: 5, visibility: GPUShaderStage.FRAGMENT, texture: {
          type: "float"
        }
      },
      {
        binding: 6, visibility: GPUShaderStage.FRAGMENT, sampler: {
          type: 'filtering',
        },
      },
      {
        binding: 7, visibility: GPUShaderStage.FRAGMENT, texture: {
          type: "float"
        }
      },
      {
        binding: 8, visibility: GPUShaderStage.FRAGMENT, sampler: {
          type: 'filtering',
        },
      },
      {
        binding: 9, visibility: GPUShaderStage.FRAGMENT, texture: {
          type: "float"
        }
      },
      {
        binding: 10, visibility: GPUShaderStage.FRAGMENT, sampler: {
          type: 'filtering',
        },
      },
      {
        binding: 11, visibility: GPUShaderStage.FRAGMENT, texture: {
          type: "float"
        }
      },
      {
        binding: 12, visibility: GPUShaderStage.FRAGMENT, sampler: {
          type: 'filtering',
        },
      },
      {
        binding: 13, visibility: GPUShaderStage.FRAGMENT, texture: {
           viewDimension: 'cube'
        }
      }
    ]
  };
  static uniformBufferDescriptor_vertex = [
    {size: TypeSize.float32, valueName: 'displacementFlowSpeedX'},
    {size: TypeSize.float32, valueName: 'displacementFlowSpeedY'},
    {size: TypeSize.float32, valueName: 'displacementPower'},
    {size: TypeSize.float32, valueName: '__displacementTextureRenderYn'}
  ];
  static uniformBufferDescriptor_fragment = [
    {size: TypeSize.float32, valueName: 'normalPower'},
    {size: TypeSize.float32, valueName: 'shininess'},
    {size: TypeSize.float32, valueName: 'specularPower'},
    {size: TypeSize.float32x4, valueName: 'specularColorRGBA'},
    {size: TypeSize.float32, valueName: 'emissivePower'},
    {size: TypeSize.float32, valueName: 'environmentPower'},
    {size: TypeSize.float32, valueName: 'alpha'},
    {size: TypeSize.float32, valueName: 'useFlatMode'},
    //
    {size: TypeSize.float32, valueName: '__diffuseTextureRenderYn'},
    {size: TypeSize.float32, valueName: '__environmentTextureRenderYn'},
    {size: TypeSize.float32, valueName: '__normalTextureRenderYn'},
    {size: TypeSize.float32, valueName: '__specularTextureRenderYn'},
    {size: TypeSize.float32, valueName: '__emissiveTextureRenderYn'}
  ];
  #raf;

  constructor(redGPUContext, diffuseTexture, environmentTexture, normalTexture, specularTexture, emissiveTexture, displacementTexture) {
    super(redGPUContext);
    this.diffuseTexture = diffuseTexture;
    this.environmentTexture = environmentTexture;
    this.normalTexture = normalTexture;
    this.emissiveTexture = emissiveTexture;
    this.specularTexture = specularTexture;
    this.displacementTexture = displacementTexture;
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
          case 'normalTexture' :
            this._normalTexture = texture;
            tKey = textureName;
            break;
          case 'specularTexture' :
            this._specularTexture = texture;
            tKey = textureName;
            break;
          case 'emissiveTexture' :
            this._emissiveTexture = texture;
            tKey = textureName;
            break;
          case 'environmentTexture' :
            this._environmentTexture = texture;
            tKey = textureName;
            break;
          case 'displacementTexture' :
            this._displacementTexture = texture;
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
        // cancelAnimationFrame(this.#raf);
        // this.#raf = requestAnimationFrame(_ => {this.needResetBindingInfo = true})
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
          buffer: this.uniformBuffer_vertex.GPUBuffer,
          offset: 0,
          size: this.uniformBufferDescriptor_vertex.size
        }
      },
      {
        binding: 1,
        resource: this._displacementTexture ? this._displacementTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
      },
      {
        binding: 2,
        resource: this._displacementTexture ? this._displacementTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
      },
      {
        binding: 3,
        resource: {
          buffer: this.uniformBuffer_fragment.GPUBuffer,
          offset: 0,
          size: this.uniformBufferDescriptor_fragment.size
        }
      },
      {
        binding: 4,
        resource: this._diffuseTexture ? this._diffuseTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
      },
      {
        binding: 5,
        resource: this._diffuseTexture ? this._diffuseTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
      },
      {
        binding: 6,
        resource: this._normalTexture ? this._normalTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
      },
      {
        binding: 7,
        resource: this._normalTexture ? this._normalTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
      },
      {
        binding: 8,
        resource: this._specularTexture ? this._specularTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
      },
      {
        binding: 9,
        resource: this._specularTexture ? this._specularTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
      },
      {
        binding: 10,
        resource: this._emissiveTexture ? this._emissiveTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
      },
      {
        binding: 11,
        resource: this._emissiveTexture ? this._emissiveTexture._GPUTextureView : this.redGPUContext.state.emptyTextureView
      },
      {
        binding: 12,
        resource: this._environmentTexture ? this._environmentTexture.sampler.GPUSampler : this.redGPUContext.state.emptySampler.GPUSampler
      },
      {
        binding: 13,
        resource: this._environmentTexture ? this._environmentTexture._GPUTextureView : this.redGPUContext.state.emptyCubeTextureView
      }
    ];
    this._afterResetBindingInfo();
  }
}
