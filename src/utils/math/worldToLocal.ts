import {mat4} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";

const temp_matrix0 = mat4.create();
const temp_matrix1 = mat4.create();
const worldToLocal = (targetMatrix: mat4, x: number, y: number, z: number): [number, number, number] => {
	validateNumber(x)
	validateNumber(y)
	validateNumber(z)
	mat4.identity(temp_matrix0);
	mat4.identity(temp_matrix1);
	mat4.translate(temp_matrix0, temp_matrix0, [x, y, z]);
	mat4.multiply(temp_matrix1, temp_matrix0, targetMatrix);
	return [
		temp_matrix1[0] * x + temp_matrix1[1] * y + temp_matrix1[2] * z + temp_matrix1[3],
		temp_matrix1[4] * x + temp_matrix1[5] * y + temp_matrix1[6] * z + temp_matrix1[7],
		temp_matrix1[8] * x + temp_matrix1[9] * y + temp_matrix1[10] * z + temp_matrix1[11]
	]
}
export default worldToLocal
