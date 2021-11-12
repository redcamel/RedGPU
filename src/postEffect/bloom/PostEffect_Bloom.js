/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */

"use strict";
import BaseMaterial from "../../base/BaseMaterial.js";
import BasePostEffect from "../../base/BasePostEffect.js";
import PostEffect_GaussianBlur from "../blur/PostEffect_GaussianBlur.js";
import PostEffect_Threshold from "../adjustments/PostEffect_Threshold.js";
import PostEffect_Bloom_blend from "./PostEffect_Bloom_blend.js";
import ShareGLSL from "../../base/ShareGLSL.js";

export default class PostEffect_Bloom extends BasePostEffect {

  static vertexShaderGLSL = BasePostEffect.vertexShaderGLSL
  static fragmentShaderGLSL =BasePostEffect.fragmentShaderGLSL
  static PROGRAM_OPTION_LIST = {vertex: [], fragment: []};
  static uniformsBindGroupLayoutDescriptor_material = BasePostEffect.uniformsBindGroupLayoutDescriptor_material;
  static uniformBufferDescriptor_vertex = BaseMaterial.uniformBufferDescriptor_empty;
  static uniformBufferDescriptor_fragment = BaseMaterial.uniformBufferDescriptor_empty;
  #blurEffect;
  #blenderEffect;
  #thresholdEffect;
  #blur;
  #threshold;
  #exposure;
  #bloomStrength;

  constructor(redGPUContext) {
    super(redGPUContext);
    this.#thresholdEffect = new PostEffect_Threshold(redGPUContext);
    this.#blurEffect = new PostEffect_GaussianBlur(redGPUContext);
    this.#blenderEffect = new PostEffect_Bloom_blend(redGPUContext);
    this.blur = 20;
    this.threshold = 75;
    this.exposure = 1;
    this.bloomStrength = 1.2;
  }

  get blur() {return this.#blur;}

  set blur(value) {
    this.#blur = value;
    this.#blurEffect.radius = value;
  }

  get threshold() {return this.#threshold;}

  set threshold(value) {
    this.#threshold = value;
    this.#thresholdEffect.threshold = value;
  }

  get exposure() {return this.#exposure;}

  set exposure(value) {
    this.#exposure = value;
    this.#blenderEffect.exposure = value;
  }

  get bloomStrength() {return this.#bloomStrength;}

  set bloomStrength(value) {
    this.#bloomStrength = value;
    this.#blenderEffect.bloomStrength = value;
  }

  render(redGPUContext, redView, renderScene, sourceTextureView) {
    this.checkSize(redGPUContext, redView);
    this.#thresholdEffect.render(redGPUContext, redView, renderScene, sourceTextureView);
    this.#blurEffect.render(redGPUContext, redView, renderScene, this.#thresholdEffect.baseAttachmentView);
    this.#blenderEffect.blurTexture = this.#blurEffect.baseAttachmentView;
    this.#blenderEffect.render(redGPUContext, redView, renderScene, sourceTextureView);
    this.baseAttachment = this.#blenderEffect.baseAttachment;
    this.baseAttachmentView = this.#blenderEffect.baseAttachmentView;
  }
}
