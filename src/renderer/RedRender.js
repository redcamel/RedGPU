/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.28 23:2:58
 *
 */
let cacheTable = []
let checkedMaterial = []
let renderScene = (redGPU, redView, passEncoder, parent, parentDirty) => {
	let i;
	let targetList = parent.children;
	let tGeometry;
	let tMaterial;
	let tMesh;
	let tDirtyTransform, tDirtyPipeline;
	let tMaterialChanged;
	let tPipeline;
	let prevPipeline_UUID;
	let prevVertexBuffer_UUID;
	let prevIndexBuffer_UUID;
	i = targetList.length;
	while (i--) {
		tMesh = targetList[i];
		tMaterial = tMesh._material;
		tGeometry = tMesh._geometry;
		tDirtyTransform = tMesh.dirtyTransform;
		tDirtyPipeline = tMesh.dirtyPipeline;
		tPipeline = tMesh.pipeline;
		if (tDirtyTransform || parentDirty) {
			// TODO 매트릭스 계산부분을 여기로 나중에 다들고 오는게 성능에 좋음...
			tMesh.calcTransform(parent);
			// TODO - 이녀석도 개별적으로 업데이트 되도록 변경해야함
		}
		tMaterialChanged = tMesh._prevMaterialUUID != tMaterial._UUID;
		if (tDirtyPipeline || tMaterialChanged) {
			tPipeline.updatePipeline(redGPU, redView);
			tMesh.updateUniformBuffer(); //TODO - #55 Material, Mesh의 BindGroup과  BindGroupLayout을 나눠야곘음.
			// console.log('tMesh.dirtyPipeline',tMesh.dirtyPipeline)
		}


		if (tMaterial.bindings) {
			// materialPropertyCheck
			////////////////////////
			let matUUID = tMaterial._UUID;
			if (tMaterialChanged) checkedMaterial[matUUID] = 0;

			if (!checkedMaterial[matUUID]) {
				let tempFloat32 = new Float32Array(1);
				//음 전체 속성 업데이트라고 봐야할까나..
				//TODO : 최적화...필요..
				let i2;
				let dataVertex, dataFragment, tData;
				let tValue;
				let tValueUUID;
				dataVertex = tMaterial.uniformBufferDescriptor_vertex.redStruct;

				dataFragment = tMaterial.uniformBufferDescriptor_fragment.redStruct;
				// console.log(dataVertex)
				i2 = dataVertex.length > dataFragment.length ? dataVertex.length : dataFragment.length;
				while (i2--) {
					tData = dataVertex[i2];
					if (tData) {
						tValueUUID = tData._UUID;
						tValue = tData.targetKey ? tMesh[tData.targetKey][tData.valueName] : tMesh[tData.valueName];
						if (cacheTable[tValueUUID] != tValue) {
							// console.log('변경!',tData.valueName)
							cacheTable[tValueUUID] = tValue
							if (typeof tValue == 'number') {
								tempFloat32[0] = tValue;
								tValue = tempFloat32
							}
							tMaterial.uniformBuffer_vertex.GPUBuffer.setSubData(tData['offset'], tValue);
						}
					}
					tData = dataFragment[i2];
					if (tData) {
						tValueUUID = tData._UUID;
						tValue = tData.targetKey ? tMesh[tData.targetKey][tData.valueName] : tMesh[tData.valueName];
						if (cacheTable[tValueUUID] != tValue) {
							// 	console.log('변경!',tData)
							cacheTable[tValueUUID] = tValue
							if (typeof tValue == 'number') {
								tempFloat32[0] = tValue;
								tValue = tempFloat32
							}
							tMaterial.uniformBuffer_fragment.GPUBuffer.setSubData(tData['offset'], tValue);
						}
					}
				}
			}
			////////////////////////
			checkedMaterial[matUUID] = 1


			if (!tMesh.uniformBindGroup_material.GPUBindGroup) tMesh.uniformBindGroup_material.setGPUBindGroup(tMesh, tMaterial);
			if (prevPipeline_UUID != tPipeline._UUID) {
				passEncoder.setPipeline(tPipeline.GPURenderPipeline);
				prevPipeline_UUID = tPipeline._UUID
			}
			if (prevVertexBuffer_UUID != tGeometry.interleaveBuffer._UUID) {
				passEncoder.setVertexBuffer(0, tGeometry.interleaveBuffer.GPUBuffer);
				prevVertexBuffer_UUID = tGeometry.interleaveBuffer._UUID
			}
			if (tGeometry.indexBuffer && prevIndexBuffer_UUID != tGeometry.indexBuffer._UUID) {
				passEncoder.setIndexBuffer(tGeometry.indexBuffer.GPUBuffer);
				prevIndexBuffer_UUID = tGeometry.indexBuffer._UUID
			}
			passEncoder.setBindGroup(2, tMesh.GPUBindGroup); // 메쉬 바인딩 그룹
			passEncoder.setBindGroup(3, tMesh.uniformBindGroup_material.GPUBindGroup); // 젲;ㄹ 빙;ㄴㄷ;ㅇ ㄱ,릅
			if (tGeometry.indexBuffer) passEncoder.drawIndexed(tGeometry.indexBuffer.indexNum, 1, 0, 0, 0);
			else passEncoder.draw(tGeometry.interleaveBuffer.vertexCount, 1, 0, 0, 0);
			tMesh.dirtyPipeline = false;
		} else {
			tMesh.uniformBindGroup_material.clear();
		}
		tMesh._prevMaterialUUID = tMaterial._UUID;
		if (tMesh.children.length) renderScene(redGPU, passEncoder, tMesh, parentDirty || tDirtyTransform);
		tMesh.dirtyTransform = false;
	}
};
export default class RedRender {
	#redGPU;
	#swapChainTexture;
	#swapChainTextureView;
	#renderView = (redGPU, redView) => {
		let tScene, tSceneBackgroundColor_rgba;
		tScene = redView.scene;
		tSceneBackgroundColor_rgba = tScene.backgroundColorRGBA;
		redView.camera.update();
		// console.log(swapChain.getCurrentTexture())
		if (!redView.baseAttachmentView) {
			redView.resetTexture(redGPU)
		}

		const renderPassDescriptor = {
			colorAttachments: [{
				attachment: redView.baseAttachmentView,
				resolveTarget: redView.baseResolveTargetView,
				loadValue: {
					r: tSceneBackgroundColor_rgba[0],
					g: tSceneBackgroundColor_rgba[1],
					b: tSceneBackgroundColor_rgba[2],
					a: tSceneBackgroundColor_rgba[3]
				}
			}],
			depthStencilAttachment: {
				attachment: redView.baseDepthStencilAttachmentView,
				depthLoadValue: 1.0,
				depthStoreOp: "store",
				stencilLoadValue: 0,
				stencilStoreOp: "store",
			}
		};
		const commandEncoder = this.#redGPU.device.createCommandEncoder();
		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

		// 시스템 유니폼 업데이트
		redView.updateSystemUniform(passEncoder, redGPU);
		if (tScene.grid) renderScene(redGPU, redView, passEncoder, {children: [tScene.grid]});
		renderScene(redGPU, redView, passEncoder, tScene);
		passEncoder.endPass();
		let tX = redView.viewRect[0];
		let tY = redView.viewRect[1];
		let tW = redView.viewRect[2] + redView.viewRect[0] > this.#redGPU.canvas.width ? redView.viewRect[2] - redView.viewRect[0] : redView.viewRect[2];
		let tH = redView.viewRect[3] + redView.viewRect[1] > this.#redGPU.canvas.height ? redView.viewRect[3] - redView.viewRect[1] : redView.viewRect[3];
		if (tW > this.#redGPU.canvas.width) tW = this.#redGPU.canvas.width - tX;
		if (tH > this.#redGPU.canvas.height) tH = this.#redGPU.canvas.height - tX;
		commandEncoder.copyTextureToTexture(
			{
				texture: redView.baseResolveTarget
			},
			{
				texture: this.#swapChainTexture,
				origin: {
					x: tX,
					y: tY,
					z: 0
				}
			},
			{
				width: tW,
				height: tH,
				depth: 1
			}
		);
		this.#redGPU.device.defaultQueue.submit([commandEncoder.finish()]);
	};


	render(time, redGPU) {
		this.#redGPU = redGPU;
		this.#swapChainTexture = redGPU.swapChain.getCurrentTexture();
		this.#swapChainTextureView = this.#swapChainTexture.createView();
		let i = 0, len = redGPU.viewList.length;
		checkedMaterial.length = 0
		for (i; i < len; i++) this.#renderView(redGPU, redGPU.viewList[i])
		// console.log(cacheTable)
	}
}