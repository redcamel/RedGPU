/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.20 18:6:15
 *
 */

"use strict";
import UUID from "../../base/UUID.js";
import Mesh from "../../object3D/Mesh.js";
import UTIL from "../../util/UTIL.js";
import RedGPUContext from "../../RedGPUContext.js";
import TextureLoader from "../TextureLoader.js";
import gltfAnimationLooper from "./func/gltfAnimationLooper.js";
import parseAnimation_GLTF from "./func/parseAnimation_GLTF.js";
import parseCameras_GLTF from "./func/parseCameras_GLTF.js";
import parseScene_GLTF from "./func/parseScene_GLTF.js";

var GLTFLoader;
(function () {
  var parser;
  /*DOC:
   {
     constructorYn : true,
     title :`GLTFLoader`,
     description : `
       GLTF 로더.
       애니메이션 지원함.
     `,
     params : {
       redGPUContext : [
         {type:'RedGL'}
       ],
       path : [
         {type:'String'},
         '파일이 위치한 경로'
       ],
       fileName : [
         {type:'String'},
         '파일이름'
       ],
       callback : [
         {type:'Function'},
         '로딩완료시 실행될 콜백'
       ]
     },
     example : `
      // GLTF 로딩
      GLTFLoader(
        RedGL Instance, // redGPUContext
        assetPath + 'glTF/basic/', // assetRootPath
        'DamagedHelmet.gltf', // fileName
        function (v) { // callBack
          tScene.addChild(v['resultMesh'])
        },
        BitmapCubeTexture( // environmentTexture
          RedGL Instance,
          [
            assetPath + 'cubemap/posx.png',
            assetPath + 'cubemap/negx.png',
            assetPath + 'cubemap/posy.png',
            assetPath + 'cubemap/negy.png',
            assetPath + 'cubemap/posz.png',
            assetPath + 'cubemap/negz.png'
          ]
        )
      );
     `,
     demo : '../example/loader/gltf/GLTFLoader.html',
     return : 'void'
   }
   :DOC*/
  var fileLoader = (function () {
    var cache = {};
    return function (src, type, onLoader, onError) {
      if (cache[src]) {
        requestAnimationFrame(function () {
          onLoader(cache[src]);
        });
      } else {
        var request = new XMLHttpRequest();
        request.open("GET", src, true);
        // request.overrideMimeType('model/gltf+json')
        // request.setRequestHeader("Content-Type", (type ? type : "application/xml; ") + 'charset=UTF-8')
        request.onreadystatechange = function (e) {
          if (request.readyState === 4 && request.status === 200) {
            if (RedGPUContext.useDebugConsole) console.log(request);
            cache[src] = request;
            onLoader(request);
          } else {
            onError(request, e);
          }
        };
        request.send();
      }
    };
  })();
  var arrayBufferLoader = (function () {
    var cache = {};
    return function (src, onLoader, onError) {
      if (cache[src]) {
        requestAnimationFrame(function () {
          onLoader(cache[src]);
        });
      } else {
        var request = new XMLHttpRequest();
        request.open("GET", src, true);
        request.overrideMimeType('application/octet-stream');
        request.responseType = "arraybuffer";
        request.onreadystatechange = function (e) {
          if (request.readyState === 4 && request.status === 200) {
            if (RedGPUContext.useDebugConsole) console.log(request);
            cache[src] = request;
            onLoader(request);
          } else {
            onError(request, e);
          }
        };
        request.send();
      }
    };
  })();
  GLTFLoader = function (redGPUContext, path, fileName, callback, environmentTexture, parsingOption) {
    if ((!(this instanceof GLTFLoader))) return new GLTFLoader(redGPUContext, path, fileName, callback, environmentTexture, parsingOption);
    this.redGPUContext = redGPUContext;
    var self = this;
    if (fileName.indexOf('.glb') > -1) {
      /////////////////////////
      var BINPACKER_HEADER_MAGIC = 'BINP';
      var BINPACKER_HEADER_LENGTH = 12;
      var BINPACKER_CHUNK_TYPE_JSON = 0x4e4f534a;
      var BINPACKER_CHUNK_TYPE_BINARY = 0x004e4942;
      var convertUint8ArrayToString;
      convertUint8ArrayToString = function (array) {
        var str = '';
        array.map(function (item) {
          str += String.fromCharCode(item);
        });
        return str;
      };
      /////////////////////////
      arrayBufferLoader(
        path + fileName,
        function (request) {
          console.log(request['response']);
          var content = null;
          var contentArray = null;
          var body = null;
          var byteOffset = null;

          var chunkIndex = 0;
          var chunkLength = 0;
          var chunkType = null;

          var headerView = new DataView(request['response'], BINPACKER_HEADER_LENGTH);
          var header = {
            magic: convertUint8ArrayToString(new Uint8Array(request['response'], 0, 4)),
            version: headerView.getUint32(4, true),
            length: headerView.getUint32(8, true)
          };
          console.log(headerView);
          console.log(header);

          var chunkView = new DataView(request['response'], BINPACKER_HEADER_LENGTH);

          while (chunkIndex < chunkView.byteLength) {
            chunkLength = chunkView.getUint32(chunkIndex, true);
            chunkIndex += 4;

            chunkType = chunkView.getUint32(chunkIndex, true);
            chunkIndex += 4;

            if (chunkType === BINPACKER_CHUNK_TYPE_JSON) {
              contentArray = new Uint8Array(
                request['response'],
                BINPACKER_HEADER_LENGTH + chunkIndex,
                chunkLength
              );
              content = convertUint8ArrayToString(contentArray);
            } else if (chunkType === BINPACKER_CHUNK_TYPE_BINARY) {
              byteOffset = BINPACKER_HEADER_LENGTH + chunkIndex;
              body = request['response'].slice(byteOffset, byteOffset + chunkLength);
            }

            chunkIndex += chunkLength;
          }

          if (content === null) {
            throw new Error('JSON content not found');
          }

          var jsonChunk = JSON.parse(content);
          var binaryChunk = body;
          if (jsonChunk['images']) {
            jsonChunk['images'].forEach(function (v) {
              if (v['mimeType'] === 'image/png' || v['mimeType'] === 'image/jpeg' || v['mimeType'] === 'image/gif') {
                var tS, tE;
                tS = jsonChunk['bufferViews'][v['bufferView']]['byteOffset'] || 0;
                var tt = binaryChunk.slice(
                  tS,
                  tS + jsonChunk['bufferViews'][v['bufferView']]['byteLength']
                );

                var test = new Blob([new Uint8Array(tt)], {
                  type: v['mimeType']
                });
                v['uri'] = URL.createObjectURL(test);


              }
            });
          }
          parser(self, redGPUContext, jsonChunk, function () {
            if (callback) {
              if (RedGPUContext.useDebugConsole) console.log('Model parsing has ended.');
              callback(self);
            }
          }, binaryChunk);
        },
        function (request, error) {
          console.log(request, error);
        }
      );
    } else {
      fileLoader(
        path + fileName,
        null,
        function (request) {

          parser(self, redGPUContext, JSON.parse(request['response']), function () {
            if (callback) {
              if (RedGPUContext.useDebugConsole) console.log('Model parsing has ended.');
              callback(self);
            }
          });
        },
        function (request, error) {
          if (RedGPUContext.useDebugConsole) console.log(request, error);
        }
      );
    }

    this['redGPUContext'] = redGPUContext;
    this['path'] = path;
    this['fileName'] = fileName;
    this['resultMesh'] = new Mesh(redGPUContext);
    this['resultMesh']['name'] = 'instanceOfGLTFLoader_' + UUID.getNextUUID();
    this['parsingResult'] = {
      groups: [],
      materials: [],
      uris: {
        buffers: []
      },
      textures: {},
      textureRawList: [],
      cameras: [],
      animations: []
    };
    this['parsingOption'] = parsingOption;
    this['environmentTexture'] = environmentTexture || null;
    var _currentAnimationInfo = null;
    this['stopAnimation'] = function () {
      console.log('_currentAnimationInfo', _currentAnimationInfo, loopList.indexOf(_currentAnimationInfo));
      if (loopList.indexOf(_currentAnimationInfo) > -1) {
        loopList.splice(loopList.indexOf(_currentAnimationInfo), 1);
      }
      console.log('loopList', loopList);
    };
    this['playAnimation'] = function (animationData) {
      loopList.push(
        _currentAnimationInfo = {
          startTime: performance.now(),
          targetAnimationData: animationData
        }
      );
    };
    if (RedGPUContext.useDebugConsole) console.log(this);
  };

  var loopList = [];
  GLTFLoader['animationLooper'] = time => gltfAnimationLooper(time, loopList);
  parser = (function () {
    var checkAsset;
    var getBufferResources;
    /*
      glTF는 asset 속성이 있어야한다.
      최소한 버전을 반드시 포함해야함.
     */
    checkAsset = function (json) {
      if (json['asset'] === undefined) UTIL.throwFunc('GLTFLoader - asset은 반드시 정의되어야함');
      if (json['asset'].version[0] < 2) UTIL.throwFunc('GLTFLoader - asset의 버전은 2.0이상이어야함');
    };
    /*
    전체 데이터중 외부소스데이터를 모두 실제화 해둔다.
   */
    getBufferResources = function (redGLTFLoader, data, callback) {
      var allNum = 0, loadedNum = 0;
      data['buffers'].forEach(function (v, index) {
        v['_redURIkey'] = 'buffers';
        v['_redURIIndex'] = index;
        allNum++;
        if (v['uri'] instanceof ArrayBuffer) {
          loadedNum++;
          redGLTFLoader['parsingResult']['uris'][v['_redURIkey']][v['_redURIIndex']] = new DataView(v['uri']);
          if (loadedNum == allNum) {
            if (RedGPUContext.useDebugConsole) console.log("redGLTFLoader['parsingResult']['uris']", redGLTFLoader['parsingResult']['uris']);
            if (RedGPUContext.useDebugConsole) console.log("uris로딩현황", loadedNum, loadedNum);
            if (callback) callback();
          }
        } else {
          var tSrc = v['uri'].substr(0, 5) == 'data:' ? v['uri'] : redGLTFLoader['path'] + v['uri'];
          arrayBufferLoader(
            tSrc,
            function (request) {
              loadedNum++;
              if (RedGPUContext.useDebugConsole) console.log(request);
              redGLTFLoader['parsingResult']['uris'][v['_redURIkey']][v['_redURIIndex']] = new DataView(request.response);
              if (loadedNum == allNum) {
                if (RedGPUContext.useDebugConsole) console.log("redGLTFLoader['parsingResult']['uris']", redGLTFLoader['parsingResult']['uris']);
                if (RedGPUContext.useDebugConsole) console.log("uris로딩현황", loadedNum, loadedNum);
                if (callback) callback();
              }
            },
            function (request, error) {
              if (RedGPUContext.useDebugConsole) console.log(request, error);
            }
          );
        }
      });
    };


    return function (redGLTFLoader, redGPUContext, json, callBack, binaryChunk) {
      if (RedGPUContext.useDebugConsole) console.log('parsing start', redGLTFLoader['path'] + redGLTFLoader['fileName']);
      if (RedGPUContext.useDebugConsole) console.log('rawData', json);
      checkAsset(json);
      if (binaryChunk) {
        json.buffers[0]['uri'] = binaryChunk;
        getBufferResources(redGLTFLoader, json,
          function () {
            // 리소스 로딩이 완료되면 다음 진행
            parseCameras_GLTF(redGLTFLoader, json);
            parseScene_GLTF(redGLTFLoader, json, function () {

              new TextureLoader(
                redGLTFLoader['redGPUContext'],
                redGLTFLoader['parsingResult']['textureRawList'],
                result => {
                  result.textures.forEach(v => {
                    v.userInfo.targetMaterial[v.userInfo.targetTexture] = v.texture;
                  });
                  parseAnimation_GLTF(redGLTFLoader, json).then(_ => {
                    console.time('parseAnimation_GLTF_' + redGLTFLoader.fileName);
                    if (callBack) callBack();
                    console.timeEnd('parseAnimation_GLTF_' + redGLTFLoader.fileName);
                  });
                }
              );
            });
          }
        );
      } else {
        getBufferResources(redGLTFLoader, json,
          function () {
            // 리소스 로딩이 완료되면 다음 진행
            parseCameras_GLTF(redGLTFLoader, json);
            parseScene_GLTF(redGLTFLoader, json, function () {
              new TextureLoader(
                redGLTFLoader['redGPUContext'],
                redGLTFLoader['parsingResult']['textureRawList'],
                result => {
                  result.textures.forEach(v => {
                    v.userInfo.targetMaterial[v.userInfo.targetTexture] = v.texture;
                  });

                  parseAnimation_GLTF(redGLTFLoader, json).then(_ => {
                    console.time('parseAnimation_GLTF_' + redGLTFLoader.fileName);
                    if (callBack) callBack();
                    console.timeEnd('parseAnimation_GLTF_' + redGLTFLoader.fileName);
                  });

                }
              );
            });
          }
        );
      }
    };
  })();
  // Object.freeze(GLTFLoader);
})();
export default GLTFLoader;
