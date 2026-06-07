import defineBoolean from "./funcs/defineBoolean";
import defineColorRGB from "./funcs/color/defineColorRGB";
import defineColorRGBA from "./funcs/color/defineColorRGBA";
import defineCubeTexture from "./funcs/texture/defineCubeTexture";
import defineNumber from "./funcs/number/defineNumber";
import definePositiveNumber from "./funcs/number/definePositiveNumber";
import defineSampler from "./funcs/texture/defineSampler";
import defineTexture from "./funcs/texture/defineTexture";
import defineUint from "./funcs/number/defineUint";
import defineVector2 from "./funcs/vector/defineVector2";
import defineVector3 from "./funcs/vector/defineVector3";
import defineVector4 from "./funcs/vector/defineVector4";
import * as Core from "./core";

/**
 * [KO] RedGPU의 통합 속성 정의 시스템입니다.
 * 정의된 자바스크립트 속성의 값이 변경되면 관련 GPU 유니폼 버퍼 및 렌더 파이프라인 데이터와 자동으로 연동되어 GPU 측에 즉각적으로 반영됩니다.
 * [EN] Integrated property definition system for RedGPU.
 * When the defined JavaScript property value changes, it automatically links and synchronizes with the GPU uniform buffer and render pipeline data to immediately reflect changes on the GPU side.
 *
 * @namespace DefineGPUProperty
 */
const DefineGPUProperty = {
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
    Core
}


Object.freeze(DefineGPUProperty)
export default DefineGPUProperty
