/**
 * MikkTSpace 알고리즘을 기반으로 탄젠트 벡터를 계산합니다.
 * (주의: MikkTSpace의 모든 경계면 처리 로직 대신, TBN 안정화를 강화한 단순 평균화 방식입니다.)
 * @param vertices - 정점 위치 배열 [x,y,z, x,y,z, ...]
 * @param normals - 노멀 벡터 배열 [x,y,z, x,y,z, ...]
 * @param uvs - UV 좌표 배열 [u,v, u,v, ...]
 * @param indices - 인덱스 배열 (삼각형 단위)
 * @returns 탄젠트 배열 [x,y,z,w, x,y,z,w, ...] (w는 binormal 방향)
 */
const calculateTangents = (
  vertices: number[],
  normals: number[],
  uvs: number[],
  indices: number[],
  existingTangents?: number[] // 기존 탄젠트 (선택적)
): number[] => {
    const vertexCount = vertices.length / 3;

    // 탄젠트와 bitangent 누적을 위한 임시 배열
    const tan1 = new Float32Array(vertexCount * 3);
    const tan2 = new Float32Array(vertexCount * 3);

    const triangleCount = indices.length ? indices.length / 3 : vertexCount / 3;

    for (let i = 0; i < triangleCount; i++) {
        // ... (i1, i2, i3 인덱스 추출 및 v, w 좌표 추출은 동일) ...
        const i1 = indices.length ? indices[i * 3] : i * 3;
        const i2 = indices.length ? indices[i * 3 + 1] : i * 3 + 1;
        const i3 = indices.length ? indices[i * 3 + 2] : i * 3 + 2;

        const v1x = vertices[i1 * 3], v1y = vertices[i1 * 3 + 1], v1z = vertices[i1 * 3 + 2];
        const v2x = vertices[i2 * 3], v2y = vertices[i2 * 3 + 1], v2z = vertices[i2 * 3 + 2];
        const v3x = vertices[i3 * 3], v3y = vertices[i3 * 3 + 1], v3z = vertices[i3 * 3 + 2];

        const w1x = uvs[i1 * 2], w1y = uvs[i1 * 2 + 1];
        const w2x = uvs[i2 * 2], w2y = uvs[i2 * 2 + 1];
        const w3x = uvs[i3 * 2], w3y = uvs[i3 * 2 + 1];

        const x1 = v2x - v1x, x2 = v3x - v1x;
        const y1 = v2y - v1y, y2 = v3y - v1y;
        const z1 = v2z - v1z, z2 = v3z - v1z;

        const s1 = w2x - w1x, s2 = w3x - w1x;
        const t1 = w2y - w1y, t2 = w3y - w1y;

        // UV 델타가 0에 가까워지는 경우를 대비한 Epsilon 처리
        const div = s1 * t2 - s2 * t1;
        const r = Math.abs(div) < 1e-6 ? 0 : 1.0 / div; // Epsilon 추가 및 0 대신 작은 값으로 비교

        const sdirx = (t2 * x1 - t1 * x2) * r;
        const sdiry = (t2 * y1 - t1 * y2) * r;
        const sdirz = (t2 * z1 - t1 * z2) * r;

        const tdirx = (s1 * x2 - s2 * x1) * r;
        const tdiry = (s1 * y2 - s2 * y1) * r;
        const tdirz = (s1 * z2 - s2 * z1) * r;

        // ... (탄젠트/바이탄젠트 누적은 동일) ...
        // 각 정점에 누적
        tan1[i1 * 3] += sdirx; tan1[i1 * 3 + 1] += sdiry; tan1[i1 * 3 + 2] += sdirz;
        tan1[i2 * 3] += sdirx; tan1[i2 * 3 + 1] += sdiry; tan1[i2 * 3 + 2] += sdirz;
        tan1[i3 * 3] += sdirx; tan1[i3 * 3 + 1] += sdiry; tan1[i3 * 3 + 2] += sdirz;

        tan2[i1 * 3] += tdirx; tan2[i1 * 3 + 1] += tdiry; tan2[i1 * 3 + 2] += tdirz;
        tan2[i2 * 3] += tdirx; tan2[i2 * 3 + 1] += tdiry; tan2[i2 * 3 + 2] += tdirz;
        tan2[i3 * 3] += tdirx; tan2[i3 * 3 + 1] += tdiry; tan2[i3 * 3 + 2] += tdirz;
    }

    // 최종 탄젠트 배열 (x, y, z, w)
    const tangents: number[] = [];

    // ... (기존 탄젠트 검증 로직은 동일) ...
    const hasExistingTangents = existingTangents && existingTangents.length >= vertexCount * 4;
    const shouldRecalculate = new Array(vertexCount).fill(false);

    if (hasExistingTangents) {
        for (let i = 0; i < vertexCount; i++) {
            const tx = existingTangents[i * 4];
            const ty = existingTangents[i * 4 + 1];
            const tz = existingTangents[i * 4 + 2];
            const length = Math.sqrt(tx * tx + ty * ty + tz * tz);
            if (length < 0.01) {
                shouldRecalculate[i] = true;
            }
        }
    }

    // 각 정점에 대해 그람-슈미트 정규직교화 수행
    for (let i = 0; i < vertexCount; i++) {
        if (hasExistingTangents && !shouldRecalculate[i]) {
            tangents.push(
              existingTangents[i * 4],
              existingTangents[i * 4 + 1],
              existingTangents[i * 4 + 2],
              existingTangents[i * 4 + 3]
            );
            continue;
        }

        const nx = normals[i * 3], ny = normals[i * 3 + 1], nz = normals[i * 3 + 2];
        const t1x = tan1[i * 3], t1y = tan1[i * 3 + 1], t1z = tan1[i * 3 + 2];
        const t2x = tan2[i * 3], t2y = tan2[i * 3 + 1], t2z = tan2[i * 3 + 2];

        // 1. 그람-슈미트: T를 N에 수직으로 만듦
        const dot = nx * t1x + ny * t1y + nz * t1z;

        let tx = t1x - nx * dot;
        let ty = t1y - ny * dot;
        let tz = t1z - nz * dot;

        // 2. T 정규화
        const len = Math.sqrt(tx * tx + ty * ty + tz * tz);
        if (len > 1e-6) { // Epsilon 추가
            tx /= len;
            ty /= len;
            tz /= len;
        } else {
            // T 벡터가 0일 경우, T를 임의로 N에 수직인 벡터로 설정 (대부분의 경우 발생하지 않음)
            // 간단하게 (1, 0, 0)을 사용하고 N과 수직이 되도록 다시 정규화
            tx = 1.0; ty = 0.0; tz = 0.0;
            const dot_fallback = nx * tx + ny * ty + nz * tz;
            tx = tx - nx * dot_fallback;
            ty = ty - ny * dot_fallback;
            tz = tz - nz * dot_fallback;
            const len_fallback = Math.sqrt(tx * tx + ty * ty + tz * tz);
            if(len_fallback > 1e-6) {
                tx /= len_fallback;
                ty /= len_fallback;
                tz /= len_fallback;
            }
            // 이 경우 w는 1로 설정됨 (아래 w 계산 로직이 이를 처리함)
        }

        // 3. Handedness (W 성분) 계산: 최종 정규화된 T를 사용
        // cross(n, T)를 계산 (이는 곧 B'입니다)
        const crossX = ny * tz - nz * ty; // T1이 아닌 최종 tx, ty, tz 사용
        const crossY = nz * tx - nx * tz;
        const crossZ = nx * ty - ny * tx;

        // w = dot(cross(n, T), T2) < 0 ? -1 : 1
        const w = (crossX * t2x + crossY * t2y + crossZ * t2z) < 0 ? -1 : 1;

        // 4. 최종 결과 push
        tangents.push(tx, ty, tz, w);
    }

    return tangents;
};

export default calculateTangents;
