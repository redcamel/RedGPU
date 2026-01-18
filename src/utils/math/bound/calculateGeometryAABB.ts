import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import AABB from "./AABB";

/**
 * [KO] VertexBuffer 정보를 기반으로 AABB를 계산합니다.
 * [EN] Calculates AABB based on VertexBuffer information.
 *
 * [KO] 버텍스 버퍼의 각 정점 위치를 순회하며 최소/최대값을 찾아 AABB를 생성합니다.
 * [EN] Iterates through vertex positions to find min/max values and create an AABB.
 *
 * * ### Example
 * ```typescript
 * const geometryAABB = RedGPU.Util.calculateGeometryAABB(vertexBuffer);
 * ```
 *
 * @param vertexBuffer -
 * [KO] AABB를 계산할 버텍스 버퍼 객체
 * [EN] Vertex buffer object to calculate AABB from
 * @returns
 * [KO] 계산된 AABB 인스턴스
 * [EN] Calculated AABB instance
 * @category Bound
 */
const calculateGeometryAABB = (vertexBuffer: VertexBuffer): AABB => {
    // 버텍스 버퍼가 없거나 데이터가 없는 경우 빈 AABB 반환
    if (!vertexBuffer || !vertexBuffer.data || vertexBuffer.vertexCount === 0) {
        return new AABB(0, 0, 0, 0, 0, 0);
    }
    const stride = vertexBuffer.stride;
    const data = vertexBuffer.data;
    const len = vertexBuffer.vertexCount;
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    let i = 0;
    // 4개씩 언롤링된 루프 - Math.min/max 대신 조건문 사용
    for (; i <= len - 4; i += 4) {
        let idx = i * stride;
        const x1 = data[idx];
        const y1 = data[idx + 1];
        const z1 = data[idx + 2];
        idx = (i + 1) * stride;
        const x2 = data[idx];
        const y2 = data[idx + 1];
        const z2 = data[idx + 2];
        idx = (i + 2) * stride;
        const x3 = data[idx];
        const y3 = data[idx + 1];
        const z3 = data[idx + 2];
        idx = (i + 3) * stride;
        const x4 = data[idx];
        const y4 = data[idx + 1];
        const z4 = data[idx + 2];
        // X축
        if (x1 < minX) minX = x1;
        if (x2 < minX) minX = x2;
        if (x3 < minX) minX = x3;
        if (x4 < minX) minX = x4;
        if (x1 > maxX) maxX = x1;
        if (x2 > maxX) maxX = x2;
        if (x3 > maxX) maxX = x3;
        if (x4 > maxX) maxX = x4;
        // Y축
        if (y1 < minY) minY = y1;
        if (y2 < minY) minY = y2;
        if (y3 < minY) minY = y3;
        if (y4 < minY) minY = y4;
        if (y1 > maxY) maxY = y1;
        if (y2 > maxY) maxY = y2;
        if (y3 > maxY) maxY = y3;
        if (y4 > maxY) maxY = y4;
        // Z축
        if (z1 < minZ) minZ = z1;
        if (z2 < minZ) minZ = z2;
        if (z3 < minZ) minZ = z3;
        if (z4 < minZ) minZ = z4;
        if (z1 > maxZ) maxZ = z1;
        if (z2 > maxZ) maxZ = z2;
        if (z3 > maxZ) maxZ = z3;
        if (z4 > maxZ) maxZ = z4;
    }
    // 나머지 정점들 처리
    for (; i < len; i++) {
        const idx = i * stride;
        const x = data[idx];
        const y = data[idx + 1];
        const z = data[idx + 2];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (z < minZ) minZ = z;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        if (z > maxZ) maxZ = z;
    }
    return new AABB(minX, maxX, minY, maxY, minZ, maxZ);
};
export default calculateGeometryAABB;