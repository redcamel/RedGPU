/**
 * [KO] 대규모 지형(Landscape) 시스템 전용 WGSL 셰이더 라이브러리 레지스트리 모듈입니다.
 * [EN] WGSL shader library registry module dedicated to the large-scale Landscape system.
 * @packageDocumentation
 */
import WGSLParser from '../../../../resources/wgslParser/WGSLParser';

/**
 * [KO] 지형 셰이더 라이브러리 네임스페이스 (Phase 4 리팩토링으로 자립화 완료되어 현재는 빈 레지스트리로 유지됩니다).
 * [EN] Landscape shader library namespace (Self-contained after Phase 4 refactoring, maintained as an empty registry).
 */
export const LandscapeShaderLibrary = Object.freeze({});

WGSLParser.registerLibrary('landscape', LandscapeShaderLibrary);

export default LandscapeShaderLibrary;
