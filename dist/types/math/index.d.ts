/**
 * [KO] 3D 공간 연산, 프러스텀 평면 추출, 광선 교차 판정 및 좌표계 변환 유틸리티를 제공합니다.
 * [EN] Provides utilities for 3D spatial operations, frustum plane extraction, ray intersection testing, and coordinate system transformations.
 * @packageDocumentation
 */
import calculateNormals from "./calculateNormals";
import calculateTangents from "./calculateTangents";
import computeFrustumPlanes, { computeFrustumPlanesFlat, computeFrustumPlanesFromPVMatrix, computeFrustumPlanesFromPVMatrixFlat } from "./computeFrustumPlanes";
import matToEuler from "./mat4ToEuler";
import quaternionToRotationMat4 from "./quaternionToRotationMat4";
import sortTransparentObjects from "./sortTransparentObjects";
import Ray from "./Ray";
import updateObject3DMatrix from "./updateObject3DMatrix";
export { mat4, mat3, quat, vec2, vec3, vec4 } from "gl-matrix";
export * from "./coordinates";
export { calculateNormals, calculateTangents, computeFrustumPlanes, computeFrustumPlanesFlat, computeFrustumPlanesFromPVMatrix, computeFrustumPlanesFromPVMatrixFlat, matToEuler, quaternionToRotationMat4, sortTransparentObjects, updateObject3DMatrix, Ray };
