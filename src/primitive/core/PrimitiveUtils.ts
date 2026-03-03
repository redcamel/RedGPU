import {calculateTangentsInterleaved} from "../../math/calculateTangents";
import createPrimitiveGeometry from "./createPrimitiveGeometry";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "./Primitive";

/**
 * [KO] 프리미티브 생성을 위한 공통 수학 및 데이터 처리 유틸리티 클래스입니다.
 * [EN] Utility class for common math and data processing for primitive generation.
 *
 * @category Core
 */
class PrimitiveUtils {
    // [KO] 공유 기저 벡터 및 임시 객체 (메모리 재사용 최적화)
    static readonly #BASIS_U = {x: 1, y: 0, z: 0};      // +X
    static readonly #BASIS_V = {x: 0, y: 0, z: -1};     // -Z (12 o'clock)
    static readonly #ZERO_VECTOR = {x: 0, y: 0, z: 0};  // Origin
    static readonly #AXIS_UP = {x: 0, y: 1, z: 0};      // +Y
    static readonly #AXIS_DOWN = {x: 0, y: -1, z: 0};   // -Y
    
    // [KO] 내부 복합 연산용 Scratchpad 객체 (GC-Free 최적화)
    static readonly #SCRATCH_V1 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V2 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V3 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V4 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V5 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V6 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V7 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V8 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V9 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V10 = {x: 0, y: 0, z: 0};

    static get #STRIDE_FLOATS(): number {
        return Primitive.primitiveInterleaveStruct.arrayStride / 4;
    }

    static finalize(redGPUContext: RedGPUContext, interleaveData: number[], indexData: number[], uniqueKey: string): Geometry {
        this.calculateTangents(interleaveData, indexData);
        return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateGrid(interleaveData: number[], indexData: number[], resolutionX: number, resolutionY: number, vertexCallback: (u: number, v: number, ix: number, iy: number) => void, skipIndices: boolean = false, reverseIndices: boolean = false) {
        const vertexOffset = interleaveData.length / this.#STRIDE_FLOATS;
        for (let iy = 0; iy <= resolutionY; iy++) {
            const v = iy / resolutionY;
            for (let ix = 0; ix <= resolutionX; ix++) {
                vertexCallback(ix / resolutionX, v, ix, iy);
            }
        }
        if (!skipIndices && indexData) this.generateGridIndices(indexData, vertexOffset, resolutionX, resolutionY, resolutionX + 1, reverseIndices);
    }

    static getEmptyGeometry(redGPUContext: RedGPUContext, uniqueKey: string): Geometry {
        const interleaveData = [];
        this.interleavePacker(interleaveData, 0, 0, 0, 0, 1, 0, 0, 0);
        return createPrimitiveGeometry(redGPUContext, interleaveData, [], uniqueKey);
    }

    static generateBoxData(redGPUContext: RedGPUContext, width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number, uniqueKey: string): Geometry {
        return this.generateRoundedBoxData(redGPUContext, width, height, depth, widthSegments, heightSegments, depthSegments, 0, 0, uniqueKey);
    }

    static generateRoundedBoxData(redGPUContext: RedGPUContext, width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number, radius: number, radiusSegments: number, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [], w2 = width / 2, h2 = height / 2, d2 = depth / 2;
        const r = Math.min(radius, w2, h2, d2);
        const boxDim = r > 0 ? { w: width, h: height, d: depth, r } : null;

        // [KO] 통합된 generatePlaneData를 사용하여 6개 면 생성
        this.generatePlaneData(interleaveData, indexData, depth, height, depthSegments, heightSegments, {x: w2, y: 0, z: 0}, {x: 0, y: 0, z: -1}, {x: 0, y: -1, z: 0}, {x: 1, y: 0, z: 0}, r, radiusSegments, boxDim);
        this.generatePlaneData(interleaveData, indexData, depth, height, depthSegments, heightSegments, {x: -w2, y: 0, z: 0}, {x: 0, y: 0, z: 1}, {x: 0, y: -1, z: 0}, {x: -1, y: 0, z: 0}, r, radiusSegments, boxDim);
        this.generatePlaneData(interleaveData, indexData, width, depth, widthSegments, depthSegments, {x: 0, y: h2, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: 1}, {x: 0, y: 1, z: 0}, r, radiusSegments, boxDim);
        this.generatePlaneData(interleaveData, indexData, width, depth, widthSegments, depthSegments, {x: 0, y: -h2, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: -1}, {x: 0, y: -1, z: 0}, r, radiusSegments, boxDim);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, {x: 0, y: 0, z: d2}, {x: 1, y: 0, z: 0}, {x: 0, y: -1, z: 0}, {x: 0, y: 0, z: 1}, r, radiusSegments, boxDim);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, {x: 0, y: 0, z: -d2}, {x: -1, y: 0, z: 0}, {x: 0, y: -1, z: 0}, {x: 0, y: 0, z: -1}, r, radiusSegments, boxDim);

        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generatePlaneData(
        interleaveData: number[], indexData: number[], 
        width: number, height: number, 
        mainSegmentsX: number, mainSegmentsY: number, 
        center: any, uV: any, vV: any, normal: any,
        radius: number = 0, radiusSegments: number = 0, 
        boxDim: any = null, flipY: boolean = false
    ) {
        const startIdx = interleaveData.length / this.#STRIDE_FLOATS;
        const totalResX = mainSegmentsX + radiusSegments * 2;
        const totalResY = mainSegmentsY + radiusSegments * 2;

        const getCoordInfo = (index: number, size: number, r: number, rSeg: number, mSeg: number) => {
            if (r <= 0 || rSeg <= 0) {
                const u = index / mSeg;
                return { pos: (u - 0.5) * size, norm: 0, uv: u };
            }
            const limit = size / 2 - r;
            const arcLength = (Math.PI / 2) * r;
            const totalLength = arcLength * 2 + (limit * 2);
            if (index <= rSeg) {
                const ratio = index / rSeg, angle = (1 - ratio) * Math.PI / 2;
                return { pos: -limit - Math.sin(angle) * r, norm: -Math.sin(angle), uv: (ratio * arcLength) / totalLength };
            } else if (index <= rSeg + mSeg) {
                const ratio = (index - rSeg) / mSeg;
                return { pos: -limit + ratio * (limit * 2), norm: 0, uv: (arcLength + ratio * (limit * 2)) / totalLength };
            } else {
                const ratio = (index - rSeg - mSeg) / rSeg, angle = ratio * Math.PI / 2;
                return { pos: limit + Math.sin(angle) * r, norm: Math.sin(angle), uv: (arcLength + (limit * 2) + ratio * arcLength) / totalLength };
            }
        };

        for (let iy = 0; iy <= totalResY; iy++) {
            const yInfo = getCoordInfo(iy, height, radius, radiusSegments, mainSegmentsY);
            const uvY = flipY ? (1 - yInfo.uv) : yInfo.uv;
            for (let ix = 0; ix <= totalResX; ix++) {
                const xInfo = getCoordInfo(ix, width, radius, radiusSegments, mainSegmentsX);

                let px = center.x + xInfo.pos * uV.x + yInfo.pos * vV.x;
                let py = center.y + xInfo.pos * uV.y + yInfo.pos * vV.y;
                let pz = center.z + xInfo.pos * uV.z + yInfo.pos * vV.z;
                let nx = normal.x, ny = normal.y, nz = normal.z;

                if (boxDim) {
                    const { w, h, d, r } = boxDim;
                    const innerW2 = w / 2 - r, innerH2 = h / 2 - r, innerD2 = d / 2 - r;
                    const cx = Math.max(-innerW2, Math.min(px, innerW2)), cy = Math.max(-innerH2, Math.min(py, innerH2)), cz = Math.max(-innerD2, Math.min(pz, innerD2));
                    const dx = px - cx, dy = py - cy, dz = pz - cz;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
                    nx = dx / dist; ny = dy / dist; nz = dz / dist;
                    px = cx + nx * r; py = cy + ny * r; pz = cz + nz * r;
                }
                this.interleavePacker(interleaveData, px, py, pz, nx, ny, nz, xInfo.uv, uvY);
            }
        }
        this.generateGridIndices(indexData, startIdx, totalResX, totalResY, totalResX + 1);
    }

    static generateSphereData(redGPUContext: RedGPUContext, radius: number, widthSegments: number, heightSegments: number, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (radius <= 0 || Math.abs(phiLength) < 1e-6 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generateSphericalData(interleaveData, indexData, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateCylinderData(redGPUContext: RedGPUContext, radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number, capTop: boolean, capBottom: boolean, thetaStart: number, thetaLength: number, isRadialTop: boolean, isRadialBottom: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [], halfH = height / 2;
        if ((radiusTop <= 0 && radiusBottom <= 0) || height <= 0 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generateCylinderTorsoData(interleaveData, indexData, radiusTop, radiusBottom, height, radialSegments, heightSegments, thetaStart, thetaLength, this.#ZERO_VECTOR, this.#BASIS_U, this.#BASIS_V);
        if (capTop && radiusTop > 0) this.generateRingData(interleaveData, indexData, 0, radiusTop, radialSegments, 1, thetaStart, thetaLength, {x: 0, y: halfH, z: 0}, this.#BASIS_U, this.#BASIS_V, this.#AXIS_UP, true, isRadialTop);
        if (capBottom && radiusBottom > 0) this.generateRingData(interleaveData, indexData, 0, radiusBottom, radialSegments, 1, thetaStart, thetaLength, {x: 0, y: -halfH, z: 0}, this.#BASIS_U, this.#BASIS_V, this.#AXIS_DOWN, false, isRadialBottom);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateConeData(redGPUContext: RedGPUContext, radius: number, height: number, radialSegments: number, heightSegments: number, capBottom: boolean, thetaStart: number, thetaLength: number, uniqueKey: string): Geometry {
        return this.generateCylinderData(redGPUContext, 0, radius, height, radialSegments, heightSegments, false, capBottom, thetaStart, thetaLength, false, false, uniqueKey);
    }

    static generatePlaneEntryData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (width <= 0 || height <= 0) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, this.#ZERO_VECTOR, this.#BASIS_U, {x: 0, y: -1, z: 0}, {x: 0, y: 0, z: 1}, 0, 0, null, flipY);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateGroundData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (width <= 0 || height <= 0) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, this.#ZERO_VECTOR, this.#BASIS_U, {x: 0, y: 0, z: 1}, this.#AXIS_UP, 0, 0, null, flipY);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateCircleEntryData(redGPUContext: RedGPUContext, radius: number, radialSegments: number, thetaStart: number, thetaLength: number, isRadial: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (radius <= 0 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generateRingData(interleaveData, indexData, 0, radius, radialSegments, 1, thetaStart, thetaLength, this.#ZERO_VECTOR, this.#BASIS_U, this.#BASIS_V, this.#AXIS_UP, true, isRadial);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateRingEntryData(redGPUContext: RedGPUContext, innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number, thetaStart: number, thetaLength: number, isRadial: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (outerRadius <= 0 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generateRingData(interleaveData, indexData, innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength, this.#ZERO_VECTOR, this.#BASIS_U, this.#BASIS_V, this.#AXIS_UP, true, isRadial);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateTorusData(redGPUContext: RedGPUContext, radius: number, thickness: number, radialSegments: number, tubularSegments: number, thetaStart: number, thetaLength: number, capStart: boolean, capEnd: boolean, isRadialCapStart: boolean, isRadialCapEnd: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [], isPartial = Math.abs(thetaLength) < Math.PI * 2;
        this.generateGrid(interleaveData, indexData, radialSegments, tubularSegments, (u, v) => {
            const theta = thetaStart + u * thetaLength, phi = v * Math.PI * 2;
            const mR = this.#SCRATCH_V1, cT = this.#SCRATCH_V2, uT = this.#SCRATCH_V3, pos = this.#SCRATCH_V4, normal = this.#SCRATCH_V5;
            this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, theta, this.#BASIS_U, this.#BASIS_V, mR);
            this.#set(cT, mR.x * radius, 0, mR.z * radius);
            this.#set(uT, -mR.x, 0, -mR.z);
            this.#calculateRadialPoint(cT, thickness, phi, uT, this.#AXIS_UP, pos);
            this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, phi, uT, this.#AXIS_UP, normal);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, u, v);
        });
        if (isPartial) {
            const uV = this.#BASIS_U, vV = this.#BASIS_V, up = this.#AXIS_UP;
            const center = this.#SCRATCH_V1, normal = this.#SCRATCH_V2, tangent = this.#SCRATCH_V3;
            if (capStart) {
                this.#calculateRadialPoint(this.#ZERO_VECTOR, radius, thetaStart, uV, vV, center);
                this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, thetaStart, uV, vV, normal);
                this.#set(tangent, Math.cos(thetaStart), 0, -Math.sin(thetaStart));
                this.generateRingData(interleaveData, indexData, 0, thickness, tubularSegments, 1, 0, Math.PI * 2, center, normal, up, tangent, true, isRadialCapStart);
            }
            if (capEnd) {
                const angle = thetaStart + thetaLength;
                this.#calculateRadialPoint(this.#ZERO_VECTOR, radius, angle, uV, vV, center);
                this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, angle, uV, vV, normal);
                this.#set(tangent, -Math.cos(angle), 0, Math.sin(angle));
                this.generateRingData(interleaveData, indexData, 0, thickness, tubularSegments, 1, 0, Math.PI * 2, center, normal, up, tangent, false, isRadialCapEnd);
            }
        }
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateTorusKnotData(redGPUContext: RedGPUContext, radius: number, tubeRadius: number, tubularSegments: number, radialSegments: number, windingsAroundAxis: number, windingsAroundCircle: number, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        this.generateGrid(interleaveData, indexData, radialSegments, tubularSegments, (u, v) => {
            const knotU = v * windingsAroundAxis * Math.PI * 2;
            const P1 = this.#SCRATCH_V1, P2 = this.#SCRATCH_V2, T = this.#SCRATCH_V3, N = this.#SCRATCH_V4, B = this.#SCRATCH_V5, pos = this.#SCRATCH_V6, normal = this.#SCRATCH_V7, uT = this.#SCRATCH_V8, vT = this.#SCRATCH_V9;
            this.#calculateTorusKnotPosition(knotU, windingsAroundAxis, windingsAroundCircle, radius, P1);
            this.#calculateTorusKnotPosition(knotU + 0.01, windingsAroundAxis, windingsAroundCircle, radius, P2);
            this.#set(T, P2.x - P1.x, P2.y - P1.y, P2.z - P1.z);
            this.#set(N, P2.x + P1.x, P2.y + P1.y, P2.z + P1.z);
            this.#cross(T, N, B); this.#normalize(B);
            this.#cross(B, T, N); this.#normalize(N);
            const radialV = u * Math.PI * 2;
            this.#set(uT, -B.x, -B.y, -B.z);
            this.#set(vT, -N.x, -N.y, -N.z);
            this.#calculateRadialPoint(P1, tubeRadius, radialV, uT, vT, pos);
            this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, radialV, uT, vT, normal);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, v, u);
        });
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static #calculateTorusKnotPosition(u, p, q, radius, out) {
        const cu = Math.cos(u), su = Math.sin(u), quOverP = q / p * u, cs = Math.cos(quOverP);
        out.x = radius * (2 + cs) * 0.5 * cu; out.y = radius * (2 + cs) * su * 0.5; out.z = radius * Math.sin(quOverP) * 0.5;
    }

    static generateRingData(interleaveData: number[], indexData: number[], innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number, thetaStart: number, thetaLength: number, center: { x: number, y: number, z: number }, uV: { x: number, y: number, z: number }, vV: { x: number, y: number, z: number }, normal: { x: number, y: number, z: number }, isFront: boolean = true, isRadial: boolean = false, uvVStart: number = 0, uvVEnd: number = 1) {
        if (outerRadius <= 1e-6 || Math.abs(thetaLength) < 1e-6) {
            this.interleavePacker(interleaveData, center.x, center.y, center.z, normal.x, normal.y, normal.z, 0.5, 0.5);
            return;
        }
        const pos = this.#SCRATCH_V10;
        this.generateGrid(interleaveData, indexData, thetaSegments, phiSegments, (u, v) => {
            const r = innerRadius + v * (outerRadius - innerRadius), angle = thetaStart + u * thetaLength, uvV = uvVStart + v * (uvVEnd - uvVStart);
            this.#calculateRadialPoint(center, r, angle, uV, vV, pos);
            const uvX = isRadial ? u : 0.5 - (r / outerRadius * Math.sin(angle) * 0.5), uvY = isRadial ? uvV : 0.5 - (r / outerRadius * Math.cos(angle) * 0.5);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, uvX, uvY);
        }, false, !isFront);
    }

    static generateSphericalData(interleaveData: number[], indexData: number[], radius: number, widthSegments: number, heightSegments: number, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number, yOffset: number = 0, uvVStart: number = 0, uvVEnd: number = 1) {
        this.generateGrid(interleaveData, indexData, widthSegments, heightSegments, (u, v) => {
            const theta = thetaStart + v * thetaLength, phi = phiStart + u * phiLength, sinT = Math.sin(theta), cosT = Math.cos(theta), sinP = Math.sin(phi), cosP = Math.cos(phi), uvV = uvVStart + v * (uvVEnd - uvVStart);
            const nx = -sinP * sinT, ny = cosT, nz = -cosP * sinT;
            this.interleavePacker(interleaveData, radius * nx, radius * ny + yOffset, radius * nz, nx, ny, nz, u, uvV);
        }, indexData === null);
    }

    static generateCylinderTorsoData(interleaveData: number[], indexData: number[], radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number, thetaStart: number, thetaLength: number, center: { x: number, y: number, z: number }, uV: { x: number, y: number, z: number }, vV: { x: number, y: number, z: number }, axisVector: { x: number, y: number, z: number } = {x: 0, y: 1, z: 0}, skipIndices: boolean = false, uvVStart: number = 0, uvVEnd: number = 1) {
        const halfH = height / 2, slope = (radiusBottom - radiusTop) / height;
        if (thetaLength === 0 || (radiusTop <= 0 && radiusBottom <= 0)) {
            this.interleavePacker(interleaveData, center.x, center.y, center.z, 0, 1, 0, 0, 0);
            return;
        }
        const ringPos = this.#SCRATCH_V1, normalDir = this.#SCRATCH_V2, normal = this.#SCRATCH_V3;
        this.generateGrid(interleaveData, indexData, radialSegments, heightSegments, (u, v) => {
            const r = v * (radiusBottom - radiusTop) + radiusTop, angle = u * thetaLength + thetaStart, hOff = halfH - v * height, uvV = uvVStart + v * (uvVEnd - uvVStart);
            this.#calculateRadialPoint({x: 0, y: 0, z: 0}, r, angle, uV, vV, ringPos);
            this.#calculateRadialPoint({x: 0, y: 0, z: 0}, 1.0, angle, uV, vV, normalDir);
            const px = center.x + ringPos.x + hOff * axisVector.x, py = center.y + ringPos.y + hOff * axisVector.y, pz = center.z + ringPos.z + hOff * axisVector.z;
            this.#set(normal, normalDir.x + slope * axisVector.x, normalDir.y + slope * axisVector.y, normalDir.z + slope * axisVector.z);
            this.#normalize(normal);
            this.interleavePacker(interleaveData, px, py, pz, normal.x, normal.y, normal.z, u, uvV);
        }, skipIndices);
    }

    static #calculateRadialPoint(center: any, radius: number, angle: number, u: any, v: any, out: any) {
        const cos = Math.cos(angle), sin = Math.sin(angle);
        out.x = center.x + radius * (cos * v.x - sin * u.x);
        out.y = center.y + radius * (cos * v.y - sin * u.y);
        out.z = center.z + radius * (cos * v.z - sin * u.z);
    }

    static #set(out, x, y, z) { out.x = x; out.y = y; out.z = z; }
    static #normalize(v) { const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1; v.x /= len; v.y /= len; v.z /= len; }
    static #cross(a, b, out) { out.x = a.y * b.z - a.z * b.y; out.y = a.z * b.x - a.x * b.z; out.z = a.x * b.y - a.y * b.x; }

    static generateCapsuleData(redGPUContext: RedGPUContext, radius: number, height: number, radialSegments: number, heightSegments: number, capSegments: number, uniqueKey: string): Geometry {
        const interleaveData: number[] = [], indexData: number[] = [], gridX1 = radialSegments + 1, halfH = height / 2, capArc = (Math.PI / 2) * radius, totalArc = capArc * 2 + height, v1 = capArc / totalArc, v2 = (capArc + height) / totalArc;
        this.generateSphericalData(interleaveData, null, radius, radialSegments, capSegments, 0, Math.PI * 2, 0, Math.PI / 2, halfH, 0, v1);
        this.generateCylinderTorsoData(interleaveData, null, radius, radius, height, radialSegments, heightSegments, 0, Math.PI * 2, this.#ZERO_VECTOR, this.#BASIS_U, this.#BASIS_V, this.#AXIS_UP, true, v1, v2);
        this.generateSphericalData(interleaveData, null, radius, radialSegments, capSegments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2, -halfH, v2, 1);
        this.generateGridIndices(indexData, 0, radialSegments, capSegments * 2 + heightSegments, gridX1);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateGridIndices(indexData: number[], vertexOffset: number, gridX: number, gridY: number, gridX1: number, reverse: boolean = false) {
        for (let iy = 0; iy < gridY; iy++) {
            for (let ix = 0; ix < gridX; ix++) {
                const a = vertexOffset + ix + gridX1 * iy, b = vertexOffset + ix + gridX1 * (iy + 1), c = vertexOffset + (ix + 1) + gridX1 * (iy + 1), d = vertexOffset + (ix + 1) + gridX1 * iy;
                if (reverse) indexData.push(a, d, b, d, c, b); else indexData.push(a, b, d, b, c, d);
            }
        }
    }

    static calculateTangents(interleaveData: number[], indexData: number[]) {
        const stride = this.#STRIDE_FLOATS;
        const typedInterleaveData = new Float32Array(interleaveData);
        const typedIndexData = new Uint32Array(indexData);

        // [KO] 구조체 정의에서 오프셋을 동적으로 추출 (결합도 제거)
        const struct = Primitive.primitiveInterleaveStruct;
        const posOffset = struct.getAttributeOffset('vertexPosition');
        const normalOffset = struct.getAttributeOffset('vertexNormal');
        const uvOffset = struct.getAttributeOffset('texcoord');
        const tangentOffset = struct.getAttributeOffset('tangent');

        calculateTangentsInterleaved(
            typedInterleaveData,
            typedIndexData,
            stride,
            posOffset,
            normalOffset,
            uvOffset,
            tangentOffset
        );

        for (let i = 0, len = typedInterleaveData.length; i < len; i++) {
            interleaveData[i] = typedInterleaveData[i];
        }
    }

    static interleavePacker(interleaveData: number[], px: number, py: number, pz: number, nx: number, ny: number, nz: number, u: number, v: number, tx: number = 0, ty: number = 0, tz: number = 0, tw: number = 1) {
        interleaveData.push(px, py, pz, nx, ny, nz, u, v, tx, ty, tz, tw);
    }
}

export default PrimitiveUtils;
