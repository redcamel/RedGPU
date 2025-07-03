
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";

export type IVolumeAABB = {
	// volume: [number, number, number];
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
	minZ: number;
	maxZ: number;
	centerX: number;
	centerY: number;
	centerZ: number;
	xSize: number;
	ySize: number;
	zSize: number;
	geometryRadius: number;
}

/**
 * Calculates the volume of a given vertex buffer.
 *
 * @param {VertexBuffer} vertexBuffer - The vertex buffer representing the geometry.
 * @returns {IVolumeAABB} - An object containing the calculated volume and related properties.
 */
const calculateGeometryAABB = (vertexBuffer: VertexBuffer): IVolumeAABB => {
	const stride = vertexBuffer.stride;
	const data = vertexBuffer.data;
	let len = vertexBuffer.vertexCount;
	let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
	let i = 0;
	// Process 4 vertices at a time
	for (; i <= len - 4; i += 4) {
		let idx = i * stride;
		const x1 = data[idx];
		const y1 = data[idx + 1];
		const z1 = data[idx + 2];
		idx = (i + 1) * stride;
		const x2 = data[idx];
		const y2 = data[idx + 1];
		const z2 = data[idx + 2];
		idx = (i + 2) * stride;
		const x3 = data[idx];
		const y3 = data[idx + 1];
		const z3 = data[idx + 2];
		idx = (i + 3) * stride;
		const x4 = data[idx];
		const y4 = data[idx + 1];
		const z4 = data[idx + 2];
		minX = Math.min(x1, x2, x3, x4, minX);
		minY = Math.min(y1, y2, y3, y4, minY);
		minZ = Math.min(z1, z2, z3, z4, minZ);
		maxX = Math.max(x1, x2, x3, x4, maxX);
		maxY = Math.max(y1, y2, y3, y4, maxY);
		maxZ = Math.max(z1, z2, z3, z4, maxZ);
	}
	// Process remaining vertices
	for (; i < len; i++) {
		let idx = i * stride;
		const x = data[idx];
		const y = data[idx + 1];
		const z = data[idx + 2];
		minX = Math.min(x, minX);
		minY = Math.min(y, minY);
		minZ = Math.min(z, minZ);
		maxX = Math.max(x, maxX);
		maxY = Math.max(y, maxY);
		maxZ = Math.max(z, maxZ);
	}

	// 중심점 계산 추가
	const centerX = (maxX + minX) / 2;
	const centerY = (maxY + minY) / 2;
	const centerZ = (maxZ + minZ) / 2;

	const xSize = Math.max(Math.abs(minX), Math.abs(maxX));
	const ySize = Math.max(Math.abs(minY), Math.abs(maxY));
	const zSize = Math.max(Math.abs(minZ), Math.abs(maxZ));
	const geometryRadius = Math.max(xSize, ySize, zSize);

	return {
		// volume: [maxX - minX, maxY - minY, maxZ - minZ],
		minX,
		maxX,
		minY,
		maxY,
		minZ,
		maxZ,
		centerX,
		centerY,
		centerZ,
		xSize,
		ySize,
		zSize,
		geometryRadius,
	};
}
export default calculateGeometryAABB
