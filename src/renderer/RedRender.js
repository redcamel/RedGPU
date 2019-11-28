/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.28 10:21:10
 *
 */

let renderScene = (redGPU, redView, passEncoder, parent, parentDirty) => {
	let i;
	let targetList = parent.children;
	let tGeometry;
	let tMaterial;
	let tMesh;
	let tDirty;
	let tMaterialDirty;
	let tPipeline;
	let prevPipeline_UUID;
	let prevVertexBuffer_UUID;
	let prevIndexBuffer_UUID;
	i = targetList.length;
	while (i--) {
		tMesh = targetList[i];
		tMaterial = tMesh._material;
		tGeometry = tMesh._geometry;
		tDirty = tMesh._dirtyTransform;
		tPipeline = tMesh.pipeline
		if (tDirty || parentDirty) {
			// TODO 매트릭스 계산부분을 여기로 나중에 다들고 오는게 성능에 좋음...
			tMesh.calcTransform(parent);
			tMesh.updateUniformBuffer();
		}
		tMaterialDirty = tMesh._prevMaterialUUID != tMaterial._UUID;
		if (!tPipeline.GPURenderPipeline || tMaterialDirty) {
			tPipeline.updatePipeline(redGPU, redView);
		}

		if (tMaterial.bindings) {
			if (!tMesh.uniformBindGroup.GPUBindGroup) tMesh.uniformBindGroup.setGPUBindGroup(tMesh, tMaterial);

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
			passEncoder.setBindGroup(2, tMesh.uniformBindGroup.GPUBindGroup); // 바인드 그룹은 매 매쉬마다 다르므로 캐싱할 필요가 없음.
			if (tGeometry.indexBuffer) passEncoder.drawIndexed(tGeometry.indexBuffer.indexNum, 1, 0, 0, 0);
			else passEncoder.draw(tGeometry.interleaveBuffer.vertexCount, 1, 0, 0, 0);

		} else {
			tMesh.uniformBindGroup.clear();
			tPipeline.GPURenderPipeline = null;
		}
		tMesh._prevMaterialUUID = tMaterial._UUID;
		if (tMesh.children.length) renderScene(redGPU, passEncoder, tMesh, parentDirty || tDirty);
		tMesh._dirtyTransform = false;
	}
};
export default class RedRender {
	#redGPU;
	#swapChainTexture;
	#textureView;
	#renderView = (redGPU, redView) => {
		let tScene, tSceneBackgroundColor_rgba;
		tScene = redView.scene;
		tSceneBackgroundColor_rgba = tScene.backgroundColorRGBA;

		redView.camera.update();
		// console.log(swapChain.getCurrentTexture())
		const renderPassDescriptor = {
			colorAttachments: [{
				attachment: this.#redGPU.baseTextureView,
				resolveTarget: this.#textureView,
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
		redView.updateSystemUniform(passEncoder, redGPU);

		if (tScene.grid) renderScene(redGPU, redView, passEncoder, {children: [tScene.grid]});
		renderScene(redGPU, redView, passEncoder, tScene);
		passEncoder.endPass();
		this.#redGPU.device.defaultQueue.submit([commandEncoder.finish()]);
	};


	render(time, redGPU, redView) {
		this.#redGPU = redGPU;
		this.#swapChainTexture = redGPU.swapChain.getCurrentTexture();
		this.#textureView = this.#swapChainTexture.createView();
		this.#renderView(redGPU, redView)
	}
}