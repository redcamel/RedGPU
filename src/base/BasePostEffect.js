/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 14:41:31
 *
 */

"use strict";
import BaseMaterial from "../base/BaseMaterial.js";
import Mix from "./Mix.js";
import Mesh from "../object3D/Mesh.js";
import Plane from "../primitives/Plane.js";
import Render from "../renderer/Render.js";
import PipelinePostEffect from "./pipeline/PipelinePostEffect.js";
import Sampler from "../resources/Sampler.js";
import ShareGLSL from "./ShareGLSL";

export default class BasePostEffect extends Mix.mix(
  BaseMaterial
) {
  static vertexShaderGLSL = `
  ${ShareGLSL.GLSL_VERSION}
  void main() {
      gl_Position = vec4(0.0);
  }
 `;

  static fragmentShaderGLSL = `
  ${ShareGLSL.GLSL_VERSION}
  void main() {
  } `;
  static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};
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
      },
      {
        binding: 3, visibility: GPUShaderStage.VERTEX, buffer: {
          type: 'uniform',
        },
      },
    ]
  };
  static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
  static uniformBufferDescriptor_fragment = BaseMaterial.uniformBufferDescriptor_empty;

  #prevViewRect = [];
  baseAttachment;
  baseAttachmentView;

  constructor(redGPUContext) {
    super(redGPUContext);
    this.quad = new Mesh(redGPUContext, new Plane(redGPUContext), this);
    this.quad.pipeline = new PipelinePostEffect(redGPUContext, this.quad);
    this.sampler = new Sampler(redGPUContext, {
      magFilter: "linear",
      minFilter: "linear",
      mipmapFilter: "linear",
      addressModeU: "clamp-to-edge",
      addressModeV: "clamp-to-edge",
      addressModeW: "repeat"
    });
  }

  checkSize(redGPUContext, redView) {
    if ([this.#prevViewRect[2], this.#prevViewRect[3]].toString() != [redView.viewRect[2], redView.viewRect[3]].toString()) {
      if (this.baseAttachment) this.baseAttachment.destroy();
      this.#prevViewRect = redView.viewRect.concat();
      this.baseAttachment = redGPUContext.device.createTexture({
        size: {
          width: redView.viewRect[2],
          height: redView.viewRect[3],
          depthOrArrayLayers: 1
        },
        sampleCount: 1,
        format: redGPUContext.swapChainFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING
      });
      this.baseAttachmentView = this.baseAttachment.createView();
      return true;
    }
  }

  render(redGPUContext, redView, renderScene, sourceTextureView) {
    let result = this.checkSize(redGPUContext, redView);

    const commandEncoder_effect = redGPUContext.device.createCommandEncoder();
    const passEncoder_effect = commandEncoder_effect.beginRenderPass(
      {
        colorAttachments: [{
          view: this.baseAttachmentView,
          loadValue: {r: 0, g: 0, b: 0, a: 0},

        }]
      }
    );
    let t0 = this.sourceTexture === sourceTextureView;
    this.sourceTexture = sourceTextureView;
    if (!t0) this.resetBindingInfo();
    if (result) {
      this.quad.pipeline.update(redGPUContext, redView);
    }

    Render.clearStateCache();
    redView.updateSystemUniform(passEncoder_effect, redGPUContext);
    renderScene(redGPUContext, redView, passEncoder_effect, [this.quad]);
    passEncoder_effect.endPass();
    redGPUContext.device.queue.submit([commandEncoder_effect.finish()]);
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
      {binding: 1, resource: this.sampler.GPUSampler},
      {binding: 2, resource: this.sourceTexture},
      {
        binding: 3,
        resource: {
          buffer: this.uniformBuffer_vertex.GPUBuffer,
          offset: 0,
          size: this.uniformBufferDescriptor_vertex.size
        }
      },
    ];
    this._afterResetBindingInfo();
  }
}
