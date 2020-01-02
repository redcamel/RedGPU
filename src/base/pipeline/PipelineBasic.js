/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 14:26:4
 *
 */

"use strict";

import UUID from "../UUID.js";


export default class PipelineBasic extends UUID {
	#redGPUContext;
	#targetMesh;
	GPURenderPipeline;
	constructor(redGPUContext, targetMesh) {
		super();
		this.#redGPUContext = redGPUContext;
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
			vertexStage: {
				module: targetMesh._material.vShaderModule.GPUShaderModule,
				entryPoint: 'main'
			},
			fragmentStage: {
				module: targetMesh._material.fShaderModule.GPUShaderModule,
				entryPoint: 'main'
			},
			// 버텍스 상태는 지오메트리가 알고있음으로 들고옴
			vertexState: targetMesh._geometry.vertexState,
			// 컬러모드 지정하고
			colorStates: [
				{
					format: redGPUContext.swapChainFormat,
					colorBlend: {
						srcFactor: targetMesh._blendColorSrc,
						dstFactor: targetMesh._blendColorDst,
						operation: "add"
					},
					alphaBlend: {
						srcFactor: targetMesh._blendAlphaSrc,
						dstFactor: targetMesh._blendAlphaDst,
						operation: "add"
					}
				},
				{
					format: 'rgba32float'
					//baseAttachment_mouseColorID_depthView
				}
			],
			rasterizationState: {
				frontFace: 'ccw',
				cullMode: targetMesh._cullMode
			},
			primitiveTopology: targetMesh._primitiveTopology,
			depthStencilState: {
				format: "depth24plus-stencil8",
				depthWriteEnabled: targetMesh._depthWriteEnabled,
				depthCompare: targetMesh._depthCompare ,
			},
			sampleCount: 4,
			//alphaToCoverageEnabled : true // alphaToCoverageEnabled isn't supported (yet)
		};

		// console.time('update - ' + this._UUID)
		this.GPURenderPipeline = device.createRenderPipeline(descriptor);
		// console.log('update - ', targetMesh._material.fShaderModule.currentKey)
		// console.timeEnd('update - ' + this._UUID)


	}

}