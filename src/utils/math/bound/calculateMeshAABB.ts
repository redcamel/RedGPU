import {vec3} from "gl-matrix";
import Mesh from "../../../display/mesh/Mesh";
import AABB from "./AABB";

const tempLocalVertex = vec3.create();
const tempWorldVertex = vec3.create();

const calculateMeshAABB = (mesh: Mesh): AABB | null => {
	const geometryVolume = mesh._geometry.volume;
	if (!geometryVolume) return null;

	const { minX, maxX, minY, maxY, minZ, maxZ } = geometryVolume;

	let worldMinX = Infinity, worldMinY = Infinity, worldMinZ = Infinity;
	let worldMaxX = -Infinity, worldMaxY = -Infinity, worldMaxZ = -Infinity;

	const corners = [
		[minX, minY, minZ], [maxX, minY, minZ],
		[maxX, maxY, minZ], [minX, maxY, minZ],
		[minX, minY, maxZ], [maxX, minY, maxZ],
		[maxX, maxY, maxZ], [minX, maxY, maxZ]
	];

	for (let i = 0; i < 8; i++) {
		const corner = corners[i];

		vec3.set(tempLocalVertex, corner[0], corner[1], corner[2]);
		vec3.transformMat4(tempWorldVertex, tempLocalVertex, mesh.modelMatrix);

		const wx = tempWorldVertex[0];
		const wy = tempWorldVertex[1];
		const wz = tempWorldVertex[2];

		if (wx < worldMinX) worldMinX = wx;
		if (wy < worldMinY) worldMinY = wy;
		if (wz < worldMinZ) worldMinZ = wz;
		if (wx > worldMaxX) worldMaxX = wx;
		if (wy > worldMaxY) worldMaxY = wy;
		if (wz > worldMaxZ) worldMaxZ = wz;
	}

	return new AABB(worldMinX, worldMaxX, worldMinY, worldMaxY, worldMinZ, worldMaxZ);
};

export default calculateMeshAABB;
