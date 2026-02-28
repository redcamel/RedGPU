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
     *
     * @param interleaveData - [KO] 데이터를 추가할 인터리브 배열 [EN] Interleave array to add data
     * @param indexData - [KO] 데이터를 추가할 인덱스 배열 [EN] Index array to add data
     * @param width - [KO] 가로 길이 [EN] Width
     * @param height - [KO] 세로 길이 [EN] Height
     * @param wDepth - [KO] 깊이 위치 [EN] Depth position
     * @param gridResolutionX - [KO] 가로 세그먼트 수 [EN] Width segments
     * @param gridResolutionY - [KO] 세로 세그먼트 수 [EN] Height segments
     * @param uAxis - [KO] 가로축 매핑 (x, y, z) [EN] Width axis mapping (x, y, z)
     * @param vAxis - [KO] 세로축 매핑 (x, y, z) [EN] Height axis mapping (x, y, z)
     * @param wAxis - [KO] 깊이축 매핑 (x, y, z) [EN] Depth axis mapping (x, y, z)
     * @param uDir - [KO] 가로 방향 (1, -1) [EN] Width direction (1, -1)
     * @param vDir - [KO] 세로 방향 (1, -1) [EN] Height direction (1, -1)
     * @param wNormal - [KO] 노멀 방향 (1, -1) [EN] Normal direction (1, -1)
     * @param flipY - [KO] UV Y축 반전 여부 [EN] Whether to flip UV on Y-axis
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
        const segmentWidth = width / gridResolutionX;
        const segmentHeight = height / gridResolutionY;
        const widthHalf = width / 2;
        const heightHalf = height / 2;
        const gridX1 = gridResolutionX + 1;
        const gridY1 = gridResolutionY + 1;
        const vertexOffset = interleaveData.length / 8; // Position(3) + Normal(3) + UV(2)

        const vector = {x: 0, y: 0, z: 0};

        // Generate Vertices
        for (let iy = 0; iy < gridY1; iy++) {
            const y = iy * segmentHeight - heightHalf;
            for (let ix = 0; ix < gridX1; ix++) {
                const x = ix * segmentWidth - widthHalf;

                // Position
                vector[uAxis] = x * uDir;
                vector[vAxis] = y * vDir;
                vector[wAxis] = wDepth;
                interleaveData.push(vector.x, vector.y, vector.z);

                // Normal
                vector[uAxis] = 0;
                vector[vAxis] = 0;
                vector[wAxis] = wNormal;
                interleaveData.push(vector.x, vector.y, vector.z);

                // UV
                const uvX = ix / gridResolutionX;
                const uvY = flipY ? (1 - iy / gridResolutionY) : (iy / gridResolutionY);
                interleaveData.push(uvX, uvY);
            }
        }

        // Generate Indices
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
}

export default PrimitiveUtils;
