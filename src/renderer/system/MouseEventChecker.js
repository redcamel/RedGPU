/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.6 16:46:54
 *
 */

"use strict";

import UUID from "../../base/UUID.js";


let fireEvent = function (fireList) {
	if (fireList.length) {
		// console.log(fireList)
		let v = fireList.shift();
		v['info'][v['type']].call(v['info']['target'], {
			target: v['info']['target'],
			type: 'out'
		})
	}

};
export default class MouseEventChecker extends UUID {
	static mouseEventInfo = [];
	static mouseMAP = {};
	currentPickedArrayBuffer;
	currentPickedMouseID;
	fireList = [];
	prevInfo;
	checkMouseEvent = function (redGPUContext, pickedMouseID, lastYn) {

		let i, len;
		i = 0;
		len = MouseEventChecker.mouseEventInfo.length;
		// console.log(MouseEventChecker.mouseEventInfo.length,MouseEventChecker.mouseEventInfo)
		for (i; i < len; i++) {
			let canvasMouseEvent = MouseEventChecker.mouseEventInfo[i];
			// 마우스 이벤트 체크
			let meshEventData;
			if (pickedMouseID) meshEventData = MouseEventChecker.mouseMAP[pickedMouseID];
			let tEventType;
			if (meshEventData) {
				if (canvasMouseEvent['type'] == redGPUContext.detector.down) {
					tEventType = 'down';
					console.log('다운', tEventType, meshEventData);
					if (tEventType && meshEventData[tEventType]) {
						meshEventData[tEventType].call(meshEventData['target'], {
							target: meshEventData['target'],
							type: tEventType,
							nativeEvent: canvasMouseEvent.nativeEvent
						})
					}
				}
				if (canvasMouseEvent['type'] == redGPUContext.detector.up) {
					tEventType = 'up';
					// console.log('업');
					if (tEventType && meshEventData[tEventType]) {
						meshEventData[tEventType].call(meshEventData['target'], {
							target: meshEventData['target'],
							type: tEventType,
							nativeEvent: canvasMouseEvent.nativeEvent
						})
					}
				}
				if (this.prevInfo && this.prevInfo != meshEventData) {
					tEventType = 'out';
					// console.log('아웃');
					if (tEventType && this.prevInfo[tEventType]) {
						this.prevInfo[tEventType].call(this.prevInfo['target'], {
							target: this.prevInfo['target'],
							type: tEventType
						})
					}
				}
				if (this.prevInfo != meshEventData) {
					tEventType = 'over';
					if (tEventType && meshEventData[tEventType]) {
						meshEventData[tEventType].call(meshEventData['target'], {
							target: meshEventData['target'],
							type: tEventType,
							nativeEvent: canvasMouseEvent.nativeEvent
						})
					}
					// console.log('오버')
				}
				this.prevInfo = meshEventData
			} else {
				tEventType = 'out';
				if (this.prevInfo && this.prevInfo[tEventType]) {
					// console.log('아웃');
					this.fireList.push(
						{
							info: this.prevInfo,
							type: tEventType,
							nativeEvent: canvasMouseEvent.nativeEvent
						}
					)
				}
				this.prevInfo = null
			}
			fireEvent(this.fireList)
		}
		if (this.prevInfo) this.cursorState = 'pointer';
		else this.cursorState = 'default'
		if(lastYn) MouseEventChecker.mouseEventInfo.length = 0;
		// console.log(MouseEventChecker.mouseEventInfo)

	};
	#redView;
	constructor(redView) {
		super()
		this.#redView =redView;
	};
	check = (redGPUContext, lastYn) => {
		if (!this.currentPickedArrayBuffer) {
			this.currentPickedArrayBuffer = this.#redView.readPixelArrayBuffer(redGPUContext, this.#redView, this.#redView.baseAttachment_mouseColorID_depth_ResolveTarget, this.#redView.mouseX, this.#redView.mouseY);
			this.currentPickedArrayBuffer.then(arrayBuffer => {
				this.currentPickedArrayBuffer = null;
				this.currentPickedMouseID = Math.round(new Float32Array(arrayBuffer)[0]);
				this.checkMouseEvent(redGPUContext, this.currentPickedMouseID, lastYn)
			})
		}
		return this.cursorState
	}
}