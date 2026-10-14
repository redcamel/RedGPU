/**
 * [KO] MSAA, FXAA, TAA 등 안티앨리어싱(Anti-aliasing) 기법과 이를 통합 관리하는 `AntialiasingManager`를 제공합니다.
 * [EN] Provides anti-aliasing techniques such as MSAA, FXAA, and TAA, along with `AntialiasingManager` for unified management.
 *
 * [KO] 화면 해상도 및 렌더링 환경에 맞춰 멀티샘플링(MSAA), 고속 근사 안티앨리어싱(FXAA), 시간적 안티앨리어싱(TAA) 및 대비 적응형 샤프닝(CAS) 파이프라인을 제어할 수 있습니다.
 * [EN] Controls Multi-Sample Anti-Aliasing (MSAA), Fast Approximate Anti-Aliasing (FXAA), Temporal Anti-Aliasing (TAA), and Contrast Adaptive Sharpening (CAS) pipelines tailored to screen resolution and rendering environments.
 *
 * @packageDocumentation
 */
import AntialiasingManager from "./AntialiasingManager";
import FXAA from "./fxaa/FXAA";
import TAA from "./taa/TAA";

export {
    AntialiasingManager,
    FXAA,
    TAA
}