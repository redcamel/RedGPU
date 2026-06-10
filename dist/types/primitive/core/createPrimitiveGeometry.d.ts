import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
/**
 * [KO] 정점 데이터와 인덱스 데이터를 기반으로 기본 도형 지오메트리를 생성합니다.
 * [EN] Creates primitive geometry based on vertex and index data.
 *
 * ### Example
 * ```typescript
 * const geometry = RedGPU.Core.createPrimitiveGeometry(redGPUContext, interleaveData, indexData, "UniqueKey");
 * ```
 *
 * @param redGPUContext -
 * [KO] RedGPUContext 인스턴스
 * [EN] RedGPUContext instance
 * @param interleaveData -
 * [KO] 인터리브 형식의 정점 데이터 배열
 * [EN] Array of vertex data in interleaved format
 * @param indexData -
 * [KO] 인덱스 데이터 배열
 * [EN] Array of index data
 * @param uniqueKey -
 * [KO] 캐싱에 사용할 고유 키
 * [EN] Unique key for caching
 * @returns
 * [KO] 생성된 Geometry 인스턴스
 * [EN] Created Geometry instance
 * @category Core
 */
declare const createPrimitiveGeometry: (redGPUContext: RedGPUContext, interleaveData: number[], indexData: number[], uniqueKey: string) => Geometry;
export default createPrimitiveGeometry;
