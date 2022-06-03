/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:47:56
 *
 */
"use strict";
import DetectorGPU from "./base/detect/DetectorGPU.js";
import ShareGLSL from "./base/ShareGLSL.js";
import Sampler from "./resources/Sampler.js";

let redGPUContextList = new Set();
let setGlobalResizeEvent = function () {
  const resize = _ => {
    for (const redGPUContext of redGPUContextList) {
      redGPUContext.setSize()
      configure(redGPUContext)
    }

  }
  window.addEventListener('resize', resize);
  requestAnimationFrame(e=>{
    resize()
  })
};

let configure = function (redGPUContext) {
  const swapChainDescriptor = {
    device: redGPUContext.device,
    format: redGPUContext.swapChainFormat,
    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC ,
    // size: {
    //   width: redGPUContext.canvas.clientWidth * window.devicePixelRatio,
    //   height: redGPUContext.canvas.clientHeight * window.devicePixelRatio,
    // },
    alphaMode  : 'premultiplied'
  };
  console.log(swapChainDescriptor)
  if (redGPUContext.useDebugConsole) console.log('swapChainDescriptor', swapChainDescriptor);

  return redGPUContext.context.configure(swapChainDescriptor);
};
let glslangModule;
let glslang;
let checkGlslang = function () {
  return new Promise(async (resolve) => {
    if (!glslang) {
      glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.15/dist/web-devel/glslang.js');
      glslang = await glslangModule.default();
      glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'vertex');
      glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'fragment');
      resolve();
    } else {
      glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'vertex');
      glslang.compileGLSL(` ${ShareGLSL.GLSL_VERSION}\nvoid main(){} `, 'fragment');
      resolve();
    }
  });
};
let twgslLib
let checkTwgsl = function () {
  return new Promise(async (resolve) => {
    if (!twgslLib) {
     await import(/* webpackIgnore: true */ 'https://preview.babylonjs.com/twgsl/twgsl.js');
     // await import(/* webpackIgnore: true */ 'https://redcamel.github.io/RedGPU/libs/twgsl.js');
      console.log('twgsl',twgsl)
      twgslLib = twgsl;
      resolve();
    } else {
      resolve();
    }
  });
};


export default class RedGPUContext {
  static useDebugConsole = false;
  #width = 0;
  #height = 0;
  #detector;
  viewList = [];

  constructor(canvas, initFunc) {
    checkGlslang().then(_=>checkTwgsl()).then(_=>{
      return twgslLib('https://preview.babylonjs.com/twgsl/twgsl.wasm')
      // return twgslLib('https://redcamel.github.io/RedGPU/libs/twgsl.wasm')
    }).then(twgsl => {
      console.log(twgsl,twgsl)
      console.log('glslang', glslang);
      console.log(this);
      this.#detector = new DetectorGPU(this);
      let state = true;
      if (navigator.gpu) {
        navigator.gpu.requestAdapter(
          {
            powerPreference: "high-performance"
          }
        )
          .then(adapter => {
            adapter.requestDevice({
              // extensions: ["anisotropic-filtering"]
              // limits:{
              // 	maxUniformBufferBindingSize : 16384
              // }
            })
              .then(device => {
                this.adapter = adapter
                this.twgsl = twgsl
                this.glslang = glslang;
                this.canvas = canvas;
                this.context = canvas.getContext('webgpu');
                this.device = device;
                this.swapChainFormat = navigator.gpu.getPreferredCanvasFormat(this.adapter)

                this.state = {
                  Geometry: new Map(),
                  Buffer: {
                    vertexBuffer: new Map(),
                    indexBuffer: new Map()
                  },
                  emptySampler: new Sampler(this),
                  emptyTextureView: device.createTexture({
                    size: {width: 1, height: 1, depthOrArrayLayers: 1,},
                    format: 'r8unorm',
                    usage: GPUTextureUsage.TEXTURE_BINDING,
                  }).createView(),
                  emptyCubeTextureView: device.createTexture({
                    size: {width: 1, height: 1, depthOrArrayLayers: 6,},
                    dimension: '2d',
                    // arrayLayerCount: 6,
                    mipLevelCount: 1,
                    sampleCount: 1,
                    format: 'r8unorm',
                    usage: GPUTextureUsage.TEXTURE_BINDING,
                  }).createView({
                    format: 'r8unorm',
                    dimension: 'cube',
                    aspect: 'all',
                    baseMipLevel: 0,
                    mipLevelCount: 1,
                    baseArrayLayer: 0,
                    arrayLayerCount: 6
                  })
                };
                /////
                [this.#detector.click, this.#detector.move, this.#detector.down, this.#detector.up].forEach(v => {
                  let tXkey, tYkey;
                  tXkey = 'offsetX';
                  tYkey = 'offsetY';
                  let mouseX, mouseY;
                  this.canvas.addEventListener(v, e => {
                    e.preventDefault();
                    let tEvent;
                    if (this.#detector.isMobile) {
                      if (e.changedTouches[0]) {
                        tEvent =
                          {
                            type: e.type,
                            x: e.changedTouches[0].clientX,
                            y: e.changedTouches[0].clientY,
                            nativeEvent: e
                          }
                        ;
                        mouseX = e.changedTouches[0].clientX;
                        mouseY = e.changedTouches[0].clientY;
                      }
                    } else {
                      tEvent =
                        {
                          type: e.type,
                          x: e[tXkey],
                          y: e[tYkey],
                          nativeEvent: e
                        }
                      ;
                      mouseX = e[tXkey];
                      mouseY = e[tYkey];
                    }
                    let i, tView;
                    i = this.viewList.length;
                    while (i--) {
                      tView = this.viewList[i];
                      tView.mouseEventChecker.mouseEventInfo.push(tEvent);
                      tView.mouseX = mouseX - tView.viewRect[0];
                      tView.mouseY = mouseY - tView.viewRect[1];
                    }
                  }, false);
                });
                /////
                this.#detector.detectGPU();
                ///////
                this.setSize('100%', '100%');
                if (!redGPUContextList.size) setGlobalResizeEvent();
                redGPUContextList.add(this);
                initFunc.call(this, true);
                ////////////////////////////////////////////////////////
                // new ColorPhongMaterial(this);
                // new ColorMaterial(this);
                // new GridMaterial(this);
                // new SkyBoxMaterial(this);
                // new StandardMaterial(this);
                // new BitmapMaterial(this);
                // new EnvironmentMaterial(this);
                // new ColorPhongTextureMaterial(this);
                // new LineMaterial(this);
                // new TextMaterial(this);
                // new SpriteSheetMaterial(this);
                // new PBRMaterial_System(this)
                ////////////////////////////////////////////////////////


              });
          }).catch(error => {
          state = false;
          initFunc(false, error);
        });
      } else {
        initFunc(state = false, 'navigate.gpu is null');
      }
    });
  }

  get detector() {return this.#detector;};

  addView(redView) {
    this.viewList.push(redView);
    redView.resetTexture(this);
  }

  removeView(redView) {if (this.viewList.includes(redView)) this.viewList.splice(redView, 1);}

  setSize(w = this.#width, h = this.#height) {
    this.#width = w;
    this.#height = h;
    let tW, tH;
    let rect = document.body.getBoundingClientRect();
    rect.height = window.innerHeight;
    // console.log('rect',rect)
    if (typeof w != 'number' && w.includes('%')) tW = parseInt(+rect.width * w.replace('%', '') / 100);
    else tW = w;
    if (typeof h != 'number' && h.includes('%')) tH = parseInt(+rect.height * h.replace('%', '') / 100);
    else tH = h;
    if (tW < 1) tW = 1;
    if (tH < 1) tH = 1;
    this.canvas.width = tW;
    this.canvas.height = tH;
    this.canvas.style.width = tW + 'px';
    this.canvas.style.height = tH + 'px';
    this.viewList.forEach(redView => {
      redView.setSize();
      redView.setLocation();
    });
    if (RedGPUContext.useDebugConsole) console.log(`setSize - input : ${w},${h} / result : ${tW}, ${tH}`);
  }
}
