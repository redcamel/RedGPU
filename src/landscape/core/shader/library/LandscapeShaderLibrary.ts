/**
 * [KO] 대규모 지형(Landscape) 시스템 전용 WGSL 셰이더 조각 라이브러리 모듈입니다.
 * [EN] WGSL shader chunk library module dedicated to the large-scale Landscape system.
 * @packageDocumentation
 */
import LandscapeLayerParams_wgsl from './struct/LandscapeLayerParams.wgsl';
import DrawIndexedIndirectArgs_wgsl from './struct/DrawIndexedIndirectArgs.wgsl';
import FoliageInstance_wgsl from './struct/FoliageInstance.wgsl';
import GrassInstance_wgsl from './struct/GrassInstance.wgsl';
import FoliageLODUniformInfo_wgsl from './struct/FoliageLODUniformInfo.wgsl';
import LandscapeUniforms_wgsl from './struct/LandscapeUniforms.wgsl';
import LandscapeTile_wgsl from './struct/LandscapeTile.wgsl';
import stochasticTiling_wgsl from './tiling/stochasticTiling.wgsl';
import textureDebuggerFragment_wgsl from './debugger/textureDebuggerFragment.wgsl';
import rotateVectorByQuat_wgsl from './math/rotateVectorByQuat.wgsl';
import WGSLParser from '../../../../resources/wgslParser/WGSLParser';

export namespace LandscapeShaderLibrary {
    /**
     * [KO] 지형 및 스캐터 관련 공통 WGSL 구조체 컬렉션
     * [EN] Common WGSL structure collection for terrain and scatter systems
     */
    export namespace struct {
        /**
         * [KO] 지형 스플랫 레이어 파라미터 구조체 (16 floats / 64바이트)
         * [EN] Landscape splat layer parameters struct (16 floats / 64 bytes)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.LandscapeLayerParams;
         * ```
         */
        export const LandscapeLayerParams = LandscapeLayerParams_wgsl;

        /**
         * [KO] WebGPU 간접 드로우 인자 구조체 (indexCount, instanceCount, firstIndex, baseVertex, firstInstance)
         * [EN] WebGPU indirect draw arguments struct (indexCount, instanceCount, firstIndex, baseVertex, firstInstance)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.DrawIndexedIndirectArgs;
         * ```
         */
        export const DrawIndexedIndirectArgs = DrawIndexedIndirectArgs_wgsl;

        /**
         * [KO] 3D 수목 식생(Foliage) 인스턴스 패킹 구조체 (8 x u32 / 32바이트)
         * [EN] 3D foliage instance packed struct (8 x u32 / 32 bytes)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.FoliageInstance;
         * ```
         */
        export const FoliageInstance = FoliageInstance_wgsl;

        /**
         * [KO] 절차적 잔디(Grass) 인스턴스 패킹 구조체 (8 x u32 / 32바이트)
         * [EN] Procedural grass instance packed struct (8 x u32 / 32 bytes)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.GrassInstance;
         * ```
         */
        export const GrassInstance = GrassInstance_wgsl;

        /**
         * [KO] 식생 LOD 거리 임계값 및 서브메시 오프셋 구조체
         * [EN] Foliage LOD distance thresholds and submesh offsets struct
         *
         * ```wgsl
         * #redgpu_include landscape.struct.FoliageLODUniformInfo;
         * ```
         */
        export const FoliageLODUniformInfo = FoliageLODUniformInfo_wgsl;

        /**
         * [KO] 지형 버텍스 및 프래그먼트 셰이더 메인 유니폼 버퍼 구조체 (26개 필드)
         * [EN] Terrain vertex and fragment shader main uniform buffer struct (26 fields)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.LandscapeUniforms;
         * ```
         */
        export const LandscapeUniforms = LandscapeUniforms_wgsl;

        /**
         * [KO] 지형 단일 타일 청크 공간 위치 및 디버그 색상 메타데이터 구조체
         * [EN] Static spatial world position and debug color metadata struct for an individual landscape tile chunk
         *
         * ```wgsl
         * #redgpu_include landscape.struct.LandscapeTile;
         * ```
         */
        export const LandscapeTile = LandscapeTile_wgsl;
    }

    /**
     * [KO] 텍스처 타일링 아티팩트 방지 수학 및 샘플링 모듈
     * [EN] Texture tiling artifact elimination math and sampling modules
     */
    export namespace tiling {
        /**
         * [KO] 삼각 그리드 기반 확률적(Stochastic) 텍스처 타일링 수학 및 해시 함수 (stochasticHash2D, rotate2D, StochasticGridTri, getStochasticGridTri, StochasticSampleResult)
         * [EN] Triangular grid-based stochastic texture tiling math and hash functions
         *
         * ```wgsl
         * #redgpu_include landscape.tiling.stochasticTiling;
         * ```
         */
        export const stochasticTiling = stochasticTiling_wgsl;
    }

    /**
     * [KO] 지형 및 스캐터 관련 공통 수학(Math) 함수 컬렉션
     * [EN] Common math function collection for terrain and scatter systems
     */
    export namespace math {
        /**
         * [KO] 단위 쿼터니언(vec4<f32>)으로 3차원 벡터(vec3<f32>)를 고속 회전하는 함수 (rotateVectorByQuat)
         * [EN] Fast vector rotation function using unit quaternion (vec4<f32>) (rotateVectorByQuat)
         *
         * ```wgsl
         * #redgpu_include landscape.math.rotateVectorByQuat;
         * ```
         */
        export const rotateVectorByQuat = rotateVectorByQuat_wgsl;
    }

    /**
     * [KO] 온스크린 지형 가상 텍스처 디버깅 셰이더 모듈
     * [EN] On-screen terrain virtual texture debugger shader modules
     */
    export namespace debug {
        /**
         * [KO] 전체 화면 쿼드 2D 텍스처 샘플링 프래그먼트 셰이더 (VBT/VNT 등 공통)
         * [EN] Fullscreen quad 2D texture sampling fragment shader (common for VBT/VNT, etc.)
         *
         * ```wgsl
         * #redgpu_include landscape.debug.textureDebuggerFragment;
         * ```
         */
        export const textureDebuggerFragment = textureDebuggerFragment_wgsl;
    }
}

WGSLParser.registerLibrary('landscape', LandscapeShaderLibrary);

export default LandscapeShaderLibrary;
