/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.26 17:47:56
 *
 */


function createWorker(f) {
  return new Worker(URL.createObjectURL(new Blob([`(${f})()`], {type: 'application/javascript'})));
}

const workerImage = createWorker(async () => {
    /////////////////////////////////////////////////////////////////////////////
  let getImage = (_ => {
    let nextHighestPowerOfTwo = (function () {
      let i;
      return v => {
        --v;
        for (i = 1; i < 32; i <<= 1) v = v | v >> i;
        return v + 1;
      };
    })();
    return data => {
      const src = data.src;
      let errorInfo;
      fetch(src, {mode: 'cors'})
        .then(response => {
          errorInfo = {
            url: response.url,
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            type: response.type
          };
          if (!response.ok) throw new Error('error');
          response.blob()
            .then(blob => self.createImageBitmap(blob))
            .then(bitmap => {
              let faceWidth = nextHighestPowerOfTwo(bitmap.width);
              let faceHeight = nextHighestPowerOfTwo(bitmap.height);
              if (faceWidth > 1920) faceWidth = 1920;
              if (faceHeight > 1920) faceHeight = 1920;
              // console.log(data)
              let imageDatas = [];
              let mipIndex = 0, len = Math.round(Math.log2(Math.max(faceWidth, faceHeight)));
              let getMipmapDatas = img => {
                const cvs = new OffscreenCanvas(faceWidth, faceHeight);
                const ctx = cvs.getContext('2d');
                ctx.fillStyle = 'rgba(0,0,0,0)';
                ctx.fillRect(0, 0, faceWidth, faceHeight);
                ctx.drawImage(img, 0, 0, faceWidth, faceHeight);
                let imageData = ctx.getImageData(0, 0, faceWidth, faceHeight).data;
                let data;
                const bytesPerRow = Math.ceil(faceWidth * 4 / 256) * 256;
                if (bytesPerRow == faceWidth * 4) data = imageData;
                else {
                  data = new Uint8ClampedArray(bytesPerRow * faceHeight);
                  let pixelsIndex = 0;
                  for (let y = 0; y < faceHeight; ++y) {
                    for (let x = 0; x < faceWidth; ++x) {
                      let i = x * 4 + y * bytesPerRow;
                      data[i] = imageData[pixelsIndex];
                      data[i + 1] = imageData[pixelsIndex + 1];
                      data[i + 2] = imageData[pixelsIndex + 2];
                      data[i + 3] = imageData[pixelsIndex + 3];
                      pixelsIndex += 4;
                    }
                  }
                }
                imageDatas.push({
                  data: data.buffer,
                  width: faceWidth,
                  height: faceHeight,
                  bytesPerRow: bytesPerRow
                });
                faceWidth = Math.max(Math.floor(faceWidth / 2), 1);
                faceHeight = Math.max(Math.floor(faceHeight / 2), 1);
                mipIndex++;
                if (mipIndex == len + 1) self.postMessage({src, imageDatas: imageDatas, ok: true});
                else getMipmapDatas(cvs);
              };
              getMipmapDatas(bitmap);
            });
        }).catch(error => {
        self.postMessage({
          error: errorInfo,
          src: src
        });
      });
    };
  })();
  self.addEventListener('message', e => {
    // console.log('뭐가오지?', e)
    getImage(e.data);
  });
});
const workerGLSLCompile = createWorker(async () => {
    let glslangModule = await import(/* webpackIgnore: true */ 'https://unpkg.com/@webgpu/glslang@0.0.15/dist/web-devel/glslang.js');
  let glslang = await glslangModule.default();
  let twgslLib
  let checkTwgsl = async function () {
    return new Promise(async (resolve) => {
      if (!twgslLib) {
        await import(/* webpackIgnore: true */ 'https://preview.babylonjs.com/twgsl/twgsl.js');
        // await import(/* webpackIgnore: true */ 'https://redcamel.github.io/RedGPU/libs/twgsl.js');
        console.log('twgsl2',twgsl)
        twgslLib = twgsl;
      }
      resolve();
    });
  };
  await checkTwgsl().then(_=>{
    return twgslLib('https://preview.babylonjs.com/twgsl/twgsl.wasm')
    // return twgslLib('https://redcamel.github.io/RedGPU/libs/twgsl.wasm')
  }).then(twgsl => {
    let combinations = (_ => {
      let k_combinations = (set, k) => {
        let i, j, combs, head, tailcombs;
        if (k > set.length || k <= 0) return [];
        if (k === set.length) return [set];
        if (k === 1) {
          combs = [];
          for (i = 0; i < set.length; i++) combs.push([set[i]]);
          return combs;
        }
        combs = [];
        for (i = 0; i < set.length - k + 1; i++) {
          head = set.slice(i, i + 1);
          tailcombs = k_combinations(set.slice(i + 1), k - 1);
          for (j = 0; j < tailcombs.length; j++) combs.push(head.concat(tailcombs[j]));
        }
        return combs;
      };
      return set => {
        let k, i, combs, k_combs;
        combs = [];
        for (k = 1; k <= set.length; k++) {
          k_combs = k_combinations(set, k);
          for (i = 0; i < k_combs.length; i++) combs.push(k_combs[i]);
        }
        return combs;
      };
    })();
    let getCompileGLSL = (_ => {
      let parseSource = function (tSource, replaceList) {
        tSource = JSON.parse(JSON.stringify(tSource));
        // console.time('searchTime :' + replaceList);
        let i = replaceList.length;
        while (i--) {
          let tReg = new RegExp(`\/\/\#RedGPU\#${replaceList[i]}\#`, 'gi');
          tSource = tSource.replace(tReg, '');
        }
        // console.timeEnd('searchTime :' + replaceList);
        return tSource;
      };
      return async data => {
        const info = data.src;
        const shaderType = info.shaderType;
        const shaderName = info.shaderName;
        let originSource = info.originSource;
        let temp = {};
        let num = 0;
        //FIXME - 이부분 최적화해야함
        const tList = combinations(info.optionList.sort());
        console.log('조합을 찾아라', shaderType, shaderName, tList.length);
        // console.log(tList)
        let parse = optionList => {
          let searchKey = shaderName + '_' + optionList.join('_');
          if (!temp[searchKey]) {
            temp[searchKey] = 1;
            let parsedSource = parseSource(originSource, optionList);
            // console.time('compileGLSL - in worker : ' + num + ' / ' + shaderType + ' / ' + searchKey);
            let compileGLSL = twgsl.convertSpirV2WGSL(glslang.compileGLSL(parsedSource, shaderType)).replace(/@stride\([0-9]*\)/g,'');
            // console.timeEnd('compileGLSL - in worker : ' + num + ' / ' + shaderType + ' / ' + searchKey);
            num++;
            self.postMessage({
              endCompile: true,
              shaderName: shaderName,
              searchKey: searchKey,
              compileGLSL: compileGLSL,
              shaderType: shaderType
            });
          }
        };
        tList.forEach(newList => {
          parse(newList);
        });
        self.postMessage({
          end: true,
          shaderName: shaderName,
          shaderType: shaderType,
          totalNum: num
        });
      };
    })();

    self.addEventListener('message', e => {
      // console.log('뭐가오지?', e)
      getCompileGLSL(e.data);
    });
  })

});
const RedGPUWorker = {
  loadImageWithWorker: src => {
    return new Promise((resolve, reject) => {
      function handler(e) {
        if (e.data.src === src) {
          workerImage.removeEventListener('message', handler);
          if (e.data.error) reject(e.data.error);
          resolve(e.data);
        }
      }

      workerImage.addEventListener('message', handler);
      workerImage.postMessage({src: src, workerType: 'image'});
    });
  },
  glslParserWorker: (redGPUContext, target, shaderName, originSource, shaderType, optionList) => {
    return new Promise((resolve, reject) => {
      function handler(e) {
        if (e.data.shaderName === shaderName && e.data.shaderType === shaderType) {
          if (e.data.endCompile) {
            // console.log('오니', e.data.searchKey)
            let tSearchKey = e.data.searchKey;
            if (!target.sourceMap.has(tSearchKey)) {
              console.log('머가오는겨',e.data.searchKey,e.data)
              target.sourceMap.set(tSearchKey, (e.data.compileGLSL));
              let shaderModuleDescriptor = {
                key: tSearchKey,
                code: e.data.compileGLSL,
                // source: this.sourceMap.get(searchKey)
              };
              target.shaderModuleMap[tSearchKey] = redGPUContext.device.createShaderModule(shaderModuleDescriptor);
            }
            if (e.data.error) reject(e.data.error);
          }
          if (e.data.end) {
            workerGLSLCompile.removeEventListener('message', handler);
            resolve(e);
          }
        } else {
          // console.log('체크', e, shaderName, shaderType)
        }
      }

      workerGLSLCompile.addEventListener('message', handler);
      workerGLSLCompile.postMessage({
        src: {
          originSource: originSource,
          shaderName: shaderName,
          shaderType: shaderType,
          optionList: optionList,
        },
        workerType: 'compileGLSL'
      });
    });
  }
};
export default RedGPUWorker;
