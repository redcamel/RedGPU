import View3D from "../display/view/View3D";
import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";
import AMultiPassPostEffect from "./core/AMultiPassPostEffect";
import ASinglePassPostEffect from "./core/ASinglePassPostEffect";
import SSAO from "./effects/ssao/SSAO";
import SSR from "./effects/ssr/SSR";
import ToneMapping from "./toneMapping/ToneMapping";
/**
 * 후처리 이펙트(PostEffect) 관리 클래스입니다.
 * 이펙트 추가/제거, 렌더링, 시스템 유니폼 관리, 비디오 메모리 계산 등 후처리 파이프라인을 통합적으로 제어합니다.
 * @category Core
 *
 */
declare class PostEffectManager {
    #private;
    get toneMapping(): ToneMapping;
    set toneMapping(value: ToneMapping);
    constructor(view: View3D);
    get useSSAO(): boolean;
    set useSSAO(value: boolean);
    get ssao(): SSAO;
    get useSSR(): boolean;
    set useSSR(value: boolean);
    get ssr(): SSR;
    get postEffectSystemUniformBuffer(): UniformBuffer;
    get view(): View3D;
    get effectList(): Array<ASinglePassPostEffect | AMultiPassPostEffect>;
    get videoMemorySize(): number;
    addEffect(v: ASinglePassPostEffect | AMultiPassPostEffect): void;
    addEffectAt(v: ASinglePassPostEffect | AMultiPassPostEffect): void;
    getEffectAt(index: number): ASinglePassPostEffect | AMultiPassPostEffect;
    removeEffect(v: ASinglePassPostEffect | AMultiPassPostEffect): void;
    removeEffectAt(v: ASinglePassPostEffect | AMultiPassPostEffect): void;
    removeAllEffect(): void;
    render(): {
        texture: GPUTexture;
        textureView: GPUTextureView;
    };
    clear(): void;
}
export default PostEffectManager;
