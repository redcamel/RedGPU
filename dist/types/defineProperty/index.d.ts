/**
 * [KO] 클래스 프로토타입에 GPU 유니폼 버퍼 및 리소스와 연동되는 동적 프로퍼티를 정의하는 헬퍼 함수들과 설정 인터페이스를 제공합니다.
 * [EN] Provides helper functions and configuration interfaces for defining dynamic properties linked to GPU uniform buffers and resources on class prototypes.
 * @packageDocumentation
 */
import defineBoolean, { DefineBooleanInfo } from "./funcs/defineBoolean";
import defineColorRGB, { DefineColorRGBInfo } from "./funcs/color/defineColorRGB";
import defineColorRGBA, { DefineColorRGBAInfo } from "./funcs/color/defineColorRGBA";
import defineCubeTexture, { DefineCubeTextureInfo } from "./funcs/texture/defineCubeTexture";
import defineNumber, { DefineNumberInfo } from "./funcs/number/defineNumber";
import definePositiveNumber, { DefinePositiveNumberInfo } from "./funcs/number/definePositiveNumber";
import defineSampler, { DefineSamplerInfo } from "./funcs/texture/defineSampler";
import defineTexture, { DefineTextureInfo } from "./funcs/texture/defineTexture";
import defineUint, { DefineUintInfo } from "./funcs/number/defineUint";
import defineVector2, { DefineVector2Info } from "./funcs/vector/defineVector2";
import defineVector3, { DefineVector3Info } from "./funcs/vector/defineVector3";
import defineVector4, { DefineVector4Info } from "./funcs/vector/defineVector4";
export { defineBoolean, defineColorRGB, defineColorRGBA, defineCubeTexture, defineNumber, defineSampler, definePositiveNumber, defineTexture, defineUint, defineVector2, defineVector3, defineVector4, DefineBooleanInfo, DefineColorRGBInfo, DefineColorRGBAInfo, DefineNumberInfo, DefinePositiveNumberInfo, DefineUintInfo, DefineCubeTextureInfo, DefineSamplerInfo, DefineTextureInfo, DefineVector2Info, DefineVector3Info, DefineVector4Info, };
