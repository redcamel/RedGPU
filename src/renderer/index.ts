/**
 * [KO] 렌더링 루프 제어, 뷰별 렌더 패스 실행 및 시스템 유니폼 갱신을 담당하는 렌더러 모듈을 제공합니다.
 * [EN] Provides the renderer module responsible for rendering loop control, per-view render pass execution, and system uniform updates.
 *
 * @packageDocumentation
 */
import Renderer from "./Renderer";
import SystemUniformUpdater from "./helperFunc/SystemUniformUpdater";

export {
    Renderer,
    SystemUniformUpdater,
}
