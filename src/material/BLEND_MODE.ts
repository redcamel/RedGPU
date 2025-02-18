export const BLEND_MODE = {
    NORMAL: 0,
    MULTIPLY: 1,
    LIGHTEN: 2,
    SCREEN: 3,
    LINEAR_DODGE: 4,
    SUBTRACT: 5,
    // DARKEN: 6, // 추가된 예: 어둡게 적용
    // OVERLAY: 7, // 추가된 예: 오버레이 효과
} as const;
export type BLEND_MODE = typeof BLEND_MODE[keyof typeof BLEND_MODE];

export default BLEND_MODE;
