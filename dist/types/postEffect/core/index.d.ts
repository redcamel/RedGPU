/**
 * [KO] 단일/다중 패스 후처리 추상 클래스, 셰이더 코드 생성 헬퍼, 텍스처 풀 등 후처리 코어 구성을 제공합니다.
 * [EN] Provides core post-processing components including single/multi-pass abstract classes, shader code generation helpers, and texture pool.
 * @packageDocumentation
 */
import AMultiPassPostEffect from "./AMultiPassPostEffect";
import ASinglePassPostEffect from "./ASinglePassPostEffect";
import createBasicPostEffectCode from "./createBasicPostEffectCode";
import { IPostEffectResult, IPostEffectSourceConfig } from "./types";
import PostEffectTexturePool from "./PostEffectTexturePool";
export { AMultiPassPostEffect, ASinglePassPostEffect, createBasicPostEffectCode, IPostEffectResult, IPostEffectSourceConfig, PostEffectTexturePool };
