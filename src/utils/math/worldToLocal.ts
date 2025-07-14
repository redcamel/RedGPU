import {mat4, vec3} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";

const temp_matrix = mat4.create();
const temp_vector = vec3.create();
const worldToLocal = (targetMatrix: mat4, x: number, y: number, z: number): [number, number, number] => {
	validateNumber(x)
	validateNumber(y)
	validateNumber(z)
	// targetMatrix의 역행렬 계산
	mat4.invert(temp_matrix, targetMatrix);
	// 월드 좌표 벡터 설정
	vec3.set(temp_vector, x, y, z);
	// 역변환 적용
	vec3.transformMat4(temp_vector, temp_vector, temp_matrix);
	return [temp_vector[0], temp_vector[1], temp_vector[2]]
}
export default worldToLocal
