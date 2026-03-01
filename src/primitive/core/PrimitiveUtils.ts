import calculateTangents from "../../math/calculateTangents";
import createPrimitiveGeometry from "./createPrimitiveGeometry";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";

/**
 * [KO] 프리미티브 생성을 위한 공통 수학 및 데이터 처리 유틸리티 클래스입니다.
 * [EN] Utility class for common math and data processing for primitive generation.
 *
 * @category Core
 */
class PrimitiveUtils {
    static finalize(redGPUContext: RedGPUContext, interleaveData: number[], indexData: number[], uniqueKey: string): Geometry {
        this.calculateTangents(interleaveData, indexData);
        return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateGrid(interleaveData: number[], indexData: number[], resolutionX: number, resolutionY: number, vertexCallback: (u: number, v: number, ix: number, iy: number) => void, skipIndices: boolean = false, reverseIndices: boolean = false) {
        const vertexOffset = interleaveData.length / 12;
        for (let iy = 0; iy <= resolutionY; iy++) {
            const v = iy / resolutionY;
            for (let ix = 0; ix <= resolutionX; ix++) {
                const u = ix / resolutionX;
                vertexCallback(u, v, ix, iy);
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
        const interleaveData = [], indexData = [], w2 = width / 2, h2 = height / 2, d2 = depth / 2;
        this.generatePlaneData(interleaveData, indexData, depth, height, depthSegments, heightSegments, {x: w2, y: 0, z: 0}, {x: 0, y: 0, z: -1}, {x: 0, y: -1, z: 0}, {x: 1, y: 0, z: 0});
        this.generatePlaneData(interleaveData, indexData, depth, height, depthSegments, heightSegments, {x: -w2, y: 0, z: 0}, {x: 0, y: 0, z: 1}, {x: 0, y: -1, z: 0}, {x: -1, y: 0, z: 0});
        this.generatePlaneData(interleaveData, indexData, width, depth, widthSegments, depthSegments, {x: 0, y: h2, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: 1}, {x: 0, y: 1, z: 0});
        this.generatePlaneData(interleaveData, indexData, width, depth, widthSegments, depthSegments, {x: 0, y: -h2, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: -1}, {x: 0, y: -1, z: 0});
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, {x: 0, y: 0, z: d2}, {x: 1, y: 0, z: 0}, {x: 0, y: -1, z: 0}, {x: 0, y: 0, z: 1});
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, {x: 0, y: 0, z: -d2}, {x: -1, y: 0, z: 0}, {x: 0, y: -1, z: 0}, {x: 0, y: 0, z: -1});
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateSphereData(redGPUContext: RedGPUContext, radius: number, widthSegments: number, heightSegments: number, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (radius <= 0 || Math.abs(phiLength) < 1e-6 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generateSphericalData(interleaveData, indexData, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateCylinderData(redGPUContext: RedGPUContext, radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number, capTop: boolean, capBottom: boolean, thetaStart: number, thetaLength: number, isRadialTop: boolean, isRadialBottom: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [], halfHeight = height / 2;
        if ((radiusTop <= 0 && radiusBottom <= 0) || height <= 0 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        const uV = {x: 1, y: 0, z: 0}, vV = {x: 0, y: 0, z: -1};
        this.generateCylinderTorsoData(interleaveData, indexData, radiusTop, radiusBottom, height, radialSegments, heightSegments, thetaStart, thetaLength, {x: 0, y: 0, z: 0}, uV, vV);
        if (capTop && radiusTop > 0) this.generateCircleData(interleaveData, indexData, radiusTop, radialSegments, thetaStart, thetaLength, {x: 0, y: halfHeight, z: 0}, uV, vV, {x: 0, y: 1, z: 0}, true, isRadialTop);
        if (capBottom && radiusBottom > 0) this.generateCircleData(interleaveData, indexData, radiusBottom, radialSegments, thetaStart, thetaLength, {x: 0, y: -halfHeight, z: 0}, uV, vV, {x: 0, y: -1, z: 0}, false, isRadialBottom);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generatePlaneEntryData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (width <= 0 || height <= 0) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: -1, z: 0}, {x: 0, y: 0, z: 1}, flipY);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateGroundData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (width <= 0 || height <= 0) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: 1}, {x: 0, y: 1, z: 0}, flipY);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateCircleEntryData(redGPUContext: RedGPUContext, radius: number, radialSegments: number, thetaStart: number, thetaLength: number, isRadial: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (radius <= 0 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        const uVector = {x: 1, y: 0, z: 0}, vVector = {x: 0, y: 0, z: -1};
        this.generateCircleData(interleaveData, indexData, radius, radialSegments, thetaStart, thetaLength, {x: 0, y: 0, z: 0}, uVector, vVector, {x: 0, y: 1, z: 0}, true, isRadial);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateRingEntryData(redGPUContext: RedGPUContext, innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number, thetaStart: number, thetaLength: number, isRadial: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (outerRadius <= 0 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        const uVector = {x: 1, y: 0, z: 0}, vVector = {x: 0, y: 0, z: -1};
        this.generateRingData(interleaveData, indexData, innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength, {x: 0, y: 0, z: 0}, uVector, vVector, {x: 0, y: 1, z: 0}, true, isRadial);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateTorusData(redGPUContext: RedGPUContext, radius: number, thickness: number, radialSegments: number, tubularSegments: number, thetaStart: number, thetaLength: number, capStart: boolean, capEnd: boolean, isRadialCapStart: boolean, isRadialCapEnd: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [], isPartial = Math.abs(thetaLength) < Math.PI * 2, uV = {x: 1, y: 0, z: 0}, vV = {x: 0, y: 0, z: -1};
        this.generateGrid(interleaveData, indexData, radialSegments, tubularSegments, (u, v) => {
            const theta = thetaStart + u * thetaLength, phi = v * Math.PI * 2, mR = {x: 0, y: 0, z: 0}, cT = {x: 0, y: 0, z: 0}, pos = {x: 0, y: 0, z: 0}, normal = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint({x: 0, y: 0, z: 0}, 1.0, theta, uV, vV, mR);
            this.#set(cT, mR.x * radius, 0, mR.z * radius);
            const uT = {x: -mR.x, y: 0, z: -mR.z}, vT = {x: 0, y: 1, z: 0};
            this.#calculateRadialPoint(cT, thickness, phi, uT, vT, pos);
            this.#calculateRadialPoint({x: 0, y: 0, z: 0}, 1.0, phi, uT, vT, normal);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, u, v);
        });
        if (isPartial) {
            if (capStart) this.generateCircleData(interleaveData, indexData, thickness, tubularSegments, 0, Math.PI * 2, {x: -Math.sin(thetaStart) * radius, y: 0, z: -Math.cos(thetaStart) * radius}, {x: -Math.sin(thetaStart), y: 0, z: -Math.cos(thetaStart)}, {x: 0, y: 1, z: 0}, {x: Math.cos(thetaStart), y: 0, z: -Math.sin(thetaStart)}, true, isRadialCapStart);
            if (capEnd) this.generateCircleData(interleaveData, indexData, thickness, tubularSegments, 0, Math.PI * 2, {x: -Math.sin(thetaStart + thetaLength) * radius, y: 0, z: -Math.cos(thetaStart + thetaLength) * radius}, {x: -Math.sin(thetaStart + thetaLength), y: 0, z: -Math.cos(thetaStart + thetaLength)}, {x: 0, y: 1, z: 0}, {x: -Math.cos(thetaStart + thetaLength), y: 0, z: Math.sin(thetaStart + thetaLength)}, false, isRadialCapEnd);
        }
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateTorusKnotData(redGPUContext: RedGPUContext, radius: number, tubeRadius: number, tubularSegments: number, radialSegments: number, windingsAroundAxis: number, windingsAroundCircle: number, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [], P1 = {x: 0, y: 0, z: 0}, P2 = {x: 0, y: 0, z: 0}, B = {x: 0, y: 0, z: 0}, T = {x: 0, y: 0, z: 0}, N = {x: 0, y: 0, z: 0};
        this.generateGrid(interleaveData, indexData, radialSegments, tubularSegments, (u, v) => {
            const knotU = v * windingsAroundAxis * Math.PI * 2;
            this.#calculateTorusKnotPosition(knotU, windingsAroundAxis, windingsAroundCircle, radius, P1);
            this.#calculateTorusKnotPosition(knotU + 0.01, windingsAroundAxis, windingsAroundCircle, radius, P2);
            this.#set(T, P2.x - P1.x, P2.y - P1.y, P2.z - P1.z); this.#set(N, P2.x + P1.x, P2.y + P1.y, P2.z + P1.z);
            this.#cross(T, N, B); this.#normalize(B); this.#cross(B, T, N); this.#normalize(N);
            const rV = u * Math.PI * 2, pos = {x: 0, y: 0, z: 0}, normal = {x: 0, y: 0, z: 0}, uT = {x: -B.x, y: -B.y, z: -B.z}, vT = {x: -N.x, y: -N.y, z: -N.z};
            this.#calculateRadialPoint(P1, tubeRadius, rV, uT, vT, pos); this.#calculateRadialPoint({x: 0, y: 0, z: 0}, 1.0, rV, uT, vT, normal);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, v, u);
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
        const vertexOffset = interleaveData.length / 12;
        this.interleavePacker(interleaveData, center.x, center.y, center.z, normal.x, normal.y, normal.z, 0.5, isRadial ? uvVStart : 0.5);
        if (radius <= 1e-6 || Math.abs(thetaLength) < 1e-6) return;
        for (let s = 0; s <= radialSegments; s++) {
            const uRatio = s / radialSegments, angle = thetaStart + uRatio * thetaLength, pos = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint(center, radius, angle, uV, vV, pos);
            const uvX = isRadial ? uRatio : 0.5 - (Math.sin(angle) * 0.5), uvY = isRadial ? uvVEnd : 0.5 - (Math.cos(angle) * 0.5);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, uvX, uvY);
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
            const r = innerRadius + v * (outerRadius - innerRadius), angle = thetaStart + u * thetaLength, uvV = uvVStart + v * (uvVEnd - uvVStart), pos = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint(center, r, angle, uV, vV, pos);
            const uvX = isRadial ? u : 0.5 - (r / outerRadius * Math.sin(angle) * 0.5), uvY = isRadial ? uvV : 0.5 - (r / outerRadius * Math.cos(angle) * 0.5);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, uvX, uvY);
        }, false, !isFront);
    }

    static generateSphericalData(interleaveData: number[], indexData: number[], radius: number, widthSegments: number, heightSegments: number, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number, yOffset: number = 0, uvVStart: number = 0, uvVEnd: number = 1) {
        this.generateGrid(interleaveData, indexData, widthSegments, heightSegments, (u, v) => {
            const theta = thetaStart + v * thetaLength, phi = phiStart + u * phiLength, sinT = Math.sin(theta), cosT = Math.cos(theta), sinP = Math.sin(phi), cosP = Math.cos(phi), uvV = uvVStart + v * (uvVEnd - uvVStart);
            this.interleavePacker(interleaveData, radius * (-sinP) * sinT, radius * cosT + yOffset, radius * (-cosP) * sinT, (-sinP) * sinT, cosT, (-cosP) * sinT, u, uvV);
        }, indexData === null);
    }

    static generateCylinderTorsoData(interleaveData: number[], indexData: number[], radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number, thetaStart: number, thetaLength: number, center: { x: number, y: number, z: number }, uV: { x: number, y: number, z: number }, vV: { x: number, y: number, z: number }, axisVector: { x: number, y: number, z: number } = {x: 0, y: 1, z: 0}, skipIndices: boolean = false, uvVStart: number = 0, uvVEnd: number = 1) {
        const halfH = height / 2, slope = (radiusBottom - radiusTop) / height;
        if (thetaLength === 0 || (radiusTop <= 0 && radiusBottom <= 0)) {
            this.interleavePacker(interleaveData, center.x, center.y, center.z, 0, 1, 0, 0, 0);
            return;
        }
        this.generateGrid(interleaveData, indexData, radialSegments, heightSegments, (u, v) => {
            const r = v * (radiusBottom - radiusTop) + radiusTop, angle = u * thetaLength + thetaStart, hOff = halfH - v * height, uvV = uvVStart + v * (uvVEnd - uvVStart), ringPos = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint({x: 0, y: 0, z: 0}, r, angle, uV, vV, ringPos);
            const px = center.x + ringPos.x + hOff * axisVector.x, py = center.y + ringPos.y + hOff * axisVector.y, pz = center.z + ringPos.z + hOff * axisVector.z;
            const rnx = ringPos.x / (r || 1), rny = ringPos.y / (r || 1), rnz = ringPos.z / (r || 1), nx = rnx + slope * axisVector.x, ny = rny + slope * axisVector.y, nz = rnz + slope * axisVector.z, nLen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            this.interleavePacker(interleaveData, px, py, pz, nx / nLen, ny / nLen, nz / nLen, u, uvV);
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
        this.generateCylinderTorsoData(interleaveData, null, radius, radius, height, radialSegments, heightSegments, 0, Math.PI * 2, {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: -1}, {x: 0, y: 1, z: 0}, true, v1, v2);
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
        const vertices = [], normals = [], uvs = [], count = interleaveData.length / 12;
        for (let i = 0; i < count; i++) {
            const o = i * 12;
            vertices.push(interleaveData[o], interleaveData[o + 1], interleaveData[o + 2]);
            normals.push(interleaveData[o + 3], interleaveData[o + 4], interleaveData[o + 5]);
            uvs.push(interleaveData[o + 6], interleaveData[o + 7]);
        }
        const tangents = calculateTangents(vertices, normals, uvs, indexData);
        for (let i = 0; i < count; i++) {
            const o = i * 12, to = i * 4;
            interleaveData[o + 8] = tangents[to]; interleaveData[o + 9] = tangents[to + 1]; interleaveData[o + 10] = tangents[to + 2]; interleaveData[o + 11] = tangents[to + 3];
        }
    }

    static interleavePacker(interleaveData: number[], px: number, py: number, pz: number, nx: number, ny: number, nz: number, u: number, v: number, tx: number = 0, ty: number = 0, tz: number = 0, tw: number = 1) {
        interleaveData.push(px, py, pz, nx, ny, nz, u, v, tx, ty, tz, tw);
    }
}

export default PrimitiveUtils;
