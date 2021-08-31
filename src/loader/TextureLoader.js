/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */
"use strict";
import UUID from "../base/UUID.js";
import BitmapTexture from "../resources/BitmapTexture.js";
import BitmapCubeTexture from "../resources/BitmapCubeTexture.js";

export default class TextureLoader extends UUID {
  textures = [];

  constructor(redGPUContext, srcInfoList, callback, progressCallback) {
    super();
    let loaded, check;
    srcInfoList = srcInfoList || [];
    loaded = 0;
    check = _ => {
      loaded++;
      if (progressCallback) progressCallback.call(this, {
        totalNum: srcInfoList.length,
        loaded: loaded
      });
      if (loaded == srcInfoList.length) {
        requestAnimationFrame(_ => {
          if (callback) callback.call(this, this);
        });
      }
    };
    if (srcInfoList.length) {
      srcInfoList.forEach((srcInfo, idx) => {
        let t0, tSrc, tSampler;
        let targetClass = BitmapTexture;
        if (srcInfo.hasOwnProperty('src')) {
          tSrc = srcInfo.src;
          tSampler = srcInfo.sampler;
        } else tSrc = srcInfo;

        if (tSrc instanceof Array) targetClass = BitmapCubeTexture;
        t0 = {
          src: tSrc,
          texture: null,
          loadEnd: false,
          loadSuccess: false,
          userInfo: srcInfo
        };
        t0.texture = new targetClass(
          redGPUContext, tSrc, tSampler, true,
          function (e) {
            // console.log('onload', this);
            t0.loadSuccess = true;
            t0.loadEnd = true;
            check();
          },
          function (e) {
            // console.log('onerror', this, e);
            t0.loadSuccess = false;
            t0.loadEnd = true;
            check();
          }
        );
        // console.log(t0)
        this.textures.push(t0);
      });
    } else {
      requestAnimationFrame(_ => {
        if (callback) callback.call(this, this);
      });
    }

    // console.log(this)
  }

  getTextureByIndex(index) {
    if (this.textures[index]) return this.textures[index].texture;
  }
}
