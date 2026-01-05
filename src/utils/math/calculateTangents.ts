/**
 * MikkTSpace 알고리즘을 기반으로 탄젠트 벡터를 계산합니다.
 * @param vertices - 정점 위치 배열 [x,y,z, x,y,z, ...]
 * @param normals - 노멀 벡터 배열 [x,y,z, x,y,z, ...]
 * @param uvs - UV 좌표 배열 [u,v, u,v, ...]
 * @param indices - 인덱스 배열 (삼각형 단위, 빈 배열이면 non-indexed)
 * @param existingTangents - 기존 탄젠트 배열 (선택적)
 * @returns 탄젠트 배열 [x,y,z,w, x,y,z,w, ...] (w는 handedness)
 */
const calculateTangents = (
    vertices: number[],
    normals: number[],
    uvs: number[],
    indices: number[],
    existingTangents?: number[]
): number[] => {
    const EPSILON = 1e-6;
    const vertexCount = vertices.length / 3;
    const isIndexed = indices.length > 0;
    const triangleCount = isIndexed ? indices.length / 3 : vertexCount / 3;

    // 탄젠트와 bitangent 누적 배열
    const tan1 = new Float32Array(vertexCount * 3);
    const tan2 = new Float32Array(vertexCount * 3);

    // 삼각형 순회하며 탄젠트/바이탄젠트 누적
    for (let i = 0; i < triangleCount; i++) {
        const i1 = isIndexed ? indices[i * 3] : i * 3;
        const i2 = isIndexed ? indices[i * 3 + 1] : i * 3 + 1;
        const i3 = isIndexed ? indices[i * 3 + 2] : i * 3 + 2;

        // 정점 위치
        const v1x = vertices[i1 * 3], v1y = vertices[i1 * 3 + 1], v1z = vertices[i1 * 3 + 2];
        const v2x = vertices[i2 * 3], v2y = vertices[i2 * 3 + 1], v2z = vertices[i2 * 3 + 2];
        const v3x = vertices[i3 * 3], v3y = vertices[i3 * 3 + 1], v3z = vertices[i3 * 3 + 2];

        // UV 좌표
        const w1x = uvs[i1 * 2], w1y = uvs[i1 * 2 + 1];
        const w2x = uvs[i2 * 2], w2y = uvs[i2 * 2 + 1];
        const w3x = uvs[i3 * 2], w3y = uvs[i3 * 2 + 1];

        // 엣지 벡터
        const x1 = v2x - v1x, x2 = v3x - v1x;
        const y1 = v2y - v1y, y2 = v3y - v1y;
        const z1 = v2z - v1z, z2 = v3z - v1z;

        // UV 델타
        const s1 = w2x - w1x, s2 = w3x - w1x;
        const t1 = w2y - w1y, t2 = w3y - w1y;

        // UV 영역 계산 (degenerate triangle 체크)
        const div = s1 * t2 - s2 * t1;
        const r = Math.abs(div) < EPSILON ? 0 : 1.0 / div;

        // 탄젠트/바이탄젠트 방향
        const sdirx = (t2 * x1 - t1 * x2) * r;
        const sdiry = (t2 * y1 - t1 * y2) * r;
        const sdirz = (t2 * z1 - t1 * z2) * r;

        const tdirx = (s1 * x2 - s2 * x1) * r;
        const tdiry = (s1 * y2 - s2 * y1) * r;
        const tdirz = (s1 * z2 - s2 * z1) * r;

        // 각 정점에 누적
        tan1[i1 * 3] += sdirx;
        tan1[i1 * 3 + 1] += sdiry;
        tan1[i1 * 3 + 2] += sdirz;
        tan1[i2 * 3] += sdirx;
        tan1[i2 * 3 + 1] += sdiry;
        tan1[i2 * 3 + 2] += sdirz;
        tan1[i3 * 3] += sdirx;
        tan1[i3 * 3 + 1] += sdiry;
        tan1[i3 * 3 + 2] += sdirz;

        tan2[i1 * 3] += tdirx;
        tan2[i1 * 3 + 1] += tdiry;
        tan2[i1 * 3 + 2] += tdirz;
        tan2[i2 * 3] += tdirx;
        tan2[i2 * 3 + 1] += tdiry;
        tan2[i2 * 3 + 2] += tdirz;
        tan2[i3 * 3] += tdirx;
        tan2[i3 * 3 + 1] += tdiry;
        tan2[i3 * 3 + 2] += tdirz;
    }

    // 최종 탄젠트 배열
    const tangents: number[] = [];
    const hasExisting = existingTangents && existingTangents.length >= vertexCount * 4;

    // 각 정점에 대해 그람-슈미트 정규직교화 수행
    for (let i = 0; i < vertexCount; i++) {
        // 기존 탄젠트가 유효하면 재사용
        if (hasExisting) {
            const tx = existingTangents[i * 4];
            const ty = existingTangents[i * 4 + 1];
            const tz = existingTangents[i * 4 + 2];
            const length = Math.sqrt(tx * tx + ty * ty + tz * tz);

            if (length > EPSILON) {
                tangents.push(tx, ty, tz, existingTangents[i * 4 + 3]);
                continue;
            }
        }

        const nx = normals[i * 3], ny = normals[i * 3 + 1], nz = normals[i * 3 + 2];
        const t1x = tan1[i * 3], t1y = tan1[i * 3 + 1], t1z = tan1[i * 3 + 2];
        const t2x = tan2[i * 3], t2y = tan2[i * 3 + 1], t2z = tan2[i * 3 + 2];

        // 그람-슈미트: T를 N에 수직으로 만듦
        const dot = nx * t1x + ny * t1y + nz * t1z;
        let tx = t1x - nx * dot;
        let ty = t1y - ny * dot;
        let tz = t1z - nz * dot;

        // T 정규화
        let len = Math.sqrt(tx * tx + ty * ty + tz * tz);

        if (len < EPSILON) {
            // Fallback: N과 평행하지 않은 축 선택
            const fallback = Math.abs(nx) < 0.9 ? [1, 0, 0] : [0, 1, 0];

            // N과 수직인 벡터 생성
            tx = fallback[0] - nx * (nx * fallback[0] + ny * fallback[1] + nz * fallback[2]);
            ty = fallback[1] - ny * (nx * fallback[0] + ny * fallback[1] + nz * fallback[2]);
            tz = fallback[2] - nz * (nx * fallback[0] + ny * fallback[1] + nz * fallback[2]);

            len = Math.sqrt(tx * tx + ty * ty + tz * tz);
        }

        tx /= len;
        ty /= len;
        tz /= len;

        // Handedness (w) 계산: cross(N, T) · T2의 부호
        const crossX = ny * tz - nz * ty;
        const crossY = nz * tx - nx * tz;
        const crossZ = nx * ty - ny * tx;
        const w = (crossX * t2x + crossY * t2y + crossZ * t2z) < 0 ? -1 : 1;

        tangents.push(tx, ty, tz, w);
    }

    return tangents;
};

export default calculateTangents;
