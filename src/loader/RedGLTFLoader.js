/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.13 19:11:47
 *
 */

"use strict";
import RedUUID from "../base/RedUUID.js";
import RedMesh from "../object3D/RedMesh.js";
import RedBitmapTexture from "../resources/RedBitmapTexture.js";
import RedPBRMaterial_System from "../material/system/RedPBRMaterial_System.js";
import RedInterleaveInfo from "../geometry/RedInterleaveInfo.js";
import RedGeometry from "../geometry/RedGeometry.js";
import RedBuffer from "../buffer/RedBuffer.js";
import RedUTIL from "../util/RedUTIL.js";
import RedCamera from "../controller/RedCamera.js";
import RedSampler from "../resources/RedSampler.js";

var RedGLTFLoader;
(function () {
	var parser;
	var WEBGL_COMPONENT_TYPES = {
		5120: Int8Array,
		5121: Uint8Array,
		5122: Int16Array,
		5123: Uint16Array,
		5125: Uint32Array,
		5126: Float32Array
	};
	/*DOC:
	 {
		 constructorYn : true,
		 title :`RedGLTFLoader`,
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
			RedGLTFLoader(
				RedGL Instance, // redGPUContext
				assetPath + 'glTF/basic/', // assetRootPath
				'DamagedHelmet.gltf', // fileName
				function (v) { // callBack
					tScene.addChild(v['resultMesh'])
				},
				RedBitmapCubeTexture( // environmentTexture
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
		 demo : '../example/loader/gltf/RedGLTFLoader.html',
		 return : 'void'
	 }
	 :DOC*/

	var fileLoader = (function () {
		var cache = {};
		return function (src, type, onLoader, onError) {
			if (cache[src]) {
				requestAnimationFrame(function () {
					onLoader(cache[src])
				})
			} else {
				var request = new XMLHttpRequest();
				request.open("GET", src, true);
				// request.overrideMimeType('model/gltf+json')
				// request.setRequestHeader("Content-Type", (type ? type : "application/xml; ") + 'charset=UTF-8')
				request.onreadystatechange = function (e) {
					if (request.readyState === 4 && request.status === 200) {
						console.log(request);
						cache[src] = request;
						onLoader(request)
					} else {
						onError(request, e)
					}
				};
				request.send();
			}
		}
	})();
	var arrayBufferLoader = (function () {
		var cache = {};
		return function (src, onLoader, onError) {
			if (cache[src]) {
				requestAnimationFrame(function () {
					onLoader(cache[src])
				})
			} else {
				var request = new XMLHttpRequest();
				request.open("GET", src, true);
				request.overrideMimeType('application/octet-stream');
				request.responseType = "arraybuffer";
				request.onreadystatechange = function (e) {
					if (request.readyState === 4 && request.status === 200) {
						console.log(request);
						cache[src] = request;
						onLoader(request)
					} else {
						onError(request, e)
					}
				};
				request.send();
			}
		}
	})();
	RedGLTFLoader = function (redGPUContext, path, fileName, callback, environmentTexture, parsingOption) {
		if ((!(this instanceof RedGLTFLoader))) return new RedGLTFLoader(redGPUContext, path, fileName, callback, environmentTexture, parsingOption);
		this.redGPUContext = redGPUContext;
		console.log('~~~~~~~~~~~');
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
					str += String.fromCharCode(item)
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
							console.log(v);
							if (v['mimeType'] === 'image/png' || v['mimeType'] === 'image/jpeg' || v['mimeType'] === 'image/gif') {
								console.log(binaryChunk);
								var tS, tE;
								tS = jsonChunk['bufferViews'][v['bufferView']]['byteOffset'] || 0;
								var tt = binaryChunk.slice(
									tS,
									tS + jsonChunk['bufferViews'][v['bufferView']]['byteLength']
								);

								var test = new Blob([new Uint8Array(tt)], {
									type: v['mimeType']
								});
								v['uri'] = URL.createObjectURL(test)


							}
						})
					}

					console.log(jsonChunk);
					console.log(binaryChunk);
					parser(self, redGPUContext, jsonChunk, function () {
						if (callback) {
							console.log('모델 파싱 종료');
							callback(self)
						}
					}, binaryChunk)
				},
				function (request, error) {
					console.log(request, error)
				}
			)
		} else {
			fileLoader(
				path + fileName,
				null,
				function (request) {

					parser(self, redGPUContext, JSON.parse(request['response']), function () {
						if (callback) {
							console.log('모델 파싱 종료');
							callback(self)
						}
					})
				},
				function (request, error) {
					console.log(request, error)
				}
			)
		}

		this['redGPUContext'] = redGPUContext;
		this['path'] = path;
		this['fileName'] = fileName;
		this['resultMesh'] = new RedMesh(redGPUContext);
		this['resultMesh']['name'] = 'instanceOfRedGLTFLoader_' + RedUUID.makeUUID();
		this['parsingResult'] = {
			groups: [],
			materials: [],
			uris: {
				buffers: []
			},
			textures: {},
			cameras: [],
			animations: []
		};
		this['parsingOption'] = parsingOption;
		this['environmentTexture'] = environmentTexture || null;
		var _currentAnimationInfo = null;
		this['stopAnimation'] = function () {
			console.log('_currentAnimationInfo', _currentAnimationInfo, loopList.indexOf(_currentAnimationInfo));
			if (loopList.indexOf(_currentAnimationInfo) > -1) {
				loopList.splice(loopList.indexOf(_currentAnimationInfo), 1)
			}
			console.log('loopList', loopList)
		};
		this['playAnimation'] = function (animationData) {
			loopList.push(
				_currentAnimationInfo = {
					startTime: performance.now(),
					targetAnimationData: animationData
				}
			)
			// console.log('loopList', loopList)
		};
		console.log(this)
	};

	var loopList = [];
	RedGLTFLoader['animationLooper'] = function (time) {
		// console.log('loopList',loopList)
		var currentTime, previousTime, nextTime;
		var nX, nY, nZ, nW, nXOut, nYOut, nZOut, nXIn, nYIn, nZIn, nWIn;
		var pX, pY, pZ, pW, pXOut, pYOut, pZOut, pWOut;
		var x, y, z, w, len;
		var loopListIDX = loopList.length;
		var targetAnimationData;
		var interpolationValue;
		var loopListItem;
		var targetAnimationDataIDX;
		var aniData;
		var target;
		var nextIndex, prevIndex;
		var tTimeData;
		var tAniData;
		var aniDataTime_Length;
		var aniDataTimeIDX;
		//weights
		var weights_aniTargetsIDX;
		var weights_targetMesh;
		var weights_targetData;
		var weights_originData;
		var weights_stride;
		var weights_index;
		var weights_LOOP_NUM;
		var weights_prev, weights_next;
		var weights_prev1, weights_next1;
		var weights_prev2, weights_next2;
		var weights_baseIndex;
		var weights_morphLen;
		var weights_tMorphList;
		var weights_morphIndex;
		var weights_prevAniData;
		var weights_nextAniData;
		var weights_morphInterleaveData;
		var weights_cacheKey;
		while (loopListIDX--) {
			loopListItem = loopList[loopListIDX];

			targetAnimationData = loopListItem['targetAnimationData'];
			targetAnimationDataIDX = targetAnimationData.length;
			while (targetAnimationDataIDX--) {
				aniData = targetAnimationData[targetAnimationDataIDX];
				// targetAnimationData.forEach(function (aniData) {
				currentTime = ((time - loopListItem['startTime']) % (targetAnimationData['maxTime'] * 1000)) / 1000;
				/////////////////////////////////////////////////////////////////////////////////
				target = aniData['target'];
				tTimeData = aniData['time'];
				tAniData = aniData['time'];
				aniDataTime_Length = tTimeData.length;
				aniDataTimeIDX = 0;
				prevIndex = tTimeData.length - 1;
				nextIndex = 0;
				previousTime = tTimeData[prevIndex];
				nextTime = tTimeData[nextIndex];
				for (aniDataTimeIDX; aniDataTimeIDX < aniDataTime_Length; aniDataTimeIDX++) {
					var tTime = tTimeData[aniDataTimeIDX];
					if (tTime < currentTime) {
						prevIndex = aniDataTimeIDX;
						previousTime = tTimeData[prevIndex];
						if (tTimeData[prevIndex + 1] == undefined) {
							nextIndex = 0;
							nextTime = tTimeData[nextIndex]
						} else {
							nextIndex = prevIndex + 1;
							nextTime = tTimeData[nextIndex]
						}
					}
					if (aniDataTimeIDX == 0 && (currentTime < tTimeData[aniDataTimeIDX])) {
						prevIndex = aniDataTime_Length - 1;
						previousTime = tTimeData[prevIndex];
						nextIndex = aniDataTimeIDX;
						nextTime = tTimeData[nextIndex];
						currentTime = tTime;
						break
					}
					if (aniDataTimeIDX == aniDataTime_Length - 1 && (currentTime > tTime)) {
						prevIndex = 0;
						previousTime = tTimeData[prevIndex];
						nextIndex = aniDataTime_Length - 1;
						nextTime = tTimeData[nextIndex];
						currentTime = tTime;
						break
					}
				}
				/////////////////////////////////////////////////////////////////////////////////
				if (aniData['interpolation'] == 'CUBICSPLINE') {
					interpolationValue = nextTime - previousTime;
					if (interpolationValue.toString() == 'NaN') interpolationValue = 0;
					var p = (currentTime - previousTime) / interpolationValue;
					if (p.toString() == 'NaN') p = 0;
					var pp = p * p;
					var ppp = pp * p;

					var s2 = -2 * ppp + 3 * pp;
					var s3 = ppp - pp;
					var s0 = 1 - s2;
					var s1 = s3 - pp + p;

					if (target) {
						var startV, startOut, endV, endIn;
						var tAniData_data = aniData['data'];
						switch (aniData['key']) {
							case 'rotation' :
								// quat.normalize(prevRotation, prevRotation);
								// quat.normalize(nextRotation, nextRotation);
								// quat.normalize(prevRotationOut, prevRotationOut);
								// quat.normalize(nextRotationIn, nextRotationIn);
								// prevRotation
								x = tAniData_data[prevIndex * 12 + 4];
								y = tAniData_data[prevIndex * 12 + 5];
								z = tAniData_data[prevIndex * 12 + 6];
								w = tAniData_data[prevIndex * 12 + 7];
								len = x * x + y * y + z * z + w * w;
								if (len > 0) len = 1 / Math.sqrt(len);
								pX = x * len;
								pY = y * len;
								pZ = z * len;
								pW = w * len;
								// nextRotation
								x = tAniData_data[nextIndex * 12 + 4];
								y = tAniData_data[nextIndex * 12 + 5];
								z = tAniData_data[nextIndex * 12 + 6];
								w = tAniData_data[nextIndex * 12 + 7];
								len = x * x + y * y + z * z + w * w;
								if (len > 0) len = 1 / Math.sqrt(len);
								nX = x * len;
								nY = y * len;
								nZ = z * len;
								nW = w * len;
								// prevRotationOut
								x = tAniData_data[prevIndex * 12 + 8];
								y = tAniData_data[prevIndex * 12 + 9];
								z = tAniData_data[prevIndex * 12 + 10];
								w = tAniData_data[prevIndex * 12 + 11];
								len = x * x + y * y + z * z + w * w;
								if (len > 0) len = 1 / Math.sqrt(len);
								pXOut = x * len;
								pYOut = y * len;
								pZOut = z * len;
								pWOut = w * len;
								// nexRotationIn
								x = tAniData_data[prevIndex * 12 + 0];
								y = tAniData_data[prevIndex * 12 + 1];
								z = tAniData_data[prevIndex * 12 + 2];
								w = tAniData_data[prevIndex * 12 + 3];
								len = x * x + y * y + z * z + w * w;
								if (len > 0) len = 1 / Math.sqrt(len);
								nXIn = x * len;
								nYIn = y * len;
								nZIn = z * len;
								nWIn = w * len;

								// tQuat
								if (prevIndex != aniDataTime_Length - 1) {
									startV = pX;
									startOut = pXOut * interpolationValue;
									endV = nX;
									endIn = nXIn * interpolationValue;
									x = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
									//
									startV = pY;
									startOut = pYOut * interpolationValue;
									endV = nY;
									endIn = nYIn * interpolationValue;
									y = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
									//
									startV = pZ;
									startOut = pZOut * interpolationValue;
									endV = nZ;
									endIn = nZIn * interpolationValue;
									z = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
									//
									startV = pW;
									startOut = pWOut * interpolationValue;
									endV = nW;
									endIn = nWIn * interpolationValue;
									w = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;

									var rotationMTX = [];
									var tRotation = [0, 0, 0];
									// RedUTIL.quaternionToRotationMat4(tQuat, rotationMTX);
									// RedUTIL.mat4ToEuler(rotationMTX, tRotation);
									var x2 = x + x, y2 = y + y, z2 = z + z;
									var xx = x * x2, xy = x * y2, xz = x * z2;
									var yy = y * y2, yz = y * z2, zz = z * z2;
									var wx = w * x2, wy = w * y2, wz = w * z2;
									rotationMTX[0] = 1 - (yy + zz);
									rotationMTX[4] = xy - wz;
									rotationMTX[8] = xz + wy;
									rotationMTX[1] = xy + wz;
									rotationMTX[5] = 1 - (xx + zz);
									rotationMTX[9] = yz - wx;
									rotationMTX[2] = xz - wy;
									rotationMTX[6] = yz + wx;
									rotationMTX[10] = 1 - (xx + yy);
									// last column
									rotationMTX[3] = 0;
									rotationMTX[7] = 0;
									rotationMTX[11] = 0;
									// bottom row
									rotationMTX[12] = 0;
									rotationMTX[13] = 0;
									rotationMTX[14] = 0;
									rotationMTX[15] = 1;
									// Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
									var m11 = rotationMTX[0], m12 = rotationMTX[4], m13 = rotationMTX[8];
									var m21 = rotationMTX[1], m22 = rotationMTX[5], m23 = rotationMTX[9];
									var m31 = rotationMTX[2], m32 = rotationMTX[6], m33 = rotationMTX[10];
									tRotation[1] = Math.asin(Math.max(-1, Math.min(1, m13)));
									if (Math.abs(m13) < 0.99999) {
										tRotation[0] = Math.atan2(-m23, m33);
										tRotation[2] = Math.atan2(-m12, m11);
									} else {
										tRotation[0] = Math.atan2(m32, m22);
										tRotation[2] = 0;
									}
									tRotation[0] = -(tRotation[0] * 180 / Math.PI);
									tRotation[1] = -(tRotation[1] * 180 / Math.PI);
									tRotation[2] = -(tRotation[2] * 180 / Math.PI);
									target.rotationX = tRotation[0];
									target.rotationY = tRotation[1];
									target.rotationZ = tRotation[2]
								}
								break;
							case 'translation' :
								nX = tAniData_data[prevIndex * 9 + 3];
								nY = tAniData_data[prevIndex * 9 + 4];
								nZ = tAniData_data[prevIndex * 9 + 5];
								pX = tAniData_data[nextIndex * 9 + 3];
								pY = tAniData_data[nextIndex * 9 + 4];
								pZ = tAniData_data[nextIndex * 9 + 5];
								pXOut = tAniData_data[prevIndex * 9 + 6];
								pYOut = tAniData_data[prevIndex * 9 + 7];
								pZOut = tAniData_data[prevIndex * 9 + 8];
								nXOut = tAniData_data[nextIndex * 9 + 0];
								nYOut = tAniData_data[nextIndex * 9 + 1];
								nZOut = tAniData_data[nextIndex * 9 + 2];
								if (prevIndex != aniDataTime_Length - 1) {
									startV = pX;
									startOut = pXOut * interpolationValue;
									endV = nX;
									endIn = nXOut * interpolationValue;
									target.x = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
									startV = pY;
									startOut = pYOut * interpolationValue;
									endV = nY;
									endIn = nYOut * interpolationValue;
									target.y = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
									startV = pZ;
									startOut = pZOut * interpolationValue;
									endV = nZ;
									endIn = nZOut * interpolationValue;
									target.z = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
								}
								break;
							case 'scale' :
								nX = tAniData_data[prevIndex * 9 + 3];
								nY = tAniData_data[prevIndex * 9 + 4];
								nZ = tAniData_data[prevIndex * 9 + 5];
								pX = tAniData_data[nextIndex * 9 + 3];
								pY = tAniData_data[nextIndex * 9 + 4];
								pZ = tAniData_data[nextIndex * 9 + 5];
								pXOut = tAniData_data[prevIndex * 9 + 6];
								pYOut = tAniData_data[prevIndex * 9 + 7];
								pZOut = tAniData_data[prevIndex * 9 + 8];
								nXOut = tAniData_data[nextIndex * 9 + 0];
								nYOut = tAniData_data[nextIndex * 9 + 1];
								nZOut = tAniData_data[nextIndex * 9 + 2];
								if (prevIndex != aniDataTime_Length - 1) {
									startV = pX;
									startOut = pXOut * interpolationValue;
									endV = nX;
									endIn = nXOut * interpolationValue;
									target.scaleX = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
									startV = pY;
									startOut = pYOut * interpolationValue;
									endV = nY;
									endIn = nYOut * interpolationValue;
									target.scaleY = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
									startV = pZ;
									startOut = pZOut * interpolationValue;
									endV = nZ;
									endIn = nZOut * interpolationValue;
									target.scaleZ = s0 * startV + s1 * startOut + s2 * endV + s3 * endIn;
								}
								break;
							case 'weights' :
								weights_aniTargetsIDX = aniData['targets'].length;
								while (weights_aniTargetsIDX--) {
									weights_targetMesh = aniData['targets'][weights_aniTargetsIDX];
									weights_targetData = weights_targetMesh['geometry']['interleaveBuffer']['data'];
									weights_originData = weights_targetMesh['_morphInfo']['origin'];
									weights_stride = weights_targetMesh['geometry']['interleaveBuffer']['stride'];
									weights_LOOP_NUM = weights_targetData.length / weights_stride;
									weights_morphLen = weights_targetMesh['_morphInfo']['list'].length;
									tAniData = aniData['data'];
									weights_tMorphList = weights_targetMesh['_morphInfo']['list'];
									if (!weights_tMorphList['cacheData']) weights_tMorphList['cacheData'] = {};
									var t1;
									weights_index = 0;
									for (weights_index; weights_index < weights_LOOP_NUM; weights_index++) {
										weights_baseIndex = weights_index * weights_stride;
										weights_cacheKey = weights_tMorphList['cacheData'][weights_baseIndex + '_' + prevIndex + '_' + nextIndex];
										if (weights_cacheKey) {
											weights_prev = weights_cacheKey[0];
											weights_next = weights_cacheKey[1];
											weights_prev1 = weights_cacheKey[2];
											weights_next1 = weights_cacheKey[3];
											weights_prev2 = weights_cacheKey[4];
											weights_next2 = weights_cacheKey[5];
										} else {
											weights_prev = weights_originData[weights_baseIndex];
											weights_next = weights_originData[weights_baseIndex];
											weights_prev1 = weights_originData[weights_baseIndex + 1];
											weights_next1 = weights_originData[weights_baseIndex + 1];
											weights_prev2 = weights_originData[weights_baseIndex + 2];
											weights_next2 = weights_originData[weights_baseIndex + 2];
											weights_morphIndex = weights_morphLen;
											while (weights_morphIndex--) {
												if (weights_morphIndex % 3 == 1) {
													weights_prevAniData = tAniData[prevIndex * weights_morphLen + weights_morphIndex];
													weights_nextAniData = tAniData[nextIndex * weights_morphLen + weights_morphIndex];
													weights_morphInterleaveData = weights_tMorphList[weights_morphIndex]['interleaveData'];
													t1 = weights_morphInterleaveData[weights_baseIndex];
													weights_prev += weights_prevAniData * t1;
													weights_next += weights_nextAniData * t1;
													t1 = weights_morphInterleaveData[weights_baseIndex + 1];
													weights_prev1 += weights_prevAniData * t1;
													weights_next1 += weights_nextAniData * t1;
													t1 = weights_morphInterleaveData[weights_baseIndex + 2];
													weights_prev2 += weights_prevAniData * t1;
													weights_next2 += weights_nextAniData * t1;
												}
											}
											weights_tMorphList['cacheData'][weights_baseIndex + '_' + prevIndex + '_' + nextIndex] = [weights_prev, weights_next, weights_prev1, weights_next1, weights_prev2, weights_next2]
										}
										weights_targetData[weights_baseIndex] = weights_prev + interpolationValue * (weights_next - weights_prev);
										weights_targetData[weights_baseIndex + 1] = weights_prev1 + interpolationValue * (weights_next1 - weights_prev1);
										weights_targetData[weights_baseIndex + 2] = weights_prev2 + interpolationValue * (weights_next2 - weights_prev2)
									}
									weights_targetMesh['geometry']['interleaveBuffer'].update(weights_targetData)
								}
								break
						}
					}
				} else {
					if (aniData['interpolation'] == 'STEP') interpolationValue = 0;
					else interpolationValue = (currentTime - previousTime) / (nextTime - previousTime);
					if (interpolationValue.toString() == 'NaN') interpolationValue = 0;
					if (target) {

						var tAniData_data = aniData['data'];

						switch (aniData['key']) {
							case 'rotation':
								/////////////////////////////////////////////
								// quat.normalize(prevRotation, prevRotation);
								// quat.normalize(nextRotation, nextRotation);

								// prevRotation
								x = tAniData_data[prevIndex * 4];
								y = tAniData_data[prevIndex * 4 + 1];
								z = tAniData_data[prevIndex * 4 + 2];
								w = tAniData_data[prevIndex * 4 + 3];
								len = x * x + y * y + z * z + w * w;
								if (len > 0) len = 1 / Math.sqrt(len);
								pX = x * len;
								pY = y * len;
								pZ = z * len;
								pW = w * len;
								// nextRotation
								x = tAniData_data[nextIndex * 4];
								y = tAniData_data[nextIndex * 4 + 1];
								z = tAniData_data[nextIndex * 4 + 2];
								w = tAniData_data[nextIndex * 4 + 3];
								len = x * x + y * y + z * z + w * w;
								if (len > 0) len = 1 / Math.sqrt(len);
								nX = x * len;
								nY = y * len;
								nZ = z * len;
								nW = w * len;
								/////////////////////////////////////////////
								var omega, cosom, sinom, scale0, scale1;
								// calc cosine
								cosom = pX * nX + pY * nY + pZ * nZ + pW * nW;
								// adjust signs (if necessary)
								if (cosom < 0.0) {
									cosom = -cosom;
									nX = -nX;
									nY = -nY;
									nZ = -nZ;
									nW = -nW;
								}
								// calculate coefficients
								if ((1.0 - cosom) > glMatrix.EPSILON) {
									// standard case (slerp)
									omega = Math.acos(cosom);
									sinom = Math.sin(omega);
									scale0 = Math.sin((1.0 - interpolationValue) * omega) / sinom;
									scale1 = Math.sin(interpolationValue * omega) / sinom;
								} else {
									// "from" and "to" quaternions are very close
									//  ... so we can do a linear interpolation
									scale0 = 1.0 - interpolationValue;
									scale1 = interpolationValue;
								}
								// calculate final values
								// tQuat
								x = scale0 * pX + scale1 * nX;
								y = scale0 * pY + scale1 * nY;
								z = scale0 * pZ + scale1 * nZ;
								w = scale0 * pW + scale1 * nW;
								var rotationMTX = [];
								var tRotation = [0, 0, 0];
								// RedUTIL.quaternionToRotationMat4(tQuat, rotationMTX);
								// RedUTIL.mat4ToEuler(rotationMTX, tRotation);
								//////////////////////////////////////////////////////////
								var x2 = x + x, y2 = y + y, z2 = z + z;
								var xx = x * x2, xy = x * y2, xz = x * z2;
								var yy = y * y2, yz = y * z2, zz = z * z2;
								var wx = w * x2, wy = w * y2, wz = w * z2;
								rotationMTX[0] = 1 - (yy + zz);
								rotationMTX[4] = xy - wz;
								rotationMTX[8] = xz + wy;
								rotationMTX[1] = xy + wz;
								rotationMTX[5] = 1 - (xx + zz);
								rotationMTX[9] = yz - wx;
								rotationMTX[2] = xz - wy;
								rotationMTX[6] = yz + wx;
								rotationMTX[10] = 1 - (xx + yy);
								// last column
								rotationMTX[3] = 0;
								rotationMTX[7] = 0;
								rotationMTX[11] = 0;
								// bottom row
								rotationMTX[12] = 0;
								rotationMTX[13] = 0;
								rotationMTX[14] = 0;
								rotationMTX[15] = 1;
								// Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
								var m11 = rotationMTX[0], m12 = rotationMTX[4], m13 = rotationMTX[8];
								var m21 = rotationMTX[1], m22 = rotationMTX[5], m23 = rotationMTX[9];
								var m31 = rotationMTX[2], m32 = rotationMTX[6], m33 = rotationMTX[10];
								tRotation[1] = Math.asin(Math.max(-1, Math.min(1, m13)));
								if (Math.abs(m13) < 0.99999) {
									tRotation[0] = Math.atan2(-m23, m33);
									tRotation[2] = Math.atan2(-m12, m11);
								} else {
									tRotation[0] = Math.atan2(m32, m22);
									tRotation[2] = 0;
								}
								//////////////////////////////////////////////////////////
								tRotation[0] = -(tRotation[0] * 180 / Math.PI);
								tRotation[1] = -(tRotation[1] * 180 / Math.PI);
								tRotation[2] = -(tRotation[2] * 180 / Math.PI);
								// console.log(prevRotation, nextRotation)
								target.rotationX = tRotation[0];
								target.rotationY = tRotation[1];
								target.rotationZ = tRotation[2];
								// console.log(prevIndex, nextIndex)
								// console.log(parseInt(prevRotation[2]), parseInt(nextRotation[2]))
								// console.log(target.rotationX ,target.rotationY ,target.rotationZ )
								break;
							case 'translation' :
								// nextTranslation
								nX = tAniData_data[nextIndex * 3];
								nY = tAniData_data[nextIndex * 3 + 1];
								nZ = tAniData_data[nextIndex * 3 + 2];
								// prevTranslation
								pX = tAniData_data[prevIndex * 3];
								pY = tAniData_data[prevIndex * 3 + 1];
								pZ = tAniData_data[prevIndex * 3 + 2];
								target.x = pX + interpolationValue * (nX - pX);
								target.y = pY + interpolationValue * (nY - pY);
								target.z = pZ + interpolationValue * (nZ - pZ);
								break;
							case 'scale':
								// nextScale
								nX = tAniData_data[nextIndex * 3];
								nY = tAniData_data[nextIndex * 3 + 1];
								nZ = tAniData_data[nextIndex * 3 + 2];
								// prevScale
								pX = tAniData_data[prevIndex * 3];
								pY = tAniData_data[prevIndex * 3 + 1];
								pZ = tAniData_data[prevIndex * 3 + 2];
								target.scaleX = pX + interpolationValue * (nX - pX);
								target.scaleY = pY + interpolationValue * (nY - pY);
								target.scaleZ = pZ + interpolationValue * (nZ - pZ);
								break;
							case 'weights' :
								// console.log(aniData)


								weights_aniTargetsIDX = aniData['targets'].length;
								while (weights_aniTargetsIDX--) {
									weights_targetMesh = aniData['targets'][weights_aniTargetsIDX];
									weights_targetData = weights_targetMesh['geometry']['interleaveBuffer']['data'];
									weights_originData = weights_targetMesh['_morphInfo']['origin'];
									weights_stride = weights_targetMesh['geometry']['interleaveBuffer']['stride'];
									weights_LOOP_NUM = weights_targetData.length / weights_stride;
									weights_morphLen = weights_targetMesh['_morphInfo']['list'].length;
									tAniData = aniData['data'];
									weights_tMorphList = weights_targetMesh['_morphInfo']['list'];
									if (!weights_tMorphList['cacheData']) weights_tMorphList['cacheData'] = {};
									var t1;
									weights_index = 0;
									for (weights_index; weights_index < weights_LOOP_NUM; weights_index++) {
										weights_baseIndex = weights_index * weights_stride;
										weights_cacheKey = weights_tMorphList['cacheData'][weights_baseIndex + '_' + prevIndex + '_' + nextIndex];
										if (weights_cacheKey) {
											weights_prev = weights_cacheKey[0];
											weights_next = weights_cacheKey[1];
											weights_prev1 = weights_cacheKey[2];
											weights_next1 = weights_cacheKey[3];
											weights_prev2 = weights_cacheKey[4];
											weights_next2 = weights_cacheKey[5];
										} else {
											weights_prev = weights_originData[weights_baseIndex];
											weights_next = weights_originData[weights_baseIndex];
											weights_prev1 = weights_originData[weights_baseIndex + 1];
											weights_next1 = weights_originData[weights_baseIndex + 1];
											weights_prev2 = weights_originData[weights_baseIndex + 2];
											weights_next2 = weights_originData[weights_baseIndex + 2];
											weights_morphIndex = weights_morphLen;
											while (weights_morphIndex--) {
												weights_prevAniData = tAniData[prevIndex * weights_morphLen + weights_morphIndex];
												weights_nextAniData = tAniData[nextIndex * weights_morphLen + weights_morphIndex];
												weights_morphInterleaveData = weights_tMorphList[weights_morphIndex]['interleaveData'];
												t1 = weights_morphInterleaveData[weights_baseIndex];
												weights_prev += weights_prevAniData * t1;
												weights_next += weights_nextAniData * t1;
												t1 = weights_morphInterleaveData[weights_baseIndex + 1];
												weights_prev1 += weights_prevAniData * t1;
												weights_next1 += weights_nextAniData * t1;
												t1 = weights_morphInterleaveData[weights_baseIndex + 2];
												weights_prev2 += weights_prevAniData * t1;
												weights_next2 += weights_nextAniData * t1
											}
											weights_tMorphList['cacheData'][weights_baseIndex + '_' + prevIndex + '_' + nextIndex] = [weights_prev, weights_next, weights_prev1, weights_next1, weights_prev2, weights_next2]
										}

										weights_targetData[weights_baseIndex] = weights_prev + interpolationValue * (weights_next - weights_prev);
										weights_targetData[weights_baseIndex + 1] = weights_prev1 + interpolationValue * (weights_next1 - weights_prev1);
										weights_targetData[weights_baseIndex + 2] = weights_prev2 + interpolationValue * (weights_next2 - weights_prev2)
									}
									weights_targetMesh['geometry']['interleaveBuffer'].update(weights_targetData)
								}
								break
						}
					}
				}
				// })
			}
		}
	};
	parser = (function () {
		var checkAsset;
		var getBaseResource;
		var getBufferResources;
		var parseScene;
		var makeMesh;
		var parseAnimations;
		var parseNode;
		var parseCameras;
		var checkTRSAndMATRIX;
		/*
			glTF는 asset 속성이 있어야한다.
			최소한 버전을 반드시 포함해야함.
		 */
		checkAsset = function (json) {
			// console.log(json)
			if (json['asset'] === undefined) RedUTIL.throwFunc('RedGLTFLoader - asset은 반드시 정의되어야함');
			if (json['asset'].version[0] < 2) RedUTIL.throwFunc('RedGLTFLoader - asset의 버전은 2.0이상이어야함')
		};
		getBufferResources = function (redGLTFLoader, data, callback) {
			var allNum = 0, loadedNum = 0;
			var tList = [];
			data['buffers'].forEach(function (v, index) {
				v['_redURIkey'] = 'buffers';
				v['_redURIIndex'] = index;
				tList.push(v)
			});
			tList.forEach(function (v) {
				// console.log('버퍼테이터', v)
				allNum++;
				if (v['uri'] instanceof ArrayBuffer) {
					loadedNum++;
					redGLTFLoader['parsingResult']['uris'][v['_redURIkey']][v['_redURIIndex']] = new DataView(v['uri']);
					if (loadedNum == allNum) {
						console.log("redGLTFLoader['parsingResult']['uris']", redGLTFLoader['parsingResult']['uris']);
						console.log("uris로딩현황", loadedNum, loadedNum);
						if (callback) callback()
					}
				} else {
					var tSrc = v['uri'].substr(0, 5) == 'data:' ? v['uri'] : redGLTFLoader['path'] + v['uri'];
					// console.log('tSrc', tSrc)
					arrayBufferLoader(
						tSrc,
						function (request) {
							loadedNum++;
							console.log(request);
							// console.log(request.response)
							redGLTFLoader['parsingResult']['uris'][v['_redURIkey']][v['_redURIIndex']] = new DataView(request.response);
							if (loadedNum == allNum) {
								console.log("redGLTFLoader['parsingResult']['uris']", redGLTFLoader['parsingResult']['uris']);
								console.log("uris로딩현황", loadedNum, loadedNum);
								if (callback) callback()
							}
						},
						function (request, error) {
							console.log(request, error)
						}
					)
				}

			})
		};
		/*
			전체 데이터중 외부소스데이터를 모두 실제화 해둔다.
		 */
		getBaseResource = function (redGLTFLoader, json, callback) {
			getBufferResources(redGLTFLoader, json, callback);
		};
		parseCameras = function (redGLTFLoader, json) {
			console.log(json);
			if (json['cameras']) {
				json['cameras'].forEach(function (v) {
					console.log('카메라', v);
					var t0 = new RedCamera(redGLTFLoader['redGPUContext']);
					if (v['type'] == 'orthographic') {
						t0.mode2DYn = true
					} else {
						t0['fov'] = v['perspective']['yfov'] * 180 / Math.PI;
						t0['farClipping'] = v['perspective']['zfar'];
						t0['nearClipping'] = v['perspective']['znear']
					}
					redGLTFLoader['parsingResult']['cameras'].push(t0)
				})
			}
		};
		parseScene = function (redGLTFLoader, json, callback) {
			console.log('parseScene 시작');
			console.log(json);
			var i, len;
			var nodesInScene;
			var nodeIndex;
			nodesInScene = json['scenes'][0]['nodes'];
			i = 0;
			len = nodesInScene.length;
			var tick = function () {
				nodeIndex = nodesInScene[i];
				parseNode(redGLTFLoader, json, nodeIndex, json['nodes'][nodeIndex], redGLTFLoader['resultMesh']);
				i++;
				if (i === len) {
					if (callback) callback()
				} else requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
			// json['scenes'][0]['nodes'].forEach(function (nodeIndex) {
			//     // console.log('노드를 찾음', nodeIndex)
			//     parseNode(redGLTFLoader, json, nodeIndex, json['nodes'][nodeIndex], redGLTFLoader['resultMesh'])
			// })
		};
		checkTRSAndMATRIX = (function () {
			var rotationMTX = mat4.create();
			var tRotation = [0, 0, 0];
			var tQuaternion = [];
			var tScale = [];
			var tMatrix;
			return function (target, info) {
				if ('matrix' in info) {
					// parseMatrix
					tMatrix = info['matrix'];
					// console.log('~~~', info, tMatrix)
					// mat4.getRotation(tQuaternion, tMatrix)
					// if (tQuaternion[3] < 0) console.log('tQuaternion', tQuaternion)
					// RedUTIL.quaternionToRotationMat4(tQuaternion, rotationMTX)
					RedUTIL.mat4ToEuler(tMatrix, tRotation);
					target.rotationX = -(tRotation[0] * 180 / Math.PI);
					target.rotationY = -(tRotation[1] * 180 / Math.PI);
					target.rotationZ = -(tRotation[2] * 180 / Math.PI);
					target.x = tMatrix[12];
					target.y = tMatrix[13];
					target.z = tMatrix[14];
					mat4.getScaling(tScale, tMatrix);
					target.scaleX = tScale[0];
					target.scaleY = tScale[1];
					target.scaleZ = tScale[2]
				}
				if ('rotation' in info) {
					// 로데이션은 쿼터니언으로 들어온다.
					tQuaternion = info['rotation'];
					RedUTIL.quaternionToRotationMat4(tQuaternion, rotationMTX);
					RedUTIL.mat4ToEuler(rotationMTX, tRotation);
					target.rotationX = -(tRotation[0] * 180 / Math.PI);
					target.rotationY = -(tRotation[1] * 180 / Math.PI);
					target.rotationZ = -(tRotation[2] * 180 / Math.PI)
				}
				if ('translation' in info) {
					// 위치
					target.x = info['translation'][0];
					target.y = info['translation'][1];
					target.z = info['translation'][2];
				}
				if ('scale' in info) {
					// 스케일
					target.scaleX = info['scale'][0];
					target.scaleY = info['scale'][1];
					target.scaleZ = info['scale'][2];
				}
			}
		})();
		var checkJoint = function (redGLTFLoader, skinInfo, nodes, v) {
			var tJointMesh = nodes[v]['RedMesh'];
			if (tJointMesh) {
				var tJointMesh = nodes[v]['RedMesh'];
				skinInfo['joints'].push(tJointMesh);
				// tJointMesh.geometry = RedSphere(redGLTFLoader['redGPUContext'], 0.05, 3, 3, 3);
				// tJointMesh.material = RedColorMaterial(redGLTFLoader['redGPUContext'], '#ff0000');
				tJointMesh.primitiveTopology = 'line-list';
				tJointMesh.depthTestFunc = 'never'
			} else requestAnimationFrame(function () {
				checkJoint(redGLTFLoader, skinInfo, nodes, v)
			})
		};
		var parseSkin = function (redGLTFLoader, json, info, tMesh) {
			console.log('스킨설정!', info);
			var skinInfo = {
				joints: [],
				inverseBindMatrices: []
			};
			var nodes = json['nodes'];
			info['joints'].forEach(function (v) {
				console.log(json['nodes'][v]);
				checkJoint(redGLTFLoader, skinInfo, nodes, v)
			});
			// 스켈레톤 정보가 있으면 정보와 메쉬를 연결해둔다.
			if (info['skeleton']) skinInfo['skeleton'] = json['nodes'][info['skeleton']]['RedMesh'];
			// 액세서 구하고..
			// 정보 파싱한다.
			var accessorIndex = info['inverseBindMatrices'];
			var accessorInfo = new RedGLTF_AccessorInfo(redGLTFLoader, json, accessorIndex);
			var tBYTES_PER_ELEMENT = accessorInfo['componentType_BYTES_PER_ELEMENT'];
			var tBufferViewByteStride = accessorInfo['bufferViewByteStride'];
			var tBufferURIDataView = accessorInfo['bufferURIDataView'];
			var tGetMethod = accessorInfo['getMethod'];
			var tType = accessorInfo['accessor']['type'];
			var tCount = accessorInfo['accessor']['count'];
			var strideIndex = 0;
			var stridePerElement = tBufferViewByteStride / tBYTES_PER_ELEMENT;
			var i = accessorInfo['startIndex'];
			var len;
			switch (tType) {
				case 'MAT4' :
					if (tBufferViewByteStride) {
						len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
						for (i; i < len; i++) {
							if (strideIndex % stridePerElement < 16) {
								skinInfo['inverseBindMatrices'].push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
							}
							strideIndex++
						}
					} else {
						len = i + tCount * 16;
						for (i; i < len; i++) {
							skinInfo['inverseBindMatrices'].push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
							strideIndex++
						}
					}
					break;
				default :
					console.log('알수없는 형식 엑세서 타입', tType);
					break
			}
			skinInfo['inverseBindMatrices'] = new Float32Array(skinInfo['inverseBindMatrices']);
			tMesh['skinInfo'] = skinInfo
			tMesh.material.skin = tMesh['skinInfo'] ? true : false;
			// console.log(skinInfo)
		};
		parseNode = (function () {
			return function (redGLTFLoader, json, nodeIndex, info, parentMesh) {
				if ('mesh' in info) {
					var tMeshIndex = info['mesh'];
					// console.log('nodeInfo', info)
					// console.log('parentMesh', parentMesh)
					makeMesh(redGLTFLoader, json, json['meshes'][tMeshIndex]).forEach(function (tMesh) {
						info['RedMesh'] = tMesh;
						parentMesh.addChild(tMesh);
						// console.log("메쉬인덱스를 찾음", tMeshIndex, parentMesh)
						checkTRSAndMATRIX(tMesh, info);
						// tMesh.matrix = matrix
						// tMesh.autoUpdateMatrix = false
						if ('children' in info) {
							info['children'].forEach(function (index) {
								parseNode(redGLTFLoader, json, index, json['nodes'][index], tMesh)
							})
						}
						if ('skin' in info) {
							requestAnimationFrame(function () {
								parseSkin(redGLTFLoader, json, json['skins'][info['skin']], tMesh)
							})
						}
					})
				} else {
					var tGroup;
					// console.log('차일드 정보로 구성된 정보임', info)

					if (redGLTFLoader['parsingResult']['groups'][nodeIndex]) {
						console.log('기존에 존재!', redGLTFLoader['parsingResult']['groups'][nodeIndex]);
						tGroup = redGLTFLoader['parsingResult']['groups'][nodeIndex];
						info['RedMesh'] = tGroup
					} else {
						tGroup = new RedMesh(redGLTFLoader['redGPUContext']);
						parentMesh.addChild(tGroup);
						info['RedMesh'] = tGroup;
						redGLTFLoader['parsingResult']['groups'][nodeIndex] = tGroup;
						redGLTFLoader['parsingResult']['groups'][nodeIndex]['name'] = info['name']
					}
					checkTRSAndMATRIX(tGroup, info);
					// 카메라가 있으면 또 연결시킴
					if ('camera' in info) {
						redGLTFLoader['parsingResult']['cameras'][info['camera']]['_parentMesh'] = parentMesh;
						redGLTFLoader['parsingResult']['cameras'][info['camera']]['_targetMesh'] = tGroup;
						var tCameraMesh = new RedMesh(redGLTFLoader['redGPUContext']);
						tGroup.addChild(tCameraMesh);
						redGLTFLoader['parsingResult']['cameras'][info['camera']]['_cameraMesh'] = tCameraMesh
					}
					// tGroup.matrix = matrix
					// tGroup.autoUpdateMatrix = false
					if ('children' in info) {
						info['children'].forEach(function (index) {
							parseNode(redGLTFLoader, json, index, json['nodes'][index], tGroup)
						})
					}
					if ('skin' in info) {
						requestAnimationFrame(function () {
							parseSkin(redGLTFLoader, json, json['skins'][info['skin']], tGroup)
						})
					}
				}
			}
		})();
		var parseSparse = function (redGLTFLoader, key, tAccessors, json, vertices, uvs, uvs1, normals, jointWeights, joints) {
			if (tAccessors['sparse']) {
				var sparseVerties = [];
				var sparseNormals = [];
				var sparseUvs = [];
				(function () {
					var tSparse = tAccessors['sparse'];
					var tSparseValuesAccessors = tSparse['values'];
					console.log('tSparseValuesAccessors', tSparseValuesAccessors);
					var tBufferView = json['bufferViews'][tSparseValuesAccessors['bufferView']];
					var tBufferIndex = tBufferView['buffer'];
					var tBuffer = json['buffers'][tBufferIndex];
					var tBufferURIDataView;
					if (tBuffer['uri']) {
						tBufferURIDataView = redGLTFLoader['parsingResult']['uris']['buffers'][tBufferIndex]
					}
					var i, len;
					var tComponentType;
					var tMethod;
					tComponentType = WEBGL_COMPONENT_TYPES[tAccessors['componentType']];
					if (tComponentType == Float32Array) tMethod = 'getFloat32';
					if (tComponentType == Uint32Array) tMethod = 'getUint32';
					if (tComponentType == Uint16Array) tMethod = 'getUint16';
					if (tComponentType == Int16Array) tMethod = 'getInt16';
					if (tComponentType == Uint8Array) tMethod = 'getUint8';
					if (tComponentType == Int8Array) tMethod = 'getInt8';
					var tAccessorBufferOffset = tAccessors['byteOffset'] || 0;
					var tBufferViewOffset = tBufferView['byteOffset'] || 0;
					i = (tBufferViewOffset + tAccessorBufferOffset) / tComponentType['BYTES_PER_ELEMENT'];
					switch (tAccessors['type']) {
						case 'VEC3' :
							len = i + (tComponentType['BYTES_PER_ELEMENT'] * tSparse['count']) / tComponentType['BYTES_PER_ELEMENT'] * 3;
							console.log('오오오오', key, i, len);
							for (i; i < len; i++) {
								if (key == 'NORMAL') sparseNormals.push(tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true));
								else if (key == 'POSITION') sparseVerties.push(tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true))
							}
							// console.log('인터리브 버퍼 데이터', vertices)
							break;
						case 'VEC2' :
							len = i + (tComponentType['BYTES_PER_ELEMENT'] * tSparse['count']) / tComponentType['BYTES_PER_ELEMENT'] * 2;
							// console.log(i, len)
							for (i; i < len; i++) {
								if (key == 'TEXCOORD_0') {
									sparseUvs.push(tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true))
								}
							}
							// console.log('인터리브 버퍼 데이터', vertices)
							break;
						default :
							console.log('알수없는 형식 엑세서 타입', tAccessors['type']);
							break
					}
				})();
				// console.log(sparseVerties)
				// console.log(sparseNormals)
				// console.log(sparseUvs);
				var tSparse = tAccessors['sparse'];
				var tSparseAccessors = tSparse['indices'];
				// console.log('tSparseAccessors', tSparseAccessors)
				var tBufferView = json['bufferViews'][tSparseAccessors['bufferView']];
				var tBufferIndex = tBufferView['buffer'];
				var tBuffer = json['buffers'][tBufferIndex];
				var tBufferURIDataView;
				if (tBuffer['uri']) {
					tBufferURIDataView = redGLTFLoader['parsingResult']['uris']['buffers'][tBufferIndex]
				}
				var i, len;
				var tComponentType;
				var tMethod;
				tComponentType = WEBGL_COMPONENT_TYPES[tSparseAccessors['componentType']];
				if (tComponentType == Uint16Array) tMethod = 'getUint16';
				else if (tComponentType == Uint8Array) tMethod = 'getUint8';
				var tAccessorBufferOffset = tSparseAccessors['byteOffset'] || 0;
				var tBufferViewOffset = tBufferView['byteOffset'] || 0;
				i = (tBufferViewOffset + tAccessorBufferOffset) / tComponentType['BYTES_PER_ELEMENT'];
				//
				len = i + (tComponentType['BYTES_PER_ELEMENT'] * tSparse['count']) / tComponentType['BYTES_PER_ELEMENT'];
				// console.log('오오오오', key, i, len)
				var sparseIndex = 0;
				for (i; i < len; i++) {
					var targetIndex = tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true);
					// console.log('몇번째껄 부르는건가', targetIndex)
					vertices[targetIndex * 3] = sparseVerties[sparseIndex * 3];
					vertices[targetIndex * 3 + 1] = sparseVerties[sparseIndex * 3 + 1];
					vertices[targetIndex * 3 + 2] = sparseVerties[sparseIndex * 3 + 2];
					sparseIndex++
					// indices.push(tBufferURIDataView[tMethod](i * tComponentType['BYTES_PER_ELEMENT'], true))
				}
			}
		};
		var RedGLTF_AccessorInfo = function (redGLTFLoader, json, accessorIndex) {
			this['accessor'] = json['accessors'][accessorIndex];
			this['bufferView'] = json['bufferViews'][this['accessor']['bufferView']];
			this['bufferIndex'] = this['bufferView']['buffer'];
			this['buffer'] = json['buffers'][this['bufferIndex']];
			this['bufferURIDataView'] = null;
			if (this['buffer']['uri']) {
				this['bufferURIDataView'] = redGLTFLoader['parsingResult']['uris']['buffers'][this['bufferIndex']]
			}
			////////////////////////////
			this['componentType'] = WEBGL_COMPONENT_TYPES[this['accessor']['componentType']];
			this['componentType_BYTES_PER_ELEMENT'] = this['componentType']['BYTES_PER_ELEMENT'];
			switch (this['componentType']) {
				case Float32Array :
					this['getMethod'] = 'getFloat32';
					break;
				case Uint32Array :
					this['getMethod'] = 'getUint32';
					break;
				case Uint16Array :
					this['getMethod'] = 'getUint16';
					break;
				case Int16Array :
					this['getMethod'] = 'getInt16';
					break;
				case Uint8Array :
					this['getMethod'] = 'getUint8';
					break;
				case Int8Array :
					this['getMethod'] = 'getInt8';
					break;
				default :
					RedUTIL.throwFunc('파싱할수없는 타입', this['componentType'])
			}
			this['accessorBufferOffset'] = this['accessor']['byteOffset'] || 0;
			this['bufferViewOffset'] = this['bufferView']['byteOffset'] || 0;
			this['bufferViewByteStride'] = this['bufferView']['byteStride'] || 0;
			this['startIndex'] = (this['bufferViewOffset'] + this['accessorBufferOffset']) / this['componentType_BYTES_PER_ELEMENT'];
			// console.log('해당 bufferView 정보', this['bufferView'])
			// console.log('바라볼 버퍼 인덱스', this['bufferIndex'])
			// console.log('바라볼 버퍼', this['buffer'])
			// console.log('바라볼 버퍼데이터', this['bufferURIDataView'])
			// console.log('바라볼 엑세서', this['accessor'])
			// console.log('this['componentType']', this['componentType'])
			// console.log("this['getMethod']", this['getMethod'])
			// console.log("this['bufferView']['byteOffset']", this['bufferView']['byteOffset'])
			// console.log("this['accessor']['byteOffset']", this['accessor']['byteOffset'])
		};
		var parseAttributeInfo = function (redGLTFLoader, json, key, accessorInfo, vertices, uvs, uvs1, normals, jointWeights, joints, verticesColor_0, tangents) {
			var tBYTES_PER_ELEMENT = accessorInfo['componentType_BYTES_PER_ELEMENT'];
			var tBufferViewByteStride = accessorInfo['bufferViewByteStride'];
			var tBufferURIDataView = accessorInfo['bufferURIDataView'];
			var tGetMethod = accessorInfo['getMethod'];
			var tType = accessorInfo['accessor']['type'];
			var tCount = accessorInfo['accessor']['count'];
			var strideIndex = 0;
			var stridePerElement = tBufferViewByteStride / tBYTES_PER_ELEMENT;
			var i = accessorInfo['startIndex'];
			var len;
			switch (tType) {
				case 'VEC4' :
					if (tBufferViewByteStride) {
						len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
						for (i; i < len; i++) {
							if (strideIndex % stridePerElement < 4) {
								if (key == 'WEIGHTS_0') jointWeights.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
								else if (key == 'JOINTS_0') joints.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
								else if (key == 'COLOR_0') verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
								else if (key == 'TANGENT') tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
								// else RedUTIL.throwFunc('VEC4에서 현재 지원하고 있지 않는 키', key)
							}
							strideIndex++
						}
					} else {
						len = i + tCount * 4;
						for (i; i < len; i++) {
							if (key == 'WEIGHTS_0') jointWeights.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
							else if (key == 'JOINTS_0') joints.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
							else if (key == 'COLOR_0') verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
							else if (key == 'TANGENT') tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
							// else RedUTIL.throwFunc('VEC4에서 현재 지원하고 있지 않는 키', key)
							strideIndex++
						}
					}
					break;
				case 'VEC3' :
					if (tBufferViewByteStride) {
						len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
						for (i; i < len; i++) {
							if (strideIndex % stridePerElement < 3) {
								if (key == 'NORMAL') normals.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
								else if (key == 'POSITION') vertices.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
								else if (key == 'COLOR_0') {
									verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
									if (strideIndex % stridePerElement == 2) verticesColor_0.push(1)
								}
								// else if ( key == 'TANGENT' ) tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
								// else RedUTIL.throwFunc('VEC3에서 현재 지원하고 있지 않는 키', key)
							}
							strideIndex++
						}
					} else {
						len = i + tCount * 3;
						for (i; i < len; i++) {
							if (key == 'NORMAL') normals.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
							else if (key == 'POSITION') vertices.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
							else if (key == 'COLOR_0') {
								verticesColor_0.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true));
								if (strideIndex % 3 == 2) verticesColor_0.push(1)
							}
							// else if ( key == 'TANGENT' ) tangents.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
							// else RedUTIL.throwFunc('VEC3에서 현재 지원하고 있지 않는 키', key)
							strideIndex++
						}
						// console.log('인터리브 버퍼 데이터', vertices)
					}
					break;
				case 'VEC2' :
					if (tBufferViewByteStride) {
						len = i + tCount * (tBufferViewByteStride / tBYTES_PER_ELEMENT);
						for (i; i < len; i++) {
							if (strideIndex % stridePerElement < 2) {
								if (key == 'TEXCOORD_0') {
									uvs.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
								} else if (key == 'TEXCOORD_1') {
									uvs1.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
								} else RedUTIL.throwFunc('VEC2에서 현재 지원하고 있지 않는 키', key)
							}
							strideIndex++
						}
					} else {
						len = i + tCount * 2;
						for (i; i < len; i++) {
							if (key == 'TEXCOORD_0') {
								uvs.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
							} else if (key == 'TEXCOORD_1') {
								uvs1.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
							} else RedUTIL.throwFunc('VEC2에서 현재 지원하고 있지 않는 키', key);
							strideIndex++
						}
					}
					break;
				default :
					console.log('알수없는 형식 엑세서 타입', tType);
					break
			}
		};
		var RedGLTF_MorphInfo = function (redGLTFLoader, json, primitiveData, weightsData) {
			var morphList = [];
			if (primitiveData['targets']) {
				primitiveData['targets'].forEach(function (v2) {
					var tMorphData = {
						vertices: [],
						verticesColor_0: [],
						normals: [],
						uvs: [],
						uvs1: [],
						jointWeights: [],
						joints: [],
						tangents: []
					};
					morphList.push(tMorphData);
					for (var key in v2) {
						var vertices = tMorphData['vertices'];
						var verticesColor_0 = tMorphData['verticesColor_0'];
						var normals = tMorphData['normals'];
						var uvs = tMorphData['uvs'];
						var uvs1 = tMorphData['uvs1'];
						var jointWeights = tMorphData['jointWeights'];
						var joints = tMorphData['joints'];
						var tangents = tMorphData['tangents'];
						var accessorIndex = v2[key];
						var accessorInfo = new RedGLTF_AccessorInfo(redGLTFLoader, json, accessorIndex);
						// 어트리뷰트 갈궈서 파악함
						parseAttributeInfo(
							redGLTFLoader, json, key, accessorInfo,
							vertices, uvs, uvs1, normals, jointWeights, joints, verticesColor_0, tangents
						);
						// 스파스 정보도 갈굼
						if (accessorInfo['accessor']['sparse']) parseSparse(redGLTFLoader, key, accessorInfo['accessor'], json, vertices, uvs, uvs1, normals, jointWeights, joints)
					}
				})
			}
			this['list'] = morphList;
			morphList['weights'] = weightsData || [];
			this['origin'] = null
		};
		var parseIndicesInfo = function (redGLTFLoader, json, key, accessorInfo, indices) {
			var tBYTES_PER_ELEMENT = accessorInfo['componentType_BYTES_PER_ELEMENT'];
			var tBufferURIDataView = accessorInfo['bufferURIDataView'];
			var tGetMethod = accessorInfo['getMethod'];
			var tType = accessorInfo['accessor']['type'];
			var tCount = accessorInfo['accessor']['count'];
			var i = accessorInfo['startIndex'];
			var len;
			// console.log('인덱스!!', accessorInfo)
			switch (tType) {
				case 'SCALAR' :
					len = i + tCount;
					// console.log(i, len)
					for (i; i < len; i++) {
						indices.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
					}
					// console.log('인덱스버퍼 데이터', indices)
					break;
				default :
					console.log('알수없는 형식 엑세서 타입', accessorInfo['accessor']);
					break
			}
		};
		var parseMaterialInfo = (function () {
			var getURL = function (redGLTFLoader, json, sourceIndex) {
				if (json['images'][sourceIndex]['uri'].indexOf('blob:http') > -1) {
					return json['images'][sourceIndex]['uri']
				} else {
					return (json['images'][sourceIndex]['uri'].indexOf(';base64,') > -1 ? '' : redGLTFLoader['path']) + json['images'][sourceIndex]['uri']
				}
			};
			var getSamplerInfo = function (redGLTFLoader, json, samplerIndex) {
				var result = {
					magFilter: "linear",
					minFilter: "linear",
					mipmapFilter: "linear",
					addressModeU: "repeat",
					addressModeV: "repeat",
					addressModeW: "repeat"
				};
				var wrapTable = {
					33071: 'clamp-to-edge', //CLAMP_TO_EDGE,
					33648: 'mirror-repeat', //MIRRORED_REPEAT
					10497: 'repeat' //REPEAT
				};
				var magFilterTable = {
					9728: 'nearest', //NEAREST,
					9729: 'linear' //LINEAR
				};
				var minFilterTable = {
					9728: 'nearest', //NEAREST
					9729: 'linear' //LINEAR
				};
				if (json['samplers']) {
					var t0 = json['samplers'][samplerIndex];
					if ('magFilter' in t0) result['magFilter'] = magFilterTable[t0['magFilter']] || 'linear';
					if ('minFilter' in t0) result['minFilter'] = minFilterTable[t0['minFilter']] || 'linear';
					if ('wrapS' in t0) result['addressModeU'] = wrapTable[t0['wrapS']];
					if ('wrapT' in t0) result['addressModeV'] = wrapTable[t0['wrapT']]
				} else {
					console.log('있긴하냐', samplerIndex)
				}
				result['string'] = JSON.stringify(result);
				console.log('result', result);
				return result
			};
			return function (redGLTFLoader, json, v) {
				var tMaterial;
				var doubleSide = false;
				var alphaMode;
				var alphaCutoff = 0.5;
				if ('material' in v) {
					var tIndex = v['material'];
					var tMaterialInfo = json['materials'][tIndex];
					if ('doubleSided' in tMaterialInfo) doubleSide = tMaterialInfo['doubleSided'] ? true : false;
					if ('alphaMode' in tMaterialInfo) alphaMode = tMaterialInfo['alphaMode'];
					if ('alphaCutoff' in tMaterialInfo) alphaCutoff = tMaterialInfo['alphaCutoff'];
					var diffseTexture, normalTexture, roughnessTexture, emissiveTexture, occlusionTexture;
					// console.log('tMaterialInfo', tMaterialInfo)
					if ('baseColorTexture' in tMaterialInfo['pbrMetallicRoughness']) {
						var baseTextureIndex = tMaterialInfo['pbrMetallicRoughness']['baseColorTexture']['index'];
						var baseTextureInfo = json['textures'][baseTextureIndex];
						var diffuseSourceIndex = baseTextureInfo['source'];
						var tURL = getURL(redGLTFLoader, json, diffuseSourceIndex);
						var samplerIndex = baseTextureInfo['sampler'];
						var option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
						var tKey = tURL;
						diffseTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new RedBitmapTexture(redGLTFLoader['redGPUContext'], tURL, new RedSampler(redGLTFLoader['redGPUContext'], option))
						// var t0 = document.createElement('img')
						// t0.src = json['images'][diffuseSourceIndex]['uri']
						// t0.style.cssText = 'position:absolute;top:0px;left:0px;width:500px'
						// document.body.appendChild(t0)
					}
					if ('metallicRoughnessTexture' in tMaterialInfo['pbrMetallicRoughness']) {
						var roughnessTextureIndex = tMaterialInfo['pbrMetallicRoughness']['metallicRoughnessTexture']['index'];
						var roughnessTextureInfo = json['textures'][roughnessTextureIndex];
						var roughnessSourceIndex = roughnessTextureInfo['source'];
						var tURL = getURL(redGLTFLoader, json, roughnessSourceIndex);
						var samplerIndex = roughnessTextureInfo['sampler'];
						var option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
						var tKey = tURL;
						roughnessTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new RedBitmapTexture(redGLTFLoader['redGPUContext'], tURL, new RedSampler(redGLTFLoader['redGPUContext'], option))
						// var t0 = document.createElement('img')
						// t0.src = json['images'][roughnessSourceIndex]['uri']
						// t0.style.cssText = 'position:absolute;top:0px;left:0px;width:500px'
						// document.body.appendChild(t0)
					}
					var normalTextureIndex = tMaterialInfo['normalTexture'];
					if (normalTextureIndex != undefined) {
						normalTextureIndex = normalTextureIndex['index'];
						var normalTextureInfo = json['textures'][normalTextureIndex];
						var normalSourceIndex = normalTextureInfo['source'];
						var tURL = getURL(redGLTFLoader, json, normalSourceIndex);
						var samplerIndex = normalTextureInfo['sampler'];
						var option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
						var tKey = tURL;
						normalTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new RedBitmapTexture(redGLTFLoader['redGPUContext'], tURL, new RedSampler(redGLTFLoader['redGPUContext'], option))
						// var t0 = document.createElement('img')
						// t0.src = json['images'][normalSourceIndex]['uri']
						// t0.style.cssText = 'position:absolute;top:0px;left:0px;width:500px'
						// document.body.appendChild(t0)
					}
					var emissiveTextureIndex = tMaterialInfo['emissiveTexture'];
					if (emissiveTextureIndex != undefined) {
						emissiveTextureIndex = emissiveTextureIndex['index'];
						var emissiveTextureInfo = json['textures'][emissiveTextureIndex];
						var emissiveSourceIndex = emissiveTextureInfo['source'];
						var tURL = getURL(redGLTFLoader, json, emissiveSourceIndex);
						var samplerIndex = emissiveTextureInfo['sampler'];
						var option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
						var tKey = tURL;
						emissiveTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new RedBitmapTexture(redGLTFLoader['redGPUContext'], tURL, new RedSampler(redGLTFLoader['redGPUContext'], option))
						// var t0 = document.createElement('img')
						// t0.src = json['images'][emissiveSourceIndex]['uri']
						// t0.style.cssText = 'position:absolute;top:0px;left:0px;width:500px'
						// document.body.appendChild(t0)
					}
					var occlusionTextureIndex = tMaterialInfo['occlusionTexture'];
					if (occlusionTextureIndex != undefined) {
						occlusionTextureIndex = occlusionTextureIndex['index'];
						var occlusionTextureInfo = json['textures'][occlusionTextureIndex];
						var occlusionSourceIndex = occlusionTextureInfo['source'];
						var tURL = getURL(redGLTFLoader, json, occlusionSourceIndex);
						var samplerIndex = occlusionTextureInfo['sampler'];
						var option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
						var tKey = tURL;
						occlusionTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new RedBitmapTexture(redGLTFLoader['redGPUContext'], tURL, new RedSampler(redGLTFLoader['redGPUContext'], option))
						// var t0 = document.createElement('img')
						// t0.src = json['images'][occlusionSourceIndex]['uri']
						// t0.style.cssText = 'position:absolute;top:0px;left:0px;width:500px'
						// document.body.appendChild(t0)
					}
					var metallicFactor, roughnessFactor;
					if ('metallicFactor' in tMaterialInfo['pbrMetallicRoughness']) {
						metallicFactor = tMaterialInfo['pbrMetallicRoughness']['metallicFactor']
					}
					if ('roughnessFactor' in tMaterialInfo['pbrMetallicRoughness']) {
						roughnessFactor = tMaterialInfo['pbrMetallicRoughness']['roughnessFactor']
					}
					var tColor;
					// if (!redGLTFLoader['environmentTexture']) {
					//     redGLTFLoader['environmentTexture'] = RedBitmapCubeTexture(redGLTFLoader['redGPUContext'], [
					//         '../asset/cubemap/SwedishRoyalCastle/px.jpg',
					//         '../asset/cubemap/SwedishRoyalCastle/nx.jpg',
					//         '../asset/cubemap/SwedishRoyalCastle/py.jpg',
					//         '../asset/cubemap/SwedishRoyalCastle/ny.jpg',
					//         '../asset/cubemap/SwedishRoyalCastle/pz.jpg',
					//         '../asset/cubemap/SwedishRoyalCastle/nz.jpg'
					//     ])
					// }
					var env = redGLTFLoader['environmentTexture'];
					// Type	Description	Required
					// baseColorFactor	number [4]	The material's base color factor.	No, default: [1,1,1,1]
					// baseColorTexture	object	The base color texture.	No
					// metallicFactor	number	The metalness of the material.	No, default: 1
					// roughnessFactor	number	The roughness of the material.	No, default: 1
					// metallicRoughnessTexture	object	The metallic-roughness texture.	No

					tMaterial = new RedPBRMaterial_System(redGLTFLoader['redGPUContext'], diffseTexture, env, normalTexture, occlusionTexture, emissiveTexture, roughnessTexture);
					if (tMaterialInfo['pbrMetallicRoughness'] && tMaterialInfo['pbrMetallicRoughness']['baseColorFactor']) tColor = tMaterialInfo['pbrMetallicRoughness']['baseColorFactor'];
					else tColor = [1.0, 1.0, 1.0, 1.0];
					tMaterial['baseColorFactor'] = tColor;
					if (tMaterialInfo['pbrMetallicRoughness']) {
						tMaterial.metallicFactor = metallicFactor != undefined ? metallicFactor : 1;
						tMaterial.roughnessFactor = roughnessFactor != undefined ? roughnessFactor : 1;
					}
					tMaterial.emissiveFactor = tMaterialInfo.emissiveFactor != undefined ? tMaterialInfo.emissiveFactor : new Float32Array([1, 1, 1]);
					if (tMaterialInfo['pbrMetallicRoughness']) {
						if (tMaterialInfo['pbrMetallicRoughness']['metallicRoughnessTexture']) tMaterial['roughnessTexCoordIndex'] = tMaterialInfo['pbrMetallicRoughness']['metallicRoughnessTexture']['texCoord'] || 0;
						if (tMaterialInfo['pbrMetallicRoughness']['baseColorTexture']) tMaterial['diffuseTexCoordIndex'] = tMaterialInfo['pbrMetallicRoughness']['baseColorTexture']['texCoord'] || 0
					}
					if (tMaterialInfo['occlusionTexture']) {
						tMaterial['occlusionTexCoordIndex'] = tMaterialInfo['occlusionTexture']['texCoord'] || 0;
						tMaterial['occlusionPower'] = tMaterialInfo['occlusionTexture']['strength'] || 1
					}
					if (tMaterialInfo['emissiveTexture']) tMaterial['emissiveTexCoordIndex'] = tMaterialInfo['emissiveTexture']['texCoord'] || 0;
					if (tMaterialInfo['normalTexture']) tMaterial['normalTexCoordIndex'] = tMaterialInfo['normalTexture']['texCoord'] || 0
				} else {
					var tColor = [(Math.random()), (Math.random()), (Math.random()), 1];
					tMaterial = new RedPBRMaterial_System(redGLTFLoader['redGPUContext']);
					tMaterial.baseColorFactor = tColor;
				}
				return [tMaterial, doubleSide, alphaMode, alphaCutoff]
			}
		})();
		var makeInterleaveData = function (interleaveData, vertices, verticesColor_0, normalData, uvs, uvs1, jointWeights, joints, tangents) {
			var i = 0, len = vertices.length / 3;
			var idx = 0;
			for (i; i < len; i++) {
				if (vertices.length) {
					interleaveData[idx++] = vertices[i * 3 + 0];
					interleaveData[idx++] = vertices[i * 3 + 1];
					interleaveData[idx++] = vertices[i * 3 + 2];
					// interleaveData.push(vertices[i * 3 + 0], vertices[i * 3 + 1], vertices[i * 3 + 2])
				}
				if (verticesColor_0.length) {
					interleaveData[idx++] = verticesColor_0[i * 4 + 0];
					interleaveData[idx++] = verticesColor_0[i * 4 + 1];
					interleaveData[idx++] = verticesColor_0[i * 4 + 2];
					interleaveData[idx++] = verticesColor_0[i * 4 + 3];

					// interleaveData.push(verticesColor_0[i * 4 + 0], verticesColor_0[i * 4 + 1], verticesColor_0[i * 4 + 2], verticesColor_0[i * 4 + 3])
				} else {
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
					// interleaveData.push(0, 0, 0, 0)
				}
				if (normalData.length) {
					interleaveData[idx++] = normalData[i * 3 + 0];
					interleaveData[idx++] = normalData[i * 3 + 1];
					interleaveData[idx++] = normalData[i * 3 + 2];
					// interleaveData.push(normalData[i * 3 + 0], normalData[i * 3 + 1], normalData[i * 3 + 2])
				}
				if (!uvs.length) uvs.push(0, 0);
				if (uvs.length) {
					interleaveData[idx++] = uvs[i * 2 + 0];
					interleaveData[idx++] = uvs[i * 2 + 1];
					// interleaveData.push(uvs[i * 2 + 0], uvs[i * 2 + 1])
				}
				if (uvs1.length) {
					interleaveData[idx++] = uvs1[i * 2 + 0];
					interleaveData[idx++] = uvs1[i * 2 + 1];
					// interleaveData.push(uvs1[i * 2 + 0], uvs1[i * 2 + 1])
				} else if (uvs.length) {
					interleaveData[idx++] = uvs[i * 2 + 0];
					interleaveData[idx++] = uvs[i * 2 + 1];
					// interleaveData.push(uvs[i * 2 + 0], uvs[i * 2 + 1])
				}
				if (jointWeights.length) {
					interleaveData[idx++] = jointWeights[i * 4 + 0];
					interleaveData[idx++] = jointWeights[i * 4 + 1];
					interleaveData[idx++] = jointWeights[i * 4 + 2];
					interleaveData[idx++] = jointWeights[i * 4 + 3];
					// interleaveData.push(jointWeights[i * 4 + 0], jointWeights[i * 4 + 1], jointWeights[i * 4 + 2], jointWeights[i * 4 + 3])
				} else {
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
				}
				if (joints.length) {
					interleaveData[idx++] = joints[i * 4 + 0];
					interleaveData[idx++] = joints[i * 4 + 1];
					interleaveData[idx++] = joints[i * 4 + 2];
					interleaveData[idx++] = joints[i * 4 + 3];
					// interleaveData.push(joints[i * 4 + 0], joints[i * 4 + 1], joints[i * 4 + 2], joints[i * 4 + 3])
				} else {
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
				}
				if (tangents.length) {
					interleaveData[idx++] = tangents[i * 4 + 0];
					interleaveData[idx++] = tangents[i * 4 + 1];
					interleaveData[idx++] = tangents[i * 4 + 2];
					interleaveData[idx++] = tangents[i * 4 + 3];
					// interleaveData.push(tangents[i * 4 + 0], tangents[i * 4 + 1], tangents[i * 4 + 2], tangents[i * 4 + 3])
				} else {
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
					interleaveData[idx++] = 0;
					// interleaveData.push(0, 0, 0, 0)
				}
			}
		};
		makeMesh = function (redGLTFLoader, json, meshData) {
			// console.log('parseMesh :')
			// console.log(meshData)
			var tName, tDoubleSide, tAlphaMode, tAlphaCutoff;
			if (meshData['name']) tName = meshData['name'];
			var tMeshList = [];

			meshData['primitives'].forEach(function (v, index) {
				var tMesh;
				var tMaterial;
				var indices = [];
				// 어트리뷰트에서 파싱되는놈들
				var vertices = [];
				var verticesColor_0 = [];
				var uvs = [];
				var uvs1 = [];
				var normals = [];
				var jointWeights = [];
				var joints = [];
				var tangents = [];
				var tDrawMode;
				// console.log(v, index)
				// 형상 파싱
				if (v['attributes']) {
					// console.log('TODO: 어트리뷰트 파싱')
					for (var key in v['attributes']) {
						// console.log(k, '파싱')
						// 엑세서를 통해서 정보파악하고
						var accessorIndex = v['attributes'][key];
						var accessorInfo = new RedGLTF_AccessorInfo(redGLTFLoader, json, accessorIndex);
						// 어트리뷰트 갈궈서 파악함
						parseAttributeInfo(
							redGLTFLoader, json, key, accessorInfo,
							vertices, uvs, uvs1, normals, jointWeights, joints, verticesColor_0, tangents
						);
						// 스파스 정보도 갈굼
						if (accessorInfo['accessor']['sparse']) parseSparse(redGLTFLoader, key, accessorInfo['accessor'], json, vertices, uvs, uvs1, normals, jointWeights, joints)
					}
				}
				// 인덱스 파싱
				if ('indices' in v) {
					// console.log('TODO: 인덱스 파싱')
					// 버퍼뷰의 위치를 말하므로...이를 추적파싱항
					var accessorIndex = v['indices'];
					var accessorInfo = new RedGLTF_AccessorInfo(redGLTFLoader, json, accessorIndex);
					parseIndicesInfo(
						redGLTFLoader, json, key, accessorInfo, indices
					)
				}
				// 재질파싱
				tMaterial = parseMaterialInfo(redGLTFLoader, json, v);
				tDoubleSide = tMaterial[1];
				tAlphaMode = tMaterial[2];
				tAlphaCutoff = tMaterial[3];
				tMaterial = tMaterial[0];
				if (tMaterial instanceof RedPBRMaterial_System) redGLTFLoader['parsingResult']['materials'].push(tMaterial);
				// 모드 파싱
				if ('mode' in v) {
					// 0 POINTS
					// 1 LINES
					// 2 LINE_LOOP
					// 3 LINE_STRIP
					// 4 TRIANGLES
					// 5 TRIANGLE_STRIP
					// 6 TRIANGLE_FAN
					// console.log('primitiveMode ', v['mode'])
					switch (v['mode']) {
						case 0 :
							tDrawMode = "point-list";
							break;
						case 1 :
							tDrawMode = "line-list";//redGLTFLoader['redGPUContext'].gl.LINES;
							break;
						case 2 :
							tDrawMode = "line-list";//redGLTFLoader['redGPUContext'].gl.LINE_LOOP;
							break;
						case 3 :
							tDrawMode = "line-strip";//redGLTFLoader['redGPUContext'].gl.LINE_STRIP;
							break;
						case 4 :
							tDrawMode = "triangle-list";
							break;
						case 5 :
							tDrawMode = "triangle-strip";
							break;
						case 6 :
							tDrawMode = "triangle-strip";//redGLTFLoader['redGPUContext'].gl.TRIANGLE_FAN;
							break
					}
				}
				/////////////////////////////////////////////////////////
				// 최종데이터 생산
				var normalData;
				if (normals.length) normalData = normals;
				else normalData = RedUTIL.calculateNormals(vertices, indices);
				// console.log('vertices', vertices)
				// console.log('normalData', normalData)
				var interleaveData = [];
				makeInterleaveData(interleaveData, vertices, verticesColor_0, normalData, uvs, uvs1, jointWeights, joints, tangents);

				console.log('interleaveData', interleaveData);


				/////////////////////////////////////////////////////////
				// 메쉬 생성
				var tGeo;
				var tInterleaveInfoList = [];
				if (vertices.length) tInterleaveInfoList.push(new RedInterleaveInfo('aVertexPosition', 'float3'));
				tInterleaveInfoList.push(new RedInterleaveInfo('aVertexColor_0', 'float4'));
				if (normalData.length) tInterleaveInfoList.push(new RedInterleaveInfo('aVertexNormal', 'float3'));
				if (uvs.length) tInterleaveInfoList.push(new RedInterleaveInfo('aTexcoord', 'float2'));
				if (uvs1.length) tInterleaveInfoList.push(new RedInterleaveInfo('aTexcoord1', 'float2'));
				else if (uvs.length) tInterleaveInfoList.push(new RedInterleaveInfo('aTexcoord1', 'float2'));
				tInterleaveInfoList.push(new RedInterleaveInfo('aVertexWeight', 'float4'));
				tInterleaveInfoList.push(new RedInterleaveInfo('aVertexJoint', 'float4'));
				tInterleaveInfoList.push(new RedInterleaveInfo('aVertexTangent', 'float4'));

				tGeo = new RedGeometry(
					redGLTFLoader['redGPUContext'],
					new RedBuffer(
						redGLTFLoader['redGPUContext'],
						'testGLTF_interleaveBuffer_' + RedUUID.makeUUID(),
						RedBuffer.TYPE_VERTEX,
						new Float32Array(interleaveData),
						tInterleaveInfoList
					),
					indices.length ? new RedBuffer(
						redGLTFLoader['redGPUContext'],
						'testGLTF_indexBuffer_' + RedUUID.makeUUID(),
						RedBuffer.TYPE_INDEX,
						new Uint32Array(indices)
					) : null
				);
				if (!tMaterial) {
					RedUTIL.throwFunc('재질을 파싱할수없는경우 ', v)
					// tMaterial = RedColorPhongMaterial(redGLTFLoader['redGPUContext'], RedUTIL.rgb2hex(parseInt(Math.random() * 255), parseInt(Math.random() * 255), parseInt(Math.random() * 255)))
				}
				// console.log('tMaterial', tMaterial)
				tMesh = new RedMesh(redGLTFLoader['redGPUContext'], tGeo, tMaterial);


				if (tName) {
					tMesh.name = tName;
					if (redGLTFLoader['parsingOption']) {
						for (var k in redGLTFLoader['parsingOption']) {
							if (tName.toLowerCase().indexOf(k) > -1) {
								redGLTFLoader['parsingOption'][k](tMesh)
							}
						}
					}

				}
				if (tDrawMode) tMesh.primitiveTopology = tDrawMode;
				else tMesh.primitiveTopology = "triangle-list";
				//
				if (tDoubleSide) {
					tMesh.cullMode = 'none';
					tMaterial.useMaterialDoubleSide = true
				}
				// console.log('tAlphaMode', tAlphaMode)
				// console.log('tAlphaCutoff', tAlphaCutoff)
				switch (tAlphaMode) {
					// TODO

					case 'BLEND' :
						tMesh.transparentSort = true
						tMaterial.alphaBlend = 2;
						break;
					case 'MASK' :
						tMaterial.alphaBlend = 1;
						tMaterial.cutOff = tAlphaCutoff;
						tMaterial.useCutOff = true
						break;
					default :
						tMaterial.alphaBlend = 0;
						tMaterial.useCutOff = false
				}
				if (verticesColor_0.length) tMaterial.useVertexColor_0 = true;
				if (tangents.length) tMaterial.useVertexTangent = true;

				/////////////////////////////////////////////////////////
				// 모프리스트 설정
				var morphInfo = new RedGLTF_MorphInfo(redGLTFLoader, json, v, meshData['weights']);
				morphInfo['list'].forEach(function (v) {
					var normalData;
					if (v['normals'].length) normalData = v['normals'];
					else normalData = RedUTIL.calculateNormals(v['vertices'], indices);
					// console.log('vertices', vertices)
					// console.log('normalData', normalData)
					var interleaveData = [];
					makeInterleaveData(interleaveData, v['vertices'], v['verticesColor_0'], normalData, v['uvs'], v['uvs1'], v['jointWeights'], v['joints'], v['tangents']);
					// var i = 0, len = v['vertices'].length / 3
					// for (i; i < len; i++) {
					//     if (v['vertices'].length) interleaveData.push(v['vertices'][i * 3 + 0], v['vertices'][i * 3 + 1], v['vertices'][i * 3 + 2])
					//     if (v['verticesColor_0'].length) interleaveData.push(v['verticesColor_0'][i * 4 + 0], v['verticesColor_0'][i * 4 + 1], v['verticesColor_0'][i * 4 + 2], v['verticesColor_0'][i * 4 + 3])
					//     else interleaveData.push(0, 0, 0, 0)
					//     if (normalData.length) interleaveData.push(normalData[i * 3 + 0], normalData[i * 3 + 1], normalData[i * 3 + 2])
					//     if (!v['uvs'].length) v['uvs'].push(0, 0)
					//     if (v['uvs'].length) interleaveData.push(v['uvs'][i * 2 + 0], v['uvs'][i * 2 + 1])
					//     if (v['uvs1'].length) interleaveData.push(v['uvs1'][i * 2 + 0], v['uvs1'][i * 2 + 1])
					//     else if (v['uvs'].length) interleaveData.push(v['uvs'][i * 2 + 0], v['uvs'][i * 2 + 1])
					//     if (v['jointWeights'].length) interleaveData.push(v['jointWeights'][i * 4 + 0], v['jointWeights'][i * 4 + 1], v['jointWeights'][i * 4 + 2], v['jointWeights'][i * 4 + 3])
					//     if (v['joints'].length) interleaveData.push(v['joints'][i * 4 + 0], v['joints'][i * 4 + 1], v['joints'][i * 4 + 2], v['joints'][i * 4 + 3])
					//     if (v['tangents'].length) interleaveData.push(v['tangents'][i * 4 + 0], v['tangents'][i * 4 + 1], v['tangents'][i * 4 + 2], v['tangents'][i * 4 + 3])
					//     else interleaveData.push(0, 0, 0, 0)
					//
					// }
					v['interleaveData'] = interleaveData
				});
				tMesh['_morphInfo'] = morphInfo;
				tMesh['_morphInfo']['origin'] = new Float32Array(interleaveData);
				console.log('모프리스트', tMesh['_morphInfo']);
				// console.log(morphInfo)
				/////////////////////////////////////////////////////
				var targetData = tMesh['geometry']['interleaveBuffer']['data'];
				var NUM = 0;
				tInterleaveInfoList.forEach(function (v) {
					NUM += v['size']
				});
				var gap = 0;
				tMesh['_morphInfo']['list'].forEach(function (v, index) {
					// console.log('tInterleaveInfoList', tInterleaveInfoList)
					// console.log('NUM', NUM)

					var i = 0, len = targetData.length / NUM;
					var tWeights = tMesh['_morphInfo']['list']['weights'][index] == undefined ? 0.5 : tMesh['_morphInfo']['list']['weights'][index];
					for (i; i < len; i++) {
						targetData[i * NUM + 0] += v['vertices'][i * 3 + 0] * tWeights;
						targetData[i * NUM + 1] += v['vertices'][i * 3 + 1] * tWeights;
						targetData[i * NUM + 2] += v['vertices'][i * 3 + 2] * tWeights
					}
				});
				tMesh['geometry']['interleaveBuffer'].update(targetData);
				tMesh['_morphInfo']['origin'] = new Float32Array(targetData);
				/////////////////////////////////////////////////////
				v['RedMesh'] = tMesh;
				tMeshList.push(tMesh);
				// console.log('vertices', vertices);
				// console.log('normalData', normalData);
				// console.log('uvs', uvs);
				// console.log('joints', joints);
				// console.log('jointWeights', jointWeights);
				// console.log('tangents', tangents);
				// console.log('indices', indices)
			});
			return tMeshList
		};
		parseAnimations = (function () {
			var parseAnimationInfo;
			parseAnimationInfo = function (redGLTFLoader, json, accessorIndex) {
				// console.log('accessorIndex', accessorIndex)
				var dataList = [];
				var accessorInfo = new RedGLTF_AccessorInfo(redGLTFLoader, json, accessorIndex);
				var tBYTES_PER_ELEMENT = accessorInfo['componentType_BYTES_PER_ELEMENT'];
				// var tBufferViewByteStride = accessorInfo['bufferViewByteStride'];
				var tBufferURIDataView = accessorInfo['bufferURIDataView'];
				var tGetMethod = accessorInfo['getMethod'];
				var tType = accessorInfo['accessor']['type'];
				var tCount = accessorInfo['accessor']['count'];
				// var strideIndex = 0;
				// var stridePerElement = tBufferViewByteStride / tBYTES_PER_ELEMENT
				var i = accessorInfo['startIndex'];
				var len;
				switch (tType) {
					case 'SCALAR' :
						len = i + tCount * 1;
						for (i; i < len; i++) {
							dataList.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
						}
						// console.log('타임 데이터', dataList)
						break;
					case 'VEC4' :
						len = i + tCount * 4;
						for (i; i < len; i++) {
							dataList.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
						}
						// console.log('값 데이터', dataList)
						break;
					case 'VEC3' :
						len = i + tCount * 3;
						for (i; i < len; i++) {
							dataList.push(tBufferURIDataView[tGetMethod](i * tBYTES_PER_ELEMENT, true))
						}
						// console.log('값 데이터', dataList)
						break;
					default :
						console.log('알수없는 형식 엑세서 타입', accessorInfo['accessor']);
						break
				}
				return dataList
			};
			return function (redGLTFLoader, json) {
				console.log('애니메이션 파싱시작');
				var nodes = json['nodes'];
				var meshes = json['meshes'];
				var accessors = json['accessors'];
				if (!json['animations']) json['animations'] = [];
				json['animations'].forEach(function (v, index) {
					// console.log(v)
					var samplers = v['samplers'];
					//TODO: 용어를 정리해봐야겠음.
					// 이걸 애니메이션 클립으로 봐야하는가..
					var animationClip = [];

					animationClip['minTime'] = 10000000;
					animationClip['maxTime'] = -1;
					// animationClip['name'] = 'animation_' + index;
					animationClip['name'] = v['name'];
					// 로더에 애니메이션 데이터들을 입력함
					redGLTFLoader['parsingResult']['animations'].push(animationClip);
					// 채널을 돌면서 파악한다.
					v['channels'].forEach(function (channel, channelIndex) {
						var tSampler;
						var tChannelTargetData;
						var tMesh;
						var tNode;
						var aniTrack; //
						var targets = [];
						tSampler = samplers[channel['sampler']];
						// console.log('tSampler', tSampler)
						tChannelTargetData = channel['target'];
						tNode = nodes[tChannelTargetData['node']];
						if ('mesh' in tNode) {
							tMesh = tNode['RedMesh'];
							meshes[tNode['mesh']]['primitives'].forEach(function (v) {
								targets.push(v['RedMesh']);
								// v['RedMesh'].geometry.drawMode = redGLTFLoader['redGL']['gl'].DYNAMIC_DRAW
							})
						} else {
							var tGroup;
							//TODO: 이거 개선해야함
							// console.log('여기로 오는경우가 있는건가')
							if (redGLTFLoader['parsingResult']['groups'][tChannelTargetData['node']]) {
								tGroup = redGLTFLoader['parsingResult']['groups'][tChannelTargetData['node']];
								// console.log('tGroup', tGroup)
								tMesh = tGroup;
							} else {
								console.log('여기로 오는경우가 있는건가2');
								return
							}
						}
						// console.log('애니메이션 대상메쉬', tMesh)
						// console.log(tChannelTargetData['path'])
						if (
							tChannelTargetData['path'] == 'scale'
							|| tChannelTargetData['path'] == 'rotation'
							|| tChannelTargetData['path'] == 'translation'
							|| tChannelTargetData['path'] == 'weights'
						) {
							// console.log('path', tChannelTargetData['path'])
							// // 시간축은 샘플의 input
							// console.log('시간축', tSampler['input'])
							// console.log('시간엑세서 데이터', tSampler['input'])
							// console.log('시간축 데이터리스트', animationData['time'])
							// // 로테이션 축은 샘플의 output
							// console.log('translation', tSampler['output'])
							// console.log('translation 엑세서 데이터', tSampler['output'])
							// console.log('scale 데이터리스트', t0)

							animationClip.push(aniTrack = {
									key: tChannelTargetData['path'],
									time: parseAnimationInfo(redGLTFLoader, json, tSampler['input']),
									data: parseAnimationInfo(redGLTFLoader, json, tSampler['output']),
									interpolation: tSampler['interpolation'],
									target: tMesh,
									targets: targets
								}
							)
						} else {
							console.log('파싱할수없는 데이터', tChannelTargetData['path'])
						}
						if (aniTrack) {
							if (animationClip['minTime'] > aniTrack['time'][0]) animationClip['minTime'] = aniTrack['time'][0];
							if (animationClip['maxTime'] < aniTrack['time'][aniTrack['time'].length - 1]) animationClip['maxTime'] = aniTrack['time'][aniTrack['time'].length - 1]
						}
						// console.log('animationData', animationData)
					});
					console.log('animationClip', animationClip)
				});
				if (redGLTFLoader['parsingResult']['animations'].length) {
					redGLTFLoader['parsingResult']['animations'].forEach(function (v) {
						redGLTFLoader.playAnimation(v)
					})
					// redGLTFLoader.playAnimation(redGLTFLoader['parsingResult']['animations'][7])


				}

			}
		})();
		return function (redGLTFLoader, redGPUContext, json, callBack, binaryChunk) {
			console.log('파싱시작', redGLTFLoader['path'] + redGLTFLoader['fileName']);
			console.log('rawData', json);
			checkAsset(json);
			if (binaryChunk) {
				console.log(json);
				console.log(binaryChunk);
				json.buffers[0]['uri'] = binaryChunk;
				getBaseResource(redGLTFLoader, json,
					function () {
						// 리소스 로딩이 완료되면 다음 진행
						parseCameras(redGLTFLoader, json);
						parseScene(redGLTFLoader, json, function () {
							parseAnimations(redGLTFLoader, json);
							if (callBack) callBack();
						})

					}
				)
			} else {
				getBaseResource(redGLTFLoader, json,
					function () {
						// 리소스 로딩이 완료되면 다음 진행
						parseCameras(redGLTFLoader, json);
						parseScene(redGLTFLoader, json, function () {
							parseAnimations(redGLTFLoader, json);
							if (callBack) callBack();
						})

					}
				)
			}
		}
	})();
	// Object.freeze(RedGLTFLoader);
})();

export default RedGLTFLoader;