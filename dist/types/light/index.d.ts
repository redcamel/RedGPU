/**
 * [KO] 3D 씬의 광원(`AmbientLight`, `DirectionalLight`, `PointLight`, `SpotLight`) 클래스와 조명 매니저(`LightManager`)를 제공합니다.
 * [EN] Provides 3D scene light classes (`AmbientLight`, `DirectionalLight`, `PointLight`, `SpotLight`) and the light manager (`LightManager`).
 * @packageDocumentation
 */
import AmbientLight from "./lights/AmbientLight";
import DirectionalLight from "./lights/DirectionalLight";
import PointLight from "./lights/PointLight";
import SpotLight from "./lights/SpotLight";
import LightManager from "./LightManager";
export * as Core from "./core";
export { AmbientLight, PointLight, SpotLight, DirectionalLight, LightManager, };
