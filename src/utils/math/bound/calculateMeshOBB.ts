import {mat4, vec3} from "gl-matrix";
import Mesh from "../../../display/mesh/Mesh";
import OBB from "./OBB";

const calculateMeshOBB = (mesh: Mesh): OBB => {
	// 메시나 지오메트리가 없는 경우 기본 OBB 반환
	if (!mesh || !mesh._geometry) {
		const identityMatrix = mat4.create();
		return new OBB([0, 0, 0], [0, 0, 0], identityMatrix);
	}
	const geometryVolume = mesh._geometry.volume;
	// 이제 geometryVolume은 항상 AABB를 반환하므로 null 체크 불필요
	// 지오메트리가 빈 경우 (모든 값이 0)
	if (geometryVolume.minX === 0 && geometryVolume.maxX === 0 &&
		geometryVolume.minY === 0 && geometryVolume.maxY === 0 &&
		geometryVolume.minZ === 0 && geometryVolume.maxZ === 0) {
		const identityMatrix = mat4.create();
		return new OBB([0, 0, 0], [0, 0, 0], identityMatrix);
	}
	// 원본 지오메트리의 중심점과 반크기
	const originalCenter = [
		geometryVolume.centerX,
		geometryVolume.centerY,
		geometryVolume.centerZ
	] as [number, number, number];
	const originalHalfExtents = [
		(geometryVolume.maxX - geometryVolume.minX) / 2,
		(geometryVolume.maxY - geometryVolume.minY) / 2,
		(geometryVolume.maxZ - geometryVolume.minZ) / 2
	] as [number, number, number];
	// 변환된 중심점 계산
	const transformedCenter = vec3.create();
	vec3.transformMat4(transformedCenter, originalCenter as vec3, mesh.modelMatrix);
	// 회전과 스케일 매트릭스 추출
	const rotationScaleMatrix = mat4.create();
	mat4.copy(rotationScaleMatrix, mesh.modelMatrix);
	rotationScaleMatrix[12] = 0; // x 이동 제거
	rotationScaleMatrix[13] = 0; // y 이동 제거
	rotationScaleMatrix[14] = 0; // z 이동 제거
	// OBB의 3개 축 벡터와 반크기 계산
	const axes = [
		vec3.create(), // X축
		vec3.create(), // Y축
		vec3.create()  // Z축
	];
	const transformedHalfExtents = [0, 0, 0] as [number, number, number];
	// 각 축에 대해 변환된 방향과 크기 계산
	for (let i = 0; i < 3; i++) {
		// 원본 축 벡터 생성
		const originalAxis = [0, 0, 0];
		originalAxis[i] = originalHalfExtents[i];
		// 축 벡터 변환
		vec3.transformMat4(axes[i], originalAxis as vec3, rotationScaleMatrix);
		// 변환된 반크기 (벡터의 길이)
		transformedHalfExtents[i] = vec3.length(axes[i]);
		// 축 벡터 정규화 (방향만 유지)
		vec3.normalize(axes[i], axes[i]);
	}
	// 정규화된 축 벡터들로 방향 매트릭스 구성
	const orientationMatrix = mat4.create();
	// 3x3 회전 부분만 설정 (각 열이 변환된 축)
	orientationMatrix[0] = axes[0][0];  // X축의 X성분
	orientationMatrix[1] = axes[0][1];  // X축의 Y성분
	orientationMatrix[2] = axes[0][2];  // X축의 Z성분
	orientationMatrix[3] = 0;
	orientationMatrix[4] = axes[1][0];  // Y축의 X성분
	orientationMatrix[5] = axes[1][1];  // Y축의 Y성분
	orientationMatrix[6] = axes[1][2];  // Y축의 Z성분
	orientationMatrix[7] = 0;
	orientationMatrix[8] = axes[2][0];   // Z축의 X성분
	orientationMatrix[9] = axes[2][1];   // Z축의 Y성분
	orientationMatrix[10] = axes[2][2];  // Z축의 Z성분
	orientationMatrix[11] = 0;
	orientationMatrix[12] = 0;
	orientationMatrix[13] = 0;
	orientationMatrix[14] = 0;
	orientationMatrix[15] = 1;
	// OBB 정보 저장
	return new OBB([transformedCenter[0], transformedCenter[1], transformedCenter[2]], transformedHalfExtents, orientationMatrix);
}
export default calculateMeshOBB;
