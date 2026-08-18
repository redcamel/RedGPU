import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import ABaseMaterial from "../../../material/core/ABaseMaterial";
import FoliageInstanceBuffer from "./FoliageInstanceBuffer";
import createCrossBillboardGeometry from "./core/impostor/crossBillboard/createCrossBillboardGeometry";
import type {FoliageDepthPassMode} from "./core/pipeline/FoliagePipelineRegistry";
import FoliageSubMeshAssembler from "./core/assembler/FoliageSubMeshAssembler";
import FoliageTilePopulator from "./core/populator/FoliageTilePopulator";

/**
 * FoliageSubMesh
 * 동일 머티리얼 또는 단일 지오메트리 단위로 파티셔닝된 식생 렌더링 최소 단위
 */
export interface FoliageSubMesh {
    mesh: Mesh;
    geometry: Geometry;
    material: ABaseMaterial | any;
    indexCount: number;
    vertexCount: number;
    isIndexed: boolean;
    indexFormat?: GPUIndexFormat;
    strideBytes: number;
    bottomOffset: number;
    relativeModelMatrix: mat4;
    relativeNormalMatrix: mat4;
    vertexUniformBuffer: GPUBuffer;
    vertexUniformBindGroup: GPUBindGroup;
    lodIndex: number; // 0 = 3D High-Poly, 1 = 3-Plane Star Billboard Impostor

    // 🌿 렌더 패스 최적화 플래그
    isDepthPrepass: boolean;
    isMainOpaqueOrMasked: boolean;
    mainDepthMode: FoliageDepthPassMode;
    isAlpha: boolean;
    isTransparent: boolean;
}

export interface FoliageCrossBillboardOptions {
    /**
     * [KO] 3-Plane Star 크로스 빌보드 임포스터(Cross Billboard Impostor) 활성화 여부 (기본: false)
     * [EN] Whether to enable 3-Plane Star Cross Billboard Impostor (default: false)
     */
    enabled?: boolean;
    /**
     * [KO] 빌보드 임포스터 텍스처
     * [EN] Billboard impostor texture
     */
    texture?: any;
    /**
     * [KO] 빌보드 머티리얼 (지정하지 않으면 CrossBillboardMaterial 기본 생성)
     * [EN] Billboard material (creates CrossBillboardMaterial by default if not specified)
     */
    material?: any;
    /**
     * [KO] 빌보드 가로 폭 (기본값: 수목 폭 또는 6.0)
     * [EN] Billboard width (default: tree width or 6.0)
     */
    width?: number;
    /**
     * [KO] 빌보드 세로 높이 (기본값: 수목 높이 또는 8.0)
     * [EN] Billboard height (default: tree height or 8.0)
     */
    height?: number;
    /**
     * [KO] 3D 모델에서 크로스 빌보드로 전환되는 거리 (m, 기본: 80.0)
     * [EN] Transition distance from 3D model to cross billboard (m, default: 80.0)
     */
    lodDistance?: number;
    /**
     * [KO] LOD 전환 시 디더링 크로스페이드 구간 범위 (m, 기본: 30.0)
     * [EN] Dithered crossfade transition range in meters (default: 30.0)
     */
    fadeRange?: number;
}

/** [KO] 용어 호환성을 위한 Type Alias */
export type FoliageBillboardOptions = FoliageCrossBillboardOptions;
export type FoliageImpostorOptions = FoliageCrossBillboardOptions;

export interface FoliageTypeOptions {
    name: string;
    /**
     * 단일 Mesh, Mesh 배열, 또는 glTF 루트 계층 Mesh(자식 노드 포함) 모두 수용
     */
    mesh: Mesh | Mesh[];
    maxInstances?: number;

    // Culling & Fade Out
    cullingDistance?: number;               // 시선 최장 표시 거리 (m, 기본: 2000)
    fadeStartDistance?: number;             // 소멸 축소 시작 거리 (m, 기본: 1500)

    minScale?: [number, number, number];
    maxScale?: [number, number, number];
    randomRotationY?: boolean;

    /**
     * [KO] 3D 모델에서 크로스 빌보드로 전환되는 LOD 거리 (m, 기본: 80.0)
     * [EN] LOD transition distance from 3D model to billboard (m, default: 80.0)
     */
    lodDistance?: number;

    /**
     * [KO] 언리얼 엔진 스타일 3-Plane Star 크로스 빌보드 임포스터 옵션
     * [EN] Unreal Engine style 3-Plane Star Cross-Billboard Impostor options
     */
    billboard?: FoliageCrossBillboardOptions;

    /**
     * [KO] impostor 옵션 별칭 (billboard와 동일)
     * [EN] Impostor options alias (same as billboard)
     */
    impostor?: FoliageCrossBillboardOptions;

    /**
     * [KO] 반투명(BLEND) 머티리얼을 언리얼 엔진 표준인 알파 컷오프(MASK)로 자동 변환할지 여부 (기본: true)
     * [EN] Whether to automatically convert BLEND materials to Unreal Engine standard MASK (alpha cutoff) (default: true)
     */
    convertBlendToMasked?: boolean;

    /**
     * [KO] 언리얼 엔진 스타일: 동일 머티리얼을 공유하는 서브메시들을 1개의 지오메트리로 자동 병합할지 여부 (기본: true)
     * [EN] Unreal Engine style: Whether to automatically combine submeshes sharing the same material into a single geometry (default: true)
     */
    combineSubMeshesByMaterial?: boolean;
}

/**
 * [KO] 단일 식생 종 모델 컨테이너 (단일 책임: 식생 종 메타데이터, 서브메시 및 인스턴스 버퍼 상태 관리)
 * [EN] Single Foliage Species Model Container (Single Responsibility: Species Metadata, SubMeshes & Instance Buffer State)
 */
class FoliageType {
    #name: string;
    #options: Required<Omit<FoliageTypeOptions, 'billboard' | 'impostor'>> & {
        billboard?: FoliageCrossBillboardOptions;
        impostor?: FoliageCrossBillboardOptions;
    };
    #redGPUContext: RedGPUContext;

    // 지형 매니저 연결
    foliageManager: any = null;

    // 다중 서브메시 목록
    #subMeshes: FoliageSubMesh[] = [];

    // GPU Instancing 버퍼
    #instanceBuffer: FoliageInstanceBuffer;

    // LOD & Culling 속성 (은닉 및 단일 원천)
    #lod0SubMeshCount: number = 1;
    #activeInstanceCount: number = 0;
    #bottomOffset: number | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;
    #loadedTileKeys: Set<string> = new Set();

    constructor(
        redGPUContext: RedGPUContext,
        options: FoliageTypeOptions,
        sharedSubMeshBindGroupLayout?: GPUBindGroupLayout | null
    ) {
        this.#redGPUContext = redGPUContext;
        this.#subMeshVertexBindGroupLayout = sharedSubMeshBindGroupLayout || null;
        this.#name = options.name;

        const billboardOpt = options.billboard || options.impostor;

        this.#options = {
            name: options.name,
            mesh: options.mesh,
            maxInstances: options.maxInstances ?? 50000,
            cullingDistance: options.cullingDistance ?? 2000.0,
            fadeStartDistance: options.fadeStartDistance ?? 1500.0,
            minScale: options.minScale ?? [1.0, 1.0, 1.0],
            maxScale: options.maxScale ?? [1.0, 1.0, 1.0],
            randomRotationY: options.randomRotationY ?? true,
            lodDistance: options.lodDistance ?? (billboardOpt?.lodDistance ?? 80.0),
            billboard: billboardOpt ?? {enabled: false},
            impostor: billboardOpt ?? {enabled: false},
            convertBlendToMasked: options.convertBlendToMasked ?? true,
            combineSubMeshesByMaterial: options.combineSubMeshesByMaterial ?? true,
        };

        this.#initSubMeshBindGroupLayout();

        // 🌟 서브메시 조립 (FoliageSubMeshAssembler 단일 책임 분리)
        const assembleResult = FoliageSubMeshAssembler.assemble(
            this.#redGPUContext,
            this.#options,
            this.#subMeshVertexBindGroupLayout!
        );
        this.#subMeshes = assembleResult.subMeshes;
        this.#lod0SubMeshCount = assembleResult.lod0SubMeshCount;
        this.#bottomOffset = assembleResult.bottomOffset;

        this.#instanceBuffer = new FoliageInstanceBuffer(redGPUContext, this.#options.maxInstances, this.#subMeshes);
        this.updateIndirectBuffer();
    }

    get name(): string {
        return this.#name;
    }

    get options(): Required<Omit<FoliageTypeOptions, 'billboard' | 'impostor'>> & {
        billboard?: FoliageCrossBillboardOptions;
        impostor?: FoliageCrossBillboardOptions;
    } {
        return this.#options;
    }

    get subMeshes(): FoliageSubMesh[] {
        return this.#subMeshes;
    }

    get instanceBuffer(): FoliageInstanceBuffer {
        return this.#instanceBuffer;
    }

    get activeInstanceCount(): number {
        return this.#activeInstanceCount;
    }

    get lod0SubMeshCount(): number {
        return this.#lod0SubMeshCount;
    }

    get hasBillboard(): boolean {
        return !!this.#options.billboard?.enabled;
    }

    get lodDistance(): number {
        return this.#options.lodDistance;
    }

    get lodFadeRange(): number {
        return this.#options.billboard?.fadeRange ?? 30.0;
    }

    incrementActiveInstanceCount(count: number): void {
        this.#activeInstanceCount += count;
    }

    get bottomOffset(): number {
        return this.#bottomOffset ?? 0;
    }

    /**
     * 식생 인스턴스를 대량 배치 (Float32Array 12 floats: pos.xyz, rotQuat.xyzw, scale.xyz, extra.xy)
     */
    setInstancesData(data: Float32Array, count?: number): void {
        const instanceCount = count !== undefined ? count : Math.floor(data.length / 12);
        this.#activeInstanceCount = Math.min(instanceCount, this.#options.maxInstances);
        this.#instanceBuffer.dataBuffer.set(data.subarray(0, this.#activeInstanceCount * 12));
        this.#instanceBuffer.uploadToGPU(this.#activeInstanceCount);
        this.updateIndirectBuffer();
    }

    /**
     * 식생 다중 서브메시 인다이렉트 버퍼의 파라미터를 최신 지오메트리 정보로 갱신
     */
    updateIndirectBuffer(): void {
        if (!this.#instanceBuffer || this.#subMeshes.length === 0) return;
        this.#instanceBuffer.resetMultiIndirectCount(this.#subMeshes);
    }

    /**
     * [KO] 지형 타일(LandscapeComponent) 1개가 로딩되었을 때 해당 타일 영역 식생을 절차적으로 부분 업로드
     */
    populateTile(comp: any, targetCountPerTile?: number): void {
        const key = `${comp.componentZ}_${comp.componentX}`;
        if (this.#loadedTileKeys.has(key)) return;
        this.#loadedTileKeys.add(key);

        FoliageTilePopulator.populateTile(comp, this, targetCountPerTile);
    }

    destroy(): void {
        this.#instanceBuffer.destroy();
        for (let i = 0; i < this.#subMeshes.length; i++) {
            const sub = this.#subMeshes[i];
            sub.vertexUniformBuffer?.destroy();
        }
        this.#subMeshes.length = 0;
    }

    /**
     * [KO] 크로스 빌보드(LOD1)의 라인 모드(와이어프레임) 표시 여부를 실시간으로 전환합니다.
     */
    setBillboardWireframe(wireframe: boolean): void {
        const billboardSub = this.subMeshes.find(s => s.lodIndex === 1);
        if (!billboardSub) return;

        const bbWidth = (billboardSub as any)._bakedWidth ?? 6.0;
        const bbHeight = (billboardSub as any)._bakedHeight ?? 8.0;

        const newGeom = createCrossBillboardGeometry(this.#redGPUContext, bbWidth, bbHeight, 0.6, wireframe);
        billboardSub.geometry = newGeom;
        billboardSub.mesh.geometry = newGeom;
        billboardSub.indexCount = newGeom.indexBuffer?.indexCount || 0;
        billboardSub.vertexCount = newGeom.vertexBuffer?.vertexCount || 0;
        billboardSub.isIndexed = !!newGeom.indexBuffer;

        if (billboardSub.material) {
            billboardSub.material.wireframe = wireframe;
            billboardSub.material.useCutOff = !wireframe;
            if (billboardSub.material._updateFragmentState) {
                billboardSub.material._updateFragmentState();
            }
        }
        this.updateIndirectBuffer();
    }

    #initSubMeshBindGroupLayout(): void {
        if (this.#subMeshVertexBindGroupLayout) return;
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        this.#subMeshVertexBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: `FoliageSubMesh_VertexBindGroupLayout_${this.#name}`,
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform'
                    }
                }
            ]
        });
    }

    /**
     * [KO] setBillboardWireframe의 표준 별칭 (CrossBillboard 기준)
     */
    setCrossBillboardWireframe(wireframe: boolean): void {
        this.setBillboardWireframe(wireframe);
    }
}

Object.freeze(FoliageType);
export default FoliageType;
