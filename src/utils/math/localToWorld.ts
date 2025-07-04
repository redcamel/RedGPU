import {mat4} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";

const temp_matrix0 = mat4.create();

const localToWorld = (targetMatrix: mat4, x: number, y: number, z: number): [number, number, number] => {
	validateNumber(x)
	validateNumber(y)
	validateNumber(z)

	// 변환 행렬 초기화
	mat4.identity(temp_matrix0);
	mat4.translate(temp_matrix0, temp_matrix0, [x, y, z]);

	// 올바른 순서: targetMatrix * translate
	mat4.multiply(temp_matrix0, targetMatrix, temp_matrix0);

	// 변환된 월드 좌표 반환
	return [
		temp_matrix0[12],
		temp_matrix0[13],
		temp_matrix0[14]
	]
}

export default localToWorld
