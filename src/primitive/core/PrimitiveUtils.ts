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
    /**
     * [KO] 탄젠트 계산 및 최종 지오메트리 생성을 통합 처리합니다.
     * [EN] Integrates tangent calculation and final geometry creation.
     */
    static finalize(
        redGPUContext: RedGPUContext,
        interleaveData: number[],
        indexData: number[],
        uniqueKey: string
    ): Geometry {
        this.calculateTangents(interleaveData, indexData);
        return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 그리드 형태의 정점 및 인덱스 생성을 통합 처리하는 핵심 유틸리티입니다.
     * [EN] Core utility that integrates the generation of grid-type vertices and indices.
     */
    static generateGrid(
        interleaveData: number[],
        indexData: number[],
        resolutionX: number,
        resolutionY: number,
        vertexCallback: (u: number, v: number, ix: number, iy: number) => void,
        skipIndices: boolean = false,
        reverseIndices: boolean = false
    ) {
        const vertexOffset = interleaveData.length / 12;
        for (let iy = 0; iy <= resolutionY; iy++) {
            const v = iy / resolutionY;
            for (let ix = 0; ix <= resolutionX; ix++) {
                const u = ix / resolutionX;
                vertexCallback(u, v, ix, iy);
            }
        }
        if (!skipIndices) {
            this.generateGridIndices(indexData, vertexOffset, resolutionX, resolutionY, resolutionX + 1, reverseIndices);
        }
    }

    /**
     * [KO] 비정상적인 파라미터 요청 시 에러 방지를 위한 최소한의 빈 지오메트리를 생성하여 반환합니다. (1정점, 0인덱스)
     * [EN] Creates and returns a minimal empty geometry (1 vertex, 0 indices) to prevent GPU errors for invalid parameters.
     */
    static getEmptyGeometry(redGPUContext: RedGPUContext, uniqueKey: string): Geometry {
        const interleaveData = [];
        this.interleavePacker(interleaveData, 0, 0, 0, 0, 1, 0, 0, 0);
        return createPrimitiveGeometry(redGPUContext, interleaveData, [], uniqueKey);
    }

    /**
     * [KO] 박스(Box) 기하 데이터를 생성합니다.
     * [EN] Generates box geometry data.
     */
    static generateBoxData(
        redGPUContext: RedGPUContext,
        width: number, height: number, depth: number,
        widthSegments: number, heightSegments: number, depthSegments: number,
        uniqueKey: string
    ): Geometry {
        const interleaveData = [];
        const indexData = [];

        this.generatePlaneData(interleaveData, indexData, depth, height, width / 2, depthSegments, heightSegments, 'z', 'y', 'x', -1, -1, 1); // px
        this.generatePlaneData(interleaveData, indexData, depth, height, -width / 2, depthSegments, heightSegments, 'z', 'y', 'x', 1, -1, -1); // nx
        this.generatePlaneData(interleaveData, indexData, width, depth, height / 2, widthSegments, depthSegments, 'x', 'z', 'y', 1, 1, 1); // py
        this.generatePlaneData(interleaveData, indexData, width, depth, -height / 2, widthSegments, depthSegments, 'x', 'z', 'y', 1, -1, -1); // ny
        this.generatePlaneData(interleaveData, indexData, width, height, depth / 2, widthSegments, heightSegments, 'x', 'y', 'z', 1, -1, 1); // pz
        this.generatePlaneData(interleaveData, indexData, width, height, -depth / 2, widthSegments, heightSegments, 'x', 'y', 'z', -1, -1, -1); // nz

        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 구체(Sphere) 기하 데이터를 생성합니다.
     * [EN] Generates sphere geometry data.
     */
    static generateSphereData(
        redGPUContext: RedGPUContext,
        radius: number, widthSegments: number, heightSegments: number,
        phiStart: number, phiLength: number, thetaStart: number, thetaLength: number,
        uniqueKey: string
    ): Geometry {
        const interleaveData = [];
        const indexData = [];

        if (radius <= 0 || Math.abs(phiLength) < 1e-6 || Math.abs(thetaLength) < 1e-6) {
            return this.getEmptyGeometry(redGPUContext, uniqueKey);
        }

        this.generateSphericalData(interleaveData, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
        this.generateGridIndices(indexData, 0, widthSegments, heightSegments, widthSegments + 1, false);

        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 실린더(Cylinder) 기하 데이터를 생성합니다.
     * [EN] Generates cylinder geometry data.
     */
    static generateCylinderData(
        redGPUContext: RedGPUContext,
        radiusTop: number, radiusBottom: number, height: number,
        radialSegments: number, heightSegments: number,
        capTop: boolean, capBottom: boolean,
        thetaStart: number, thetaLength: number,
        isRadialTop: boolean, isRadialBottom: boolean,
        uniqueKey: string
    ): Geometry {
        const interleaveData = [];
        const indexData = [];
        const halfHeight = height / 2;

        if ((radiusTop <= 0 && radiusBottom <= 0) || height <= 0 || Math.abs(thetaLength) < 1e-6) {
            return this.getEmptyGeometry(redGPUContext, uniqueKey);
        }

        const uVector = {x: 1, y: 0, z: 0}, vVector = {x: 0, y: 0, z: -1};

        this.generateCylinderTorsoData(interleaveData, indexData, radiusTop, radiusBottom, height, radialSegments, heightSegments, thetaStart, thetaLength, {x: 0, y: 0, z: 0}, uVector, vVector);

        if (capTop && radiusTop > 0) {
            this.generateCircleData(interleaveData, indexData, radiusTop, radialSegments, thetaStart, thetaLength, {x: 0, y: halfHeight, z: 0}, uVector, vVector, {x: 0, y: 1, z: 0}, true, isRadialTop);
        }
        if (capBottom && radiusBottom > 0) {
            this.generateCircleData(interleaveData, indexData, radiusBottom, radialSegments, thetaStart, thetaLength, {x: 0, y: -halfHeight, z: 0}, uVector, vVector, {x: 0, y: -1, z: 0}, false, isRadialBottom);
        }

        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 평면(Plane) 기하 데이터를 생성합니다.
     * [EN] Generates plane geometry data.
     */
    static generatePlaneEntryData(
        redGPUContext: RedGPUContext,
        width: number, height: number,
        widthSegments: number, heightSegments: number,
        uniqueKey: string
    ): Geometry {
        const interleaveData = [];
        const indexData = [];

        if (width <= 0 || height <= 0) {
            return this.getEmptyGeometry(redGPUContext, uniqueKey);
        }

        this.generatePlaneData(interleaveData, indexData, width, height, 0, widthSegments, heightSegments, 'x', 'y', 'z', 1, -1, 1);

        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 원형(Circle) 기하 데이터를 생성합니다.
     * [EN] Generates circle geometry data.
     */
    static generateCircleEntryData(
        redGPUContext: RedGPUContext,
        radius: number, radialSegments: number, thetaStart: number, thetaLength: number,
        isRadial: boolean,
        uniqueKey: string
    ): Geometry {
        const interleaveData = [];
        const indexData = [];

        if (radius <= 0 || Math.abs(thetaLength) < 1e-6) {
            return this.getEmptyGeometry(redGPUContext, uniqueKey);
        }

        const uVector = {x: 1, y: 0, z: 0}, vVector = {x: 0, y: 0, z: -1};
        this.generateCircleData(interleaveData, indexData, radius, radialSegments, thetaStart, thetaLength, {x: 0, y: 0, z: 0}, uVector, vVector, {x: 0, y: 1, z: 0}, true, isRadial);

        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 링(Ring) 기하 데이터를 생성합니다.
     * [EN] Generates ring geometry data.
     */
    static generateRingEntryData(
        redGPUContext: RedGPUContext,
        innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number,
        thetaStart: number, thetaLength: number,
        isRadial: boolean,
        uniqueKey: string
    ): Geometry {
        const interleaveData = [];
        const indexData = [];

        if (outerRadius <= 0 || Math.abs(thetaLength) < 1e-6) {
            return this.getEmptyGeometry(redGPUContext, uniqueKey);
        }

        const uVector = {x: 1, y: 0, z: 0}, vVector = {x: 0, y: 0, z: -1};
        this.generateRingData(interleaveData, indexData, innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength, {x: 0, y: 0, z: 0}, uVector, vVector, {x: 0, y: 1, z: 0}, true, isRadial);

        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 토러스(Torus) 기하 데이터를 생성합니다.
     * [EN] Generates torus geometry data.
     */
    static generateTorusData(
        redGPUContext: RedGPUContext,
        radius: number, thickness: number,
        radialSegments: number, tubularSegments: number,
        thetaStart: number, thetaLength: number,
        capStart: boolean, capEnd: boolean,
        isRadialCapStart: boolean, isRadialCapEnd: boolean,
        uniqueKey: string
    ): Geometry {
        const interleaveData = [];
        const indexData = [];
        const isPartial = Math.abs(thetaLength) < Math.PI * 2;

        const uVector = {x: 1, y: 0, z: 0}, vVector = {x: 0, y: 0, z: -1};

        this.generateGrid(interleaveData, indexData, radialSegments, tubularSegments, (u, v) => {
            const theta = thetaStart + u * thetaLength;
            const phi = v * Math.PI * 2;

            const majorRadial = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint({x: 0, y: 0, z: 0}, 1.0, theta, uVector, vVector, majorRadial);

            const centerTube = {x: majorRadial.x * radius, y: 0, z: majorRadial.z * radius};
            const uTube = {x: -majorRadial.x, y: 0, z: -majorRadial.z}; // Inner direction
            const vTube = {x: 0, y: 1, z: 0}; // Top direction

            const pos = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint(centerTube, thickness, phi, uTube, vTube, pos);

            const normal = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint({x: 0, y: 0, z: 0}, 1.0, phi, uTube, vTube, normal);

            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, u, v);
        });

        if (isPartial) {
            if (capStart) {
                const sSin = Math.sin(thetaStart), sCos = Math.cos(thetaStart);
                this.generateCircleData(interleaveData, indexData, thickness, tubularSegments, 0, Math.PI * 2,
                    {x: -sSin * radius, y: 0, z: -sCos * radius}, {x: -sSin, y: 0, z: -sCos}, {x: 0, y: 1, z: 0}, {x: sCos, y: 0, z: -sSin}, true, isRadialCapStart);
            }
            if (capEnd) {
                const eSin = Math.sin(thetaStart + thetaLength), eCos = Math.cos(thetaStart + thetaLength);
                this.generateCircleData(interleaveData, indexData, thickness, tubularSegments, 0, Math.PI * 2,
                    {x: -eSin * radius, y: 0, z: -eCos * radius}, {x: -eSin, y: 0, z: -eCos}, {x: 0, y: 1, z: 0}, {x: -eCos, y: 0, z: eSin}, false, isRadialCapEnd);
            }
        }

        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 토러스 노트(TorusKnot) 기하 데이터를 생성합니다.
     * [EN] Generates torus knot geometry data.
     */
    static generateTorusKnotData(
        redGPUContext: RedGPUContext,
        radius: number, tubeRadius: number,
        tubularSegments: number, radialSegments: number,
        windingsAroundAxis: number, windingsAroundCircle: number,
        uniqueKey: string
    ): Geometry {
        const interleaveData = [];
        const indexData = [];
        const P1 = [0, 0, 0], P2 = [0, 0, 0], B = [0, 0, 0], T = [0, 0, 0], N = [0, 0, 0];

        this.generateGrid(interleaveData, indexData, radialSegments, tubularSegments, (u, v) => {
            const knotU = v * windingsAroundAxis * Math.PI * 2;
            this.#calculateTorusKnotPosition(knotU, windingsAroundAxis, windingsAroundCircle, radius, P1);
            this.#calculateTorusKnotPosition(knotU + 0.01, windingsAroundAxis, windingsAroundCircle, radius, P2);

            T[0] = P2[0] - P1[0]; T[1] = P2[1] - P1[1]; T[2] = P2[2] - P1[2];
            N[0] = P2[0] + P1[0]; N[1] = P2[1] + P1[1]; N[2] = P2[2] + P1[2];

            B[0] = T[1] * N[2] - T[2] * N[1]; B[1] = T[2] * N[0] - T[0] * N[2]; B[2] = T[0] * N[1] - T[1] * N[0];
            let bLen = Math.sqrt(B[0] * B[0] + B[1] * B[1] + B[2] * B[2]) || 1;
            B[0] /= bLen; B[1] /= bLen; B[2] /= bLen;

            N[0] = B[1] * T[2] - B[2] * T[1]; N[1] = B[2] * T[0] - B[0] * T[2]; N[2] = B[0] * T[1] - B[1] * T[0];
            let nLen = Math.sqrt(N[0] * N[0] + N[1] * N[1] + N[2] * N[2]) || 1;
            N[0] /= nLen; N[1] /= nLen; N[2] /= nLen;

            const radialV = u * Math.PI * 2;
            const centerTube = {x: P1[0], y: P1[1], z: P1[2]};
            const vTube = {x: -N[0], y: -N[1], z: -N[2]};
            const uTube = {x: -B[0], y: -B[1], z: -B[2]};

            const pos = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint(centerTube, tubeRadius, radialV, uTube, vTube, pos);
            const normal = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint({x: 0, y: 0, z: 0}, 1.0, radialV, uTube, vTube, normal);

            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, v, u);
        });

        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static #calculateTorusKnotPosition(u, p, q, radius, pos) {
        const cu = Math.cos(u), su = Math.sin(u), quOverP = q / p * u, cs = Math.cos(quOverP);
        pos[0] = radius * (2 + cs) * 0.5 * cu; pos[1] = radius * (2 + cs) * su * 0.5; pos[2] = radius * Math.sin(quOverP) * 0.5;
    }

    /**
     * [KO] 특정 축 매핑을 기반으로 평면 기하 데이터를 생성합니다.
     */
    static generatePlaneData(
        interleaveData: number[], indexData: number[],
        width: number, height: number, wDepth: number,
        gridResolutionX: number, gridResolutionY: number,
        uAxis: 'x' | 'y' | 'z', vAxis: 'x' | 'y' | 'z', wAxis: 'x' | 'y' | 'z',
        uDir: number, vDir: number, wNormal: number,
        flipY: boolean = false
    ) {
        const pos = {x: 0, y: 0, z: 0}, normal = {x: 0, y: 0, z: 0};

        this.generateGrid(interleaveData, indexData, gridResolutionX, gridResolutionY, (u, v) => {
            const x = (u - 0.5) * width;
            const y = (v - 0.5) * height;
            pos[uAxis] = x * uDir; pos[vAxis] = y * vDir; pos[wAxis] = wDepth;
            normal[uAxis] = 0; normal[vAxis] = 0; normal[wAxis] = wNormal;
            const uvY = flipY ? (1 - v) : v;
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, u, uvY);
        });
    }

    /**
     * [KO] 벡터 기반으로 임의의 평면에 원형 기하 데이터를 생성합니다.
     * 
     * @param uvVStart - [KO] UV V축 시작점 (기본값 0) [EN] UV V-axis start point (default 0)
     * @param uvVEnd - [KO] UV V축 끝점 (기본값 1) [EN] UV V-axis end point (default 1)
     */
    static generateCircleData(
        interleaveData: number[], indexData: number[],
        radius: number, radialSegments: number, thetaStart: number, thetaLength: number,
        center: { x: number, y: number, z: number },
        uVector: { x: number, y: number, z: number }, vVector: { x: number, y: number, z: number },
        normal: { x: number, y: number, z: number },
        isFront: boolean = true, isRadial: boolean = false,
        uvVStart: number = 0, uvVEnd: number = 1
    ) {
        const vertexOffset = interleaveData.length / 12;
        // Radial 모드일 때 중심점은 uvVStart (거리 0), U는 각도의 중앙값(0.5)
        this.interleavePacker(interleaveData, center.x, center.y, center.z, normal.x, normal.y, normal.z, 0.5, isRadial ? uvVStart : 0.5);
        if (radius <= 1e-6 || Math.abs(thetaLength) < 1e-6) return;

        for (let s = 0; s <= radialSegments; s++) {
            const uRatio = s / radialSegments, angle = thetaStart + uRatio * thetaLength;
            const pos = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint(center, radius, angle, uVector, vVector, pos);
            const uvX = isRadial ? uRatio : 0.5 - (Math.sin(angle) * 0.5);
            const uvY = isRadial ? uvVEnd : 0.5 - (Math.cos(angle) * 0.5);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, uvX, uvY);
        }
        for (let i = 1; i <= radialSegments; i++) {
            const c = vertexOffset, v1 = vertexOffset + i, v2 = vertexOffset + i + 1;
            isFront ? indexData.push(c, v1, v2) : indexData.push(c, v2, v1);
        }
    }

    /**
     * [KO] 벡터 기반으로 임의의 평면에 링(Ring) 기하 데이터를 생성합니다.
     * 
     * @param uvVStart - [KO] UV V축 시작점 (기본값 0) [EN] UV V-axis start point (default 0)
     * @param uvVEnd - [KO] UV V축 끝점 (기본값 1) [EN] UV V-axis end point (default 1)
     */
    static generateRingData(
        interleaveData: number[], indexData: number[],
        innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number,
        thetaStart: number, thetaLength: number,
        center: { x: number, y: number, z: number },
        uVector: { x: number, y: number, z: number }, vVector: { x: number, y: number, z: number },
        normal: { x: number, y: number, z: number },
        isFront: boolean = true, isRadial: boolean = false,
        uvVStart: number = 0, uvVEnd: number = 1
    ) {
        if (outerRadius <= 1e-6 || Math.abs(thetaLength) < 1e-6) {
            this.interleavePacker(interleaveData, center.x, center.y, center.z, normal.x, normal.y, normal.z, 0.5, 0.5);
            return;
        }

        this.generateGrid(interleaveData, indexData, thetaSegments, phiSegments, (u, v) => {
            const radius = innerRadius + v * (outerRadius - innerRadius);
            const angle = thetaStart + u * thetaLength;
            const uvV = uvVStart + v * (uvVEnd - uvVStart);
            const pos = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint(center, radius, angle, uVector, vVector, pos);
            const uvX = isRadial ? u : 0.5 - (radius / outerRadius * Math.sin(angle) * 0.5);
            const uvY = isRadial ? uvV : 0.5 - (radius / outerRadius * Math.cos(angle) * 0.5);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, uvX, uvY);
        }, false, !isFront);
    }

    /**
     * [KO] 구체(Spherical) 형태의 기하 데이터를 생성합니다.
     */
    static generateSphericalData(
        interleaveData: number[], radius: number, widthSegments: number, heightSegments: number,
        phiStart: number, phiLength: number, thetaStart: number, thetaLength: number,
        yOffset: number = 0, uvVStart: number = 0, uvVEnd: number = 1
    ) {
        this.generateGrid(interleaveData, [], widthSegments, heightSegments, (u, v) => {
            const theta = thetaStart + v * thetaLength;
            const phi = phiStart + u * phiLength;
            const sinTheta = Math.sin(theta), cosTheta = Math.cos(theta);
            const sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);
            const uvV = uvVStart + v * (uvVEnd - uvVStart);

            const x = radius * (-sinPhi) * sinTheta;
            const y = radius * cosTheta + yOffset;
            const z = radius * (-cosPhi) * sinTheta;
            this.interleavePacker(interleaveData, x, y, z, (-sinPhi) * sinTheta, cosTheta, (-cosPhi) * sinTheta, u, uvV);
        }, true);
    }

    /**
     * [KO] 벡터 기반으로 실린더의 몸통(Torso) 데이터를 생성합니다.
     */
    static generateCylinderTorsoData(
        interleaveData: number[], indexData: number[],
        radiusTop: number, radiusBottom: number, height: number,
        radialSegments: number, heightSegments: number, thetaStart: number, thetaLength: number,
        center: { x: number, y: number, z: number },
        uVector: { x: number, y: number, z: number }, vVector: { x: number, y: number, z: number },
        axisVector: { x: number, y: number, z: number } = {x: 0, y: 1, z: 0},
        skipIndices: boolean = false, uvVStart: number = 0, uvVEnd: number = 1
    ) {
        const halfHeight = height / 2, slope = (radiusBottom - radiusTop) / height;
        if (thetaLength === 0 || (radiusTop <= 0 && radiusBottom <= 0)) {
            this.interleavePacker(interleaveData, center.x, center.y, center.z, 0, 1, 0, 0, 0);
            return;
        }

        this.generateGrid(interleaveData, indexData, radialSegments, heightSegments, (u, v) => {
            const radius = v * (radiusBottom - radiusTop) + radiusTop;
            const angle = u * thetaLength + thetaStart;
            const hOffset = halfHeight - v * height;
            const uvV = uvVStart + v * (uvVEnd - uvVStart);

            const ringPos = {x: 0, y: 0, z: 0};
            this.#calculateRadialPoint({x: 0, y: 0, z: 0}, radius, angle, uVector, vVector, ringPos);

            const px = center.x + ringPos.x + hOffset * axisVector.x;
            const py = center.y + ringPos.y + hOffset * axisVector.y;
            const pz = center.z + ringPos.z + hOffset * axisVector.z;

            const rnx = ringPos.x / (radius || 1), rny = ringPos.y / (radius || 1), rnz = ringPos.z / (radius || 1);
            const nx = rnx + slope * axisVector.x, ny = rny + slope * axisVector.y, nz = rnz + slope * axisVector.z;
            const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;

            this.interleavePacker(interleaveData, px, py, pz, nx / nLen, ny / nLen, nz / nLen, u, uvV);
        }, skipIndices);
    }

    /**
     * [KO] 방사형 궤적의 포인트를 계산합니다. (+V 기점, CCW 회전)
     */
    static #calculateRadialPoint(center: any, radius: number, angle: number, u: any, v: any, out: any) {
        const cos = Math.cos(angle), sin = Math.sin(angle);
        out.x = center.x + radius * (cos * v.x - sin * u.x);
        out.y = center.y + radius * (cos * v.y - sin * u.y);
        out.z = center.z + radius * (cos * v.z - sin * u.z);
    }

    /**
     * [KO] 캡슐(Capsule) 기하 데이터를 생성합니다.
     */
    static generateCapsuleData(
        redGPUContext: RedGPUContext, radius: number, height: number,
        radialSegments: number, heightSegments: number, capSegments: number, uniqueKey: string
    ): Geometry {
        const interleaveData: number[] = [], indexData: number[] = [], gridX1 = radialSegments + 1;
        const halfHeight = height / 2, capArc = (Math.PI / 2) * radius, totalArc = capArc * 2 + height;
        const v1 = capArc / totalArc, v2 = (capArc + height) / totalArc;

        this.generateSphericalData(interleaveData, radius, radialSegments, capSegments, 0, Math.PI * 2, 0, Math.PI / 2, halfHeight, 0, v1);
        this.generateCylinderTorsoData(interleaveData, indexData, radius, radius, height, radialSegments, heightSegments, 0, Math.PI * 2, {x: 0, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: -1}, {x: 0, y: 1, z: 0}, true, v1, v2);
        this.generateSphericalData(interleaveData, radius, radialSegments, capSegments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2, -halfHeight, v2, 1);

        this.generateGridIndices(indexData, 0, radialSegments, capSegments * 2 + heightSegments, gridX1);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static generateGridIndices(indexData: number[], vertexOffset: number, gridX: number, gridY: number, gridX1: number, reverse: boolean = false) {
        for (let iy = 0; iy < gridY; iy++) {
            for (let ix = 0; ix < gridX; ix++) {
                const a = vertexOffset + ix + gridX1 * iy, b = vertexOffset + ix + gridX1 * (iy + 1), c = vertexOffset + (ix + 1) + gridX1 * (iy + 1), d = vertexOffset + (ix + 1) + gridX1 * iy;
                reverse ? indexData.push(a, d, b, d, c, b) : indexData.push(a, b, d, b, c, d);
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
