/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 16:13:31
 *
 */
import glMatrix from "../../base/gl-matrix-min.js"
export default function gltfAnimationLooper(time, loopList){
	let currentTime, previousTime, nextTime;
	let nX, nY, nZ, nW, nXOut, nYOut, nZOut, nXIn, nYIn, nZIn, nWIn;
	let pX, pY, pZ, pW, pXOut, pYOut, pZOut, pWOut;
	let x, y, z, w, len;
	let loopListIDX = loopList.length;
	let targetAnimationData;
	let interpolationValue;
	let loopListItem;
	let targetAnimationDataIDX;
	let aniData;
	let target;
	let nextIndex, prevIndex;
	let tTimeData;
	let tAniData;
	let aniDataTime_Length;
	let aniDataTimeIDX;
	//weights
	let weights_aniTargetsIDX;
	let weights_targetMesh;
	let weights_targetData;
	let weights_originData;
	let weights_stride;
	let weights_index;
	let weights_LOOP_NUM;
	let weights_prev, weights_next;
	let weights_prev1, weights_next1;
	let weights_prev2, weights_next2;
	let weights_baseIndex;
	let weights_morphLen;
	let weights_tMorphList;
	let weights_morphIndex;
	let weights_prevAniData;
	let weights_nextAniData;
	let weights_morphInterleaveData;
	let weights_cacheKey;
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
				let tTime = tTimeData[aniDataTimeIDX];
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
				let p = (currentTime - previousTime) / interpolationValue;
				if (p.toString() == 'NaN') p = 0;
				let pp = p * p;
				let ppp = pp * p;

				let s2 = -2 * ppp + 3 * pp;
				let s3 = ppp - pp;
				let s0 = 1 - s2;
				let s1 = s3 - pp + p;

				if (target) {
					let startV, startOut, endV, endIn;
					let tAniData_data = aniData['data'];
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

								let rotationMTX = [];
								let tRotation = [0, 0, 0];
								// UTIL.quaternionToRotationMat4(tQuat, rotationMTX);
								// UTIL.mat4ToEuler(rotationMTX, tRotation);
								let x2 = x + x, y2 = y + y, z2 = z + z;
								let xx = x * x2, xy = x * y2, xz = x * z2;
								let yy = y * y2, yz = y * z2, zz = z * z2;
								let wx = w * x2, wy = w * y2, wz = w * z2;
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
								let m11 = rotationMTX[0], m12 = rotationMTX[4], m13 = rotationMTX[8];
								let m21 = rotationMTX[1], m22 = rotationMTX[5], m23 = rotationMTX[9];
								let m31 = rotationMTX[2], m32 = rotationMTX[6], m33 = rotationMTX[10];
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
								let t1;
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

					let tAniData_data = aniData['data'];

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
							let omega, cosom, sinom, scale0, scale1;
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
							if ((1.0 - cosom) > glMatrix.glMatrix.EPSILON) {
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
							let rotationMTX = [];
							let tRotation = [0, 0, 0];
							// UTIL.quaternionToRotationMat4(tQuat, rotationMTX);
							// UTIL.mat4ToEuler(rotationMTX, tRotation);
							//////////////////////////////////////////////////////////
							let x2 = x + x, y2 = y + y, z2 = z + z;
							let xx = x * x2, xy = x * y2, xz = x * z2;
							let yy = y * y2, yz = y * z2, zz = z * z2;
							let wx = w * x2, wy = w * y2, wz = w * z2;
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
							let m11 = rotationMTX[0], m12 = rotationMTX[4], m13 = rotationMTX[8];
							let m21 = rotationMTX[1], m22 = rotationMTX[5], m23 = rotationMTX[9];
							let m31 = rotationMTX[2], m32 = rotationMTX[6], m33 = rotationMTX[10];
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
							target.rotationX = tRotation[0];
							target.rotationY = tRotation[1];
							target.rotationZ = tRotation[2];
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
								let t1;
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
}