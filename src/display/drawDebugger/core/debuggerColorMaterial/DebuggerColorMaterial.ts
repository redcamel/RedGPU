import ColorRGB from "../../../../color/ColorRGB";
import RedGPUContext from "../../../../context/RedGPUContext";
import defineColorRGB from "../../../../defineProperty/funcs/color/defineColorRGB";
import ABaseMaterial from "../../../../material/core/ABaseMaterial";
import fragmentModuleSource from "./fragment.wgsl";

/**
 * [KO] DebuggerColorMaterial의 동적 색상 속성 인터페이스입니다.
 * [EN] Dynamic color property interface for DebuggerColorMaterial.
 *
 * @category Debugger
 */
interface DebuggerColorMaterial {
    /**
     * [KO] 디버거 머티리얼의 단색 컬러 (ColorRGB)
     * [EN] Solid color of the debugger material (ColorRGB)
     */
    color: ColorRGB;
}

/**
 * [KO] 디버거 기즈모 및 와이어프레임을 LDR 오버레이 패스(`rgba8unorm` 단일 타겟)에 렌더링하기 위한 전용 머티리얼 클래스입니다.
 * [EN] Dedicated material class for rendering debugger gizmos and wireframes in the LDR overlay pass (`rgba8unorm` single target).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부 디버거에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by internal system debuggers.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Debugger
 */
class DebuggerColorMaterial extends ABaseMaterial {
    /**
     * [KO] DebuggerColorMaterial 인스턴스를 생성합니다.
     * [EN] Creates a DebuggerColorMaterial instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param color -
     * [KO] HEX 형식의 기본 색상 문자열 (기본값: `'#fff'`)
     * [EN] Base color string in HEX format (default: `'#fff'`)
     */
    constructor(redGPUContext: RedGPUContext, color: string = '#fff') {
        super(
            redGPUContext,
            'DEBUGGER_COLOR_MATERIAL',
            fragmentModuleSource,
            2
        );
        this.initGPURenderInfos();
        this.color.setColorByHEX(color);
    }

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
    getFragmentRenderState(entryPoint: string = 'main'): GPUFragmentState {
        return {
            module: this.gpuRenderInfo.fragmentShaderModule,
            entryPoint,
            targets: [
                {
                    format: 'rgba8unorm',
                    blend: {
                        color: this.blendColorState.state,
                        alpha: this.blendAlphaState.state
                    },
                    writeMask: this.writeMaskState,
                },
            ]
        };
    }
}

Object.defineProperty(DebuggerColorMaterial.prototype, 'isBuiltInMaterial', {
    value: true,
    writable: false
});
Object.defineProperty(DebuggerColorMaterial.prototype, 'isDebuggerMaterial', {
    value: true,
    writable: false
});
defineColorRGB(DebuggerColorMaterial, [
    {key: 'color'},
]);
Object.freeze(DebuggerColorMaterial);
export default DebuggerColorMaterial;
