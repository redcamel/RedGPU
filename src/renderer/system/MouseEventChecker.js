/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 16:13:31
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
    });
  }

};
export default class MouseEventChecker extends UUID {

  static mouseMAP = {};
  #currentPickedArrayBuffer;
  #currentPickedMouseID;
  #fireList = [];
  #redView;
  #prevInfo;

  constructor(redView) {
    super();
    this.#redView = redView;
  };

  #_mouseEventInfo = [];

  get mouseEventInfo() {
    return this.#_mouseEventInfo;
  }

  checkMouseEvent = function (redGPUContext, pickedMouseID) {

    let i, len;
    i = 0;
    len = this.#_mouseEventInfo.length;
    // console.log(this.#mouseEventInfo.length,this.#mouseEventInfo)
    for (i; i < len; i++) {
      let canvasMouseEvent = this.#_mouseEventInfo[i];
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
            });
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
            });
          }
        }
        if (this.#prevInfo && this.#prevInfo != meshEventData) {
          tEventType = 'out';
          // console.log('아웃');
          if (tEventType && this.#prevInfo[tEventType]) {
            this.#prevInfo[tEventType].call(this.#prevInfo['target'], {
              target: this.#prevInfo['target'],
              type: tEventType
            });
          }
        }
        if (this.#prevInfo != meshEventData) {
          tEventType = 'over';
          if (tEventType && meshEventData[tEventType]) {
            meshEventData[tEventType].call(meshEventData['target'], {
              target: meshEventData['target'],
              type: tEventType,
              nativeEvent: canvasMouseEvent.nativeEvent
            });
          }
          // console.log('오버')
        }
        this.#prevInfo = meshEventData;
      } else {
        tEventType = 'out';
        if (this.#prevInfo && this.#prevInfo[tEventType]) {
          // console.log('아웃');
          this.#fireList.push(
            {
              info: this.#prevInfo,
              type: tEventType,
              nativeEvent: canvasMouseEvent.nativeEvent
            }
          );
        }
        this.#prevInfo = null;
      }
      fireEvent(this.#fireList);
    }
    if (this.#prevInfo) this.cursorState = 'pointer';
    else this.cursorState = 'default';
    this.#_mouseEventInfo.length = 0;
    // console.log(this.#mouseEventInfo)

  };

  check = (redGPUContext) => {
    if (!this.#currentPickedArrayBuffer) {
      this.#currentPickedArrayBuffer = this.#redView.readPixelArrayBuffer(redGPUContext, this.#redView, this.#redView.baseAttachment_mouseColorID_depth_ResolveTarget, this.#redView.mouseX, this.#redView.mouseY);

      this.#currentPickedArrayBuffer.then(arrayBuffer => {
        console.log(Math.round(new Float32Array(arrayBuffer)[0]))
        this.#currentPickedArrayBuffer = null;
        this.#currentPickedMouseID = Math.round(new Float32Array(arrayBuffer)[0]);
        this.checkMouseEvent(redGPUContext, this.#currentPickedMouseID);
      });
    }
    return this.cursorState;
  };
}
