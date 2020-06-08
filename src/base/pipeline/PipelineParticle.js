/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:3:14
 *
 */

"use strict";

import UUID from "../UUID.js";


export default class PipelineParticle extends UUID {
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
		console.log('targetMesh._geometry.vertexState',targetMesh._geometry.vertexState);
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
			vertexState : {
				indexFormat: 'uint32',
				vertexBuffers: [
					{
						// vertex buffer
						arrayStride: 8 * 4,
						stepMode: "vertex",
						attributes: [
							{
								// vertex positions
								shaderLocation: 0,
								offset: 0,
								format: "float3",
							},
							{
								// vertex uv
								shaderLocation: 1,
								offset: 6 * 4,
								format: "float2"
							}
						],
					},
					{
						// instanced particles buffer
						arrayStride: targetMesh._PROPERTY_NUM * 4,
						stepMode: "instance",
						attributes: [
							{
								/* position*/
								shaderLocation: 2, offset: 4 * 4, format: "float3"
							},
							{
								/* alpha*/
								shaderLocation: 3, offset: 7 * 4, format: "float"
							},
							{
								/* rotation*/
								shaderLocation: 4, offset: 8 * 4, format: "float3"
							},
							{
								/* scale*/
								shaderLocation: 5, offset: 11 * 4, format: "float"
							},


						]
					},
				]
			},
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