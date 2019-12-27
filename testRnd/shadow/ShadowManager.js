/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.27 19:6:22
 *
 */

"use strict";
import Render from "../../src/renderer/Render.js";

export default class ShadowManager {
	#directionalShadow;
	get directionalShadow() {return this.#directionalShadow;}
	set directionalShadow(value) {this.#directionalShadow = value;}
	constructor() {

	}
	render(redGPUContext, redView) {
		if(this.#directionalShadow){
			const commandEncoder_effect = redGPUContext.device.createCommandEncoder();
			const passEncoder_effect = commandEncoder_effect.beginRenderPass(
				{
					colorAttachments: [{
						attachment: this.#directionalShadow.baseAttachmentView,
						loadValue: {r: 0, g: 0, b: 0, a: 0}
					}]
				}
			);
			// 파이프라인 생성하고
			// 쿼드메쉬는 쉐도우가 가져야하는군?
			Render.clearStateCache()
			// TODO 여기에 뭔가 시스템버퍼랑
			// 실제 렌더 로직들어가야함
			passEncoder_effect.endPass();
			redGPUContext.device.defaultQueue.submit([commandEncoder_effect.finish()]);
		}

	}
}