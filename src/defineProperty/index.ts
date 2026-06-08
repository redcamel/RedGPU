/**
 * @packageDocumentation
 *
 * RedGPU의 GPU 속성 정의 시스템 (`DefineGPUProperty`) 모듈입니다.
 *
 * 이 모듈은 JavaScript 클래스의 프로토타입에 GPU와 연동되는 속성을 동적으로 정의하기 위한
 * 헬퍼 함수들의 집합입니다. 속성 값이 변경되면 {@link updateTargetUniform} 내부 유틸리티를 통해
 * GPU 유니폼 버퍼에 즉각 반영됩니다.
 *
 * @remarks
 * **[KO]**
 * - 모든 `define*` 함수는 `Object.defineProperty`를 사용해 getter/setter 쌍을 대상 클래스의 프로토타입에 주입합니다.
 * - 단일 설정 객체 또는 배열 형태 모두 지원합니다.
 *
 * **[EN]**
 * - All `define*` functions inject getter/setter pairs onto the target class prototype via `Object.defineProperty`.
 * - Both a single config object and an array form are supported.
 *
 * @example
 * ```typescript
 * import RedGPU from 'RedGPU';
 *
 * // 커스텀 Material 클래스에 GPU 연동 속성을 추가합니다.
 * RedGPU.DefineGPUProperty.defineNumber(MyMaterial, { key: 'opacity', value: 1.0, min: 0, max: 1 });
 * RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, { key: 'albedo', value: '#ffffff' });
 * RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, { key: 'useAlphaTest', value: false });
 * ```
 *
 */

import defineBoolean, {DefineBooleanInfo} from "./funcs/defineBoolean";
import defineColorRGB, {DefineColorRGBInfo} from "./funcs/color/defineColorRGB";
import defineColorRGBA, {DefineColorRGBAInfo} from "./funcs/color/defineColorRGBA";
import defineCubeTexture, {DefineCubeTextureInfo} from "./funcs/texture/defineCubeTexture";
import defineNumber, {DefineNumberInfo} from "./funcs/number/defineNumber";
import definePositiveNumber, {DefinePositiveNumberInfo} from "./funcs/number/definePositiveNumber";
import defineSampler, {DefineSamplerInfo} from "./funcs/texture/defineSampler";
import defineTexture, {DefineTextureInfo} from "./funcs/texture/defineTexture";
import defineUint, {DefineUintInfo} from "./funcs/number/defineUint";
import defineVector2, {DefineVector2Info} from "./funcs/vector/defineVector2";
import defineVector3, {DefineVector3Info} from "./funcs/vector/defineVector3";
import defineVector4, {DefineVector4Info} from "./funcs/vector/defineVector4";

export {
    defineBoolean,
    defineColorRGB,
    defineColorRGBA,
    defineCubeTexture,
    defineNumber,
    defineSampler,
    definePositiveNumber,
    defineTexture,
    defineUint,
    defineVector2,
    defineVector3,
    defineVector4,

    DefineBooleanInfo,
    DefineColorRGBInfo,
    DefineColorRGBAInfo,
    DefineNumberInfo,
    DefinePositiveNumberInfo,
    DefineUintInfo,
    DefineCubeTextureInfo,
    DefineSamplerInfo,
    DefineTextureInfo,
    DefineVector2Info,
    DefineVector3Info,
    DefineVector4Info,
}

