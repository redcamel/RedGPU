/**
 * [KO] 물리 기반 피사계 심도(`DOF`) 파이프라인의 광학 기본값, 유효 범위, 및 내부 패스 동작 모드 상수를 정의하는 단일 진실 공급원(SSOT) 설정 객체입니다.
 * [EN] Single Source of Truth (SSOT) configuration object defining optical defaults, valid ranges, and internal pass mode constants for the physical Depth of Field (`DOF`) pipeline.
 *
 * @category PostEffect
 */
const DOF_CONFIG = {
    DEFAULT_FOCUS_DISTANCE: 15.0,
    MIN_FOCUS_DISTANCE: 0.1,
    MAX_FOCUS_DISTANCE: 10000.0,

    DEFAULT_APERTURE: 2.0,
    MIN_APERTURE: 0.5,
    MAX_APERTURE: 32.0,

    DEFAULT_FOCAL_LENGTH: 65.0,
    MIN_FOCAL_LENGTH: 12.0,
    MAX_FOCAL_LENGTH: 300.0,

    DEFAULT_BLADE_COUNT: 6,
    MIN_BLADE_COUNT: 0,
    MAX_BLADE_COUNT: 9,

    DEFAULT_BOKEH_BRIGHTNESS: 1.5,
    MIN_BOKEH_BRIGHTNESS: 0.0,
    MAX_BOKEH_BRIGHTNESS: 5.0,

    PASS_MODE: {
        BACKGROUND: 0,
        FOREGROUND: 1,
    },

    AF_HISTORY_MODE: {
        NONE: 0,
        VALID: 1,
        SEED_MANUAL: 2,
    },
} as const;

Object.freeze(DOF_CONFIG.PASS_MODE);
Object.freeze(DOF_CONFIG.AF_HISTORY_MODE);
Object.freeze(DOF_CONFIG);
export default DOF_CONFIG;
