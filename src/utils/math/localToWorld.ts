import {mat4} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";

const temp_matrix0 = mat4.create();
const localToWorld = (targetMatrix: mat4, x: number, y: number, z: number): [number, number, number] => {
	validateNumber(x)
	validateNumber(y)
	validateNumber(z)
	mat4.identity(temp_matrix0);
	mat4.translate(temp_matrix0, temp_matrix0, [x, y, z]);
	mat4.multiply(temp_matrix0, temp_matrix0, targetMatrix);  // ✅ 순서 수정
	return [
		temp_matrix0[12],
		temp_matrix0[13],
		temp_matrix0[14]
	]
}
export default localToWorld
