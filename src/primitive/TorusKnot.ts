import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] TorusKnot(토러스-노트, 매듭 토러스) 기본 도형 클래스입니다.
 * [EN] TorusKnot primitive geometry class.
 *
 * [KO] 반지름, 튜브 두께, 매듭 파라미터 등을 기반으로 3D 매듭형 도넛 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 3D torus knot data based on radius, tube thickness, knot parameters, etc.
 *
 * ### Example
 * ```typescript
 * // p=2, q=3 매듭 토러스 생성
 * const torusKnot = new RedGPU.TorusKnot(redGPUContext, 1, 0.4, 128, 16, 2, 3);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/torusNut/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class TorusKnot extends Primitive {
    /**
     * [KO] TorusKnot 인스턴스를 생성합니다.
     * [EN] Creates an instance of TorusKnot.
     *
     * ### Example
     * ```typescript
     * const torusKnot = new RedGPU.TorusKnot(redGPUContext, 1, 0.4, 64, 8, 2, 3);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 전체 반지름 (기본값 1)
     * [EN] Overall radius (default 1)
     * @param tube -
     * [KO] 튜브(단면) 반지름 (기본값 0.4)
     * [EN] Tube radius (default 0.4)
     * @param tubularSegments -
     * [KO] 둘레 세그먼트 수 (기본값 64, 최소 3)
     * [EN] Tubular segments (default 64, min 3)
     * @param radialSegments -
     * [KO] 단면 세그먼트 수 (기본값 8, 최소 3)
     * [EN] Radial segments (default 8, min 3)
     * @param p -
     * [KO] 매듭 파라미터 p (기본값 2)
     * [EN] Knot parameter p (default 2)
     * @param q -
     * [KO] 매듭 파라미터 q (기본값 3)
     * [EN] Knot parameter q (default 3)
     */
    constructor(redGPUContext: RedGPUContext,
                radius = 1,
                tube = 0.4,
                tubularSegments = 64,
                radialSegments = 8,
                p = 2,
                q = 3
    ) {
        const uniqueKey = `PRIMITIVE_TORUS_NUT_R${radius}_T${tube}_TS${tubularSegments}_RS${radialSegments}_P${p}_Q${q}`;
        super(redGPUContext, uniqueKey, () => makeData(uniqueKey, redGPUContext,
            radius,
            tube,
            tubularSegments,
            radialSegments,
            p,
            q
        ));
    }
}

const makeData = function (uniqueKey, redGPUContext,
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
    const vertex = [0, 0, 0]
    const normal = [0, 0, 0]
    const P1 = [0, 0, 0]
    const P2 = [0, 0, 0]
    const B = [0, 0, 0]
    const T = [0, 0, 0]
    const N = [0, 0, 0]

    const gridX1 = radialSegments + 1;

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

            // Normal
            normal[0] = vertex[0] - P1[0];
            normal[1] = vertex[1] - P1[1];
            normal[2] = vertex[2] - P1[2];
            let nx = normal[0];
            let ny = normal[1];
            let nz = normal[2];
            let len = nx * nx + ny * ny + nz * nz;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
            }
            nx *= len;
            ny *= len;
            nz *= len;

            // UV & Packing
            PrimitiveUtils.interleavePacker(
                interleaveData,
                vertex[0], vertex[1], vertex[2],
                nx, ny, nz,
                i / tubularSegments, j / radialSegments
            );
        }
    }

    // Indices (PrimitiveUtils.generateGridIndices 사용)
    PrimitiveUtils.generateGridIndices(indexData, 0, radialSegments, tubularSegments, gridX1);

    return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey)
};

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
