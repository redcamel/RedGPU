/**
 * [KO] 인터리브 정점 버퍼에서 MikkTSpace 알고리즘 기반으로 정점 탄젠트 벡터(`[tx, ty, tz, w]`)를 계산하여 지정된 오프셋에 인플레이스(In-place)로 기록합니다.
 * [EN] Calculates vertex tangent vectors (`[tx, ty, tz, w]`) based on the MikkTSpace algorithm from an interleaved vertex buffer and writes them in-place at the specified offset.
 *
 * ### Example
 * ```typescript
 * RedGPU.Math.calculateTangentsInterleaved(interleaveData, indices, 12, 0, 3, 6, 8);
 * ```
 *
 * @param interleaveData -
 * [KO] 인터리브 정점 데이터 버퍼 (`Float32Array` 또는 `Array<number>`)
 * [EN] Interleaved vertex data buffer (`Float32Array` or `Array<number>`)
 * @param indices -
 * [KO] 삼각형 정점 인덱스 버퍼 (`Uint32Array` 또는 `Array<number>`)
 * [EN] Triangle vertex index buffer (`Uint32Array` or `Array<number>`)
 * @param stride -
 * [KO] 정점당 요소(float) 개수
 * [EN] Number of elements (floats) per vertex
 * @param posOffset -
 * [KO] 정점 내 위치(Position) 데이터의 시작 오프셋
 * [EN] Starting offset of position data within a vertex
 * @param normalOffset -
 * [KO] 정점 내 법선(Normal) 데이터의 시작 오프셋
 * [EN] Starting offset of normal data within a vertex
 * @param uvOffset -
 * [KO] 정점 내 UV 좌표 데이터의 시작 오프셋
 * [EN] Starting offset of UV coordinate data within a vertex
 * @param tangentOffset -
 * [KO] 계산된 탄젠트(`[tx, ty, tz, w]`)가 기록될 시작 오프셋
 * [EN] Starting offset where calculated tangents (`[tx, ty, tz, w]`) will be written
 * @category Math
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

        const v1x = interleaveData[o1 + posOffset], v1y = interleaveData[o1 + posOffset + 1],
            v1z = interleaveData[o1 + posOffset + 2];
        const v2x = interleaveData[o2 + posOffset], v2y = interleaveData[o2 + posOffset + 1],
            v2z = interleaveData[o2 + posOffset + 2];
        const v3x = interleaveData[o3 + posOffset], v3y = interleaveData[o3 + posOffset + 1],
            v3z = interleaveData[o3 + posOffset + 2];

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

    for (let i = 0; i < vertexCount; i++) {
        const o = i * stride;
        const nx = interleaveData[o + normalOffset], ny = interleaveData[o + normalOffset + 1],
            nz = interleaveData[o + normalOffset + 2];
        const t1x = tan1[i * 3], t1y = tan1[i * 3 + 1], t1z = tan1[i * 3 + 2];
        const t2x = tan2[i * 3], t2y = tan2[i * 3 + 1], t2z = tan2[i * 3 + 2];

        const dot = nx * t1x + ny * t1y + nz * t1z;
        let tx = t1x - nx * dot, ty = t1y - ny * dot, tz = t1z - nz * dot;
        let len = Math.sqrt(tx * tx + ty * ty + tz * tz);

        if (len < EPSILON) {
            const fallbackX = Math.abs(nx) < 0.9 ? 1 : 0, fallbackY = Math.abs(nx) < 0.9 ? 0 : 1;
            const fDot = nx * fallbackX + ny * fallbackY;
            tx = fallbackX - nx * fDot;
            ty = fallbackY - ny * fDot;
            tz = -nz * fDot;
            len = Math.sqrt(tx * tx + ty * ty + tz * tz);
        }

        tx /= len;
        ty /= len;
        tz /= len;
        const crossX = ny * tz - nz * ty, crossY = nz * tx - nx * tz, crossZ = nx * ty - ny * tx;
        const w = (crossX * t2x + crossY * t2y + crossZ * t2z) < 0 ? 1 : -1;

        interleaveData[o + tangentOffset] = tx;
        interleaveData[o + tangentOffset + 1] = ty;
        interleaveData[o + tangentOffset + 2] = tz;
        interleaveData[o + tangentOffset + 3] = w;
    }
};

/**
 * [KO] 정점 위치, 법선, UV, 인덱스 배열로부터 MikkTSpace 알고리즘 기반의 정점 탄젠트 벡터(`Float32Array`)를 계산하여 반환합니다.
 * [EN] Calculates and returns vertex tangent vectors (`Float32Array`) based on the MikkTSpace algorithm from vertex position, normal, UV, and index arrays.
 *
 * ### Example
 * ```typescript
 * const tangents = RedGPU.Math.calculateTangents(vertices, normals, uvs, indices);
 * ```
 *
 * @param vertices -
 * [KO] 정점 위치 배열 (`[x, y, z, ...]`)
 * [EN] Vertex position array (`[x, y, z, ...]`)
 * @param normals -
 * [KO] 정점 법선 벡터 배열 (`[nx, ny, nz, ...]`)
 * [EN] Vertex normal vector array (`[nx, ny, nz, ...]`)
 * @param uvs -
 * [KO] UV 텍스처 좌표 배열 (`[u, v, ...]`)
 * [EN] UV texture coordinate array (`[u, v, ...]`)
 * @param indices -
 * [KO] 삼각형 정점 인덱스 배열
 * [EN] Triangle vertex index array
 * @returns
 * [KO] 계산된 정점 탄젠트 배열 (`Float32Array`, `[tx, ty, tz, w, ...]`)
 * [EN] Calculated vertex tangent array (`Float32Array`, `[tx, ty, tz, w, ...]`)
 * @category Math
 */
const calculateTangents = (
    vertices: number[] | Float32Array,
    normals: number[] | Float32Array,
    uvs: number[] | Float32Array,
    indices: number[] | Uint32Array
): Float32Array => {
    const vertexCount = vertices.length / 3;
    const stride = 12;
    const buffer = new Float32Array(vertexCount * stride);

    for (let i = 0; i < vertexCount; i++) {
        const o = i * stride;
        buffer[o] = vertices[i * 3];
        buffer[o + 1] = vertices[i * 3 + 1];
        buffer[o + 2] = vertices[i * 3 + 2];
        buffer[o + 3] = normals[i * 3];
        buffer[o + 4] = normals[i * 3 + 1];
        buffer[o + 5] = normals[i * 3 + 2];
        buffer[o + 6] = uvs[i * 2];
        buffer[o + 7] = uvs[i * 2 + 1];
    }

    calculateTangentsInterleaved(buffer, indices, stride, 0, 3, 6, 8);

    const result = new Float32Array(vertexCount * 4);
    for (let i = 0; i < vertexCount; i++) {
        const o = i * stride, ro = i * 4;
        result[ro] = buffer[o + 8];
        result[ro + 1] = buffer[o + 9];
        result[ro + 2] = buffer[o + 10];
        result[ro + 3] = buffer[o + 11];
    }
    return result;
};

export default calculateTangents;
