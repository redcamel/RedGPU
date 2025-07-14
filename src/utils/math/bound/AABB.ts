import consoleAndThrowError from "../../consoleAndThrowError";

export class AABB {
	readonly minX: number;
	readonly maxX: number;
	readonly minY: number;
	readonly maxY: number;
	readonly minZ: number;
	readonly maxZ: number;
	readonly centerX: number;
	readonly centerY: number;
	readonly centerZ: number;
	readonly xSize: number;
	readonly ySize: number;
	readonly zSize: number;
	readonly geometryRadius: number;

	constructor(
		minX: number,
		maxX: number,
		minY: number,
		maxY: number,
		minZ: number,
		maxZ: number
	) {
		this.minX = minX;
		this.maxX = maxX;
		this.minY = minY;
		this.maxY = maxY;
		this.minZ = minZ;
		this.maxZ = maxZ;
		this.centerX = (maxX + minX) / 2;
		this.centerY = (maxY + minY) / 2;
		this.centerZ = (maxZ + minZ) / 2;
		this.xSize = maxX - minX;
		this.ySize = maxY - minY;
		this.zSize = maxZ - minZ;
		this.geometryRadius = Math.sqrt((this.xSize / 2) ** 2 + (this.ySize / 2) ** 2 + (this.zSize / 2) ** 2);
	}

	intersects(other: AABB): boolean {
		if (!(other instanceof AABB)) {
			consoleAndThrowError('allow only AABB instance')
		}
		return this.minX <= other.maxX && this.maxX >= other.minX &&
			this.minY <= other.maxY && this.maxY >= other.minY &&
			this.minZ <= other.maxZ && this.maxZ >= other.minZ;
	}

	contains(pointOrX: [number, number, number] | number, y?: number, z?: number): boolean {
		if (Array.isArray(pointOrX)) {
			const [x, y, z] = pointOrX;
			return x >= this.minX && x <= this.maxX &&
				y >= this.minY && y <= this.maxY &&
				z >= this.minZ && z <= this.maxZ;
		} else {
			return pointOrX >= this.minX && pointOrX <= this.maxX &&
				y! >= this.minY && y! <= this.maxY &&
				z! >= this.minZ && z! <= this.maxZ;
		}
	}

	clone(): AABB {
		return new AABB(this.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ);
	}
}

export default AABB;
