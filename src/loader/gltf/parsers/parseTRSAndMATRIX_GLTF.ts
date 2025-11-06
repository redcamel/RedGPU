import {mat4, vec3} from "gl-matrix";
import Mesh from "../../../display/mesh/Mesh";
import GPU_FRONT_FACE from "../../../gpuConst/GPU_FRONT_FACE";
import mat4ToEuler from "../../../utils/math/matToEuler";
import quaternionToRotationMat4 from "../../../utils/math/quaternionToRotationMat4";
import {Node} from "../GLTF";

const RAD_TO_DEG = 180 / Math.PI;
/**
 * Sets the rotation of a mesh using the given rotation values.
 * The rotation values should be in radians.
 *
 * @param {number[]} tRotation - The rotation values in radians along the x, y, and z axes.
 * @param {Mesh} mesh - The mesh to set the rotation of.
 *
 * @returns {void}
 */
const setMeshRotation = (tRotation: number[], mesh: Mesh) => {
	mesh.setRotation(
		-(tRotation[0] * RAD_TO_DEG),
		-(tRotation[1] * RAD_TO_DEG),
		-(tRotation[2] * RAD_TO_DEG)
	);
}
/**
 * Parses the transformation and matrix information from `nodeInfo` and applies it to the `mesh`.
 *
 * @param {Mesh} mesh - The mesh to apply the transformations to.
 * @param {Node} nodeInfo - The information about the node containing the transformation data.
 * @returns {void}
 */
const parseTRSAndMATRIX_GLTF = (mesh: Mesh, nodeInfo: Node) => {
	const {matrix, rotation: quaternion, translation, scale} = nodeInfo;
	let rotationMTX, tRotation;
	if ('matrix' in nodeInfo) {
		rotationMTX = mat4.create();
		tRotation = vec3.create();
		mat4ToEuler(matrix, tRotation);
		setMeshRotation(tRotation, mesh);
		mesh.setPosition(matrix[12], matrix[13], matrix[14]);
		const tempScale = vec3.fromValues(1, 1, 1);
		// @ts-ignore
		mat4.getScaling(tempScale, matrix);
		mesh.setScale(tempScale[0], tempScale[1], tempScale[2]);
	}
	if ('rotation' in nodeInfo) {
		rotationMTX = mat4.create();
		tRotation = vec3.create();
		quaternionToRotationMat4(quaternion, rotationMTX);
		mat4ToEuler(rotationMTX, tRotation);
		setMeshRotation(tRotation, mesh);
	}
	if ('translation' in nodeInfo)
		mesh.setPosition(translation[0], translation[1], translation[2]);
	if ('scale' in nodeInfo) {
		// console.log('scale', scale)
		mesh.setScale(scale[0], scale[1], scale[2]);
		if (scale[0] < 0 || scale[1] < 0 || scale[2] < 0) {
			mesh.primitiveState.frontFace = GPU_FRONT_FACE.CW
		}
	}
}
export default parseTRSAndMATRIX_GLTF;
