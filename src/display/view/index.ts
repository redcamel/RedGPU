/**
 * [KO] 2D 및 3D 렌더링 영역을 정의하고 카메라 투영, 포스트 이펙트, 리사이즈 처리 등 뷰포트별 렌더링 설정을 관리하는 뷰(View) 시스템을 제공합니다.
 * [EN] Provides a view system for defining 2D and 3D rendering areas and managing per-viewport rendering settings such as camera projection, post-effects, and resize handling.
 * @packageDocumentation
 */
import * as CoreView from "./core";
import View2D from "./View2D";
import View3D from "./View3D";

export {
    CoreView,
    View2D,
    View3D
}
