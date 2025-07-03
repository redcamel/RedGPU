import {vec3} from "gl-matrix";
import Mesh from "../../../display/mesh/Mesh";
import {IVolumeAABB} from "./calculateGeometryAABB";


const calculateMeshAABB = (mesh: Mesh): IVolumeAABB =>{
	const geometryVolume = mesh._geometry.volume;
	if (!geometryVolume) return null;

	// 원본 geometry의 8개 정점 계산
	const { minX, maxX, minY, maxY, minZ, maxZ } = geometryVolume;
	const localVertices = [
		[minX, minY, minZ], [maxX, minY, minZ], [maxX, maxY, minZ], [minX, maxY, minZ], // 뒷면
		[minX, minY, maxZ], [maxX, minY, maxZ], [maxX, maxY, maxZ], [minX, maxY, maxZ]  // 앞면
	];

	let worldMinX = Infinity, worldMinY = Infinity, worldMinZ = Infinity;
	let worldMaxX = -Infinity, worldMaxY = -Infinity, worldMaxZ = -Infinity;

	// 각 정점을 modelMatrix로 변환하여 월드 좌표 계산
	localVertices.forEach(vertex => {
		// vec3.transformMat4를 사용해 정점을 월드 좌표로 변환
		const localVertex = vec3.fromValues(vertex[0], vertex[1], vertex[2]);
		const worldVertex = vec3.create();
		vec3.transformMat4(worldVertex, localVertex, mesh.modelMatrix);

		// AABB 업데이트
		worldMinX = Math.min(worldMinX, worldVertex[0]);
		worldMinY = Math.min(worldMinY, worldVertex[1]);
		worldMinZ = Math.min(worldMinZ, worldVertex[2]);
		worldMaxX = Math.max(worldMaxX, worldVertex[0]);
		worldMaxY = Math.max(worldMaxY, worldVertex[1]);
		worldMaxZ = Math.max(worldMaxZ, worldVertex[2]);
	});

	// IVolumeAABB 형태로 반환
	const centerX = (worldMaxX + worldMinX) / 2;
	const centerY = (worldMaxY + worldMinY) / 2;
	const centerZ = (worldMaxZ + worldMinZ) / 2;
	const xSize = worldMaxX - worldMinX;
	const ySize = worldMaxY - worldMinY;
	const zSize = worldMaxZ - worldMinZ;
	const geometryRadius = Math.sqrt((xSize/2)**2 + (ySize/2)**2 + (zSize/2)**2);

	return {
		minX: worldMinX,
		maxX: worldMaxX,
		minY: worldMinY,
		maxY: worldMaxY,
		minZ: worldMinZ,
		maxZ: worldMaxZ,
		centerX,
		centerY,
		centerZ,
		xSize,
		ySize,
		zSize,
		geometryRadius
	};
}
export default calculateMeshAABB
