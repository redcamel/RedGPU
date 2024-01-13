/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:3:14
 *
 */

import BaseMaterial from "../../base/BaseMaterial.js";
import ShareGLSL from "../../base/ShareGLSL.js";
import BasePostEffect from "../../base/BasePostEffect.js";
import TypeSize from "../../resources/TypeSize.js";
import glMatrix from "../../base/gl-matrix-min.js";
import Render from "../Render.js";

export default class FinalRender extends BasePostEffect {
  static vertexShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	${ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
	${ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
	layout( location = 0 ) in vec3 position;
	layout( location = 1 ) in vec3 normal;
	layout( location = 2 ) in vec2 uv;
	layout( location = 0 ) out vec3 vNormal;
	layout( location = 1 ) out vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_VertexUniforms}, binding = 3 ) uniform VertexUniforms {
	    mat4 projectionMatrix;
        vec4 viewRect;
    } vertexUniforms;
	void main() {
		// gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
		gl_Position = vertexUniforms.projectionMatrix * vec4(position,1.0);

		vNormal = normal;
		vUV = uv;
	}
	`;
  static fragmentShaderGLSL = `
	${ShareGLSL.GLSL_VERSION}
	layout( location = 0 ) in vec3 vNormal;
	layout( location = 1 ) in vec2 vUV;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 1 ) uniform sampler uSampler;
	layout( set = ${ShareGLSL.SET_INDEX_FragmentUniforms}, binding = 2 ) uniform texture2D uSourceTexture;
	layout( location = 0 ) out vec4 outColor;
	void main() {
		vec4 diffuseColor = vec4(0.0);

		diffuseColor = texture( sampler2D( uSourceTexture, uSampler ), vUV ) ;
		// diffuseColor.a = 0.5;

		// diffuseColor.rgb = 1.0 - diffuseColor.rgb;
		outColor = diffuseColor;
	}
`;
  static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};
  static uniformsBindGroupLayoutDescriptor_material = BasePostEffect.uniformsBindGroupLayoutDescriptor_material;
  static uniformBufferDescriptor_vertex = [
    {size: TypeSize.mat4, valueName: 'projectionMatrix'},
    {size: TypeSize.float32x4, valueName: 'viewRect'}
  ];
  static uniformBufferDescriptor_fragment = BaseMaterial.uniformBufferDescriptor_empty;
  viewRect = new Float32Array(4);

  constructor(redGPUContext) {
    super(redGPUContext);
    this.projectionMatrix = glMatrix.mat4.create();
  }

  checkSize(redGPUContext, redView) {
    glMatrix.mat4.ortho(
      this.projectionMatrix,
      0., // left
      1., // right
      0., // bottom
      1., // top,
      -1000,
      1000
    );
    glMatrix.mat4.scale(
      this.projectionMatrix,
      this.projectionMatrix,
      [
        1 / parseInt(redGPUContext.canvas.style.width),
        1 / parseInt(redGPUContext.canvas.style.height),
        1
      ]
    );
    glMatrix.mat4.translate(
      this.projectionMatrix,
      this.projectionMatrix,
      [
        redView.getViewRect(redGPUContext)[2] / 2 + redView.getViewRect(redGPUContext)[0],
        parseInt(redGPUContext.canvas.style.height) - redView.getViewRect(redGPUContext)[3] / 2 - redView.getViewRect(redGPUContext)[1],
        0
      ]
    );

    glMatrix.mat4.scale(
      this.projectionMatrix,
      this.projectionMatrix,
      [
        redView.getViewRect(redGPUContext)[2],
        redView.getViewRect(redGPUContext)[3],
        1
      ]
    );
    // this.uniformBuffer_vertex.GPUBuffer.setSubData(this.uniformBufferDescriptor_vertex.redStructOffsetMap['projectionMatrix'], this.projectionMatrix);
    redGPUContext.device.queue.writeBuffer(this.uniformBuffer_vertex.GPUBuffer, this.uniformBufferDescriptor_vertex.redStructOffsetMap['projectionMatrix'], this.projectionMatrix);
    return true;
  }

  render(redGPUContext, redView, renderScene, sourceTextureView, passEncoder_effect) {
    let result = this.checkSize(redGPUContext, redView);
    let t0 = this.sourceTexture === sourceTextureView;
    this.sourceTexture = sourceTextureView;
    if (!t0) this.resetBindingInfo();
    if (result) {
      this.quad.pipeline.update(redGPUContext, redView);
    }

    Render.clearStateCache();
    redView.updateSystemUniform(passEncoder_effect, redGPUContext);
    renderScene(redGPUContext, redView, passEncoder_effect, [this.quad]);

  }
}
