/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.9 11:43:33
 *
 */

"use strict";
import UUID from "../base/UUID.js";

export default class SpriteSheetAction extends UUID {
  constructor(texture, frameRate = 60, segmentW = 1, segmentH = 1, totalFrame = 1) {
    super();
    this.texture = texture;
    this.frameRate = frameRate;
    this.segmentW = segmentW;
    this.segmentH = segmentH;
    this.totalFrame = totalFrame;
  }
}
