import {vec3} from "gl-matrix";
import Mesh from "../../../display/mesh/Mesh";
import AABB from "./AABB";

const calculateMeshAABB = (mesh: Mesh): AABB | null => {
	const geometryVolume = mesh._geometry.volume;
	if (!geometryVolume) return null;

	const { minX, maxX, minY, maxY, minZ, maxZ } = geometryVolume;
	const localVertices = [
		[minX, minY, minZ], [maxX, minY, minZ], [maxX, maxY, minZ], [minX, maxY, minZ],
		[minX, minY, maxZ], [maxX, minY, maxZ], [maxX, maxY, maxZ], [minX, maxY, maxZ]
	];

	let worldMinX = Infinity, worldMinY = Infinity, worldMinZ = Infinity;
	let worldMaxX = -Infinity, worldMaxY = -Infinity, worldMaxZ = -Infinity;

	localVertices.forEach(vertex => {
		const localVertex = vec3.fromValues(vertex[0], vertex[1], vertex[2]);
		const worldVertex = vec3.create();
		vec3.transformMat4(worldVertex, localVertex, mesh.modelMatrix);

		worldMinX = Math.min(worldMinX, worldVertex[0]);
		worldMinY = Math.min(worldMinY, worldVertex[1]);
		worldMinZ = Math.min(worldMinZ, worldVertex[2]);
		worldMaxX = Math.max(worldMaxX, worldVertex[0]);
		worldMaxY = Math.max(worldMaxY, worldVertex[1]);
		worldMaxZ = Math.max(worldMaxZ, worldVertex[2]);
	});

	return new AABB(worldMinX, worldMaxX, worldMinY, worldMaxY, worldMinZ, worldMaxZ);
};

export default calculateMeshAABB;
