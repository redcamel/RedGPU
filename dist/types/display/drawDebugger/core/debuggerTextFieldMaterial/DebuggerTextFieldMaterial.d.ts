import RedGPUContext from "../../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
/**
 * [KO] 디버거 텍스트 필드 머티리얼의 텍스처 및 샘플러 속성을 정의하는 인터페이스입니다.
 * [EN] Interface defining texture and sampler properties for a debugger text field material.
 *
 * @category Debugger
 */
interface DebuggerTextFieldMaterial {
    /**
     * [KO] 텍스트 비트맵 디퓨즈 텍스처
     * [EN] Text bitmap diffuse texture
     */
    diffuseTexture: BitmapTexture;
    /**
     * [KO] 디퓨즈 텍스처 샘플러
     * [EN] Diffuse texture sampler
     */
    diffuseTextureSampler: Sampler;
}
/**
 * [KO] 조명 디버거의 아이콘 라벨(`TextField3D`)을 LDR 오버레이 패스(`rgba8unorm` 단일 타겟)에 렌더링하기 위한 전용 머티리얼 클래스입니다.
 * [EN] Dedicated material class for rendering light debugger icon labels (`TextField3D`) in the LDR overlay pass (`rgba8unorm` single target).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부 디버거에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by internal system debuggers.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Debugger
 */
declare class DebuggerTextFieldMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] DebuggerTextFieldMaterial 인스턴스를 생성합니다.
     * [EN] Creates a DebuggerTextFieldMaterial instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param diffuseTexture -
     * [KO] 텍스트 필드에 적용할 비트맵 텍스처 (선택)
     * [EN] Bitmap texture to apply to the text field (optional)
     * @param name -
     * [KO] 머티리얼 이름 (선택)
     * [EN] Material name (optional)
     */
    constructor(redGPUContext: RedGPUContext, diffuseTexture?: BitmapTexture, name?: string);
    /**
     * [KO] G-Buffer 다중 렌더 타겟(MRT)을 제외하고 단일 `rgba8unorm` 타겟만 반환하는 디버거 전용 프래그먼트 렌더 상태를 생성합니다.
     * [EN] Creates a debugger-dedicated fragment render state that returns only a single `rgba8unorm` target, excluding G-Buffer multiple render targets (MRT).
     *
     * @param entryPoint -
     * [KO] 프래그먼트 셰이더 엔트리 포인트 함수 이름 (기본값: `'main'`)
     * [EN] Fragment shader entry point function name (default: `'main'`)
     * @returns
     * [KO] 구성된 `GPUFragmentState` 객체
     * [EN] Configured `GPUFragmentState` object
     */
    getFragmentRenderState(entryPoint?: string): GPUFragmentState;
}
export default DebuggerTextFieldMaterial;
