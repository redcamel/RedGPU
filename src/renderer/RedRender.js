import RedTypeSize from "../resources/RedTypeSize.js";

export default class RedRender {
	#redGPU;
	#swapChainTexture;
	#textureView;
	#renderView = redView => {
		let prevPipeline;
		let prevVertexBuffer;
		let prevIndexBuffer;
		let prevBindBuffer;
		let tScene, tSceneBackgroundColor_rgba;
		let tMaterial;
		let tMesh;
		let i;
		tScene = redView.scene;
		tSceneBackgroundColor_rgba = tScene.backgroundColorRGBA;
		i = tScene.children.length;

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

		while (i--) {
			tMesh = tScene.children[i];
			tMaterial = tMesh.material;
			if (tMesh.dirtyTransform) {
				tMesh.getTransform();
				tMesh.getNormalTransform();
				// TODO 유니폼 버퍼를 동적생성하는 부분을 잘생각해야함
				tMesh.updateUniformBuffer();
				tMesh.dirtyTransform = false
			}


			if (!tMesh.pipeline || tMesh._prevBindings != tMaterial.bindings) tMesh.createPipeline(this.#redGPU);

			if (prevPipeline != tMesh.pipeline) passEncoder.setPipeline(prevPipeline = tMesh.pipeline);
			if (prevVertexBuffer != tMesh.geometry.interleaveBuffer) passEncoder.setVertexBuffer(0, prevVertexBuffer = tMesh.geometry.interleaveBuffer.GPUBuffer);
			if (prevIndexBuffer != tMesh.geometry.indexBuffer) passEncoder.setIndexBuffer(prevIndexBuffer = tMesh.geometry.indexBuffer.GPUBuffer);

			if (tMaterial.bindings) {
				if (!tMesh.GPUBindGroup) {
					tMaterial.bindings[0]['resource']['buffer'] = tMesh.uniformBuffer.GPUBuffer;
					tMesh.GPUBindGroup = this.#redGPU.device.createBindGroup(tMaterial.uniformBindGroupDescriptor)
				}
				if (prevBindBuffer != tMesh.GPUBindGroup) passEncoder.setBindGroup(1, prevBindBuffer = tMesh.GPUBindGroup);
				passEncoder.drawIndexed(tMesh.geometry.indexBuffer.indexNum, 1, 0, 0, 0);

			} else {
				tMesh.GPUBindGroup = null;
				tMesh.pipeline = null
			}
			tMesh._prevBindings = tMaterial.bindings


		}
		passEncoder.endPass();
		this.#redGPU.device.defaultQueue.submit([commandEncoder.finish()]);

	}

	render(time, redGPU, redView) {
		this.#redGPU = redGPU;
		this.#swapChainTexture = redGPU.swapChain.getCurrentTexture();
		this.#textureView = this.#swapChainTexture.createView();
		this.#renderView(redView)


	}
}