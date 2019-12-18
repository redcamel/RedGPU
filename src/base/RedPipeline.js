/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.18 19:33:34
 *
 */

"use strict";

import RedUUID from "./RedUUID.js";

let RedPipeline_callNum = 0;
export default class RedPipeline extends RedUUID {
	#redGPUContext;
	#targetMesh;
	GPURenderPipeline;
	constructor(redGPUContext, targetMesh) {
		super();
		this.#redGPUContext = redGPUContext;
		this.#targetMesh = targetMesh;
		this.GPURenderPipeline = null;
	}
	updatePipeline_sampleCount4(redGPUContext, redView) {
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
						srcFactor: "src-alpha",
						dstFactor: "one-minus-src-alpha",
						operation: "add"
					},
					alphaBlend: {
						srcFactor: "one",
						dstFactor: "one-minus-src-alpha",
						operation: "add"
					}
				},
				{
					format: redGPUContext.swapChainFormat
				},
				{
					format: redGPUContext.swapChainFormat
				}
			],
			rasterizationState: {
				frontFace: 'ccw',
				cullMode: targetMesh._cullMode
			},
			primitiveTopology: targetMesh._primitiveTopology,
			depthStencilState: {
				format: "depth24plus-stencil8",
				depthWriteEnabled: targetMesh._useDepthTest,
				depthCompare: targetMesh._useDepthTest ? targetMesh._depthTestFunc : 'always',
			},
			sampleCount: 4,
			//alphaToCoverageEnabled : true // alphaToCoverageEnabled isn't supported (yet)
		};
		RedPipeline_callNum++;
		// console.log('RedPipeline_callNum', RedPipeline_callNum)
		// console.time('updatePipeline_sampleCount4 - ' + this._UUID)
		this.GPURenderPipeline = device.createRenderPipeline(descriptor);
		// console.log('updatePipeline_sampleCount4 - ', targetMesh._material.fShaderModule.currentKey)
		// console.timeEnd('updatePipeline_sampleCount4 - ' + this._UUID)
		this.updateUUID()


	}
	updatePipeline_sampleCount1(redGPUContext, redView) {
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
						srcFactor: "src-alpha",
						dstFactor: "one-minus-src-alpha",
						operation: "add"
					},
					alphaBlend: {
						srcFactor: "one",
						dstFactor: "one-minus-src-alpha",
						operation: "add"
					}
				}
			],
			rasterizationState: {
				frontFace: 'ccw',
				cullMode: targetMesh._cullMode
			},
			primitiveTopology: targetMesh._primitiveTopology,

			sampleCount: 1,
			//alphaToCoverageEnabled : true // alphaToCoverageEnabled isn't supported (yet)
		};

		this.GPURenderPipeline = device.createRenderPipeline(descriptor);
		this.updateUUID()
	}

}