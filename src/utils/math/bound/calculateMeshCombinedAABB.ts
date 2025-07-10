import Mesh from "../../../display/mesh/Mesh";
import AABB from "./AABB";
import calculateMeshAABB from "./calculateMeshAABB";

const calculateMeshCombinedAABB = (mesh: Mesh): AABB => {
	const allAABBs = []
	collectRecursive(mesh, allAABBs);
	if (allAABBs.length === 0) return new AABB(0, 0, 0, 0, 0, 0);
	return calculateCombinedAABBFromAABBs(allAABBs);
};

/**
 * 재귀적으로 모든 자식의 AABB를 수집하는 헬퍼 함수
 */
const collectRecursive = (mesh: Mesh, aabbs: AABB[]) => {
	// 지오메트리가 있는 경우에만 AABB 계산 및 추가
	if (mesh._geometry) {
		const aabb = mesh.boundingAABB
		// 빈 AABB인지 확인 (모든 값이 0인 경우는 제외)
		if (!(aabb.minX === 0 && aabb.maxX === 0 && aabb.minY === 0 &&
			aabb.maxY === 0 && aabb.minZ === 0 && aabb.maxZ === 0)) {
			aabbs.push(aabb);
		}
	}

	// 지오메트리가 없어도 자식들은 처리해야 함
	if (mesh.children) {
		for (let i = 0; i < mesh.children.length; i++) {
			const child = mesh.children[i];
			if (child instanceof Mesh) {
				collectRecursive(child, aabbs);
			}
		}
	}
};

const calculateCombinedAABBFromAABBs = (aabbs: AABB[]): AABB => {
	if (aabbs.length === 0) return new AABB(0, 0, 0, 0, 0, 0);
	if (aabbs.length === 1) return aabbs[0];

	let minX = Infinity, minY = Infinity, minZ = Infinity;
	let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

	for (let i = 0; i < aabbs.length; i++) {
		const aabb = aabbs[i];
		if (aabb.minX < minX) minX = aabb.minX;
		if (aabb.minY < minY) minY = aabb.minY;
		if (aabb.minZ < minZ) minZ = aabb.minZ;
		if (aabb.maxX > maxX) maxX = aabb.maxX;
		if (aabb.maxY > maxY) maxY = aabb.maxY;
		if (aabb.maxZ > maxZ) maxZ = aabb.maxZ;
	}

	return new AABB(minX, maxX, minY, maxY, minZ, maxZ);
};

export default calculateMeshCombinedAABB;
