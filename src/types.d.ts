/**
 * [KO] WGSL 셰이더 파일(`*.wgsl`)을 문자열로 가져오기 위한 모듈 선언입니다.
 * [EN] Module declaration for importing WGSL shader files (`*.wgsl`) as strings.
 *
 * @packageDocumentation
 */
declare module '*.wgsl' {
    const shaderSource: string;
    export default shaderSource;
}
