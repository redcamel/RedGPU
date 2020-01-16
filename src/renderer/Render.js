/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */

import GLTFLoader from "../loader/gltf/GLTFLoader.js";
import SpriteSheetMaterial from "../material/SpriteSheetMaterial.js";
import Debugger from "./system/Debugger.js";
import PipelineBasic from "../base/pipeline/PipelineBasic.js";
import DisplayContainer from "../base/DisplayContainer.js";

let _frustumPlanes = [];
let currentDebuggerData;
let renderDrawLayerIndexList = [];
let updateTargetMatrixBufferList = [];
let textToTransparentLayerList = [];

let tCacheUniformInfo = {};
let currentTime;
let prevVertexBuffer_UUID;
let prevIndexBuffer_UUID;
let prevMaterial_UUID;
let changedMaterial_UUID;

let renderScene = (_ => {
		return (redGPUContext, redView, passEncoder, children, renderDrawLayerIndexMode = 0) => {
			let i;
			let aSx, aSy, aSz, aCx, aCy, aCz, aX, aY, aZ,
				a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33,
				b0, b1, b2, b3,
				b00, b01, b02, b10, b11, b12, b20, b21, b22;
			// sin,cos 관련
			let tRadian, CPI, CPI2, C225, C127, C045, C157;
			let CONVERT_RADIAN = Math.PI / 180;
			CPI = 3.141592653589793, CPI2 = 6.283185307179586, C225 = 0.225, C127 = 1.27323954, C045 = 0.405284735, C157 = 1.5707963267948966;
			/////

			i = children.length;
			let frustumPlanes0, frustumPlanes1, frustumPlanes2, frustumPlanes3, frustumPlanes4, frustumPlanes5;
			frustumPlanes0 = _frustumPlanes[0];
			frustumPlanes1 = _frustumPlanes[1];
			frustumPlanes2 = _frustumPlanes[2];
			frustumPlanes3 = _frustumPlanes[3];
			frustumPlanes4 = _frustumPlanes[4];
			frustumPlanes5 = _frustumPlanes[5];
			while (i--) {
				let tMVMatrix, tNMatrix;
				let tLocalMatrix;
				let parentMTX, parentDirty, parent;
				let tSkinInfo;
				let tGeometry;
				let tMaterial;
				let tMesh;
				let tDirtyTransform;
				let tPipeline;
				let tDirtyPipeline;
				let tMaterialChanged;
				let tVisible;
				let geoVolume;
				let radius;
				let radiusTemp;
				let tOpacity, tParentSumOpacity;
				tMesh = children[i];
				tMaterial = tMesh._material;
				tGeometry = tMesh._geometry;
				parent = tMesh._parent;
				parentMTX = 0;
				tParentSumOpacity = 1;
				tOpacity = tMesh._opacity;
				if (parent) {
					parentDirty = parent._renderTimeDirtyTransform;
					parentMTX = parent.matrix;
					tParentSumOpacity = parent._sumOpacity
				}
				if (tMesh._sumOpacity != tOpacity * tParentSumOpacity) {
					tMesh.sumOpacity = tOpacity * tParentSumOpacity
					console.log('여기', tOpacity)
				}

				tDirtyTransform = tMesh.dirtyTransform;
				tMesh._renderTimeDirtyTransform = tDirtyTransform;
				// console.log(tMesh._geometry, parentDirty,tMesh.dirtyTransform)

				tDirtyPipeline = tMesh.dirtyPipeline;
				tPipeline = tMesh.pipeline;
				tSkinInfo = tMesh.skinInfo;
				tMVMatrix = tMesh.matrix;
				tLocalMatrix = tMesh.localMatrix;
				tMaterialChanged = 0;

				currentDebuggerData['object3DNum']++;
				if (tMaterial) {
					if (tMaterial.needResetBindingInfo) {
						tMaterial.resetBindingInfo();
						tMaterial.needResetBindingInfo = false;
						tMaterialChanged = tMesh._prevMaterialUUID != tMaterial._UUID;
						changedMaterial_UUID[tMaterial._UUID] = 1
					}
					if (tMaterial instanceof SpriteSheetMaterial) {
						tMaterial.update(currentTime)
					}
					tMaterialChanged = changedMaterial_UUID[tMaterial._UUID]
				}
				if (tGeometry) {
					if (tDirtyPipeline || tMaterialChanged) {
						if (tPipeline instanceof PipelineBasic) {
							// console.log('tDirtyPipeline', tDirtyPipeline, 'tMaterialChanged', tMaterialChanged)
							// console.time('tPipeline.update' + tMesh._UUID)
							tPipeline.update(redGPUContext, redView);
							currentDebuggerData['dirtyPipelineNum']++
							// console.timeEnd('tPipeline.update' + tMesh._UUID)
						}
					}
					tVisible = 1;
					let needRenderCheck = false;
					if (renderDrawLayerIndexMode == Render.DRAW_LAYER_INDEX0 && tMesh._renderDrawLayerIndex == Render.DRAW_LAYER_INDEX1) {
						renderDrawLayerIndexList.push(tMesh)
					} else {
						if (tMesh._renderDrawLayerIndex == Render.DRAW_LAYER_INDEX2_Z_POINT_SORT || tMaterial instanceof SpriteSheetMaterial) {
							a02 = redView.camera.matrix[2], a12 = redView.camera.matrix[6], a22 = redView.camera.matrix[10], a32 = redView.camera.matrix[14];
							// b0 = tMesh._x, b1 = tMesh._y, b2 = tMesh._z, b3 = 1;
							b0 = tMVMatrix[12], b1 = tMVMatrix[13], b2 = tMVMatrix[14], b3 = 1;
							textToTransparentLayerList.push({
								z: b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
								targetText: tMesh
							})
						} else {
							needRenderCheck = true
						}

					}
					if (needRenderCheck || renderDrawLayerIndexMode) {
						if (redView._useFrustumCulling) {
							geoVolume = tGeometry._volume || tGeometry.volume;
							radius = geoVolume.xSize * tMesh.matrix[0];
							radiusTemp = geoVolume.ySize * tMesh.matrix[5];
							radius = radius < radiusTemp ? radiusTemp : radius;
							radiusTemp = geoVolume.zSize * tMesh.matrix[10];
							radius = radius < radiusTemp ? radiusTemp : radius;

							a00 = tMVMatrix[12], a01 = tMVMatrix[13], a02 = tMVMatrix[14],
								frustumPlanes0[0] * a00 + frustumPlanes0[1] * a01 + frustumPlanes0[2] * a02 + frustumPlanes0[3] <= -radius ? tVisible = 0
									: frustumPlanes1[0] * a00 + frustumPlanes1[1] * a01 + frustumPlanes1[2] * a02 + frustumPlanes1[3] <= -radius ? tVisible = 0
									: frustumPlanes2[0] * a00 + frustumPlanes2[1] * a01 + frustumPlanes2[2] * a02 + frustumPlanes2[3] <= -radius ? tVisible = 0
										: frustumPlanes3[0] * a00 + frustumPlanes3[1] * a01 + frustumPlanes3[2] * a02 + frustumPlanes3[3] <= -radius ? tVisible = 0
											: frustumPlanes4[0] * a00 + frustumPlanes4[1] * a01 + frustumPlanes4[2] * a02 + frustumPlanes4[3] <= -radius ? tVisible = 0
												: frustumPlanes5[0] * a00 + frustumPlanes5[1] * a01 + frustumPlanes5[2] * a02 + frustumPlanes5[3] <= -radius ? tVisible = 0 : 0
						}
						// console.log(tVisible);
						///////////////////////////////////////
						if (tVisible) {
							passEncoder.setPipeline(tPipeline.GPURenderPipeline);
							if (prevVertexBuffer_UUID != tGeometry.interleaveBuffer._UUID) {
								passEncoder.setVertexBuffer(0, tGeometry.interleaveBuffer.GPUBuffer);
								prevVertexBuffer_UUID = tGeometry.interleaveBuffer._UUID
							}
							passEncoder.setBindGroup(2, tMesh.GPUBindGroup); // 메쉬 바인딩 그룹는 매그룹마다 다르니 또 업데이트 해줘야함 -_-
							if (prevMaterial_UUID != tMaterial._UUID) {
								passEncoder.setBindGroup(3, tMaterial.uniformBindGroup_material.GPUBindGroup);
								prevMaterial_UUID = tMaterial._UUID
							}
							if (tGeometry.indexBuffer) {
								if (prevIndexBuffer_UUID != tGeometry.indexBuffer._UUID) {
									passEncoder.setIndexBuffer(tGeometry.indexBuffer.GPUBuffer);
									prevIndexBuffer_UUID = tGeometry.indexBuffer._UUID
								}
								passEncoder.drawIndexed(tGeometry.indexBuffer.indexNum, 1, 0, 0, 0);
								currentDebuggerData['triangleNum'] += tGeometry.indexBuffer.indexNum / 3
							} else {
								passEncoder.draw(tGeometry.interleaveBuffer.vertexCount, 1, 0, 0, 0);
								currentDebuggerData['triangleNum'] += tGeometry.interleaveBuffer.data.length / tGeometry.interleaveBuffer.stride
							}
							currentDebuggerData['drawCallNum']++
						}
						tMesh._prevMaterialUUID = tMaterial._UUID;
					}


					// materialPropertyCheck
					////////////////////////
				}

				if (tDirtyTransform) {

					/////////////////////////////////////
					a00 = 1, a01 = 0, a02 = 0,
						a10 = 0, a11 = 1, a12 = 0,
						a20 = 0, a21 = 0, a22 = 1,
						// tLocalMatrix translate
						tLocalMatrix[12] = tMesh._x ,
						tLocalMatrix[13] = tMesh._y,
						tLocalMatrix[14] = tMesh._z,
						tLocalMatrix[15] = 1,
						// tLocalMatrix rotate
						aX = tMesh._rotationX * CONVERT_RADIAN, aY = tMesh._rotationY * CONVERT_RADIAN, aZ = tMesh._rotationZ * CONVERT_RADIAN;
					/////////////////////////
					tRadian = aX % CPI2,
						tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
						tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
						aSx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
						tRadian = (aX + C157) % CPI2,
						tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
						tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
						aCx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
						tRadian = aY % CPI2,
						tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
						tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
						aSy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
						tRadian = (aY + C157) % CPI2,
						tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
						tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
						aCy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
						tRadian = aZ % CPI2,
						tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
						tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
						aSz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
						tRadian = (aZ + C157) % CPI2,
						tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0,
						tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian,
						aCz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian,
						/////////////////////////
						b00 = aCy * aCz, b01 = aSx * aSy * aCz - aCx * aSz, b02 = aCx * aSy * aCz + aSx * aSz,
						b10 = aCy * aSz, b11 = aSx * aSy * aSz + aCx * aCz, b12 = aCx * aSy * aSz - aSx * aCz,
						b20 = -aSy, b21 = aSx * aCy, b22 = aCx * aCy,
						// tLocalMatrix scale
						aX = tMesh._scaleX, aY = tMesh._scaleY , aZ = tMesh._scaleZ,
						tLocalMatrix[0] = (a00 * b00 + a10 * b01 + a20 * b02) * aX,
						tLocalMatrix[1] = (a01 * b00 + a11 * b01 + a21 * b02) * aX,
						tLocalMatrix[2] = (a02 * b00 + a12 * b01 + a22 * b02) * aX,
						tLocalMatrix[3] = tLocalMatrix[3] * aX,
						tLocalMatrix[4] = (a00 * b10 + a10 * b11 + a20 * b12) * aY,
						tLocalMatrix[5] = (a01 * b10 + a11 * b11 + a21 * b12) * aY,
						tLocalMatrix[6] = (a02 * b10 + a12 * b11 + a22 * b12) * aY,
						tLocalMatrix[7] = tLocalMatrix[7] * aY,
						tLocalMatrix[8] = (a00 * b20 + a10 * b21 + a20 * b22) * aZ,
						tLocalMatrix[9] = (a01 * b20 + a11 * b21 + a21 * b22) * aZ,
						tLocalMatrix[10] = (a02 * b20 + a12 * b21 + a22 * b22) * aZ,
						tLocalMatrix[11] = tLocalMatrix[11] * aZ,

						// 피봇처리
						(tMesh['_pivotX'] || tMesh['_pivotY'] || tMesh['_pivotZ']) ? (
							a00 = tLocalMatrix[0], a01 = tLocalMatrix[1], a02 = tLocalMatrix[2], a03 = tLocalMatrix[3],
								a10 = tLocalMatrix[4], a11 = tLocalMatrix[5], a12 = tLocalMatrix[6], a13 = tLocalMatrix[7],
								a20 = tLocalMatrix[8], a21 = tLocalMatrix[9], a22 = tLocalMatrix[10], a23 = tLocalMatrix[11],
								a30 = tLocalMatrix[12], a31 = tLocalMatrix[13], a32 = tLocalMatrix[14], a33 = tLocalMatrix[15],
								// Cache only the current line of the second matrix
								b0 = 1, b1 = 0, b2 = 0, b3 = 0,
								tLocalMatrix[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
								tLocalMatrix[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
								tLocalMatrix[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
								tLocalMatrix[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
								b0 = 0, b1 = 1, b2 = 0, b3 = 0,
								tLocalMatrix[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
								tLocalMatrix[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
								tLocalMatrix[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
								tLocalMatrix[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
								b0 = 0, b1 = 0, b2 = 1, b3 = 0,
								tLocalMatrix[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
								tLocalMatrix[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
								tLocalMatrix[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
								tLocalMatrix[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
								// mode2DYn TODO - 아직 2D처리안함
								// 	? (
								// 		parentMTX
								// 			? (b0 = -tMesh['pivotX'], b1 = tMesh['pivotY'], b2 = -tMesh['pivotZ'], b3 = 1)
								// 			: (b0 = -tMesh['pivotX'] / aX, b1 = tMesh['pivotY'] / aY, b2 = -tMesh['pivotZ'], b3 = 1)
								// 	)
								b0 = -tMesh['_pivotX'], b1 = -tMesh['_pivotY'], b2 = -tMesh['_pivotZ'], b3 = 1,
								tLocalMatrix[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
								tLocalMatrix[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
								tLocalMatrix[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
								tLocalMatrix[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
						) : 0
				}
				if (parentDirty || tDirtyTransform) {
					currentDebuggerData['dirtyTransformNum']++;
					// 부모가 있으면 곱처리함
					parentMTX ?
						(
							// 부모매트릭스 복사
							// 매트립스 곱
							a00 = parentMTX[0], a01 = parentMTX[1], a02 = parentMTX[2], a03 = parentMTX[3],
								a10 = parentMTX[4], a11 = parentMTX[5], a12 = parentMTX[6], a13 = parentMTX[7],
								a20 = parentMTX[8], a21 = parentMTX[9], a22 = parentMTX[10], a23 = parentMTX[11],
								a30 = parentMTX[12], a31 = parentMTX[13], a32 = parentMTX[14], a33 = parentMTX[15],
								b0 = tLocalMatrix[0], b1 = tLocalMatrix[1], b2 = tLocalMatrix[2], b3 = tLocalMatrix[3],
								tMVMatrix[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
								tMVMatrix[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
								tMVMatrix[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
								tMVMatrix[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
								b0 = tLocalMatrix[4], b1 = tLocalMatrix[5], b2 = tLocalMatrix[6], b3 = tLocalMatrix[7],
								tMVMatrix[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
								tMVMatrix[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
								tMVMatrix[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
								tMVMatrix[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
								b0 = tLocalMatrix[8], b1 = tLocalMatrix[9], b2 = tLocalMatrix[10], b3 = tLocalMatrix[11],
								tMVMatrix[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
								tMVMatrix[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
								tMVMatrix[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
								tMVMatrix[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
								b0 = tLocalMatrix[12], b1 = tLocalMatrix[13], b2 = tLocalMatrix[14], b3 = tLocalMatrix[15],
								tMVMatrix[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
								tMVMatrix[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
								tMVMatrix[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
								tMVMatrix[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
						)
						: (
							tMVMatrix[0] = tLocalMatrix[0], tMVMatrix[1] = tLocalMatrix[1], tMVMatrix[2] = tLocalMatrix[2], tMVMatrix[3] = tLocalMatrix[3],
								tMVMatrix[4] = tLocalMatrix[4], tMVMatrix[5] = tLocalMatrix[5], tMVMatrix[6] = tLocalMatrix[6], tMVMatrix[7] = tLocalMatrix[7],
								tMVMatrix[8] = tLocalMatrix[8], tMVMatrix[9] = tLocalMatrix[9] , tMVMatrix[10] = tLocalMatrix[10], tMVMatrix[11] = tLocalMatrix[11],
								tMVMatrix[12] = tLocalMatrix[12], tMVMatrix[13] = tLocalMatrix[13], tMVMatrix[14] = tLocalMatrix[14], tMVMatrix[15] = tLocalMatrix[15]
						),
						// normal calc

						tNMatrix = tMesh.normalMatrix;
					a00 = tMVMatrix[0], a01 = tMVMatrix[1], a02 = tMVMatrix[2], a03 = tMVMatrix[3],
						a10 = tMVMatrix[4], a11 = tMVMatrix[5], a12 = tMVMatrix[6], a13 = tMVMatrix[7],
						a20 = tMVMatrix[8], a21 = tMVMatrix[9], a22 = tMVMatrix[10], a23 = tMVMatrix[11],
						a31 = tMVMatrix[12], a32 = tMVMatrix[13], a33 = tMVMatrix[14], b0 = tMVMatrix[15],
						a30 = a00 * a11 - a01 * a10,
						b1 = a00 * a12 - a02 * a10, b2 = a00 * a13 - a03 * a10, b3 = a01 * a12 - a02 * a11,
						b00 = a01 * a13 - a03 * a11, b01 = a02 * a13 - a03 * a12, b02 = a20 * a32 - a21 * a31,
						b10 = a20 * a33 - a22 * a31, b11 = a20 * b0 - a23 * a31, b12 = a21 * a33 - a22 * a32,
						b20 = a21 * b0 - a23 * a32, b12 = a22 * b0 - a23 * a33, b22 = a30 * b12 - b1 * b20 + b2 * b12 + b3 * b11 - b00 * b10 + b01 * b02,
						b22 = 1 / b22,

						tNMatrix[0] = (a11 * b12 - a12 * b20 + a13 * b12) * b22,
						tNMatrix[4] = (-a01 * b12 + a02 * b20 - a03 * b12) * b22,
						tNMatrix[8] = (a32 * b01 - a33 * b00 + b0 * b3) * b22,
						tNMatrix[12] = (-a21 * b01 + a22 * b00 - a23 * b3) * b22,
						tNMatrix[1] = (-a10 * b12 + a12 * b11 - a13 * b10) * b22,
						tNMatrix[5] = (a00 * b12 - a02 * b11 + a03 * b10) * b22,
						tNMatrix[9] = (-a31 * b01 + a33 * b2 - b0 * b1) * b22,
						tNMatrix[13] = (a20 * b01 - a22 * b2 + a23 * b1) * b22,
						tNMatrix[2] = (a10 * b20 - a11 * b11 + a13 * b02) * b22,
						tNMatrix[6] = (-a00 * b20 + a01 * b11 - a03 * b02) * b22,
						tNMatrix[10] = (a31 * b00 - a32 * b2 + b0 * a30) * b22,
						tNMatrix[14] = (-a20 * b00 + a21 * b2 - a23 * a30) * b22,
						tNMatrix[3] = (-a10 * b12 + a11 * b10 - a12 * b02) * b22,
						tNMatrix[7] = (a00 * b12 - a01 * b10 + a02 * b02) * b22,
						tNMatrix[11] = (-a31 * b3 + a32 * b1 - a33 * a30) * b22,
						tNMatrix[15] = (a20 * b3 - a21 * b1 + a22 * a30) * b22;
					// tMesh.calcTransform(parent);
					// tMesh.updateUniformBuffer();

					updateTargetMatrixBufferList.includes(tMesh.uniformBuffer_meshMatrix) ? 0 : updateTargetMatrixBufferList.push(tMesh.uniformBuffer_meshMatrix);
					tMesh.uniformBuffer_meshMatrix.meshFloat32Array.set(tMesh.matrix, tMesh.offsetMatrix / Float32Array.BYTES_PER_ELEMENT);
					tMesh.uniformBuffer_meshMatrix.meshFloat32Array.set(tMesh.normalMatrix, tMesh.offsetNormalMatrix / Float32Array.BYTES_PER_ELEMENT);
				}


				if (tSkinInfo) {
					let joints = tSkinInfo['joints'];
					let joint_i = 0;
					let len = joints.length;
					let tJointMTX;
					let globalTransformOfJointNode = new Float32Array(len * 16);
					let globalTransformOfNodeThatTheMeshIsAttachedTo = new Float32Array([
						tMVMatrix[0], tMVMatrix[1], tMVMatrix[2], tMVMatrix[3], tMVMatrix[4], tMVMatrix[5], tMVMatrix[6], tMVMatrix[7], tMVMatrix[8], tMVMatrix[9], tMVMatrix[10], tMVMatrix[11], tMVMatrix[12], tMVMatrix[13], tMVMatrix[14], tMVMatrix[15]
					]);
					////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// Inverse
					let te = globalTransformOfNodeThatTheMeshIsAttachedTo,
						me = globalTransformOfNodeThatTheMeshIsAttachedTo,
						n11 = me[0], n21 = me[1], n31 = me[2], n41 = me[3],
						n12 = me[4], n22 = me[5], n32 = me[6], n42 = me[7],
						n13 = me[8], n23 = me[9], n33 = me[10], n43 = me[11],
						n14 = me[12], n24 = me[13], n34 = me[14], n44 = me[15],
						t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
						t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
						t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
						t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
					let det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
					if (det === 0) {
						console.warn("can't invert matrix, determinant is 0");
						return mat4.identity(globalTransformOfNodeThatTheMeshIsAttachedTo);
					} else {
						const detInv = 1 / det;
						te[0] = t11 * detInv;
						te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
						te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
						te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
						te[4] = t12 * detInv;
						te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
						te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
						te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
						te[8] = t13 * detInv;
						te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
						te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
						te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
						te[12] = t14 * detInv;
						te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
						te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
						te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
					}
					////////////////////////////////////////////////////////////////////////////////////////////////////////////
					// 글로벌 조인트 노드병합함
					for (joint_i; joint_i < len; joint_i++) {
						// 조인트 공간내에서의 전역
						tJointMTX = joints[joint_i]['matrix'];
						globalTransformOfJointNode[joint_i * 16 + 0] = tJointMTX[0];
						globalTransformOfJointNode[joint_i * 16 + 1] = tJointMTX[1];
						globalTransformOfJointNode[joint_i * 16 + 2] = tJointMTX[2];
						globalTransformOfJointNode[joint_i * 16 + 3] = tJointMTX[3];
						globalTransformOfJointNode[joint_i * 16 + 4] = tJointMTX[4];
						globalTransformOfJointNode[joint_i * 16 + 5] = tJointMTX[5];
						globalTransformOfJointNode[joint_i * 16 + 6] = tJointMTX[6];
						globalTransformOfJointNode[joint_i * 16 + 7] = tJointMTX[7];
						globalTransformOfJointNode[joint_i * 16 + 8] = tJointMTX[8];
						globalTransformOfJointNode[joint_i * 16 + 9] = tJointMTX[9];
						globalTransformOfJointNode[joint_i * 16 + 10] = tJointMTX[10];
						globalTransformOfJointNode[joint_i * 16 + 11] = tJointMTX[11];
						globalTransformOfJointNode[joint_i * 16 + 12] = tJointMTX[12];
						globalTransformOfJointNode[joint_i * 16 + 13] = tJointMTX[13];
						globalTransformOfJointNode[joint_i * 16 + 14] = tJointMTX[14];
						globalTransformOfJointNode[joint_i * 16 + 15] = tJointMTX[15]
					}

					// tMaterial.uniformBuffer_vertex.GPUBuffer.setSubData(tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['globalTransformOfNodeThatTheMeshIsAttachedTo'], globalTransformOfNodeThatTheMeshIsAttachedTo);
					// tMaterial.uniformBuffer_vertex.GPUBuffer.setSubData(tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['jointMatrix'], globalTransformOfJointNode);

					tMaterial.uniformBuffer_vertex.float32Array.set(globalTransformOfNodeThatTheMeshIsAttachedTo, tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['globalTransformOfNodeThatTheMeshIsAttachedTo'] / Float32Array.BYTES_PER_ELEMENT)
					tMaterial.uniformBuffer_vertex.float32Array.set(globalTransformOfJointNode, tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['jointMatrix'] / Float32Array.BYTES_PER_ELEMENT)

					if (!tSkinInfo['inverseBindMatrices']['_UUID']) tSkinInfo['inverseBindMatrices']['_UUID'] = JSON.stringify(tSkinInfo['inverseBindMatrices']);
					let tUUID = tMaterial.uniformBuffer_vertex['_UUID'];
					if (tCacheUniformInfo[tUUID] != tSkinInfo['inverseBindMatrices']['_UUID']) {
						// tMaterial.uniformBuffer_vertex.GPUBuffer.setSubData(tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['inverseBindMatrixForJoint'], tSkinInfo['inverseBindMatrices']);
						tMaterial.uniformBuffer_vertex.float32Array.set(tSkinInfo['inverseBindMatrices'], tMaterial.uniformBufferDescriptor_vertex.redStructOffsetMap['inverseBindMatrixForJoint'] / Float32Array.BYTES_PER_ELEMENT);
						tCacheUniformInfo[tUUID] = tSkinInfo['inverseBindMatrices']['_UUID']
					}
					tMaterial.uniformBuffer_vertex.GPUBuffer.setSubData(0,tMaterial.uniformBuffer_vertex.float32Array)
				}
				tMesh.dirtyPipeline = false;
				tMesh.dirtyTransform = false;
			}
		};
	}
)();
let renderOptions = (_ => {
	let tOptionRenderList = [];
	let tScene;
	return (redGPUContext, redView, passEncoder) => {
		tScene = redView.scene;
		if (tScene.skyBox) {
			if (redView.camera['farClipping'] * 0.6 != tScene.skyBox._prevScale) tScene.skyBox['scaleX'] = tScene.skyBox['scaleY'] = tScene.skyBox['scaleZ'] = tScene.skyBox._prevScale = redView.camera['farClipping'] * 0.6;
			tOptionRenderList.push(tScene.skyBox);
		}
		if (tScene.grid) tOptionRenderList.push(tScene.grid);
		if (tScene.axis) tOptionRenderList.push(tScene.axis);
		if (tOptionRenderList.length) renderScene(redGPUContext, redView, passEncoder, tOptionRenderList);
		tOptionRenderList.length = 0;
	}
})();
let renderPostEffect = (redGPUContext, redView) => {
	let last_effect_baseAttachmentView = redView.baseAttachment_ResolveTargetView;
	let last_effect_baseAttachment = redView.baseAttachment_ResolveTarget;
	// 포스트 이펙트 렌더
	let effectIDX = 0;
	let len3 = redView.postEffect.effectList.length;
	for (effectIDX; effectIDX < len3; effectIDX++) {
		let tEffect = redView.postEffect.effectList[effectIDX];
		tEffect.render(redGPUContext, redView, renderScene, last_effect_baseAttachmentView);
		last_effect_baseAttachmentView = tEffect.baseAttachmentView;
		last_effect_baseAttachment = tEffect.baseAttachment
	}
	return last_effect_baseAttachment
};
let renderTransparentLayerList = (redGPUContext, redView, passEncoder) => {
	if (renderDrawLayerIndexList.length) renderScene(redGPUContext, redView, passEncoder, renderDrawLayerIndexList, Render.DRAW_LAYER_INDEX1);
	renderDrawLayerIndexList.length = 0;
};
let renderTextLayerList = (redGPUContext, redView, passEncoder) => {
	if (textToTransparentLayerList.length) {
		let tList = [];
		let i = textToTransparentLayerList.length;
		textToTransparentLayerList.sort((a, b) => {
			if (a.z > b.z) return -1;
			if (a.z < b.z) return 1;
			return 0
		});
		while (i--) tList[i] = textToTransparentLayerList[i].targetText;
		renderScene(redGPUContext, redView, passEncoder, tList, Render.DRAW_LAYER_INDEX2_Z_POINT_SORT);
	}
	textToTransparentLayerList.length = 0;
};
let renderLightDebugger = (redGPUContext, redView, passEncoder) => {
	if (redView.debugLightList.length) {
		let cache_useFrustumCulling = redView.useFrustumCulling;
		redView.useFrustumCulling = false;
		renderScene(redGPUContext, redView, passEncoder, redView.debugLightList);
		redView.useFrustumCulling = cache_useFrustumCulling;
	}
};
let copyToFinalTexture = (redGPUContext, redView, commandEncoder, lastTexture, dstTexture) => {
	let tViewRect = redView.viewRect;
	let [tX, tY, tW, tH] = tViewRect;
	let sourceX, sourceY;
	let [cvsW, cvsH] = [redGPUContext.canvas.width, redGPUContext.canvas.height]
	// console.log('pre', tX, tY, tW, tH)
	sourceX = 0;
	sourceY = 0
	if (tX < 0) {
		sourceX = -tX;
		tW = tW + tX;
		tX = 0;
		if (tW < 0) {
			sourceX = 0
			tW = 0
		}
	} else {
		tW = tW + tX > cvsW ? tW - tX : tW;
		if (tW > cvsW) tW = cvsW - tX;
		if (tW < 0) tW = 0;
		if (tW + tX > cvsW) tW = 0;
		if (tX > cvsW) tX = cvsW;
	}
	if (tY < 0) {
		sourceY = -tY;
		tH = tH + tY;
		tY = 0;
		if (tH < 0) {
			sourceY = 0
			tH = 0
		}
	} else {
		tH = tH + tY > cvsH ? tH - tY : tH;
		if (tH > cvsH) tH = cvsH - tY;
		if (tH < 0) tH = 0;
		if (tH + tY > cvsH) tH = 0;
		if (tY > cvsH) tY = cvsH;
	}


	// console.log('after', tX, tY, tW, tH)
	commandEncoder.copyTextureToTexture(
		{
			texture: lastTexture,
			origin: {x: sourceX, y: sourceY, z: 0}
		},
		{
			texture: dstTexture,
			origin: {x: tX, y: tY, z: 0}
		},
		{width: tW, height: tH, depth: 1}
	);
};
let renderView = (redGPUContext, redView, swapChainTexture, mouseEventChecker) => {
	let i;
	let tScene, tSceneBackgroundColor_rgba;
	let now = performance.now();
	tScene = redView.scene;
	tSceneBackgroundColor_rgba = tScene.backgroundColorRGBA;
	if (redView.camera.update) redView.camera.update();
	// console.log(swapChain.getCurrentTexture())
	_frustumPlanes = redView.computeViewFrustumPlanes(redView);
	let renderPassDescriptor = {
		colorAttachments: [
			{
				attachment: redView.baseAttachmentView,
				resolveTarget: redView.baseAttachment_ResolveTargetView,
				loadValue: {
					r: tSceneBackgroundColor_rgba[0],
					g: tSceneBackgroundColor_rgba[1],
					b: tSceneBackgroundColor_rgba[2],
					a: tSceneBackgroundColor_rgba[3]
				}
			},
			{
				attachment: redView.baseAttachment_mouseColorID_depthView,
				resolveTarget: redView.baseAttachment_mouseColorID_depth_ResolveTargetView,
				loadValue: {r: 0, g: 0, b: 0, a: 0}
			}
		],
		depthStencilAttachment: {
			attachment: redView.baseDepthStencilAttachmentView,
			depthLoadValue: 1.0,
			depthStoreOp: "store",
			stencilLoadValue: 0,
			stencilStoreOp: "store",
		}
	};
	let mainRenderCommandEncoder = redGPUContext.device.createCommandEncoder();
	let mainRenderPassEncoder = mainRenderCommandEncoder.beginRenderPass(renderPassDescriptor);
	// 시스템 유니폼 업데이트
	redView.updateSystemUniform(mainRenderPassEncoder, redGPUContext);
	let tViewRect = redView.viewRect;
	mainRenderPassEncoder.setViewport(0, 0, tViewRect[2], tViewRect[3], 0, 1);
	mainRenderPassEncoder.setScissorRect(0, 0, tViewRect[2], tViewRect[3]);
	// render skyBox, grid, axis
	renderOptions(redGPUContext, redView, mainRenderPassEncoder);
	// 실제 Scene렌더


	renderScene(redGPUContext, redView, mainRenderPassEncoder, tScene._flatChildList);
	// 투명레이어 렌더
	renderTransparentLayerList(redGPUContext, redView, mainRenderPassEncoder);
	// 텍스트 렌더
	renderTextLayerList(redGPUContext, redView, mainRenderPassEncoder);
	// 라이트 디버거 렌더
	renderLightDebugger(redGPUContext, redView, mainRenderPassEncoder);
	mainRenderPassEncoder.endPass();
	currentDebuggerData['baseRenderTime'] = performance.now() - now;
	//////////////////////////////////////////////////////////////////////////////////////////
	now = performance.now();
	// 최종 텍스쳐 결정
	let lastTexture = redView.postEffect.effectList.length ? renderPostEffect(redGPUContext, redView) : redView.baseAttachment_ResolveTarget;
	currentDebuggerData['postEffectRenderTime'] = performance.now() - now;
	//////////////////////////////////////////////////////////////////////////////////////////
	now = performance.now();
	// 최종렌더 - 뷰공간 반영 복사
	copyToFinalTexture(redGPUContext, redView, mainRenderCommandEncoder, lastTexture, swapChainTexture);
	// 렌더 종료
	redGPUContext.device.defaultQueue.submit([mainRenderCommandEncoder.finish()]);
	currentDebuggerData['finalRenderTime'] = performance.now() - now;

};
export default class Render {
	static clearStateCache = _ => {
		prevVertexBuffer_UUID = null;
		prevIndexBuffer_UUID = null;
		prevMaterial_UUID = null
	};
	static DRAW_LAYER_INDEX0 = 0;
	static DRAW_LAYER_INDEX1 = 1;
	static DRAW_LAYER_INDEX2_Z_POINT_SORT = 2;

	constructor() {

	}
	render(time, redGPUContext) {
		currentTime = time;
		let debuggerData = Debugger.resetData(redGPUContext.viewList);
		let i = 0, len = redGPUContext.viewList.length;
		let redView;
		changedMaterial_UUID = {};
		let mouseStates = [];
		for (i; i < len; i++) {
			redView = redGPUContext.viewList[i];
			currentDebuggerData = debuggerData[i];
			Render.clearStateCache();
			if (DisplayContainer.needFlatListUpdate) {
				function flattenDeep(input) {
					const stack = [...input];
					const res = [];
					while (stack.length) {
						// 스택에서 값을 pop
						const next = stack.pop();
						res.push(next);
						stack.push(...next._children);
					}
					return res
				}
				redView.scene._flatChildList = flattenDeep(redView.scene._children)
				redView.scene._flatChildList = redView.scene._flatChildList.reverse()
				// redView.scene._flatChildList.sort((a, b) => {
				// 	if (a._geometry && b._geometry) {
				// 		if (a._geometry.interleaveBuffer._UUID > b._geometry.interleaveBuffer._UUID) return -1
				// 		if (a._geometry.interleaveBuffer._UUID < b._geometry.interleaveBuffer._UUID) return 1
				// 	}
				// 	return 0
				// })

			}
			renderView(redGPUContext, redView, redGPUContext.swapChain.getCurrentTexture());
			// 마우스 이벤트 체크
			mouseStates.push(redView.mouseEventChecker.check(redGPUContext))
		}
		if (mouseStates.includes('pointer')) redGPUContext.canvas.style.cursor = 'pointer';
		else redGPUContext.canvas.style.cursor = 'default';
		// 업데이트 대상 유니폼 버퍼 갱신
		i = updateTargetMatrixBufferList.length;
		while (i--) updateTargetMatrixBufferList[i].GPUBuffer.setSubData(0, updateTargetMatrixBufferList[i].meshFloat32Array);
		DisplayContainer.needFlatListUpdate = false
		updateTargetMatrixBufferList.length = 0;
		GLTFLoader.animationLooper(time);
		Debugger.update()
	}
}