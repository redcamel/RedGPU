import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

class Ground extends Primitive {
	#makeData = (function () {
		const interleaveData = [];
		const indexData = [];
		return function (uniqueKey, redGPUContext, width, height, wSegments, hSegments, uvSize, flipY) {
			const width_half = width / 2;
			const height_half = height / 2;
			const gridX = Math.floor(wSegments) || 1;
			const gridY = Math.floor(hSegments) || 1;
			const gridX1 = gridX + 1;
			const gridY1 = gridY + 1;
			const segment_width = width / gridX;
			const segment_height = height / gridY;

			interleaveData.length = 0;
			indexData.length = 0;

			// Ground는 XZ 평면에 배치 (Y=0이 땅 높이)
			for (let iy = 0; iy < gridY1; iy++) {
				const tZ = iy * segment_height - height_half;
				const uvY = flipY ? (1 - iy / gridY) * uvSize : (iy / gridY) * uvSize;

				for (let ix = 0; ix < gridX1; ix++) {
					const tX = ix * segment_width - width_half;
					const uvX = ix / gridX * uvSize;

					interleaveData.push(
						tX,    // x
						0,     // y (땅 높이)
						tZ,    // z (기존 Plane의 -tY와 같은 패턴)
						0,     // normal x
						1,     // normal y (위쪽)
						0,     // normal z
						uvX,   // u
						uvY    // v
					);

					if (iy < gridY && ix < gridX) {
						const a = ix + gridX1 * iy;
						const b = ix + gridX1 * (iy + 1);
						const c = (ix + 1) + gridX1 * (iy + 1);
						const d = (ix + 1) + gridX1 * iy;

						indexData.push(a, b, d);
						indexData.push(b, c, d);
					}
				}
			}

			return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
		};
	})();

	constructor(redGPUContext: RedGPUContext, width = 1, height = 1, wSegments = 1, hSegments = 1, uvSize = 1, flipY = false) {
		super(redGPUContext);
		const uniqueKey = `PRIMITIVE_GROUND_W${width}_H${height}_WS${wSegments}_HS${hSegments}_UV${uvSize}_FY${flipY}`;
		const cachedBufferState = redGPUContext.resourceManager.cachedBufferState;

		let geometry = cachedBufferState[uniqueKey];
		if (!geometry) {
			geometry = cachedBufferState[uniqueKey] = this.#makeData(uniqueKey, redGPUContext, width, height, wSegments, hSegments, uvSize, flipY);
		}
		this._setData(geometry);
	}
}

export default Ground;
