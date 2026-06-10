/**
 * [KO] RedGPU의 기능을 확장하는 다양한 플러그인들을 제공합니다.
 * [EN] Provides various plugins that extend the functionality of RedGPU.
 *
 * [KO] 물리 엔진 통합, 특수 효과 등 엔진 코어 외의 추가 기능을 플러그인 형태로 포함하고 있습니다. 이를 통해 코어 라이브러리의 경량화를 유지하면서도 필요에 따라 강력한 확장 기능을 선택적으로 사용할 수 있습니다.
 * [EN] Includes additional features outside the engine core, such as physics engine integration and special effects, in the form of plugins. This allows for powerful extensions to be used selectively while keeping the core library lightweight.
 *
 * @packageDocumentation
 */
export * as RapierPhysics from "./rapier/index";
