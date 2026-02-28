import calculateTangents from "../../math/calculateTangents";

/**
 * [KO] 프리미티브 생성을 위한 공통 수학 및 데이터 처리 유틸리티 클래스입니다.
 * [EN] Utility class for common math and data processing for primitive generation.
 *
 * @category Core
 */
class PrimitiveUtils {
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

                // [교정] interleavePacker 사용 (Tangent 자동 생성 로직은 추후 필요시 추가)
                this.interleavePacker(
                    interleaveData,
                    pos.x, pos.y, pos.z,
                    normal.x, normal.y, normal.z,
                    uvX, uvY
                );
            }
        }

        // [교정] generateGridIndices 사용
        this.generateGridIndices(indexData, vertexOffset, gridResolutionX, gridResolutionY, gridX1);
    }

    /**
     * [KO] 벡터 기반으로 임의의 평면에 원형 기하 데이터를 생성합니다.
     * [EN] Generates circular geometry data on an arbitrary plane based on vectors.
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
        isFront: boolean = true
    ) {
        const vertexOffset = interleaveData.length / 12;

        // 1. Center Vertex (최소 1개의 정점은 항상 생성하여 버퍼 크기 0 에러 방지)
        this.interleavePacker(
            interleaveData,
            center.x, center.y, center.z,
            normal.x, normal.y, normal.z,
            0.5, 0.5
        );

        if (radius <= 1e-6 || Math.abs(thetaLength) < 1e-6) return;

        // 2. Perimeter Vertices
        for (let s = 0; s <= radialSegments; s++) {
            const angle = thetaStart + (s / radialSegments) * thetaLength;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            const posX = center.x + radius * (cos * uVector.x + sin * vVector.x);
            const posY = center.y + radius * (cos * uVector.y + sin * vVector.y);
            const posZ = center.z + radius * (cos * uVector.z + sin * vVector.z);

            const uvX = (cos * 0.5) + 0.5;
            const uvY = (sin * 0.5) + 0.5;

            this.interleavePacker(
                interleaveData,
                posX, posY, posZ,
                normal.x, normal.y, normal.z,
                uvX, 1 - uvY
            );
        }

        // 3. Indices (Triangle Fan)
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
        axisVector: { x: number, y: number, z: number } = {x: 0, y: 1, z: 0}
    ) {
        const vertexOffset = interleaveData.length / 12;
        const halfHeight = height / 2;
        const slope = (radiusBottom - radiusTop) / height;

        // [안전장치] 최소 1개의 정점은 생성하여 0바이트 버퍼 에러 방지
        if (thetaLength === 0 || (radiusTop <= 0 && radiusBottom <= 0)) {
            this.interleavePacker(interleaveData, center.x, center.y, center.z, 0, 1, 0, 0, 0);
            return;
        }

        for (let iy = 0; iy <= heightSegments; iy++) {
            const v = iy / heightSegments;
            const radius = v * (radiusBottom - radiusTop) + radiusTop;
            const hOffset = halfHeight - v * height;

            for (let ix = 0; ix <= radialSegments; ix++) {
                const u = ix / radialSegments;
                const theta = u * thetaLength + thetaStart;
                const cos = Math.cos(theta);
                const sin = Math.sin(theta);

                // Position
                const ringX = radius * (cos * uVector.x + sin * vVector.x);
                const ringY = radius * (cos * uVector.y + sin * vVector.y);
                const ringZ = radius * (cos * uVector.z + sin * vVector.z);

                const px = center.x + ringX + hOffset * axisVector.x;
                const py = center.y + ringY + hOffset * axisVector.y;
                const pz = center.z + ringZ + hOffset * axisVector.z;

                // Normal (Ring direction + Slope)
                const rnx = cos * uVector.x + sin * vVector.x;
                const rny = cos * uVector.y + sin * vVector.y;
                const rnz = cos * uVector.z + sin * vVector.z;

                const nx = rnx + slope * axisVector.x;
                const ny = rny + slope * axisVector.y;
                const nz = rnz + slope * axisVector.z;
                const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);

                this.interleavePacker(
                    interleaveData,
                    px, py, pz,
                    nx / nLen, ny / nLen, nz / nLen,
                    u, v
                );
            }
        }

        this.generateGridIndices(indexData, vertexOffset, radialSegments, heightSegments, radialSegments + 1);
    }

    /**
     * [KO] 격자형 인덱스 데이터를 생성합니다. (CCW 와인딩)
     * [EN] Generates grid index data. (CCW winding)
     */
    static generateGridIndices(
        indexData: number[],
        vertexOffset: number,
        gridX: number,
        gridY: number,
        gridX1: number
    ) {
        for (let iy = 0; iy < gridY; iy++) {
            for (let ix = 0; ix < gridX; ix++) {
                const a = vertexOffset + ix + gridX1 * iy;          // TL
                const b = vertexOffset + ix + gridX1 * (iy + 1);      // BL
                const c = vertexOffset + (ix + 1) + gridX1 * (iy + 1);  // BR
                const d = vertexOffset + (ix + 1) + gridX1 * iy;      // TR
                indexData.push(a, b, d, b, c, d);
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
