/**
 * [KO] 격자 구조의 텍스처를 이용한 스프라이트 시트 애니메이션 시스템을 제공합니다.
 * [EN] Provides a sprite sheet animation system using grid-structured textures.
 *
 * [KO] 대규모 애니메이션 프레임을 효율적으로 관리하고, 2D 및 3D(빌보드) 환경에서 부드러운 프레임 재생 기능을 지원합니다.
 * [EN] It efficiently manages large-scale animation frames and supports smooth frame playback in 2D and 3D (billboard) environments.
 *
 * @packageDocumentation
 */
import * as CoreSpriteSheet from "./core"
import SpriteSheet2D from "./spriteSheet2D/SpriteSheet2D";
import SpriteSheet3D from "./spriteSheet3D/SpriteSheet3D";
import SpriteSheetInfo from "./SpriteSheetInfo";

export {SpriteSheet2D, SpriteSheet3D, SpriteSheetInfo, CoreSpriteSheet};
