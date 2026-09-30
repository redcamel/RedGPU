/**
 * [KO] Landscape 식생 서브셀(SubCell) 공간 분할 및 동적 인스턴스 스트리밍 네임스페이스입니다.
 * [EN] Namespace for Landscape Foliage SubCell spatial partitioning and dynamic instance streaming.
 *
 * @remarks
 * **[KO]**
 * - `FoliageSubCellPartitioner`: 식생 레이어 가중치, 경사도 필터 및 난수 시드를 반영하여 타일 내부를 서브셀 청크 단위로 분할합니다.
 * - `FoliageSubCellStreamer`: 카메라 거리 및 프레임별 버짓(Budget)에 따라 활성 서브셀의 인스턴스를 GPU 메가 버퍼에 동적으로 마운트/언마운트합니다.
 * - `FoliageSubCellChunk`: 파티셔닝된 개별 서브셀의 위치 정보 및 패킹된 인스턴스 데이터 구조체입니다.
 *
 * **[EN]**
 * - `FoliageSubCellPartitioner`: Partitions tiles into subcell chunks taking into account layer weights, slope filters, and seeds.
 * - `FoliageSubCellStreamer`: Dynamically mounts/unmounts instance data into the GPU mega buffer based on camera proximity and frame budget.
 * - `FoliageSubCellChunk`: Data structure containing partitioned subcell coordinates and packed instance data.
 *
 * @packageDocumentation
 */

import FoliageSubCellPartitioner, {type FoliageSubCellChunk} from "./FoliageSubCellPartitioner";
import FoliageSubCellStreamer from "./FoliageSubCellStreamer";

export {
    FoliageSubCellPartitioner,
    FoliageSubCellStreamer,
    type FoliageSubCellChunk
};
