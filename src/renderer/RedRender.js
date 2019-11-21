import RedTypeSize from "../resources/RedTypeSize.js";

export default class RedRender {
	render(time, redGPU) {
		let prevPipeline;
		let prevVertexBuffer;
		let prevIndexBuffer;
		let prevBindBuffer;
		let tScene, tSceneBackgroundColor_rgba;
		let tMaterial;
		let tMesh;
		let i;
		tScene = redGPU.scene;
		tSceneBackgroundColor_rgba = tScene.backgroundColorRGBA
		i = tScene.children.length;
		const swapChainTexture = redGPU.swapChain.getCurrentTexture();
		const commandEncoder = redGPU.device.createCommandEncoder();
		const textureView = swapChainTexture.createView();
		// console.log(swapChain.getCurrentTexture())
		const renderPassDescriptor = {
			colorAttachments: [{
				attachment: textureView,
				loadValue: {
					r: tSceneBackgroundColor_rgba[0],
					g: tSceneBackgroundColor_rgba[1],
					b: tSceneBackgroundColor_rgba[2],
					a: tSceneBackgroundColor_rgba[3]
				}
			}],
			depthStencilAttachment: {
				attachment: redGPU.depthTextureView,
				depthLoadValue: 1.0,
				depthStoreOp: "store",
				stencilLoadValue: 0,
				stencilStoreOp: "store",
			}
		};
		const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);


		// 시스템 유니폼 업데이트
		redGPU.updateSystemUniform(passEncoder);

		while (i--) {
			tMesh = tScene.children[i];
			tMaterial = tMesh.material;
			if (tMesh.dirtyTransform) {
				tMesh.getTransform();
				tMesh.getNormalTransform()
				// TODO 유니폼 버퍼를 동적생성하는 부분을 잘생각해야함
				tMesh.updateUniformBuffer();
				tMesh.dirtyTransform = false
			}


			if (!tMesh.pipeline || tMesh._prevBindings != tMaterial.bindings) tMesh.createPipeline(redGPU);

			if (prevPipeline != tMesh.pipeline) passEncoder.setPipeline(prevPipeline = tMesh.pipeline);
			if (prevVertexBuffer != tMesh.geometry.interleaveBuffer) passEncoder.setVertexBuffer(0, prevVertexBuffer = tMesh.geometry.interleaveBuffer.GPUBuffer);
			if (prevIndexBuffer != tMesh.geometry.indexBuffer) passEncoder.setIndexBuffer(prevIndexBuffer = tMesh.geometry.indexBuffer.GPUBuffer);

			if (tMaterial.bindings) {
				if (!tMesh.GPUBindGroup) {
					tMaterial.bindings[0]['resource']['buffer'] = tMesh.uniformBuffer.GPUBuffer;
					tMesh.GPUBindGroup = redGPU.device.createBindGroup(tMaterial.uniformBindGroupDescriptor)
				}
				if (prevBindBuffer != tMesh.GPUBindGroup) passEncoder.setBindGroup(1, prevBindBuffer = tMesh.GPUBindGroup);
				passEncoder.drawIndexed(tMesh.geometry.indexBuffer.indexNum, 1, 0, 0, 0);

			} else {
				tMesh.GPUBindGroup = null
				tMesh.pipeline = null
			}
			tMesh._prevBindings = tMaterial.bindings


		}
		passEncoder.endPass();

		const test = commandEncoder.finish();
		redGPU.device.defaultQueue.submit([test]);

	}
}