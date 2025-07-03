import consoleAndThrowError from "../../consoleAndThrowError";

export class AABB {
	#minX: number;
	#maxX: number;
	#minY: number;
	#maxY: number;
	#minZ: number;
	#maxZ: number;
	#centerX: number;
	#centerY: number;
	#centerZ: number;
	#xSize: number;
	#ySize: number;
	#zSize: number;
	#geometryRadius: number;

	constructor(
		minX: number,
		maxX: number,
		minY: number,
		maxY: number,
		minZ: number,
		maxZ: number
	) {
		this.#minX = minX;
		this.#maxX = maxX;
		this.#minY = minY;
		this.#maxY = maxY;
		this.#minZ = minZ;
		this.#maxZ = maxZ;
		this.#centerX = (maxX + minX) / 2;
		this.#centerY = (maxY + minY) / 2;
		this.#centerZ = (maxZ + minZ) / 2;
		this.#xSize = maxX - minX;
		this.#ySize = maxY - minY;
		this.#zSize = maxZ - minZ;
		this.#geometryRadius = Math.sqrt((this.#xSize / 2) ** 2 + (this.#ySize / 2) ** 2 + (this.#zSize / 2) ** 2);
	}

	get minX(): number {
		return this.#minX;
	}

	get maxX(): number {
		return this.#maxX;
	}

	get minY(): number {
		return this.#minY;
	}

	get maxY(): number {
		return this.#maxY;
	}

	get minZ(): number {
		return this.#minZ;
	}

	get maxZ(): number {
		return this.#maxZ;
	}

	get centerX(): number {
		return this.#centerX;
	}

	get centerY(): number {
		return this.#centerY;
	}

	get centerZ(): number {
		return this.#centerZ;
	}

	get xSize(): number {
		return this.#xSize;
	}

	get ySize(): number {
		return this.#ySize;
	}

	get zSize(): number {
		return this.#zSize;
	}

	get geometryRadius(): number {
		return this.#geometryRadius;
	}

	intersects(other: AABB): boolean {
		if(!(other instanceof AABB)){
			consoleAndThrowError('allow only AABB instance')
		}
		return this.#minX <= other.#maxX && this.#maxX >= other.#minX &&
			this.#minY <= other.#maxY && this.#maxY >= other.#minY &&
			this.#minZ <= other.#maxZ && this.#maxZ >= other.#minZ;
	}

	contains(pointOrX: [number, number, number] | number, y?: number, z?: number): boolean {
		if (Array.isArray(pointOrX)) {
			const [x, y, z] = pointOrX;
			return x >= this.#minX && x <= this.#maxX &&
				y >= this.#minY && y <= this.#maxY &&
				z >= this.#minZ && z <= this.#maxZ;
		} else {
			return pointOrX >= this.#minX && pointOrX <= this.#maxX &&
				y! >= this.#minY && y! <= this.#maxY &&
				z! >= this.#minZ && z! <= this.#maxZ;
		}
	}

	union(other: AABB): AABB {
		if(!(other instanceof AABB)){
			consoleAndThrowError('allow only AABB instance')
		}
		return new AABB(
			Math.min(this.#minX, other.#minX), Math.max(this.#maxX, other.#maxX),
			Math.min(this.#minY, other.#minY), Math.max(this.#maxY, other.#maxY),
			Math.min(this.#minZ, other.#minZ), Math.max(this.#maxZ, other.#maxZ)
		);
	}
	clone(): AABB {
		return new AABB(this.#minX, this.#maxX, this.#minY, this.#maxY, this.#minZ, this.#maxZ);
	}

}

export default AABB;
