/**
 * [KO] RedGPU 라이트 모듈입니다.
 * [EN] RedGPU Light module.
 *
 * [KO] 다양한 광원(AmbientLight, DirectionalLight, PointLight, SpotLight)과 이를 통합 관리하는 LightManager를 제공합니다.
 * [EN] Provides various light sources (AmbientLight, DirectionalLight, PointLight, SpotLight) and LightManager to manage them.
 *
 * [KO] 각 광원 속성을 세밀하게 제어하여 씬(Scene)의 조명 효과와 분위기를 연출할 수 있습니다.
 * [EN] You can create lighting effects and atmosphere in the scene by finely controlling the properties of each light source.
 *
 * @packageDocumentation
 */
import LightManager from "./LightManager";
import AmbientLight from "./lights/AmbientLight";
import DirectionalLight from "./lights/DirectionalLight";
import PointLight from "./lights/PointLight";
import SpotLight from "./lights/SpotLight";

export * as Core from "./core";
export {
    AmbientLight,
    PointLight,
    SpotLight,
    DirectionalLight,
    LightManager
}