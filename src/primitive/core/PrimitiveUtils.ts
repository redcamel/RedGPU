import calculateTangents from "../../math/calculateTangents";
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
    
    static readonly #SCRATCH_V1 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V2 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V3 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V4 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V5 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V6 = {x: 0, y: 0, z: 0};

    static get #STRIDE_FLOATS(): number {
        return Primitive.primitiveInterleaveStruct.arrayStride / 4;
    }

    static finalize(redGPUContext: RedGPUContext, interleaveData: number[], indexData: number[], uniqueKey: string): Geometry {
        this.calculateTangents(interleaveData, indexData);
        return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 그리드 형태의 정점 및 인덱스 생성을 통합 처리합니다. 
     * [KO] UV 매핑의 정확성을 위해 극점에서도 정점 행을 유지합니다.
     */
    static generateGrid(
        interleaveData: number[], indexData: number[],
        resolutionX: number, resolutionY: number,
        vertexCallback: (u: number, v: number, ix: number, iy: number) => void,
        skipIndices: boolean = false, reverseIndices: boolean = false
    ) {
        const vertexOffset = interleaveData.length / this.#STRIDE_FLOATS;
        const gridX1 = resolutionX + 1;

        for (let iy = 0; iy <= resolutionY; iy++) {
            const v = iy / resolutionY;
            for (let ix = 0; ix <= resolutionX; ix++) {
                const u = ix / resolutionX;
                vertexCallback(u, v, ix, iy);
            }
        }
        if (!skipIndices && indexData) {
            this.generateGridIndices(indexData, vertexOffset, resolutionX, resolutionY, gridX1, reverseIndices);
        }
    }

    static getEmptyGeometry(redGPUContext: RedGPUContext, uniqueKey: string): Geometry {
        const interleaveData = [];
        this.interleavePacker(interleaveData, 0, 0, 0, 0, 1, 0, 0, 0);
        return createPrimitiveGeometry(redGPUContext, interleaveData, [], uniqueKey);
    }

    static generateBoxData(redGPUContext: RedGPUContext, width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [], w2 = width / 2, h2 = height / 2, d2 = depth / 2;
        const faces = [
            {c: {x: w2, y: 0, z: 0}, u: {x: 0, y: 0, z: -1}, v: {x: 0, y: -1, z: 0}, n: {x: 1, y: 0, z: 0}}, // PX
            {c: {x: -w2, y: 0, z: 0}, u: {x: 0, y: 0, z: 1}, v: {x: 0, y: -1, z: 0}, n: {x: -1, y: 0, z: 0}}, // NX
            {c: {x: 0, y: h2, z: 0}, u: {x: 1, y: 0, z: 0}, v: {x: 0, y: 0, z: 1}, n: {x: 0, y: 1, z: 0}}, // PY
            {c: {x: 0, y: -h2, z: 0}, u: {x: 1, y: 0, z: 0}, v: {x: 0, y: 0, z: -1}, n: {x: 0, y: -1, z: 0}}, // NY
            {c: {x: 0, y: 0, z: d2}, u: {x: 1, y: 0, z: 0}, v: {x: 0, y: -1, z: 0}, n: {x: 0, y: 0, z: 1}}, // PZ
            {c: {x: 0, y: 0, z: -d2}, u: {x: -1, y: 0, z: 0}, v: {x: 0, y: -1, z: 0}, n: {x: 0, y: 0, z: -1}} // NZ
        ];
        faces.forEach(f => this.generatePlaneData(interleaveData, indexData, (f.n.x ? depth : width), (f.n.y ? depth : height), (f.n.x ? depthSegments : widthSegments), (f.n.y ? depthSegments : heightSegments), f.c, f.u, f.v, f.n));
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
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
        if (capTop && radiusTop > 0) this.generateCircleData(interleaveData, indexData, radiusTop, radialSegments, thetaStart, thetaLength, {x: 0, y: halfH, z: 0}, this.#BASIS_U, this.#BASIS_V, this.#AXIS_UP, true, isRadialTop);
        if (capBottom && radiusBottom > 0) this.generateCircleData(interleaveData, indexData, radiusBottom, radialSegments, thetaStart, thetaLength, {x: 0, y: -halfH, z: 0}, this.#BASIS_U, this.#BASIS_V, this.#AXIS_DOWN, false, isRadialBottom);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generatePlaneEntryData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (width <= 0 || height <= 0) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, this.#ZERO_VECTOR, this.#BASIS_U, {x: 0, y: -1, z: 0}, {x: 0, y: 0, z: 1}, flipY);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateGroundData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (width <= 0 || height <= 0) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, this.#ZERO_VECTOR, this.#BASIS_U, {x: 0, y: 0, z: 1}, this.#AXIS_UP, flipY);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateCircleEntryData(redGPUContext: RedGPUContext, radius: number, radialSegments: number, thetaStart: number, thetaLength: number, isRadial: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (radius <= 0 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generateCircleData(interleaveData, indexData, radius, radialSegments, thetaStart, thetaLength, this.#ZERO_VECTOR, this.#BASIS_U, this.#BASIS_V, this.#AXIS_UP, true, isRadial);
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
            this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, theta, this.#BASIS_U, this.#BASIS_V, this.#SCRATCH_V1);
            this.#set(this.#SCRATCH_V2, this.#SCRATCH_V1.x * radius, 0, this.#SCRATCH_V1.z * radius);
            this.#set(this.#SCRATCH_V3, -this.#SCRATCH_V1.x, 0, -this.#SCRATCH_V1.z); 
            this.#calculateRadialPoint(this.#SCRATCH_V2, thickness, phi, this.#SCRATCH_V3, this.#AXIS_UP, this.#SCRATCH_V4); 
            this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, phi, this.#SCRATCH_V3, this.#AXIS_UP, this.#SCRATCH_V1); 
            this.interleavePacker(interleaveData, this.#SCRATCH_V4.x, this.#SCRATCH_V4.y, this.#SCRATCH_V4.z, this.#SCRATCH_V1.x, this.#SCRATCH_V1.y, this.#SCRATCH_V1.z, u, v);
        });
        if (isPartial) {
            if (capStart) {
                this.#calculateRadialPoint(this.#ZERO_VECTOR, radius, thetaStart, this.#BASIS_U, this.#BASIS_V, this.#SCRATCH_V1);
                this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, thetaStart, this.#BASIS_U, this.#BASIS_V, this.#SCRATCH_V2);
                this.#set(this.#SCRATCH_V3, Math.cos(thetaStart), 0, -Math.sin(thetaStart));
                this.generateCircleData(interleaveData, indexData, thickness, tubularSegments, 0, Math.PI * 2, this.#SCRATCH_V1, this.#SCRATCH_V2, this.#AXIS_UP, this.#SCRATCH_V3, true, isRadialCapStart);
            }
            if (capEnd) {
                const angle = thetaStart + thetaLength;
                this.#calculateRadialPoint(this.#ZERO_VECTOR, radius, angle, this.#BASIS_U, this.#BASIS_V, this.#SCRATCH_V1);
                this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, angle, this.#BASIS_U, this.#BASIS_V, this.#SCRATCH_V2);
                this.#set(this.#SCRATCH_V3, -Math.cos(angle), 0, Math.sin(angle));
                this.generateCircleData(interleaveData, indexData, thickness, tubularSegments, 0, Math.PI * 2, this.#SCRATCH_V1, this.#SCRATCH_V2, this.#AXIS_UP, this.#SCRATCH_V3, false, isRadialCapEnd);
            }
        }
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateTorusKnotData(redGPUContext: RedGPUContext, radius: number, tubeRadius: number, tubularSegments: number, radialSegments: number, windingsAroundAxis: number, windingsAroundCircle: number, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        this.generateGrid(interleaveData, indexData, radialSegments, tubularSegments, (u, v) => {
            const knotU = v * windingsAroundAxis * Math.PI * 2;
            this.#calculateTorusKnotPosition(knotU, windingsAroundAxis, windingsAroundCircle, radius, this.#SCRATCH_V1); // P1
            this.#calculateTorusKnotPosition(knotU + 0.01, windingsAroundAxis, windingsAroundCircle, radius, this.#SCRATCH_V2); // P2
            this.#set(this.#SCRATCH_V3, this.#SCRATCH_V2.x - this.#SCRATCH_V1.x, this.#SCRATCH_V2.y - this.#SCRATCH_V1.y, this.#SCRATCH_V2.z - this.#SCRATCH_V1.z); // T
            this.#set(this.#SCRATCH_V4, this.#SCRATCH_V2.x + this.#SCRATCH_V1.x, this.#SCRATCH_V2.y + this.#SCRATCH_V1.y, this.#SCRATCH_V2.z + this.#SCRATCH_V1.z); // N
            this.#cross(this.#SCRATCH_V3, this.#SCRATCH_V4, this.#SCRATCH_V2); this.#normalize(this.#SCRATCH_V2); // B
            this.#cross(this.#SCRATCH_V2, this.#SCRATCH_V3, this.#SCRATCH_V4); this.#normalize(this.#SCRATCH_V4); // N_fixed
            this.#set(this.#SCRATCH_V5, -this.#SCRATCH_V2.x, -this.#SCRATCH_V2.y, -this.#SCRATCH_V2.z); // uTube
            this.#set(this.#SCRATCH_V6, -this.#SCRATCH_V4.x, -this.#SCRATCH_V4.y, -this.#SCRATCH_V4.z); // vTube
            const radialV = u * Math.PI * 2;
            this.#calculateRadialPoint(this.#SCRATCH_V1, tubeRadius, radialV, this.#SCRATCH_V5, this.#SCRATCH_V6, this.#SCRATCH_V3); // pos
            this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, radialV, this.#SCRATCH_V5, this.#SCRATCH_V6, this.#SCRATCH_V2); // normal
            this.interleavePacker(interleaveData, this.#SCRATCH_V3.x, this.#SCRATCH_V3.y, this.#SCRATCH_V3.z, this.#SCRATCH_V2.x, this.#SCRATCH_V2.y, this.#SCRATCH_V2.z, v, u);
        });
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static #calculateTorusKnotPosition(u, p, q, radius, out) {
        const cu = Math.cos(u), su = Math.sin(u), quOverP = q / p * u, cs = Math.cos(quOverP);
        out.x = radius * (2 + cs) * 0.5 * cu; out.y = radius * (2 + cs) * su * 0.5; out.z = radius * Math.sin(quOverP) * 0.5;
    }

    static generatePlaneData(interleaveData: number[], indexData: number[], width: number, height: number, gridResX: number, gridResY: number, center: { x: number, y: number, z: number }, uV: { x: number, y: number, z: number }, vV: { x: number, y: number, z: number }, normal: { x: number, y: number, z: number }, flipY: boolean = false) {
        this.generateGrid(interleaveData, indexData, gridResX, gridResY, (u, v) => {
            const x = (u - 0.5) * width, y = (v - 0.5) * height, uvY = flipY ? (1 - v) : v;
            this.interleavePacker(interleaveData, center.x + x * uV.x + y * vV.x, center.y + x * uV.y + y * vV.y, center.z + x * uV.z + y * vV.z, normal.x, normal.y, normal.z, u, uvY);
        });
    }

    static generateCircleData(interleaveData: number[], indexData: number[], radius: number, radialSegments: number, thetaStart: number, thetaLength: number, center: { x: number, y: number, z: number }, uV: { x: number, y: number, z: number }, vV: { x: number, y: number, z: number }, normal: { x: number, y: number, z: number }, isFront: boolean = true, isRadial: boolean = false, uvVStart: number = 0, uvVEnd: number = 1) {
        const vertexOffset = interleaveData.length / this.#STRIDE_FLOATS;
        this.interleavePacker(interleaveData, center.x, center.y, center.z, normal.x, normal.y, normal.z, 0.5, isRadial ? uvVStart : 0.5);
        if (radius <= 1e-6 || Math.abs(thetaLength) < 1e-6) return;
        for (let s = 0; s <= radialSegments; s++) {
            const uRatio = s / radialSegments, angle = thetaStart + uRatio * thetaLength;
            this.#calculateRadialPoint(center, radius, angle, uV, vV, this.#SCRATCH_V1);
            const uvX = isRadial ? uRatio : 0.5 - (Math.sin(angle) * 0.5), uvY = isRadial ? uvVEnd : 0.5 - (Math.cos(angle) * 0.5);
            this.interleavePacker(interleaveData, this.#SCRATCH_V1.x, this.#SCRATCH_V1.y, this.#SCRATCH_V1.z, normal.x, normal.y, normal.z, uvX, uvY);
        }
        for (let i = 1; i <= radialSegments; i++) {
            const c = vertexOffset, v1 = vertexOffset + i, v2 = vertexOffset + i + 1;
            if (indexData) isFront ? indexData.push(c, v1, v2) : indexData.push(c, v2, v1);
        }
    }

    static generateRingData(interleaveData: number[], indexData: number[], innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number, thetaStart: number, thetaLength: number, center: { x: number, y: number, z: number }, uV: { x: number, y: number, z: number }, vV: { x: number, y: number, z: number }, normal: { x: number, y: number, z: number }, isFront: boolean = true, isRadial: boolean = false, uvVStart: number = 0, uvVEnd: number = 1) {
        if (outerRadius <= 1e-6 || Math.abs(thetaLength) < 1e-6) {
            this.interleavePacker(interleaveData, center.x, center.y, center.z, normal.x, normal.y, normal.z, 0.5, 0.5);
            return;
        }
        this.generateGrid(interleaveData, indexData, thetaSegments, phiSegments, (u, v) => {
            const r = innerRadius + v * (outerRadius - innerRadius), angle = thetaStart + u * thetaLength, uvV = uvVStart + v * (uvVEnd - uvVStart);
            this.#calculateRadialPoint(center, r, angle, uV, vV, this.#SCRATCH_V1);
            const uvX = isRadial ? u : 0.5 - (r / outerRadius * Math.sin(angle) * 0.5), uvY = isRadial ? uvV : 0.5 - (r / outerRadius * Math.cos(angle) * 0.5);
            this.interleavePacker(interleaveData, this.#SCRATCH_V1.x, this.#SCRATCH_V1.y, this.#SCRATCH_V1.z, normal.x, normal.y, normal.z, uvX, uvY);
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
        this.generateGrid(interleaveData, indexData, radialSegments, heightSegments, (u, v) => {
            const r = v * (radiusBottom - radiusTop) + radiusTop, angle = u * thetaLength + thetaStart, hOff = halfH - v * height, uvV = uvVStart + v * (uvVEnd - uvVStart);
            this.#calculateRadialPoint(this.#ZERO_VECTOR, r, angle, uV, vV, this.#SCRATCH_V1);
            const px = center.x + this.#SCRATCH_V1.x + hOff * axisVector.x, py = center.y + this.#SCRATCH_V1.y + hOff * axisVector.y, pz = center.z + this.#SCRATCH_V1.z + hOff * axisVector.z;
            const rnx = this.#SCRATCH_V1.x / (r || 1), rny = this.#SCRATCH_V1.y / (r || 1), rnz = this.#SCRATCH_V1.z / (r || 1), nx = rnx + slope * axisVector.x, ny = rny + slope * axisVector.y, nz = rnz + slope * axisVector.z;
            this.#set(this.#SCRATCH_V2, nx, ny, nz); this.#normalize(this.#SCRATCH_V2);
            this.interleavePacker(interleaveData, px, py, pz, this.#SCRATCH_V2.x, this.#SCRATCH_V2.y, this.#SCRATCH_V2.z, u, uvV);
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
        this.generateCylinderTorsoData(interleaveData, null, radius, radius, height, radialSegments, heightSegments, 0, Math.PI * 2, this.#ZERO_VECTOR, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: -1}, this.#AXIS_UP, true, v1, v2);
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
        const vertices = [], normals = [], uvs = [], count = interleaveData.length / this.#STRIDE_FLOATS;
        for (let i = 0; i < count; i++) {
            const o = i * this.#STRIDE_FLOATS;
            vertices.push(interleaveData[o], interleaveData[o + 1], interleaveData[o + 2]);
            normals.push(interleaveData[o + 3], interleaveData[o + 4], interleaveData[o + 5]);
            uvs.push(interleaveData[o + 6], interleaveData[o + 7]);
        }
        const tangents = calculateTangents(vertices, normals, uvs, indexData);
        for (let i = 0; i < count; i++) {
            const o = i * this.#STRIDE_FLOATS, to = i * 4;
            interleaveData[o + 8] = tangents[to]; interleaveData[o + 9] = tangents[to + 1]; interleaveData[o + 10] = tangents[to + 2]; interleaveData[o + 11] = tangents[to + 3];
        }
    }

    static interleavePacker(interleaveData: number[], px: number, py: number, pz: number, nx: number, ny: number, nz: number, u: number, v: number, tx: number = 0, ty: number = 0, tz: number = 0, tw: number = 1) {
        interleaveData.push(px, py, pz, nx, ny, nz, u, v, tx, ty, tz, tw);
    }
}

export default PrimitiveUtils;
