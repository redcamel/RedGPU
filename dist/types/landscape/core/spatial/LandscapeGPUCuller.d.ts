import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] 컴퓨트 셰이더를 사용하여 지형(Landscape) 타일의 프러스텀 컬링, HZB 오클루전 컬링 및 LOD 선택을 수행하는 클래스입니다.
 * [EN] Class that performs frustum culling, HZB occlusion culling, and LOD selection for Landscape tiles using a compute shader.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class LandscapeGPUCuller extends RedGPUObject {
    #private;
    /**
     * [KO] `LandscapeGPUCuller` 인스턴스를 생성하고 GPU 리소스를 초기화합니다.
     * [EN] Creates a `LandscapeGPUCuller` instance and initializes GPU resources.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 타일 버퍼, 인다이렉트 드로우 버퍼 및 HZB 텍스처를 바인딩하여 컬링용 바인드 그룹을 갱신합니다.
     * [EN] Updates the culling bind group by binding tile buffers, indirect draw buffer, and HZB texture.
     *
     * @param allTilesBuffer -
     * [KO] 전체 타일 정적 정보가 담긴 GPU 스토리지 버퍼
     * [EN] GPU storage buffer containing static information for all tiles
     * @param visibleTilesBuffer -
     * [KO] 가시 타일 출력 결과가 기록될 GPU 스토리지 버퍼
     * [EN] GPU storage buffer where visible tile output results will be written
     * @param indirectDrawBuffer -
     * [KO] LOD별 인다이렉트 드로우 인자가 기록될 GPU 버퍼
     * [EN] GPU buffer where indirect draw arguments per LOD will be written
     * @param hzbTextureView -
     * [KO] 계층적 Z-버퍼(HZB) 텍스처 뷰 (선택)
     * [EN] Hierarchical Z-Buffer (HZB) texture view (optional)
     * @param hzbSampler -
     * [KO] HZB 샘플링용 GPU 샘플러 (선택)
     * [EN] GPU sampler for HZB sampling (optional)
     */
    updateBindGroup(allTilesBuffer: GPUBuffer, visibleTilesBuffer: GPUBuffer, indirectDrawBuffer: GPUBuffer, hzbTextureView?: GPUTextureView | null, hzbSampler?: GPUSampler | null): void;
    /**
     * [KO] 카메라 위치, 프러스텀 평면, LOD 거리 임계값 등 컬링 컴퓨트 셰이더의 유니폼 데이터를 갱신합니다.
     * [EN] Updates the uniform data for the culling compute shader, including camera position, frustum planes, and LOD distance thresholds.
     *
     * @param camX -
     * [KO] 카메라의 월드 X 좌표
     * [EN] Camera world X coordinate
     * @param camY -
     * [KO] 카메라의 월드 Y 좌표
     * [EN] Camera world Y coordinate
     * @param camZ -
     * [KO] 카메라의 월드 Z 좌표
     * [EN] Camera world Z coordinate
     * @param lodMaxLevel -
     * [KO] 최대 LOD 레벨 수
     * [EN] Maximum number of LOD levels
     * @param tileSizeX -
     * [KO] 단일 타일의 가로(X) 월드 크기
     * [EN] World width (X) of a single tile
     * @param tileSizeZ -
     * [KO] 단일 타일의 세로(Z) 월드 크기
     * [EN] World depth (Z) of a single tile
     * @param heightScale -
     * [KO] 지형 최대 높이 스케일
     * [EN] Maximum height scale of the terrain
     * @param tileCount -
     * [KO] 전체 타일 컴포넌트 개수
     * [EN] Total number of tile components
     * @param frustumPlanes -
     * [KO] 6개 프러스텀 평면 데이터 배열 (총 24개 float) 또는 `null`
     * [EN] Array of 6 frustum plane data (24 floats total) or `null`
     * @param lodDistancesSq -
     * [KO] LOD 레벨별 거리 제곱(`distance^2`) 배열
     * [EN] Array of squared distances (`distance^2`) per LOD level
     * @param tanHalfFOV -
     * [KO] 카메라 수직 시야각 절반의 탄젠트 값 (`tan(fov / 2)`)
     * [EN] Tangent of half the camera vertical field of view (`tan(fov / 2)`)
     * @param lodMetric -
     * [KO] 화면 공간 오차 기반 LOD 산출 메트릭 값
     * [EN] Metric value for screen-space error based LOD calculation
     * @param useHZB -
     * [KO] HZB 오클루전 컬링 활성화 여부
     * [EN] Whether HZB occlusion culling is enabled
     * @param viewProjectionMatrix -
     * [KO] 뷰-프로젝션(`4x4`) 행렬 데이터 또는 `null`
     * [EN] View-projection (`4x4`) matrix data or `null`
     */
    updateUniforms(camX: number, camY: number, camZ: number, lodMaxLevel: number, tileSizeX: number, tileSizeZ: number, heightScale: number, tileCount: number, frustumPlanes: Float32Array | null, lodDistancesSq: Float32Array, tanHalfFOV?: number, lodMetric?: number, useHZB?: boolean, viewProjectionMatrix?: Float32Array | null): void;
    /**
     * [KO] 주어진 컴퓨트 패스 인코더에 지형 타일 컬링 워크그룹을 디스패치합니다.
     * [EN] Dispatches terrain tile culling workgroups onto the given compute pass encoder.
     *
     * @param computePass -
     * [KO] 활성화된 GPU 컴퓨트 패스 인코더
     * [EN] Active GPU compute pass encoder
     * @param tileCount -
     * [KO] 컬링 대상 전체 타일 개수
     * [EN] Total number of tiles to cull
     */
    dispatchPass(computePass: GPUComputePassEncoder, tileCount: number): void;
    /**
     * [KO] 컬링기가 점유한 GPU 유니폼 버퍼 및 파이프라인 참조를 해제합니다.
     * [EN] Releases the GPU uniform buffer and pipeline references held by the culler.
     */
    destroy(): void;
}
export default LandscapeGPUCuller;
