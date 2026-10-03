/**
 * [KO] 지형(Landscape)의 단일 타일 청크에 대한 정적 공간 중심 위치 메타데이터 구조체입니다 (8바이트).
 * [EN] Static spatial world center position metadata struct for an individual landscape tile chunk (8 bytes).
 */
struct LandscapeTile {
    centerWorldX: f32,
    centerWorldZ: f32,
};
