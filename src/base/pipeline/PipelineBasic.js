/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.30 19:35:31
 *
 */

"use strict";

import UUID from "../UUID.js";


export default class PipelineBasic extends UUID {
  redGPUContext;
  #targetMesh;
  GPURenderPipeline;

  constructor(redGPUContext, targetMesh) {
    super();
    this.redGPUContext = redGPUContext;
    this.#targetMesh = targetMesh;
    this.GPURenderPipeline = null;
  }

  update(redGPUContext, redView) {
    let targetMesh = this.#targetMesh;
    const device = redGPUContext.device;
    const descriptor = {
      // 레이아웃은 재질이 알고있으니 들고옴
      layout: device.createPipelineLayout(
        {
          bindGroupLayouts: [
            redView.systemUniformInfo_vertex.GPUBindGroupLayout,
            redView.systemUniformInfo_fragment.GPUBindGroupLayout,
            targetMesh.GPUBindGroupLayout,
            targetMesh._material.GPUBindGroupLayout
          ]
        }
      ),
      // 버텍스와 프레그먼트는 재질에서 들고온다.
      vertex: {
        module: targetMesh._material.vShaderModule.GPUShaderModule,
        entryPoint: 'main',
        buffers: targetMesh._geometry.vertexState.vertexBuffers
      },
      fragment: {
        module: targetMesh._material.fShaderModule.GPUShaderModule,
        entryPoint: 'main',
        targets: [
          {
            format: redGPUContext.context.getPreferredFormat(redGPUContext.adapter),
            blend: {
              color: {
                srcFactor: "src-alpha",
                dstFactor: "one-minus-src-alpha",
                operation: "add"
              },
              alpha: {
                  srcFactor: "src-alpha",
                  dstFactor: "one",
                  operation: "add"
              }
              // color: {
              //   srcFactor: "src-alpha",
              //   dstFactor: "one-minus-src-alpha",
              //   operation: "add"
              // },
              // alpha: {
              //   srcFactor: "src-alpha",
              //   dstFactor: "one-minus-src-alpha",
              //   operation: "add"
              // }
            }
          },
          {
            format: 'rgba32float',

          },
        ],
      },
      // 버텍스 상태는 지오메트리가 알고있음으로 들고옴
      // vertexState: targetMesh._geometry.vertexState,
      // 컬러모드 지정하고

      primitive: {
        topology: targetMesh._primitiveTopology,
        cullMode: targetMesh._cullMode,
        frontFace: 'ccw',
      },
      depthStencil: {
        format: "depth24plus-stencil8",
        depthWriteEnabled: targetMesh._depthWriteEnabled,
        depthCompare: targetMesh._depthCompare,
      },
      multisample:{
        count :4
      }
      //alphaToCoverageEnabled : true // alphaToCoverageEnabled isn't supported (yet)
    };
    if(targetMesh._primitiveTopology === 'line-strip' || targetMesh._primitiveTopology === 'triangle-strip'){
      descriptor.primitive.stripIndexFormat = 'uint32'
    }

    // console.time('update - ' + this._UUID)
    this.GPURenderPipeline = device.createRenderPipeline(descriptor);
    // console.log('update - ', targetMesh._material.fShaderModule.currentKey)
    // console.timeEnd('update - ' + this._UUID)


  }

}
