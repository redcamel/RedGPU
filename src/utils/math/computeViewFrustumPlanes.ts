import {mat4} from "gl-matrix";

const tempMTX = mat4.create();
/**
 * Compute the view frustum planes from the given projection and camera matrices.
 *
 * @param {mat4} projectionMatrix - The projection matrix.
 * @param {mat4} cameraMatrix - The camera matrix.
 * @returns {number[][]} - The view frustum planes represented as a 2D array of numbers.
 */
const computeViewFrustumPlanes = (projectionMatrix: mat4, cameraMatrix: mat4): number[][] => {
	mat4.multiply(tempMTX, projectionMatrix, cameraMatrix);
	const planes = [
		[tempMTX[3] - tempMTX[0], tempMTX[7] - tempMTX[4], tempMTX[11] - tempMTX[8], tempMTX[15] - tempMTX[12]],
		[tempMTX[3] + tempMTX[0], tempMTX[7] + tempMTX[4], tempMTX[11] + tempMTX[8], tempMTX[15] + tempMTX[12]],
		[tempMTX[3] + tempMTX[1], tempMTX[7] + tempMTX[5], tempMTX[11] + tempMTX[9], tempMTX[15] + tempMTX[13]],
		[tempMTX[3] - tempMTX[1], tempMTX[7] - tempMTX[5], tempMTX[11] - tempMTX[9], tempMTX[15] - tempMTX[13]],
		[tempMTX[3] - tempMTX[2], tempMTX[7] - tempMTX[6], tempMTX[11] - tempMTX[10], tempMTX[15] - tempMTX[14]],
		[tempMTX[3] + tempMTX[2], tempMTX[7] + tempMTX[6], tempMTX[11] + tempMTX[10], tempMTX[15] + tempMTX[14]]
	];
	for (let i = 0; i < 6; i++) {
		const plane = planes[i];
		const norm = Math.sqrt(plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2]);
		plane[0] /= norm;
		plane[1] /= norm;
		plane[2] /= norm;
		plane[3] /= norm;
	}
	return planes;
}
export default computeViewFrustumPlanes
