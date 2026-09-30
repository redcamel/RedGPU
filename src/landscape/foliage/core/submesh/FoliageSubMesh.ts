/**
 * [KO] 식생 개별 서브메시 및 머티리얼 바인딩/유니폼 관리 모듈입니다.
 * [EN] Foliage individual sub-mesh and material binding/uniform management module.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import Mesh from "../../../../display/mesh/Mesh";
import Geometry from "../../../../geometry/Geometry";
import ScatterSubMesh, {type ScatterSubMeshInitOptions} from "../../../core/scatter/ScatterSubMesh";
import FoliagePipelineRegistry, {type FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";

/**
 * [KO] Foliage 렌더 패스 유형 ('depthPrepass' 또는 'main')
 * [EN] Foliage render pass type ('depthPrepass' or 'main')
 */
export type FoliageRenderPassType = 'depthPrepass' | 'main';

/**
 * [KO] FoliageSubMesh 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for FoliageSubMesh.
 */
export interface FoliageSubMeshInitOptions extends ScatterSubMeshInitOptions {
    /**
     * [KO] 소스 메쉬 인스턴스
     * [EN] Source mesh instance
     */
    mesh: Mesh;
    /**
     * [KO] 서브메시 지오메트리
     * [EN] Sub-mesh geometry
     */
    geometry: Geometry;
    /**
     * [KO] 서브메시 머티리얼
     * [EN] Sub-mesh material
     */
    material: any;
    /**
     * [KO] 인덱스 개수
     * [EN] Index count
     */
    indexCount: number;
    /**
     * [KO] 정점 개수
     * [EN] Vertex count
     */
    vertexCount: number;
    /**
     * [KO] 인덱스 버퍼 사용 여부
     * [EN] Whether indexed buffer is used
     */
    isIndexed: boolean;
    /**
     * [KO] 인덱스 포맷 (기본값: 'uint32')
     * [EN] Index format (default: 'uint32')
     */
    indexFormat?: GPUIndexFormat;
    /**
     * [KO] 정점 스트라이드 바이트 수
     * [EN] Vertex stride in bytes
     */
    strideBytes: number;
    /**
     * [KO] 밑둥 피벗 보정 바닥 오프셋
     * [EN] Bottom offset relative to pivot
     */
    bottomOffset?: number;
    /**
     * [KO] 상대 모델 변환 행렬
     * [EN] Relative model transform matrix
     */
    relativeModelMatrix: mat4;
    /**
     * [KO] 상대 법선 변환 행렬
     * [EN] Relative normal transform matrix
     */
    relativeNormalMatrix: mat4;
    /**
     * [KO] 버텍스 셰이더 유니폼 버퍼 (208 bytes)
     * [EN] Vertex shader uniform buffer (208 bytes)
     */
    vertexUniformBuffer: GPUBuffer;
    /**
     * [KO] 버텍스 셰이더 유니폼 바인드 그룹
     * [EN] Vertex shader uniform bind group
     */
    vertexUniformBindGroup: GPUBindGroup;
    /**
     * [KO] 소속 LOD 레벨 인덱스
     * [EN] Associated LOD level index
     */
    lodIndex: number;

    /**
     * [KO] 뎁스 프리패스 렌더링 대상 여부
     * [EN] Whether rendering in depth prepass
     */
    isDepthPrepass: boolean;
    /**
     * [KO] 메인 불투명/마스크 패스 렌더링 대상 여부
     * [EN] Whether rendering in main opaque/masked pass
     */
    isMainOpaqueOrMasked: boolean;
    /**
     * [KO] 알파 마스킹(Cutout) 사용 여부
     * [EN] Whether alpha masking (cutout) is used
     */
    isMasked?: boolean;
    /**
     * [KO] 메인 뎁스 패스 모드
     * [EN] Main depth pass mode
     */
    mainDepthMode: FoliageDepthPassMode;
    /**
     * [KO] 옥타헤드럴 임포스터 메쉬 여부
     * [EN] Whether this is an octahedral impostor mesh
     */
    isImpostor?: boolean;
    /**
     * [KO] 그림자 수신 여부
     * [EN] Whether this sub-mesh receives shadows
     */
    receiveShadow?: boolean;

    /**
     * [KO] 인스턴스 버퍼 시작 오프셋
     * [EN] Instance buffer start offset
     */
    instanceBufferOffset?: number;
    /**
     * [KO] 간접 드로우 인다이렉트 버퍼 시작 바이트 오프셋
     * [EN] Indirect draw buffer start byte offset
     */
    indirectOffsetBytes?: number;
}

/**
 * [KO] ScatterSubMesh를 상속받아 Foliage 고유의 머티리얼, 유니폼 바인딩(바람, 지면 블렌드), 파이프라인 캐시 및 LOD 상태를 관리하는 식생 서브메쉬 클래스입니다.
 * [EN] Foliage sub-mesh class inheriting ScatterSubMesh to manage Foliage-specific materials, uniform bindings (wind, ground blend), pipeline caches, and LOD states.
 */
export class FoliageSubMesh extends ScatterSubMesh {
    #singleFloatBuffer: Float32Array = new Float32Array(1);
    #windFloatBuffer: Float32Array = new Float32Array(12);
    #windUintBuffer: Uint32Array = new Uint32Array(this.#windFloatBuffer.buffer);
    #groundBlendFloatBuffer: Float32Array = new Float32Array(4);

    #relativeModelMatrix: mat4;
    #relativeNormalMatrix: mat4;
    #vertexUniformBuffer: GPUBuffer;
    #vertexUniformBindGroup: GPUBindGroup;
    #lodIndex: number;

    #isDepthPrepass: boolean;
    #isMainOpaqueOrMasked: boolean;
    #isMasked: boolean;
    #mainDepthMode: FoliageDepthPassMode;
    #isImpostor: boolean;
    #receiveShadow: boolean;

    #pipelineCacheByMode: Record<string, Record<string, GPURenderPipeline>> = {};

    constructor(init: FoliageSubMeshInitOptions) {
        super(init);

        this.#relativeModelMatrix = init.relativeModelMatrix;
        this.#relativeNormalMatrix = init.relativeNormalMatrix;
        this.#vertexUniformBuffer = init.vertexUniformBuffer;
        this.#vertexUniformBindGroup = init.vertexUniformBindGroup;
        this.#lodIndex = init.lodIndex;

        this.#isDepthPrepass = init.isDepthPrepass;
        this.#isMainOpaqueOrMasked = init.isMainOpaqueOrMasked;
        this.#isMasked = init.isMasked ?? true;
        this.#mainDepthMode = init.mainDepthMode;
        this.#isImpostor = init.isImpostor ?? false;
        this.#receiveShadow = init.receiveShadow !== false;
    }

    /**
     * [KO] 원본 메쉬 인스턴스를 반환합니다.
     * [EN] Returns the original mesh instance.
     */
    override get mesh(): Mesh {
        return super.mesh as Mesh;
    }

    /**
     * [KO] 상대 모델 변환 행렬을 반환합니다.
     * [EN] Returns the relative model transform matrix.
     */
    get relativeModelMatrix(): mat4 {
        return this.#relativeModelMatrix;
    }

    /**
     * [KO] 상대 법선 변환 행렬을 반환합니다.
     * [EN] Returns the relative normal transform matrix.
     */
    get relativeNormalMatrix(): mat4 {
        return this.#relativeNormalMatrix;
    }

    /**
     * [KO] 버텍스 셰이더 Uniform 버퍼를 반환합니다.
     * [EN] Returns the vertex shader uniform buffer.
     */
    get vertexUniformBuffer(): GPUBuffer {
        return this.#vertexUniformBuffer;
    }

    /**
     * [KO] 버텍스 셰이더 Uniform 바인드 그룹을 반환합니다.
     * [EN] Returns the vertex shader uniform bind group.
     */
    get vertexUniformBindGroup(): GPUBindGroup {
        return this.#vertexUniformBindGroup;
    }

    /**
     * [KO] 서브메쉬의 LOD 인덱스를 반환합니다.
     * [EN] Returns the LOD index of the sub-mesh.
     */
    get lodIndex(): number {
        return this.#lodIndex;
    }

    /**
     * [KO] 뎁스 프리패스 렌더링 대상 여부를 반환합니다.
     * [EN] Returns whether this sub-mesh renders in the depth prepass.
     */
    get isDepthPrepass(): boolean {
        return this.#isDepthPrepass;
    }

    /**
     * [KO] 메인 불투명/마스크 패스 대상 여부를 반환합니다.
     * [EN] Returns whether this sub-mesh renders in the main opaque/masked pass.
     */
    get isMainOpaqueOrMasked(): boolean {
        return this.#isMainOpaqueOrMasked;
    }

    /**
     * [KO] 알파 마스킹(Cutout) 사용 여부를 반환합니다.
     * [EN] Returns whether alpha masking (cutout) is used.
     */
    get isMasked(): boolean {
        return this.#isMasked;
    }

    /**
     * [KO] 메인 뎁스 패스 모드를 반환합니다.
     * [EN] Returns the main depth pass mode.
     */
    get mainDepthMode(): FoliageDepthPassMode {
        return this.#mainDepthMode;
    }

    /**
     * [KO] 옥타헤드럴 임포스터 메쉬 여부를 반환합니다.
     * [EN] Returns whether this is an octahedral impostor mesh.
     */
    get isImpostor(): boolean {
        return this.#isImpostor;
    }

    /**
     * [KO] 옥타헤드럴 임포스터 메쉬 여부를 설정합니다.
     * [EN] Sets whether this is an octahedral impostor mesh.
     */
    set isImpostor(val: boolean) {
        this.#isImpostor = val;
    }

    /**
     * [KO] 그림자 수신 여부를 반환합니다.
     * [EN] Returns whether this sub-mesh receives shadows.
     */
    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    /**
     * [KO] 그림자 수신 여부를 설정합니다.
     * [EN] Sets whether this sub-mesh receives shadows.
     */
    set receiveShadow(val: boolean) {
        this.#receiveShadow = val;
    }

    /**
     * [KO] 그림자 수신 상태를 업데이트하고 GPU 유니폼 버퍼에 반영합니다.
     * [EN] Updates shadow receiving state and reflects it in the GPU uniform buffer.
     * @param gpuDevice -
     * [KO] WebGPU 디바이스 인스턴스
     * [EN] WebGPU device instance
     * @param receiveShadow -
     * [KO] 그림자 수신 여부
     * [EN] Whether shadows are received
     */
    updateReceiveShadow(gpuDevice: GPUDevice, receiveShadow: boolean): void {
        if (this.#receiveShadow === receiveShadow) return;
        this.#receiveShadow = receiveShadow;
        if (this.#vertexUniformBuffer && gpuDevice) {
            this.#singleFloatBuffer[0] = receiveShadow ? 1.0 : 0.0;
            gpuDevice.queue.writeBuffer(
                this.#vertexUniformBuffer,
                34 * 4,
                this.#singleFloatBuffer.buffer,
                this.#singleFloatBuffer.byteOffset,
                4
            );
        }
    }

    /**
     * [KO] 바람 시뮬레이션 파라미터를 유니폼 버퍼에 기록합니다.
     * [EN] Writes wind simulation parameters to the uniform buffer.
     * @param gpuDevice -
     * [KO] WebGPU 디바이스 인스턴스
     * [EN] WebGPU device instance
     * @param windDirX -
     * [KO] 바람 방향 X
     * [EN] Wind direction X
     * @param windDirY -
     * [KO] 바람 방향 Y (Z축 대응)
     * [EN] Wind direction Y (maps to Z axis)
     * @param windSpeed -
     * [KO] 바람 속도
     * [EN] Wind speed
     * @param windStrength -
     * [KO] 바람 강도
     * [EN] Wind strength
     * @param windFreq -
     * [KO] 바람 주파수
     * [EN] Wind frequency
     * @param windFlutterStrength -
     * [KO] 잔잎 흔들림 강도
     * [EN] Leaf flutter strength
     * @param windEnabled -
     * [KO] 바람 효과 활성화 여부
     * [EN] Whether wind effect is enabled
     * @param windMultiplier -
     * [KO] 인스턴스별 바람 강도 배수
     * [EN] Per-instance wind strength multiplier
     * @param windFlutterMultiplier -
     * [KO] 인스턴스별 잔잎 흔들림 배수
     * [EN] Per-instance flutter multiplier
     * @param treeHeight -
     * [KO] 식생 전체 높이
     * [EN] Total foliage height
     */
    updateWindParams(
        gpuDevice: GPUDevice,
        windDirX: number,
        windDirY: number,
        windSpeed: number,
        windStrength: number,
        windFreq: number,
        windFlutterStrength: number,
        windEnabled: boolean,
        windMultiplier: number,
        windFlutterMultiplier: number,
        treeHeight: number
    ): void {
        if (!this.#vertexUniformBuffer || !gpuDevice) return;
        const fView = this.#windFloatBuffer;
        const uView = this.#windUintBuffer;
        fView[0] = windDirX;
        fView[1] = windDirY;
        fView[2] = windSpeed;
        fView[3] = windStrength;
        fView[4] = windFreq;
        fView[5] = windFlutterStrength;
        uView[6] = windEnabled ? 1 : 0;
        fView[7] = windMultiplier;
        fView[8] = windFlutterMultiplier;
        uView[9] = 0;
        fView[10] = treeHeight;
        uView[11] = 0;

        gpuDevice.queue.writeBuffer(
            this.#vertexUniformBuffer,
            36 * 4,
            fView.buffer,
            fView.byteOffset,
            48
        );
    }

    /**
     * [KO] 지면 높이 기반 블렌딩 파라미터를 유니폼 버퍼에 기록합니다.
     * [EN] Writes ground blend parameters to the uniform buffer.
     * @param gpuDevice -
     * [KO] WebGPU 디바이스 인스턴스
     * [EN] WebGPU device instance
     * @param groundBlendStrength -
     * [KO] 지면 블렌드 강도
     * [EN] Ground blend strength
     * @param groundBlendRange -
     * [KO] 지면 블렌드 높이 범위
     * [EN] Ground blend height range
     */
    updateGroundBlendParams(
        gpuDevice: GPUDevice,
        groundBlendStrength: number,
        groundBlendRange: number
    ): void {
        if (!this.#vertexUniformBuffer || !gpuDevice) return;
        const buf = this.#groundBlendFloatBuffer;
        buf[0] = groundBlendStrength;
        buf[1] = groundBlendRange;
        buf[2] = 0;
        buf[3] = 0;

        gpuDevice.queue.writeBuffer(
            this.#vertexUniformBuffer,
            48 * 4,
            buf.buffer,
            buf.byteOffset,
            16
        );
    }

    /**
     * [KO] 특정 렌더 패스(depthPrepass 또는 main)에서 이 서브메쉬를 렌더링할 수 있는지 여부를 판별합니다.
     * [EN] Determines whether this sub-mesh can be rendered in a specific render pass (depthPrepass or main).
     * @param passType -
     * [KO] 렌더 패스 유형 ('depthPrepass' | 'main')
     * [EN] Render pass type ('depthPrepass' | 'main')
     * @returns
     * [KO] 해당 패스에서 렌더 가능 여부
     * [EN] Whether rendering is allowed in the pass
     */
    canRenderInPass(passType: FoliageRenderPassType): boolean {
        switch (passType) {
            case 'depthPrepass':
                return this.#isDepthPrepass;
            case 'main':
                return this.#isMainOpaqueOrMasked;
            default:
                return false;
        }
    }

    /**
     * [KO] MSAA 설정 및 뎁스 패스 모드에 대응하는 WebGPU 렌더 파이프라인을 조회하거나 생성하여 캐싱합니다.
     * [EN] Retrieves or creates and caches the WebGPU render pipeline matching MSAA configuration and depth pass mode.
     * @param registry -
     * [KO] 식생 파이프라인 레지스트리
     * [EN] Foliage pipeline registry
     * @param sampleCount -
     * [KO] MSAA 샘플 수
     * [EN] MSAA sample count
     * @param msaaID -
     * [KO] MSAA 식별자 키
     * [EN] MSAA identifier key
     * @param depthPassMode -
     * [KO] 뎁스 패스 모드
     * [EN] Depth pass mode
     * @param subMeshBindGroupLayout -
     * [KO] 서브메시 바인드 그룹 레이아웃
     * [EN] Sub-mesh bind group layout
     * @returns
     * [KO] 캐시되거나 생성된 렌더 파이프라인 (실패 시 null)
     * [EN] Cached or created render pipeline (null on failure)
     */
    getPipeline(
        registry: FoliagePipelineRegistry,
        sampleCount: number,
        msaaID: string,
        depthPassMode: FoliageDepthPassMode,
        subMeshBindGroupLayout: GPUBindGroupLayout | null
    ): GPURenderPipeline | null {
        const material = this.material;
        if (material?.dirtyPipeline || !material?.gpuRenderInfo?.fragmentUniformBindGroup) {
            material?._updateFragmentState?.();
            if (material) material.dirtyPipeline = false;
        }

        let modeMap = this.#pipelineCacheByMode[msaaID];
        if (!modeMap) {
            modeMap = {};
            this.#pipelineCacheByMode[msaaID] = modeMap;
        }

        let pipeline = modeMap[depthPassMode];
        if (!pipeline) {
            const cullMode: GPUCullMode = (!this.#isMasked)
                ? 'back'
                : (material?.doubleSided ? 'none' : (material?.cullMode ?? 'back'));

            pipeline = registry.getOrCreatePipeline(
                material,
                sampleCount,
                msaaID,
                this.strideBytes,
                cullMode,
                depthPassMode,
                subMeshBindGroupLayout
            ) || undefined;

            if (pipeline) {
                modeMap[depthPassMode] = pipeline;
            }
        }
        return pipeline || null;
    }

    /**
     * [KO] 서브메쉬 리소스를 해제합니다.
     * [EN] Destroys sub-mesh resources.
     */
    override destroy(): void {
        this.#vertexUniformBuffer?.destroy();
        this.#pipelineCacheByMode = {};
        super.destroy();
    }
}

Object.freeze(FoliageSubMesh);
export default FoliageSubMesh;
