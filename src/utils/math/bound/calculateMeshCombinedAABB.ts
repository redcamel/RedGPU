import Mesh from "../../../display/mesh/Mesh";
import AABB from "./AABB";
import calculateMeshAABB from "./calculateMeshAABB";

const calculateMeshCombinedAABB = (mesh: Mesh): AABB | null => {
	const allAABBs = []
	collectRecursive(mesh, allAABBs);
	if (allAABBs.length === 0) return null;
	return calculateCombinedAABBFromAABBs(allAABBs);
};
/**
 * 재귀적으로 모든 자식의 AABB를 수집하는 헬퍼 함수
 */
const collectRecursive = (mesh: Mesh, aabbs: AABB[]) => {
	if (!mesh._geometry) return;

	const aabb = calculateMeshAABB(mesh);
	if (aabb) {
		aabbs.push(aabb);
	}

	if (mesh.children) {
		for (let i = 0; i < mesh.children.length; i++) {
			const child = mesh.children[i];
			if (child instanceof Mesh) {
				collectRecursive(child, aabbs);
			}
		}
	}
};

const calculateCombinedAABBFromAABBs = (aabbs: AABB[]): AABB | null => {
	if (aabbs.length === 0) return null;
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
