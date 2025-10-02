/**
 * 다양한 광원(AmbientLight, DirectionalLight, PointLight, SpotLight)과 LightManager를 제공합니다.
 *
 * 각 광원 및 라이트 매니저를 통해 씬(Scene)의 조명 효과, 광원 배치, 광원 속성 제어 등 다양한 라이팅 연출과 광원 관리를 세밀하게 제어할 수 있습니다.
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
