/**
 * [KO] 3D 씬의 광원 효과를 연출하기 위한 다양한 조명(AmbientLight, DirectionalLight, PointLight, SpotLight)과 조명 관리 시스템을 제공합니다.
 * [EN] Provides various lights (AmbientLight, DirectionalLight, PointLight, SpotLight) and light management systems for lighting effects in 3D scenes.
 * @packageDocumentation
 */
import AmbientLight from "./lights/AmbientLight";
import DirectionalLight from "./lights/DirectionalLight";
import PointLight from "./lights/PointLight";
import SpotLight from "./lights/SpotLight";
import LightManager from "./LightManager";

export * as Core from "./core";
export {
    AmbientLight,
    PointLight,
    SpotLight,
    DirectionalLight,
    LightManager,
}