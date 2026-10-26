import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
/**
 * [KO] 인터리브 정점 데이터와 인덱스 배열로부터 기본 도형 `Geometry` 인스턴스를 생성합니다.
 * [EN] Creates a primitive `Geometry` instance from interleaved vertex data and index arrays.
 *
 * ### Example
 * ```typescript
 * const geometry = RedGPU.Primitive.Core.createPrimitiveGeometry(
 *     redGPUContext,
 *     interleaveData,
 *     indexData,
 *     'CUSTOM_KEY'
 * );
 * ```
 *
 * @param redGPUContext -
 * [KO] RedGPUContext 인스턴스
 * [EN] RedGPUContext instance
 * @param interleaveData -
 * [KO] 인터리브 형식의 정점 데이터 배열 (`Array<number>`)
 * [EN] Interleaved vertex data array (`Array<number>`)
 * @param indexData -
 * [KO] 정점 인덱스 데이터 배열 (`Array<number>`)
 * [EN] Vertex index data array (`Array<number>`)
 * @param uniqueKey -
 * [KO] 버퍼 라벨 지정 및 캐싱에 사용할 고유 키
 * [EN] Unique key used for buffer labeling and caching
 * @returns
 * [KO] 생성된 `Geometry` 인스턴스
 * [EN] Created `Geometry` instance
 * @category Core
 */
declare const createPrimitiveGeometry: (redGPUContext: RedGPUContext, interleaveData: number[], indexData: number[], uniqueKey: string) => Geometry;
export default createPrimitiveGeometry;
