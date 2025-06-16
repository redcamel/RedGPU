import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

class TorusKnot extends Primitive {
	#makeData = (function () {
		return function (uniqueKey, redGPUContext,
		                 radius,
		                 tube,
		                 tubularSegments,
		                 radialSegments,
		                 p,
		                 q
		) {
			////////////////////////////////////////////////////////////////////////////
			// 데이터 생성!
			// vertexBuffer Data
			tubularSegments = Math.floor(tubularSegments);
			radialSegments = Math.floor(radialSegments);
			const interleaveData = []
			const indexData = [];
			const vertex = []
			const normal = []
			const P1 = [0, 0, 0]
			const P2 = [0, 0, 0]
			const B = [0, 0, 0]
			const T = [0, 0, 0]
			const N = [0, 0, 0]
			for (let i = 0; i <= tubularSegments; ++i) {
				const u = i / tubularSegments * p * Math.PI * 2;
				calculatePositionOnCurve(u, p, q, radius, P1);
				calculatePositionOnCurve(u + 0.01, p, q, radius, P2);
				// calculate orthonormal basis
				T[0] = P2[0] - P1[0];
				T[1] = P2[1] - P1[1];
				T[2] = P2[2] - P1[2];
				//
				N[0] = P2[0] + P1[0];
				N[1] = P2[1] + P1[1];
				N[2] = P2[2] + P1[2];
				{
					const ax = T[0], ay = T[1], az = T[2];
					const bx = N[0], by = N[1], bz = N[2];
					B[0] = ay * bz - az * by;
					B[1] = az * bx - ax * bz;
					B[2] = ax * by - ay * bx;
				}
				{
					const ax = B[0], ay = B[1], az = B[2];
					const bx = T[0], by = T[1], bz = T[2];
					N[0] = ay * bz - az * by;
					N[1] = az * bx - ax * bz;
					N[2] = ax * by - ay * bx;
				}
				// normalize B, N. T can be ignored, we don't use it
				{
					let x = B[0];
					let y = B[1];
					let z = B[2];
					let len = x * x + y * y + z * z;
					if (len > 0) {
						len = 1 / Math.sqrt(len || 1);
					}
					B[0] = B[0] * len;
					B[1] = B[1] * len;
					B[2] = B[2] * len;
				}
				{
					let x = N[0];
					let y = N[1];
					let z = N[2];
					let len = x * x + y * y + z * z;
					if (len > 0) {
						len = 1 / Math.sqrt(len);
					}
					N[0] = N[0] * len;
					N[1] = N[1] * len;
					N[2] = N[2] * len;
				}
				for (let j = 0; j <= radialSegments; ++j) {
					const v = j / radialSegments * Math.PI * 2;
					const cx = -tube * Math.cos(v);
					const cy = tube * Math.sin(v);
					vertex[0] = P1[0] + (cx * N[0] + cy * B[0]);
					vertex[1] = P1[1] + (cx * N[1] + cy * B[1]);
					vertex[2] = P1[2] + (cx * N[2] + cy * B[2]);
					interleaveData.push(
						vertex[0], vertex[1], vertex[2],
					);
					{
						normal[0] = vertex[0] - P1[0];
						normal[1] = vertex[1] - P1[1];
						normal[2] = vertex[2] - P1[2];
						let x = normal[0];
						let y = normal[1];
						let z = normal[2];
						let len = x * x + y * y + z * z;
						if (len > 0) {
							len = 1 / Math.sqrt(len);
						}
						normal[0] = normal[0] * len;
						normal[1] = normal[1] * len;
						normal[2] = normal[2] * len;
					}
					interleaveData.push(
						normal[0], normal[1], normal[2],
						i / tubularSegments, j / radialSegments
					);
				}
			}
			for (let j = 1; j <= tubularSegments; j++) {
				for (let i = 1; i <= radialSegments; i++) {
					// indices
					const a = (radialSegments + 1) * (j - 1) + (i - 1);
					const b = (radialSegments + 1) * j + (i - 1);
					const c = (radialSegments + 1) * j + i;
					const d = (radialSegments + 1) * (j - 1) + i;
					// faces
					indexData.push(a, b, d);
					indexData.push(b, c, d);
				}
			}
			// console.log('interleaveData', interleaveData)
			// console.log('interleaveData', indexData)
			return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey)
		};
	})();

	constructor(redGPUContext: RedGPUContext,
	            radius = 1,
	            tube = 0.4,
	            tubularSegments = 64,
	            radialSegments = 8,
	            p = 2,
	            q = 3
	) {
		super(redGPUContext);
		const uniqueKey = `PRIMITIVE_TORUS_NUT_R${radius}_T${tube}_TS${tubularSegments}_RS${radialSegments}_P${p}_Q${q}`;
		const cachedBufferState = redGPUContext.resourceManager.cachedBufferState
		let geometry = cachedBufferState[uniqueKey]
		if (!geometry) {
			geometry = cachedBufferState[uniqueKey] = this.#makeData(uniqueKey, redGPUContext,
				radius,
				tube,
				tubularSegments,
				radialSegments,
				p,
				q
			)
		}
		this._setData(geometry)
	}
}

function calculatePositionOnCurve(u, p, q, radius, position) {
	const cu = Math.cos(u);
	const su = Math.sin(u);
	const quOverP = q / p * u;
	const cs = Math.cos(quOverP);
	position[0] = radius * (2 + cs) * 0.5 * cu;
	position[1] = radius * (2 + cs) * su * 0.5;
	position[2] = radius * Math.sin(quOverP) * 0.5;
}

export default TorusKnot
