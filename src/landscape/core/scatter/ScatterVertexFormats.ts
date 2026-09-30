/**
 * [KO] Landscape 스캐터(식생 및 잔디 등) 렌더링에 사용되는 정점 버퍼 구조체 및 스트라이드 상수 정의 모듈입니다.
 * [EN] Vertex buffer interleaved structures and stride constants module for Landscape scatter (foliage, grass, etc.) rendering.
 *
 * @packageDocumentation
 */

import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";

/**
 * [KO] 랜드스케이프 스캐터 PBR 렌더링에 사용되는 표준 18 floats 정점 인터리브 구조체입니다.
 * [EN] Standard 18-float vertex interleaved structure used for Landscape scatter PBR rendering.
 */
export const PBR_INTERLEAVED_STRUCT = new VertexInterleavedStruct(
    {
        position: VertexInterleaveType.float32x3,
        vertexNormal: VertexInterleaveType.float32x3,
        uv: VertexInterleaveType.float32x2,
        uv1: VertexInterleaveType.float32x2,
        vertexColor_0: VertexInterleaveType.float32x4,
        vertexTangent: VertexInterleaveType.float32x4,
    },
    'PBR'
);

/**
 * [KO] PBR 인터리브 정점 스트라이드 (float 단위: 18)
 * [EN] PBR interleaved vertex stride in floats (18)
 */
export const PBR_STRIDE = 18;

/**
 * [KO] PBR 인터리브 정점 스트라이드 바이트 크기 (72 바이트)
 * [EN] PBR interleaved vertex stride in bytes (72 bytes)
 */
export const PBR_STRIDE_BYTES = PBR_STRIDE * 4;

/**
 * [KO] 그림자 및 뎁스 프리패스 렌더링에 최적화된 위치 전용(3 floats) 정점 인터리브 구조체입니다.
 * [EN] Position-only (3-float) vertex interleaved structure optimized for shadow and depth-prepass rendering.
 */
export const POSITION_ONLY_INTERLEAVED_STRUCT = new VertexInterleavedStruct(
    {
        position: VertexInterleaveType.float32x3,
    },
    'PositionOnly'
);

/**
 * [KO] 위치 전용 정점 스트라이드 (float 단위: 3)
 * [EN] Position-only vertex stride in floats (3)
 */
export const POSITION_ONLY_STRIDE = 3;

/**
 * [KO] 위치 전용 정점 스트라이드 바이트 크기 (12 바이트)
 * [EN] Position-only vertex stride in bytes (12 bytes)
 */
export const POSITION_ONLY_STRIDE_BYTES = POSITION_ONLY_STRIDE * 4;
