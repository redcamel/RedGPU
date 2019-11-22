import RedUUID from "../base/RedUUID.js";

let prevPipeline_UUID;
let prevVertexBuffer_UUID;
let prevIndexBuffer_UUID;

let renderNum = 0
export default class RedRender {
	#redGPU;
	#swapChainTexture;
	#textureView;
	#renderView = redView => {
		let tScene, tSceneBackgroundColor_rgba;
		tScene = redView.scene;
		tSceneBackgroundColor_rgba = tScene.backgroundColorRGBA;

		// console.log(swapChain.getCurrentTexture())
		const renderPassDescriptor = {
			colorAttachments: [{
				attachment: this.#textureView,
				loadValue: {
					r: tSceneBackgroundColor_rgba[0],
					g: tSceneBackgroundColor_rgba[1],
					b: tSceneBackgroundColor_rgba[2],
					a: tSceneBackgroundColor_rgba[3]
				}
			}],
			depthStencilAttachment: {
				attachment: this.#redGPU.depthTextureView,
				depthLoadValue: 1.0,
				depthStoreOp: "store",
				stencilLoadValue: 0,
				stencilStoreOp: "store",
			}
		};
		const commandEncoder = this.#redGPU.device.createCommandEncoder();
		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

		// 시스템 유니폼 업데이트
		this.#redGPU.updateSystemUniform(passEncoder, redView); //TODO - 이놈을 뷰가 가져가야함
		prevPipeline_UUID = null;
		prevVertexBuffer_UUID = null;
		prevIndexBuffer_UUID = null;
		renderNum++
		this.#renderScene(passEncoder, tScene)
		passEncoder.endPass();
		this.#redGPU.device.defaultQueue.submit([commandEncoder.finish()]);
	};
	#renderScene = (passEncoder, parent, parentDirty) => {
		let i;
		let targetList = parent.children
		let tGeometry;
		let tMaterial;
		let tMesh;
		let tDirty;
		i = targetList.length;
		while (i--) {

			tMesh = targetList[i];
			tMaterial = tMesh._material;
			tGeometry = tMesh._geometry;
			tDirty = tMesh._dirtyTransform;
			if (tDirty || parentDirty) {
				// TODO 매트릭스 계산부분을 여기로 나중에 다들고 오는게 성능에 좋음...
				tMesh.calcTransform(parent);
				tMesh.updateUniformBuffer();
			}
			if (!tMesh.pipeline || tMaterial.bindings && tMesh._prevBindings != tMaterial.bindings) {
				tMesh.createPipeline(this.#redGPU);
				prevIndexBuffer_UUID = null
			}

			if (tMaterial.bindings) {
				if (!tMesh.GPUBindGroup) {
					tMaterial.bindings[0]['resource']['buffer'] = tMesh.uniformBuffer_vertex.GPUBuffer;
					tMaterial.bindings[1]['resource']['buffer'] = tMesh.uniformBuffer_fragment.GPUBuffer;
					tMesh.GPUBindGroup = this.#redGPU.device.createBindGroup(tMaterial.uniformBindGroupDescriptor);
					tMesh.GPUBindGroup._UUID = RedUUID.makeUUID()
				}
				if (prevPipeline_UUID != tMesh.pipeline._UUID) {
					passEncoder.setPipeline(tMesh.pipeline);
					prevPipeline_UUID = tMesh.pipeline._UUID
				}
				if (prevVertexBuffer_UUID != tGeometry.interleaveBuffer._UUID) {
					passEncoder.setVertexBuffer(0, tGeometry.interleaveBuffer.GPUBuffer);
					prevVertexBuffer_UUID = tGeometry.interleaveBuffer._UUID
				}
				if (prevIndexBuffer_UUID != tGeometry.indexBuffer._UUID) {
					passEncoder.setIndexBuffer(tGeometry.indexBuffer.GPUBuffer);
					prevIndexBuffer_UUID = tGeometry.indexBuffer._UUID
				}
				passEncoder.setBindGroup(1, tMesh.GPUBindGroup); // 바인드 그룹은 매 매쉬마다 다르므로 캐싱할 필요가 없음.
				passEncoder.drawIndexed(tGeometry.indexBuffer.indexNum, 1, 0, 0, 0);

			} else {
				tMesh.GPUBindGroup = null;
				tMesh.pipeline = null;
			}
			tMesh._prevBindings = tMaterial.bindings;
			if (tMesh.children.length) this.#renderScene(passEncoder, tMesh, parentDirty || tDirty);
			tMesh._dirtyTransform = false;
		}
	}

	render(time, redGPU, redView) {
		this.#redGPU = redGPU;
		this.#swapChainTexture = redGPU.swapChain.getCurrentTexture();
		this.#textureView = this.#swapChainTexture.createView();
		this.#renderView(redView)
	}
}