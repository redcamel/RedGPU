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
     * [KO] 캡슐(Capsule) 기하 데이터를 생성합니다.
     * [EN] Generates capsule geometry data.
     */
    static generateCapsuleData(
        redGPUContext: RedGPUContext,
        radius: number, height: number,
        radialSegments: number, heightSegments: number, capSegments: number,
        uniqueKey: string
    ): Geometry {
        const interleaveData: number[] = [];
        const indexData: number[] = [];
        const gridX1 = radialSegments + 1;
        const totalVerticalSegments = capSegments * 2 + heightSegments;
        const halfCylinderHeight = height / 2;
        const capArcLength = (Math.PI / 2) * radius;
        const totalArcLength = capArcLength * 2 + height;

        // 1. Top Cap (반구)
        this.generateSphericalData(interleaveData, radius, radialSegments, capSegments, 0, Math.PI * 2, 0, Math.PI / 2, halfCylinderHeight, 0, capArcLength / totalArcLength);

        // 2. Cylinder Body (몸통) - [공유 실현]
        // 기존 루프를 제거하고 generateCylinderTorsoData를 skipIndices 모드로 호출
        this.generateCylinderTorsoData(
            interleaveData, indexData,
            radius, radius, height,
            radialSegments, heightSegments,
            0, Math.PI * 2,
            {x: 0, y: 0, z: 0},
            {x: 1, y: 0, z: 0},  // uVector (+X)
            {x: 0, y: 0, z: -1}, // vVector (-Z)
            {x: 0, y: 1, z: 0},  // axisVector (+Y)
            true // 인덱스 생성은 건너뛰고 정점만 추가
        );

        // [교정] Capsule은 몸통 정점 추가 시 UV V값이 0~1로 리셋되므로, 전체 캡슐 길이에 맞춰 수동 교정 필요
        // (이 부분은 generateCylinderTorsoData에 uvVStart/End를 추가하여 더 개선할 수 있음)
        const bodyVStart = capArcLength / totalArcLength;
        const bodyVEnd = (capArcLength + height) / totalArcLength;
        const bodyVertexCount = (heightSegments + 1) * gridX1;
        const bodyStartIndex = interleaveData.length / 12 - bodyVertexCount;
        
        for (let i = 0; i < bodyVertexCount; i++) {
            const offset = (bodyStartIndex + i) * 12 + 7; // UV V-offset
            const localV = interleaveData[offset];
            interleaveData[offset] = bodyVStart + localV * (bodyVEnd - bodyVStart);
        }

        // 3. Bottom Cap (반구)
        this.generateSphericalData(interleaveData, radius, radialSegments, capSegments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2, -halfCylinderHeight, bodyVEnd, 1);

        this.generateGridIndices(indexData, 0, radialSegments, totalVerticalSegments, gridX1);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

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

        // px, nx, py, ny, pz, nz 순서로 6개 면 생성
        this.generatePlaneData(interleaveData, indexData, depth, height, width / 2, depthSegments, heightSegments, 'z', 'y', 'x', -1, -1, 1); // px
        this.generatePlaneData(interleaveData, indexData, depth, height, -width / 2, depthSegments, heightSegments, 'z', 'y', 'x', 1, -1, -1); // nx
        this.generatePlaneData(interleaveData, indexData, width, depth, height / 2, widthSegments, depthSegments, 'x', 'z', 'y', 1, 1, 1); // py
        this.generatePlaneData(interleaveData, indexData, width, depth, -height / 2, widthSegments, depthSegments, 'x', 'z', 'y', 1, -1, -1); // ny
        this.generatePlaneData(interleaveData, indexData, width, height, depth / 2, widthSegments, heightSegments, 'x', 'y', 'z', 1, -1, 1); // pz
        this.generatePlaneData(interleaveData, indexData, width, height, -depth / 2, widthSegments, heightSegments, 'x', 'y', 'z', -1, -1, -1); // nz

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

        const vertexOffset = interleaveData.length / 12;
        for (let slice = 0; slice <= tubularSegments; ++slice) {
            const v = slice / tubularSegments;
            const sliceAngle = v * Math.PI * 2;
            const sliceSin = Math.sin(sliceAngle);
            const ringRadius = radius + sliceSin * thickness;
            const ny = Math.cos(sliceAngle);
            const y = ny * thickness;

            for (let ring = 0; ring <= radialSegments; ++ring) {
                const u = ring / radialSegments;
                const ringAngle = thetaStart + u * thetaLength;
                const sinTheta = Math.sin(ringAngle); 
                const cosTheta = Math.cos(ringAngle);
                
                const x = (-sinTheta) * ringRadius;
                const z = (-cosTheta) * ringRadius;
                const nx = (-sinTheta) * sliceSin;
                const nz = (-cosTheta) * sliceSin;

                this.interleavePacker(interleaveData, x, y, z, nx, ny, nz, u, v);
            }
        }

        this.generateGridIndices(indexData, vertexOffset, radialSegments, tubularSegments, radialSegments + 1, false);

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

        for (let i = 0; i <= tubularSegments; ++i) {
            const u = i / tubularSegments * windingsAroundAxis * Math.PI * 2;
            this.#calculateTorusKnotPosition(u, windingsAroundAxis, windingsAroundCircle, radius, P1);
            this.#calculateTorusKnotPosition(u + 0.01, windingsAroundAxis, windingsAroundCircle, radius, P2);
            
            T[0] = P2[0] - P1[0]; T[1] = P2[1] - P1[1]; T[2] = P2[2] - P1[2];
            N[0] = P2[0] + P1[0]; N[1] = P2[1] + P1[1]; N[2] = P2[2] + P1[2];
            
            B[0] = T[1] * N[2] - T[2] * N[1]; B[1] = T[2] * N[0] - T[0] * N[2]; B[2] = T[0] * N[1] - T[1] * N[0];
            let bLen = Math.sqrt(B[0] * B[0] + B[1] * B[1] + B[2] * B[2]) || 1;
            B[0] /= bLen; B[1] /= bLen; B[2] /= bLen;

            N[0] = B[1] * T[2] - B[2] * T[1]; N[1] = B[2] * T[0] - B[0] * T[2]; N[2] = B[0] * T[1] - B[1] * T[0];
            let nLen = Math.sqrt(N[0] * N[0] + N[1] * N[1] + N[2] * N[2]) || 1;
            N[0] /= nLen; N[1] /= nLen; N[2] /= nLen;

            for (let j = 0; j <= radialSegments; ++j) {
                const v = j / radialSegments * Math.PI * 2;
                const cx = -tubeRadius * Math.cos(v), cy = tubeRadius * Math.sin(v);
                const px = P1[0] + (cx * N[0] + cy * B[0]), py = P1[1] + (cx * N[1] + cy * B[1]), pz = P1[2] + (cx * N[2] + cy * B[2]);
                const nx = px - P1[0], ny = py - P1[1], nz = pz - P1[2];
                const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
                this.interleavePacker(interleaveData, px, py, pz, nx / len, ny / len, nz / len, i / tubularSegments, j / radialSegments);
            }
        }

        this.generateGridIndices(indexData, 0, radialSegments, tubularSegments, radialSegments + 1);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    static #calculateTorusKnotPosition(u, p, q, radius, pos) {
        const cu = Math.cos(u), su = Math.sin(u), quOverP = q / p * u, cs = Math.cos(quOverP);
        pos[0] = radius * (2 + cs) * 0.5 * cu; pos[1] = radius * (2 + cs) * su * 0.5; pos[2] = radius * Math.sin(quOverP) * 0.5;
    }

    /**
     * [KO] 특정 축 매핑을 기반으로 평면 기하 데이터를 생성합니다.
     * [EN] Generates plane geometry data based on specific axis mapping.
     */
    static generatePlaneData(
        interleaveData: number[],
        indexData: number[],
        width: number,
        height: number,
        wDepth: number,
        gridResolutionX: number,
        gridResolutionY: number,
        uAxis: 'x' | 'y' | 'z',
        vAxis: 'x' | 'y' | 'z',
        wAxis: 'x' | 'y' | 'z',
        uDir: number,
        vDir: number,
        wNormal: number,
        flipY: boolean = false
    ) {
        const vertexOffset = interleaveData.length / 12; // [교정] 12개 속성 기준
        const segmentWidth = width / gridResolutionX;
        const segmentHeight = height / gridResolutionY;
        const widthHalf = width / 2;
        const heightHalf = height / 2;
        const gridX1 = gridResolutionX + 1;
        const gridY1 = gridResolutionY + 1;

        const pos = {x: 0, y: 0, z: 0};
        const normal = {x: 0, y: 0, z: 0};

        for (let iy = 0; iy < gridY1; iy++) {
            const y = iy * segmentHeight - heightHalf;
            for (let ix = 0; ix < gridX1; ix++) {
                const x = ix * segmentWidth - widthHalf;
                pos[uAxis] = x * uDir;
                pos[vAxis] = y * vDir;
                pos[wAxis] = wDepth;

                normal[uAxis] = 0;
                normal[vAxis] = 0;
                normal[wAxis] = wNormal;

                const uvX = ix / gridResolutionX;
                const uvY = flipY ? (1 - iy / gridResolutionY) : (iy / gridResolutionY);

                this.interleavePacker(
                    interleaveData,
                    pos.x, pos.y, pos.z,
                    normal.x, normal.y, normal.z,
                    uvX, uvY
                );
            }
        }

        // 평면은 표준 와인딩 사용
        this.generateGridIndices(indexData, vertexOffset, gridResolutionX, gridResolutionY, gridX1);
    }

    /**
     * [KO] 벡터 기반으로 임의의 평면에 원형 기하 데이터를 생성합니다.
     * [EN] Generates circular geometry data on an arbitrary plane based on vectors.
     * 
     * @param isRadial - [KO] 방사형 UV 매핑 여부 [EN] Whether to use radial UV mapping
     */
    static generateCircleData(
        interleaveData: number[],
        indexData: number[],
        radius: number,
        radialSegments: number,
        thetaStart: number,
        thetaLength: number,
        center: { x: number, y: number, z: number },
        uVector: { x: number, y: number, z: number },
        vVector: { x: number, y: number, z: number },
        normal: { x: number, y: number, z: number },
        isFront: boolean = true,
        isRadial: boolean = false
    ) {
        const vertexOffset = interleaveData.length / 12;

        // 1. Center Vertex
        // [교정] isRadial 모드일 때 중심점은 V=0 (거리 0), U는 각도의 중앙값(0.5)으로 설정
        this.interleavePacker(
            interleaveData,
            center.x, center.y, center.z,
            normal.x, normal.y, normal.z,
            isRadial ? 0.5 : 0.5, 
            isRadial ? 0 : 0.5
        );

        if (radius <= 1e-6 || Math.abs(thetaLength) < 1e-6) return;

        // 2. Perimeter Vertices
        for (let s = 0; s <= radialSegments; s++) {
            const uRatio = s / radialSegments;
            const angle = thetaStart + uRatio * thetaLength;
            const cosVal = Math.cos(angle);
            const sinVal = Math.sin(angle); 

            // [업계 표준] +V(12시) 시작, CCW 회전 (-U 방향)
            const posX = center.x + radius * (cosVal * vVector.x - sinVal * uVector.x);
            const posY = center.y + radius * (cosVal * vVector.y - sinVal * uVector.y);
            const posZ = center.z + radius * (cosVal * vVector.z - sinVal * uVector.z);

            // [교정] UV 매핑 모드 분기
            let uvX, uvY;
            if (!isRadial) {
                // Planar (평면 투영): 텍스처를 판 위에 올려놓은 형태
                uvX = 0.5 - (sinVal * 0.5);
                uvY = 0.5 - (cosVal * 0.5);
            } else {
                // Radial (방사형/성장형 매핑): U = 각도(0~1), V = 중심으로부터의 거리(1)
                uvX = uRatio; // 회전 각도
                uvY = 1;      // 외곽선은 거리 1
            }

            this.interleavePacker(
                interleaveData,
                posX, posY, posZ,
                normal.x, normal.y, normal.z,
                uvX, uvY
            );
        }

        // 3. Indices (Triangle Fan)
        // [표준] Center -> v1 -> v2 가 CCW 와인딩을 형성함 (U -> V 궤적이 CCW일 때)
        for (let i = 1; i <= radialSegments; i++) {
            const c = vertexOffset;
            const v1 = vertexOffset + i;
            const v2 = vertexOffset + i + 1;
            if (isFront) {
                indexData.push(c, v1, v2);
            } else {
                indexData.push(c, v2, v1);
            }
        }
    }

    /**
     * [KO] 벡터 기반으로 임의의 평면에 링(Ring) 기하 데이터를 생성합니다.
     * [EN] Generates ring geometry data on an arbitrary plane based on vectors.
     * 
     * @param isRadial - [KO] 방사형 UV 매핑 여부 [EN] Whether to use radial UV mapping
     */
    static generateRingData(
        interleaveData: number[],
        indexData: number[],
        innerRadius: number,
        outerRadius: number,
        thetaSegments: number,
        phiSegments: number,
        thetaStart: number,
        thetaLength: number,
        center: { x: number, y: number, z: number },
        uVector: { x: number, y: number, z: number },
        vVector: { x: number, y: number, z: number },
        normal: { x: number, y: number, z: number },
        isFront: boolean = true,
        isRadial: boolean = false
    ) {
        const vertexOffset = interleaveData.length / 12;

        if (outerRadius <= 1e-6 || Math.abs(thetaLength) < 1e-6) {
            this.interleavePacker(interleaveData, center.x, center.y, center.z, normal.x, normal.y, normal.z, 0.5, 0.5);
            return;
        }

        // 1. Vertices 생성
        for (let j = 0; j <= phiSegments; j++) {
            const vRatio = j / phiSegments;
            const radius = innerRadius + vRatio * (outerRadius - innerRadius);

            for (let i = 0; i <= thetaSegments; i++) {
                const uRatio = i / thetaSegments;
                const angle = thetaStart + uRatio * thetaLength;
                const cosVal = Math.cos(angle);
                const sinVal = Math.sin(angle);

                // [업계 표준] +V(12시) 시작, CCW 회전 (-U 방향)
                const posX = center.x + radius * (cosVal * vVector.x - sinVal * uVector.x);
                const posY = center.y + radius * (cosVal * vVector.y - sinVal * uVector.y);
                const posZ = center.z + radius * (cosVal * vVector.z - sinVal * uVector.z);

                // UV 매핑
                let uvX, uvY;
                if (!isRadial) {
                    // Planar Mode
                    uvX = 0.5 - (radius / outerRadius * sinVal * 0.5);
                    uvY = 0.5 - (radius / outerRadius * cosVal * 0.5);
                } else {
                    // Radial Mode: U = 각도(0~1), V = 반지름(0~1)
                    uvX = uRatio;
                    uvY = vRatio;
                }

                this.interleavePacker(
                    interleaveData,
                    posX, posY, posZ,
                    normal.x, normal.y, normal.z,
                    uvX, uvY
                );
            }
        }

        // 2. Indices 생성 (Grid 기반)
        this.generateGridIndices(indexData, vertexOffset, thetaSegments, phiSegments, thetaSegments + 1, !isFront);
    }

    /**
     * [KO] 구체(Spherical) 형태의 기하 데이터를 생성합니다.
     * [EN] Generates spherical geometry data.
     * 
     * @param yOffset - [KO] Y축 오프셋 (Capsule 등에서 사용) [EN] Y-axis offset (used in Capsule, etc.)
     * @param uvVStart - [KO] UV V축 시작점 (기본값 0) [EN] UV V-axis start point (default 0)
     * @param uvVEnd - [KO] UV V축 끝점 (기본값 1) [EN] UV V-axis end point (default 1)
     */
    static generateSphericalData(
        interleaveData: number[],
        radius: number,
        widthSegments: number,
        heightSegments: number,
        phiStart: number,
        phiLength: number,
        thetaStart: number,
        thetaLength: number,
        yOffset: number = 0,
        uvVStart: number = 0,
        uvVEnd: number = 1
    ) {
        for (let iy = 0; iy <= heightSegments; iy++) {
            const vRatio = iy / heightSegments;
            const theta = thetaStart + vRatio * thetaLength;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            // [교정] 지정된 UV 범위 내에서 v값 보간
            const v = uvVStart + vRatio * (uvVEnd - uvVStart);

            for (let ix = 0; ix <= widthSegments; ix++) {
                const u = ix / widthSegments;
                // [업계 표준] 12시(-Z) 시작, CCW 회전 (-X 방향)
                const phi = phiStart + u * phiLength;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = radius * (-sinPhi) * sinTheta;
                const y = radius * cosTheta + yOffset;
                const z = radius * (-cosPhi) * sinTheta;

                const nx = (-sinPhi) * sinTheta;
                const ny = cosTheta;
                const nz = (-cosPhi) * sinTheta;

                this.interleavePacker(
                    interleaveData,
                    x, y, z,
                    nx, ny, nz,
                    u, v
                );
            }
        }
    }

    /**
     * [KO] 벡터 기반으로 실린더의 몸통(Torso) 데이터를 생성합니다.
     * [EN] Generates cylinder torso data based on vectors.
     */
    static generateCylinderTorsoData(
        interleaveData: number[],
        indexData: number[],
        radiusTop: number,
        radiusBottom: number,
        height: number,
        radialSegments: number,
        heightSegments: number,
        thetaStart: number,
        thetaLength: number,
        center: { x: number, y: number, z: number },
        uVector: { x: number, y: number, z: number },
        vVector: { x: number, y: number, z: number },
        axisVector: { x: number, y: number, z: number } = {x: 0, y: 1, z: 0},
        skipIndices: boolean = false // [추가] 인덱스 생성 건너뛰기 옵션
    ) {
        const vertexOffset = interleaveData.length / 12;
        const halfHeight = height / 2;
        const slope = (radiusBottom - radiusTop) / height;

        if (thetaLength === 0 || (radiusTop <= 0 && radiusBottom <= 0)) {
            this.interleavePacker(interleaveData, center.x, center.y, center.z, 0, 1, 0, 0, 0);
            return;
        }

        for (let iy = 0; iy <= heightSegments; iy++) {
            const v = iy / heightSegments;
            const radius = v * (radiusBottom - radiusTop) + radiusTop;
            const hOffset = halfHeight - v * height;

            for (let ix = 0; ix <= radialSegments; ix++) {
                const uRatio = ix / radialSegments;
                const theta = uRatio * thetaLength + thetaStart;
                const cosVal = Math.cos(theta);
                const sinVal = Math.sin(theta);

                // [업계 표준] +V(12시) 시작, CCW 회전 (-U 방향)
                const ringX = radius * (cosVal * vVector.x - sinVal * uVector.x);
                const ringY = radius * (cosVal * vVector.y - sinVal * uVector.y);
                const ringZ = radius * (cosVal * vVector.z - sinVal * uVector.z);

                const px = center.x + ringX + hOffset * axisVector.x;
                const py = center.y + ringY + hOffset * axisVector.y;
                const pz = center.z + ringZ + hOffset * axisVector.z;

                // Normal
                const rnx = cosVal * vVector.x - sinVal * uVector.x;
                const rny = cosVal * vVector.y - sinVal * uVector.y;
                const rnz = cosVal * vVector.z - sinVal * uVector.z;

                const nx = rnx + slope * axisVector.x;
                const ny = rny + slope * axisVector.y;
                const nz = rnz + slope * axisVector.z;
                const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);

                this.interleavePacker(
                    interleaveData,
                    px, py, pz,
                    nx / nLen, ny / nLen, nz / nLen,
                    uRatio, v
                );
            }
        }

        // [교정] 인덱스 생성이 필요한 경우에만 실행
        if (!skipIndices) {
            this.generateGridIndices(indexData, vertexOffset, radialSegments, heightSegments, radialSegments + 1, false);
        }
    }

    /**
     * [KO] 격자형 인덱스 데이터를 생성합니다.
     * [EN] Generates grid index data.
     * 
     * @param reverseWinding - [KO] 와인딩 방향 반전 여부 [EN] Whether to reverse winding direction
     */
    static generateGridIndices(
        indexData: number[],
        vertexOffset: number,
        gridX: number,
        gridY: number,
        gridX1: number,
        reverseWinding: boolean = false
    ) {
        for (let iy = 0; iy < gridY; iy++) {
            for (let ix = 0; ix < gridX; ix++) {
                const a = vertexOffset + ix + gridX1 * iy;          // TL
                const b = vertexOffset + ix + gridX1 * (iy + 1);      // BL
                const c = vertexOffset + (ix + 1) + gridX1 * (iy + 1);  // BR
                const d = vertexOffset + (ix + 1) + gridX1 * iy;      // TR
                
                if (reverseWinding) {
                    indexData.push(a, d, b, d, c, b);
                } else {
                    indexData.push(a, b, d, b, c, d);
                }
            }
        }
    }

    /**
     * [KO] 인덱스와 인터리브 데이터를 기반으로 탄젠트(Tangent)를 계산합니다. (P3, N3, U2, T4 구조 기준)
     * [EN] Calculates tangents based on index and interleave data. (Based on P3, N3, U2, T4 structure)
     */
    static calculateTangents(interleaveData: number[], indexData: number[]) {
        const vertices = [];
        const normals = [];
        const uvs = [];
        const vertexCount = interleaveData.length / 12;

        // 1. 데이터 추출 (De-interleave)
        for (let i = 0; i < vertexCount; i++) {
            const offset = i * 12;
            vertices.push(interleaveData[offset], interleaveData[offset + 1], interleaveData[offset + 2]);
            normals.push(interleaveData[offset + 3], interleaveData[offset + 4], interleaveData[offset + 5]);
            uvs.push(interleaveData[offset + 6], interleaveData[offset + 7]);
        }

        // 2. 공통 수학 유틸리티 호출
        const tangents = calculateTangents(vertices, normals, uvs, indexData);

        // 3. 결과 반영 (Re-pack)
        for (let i = 0; i < vertexCount; i++) {
            const offset = i * 12;
            const tOffset = i * 4;
            interleaveData[offset + 8] = tangents[tOffset];
            interleaveData[offset + 9] = tangents[tOffset + 1];
            interleaveData[offset + 10] = tangents[tOffset + 2];
            interleaveData[offset + 11] = tangents[tOffset + 3];
        }
    }

    /**
     * [KO] 정점 데이터를 인터리브(Interleave) 형식으로 패킹합니다. (P3, N3, U2, T4)
     * [EN] Packs vertex data in interleave format. (P3, N3, U2, T4)
     */
    static interleavePacker(
        interleaveData: number[],
        px: number, py: number, pz: number,
        nx: number, ny: number, nz: number,
        u: number, v: number,
        tx: number = 0, ty: number = 0, tz: number = 0, tw: number = 1
    ) {
        interleaveData.push(px, py, pz, nx, ny, nz, u, v, tx, ty, tz, tw);
    }
}

export default PrimitiveUtils;
