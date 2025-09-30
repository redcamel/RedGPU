/**
 * 다양한 머티리얼(Bitmap, Color, Phong 등)과 관련 상수(BLEND_MODE, COMPOSITE_MODE, TINT_BLEND_MODE)를 제공합니다.
 *
 * 각 머티리얼 클래스와 상수를 통해 다양한 렌더링 효과, 머티리얼 속성 제어, 블렌딩/합성 모드 설정 등 세밀한 머티리얼 연출과 관리를 할 수 있습니다.
 *
 * @packageDocumentation
 */

import BitmapMaterial from "./bitmapMaterial/BitmapMaterial";
import BLEND_MODE from "./BLEND_MODE";
import ColorMaterial from "./colorMaterial/ColorMaterial";
import COMPOSITE_MODE from "./COMPOSITE_MODE";
import PBRMaterial from "./pbrMaterial/PBRMaterial";
import PhongMaterial from "./phongMaterial/PhongMaterial";

import TINT_BLEND_MODE from "./TINT_BLEND_MODE";

export * from './core'

export {
	TINT_BLEND_MODE,
	BLEND_MODE,
	COMPOSITE_MODE,
	ColorMaterial,
	PhongMaterial,
	BitmapMaterial,
	PBRMaterial
}
