/**
 * [KO] 3D 빌보드 스프라이트 및 2D 스프라이트 시스템을 제공합니다.
 * [EN] Provides 3D billboard sprite and 2D sprite systems.
 *
 * [KO] 카메라를 항상 마주보는 빌보드 효과와 2D 평면 환경에 최적화된 드로잉 기능을 지원하며, 스프라이트 시트 애니메이션 시스템도 포함합니다.
 * [EN] Supports billboard effects that always face the camera and drawing functions optimized for 2D flat environments, including a sprite sheet animation system.
 *
 * @packageDocumentation
 */
import Sprite2D from "./sprite2D/Sprite2D";
import Sprite3D from "./sprite3D/Sprite3D";
export * from "./spriteSheets";
export { Sprite2D, Sprite3D, };
