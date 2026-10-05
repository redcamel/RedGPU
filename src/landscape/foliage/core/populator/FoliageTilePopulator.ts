/**
 * [KO] 지형 컴포넌트 타일의 유효성을 검증하고, 식생 인스턴스를 서브셀 단위로 분할하여 스트리머에 배치하는 전용 팝퓰레이터 모듈입니다.
 * [EN] Dedicated populator module that validates terrain component tiles, partitions foliage instances into sub-cells, and populates them into the streamer.
 * @packageDocumentation
 */
import LandscapeComponent from "../../../core/spatial/LandscapeComponent";
import Landscape from "../../../Landscape";
import Foliage from "../Foliage";
import FoliageSubCellPartitioner from "../subcell/FoliageSubCellPartitioner";
import FoliageSubCellStreamer from "../subcell/FoliageSubCellStreamer";

/**
 * [KO] 지형 타일별 식생 인스턴스 분할 및 스트리머 등록 파이프라인을 전담 관리하는 클래스입니다.
 * [EN] Class dedicated to managing the foliage instance partitioning and streamer registration pipeline per terrain tile.
 */
class FoliageTilePopulator {
    #loadedTileKeys: Set<number> = new Set();

    /**
     * [KO] 현재 로드되어 인스턴스가 등록된 타일의 총 개수를 반환합니다.
     * [EN] Returns the total number of currently loaded tiles with populated instances.
     */
    get loadedTileCount(): number {
        return this.#loadedTileKeys.size;
    }

    /**
     * [KO] 특정 그리드 좌표의 타일이 이미 로드 및 배치 완료되었는지 여부를 확인합니다.
     * [EN] Checks whether the tile at the specified grid coordinate has already been loaded and populated.
     * @param componentX -
     * [KO] 지형 컴포넌트 X 좌표
     * [EN] Terrain component X coordinate
     * @param componentZ -
     * [KO] 지형 컴포넌트 Z 좌표
     * [EN] Terrain component Z coordinate
     */
    isTileLoaded(componentX: number, componentZ: number): boolean {
        const cz = componentZ & 0xffff;
        const cx = componentX & 0xffff;
        const key = (cz << 16) | cx;
        return this.#loadedTileKeys.has(key);
    }

    /**
     * [KO] 신규 지형 타일 컴포넌트가 로드되었을 때 호출되어 해당 타일의 식생 인스턴스를 서브셀 단위로 분할(Partition) 및 스트리머에 등록합니다.
     * [EN] Invoked when a new terrain tile component is loaded to partition foliage instances into sub-cells and register them with the streamer.
     * @param tileComponent -
     * [KO] 로드된 지형 타일 컴포넌트
     * [EN] Loaded terrain tile component
     * @param foliage -
     * [KO] 대상 식생 타입 인스턴스
     * [EN] Target foliage type instance
     * @param landscape -
     * [KO] 부모 지형 인스턴스
     * [EN] Parent landscape instance
     * @param streamer -
     * [KO] 서브셀 인스턴스 스트리머
     * [EN] Sub-cell instance streamer
     * @param enableStreaming -
     * [KO] 공간 스트리밍 활성화 여부
     * [EN] Whether spatial streaming is enabled
     * @returns
     * [KO] 새롭게 파퓰레이션이 성공적으로 수행되었으면 true, 이미 로드되었거나 유효하지 않으면 false
     * [EN] true if population was newly performed, false if already loaded or invalid
     */
    populateTile(
        tileComponent: LandscapeComponent,
        foliage: Foliage,
        landscape: Landscape | null,
        streamer: FoliageSubCellStreamer,
        enableStreaming: boolean
    ): boolean {
        if (!tileComponent) return false;

        const cz = (tileComponent.componentZ ?? 0) & 0xffff;
        const cx = (tileComponent.componentX ?? 0) & 0xffff;
        const key = (cz << 16) | cx;
        if (this.#loadedTileKeys.has(key)) return false;

        if (landscape && typeof landscape.isTileLoaded === 'function') {
            if (!landscape.isTileLoaded(cz, cx)) {
                return false;
            }
        }

        this.#loadedTileKeys.add(key);

        const subCellSize = landscape?.foliageManager?.subCellSize ?? 100.0;
        const subCells = FoliageSubCellPartitioner.partitionTile(
            tileComponent,
            foliage,
            landscape,
            subCellSize
        );
        streamer.addSubCells(subCells);

        if (!enableStreaming) {
            streamer.update(new Int32Array(0), 0, 0, 0, false);
        }

        return true;
    }

    /**
     * [KO] 등록된 모든 타일 키 캐시를 완전히 비웁니다.
     * [EN] Clears all registered tile key caches.
     */
    clear(): void {
        this.#loadedTileKeys.clear();
    }
}

Object.freeze(FoliageTilePopulator);
export default FoliageTilePopulator;
