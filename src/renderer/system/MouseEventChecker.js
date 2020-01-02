/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 14:26:4
 *
 */

"use strict";

import UUID from "../../base/UUID.js";

let fireList = [];
let prevInfo = {};
let cursorState;
let i, len;
let fireEvent = function () {
	if (fireList.length) {
		// console.log(fireList)
		let v = fireList.shift();
		v['info'][v['type']].call(v['info']['target'], {
			target: v['info']['target'],
			type: 'out'
		})
	}

};
let currentPickedArrayBuffer;
let currentPickedMouseID;
let checkMouseEvent = function (redGPUContext, pickedMouseID) {
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
			if (prevInfo && prevInfo != meshEventData) {
				tEventType = 'out';
				// console.log('아웃');
				if (tEventType && prevInfo[tEventType]) {
					prevInfo[tEventType].call(prevInfo['target'], {
						target: prevInfo['target'],
						type: tEventType
					})
				}
			}
			if (prevInfo != meshEventData) {
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
			prevInfo = meshEventData
		} else {
			tEventType = 'out';
			if (prevInfo && prevInfo[tEventType]) {
				// console.log('아웃');
				fireList.push(
					{
						info: prevInfo,
						type: tEventType,
						nativeEvent: canvasMouseEvent.nativeEvent
					}
				)
			}
			prevInfo = null
		}


		fireEvent()
	}
	if (prevInfo) cursorState = 'pointer';
	redGPUContext.canvas.style.cursor = cursorState;
	MouseEventChecker.mouseEventInfo.length = 0;
	cursorState = 'default'

};
export default class MouseEventChecker extends UUID{
	static mouseEventInfo = [];
	static mouseMAP = {};
	constructor() {
		super()
	};
	check = (redGPUContext,redView) => {
		if (!currentPickedArrayBuffer) {
			currentPickedArrayBuffer = redView.readPixelArrayBuffer(redGPUContext, redView, redView.baseAttachment_mouseColorID_depth_ResolveTarget, redView.mouseX, redView.mouseY);
			currentPickedArrayBuffer.then(arrayBuffer => {
				currentPickedArrayBuffer = null;
				currentPickedMouseID = Math.round(new Float32Array(arrayBuffer)[0]);
				checkMouseEvent(redGPUContext, currentPickedMouseID)
			})
		}
	}
}