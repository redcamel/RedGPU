/**
 * [KO] 렌더링 영역을 정의하고 관리하는 뷰(View) 시스템을 제공합니다.
 * [EN] Provides a view system for defining and managing rendering areas.
 *
 * [KO] 화면의 특정 영역에 씬을 배치하고, 카메라 투영, 포스트 이펙트, 리사이즈 처리 등 개별 뷰포트별 렌더링 설정을 담당합니다.
 * [EN] It places scenes in specific areas of the screen and handles rendering settings for each viewport, such as camera projection, post-effects, and resize processing.
 *
 * @packageDocumentation
 */
import * as CoreView from "./core";
import View2D from "./View2D";
import View3D from "./View3D";
export { CoreView, View2D, View3D };
