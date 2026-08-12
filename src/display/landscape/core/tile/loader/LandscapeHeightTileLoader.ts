import parse16BitPngBuffer, {
    ParsedImageData
} from "../../../../../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer.js";

export interface LandscapeTileAddress {
    lodLevel: number;
    gridX: number;
    gridZ: number;
}

export type LandscapeTileUrlResolver = (tile: LandscapeTileAddress) => string | void;

/**
 * [KO] Landscape 높이맵 타일 비동기 로더 클래스
 * [EN] Async loader class for Landscape heightmap tiles
 *
 * 16-bit PNG / RAW 바이너리 데이터를 비동기 처리하며, 중복 로딩 방지 및 버퍼 재활용을 지원합니다.
 */
export class LandscapeHeightTileLoader {
    #urlResolver?: LandscapeTileUrlResolver;
    #pendingRequests: Map<string, Promise<ParsedImageData | null>> = new Map();

    constructor(urlResolver?: LandscapeTileUrlResolver) {
        this.#urlResolver = urlResolver;
    }

    /**
     * [KO] 타일 키(lod_x_z) 생성을 위한 헬퍼 메서드
     */
    static getTileKey(tile: LandscapeTileAddress): string {
        return `${tile.lodLevel}_${tile.gridX}_${tile.gridZ}`;
    }

    setUrlResolver(resolver?: LandscapeTileUrlResolver): void {
        this.#urlResolver = resolver;
    }

    /**
     * [KO] 비동기로 높이맵 타일 이미지/바이너리를 로드하고 파싱하여 디코딩 픽셀 데이터를 반환합니다.
     */
    async loadTile(tile: LandscapeTileAddress): Promise<ParsedImageData | null> {
        if (!this.#urlResolver) return null;

        const url = this.#urlResolver(tile);
        if (!url) return null;

        const key = LandscapeHeightTileLoader.getTileKey(tile);

        // 진행 중인 동일 타일 요청이 있으면 기존 Promise 재사용 (중복 Fetch 방지)
        if (this.#pendingRequests.has(key)) {
            return this.#pendingRequests.get(key)!;
        }

        const loadPromise = (async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.warn(`[LandscapeHeightTileLoader] Failed to fetch tile: ${url} (${response.status})`);
                    return null;
                }

                const arrayBuffer = await response.arrayBuffer();

                // 1. 16비트 PNG 시그니처 체크 (0x89504E47)
                const view = new DataView(arrayBuffer);
                if (arrayBuffer.byteLength >= 8 && view.getUint32(0) === 0x89504E47) {
                    return await parse16BitPngBuffer(arrayBuffer);
                }

                // 2. RAW Uint16Array 데이터인 경우 (Fallback 파싱)
                const pixelCount = Math.floor(arrayBuffer.byteLength / 2);
                const dimension = Math.sqrt(pixelCount);
                if (Number.isInteger(dimension)) {
                    return {
                        pixels: new Uint16Array(arrayBuffer),
                        width: dimension,
                        height: dimension
                    };
                }

                return null;
            } catch (err) {
                console.error(`[LandscapeHeightTileLoader] Error loading tile ${key}:`, err);
                return null;
            } finally {
                this.#pendingRequests.delete(key);
            }
        })();

        this.#pendingRequests.set(key, loadPromise);
        return loadPromise;
    }

    /**
     * [KO] 모든 요청 대기열 초기화
     */
    clearPending(): void {
        this.#pendingRequests.clear();
    }
}
