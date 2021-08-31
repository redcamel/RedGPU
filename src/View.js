/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */

"use strict";
import UTIL from "./util/UTIL.js";
import TypeSize from "./resources/TypeSize.js";
import ShareGLSL from "./base/ShareGLSL.js";
import PostEffect from "./postEffect/PostEffect.js";
import RedGPUContext from "./RedGPUContext.js";
import UUID from "./base/UUID.js";
import MouseEventChecker from "./renderer/system/MouseEventChecker.js";
import glMatrix from "./base/gl-matrix-min.js";

export default class View extends UUID {
  redGPUContext;
  #scene;
  #camera;
  projectionMatrix;
  #width = '100%';
  #height = '100%';
  #viewRect = [];
  //
  systemUniformInfo_vertex;
  systemUniformInfo_fragment;
  #systemUniformInfo_vertex_data;
  #systemUniformInfo_fragment_data;
  //
  baseAttachment;
  baseAttachmentView;
  baseAttachment_ResolveTarget;
  baseAttachment_ResolveTargetView;
  baseAttachment_mouseColorID_depth;
  baseAttachment_mouseColorID_depthView;
  baseAttachment_mouseColorID_depth_ResolveTarget;
  baseAttachment_mouseColorID_depth_ResolveTargetView;
  baseDepthStencilAttachment;
  baseDepthStencilAttachmentView;
  //
  #postEffect;
  //
  debugLightList = [];
  //
  mouseX = 0;
  mouseY = 0;
  #mouseEventChecker;

  constructor(redGPUContext, scene, camera) {
    super();
    this.redGPUContext = redGPUContext;
    this.camera = camera;
    this.scene = scene;
    this.systemUniformInfo_vertex = this.#makeSystemUniformInfo_vertex(redGPUContext.device);
    this.systemUniformInfo_fragment = this.#makeSystemUniformInfo_fragment(redGPUContext.device);
    this.projectionMatrix = glMatrix.mat4.create();
    this.#postEffect = new PostEffect(redGPUContext);
    this.#mouseEventChecker = new MouseEventChecker(this);
  }

  //
  _x = 0;

  get x() {return this._x;}

  _y = 0;

  get y() {return this._y;}

  _useFrustumCulling = true;

  get useFrustumCulling() {return this._useFrustumCulling;}

  set useFrustumCulling(value) {this._useFrustumCulling = value;}

  get mouseEventChecker() {
    return this.#mouseEventChecker;
  };

  get postEffect() {return this.#postEffect;}

  get scene() {return this.#scene;}

  set scene(value) {this.#scene = value;}

  get camera() {return this.#camera;}

  set camera(value) {this.#camera = value;}

  get width() {return this.#width;}

  get height() {return this.#height;}

  get viewRect() {return this.#viewRect;}

  #makeSystemUniformInfo_vertex = function (device) {
    let uniformBufferSize =
      TypeSize.mat4 + // projectionMatrix
      TypeSize.mat4 +  // camera3D
      TypeSize.float32x2 +// resolution
      TypeSize.float32 // time
    ;
    const uniformBufferDescriptor = {
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    };
    const bindGroupLayoutDescriptor = {
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: 'uniform',
          },
        }
      ]
    };
    let uniformBuffer, uniformBindGroupLayout, uniformBindGroup, bindGroupDescriptor;
    this.#systemUniformInfo_vertex_data = new Float32Array(uniformBufferSize / Float32Array.BYTES_PER_ELEMENT);
    console.log('uniformBufferDescriptor', uniformBufferDescriptor);
    bindGroupDescriptor = {
      layout: uniformBindGroupLayout = device.createBindGroupLayout(bindGroupLayoutDescriptor),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformBuffer = device.createBuffer(uniformBufferDescriptor),
            offset: 0,
            size: uniformBufferSize
          }
        }
      ]
    };
    uniformBindGroup = device.createBindGroup(bindGroupDescriptor);
    return {
      GPUBuffer: uniformBuffer,
      GPUBindGroupLayout: uniformBindGroupLayout,
      GPUBindGroup: uniformBindGroup
    };
  };
  #makeSystemUniformInfo_fragment = function (device) {
    let uniformBufferSize =
      TypeSize.float32x4 + // directionalLightCount,pointLightCount, spotLightCount
      TypeSize.float32x4 * 2 * ShareGLSL.MAX_DIRECTIONAL_LIGHT + // directionalLight
      TypeSize.float32x4 * 3 * ShareGLSL.MAX_POINT_LIGHT + // pointLight
      TypeSize.float32x4 * TypeSize.float32x4 + // ambientLight
      TypeSize.float32x4 * 3 * ShareGLSL.MAX_SPOT_LIGHT + // spotLight
      TypeSize.float32x4 +  // cameraPosition
      TypeSize.float32x2  // resolution
    ;
    const uniformBufferDescriptor = {
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    };
    const bindGroupLayoutDescriptor = {
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: 'uniform',
          },
        }
      ]
    };
    let uniformBuffer, uniformBindGroupLayout, uniformBindGroup, bindGroupDescriptor;
    this.#systemUniformInfo_fragment_data = new Float32Array(uniformBufferSize / Float32Array.BYTES_PER_ELEMENT);
    bindGroupDescriptor = {
      layout: uniformBindGroupLayout = device.createBindGroupLayout(bindGroupLayoutDescriptor),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformBuffer = device.createBuffer(uniformBufferDescriptor),
            offset: 0,
            size: uniformBufferSize
          }
        }
      ]
    };
    uniformBindGroup = device.createBindGroup(bindGroupDescriptor);
    return {
      GPUBuffer: uniformBuffer,
      GPUBindGroupLayout: uniformBindGroupLayout,
      GPUBindGroup: uniformBindGroup
    };
  };

  resetTexture(redGPUContext) {
    this.#viewRect = this.getViewRect(redGPUContext);
    let info = {
      colorAttachments: [
        {
          key: 'baseAttachment',
          format: redGPUContext.swapChainFormat,
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
          resolveUsage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING
        },
        {
          key: 'baseAttachment_mouseColorID_depth',
          format: 'rgba32float',
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
          resolveUsage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.TEXTURE_BINDING
        }
      ],
      depthStencilAttachment: {
        key: 'baseDepthStencilAttachment',
        format: "depth24plus-stencil8",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
      }
    };
    let sizeInfo = {width: this.#viewRect[2], height: this.#viewRect[3], depthOrArrayLayers: 1};
    [...info.colorAttachments, info.depthStencilAttachment].forEach(v => {
      let key = v['key'];
      let format = v['format'];
      let usage = v['usage'];
      let resolveUsage = v['resolveUsage'];

      if (this[key]) {
        this[key].destroy();
        if (resolveUsage) this[key + '_ResolveTarget'].destroy();
      }
      this[key] = redGPUContext.device.createTexture({
        size: sizeInfo, sampleCount: 4,
        format: format,
        usage: usage
      });
      this[key + 'View'] = this[key].createView();
      if (resolveUsage) {
        this[key + '_ResolveTarget'] = redGPUContext.device.createTexture({
          size: sizeInfo, sampleCount: 1,
          format: format,
          usage: resolveUsage
        });
        this[key + '_ResolveTargetView'] = this[key + '_ResolveTarget'].createView();
      }
    });

  }

  updateSystemUniform(passEncoder, redGPUContext) {
    //TODO 여기도 오프셋 자동으로 계산하게 변경해야함
    let systemUniformInfo_vertex, systemUniformInfo_fragment, aspect, offset;
    let i, len;
    systemUniformInfo_vertex = this.systemUniformInfo_vertex;
    systemUniformInfo_fragment = this.systemUniformInfo_fragment;
    this.#viewRect = this.getViewRect(redGPUContext);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update systemUniformInfo_vertex /////////////////////////////////////////////////////////////////////////////////////////////////
    offset = 0;
    aspect = Math.abs(this.#viewRect[2] / this.#viewRect[3]);
    if (this.camera.hasOwnProperty('farClipping')) {
      glMatrix.mat4.perspective(this.projectionMatrix, (Math.PI / 180) * this.camera.fov, aspect, this.camera.nearClipping, this.camera.farClipping);
    } else {

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
          1 / this.#viewRect[2],
          1 / this.#viewRect[3],
          1
        ]
      );
      glMatrix.mat4.translate(
        this.projectionMatrix,
        this.projectionMatrix,
        [
          0,
          this.#viewRect[3],
          0
        ]
      );
    }


    this.#systemUniformInfo_vertex_data.set(this.projectionMatrix, offset);
    offset += TypeSize.mat4 / Float32Array.BYTES_PER_ELEMENT;
    this.#systemUniformInfo_vertex_data.set(this.camera.matrix, offset);
    offset += TypeSize.mat4 / Float32Array.BYTES_PER_ELEMENT;
    this.#systemUniformInfo_vertex_data.set([this.#viewRect[2], this.#viewRect[3], performance.now()], offset);
    offset += TypeSize.float32x2 / Float32Array.BYTES_PER_ELEMENT;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update systemUniformInfo_fragment /////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update light counts
    offset = 0;
    this.#systemUniformInfo_fragment_data.set([this.scene.directionalLightList.length, this.scene.pointLightList.length, this.scene.spotLightList.length], offset);
    this.debugLightList.length = 0;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update directionalLightList
    i = 0;
    offset = TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
    len = this.scene.directionalLightList.length;
    for (i; i < len; i++) {
      let tLight = this.scene.directionalLightList[i];
      if (tLight) {
        this.#systemUniformInfo_fragment_data.set(tLight._colorRGBA, offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        this.#systemUniformInfo_fragment_data.set([tLight._x, tLight._y, tLight._z, tLight._intensity], offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        if (tLight.useDebugMesh) this.debugLightList.push(tLight._debugMesh);
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update pointLightList
    offset = (TypeSize.float32x4 + TypeSize.float32x4 * 2 * ShareGLSL.MAX_DIRECTIONAL_LIGHT) / Float32Array.BYTES_PER_ELEMENT;
    i = 0;
    len = this.scene.pointLightList.length;
    for (i; i < len; i++) {
      let tLight = this.scene.pointLightList[i];
      if (tLight) {
        this.#systemUniformInfo_fragment_data.set(tLight._colorRGBA, offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        this.#systemUniformInfo_fragment_data.set([tLight._x, tLight._y, tLight._z, tLight._intensity], offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        this.#systemUniformInfo_fragment_data.set([tLight._radius], offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        if (tLight.useDebugMesh) this.debugLightList.push(tLight._debugMesh);
      }
    }
    offset = (TypeSize.float32x4 + TypeSize.float32x4 * 2 * ShareGLSL.MAX_DIRECTIONAL_LIGHT + TypeSize.float32x4 * 3 * ShareGLSL.MAX_POINT_LIGHT) / Float32Array.BYTES_PER_ELEMENT;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update ambientLight
    let tLight = this.scene.ambientLight;
    this.#systemUniformInfo_fragment_data.set(tLight ? tLight._colorRGBA : [0, 0, 0, 0], offset);
    offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
    this.#systemUniformInfo_fragment_data.set([tLight ? tLight._intensity : 1], offset);
    offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update spotLightList
    i = 0;
    len = this.scene.spotLightList.length;
    for (i; i < len; i++) {
      let tLight = this.scene.spotLightList[i];
      if (tLight) {
        this.#systemUniformInfo_fragment_data.set(tLight._colorRGBA, offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        this.#systemUniformInfo_fragment_data.set([tLight._x, tLight._y, tLight._z, tLight._intensity], offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        this.#systemUniformInfo_fragment_data.set([tLight.cutoff, tLight.exponent], offset);
        offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
        if (tLight.useDebugMesh) this.debugLightList.push(tLight._debugMesh.children);
      }
    }
    offset = (TypeSize.float32x4 + TypeSize.float32x4 * 2 * ShareGLSL.MAX_DIRECTIONAL_LIGHT + TypeSize.float32x4 * 3 * ShareGLSL.MAX_POINT_LIGHT + TypeSize.float32x4 * 3 * ShareGLSL.MAX_SPOT_LIGHT + TypeSize.float32x4 * 2) / Float32Array.BYTES_PER_ELEMENT;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update camera3D position
    this.#systemUniformInfo_fragment_data.set([this.camera.x, this.camera.y, this.camera.z], offset);
    offset += TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT;
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update resolution
    this.#systemUniformInfo_fragment_data.set([this.#viewRect[2], this.#viewRect[3]], offset);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update GPUBuffer
    passEncoder.setBindGroup(0, systemUniformInfo_vertex.GPUBindGroup);
    passEncoder.setBindGroup(1, systemUniformInfo_fragment.GPUBindGroup);
    // systemUniformInfo_vertex.GPUBuffer.setSubData(0, this.#systemUniformInfo_vertex_data);
    redGPUContext.device.queue.writeBuffer(systemUniformInfo_vertex.GPUBuffer, 0, this.#systemUniformInfo_vertex_data);
    // systemUniformInfo_fragment.GPUBuffer.setSubData(0, this.#systemUniformInfo_fragment_data);
    redGPUContext.device.queue.writeBuffer(systemUniformInfo_fragment.GPUBuffer, 0, this.#systemUniformInfo_fragment_data);

  }

  getViewRect(redGPUContext) {
    return [
      typeof this.x == 'number' ? this.x : parseInt(this.x) / 100 * redGPUContext.canvas.width,
      typeof this.y == 'number' ? this.y : parseInt(this.y) / 100 * redGPUContext.canvas.height,
      typeof this.width == 'number' ? this.width : parseInt(parseInt(this.width) / 100 * redGPUContext.canvas.width),
      typeof this.height == 'number' ? this.height : parseInt(parseInt(this.height) / 100 * redGPUContext.canvas.height)
    ];
  }

  setSize(width = this.#width, height = this.#height) {
    let t0 = this.#viewRect.toString();
    if (typeof width == 'number') this.#width = width < 1 ? 1 : parseInt(width);
    else {
      if (width.includes('%') && (+width.replace('%', '') >= 0)) this.#width = width;
      else UTIL.throwFunc('View setSize : width는 0이상의 숫자나 %만 허용.', width);
    }
    if (typeof height == 'number') this.#height = height < 1 ? 1 : parseInt(height);
    else {
      if (height.includes('%') && (+height.replace('%', '') >= 0)) this.#height = height;
      else UTIL.throwFunc('View setSize : height는 0이상의 숫자나 %만 허용.', height);
    }
    if (RedGPUContext.useDebugConsole) console.log(`setSize - input : ${width},${height} / result : ${this.#width}, ${this.#height}`);
    if (this.getViewRect(this.redGPUContext).toString() != t0) this.resetTexture(this.redGPUContext);

  }

  setLocation(x = this._x, y = this._y) {
    if (typeof x == 'number') this._x = parseInt(x);
    else {
      if (x.includes('%') && (+x.replace('%', '') >= 0)) this._x = x;
      else UTIL.throwFunc('View setLocation : x는 0이상의 숫자나 %만 허용.', x);
    }
    if (typeof y == 'number') this._y = parseInt(y);
    else {
      if (y.includes('%') && (+y.replace('%', '') >= 0)) this._y = y;
      else UTIL.throwFunc('View setLocation : y는 0이상의 숫자나 %만 허용.', y);
    }
    if (RedGPUContext.useDebugConsole) console.log(`setLocation - input : ${x},${y} / result : ${this._x}, ${this._y}`);
    this.getViewRect(this.redGPUContext);
  }

  readPixelArrayBuffer = async (redGPUContext, redView, targetTexture, x = 0, y = 0, width = 1, height = 1) => {
    // 이미지 카피
    let viewRect = redView.viewRect;
    if (x > 0 && x < viewRect[2] && y > 0 && y < viewRect[3]) {
      let readPixelCommandEncoder, readPixelBuffer, textureView, bufferView, textureExtent;
      readPixelCommandEncoder = redGPUContext.device.createCommandEncoder();
      readPixelBuffer = redGPUContext.device.createBuffer({
        size: 16 * width * height,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });
      textureView = {texture: targetTexture, origin: {x: x, y: y, z: 0}};
      bufferView = {buffer: readPixelBuffer, bytesPerRow: Math.max(256, 4 * width * height), rowsPerImage: 1};
      textureExtent = {width: width, height: height, depthOrArrayLayers: 1};
      readPixelCommandEncoder.copyTextureToBuffer(textureView, bufferView, textureExtent);
      redGPUContext.device.queue.submit([readPixelCommandEncoder.finish()]);
      // console.log(readPixelBuffer)
      readPixelBuffer = redGPUContext.device.createBuffer({
        mappedAtCreation: true,
        size: 16 * width * height,
        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
      });
      // console.log('bufferView',bufferView)


      let promise = new Promise(resolve => {

        bufferView.buffer.mapAsync(GPUMapMode.READ).then(arrayBuffer => {
          const data = bufferView.buffer.getMappedRange();
          // console.log(data)
          readPixelBuffer.unmap();
          readPixelBuffer.destroy();
          readPixelBuffer = null;
          resolve(data);
        });
      });
      return promise;
    }
  };

  computeViewFrustumPlanes() {
    let tMTX = glMatrix.mat4.create();
    glMatrix.mat4.multiply(tMTX, this.projectionMatrix, this.camera.matrix);
    let planes = [];
    planes[0] = [tMTX[3] - tMTX[0], tMTX[7] - tMTX[4], tMTX[11] - tMTX[8], tMTX[15] - tMTX[12]];
    planes[1] = [tMTX[3] + tMTX[0], tMTX[7] + tMTX[4], tMTX[11] + tMTX[8], tMTX[15] + tMTX[12]];
    planes[2] = [tMTX[3] + tMTX[1], tMTX[7] + tMTX[5], tMTX[11] + tMTX[9], tMTX[15] + tMTX[13]];
    planes[3] = [tMTX[3] - tMTX[1], tMTX[7] - tMTX[5], tMTX[11] - tMTX[9], tMTX[15] - tMTX[13]];
    planes[4] = [tMTX[3] - tMTX[2], tMTX[7] - tMTX[6], tMTX[11] - tMTX[10], tMTX[15] - tMTX[14]];
    planes[5] = [tMTX[3] + tMTX[2], tMTX[7] + tMTX[6], tMTX[11] + tMTX[10], tMTX[15] + tMTX[14]];
    for (let i = 0; i < planes.length; i++) {
      let plane = planes[i];
      let norm = Math.sqrt(plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2]);
      plane[0] /= norm;
      plane[1] /= norm;
      plane[2] /= norm;
      plane[3] /= norm;
    }
    return planes;
  }

}
