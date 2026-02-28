import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] Torus(토러스, 도넛) 기본 도형 클래스입니다.
 * [EN] Torus primitive geometry class.
 *
 * [KO] 반지름, 두께, 세그먼트 등을 기반으로 3D 도넛 형태의 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 3D torus data based on radius, thickness, segments, etc.
 *
 * ### Example
 * ```typescript
 * // 반지름 2, 두께 0.5짜리 토러스 생성
 * const torus = new RedGPU.Torus(redGPUContext, 2, 0.5);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/torus/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Torus extends Primitive {
    /**
     * [KO] Torus 인스턴스를 생성합니다.
     * [EN] Creates an instance of Torus.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param radius - [KO] 중심 원 반지름 [EN] Major radius
     * @param thickness - [KO] 단면(튜브) 반지름 [EN] Minor radius/thickness
     * @param radialSubdivisions - [KO] 둘레 세그먼트 수 [EN] Radial segments
     * @param bodySubdivisions - [KO] 단면 세그먼트 수 [EN] Tubular segments
     * @param startAngle - [KO] 시작 각도 [EN] Starting angle
     * @param endAngle - [KO] 끝 각도 [EN] Ending angle
     */
    constructor(redGPUContext: RedGPUContext,
                radius = 1,
                thickness = 0.5,
                radialSubdivisions = 16,
                bodySubdivisions = 16,
                startAngle = 0,
                endAngle = Math.PI * 2
    ) {
        if (radialSubdivisions < 3) {
            throw new Error('radialSubdivisions must be 3 or greater');
        }
        if (bodySubdivisions < 3) {
            throw new Error('verticalSubdivisions must be 3 or greater');
        }
        const uniqueKey = `PRIMITIVE_TORUS_R${radius}_T${thickness}_RSD${radialSubdivisions}_BSD${bodySubdivisions}_SA${startAngle}_EA${endAngle}`;
        super(redGPUContext, uniqueKey, () => makeData(uniqueKey, redGPUContext,
            radius,
            thickness,
            radialSubdivisions,
            bodySubdivisions,
            startAngle,
            endAngle
        ));
    }
}

const makeData = function (uniqueKey, redGPUContext,
                           radius,
                           thickness,
                           radialSubdivisions,
                           bodySubdivisions,
                           startAngle,
                           endAngle
) {
    startAngle = startAngle || 0;
    endAngle = endAngle || Math.PI * 2;
    const range = endAngle - startAngle;
    const isPartial = Math.abs(range) < Math.PI * 2;

    const radialParts = radialSubdivisions + 1;
    const bodyParts = bodySubdivisions + 1;
    const interleaveData = [];
    const indexData = [];

    // 1. Torus Body 생성
    const vertexOffset = interleaveData.length / 12;
    for (let slice = 0; slice <= bodySubdivisions; ++slice) {
        const v = slice / bodySubdivisions;
        const sliceAngle = v * Math.PI * 2;
        const sliceSin = Math.sin(sliceAngle);
        const ringRadius = radius + sliceSin * thickness;
        const ny = Math.cos(sliceAngle);
        const y = ny * thickness;

        for (let ring = 0; ring <= radialSubdivisions; ++ring) {
            const u = ring / radialSubdivisions;
            // [교정] 실린더/구체와 일관성을 위해 PI(180도) 오프셋 추가 (이음새를 뒤로 보냄)
            const ringAngle = startAngle + u * range + Math.PI;
            const xSin = Math.sin(ringAngle);
            const zCos = Math.cos(ringAngle);
            const x = xSin * ringRadius;
            const z = zCos * ringRadius;
            const nx = xSin * sliceSin;
            const nz = zCos * sliceSin;

            // Packing (12 floats)
            PrimitiveUtils.interleavePacker(
                interleaveData,
                x, y, z,
                nx, ny, nz,
                u, v // [교정] V-Down 표준에 맞춰 v 그대로 사용
            );
        }
    }

    // Body Indices (PrimitiveUtils.generateGridIndices 사용)
    PrimitiveUtils.generateGridIndices(indexData, vertexOffset, radialSubdivisions, bodySubdivisions, radialSubdivisions + 1);


    // 2. Partial Torus일 경우 단면 막기 (Caps)
    if (isPartial) {
        // Start Angle Cap
        const sSin = Math.sin(startAngle);
        const sCos = Math.cos(startAngle);
        PrimitiveUtils.generateCircleData(
            interleaveData, indexData,
            thickness, bodySubdivisions,
            0, Math.PI * 2,
            {x: sSin * radius, y: 0, z: sCos * radius}, // Center
            {x: sSin, y: 0, z: sCos},                   // uVector (Radial)
            {x: 0, y: 1, z: 0},                         // vVector (Up)
            {x: -sCos, y: 0, z: sSin}                   // Normal (Reverse Tangent)
        );

        // End Angle Cap
        const eSin = Math.sin(endAngle);
        const eCos = Math.cos(endAngle);
        PrimitiveUtils.generateCircleData(
            interleaveData, indexData,
            thickness, bodySubdivisions,
            0, Math.PI * 2,
            {x: eSin * radius, y: 0, z: eCos * radius}, // Center
            {x: eSin, y: 0, z: eCos},                   // uVector (Radial)
            {x: 0, y: 1, z: 0},                         // vVector (Up)
            {x: eCos, y: 0, z: -eSin}                   // Normal (Tangent)
        );
    }

    return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey)
};

export default Torus;
