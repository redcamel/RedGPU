/**
 * [KO] MikkTSpace 알고리즘 기반으로 정점 탄젠트 벡터를 계산합니다. (고성능 인터리브 버퍼 전용)
 * [EN] Calculates vertex tangent vectors using MikkTSpace algorithm. (High-performance interleaved buffer only)
 *
 * @param interleaveData - [KO] 인터리브 형식의 정점 데이터 [EN] Interleaved vertex data
 * @param indices - [KO] 인덱스 데이터 [EN] Index data
 * @param stride - [KO] 정점당 데이터 개수 [EN] Floats per vertex
 * @param posOffset - [KO] 위치 데이터 오프셋 [EN] Position data offset
 * @param normalOffset - [KO] 노멀 데이터 오프셋 [EN] Normal data offset
 * @param uvOffset - [KO] UV 데이터 오프셋 [EN] UV data offset
 * @param tangentOffset - [KO] 결과 탄젠트가 기록될 오프셋 [EN] Offset where the result tangents will be written
 */
export const calculateTangentsInterleaved = (
    interleaveData: Float32Array | number[],
    indices: Uint32Array | number[],
    stride: number,
    posOffset: number,
    normalOffset: number,
    uvOffset: number,
    tangentOffset: number
): void => {
    const EPSILON = 1e-6;
    const vertexCount = interleaveData.length / stride;
    const isIndexed = indices.length > 0;
    const triangleCount = isIndexed ? indices.length / 3 : vertexCount / 3;

    const tan1 = new Float32Array(vertexCount * 3);
    const tan2 = new Float32Array(vertexCount * 3);

    for (let i = 0; i < triangleCount; i++) {
        const i1 = isIndexed ? indices[i * 3] : i * 3;
        const i2 = isIndexed ? indices[i * 3 + 1] : i * 3 + 1;
        const i3 = isIndexed ? indices[i * 3 + 2] : i * 3 + 2;

        const o1 = i1 * stride, o2 = i2 * stride, o3 = i3 * stride;

        const v1x = interleaveData[o1 + posOffset], v1y = interleaveData[o1 + posOffset + 1], v1z = interleaveData[o1 + posOffset + 2];
        const v2x = interleaveData[o2 + posOffset], v2y = interleaveData[o2 + posOffset + 1], v2z = interleaveData[o2 + posOffset + 2];
        const v3x = interleaveData[o3 + posOffset], v3y = interleaveData[o3 + posOffset + 1], v3z = interleaveData[o3 + posOffset + 2];

        const w1x = interleaveData[o1 + uvOffset], w1y = interleaveData[o1 + uvOffset + 1];
        const w2x = interleaveData[o2 + uvOffset], w2y = interleaveData[o2 + uvOffset + 1];
        const w3x = interleaveData[o3 + uvOffset], w3y = interleaveData[o3 + uvOffset + 1];

        const x1 = v2x - v1x, x2 = v3x - v1x;
        const y1 = v2y - v1y, y2 = v3y - v1y;
        const z1 = v2z - v1z, z2 = v3z - v1z;

        const s1 = w2x - w1x, s2 = w3x - w1x;
        const t1 = w2y - w1y, t2 = w3y - w1y;

        const div = s1 * t2 - s2 * t1;
        const r = Math.abs(div) < EPSILON ? 0 : 1.0 / div;

        const sdirx = (t2 * x1 - t1 * x2) * r;
        const sdiry = (t2 * y1 - t1 * y2) * r;
        const sdirz = (t2 * z1 - t1 * z2) * r;

        const tdirx = (s1 * x2 - s2 * x1) * r;
        const tdiry = (s1 * y2 - s2 * y1) * r;
        const tdirz = (s1 * z2 - s2 * z1) * r;

        tan1[i1 * 3] += sdirx; tan1[i1 * 3 + 1] += sdiry; tan1[i1 * 3 + 2] += sdirz;
        tan1[i2 * 3] += sdirx; tan1[i2 * 3 + 1] += sdiry; tan1[i2 * 3 + 2] += sdirz;
        tan1[i3 * 3] += sdirx; tan1[i3 * 3 + 1] += sdiry; tan1[i3 * 3 + 2] += sdirz;

        tan2[i1 * 3] += tdirx; tan2[i1 * 3 + 1] += tdiry; tan2[i1 * 3 + 2] += tdirz;
        tan2[i2 * 3] += tdirx; tan2[i2 * 3 + 1] += tdiry; tan2[i2 * 3 + 2] += tdirz;
        tan2[i3 * 3] += tdirx; tan2[i3 * 3 + 1] += tdiry; tan2[i3 * 3 + 2] += tdirz;
    }

    for (let i = 0; i < vertexCount; i++) {
        const o = i * stride;
        const nx = interleaveData[o + normalOffset], ny = interleaveData[o + normalOffset + 1], nz = interleaveData[o + normalOffset + 2];
        const t1x = tan1[i * 3], t1y = tan1[i * 3 + 1], t1z = tan1[i * 3 + 2];
        const t2x = tan2[i * 3], t2y = tan2[i * 3 + 1], t2z = tan2[i * 3 + 2];

        const dot = nx * t1x + ny * t1y + nz * t1z;
        let tx = t1x - nx * dot, ty = t1y - ny * dot, tz = t1z - nz * dot;
        let len = Math.sqrt(tx * tx + ty * ty + tz * tz);

        if (len < EPSILON) {
            const fallbackX = Math.abs(nx) < 0.9 ? 1 : 0, fallbackY = Math.abs(nx) < 0.9 ? 0 : 1;
            const fDot = nx * fallbackX + ny * fallbackY;
            tx = fallbackX - nx * fDot; ty = fallbackY - ny * fDot; tz = -nz * fDot;
            len = Math.sqrt(tx * tx + ty * ty + tz * tz);
        }

        tx /= len; ty /= len; tz /= len;
        const crossX = ny * tz - nz * ty, crossY = nz * tx - nx * tz, crossZ = nx * ty - ny * tx;
        const w = (crossX * t2x + crossY * t2y + crossZ * t2z) < 0 ? -1 : 1;

        interleaveData[o + tangentOffset] = tx;
        interleaveData[o + tangentOffset + 1] = ty;
        interleaveData[o + tangentOffset + 2] = tz;
        interleaveData[o + tangentOffset + 3] = w;
    }
};

/**
 * [KO] MikkTSpace 알고리즘 기반으로 정점 탄젠트 벡터를 계산하여 새로운 배열로 반환합니다. (순수 수학 유틸리티)
 * [EN] Calculates vertex tangent vectors and returns them as a new array. (Pure math utility)
 *
 * @param vertices - [KO] 정점 위치 배열 [EN] Vertex position array
 * @param normals - [KO] 노멀 벡터 배열 [EN] Normal vector array
 * @param uvs - [KO] UV 좌표 배열 [EN] UV coordinate array
 * @param indices - [KO] 인덱스 데이터 [EN] Index data
 * @returns [KO] 계산된 탄젠트 배열 [EN] Calculated tangent array [x, y, z, w, ...]
 * @category Math
 */
const calculateTangents = (
    vertices: number[] | Float32Array,
    normals: number[] | Float32Array,
    uvs: number[] | Float32Array,
    indices: number[] | Uint32Array
): Float32Array => {
    const vertexCount = vertices.length / 3;
    const stride = 12; // Pos(3) + Normal(3) + UV(2) + Tangent(4)
    const buffer = new Float32Array(vertexCount * stride);

    // [KO] 입력 데이터를 임시 인터리브 버퍼로 패킹
    for (let i = 0; i < vertexCount; i++) {
        const o = i * stride;
        buffer[o] = vertices[i * 3]; buffer[o + 1] = vertices[i * 3 + 1]; buffer[o + 2] = vertices[i * 3 + 2];
        buffer[o + 3] = normals[i * 3]; buffer[o + 4] = normals[i * 3 + 1]; buffer[o + 5] = normals[i * 3 + 2];
        buffer[o + 6] = uvs[i * 2]; buffer[o + 7] = uvs[i * 2 + 1];
    }

    // [KO] 코어 엔진 호출
    calculateTangentsInterleaved(buffer, indices, stride, 0, 3, 6, 8);

    // [KO] 결과 탄젠트 데이터만 추출하여 반환
    const result = new Float32Array(vertexCount * 4);
    for (let i = 0; i < vertexCount; i++) {
        const o = i * stride, ro = i * 4;
        result[ro] = buffer[o + 8]; result[ro + 1] = buffer[o + 9]; result[ro + 2] = buffer[o + 10]; result[ro + 3] = buffer[o + 11];
    }
    return result;
};

export default calculateTangents;
