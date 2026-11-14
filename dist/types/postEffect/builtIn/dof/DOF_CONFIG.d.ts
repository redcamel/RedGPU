/**
 * [KO] 물리 기반 피사계 심도(`DOF`) 파이프라인의 광학 기본값, 유효 범위, 및 내부 패스 동작 모드 상수를 정의하는 단일 진실 공급원(SSOT) 설정 객체입니다.
 * [EN] Single Source of Truth (SSOT) configuration object defining optical defaults, valid ranges, and internal pass mode constants for the physical Depth of Field (`DOF`) pipeline.
 *
 * @category PostEffect
 */
declare const DOF_CONFIG: {
    readonly DEFAULT_FOCUS_DISTANCE: 10;
    readonly MIN_FOCUS_DISTANCE: 0.1;
    readonly MAX_FOCUS_DISTANCE: 10000;
    readonly DEFAULT_APERTURE: 2;
    readonly MIN_APERTURE: 0.5;
    readonly MAX_APERTURE: 32;
    readonly DEFAULT_FOCAL_LENGTH: 65;
    readonly MIN_FOCAL_LENGTH: 12;
    readonly MAX_FOCAL_LENGTH: 300;
    readonly DEFAULT_BLADE_COUNT: 6;
    readonly MIN_BLADE_COUNT: 0;
    readonly MAX_BLADE_COUNT: 9;
    readonly DEFAULT_BOKEH_BRIGHTNESS: 1.5;
    readonly MIN_BOKEH_BRIGHTNESS: 0;
    readonly MAX_BOKEH_BRIGHTNESS: 5;
    readonly PASS_MODE: {
        readonly BACKGROUND: 0;
        readonly FOREGROUND: 1;
    };
    readonly AF_HISTORY_MODE: {
        readonly NONE: 0;
        readonly VALID: 1;
        readonly SEED_MANUAL: 2;
    };
};
export default DOF_CONFIG;
