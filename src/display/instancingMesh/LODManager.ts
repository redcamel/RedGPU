import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";

type LODGeometry = Geometry | Primitive;

type LODEntry = {
	distance: number;
	geometry: LODGeometry;
};

class LODManager {
	#lodList: LODEntry[] = [];

	addLOD(distance: number, geometry: LODGeometry) {
		validatePositiveNumberRange(distance,1)
		if (this.#lodList.length >= 8) {
			throw new Error("Maximum of 8 LOD levels allowed.");
		}

		if (this.#lodList.some(lod => lod.distance === distance)) {
			throw new Error(`LOD with distance ${distance} already exists.`);
		}

		this.#lodList.push({ distance, geometry });
		this.#lodList.sort((a, b) => a.distance - b.distance);
	}

	getLOD(currentDistance: number): LODGeometry | undefined {
		for (const lod of this.#lodList) {
			if (currentDistance < lod.distance) return lod.geometry;
		}
		return this.#lodList.at(-1)?.geometry;
	}

	removeLOD(distance: number) {
		this.#lodList = this.#lodList.filter(lod => lod.distance !== distance);
	}
	clearLOD() {
		this.#lodList.length = 0
	}

	get lodList(): LODEntry[] {
		return [...this.#lodList];
	}
}

export default LODManager;
