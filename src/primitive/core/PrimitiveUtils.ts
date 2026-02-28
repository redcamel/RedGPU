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
        const vertexOffset = interleaveData.length / 8;
        const segmentWidth = width / gridResolutionX;
        const segmentHeight = height / gridResolutionY;
        const widthHalf = width / 2;
        const heightHalf = height / 2;
        const gridX1 = gridResolutionX + 1;
        const gridY1 = gridResolutionY + 1;

        const vector = {x: 0, y: 0, z: 0};

        for (let iy = 0; iy < gridY1; iy++) {
            const y = iy * segmentHeight - heightHalf;
            for (let ix = 0; ix < gridX1; ix++) {
                const x = ix * segmentWidth - widthHalf;
                vector[uAxis] = x * uDir;
                vector[vAxis] = y * vDir;
                vector[wAxis] = wDepth;
                interleaveData.push(vector.x, vector.y, vector.z);
                vector[uAxis] = 0;
                vector[vAxis] = 0;
                vector[wAxis] = wNormal;
                interleaveData.push(vector.x, vector.y, vector.z);
                const uvX = ix / gridResolutionX;
                const uvY = flipY ? (1 - iy / gridResolutionY) : (iy / gridResolutionY);
                interleaveData.push(uvX, uvY);
            }
        }

        for (let iy = 0; iy < gridResolutionY; iy++) {
            for (let ix = 0; ix < gridResolutionX; ix++) {
                const a = vertexOffset + ix + gridX1 * iy;
                const b = vertexOffset + ix + gridX1 * (iy + 1);
                const c = vertexOffset + (ix + 1) + gridX1 * (iy + 1);
                const d = vertexOffset + (ix + 1) + gridX1 * iy;
                indexData.push(a, b, d, b, c, d);
            }
        }
    }

    /**
     * [KO] 벡터 기반으로 임의의 평면에 원형 기하 데이터를 생성합니다.
     * [EN] Generates circular geometry data on an arbitrary plane based on vectors.
     */
    static generateCircleData(
        interleaveData: number[],
        indexData: number[],
        radius: number,
        segments: number,
        thetaStart: number,
        thetaLength: number,
        center: { x: number, y: number, z: number },
        uVector: { x: number, y: number, z: number },
        vVector: { x: number, y: number, z: number },
        normal: { x: number, y: number, z: number },
        isFront: boolean = true
    ) {
        const vertexOffset = interleaveData.length / 8;

        // 1. Center Vertex
        interleaveData.push(center.x, center.y, center.z);
        interleaveData.push(normal.x, normal.y, normal.z);
        interleaveData.push(0.5, 0.5);

        // 2. Perimeter Vertices
        for (let s = 0; s <= segments; s++) {
            const angle = thetaStart + (s / segments) * thetaLength;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            const posX = center.x + radius * (cos * uVector.x + sin * vVector.x);
            const posY = center.y + radius * (cos * uVector.y + sin * vVector.y);
            const posZ = center.z + radius * (cos * uVector.z + sin * vVector.z);
            interleaveData.push(posX, posY, posZ);
            interleaveData.push(normal.x, normal.y, normal.z);

            const uvX = (cos * 0.5) + 0.5;
            const uvY = (sin * 0.5) + 0.5;
            interleaveData.push(uvX, 1 - uvY);
        }

        // 3. Indices (Triangle Fan)
        for (let i = 1; i <= segments; i++) {
            const c = vertexOffset;
            const v1 = vertexOffset + i;
            const v2 = vertexOffset + i + 1;
            // [교정] isFront가 true일 때 표준 CCW 와인딩을 보장
            if (isFront) {
                indexData.push(c, v1, v2);
            } else {
                indexData.push(c, v2, v1);
            }
        }
    }
}

export default PrimitiveUtils;
