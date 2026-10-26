import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
/**
 * [KO] 스캐터 메인 패스 PBR 렌더링에 사용되는 표준 인터리브드 정점 레이아웃(`position`, `vertexNormal`, `uv`, `uv1`, `vertexColor_0`, `vertexTangent`)입니다.
 * [EN] Standard interleaved vertex layout (`position`, `vertexNormal`, `uv`, `uv1`, `vertexColor_0`, `vertexTangent`) used for scatter main pass PBR rendering.
 *
 * @category Landscape
 */
export declare const PBR_INTERLEAVED_STRUCT: VertexInterleavedStruct;
/**
 * [KO] PBR 인터리브드 정점 포맷의 정점당 `Float32` 요소 개수 (`18`)입니다.
 * [EN] Number of `Float32` elements per vertex (`18`) for the PBR interleaved vertex format.
 *
 * @category Landscape
 */
export declare const PBR_STRIDE = 18;
/**
 * [KO] PBR 인터리브드 정점 포맷의 정점당 바이트 스트라이드 (`72`)입니다.
 * [EN] Byte stride per vertex (`72`) for the PBR interleaved vertex format.
 *
 * @category Landscape
 */
export declare const PBR_STRIDE_BYTES: number;
/**
 * [KO] 스캐터 그림자 패스 전용 병합 지오메트리에 사용되는 위치 전용(`position`) 인터리브드 정점 레이아웃입니다.
 * [EN] Position-only (`position`) interleaved vertex layout used for merged geometries dedicated to the scatter shadow pass.
 *
 * @category Landscape
 */
export declare const POSITION_ONLY_INTERLEAVED_STRUCT: VertexInterleavedStruct;
/**
 * [KO] 위치 전용(`PositionOnly`) 정점 포맷의 정점당 `Float32` 요소 개수 (`3`)입니다.
 * [EN] Number of `Float32` elements per vertex (`3`) for the `PositionOnly` vertex format.
 *
 * @category Landscape
 */
export declare const POSITION_ONLY_STRIDE = 3;
/**
 * [KO] 위치 전용(`PositionOnly`) 정점 포맷의 정점당 바이트 스트라이드 (`12`)입니다.
 * [EN] Byte stride per vertex (`12`) for the `PositionOnly` vertex format.
 *
 * @category Landscape
 */
export declare const POSITION_ONLY_STRIDE_BYTES: number;
