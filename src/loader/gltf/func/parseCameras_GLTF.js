/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.14 19:2:51
 *
 */

"use strict";
import RedGPUContext from "../../../RedGPUContext.js";
import Camera3D from "../../../controller/Camera3D.js";

let parseCameras_GLTF = function (redGLTFLoader, json) {
  if (RedGPUContext.useDebugConsole) console.log(json);
  if (json['cameras']) {
    json['cameras'].forEach(function (v) {
      console.log('카메라', v);
      let t0 = new Camera3D(redGLTFLoader['redGPUContext']);
      if (v['type'] == 'orthographic') {
        t0.mode2DYn = true;
      } else {
        t0['fov'] = v['perspective']['yfov'] * 180 / Math.PI;
        t0['farClipping'] = v['perspective']['zfar'];
        t0['nearClipping'] = v['perspective']['znear'];
      }
      redGLTFLoader['parsingResult']['cameras'].push(t0);
    });
  }
};

export default parseCameras_GLTF;
