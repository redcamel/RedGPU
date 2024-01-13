/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */

import Camera3D from "./Camera3D.js";
import glMatrix from "../base/gl-matrix-min.js";

export default class ObitController extends Camera3D {
  #centerX = 0;
  #centerY = 0;
  #centerZ = 0;
  //
  #distance = 10;
  #speedDistance = 1;
  #delayDistance = 0.1;
  //
  #speedRotation = 3;
  #delayRotation = 0.1;
  //
  #tilt = -45;
  #minTilt = -90;
  #maxTilt = 90;
  #pan = 0;
  //
  #currentPan = 0;
  #currentTilt = 0;
  currentDistance = 0;
  //
  #needUpdate = true;
  targetView;

  constructor(redGPUContext) {
    super(redGPUContext);
    (_ => {
      let HD_down, HD_Move, HD_up, HD_wheel;
      let sX, sY;
      let mX, mY;
      let tX_key, tY_key;
      let tMove, tUp, tDown;
      let checkArea;
      checkArea = e => {
        let targetView = this.targetView;
        if (targetView) {
          let tX, tY;
          let tViewRect = targetView['viewRect'];
          tX = e[tX_key];
          tY = e[tY_key];
          // console.log(tViewRect);
          // console.log(tX,tY);
          if (!(tViewRect[0] < tX && tX < tViewRect[0] + tViewRect[2])) return;
          if (!(tViewRect[1] < tY && tY < tViewRect[1] + tViewRect[3])) return;
        }
        return true;
      };
      tMove = redGPUContext.detector.move;
      tUp = redGPUContext.detector.up;
      tDown = redGPUContext.detector.down;
      sX = 0;
      sY = 0;
      mX = 0;
      mY = 0;
      tX_key = 'layerX';
      tY_key = 'layerY';
      HD_down = e => {
        if (!checkArea(e)) return;
        if (this.#needUpdate) {
          sX = e[tX_key];
          sY = e[tY_key];
          redGPUContext['canvas'].addEventListener(tMove, HD_Move);
          window.addEventListener(tUp, HD_up);
        }
      };
      HD_Move = e => {
        if (!checkArea(e)) return;
        if (this.#needUpdate) {
          mX = e[tX_key] - sX;
          mY = e[tY_key] - sY;
          sX = e[tX_key];
          sY = e[tY_key];
          this.#pan -= mX * this.#speedRotation * 0.1;
          this.#tilt -= mY * this.#speedRotation * 0.1;
        }
      };
      HD_up = e => {
        redGPUContext['canvas'].removeEventListener(tMove, HD_Move);
        window.removeEventListener(tUp, HD_up);
      };
      HD_wheel = e => {
        if (this.#needUpdate) {
          if (!checkArea(e)) return;
          this.#distance += e['deltaY'] / 100 * this.#speedDistance;
        }
      };
      redGPUContext['canvas'].addEventListener(tDown, HD_down);
      redGPUContext['canvas'].addEventListener('wheel', HD_wheel);
    })(this);
  };

  get needUpdate() { return this.#needUpdate; }

  set needUpdate(value) { this.#needUpdate = value; }

  get centerX() { return this.#centerX; }

  set centerX(value) { this.#centerX = value; }

  get centerY() { return this.#centerY; }

  set centerY(value) { this.#centerY = value; }

  get centerZ() { return this.#centerZ; }

  set centerZ(value) { this.#centerZ = value; }

  get distance() { return this.#distance; }

  set distance(value) { this.#distance = value; }

  get speedDistance() { return this.#speedDistance; }

  set speedDistance(value) { this.#speedDistance = value; }

  get delayDistance() { return this.#delayDistance; }

  set delayDistance(value) { this.#delayDistance = value; }

  get speedRotation() { return this.#speedRotation; }

  set speedRotation(value) { this.#speedRotation = value; }

  get delayRotation() { return this.#delayRotation; }

  set delayRotation(value) { this.#delayRotation = value; }

  get minTilt() { return this.#minTilt; }

  set minTilt(value) { this.#minTilt = value; }

  get maxTilt() { return this.#maxTilt; }

  set maxTilt(value) { this.#maxTilt = value; }

  get pan() { return this.#pan; }

  set pan(value) { this.#pan = value; }

  get tilt() { return this.#tilt; }

  set tilt(value) { this.#tilt = value; }

  update(redView) {
    let tDelayRotation;
    let tMTX0;
    let PER_PI;
    PER_PI = Math.PI / 180;
    if (!this.#needUpdate) return;
    if (this.#tilt < this.#minTilt) this.#tilt = this.#minTilt;
    if (this.#tilt > this.#maxTilt) this.#tilt = this.#maxTilt;
    tDelayRotation = this.#delayRotation;

    tMTX0 = this.matrix;
    this.#currentPan += (this.#pan - this.#currentPan) * tDelayRotation;
    this.#currentTilt += (this.#tilt - this.#currentTilt) * tDelayRotation;
    if (this.#distance < this.nearClipping) this.#distance = this.nearClipping;
    this.currentDistance += (this.#distance - this.currentDistance) * this.#delayDistance;
    if (this.currentDistance < this.nearClipping) this.currentDistance = this.nearClipping;
    glMatrix.mat4.identity(tMTX0);
    glMatrix.mat4.translate(tMTX0, tMTX0, [this.#centerX, this.#centerY, this.#centerZ]);
    glMatrix.mat4.rotateY(tMTX0, tMTX0, this.#currentPan * PER_PI);
    glMatrix.mat4.rotateX(tMTX0, tMTX0, this.#currentTilt * PER_PI);
    glMatrix.mat4.translate(tMTX0, tMTX0, [0, 0, this.currentDistance]);
    this.x = tMTX0[12];
    this.y = tMTX0[13];
    this.z = tMTX0[14];
    this.lookAt(this.#centerX, this.#centerY, this.#centerZ);
    // console.log('tilt', this.#tilt, 'pan', this.#pan)
    // console.log('ObitController update')
  }
}
