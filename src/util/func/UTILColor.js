/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.2 21:31:8
 *
 */

"use strict";
import UTIL from "../UTIL.js";

export default {
  rgb2hex: (red, green, blue) => {
    let rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
  },
  regHex: (function () {
    const reg = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    return function (hex) {
      return reg.test(hex);
    };
  })(),
  hexToRGB_ZeroToOne: function (hex) {
    let t0, t1;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      t1 = [];
      t0 = hex.substring(1).split('');
      if (t0.length === 3) t0 = [t0[0], t0[0], t0[1], t0[1], t0[2], t0[2]];
      t0 = '0x' + t0.join('');
      t1[0] = ((t0 >> 16) & 255) / 255;
      t1[1] = ((t0 >> 8) & 255) / 255;
      t1[2] = (t0 & 255) / 255;
      return t1;
    } else UTIL.throwFunc('RedGLUtil.hexToRGB_ZeroToOne : 잘못된 hex값입니다.', hex);
  }
};
