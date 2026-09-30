import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import Geometry from "../../../geometry/Geometry";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import Mesh from "../../../display/mesh/Mesh";
import Primitive from "../../../primitive/core/Primitive";
import LandscapeMeshCombiner from "../../core/geometry/LandscapeMeshCombiner";
import LandscapeSubMesh from "../../core/geometry/LandscapeSubMesh";

/**
 * [KO] 잔디(Grass) 인스턴스 생성 시 전달되는 설정 옵션 인터페이스입니다.
 * [EN] Configuration options interface passed when creating a Grass instance.
 */
export interface GrassOptions {
    /**
     * [KO] 잔디 인스턴스의 고유 식별자 이름
     * [EN] Unique identifier name for the grass instance
     */
    name: string;
    /**
     * [KO] 잔디 렌더링에 사용되는 기본 메쉬 객체
     * [EN] Base Mesh instance used for rendering grass
     */
    mesh: Mesh;
    /**
     * [KO] 잔디 베이스 컬러 텍스처 (이미지 URL 또는 BitmapTexture 인스턴스)
     * [EN] Base color texture for grass (image URL or BitmapTexture instance)
     */
    baseColorTexture?: string | BitmapTexture;
    /**
     * [KO] 헥타르(10,000m²)당 생성할 잔디 인스턴스 기본 수량 (기본값: 5000.0)
     * [EN] Base number of grass instances to spawn per hectare (10,000 m²) (default: 5000.0)
     */
    densityPerHectare?: number;
    /**
     * [KO] 잔디 밀도에 적용되는 전체 배율 (기본값: 1.0)
     * [EN] Overall multiplier applied to grass density (default: 1.0)
     */
    densityMultiplier?: number;
    /**
     * [KO] 지형 스플랫 레이어 가중치에 비례하여 밀도를 스케일링할지 여부 (기본값: true)
     * [EN] Whether to scale density proportional to the terrain splat layer weight (default: true)
     */
    densityScaleByWeight?: boolean;
    /**
     * [KO] 잔디가 배치될 수 있는 지형의 최소 경사도 (0~90, 기본값: 0.0)
     * [EN] Minimum terrain slope where grass can be spawned (0-90, default: 0.0)
     */
    minSlope?: number;
    /**
     * [KO] 잔디가 배치될 수 있는 지형의 최대 경사도 (0~90, 기본값: 35.0)
     * [EN] Maximum terrain slope where grass can be spawned (0-90, default: 35.0)
     */
    maxSlope?: number;
    /**
     * [KO] 카메라로부터 잔디가 렌더링되는 최대 가시거리 (기본값: 100.0)
     * [EN] Maximum visible distance from camera where grass is rendered (default: 100.0)
     */
    cullingDistance?: number;
    /**
     * [KO] 카메라 거리에 따라 잔디 스케일 축소가 시작되는 거리 (기본값: cullingDistance * 0.75)
     * [EN] Distance at which grass scale starts to smoothly shrink towards culling boundary (default: cullingDistance * 0.75)
     */
    shrinkStartDistance?: number;
    /**
     * [KO] 원거리 간소화 셰이더(Far Grass)로 전환을 시작하는 거리 (기본값: 35.0)
     * [EN] Distance where transition to simplified far-distance grass shader begins (default: 35.0)
     */
    farDistance?: number;
    /**
     * [KO] 절차적 생성 시 적용되는 최소 스케일 `[x, y, z]` 또는 `[x, y]`
     * [EN] Minimum random scale `[x, y, z]` or `[x, y]` applied during procedural placement
     */
    minScale?: [number, number] | [number, number, number];
    /**
     * [KO] 절차적 생성 시 적용되는 최대 스케일 `[x, y, z]` 또는 `[x, y]`
     * [EN] Maximum random scale `[x, y, z]` or `[x, y]` applied during procedural placement
     */
    maxScale?: [number, number] | [number, number, number];
    /**
     * [KO] 잔디 메쉬 높이 (미지정 시 지오메트리 바운딩 볼륨에서 자동 계산)
     * [EN] Height of the grass mesh (auto-calculated from geometry volume if omitted)
     */
    height?: number;
    /**
     * [KO] 지면 색상과 잔디 하단 블렌딩 강도 (0.0~1.0, 기본값: 1.0)
     * [EN] Blending strength between terrain ground color and grass base (0.0-1.0, default: 1.0)
     */
    groundBlendStrength?: number;
    /**
     * [KO] 알파 테스트 컷오프 임계값 (0.01~1.0, 기본값: 0.2)
     * [EN] Alpha test cutoff threshold (0.01-1.0, default: 0.2)
     */
    alphaCutoff?: number;
    /**
     * [KO] 잔디 표면 거칠기 값 (0.04~1.0, 기본값: 0.55)
     * [EN] Grass surface roughness value (0.04-1.0, default: 0.55)
     */
    roughness?: number;
    /**
     * [KO] 서브서피스 스캐터링(SSS, 잎사귀 투과광) 효과 강도 (0.0~3.0, 기본값: 0.25)
     * [EN] Subsurface scattering (SSS transmission) strength (0.0-3.0, default: 0.25)
     */
    subsurfaceStrength?: number;
    /**
     * [KO] 서브서피스 스캐터링 투과 색상 `[r, g, b]`
     * [EN] Subsurface scattering transmission color `[r, g, b]`
     */
    subsurfaceColor?: [number, number, number];
    /**
     * [KO] 렌더링 노출 보정 배율 (기본값: 1.0)
     * [EN] Exposure boost multiplier (default: 1.0)
     */
    exposureBoost?: number;
    /**
     * [KO] 지오메트리 하단 Y 오프셋 (미지정 시 지오메트리 바운딩 볼륨에서 자동 계산)
     * [EN] Bottom Y offset for geometry alignment (auto-calculated from geometry volume if omitted)
     */
    minY?: number;
    /**
     * [KO] 잔디가 배치될 특정 지형 스플랫 레이어의 이름 또는 인덱스 (빈 문자열이면 전체 배치)
     * [EN] Target terrain splat layer name or index where grass spawns (empty string spawns on all)
     */
    targetLayer?: string | number;
    /**
     * [KO] 지형 표면 대비 잔디 하단 접지 추가 Y 오프셋 (기본값: 0.0)
     * [EN] Additional bottom Y offset relative to terrain surface (default: 0.0)
     */
    bottomOffset?: number;
    /**
     * [KO] 그림자 수신 여부 (기본값: true)
     * [EN] Whether grass receives shadows (default: true)
     */
    receiveShadow?: boolean;
    /**
     * [KO] 수신되는 그림자 음영 강도 (0.0~1.0, 기본값: 1.0)
     * [EN] Received shadow intensity (0.0-1.0, default: 1.0)
     */
    shadowStrength?: number;
    /**
     * [KO] 잔디가 그림자를 투영(캐스팅)할지 여부 (기본값: true)
     * [EN] Whether grass casts shadows (default: true)
     */
    castShadow?: boolean;
    /**
     * [KO] 그림자 렌더링 패스 시의 최대 컬링 거리 (기본값: 35.0)
     * [EN] Maximum culling distance applied during the shadow pass (default: 35.0)
     */
    shadowCullDistance?: number;
    /**
     * [KO] 그림자 렌더링 시 스케일 축소가 시작되는 거리 (기본값: shadowCullDistance * 0.75)
     * [EN] Distance where shadow-casting scale smoothly shrinks towards shadow culling boundary (default: shadowCullDistance * 0.75)
     */
    shadowShrinkStartDistance?: number;
}

/**
 * [KO] 지형(Landscape) 상에 절차적으로 배치되는 개별 잔디 타입의 외형, 밀도, 머티리얼 및 컬링 속성을 정의하는 클래스입니다.
 * [EN] Class that defines appearance, density, material, and culling properties of an individual grass type procedurally distributed across the landscape.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class Grass extends RedGPUObject {
    #mesh: Mesh;
    #geometry: Geometry | Primitive;
    #subMeshes: LandscapeSubMesh[] = [];
    #baseColorTexture: BitmapTexture;
    #densityPerHectare: number = 5000.0;
    #densityMultiplier: number = 1.0;
    #densityScaleByWeight: boolean = true;
    #minSlope: number = 0.0;
    #maxSlope: number = 35.0;
    #cullingDistance: number = 100.0;
    #shrinkStartDistance: number = 60.0;
    #farDistance: number = 35.0;
    #minScale: [number, number, number] = [0.7, 0.7, 0.7];
    #maxScale: [number, number, number] = [1.3, 1.4, 1.3];
    #meshHeight: number = 1.0;
    #minY: number = 0.0;
    #exposureBoost: number = 1.0;
    #subsurfaceStrength: number = 0.25;
    #subsurfaceColor: [number, number, number] = [0.35, 0.65, 0.15];
    #groundBlendStrength: number = 1.0;
    #alphaCutoff: number = 0.2;
    #roughness: number = 0.55;
    #targetLayer: string | number = '';
    #bottomOffset: number = 0.0;
    #receiveShadow: boolean = true;
    #shadowStrength: number = 1.0;
    #castShadow: boolean = true;
    #shadowCullDistance: number = 35.0;
    #shadowShrinkStartDistance: number = 26.25;

    #typeId: number = 0;
    #dirty: boolean = true;
    #onChanged: (() => void) | null = null;

    /**
     * [KO] Grass 인스턴스를 생성하고 초기 속성을 설정합니다.
     * @remarks 사용자가 직접 생성하지 마시고 `landscape.grassManager.addGrass(options)` 메서드를 사용하십시오.
     * [EN] Creates a Grass instance and initializes properties.
     * @remarks Do not instantiate directly; use the `landscape.grassManager.addGrass(options)` method instead.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param options -
     * [KO] 잔디 설정 옵션 객체
     * [EN] Grass configuration options object
     */
    constructor(redGPUContext: RedGPUContext, options: GrassOptions) {
        super(redGPUContext);

        const {
            name,
            mesh,
            baseColorTexture,
            minY,
            height,
            farDistance = 35.0,
            receiveShadow = true,
            densityPerHectare,
            densityMultiplier,
            densityScaleByWeight,
            minSlope,
            maxSlope,
            cullingDistance,
            shrinkStartDistance,
            minScale,
            maxScale,
            groundBlendStrength,
            alphaCutoff = 0.2,
            roughness,
            subsurfaceStrength,
            subsurfaceColor,
            exposureBoost,
            targetLayer,
            bottomOffset,
            shadowStrength,
            castShadow = true,
            shadowCullDistance,
            shadowShrinkStartDistance
        } = options || {};

        if (!name || typeof name !== 'string' || name.trim() === '') {
            consoleAndThrowError('[Grass] options.name is required and must be a non-empty string!');
        }
        super.name = name.trim();

        if (!mesh) {
            consoleAndThrowError(`[Grass] options.mesh is required and must contain a valid Mesh instance!`);
        }
        this.#mesh = mesh;

        let targetMaterial: any = mesh.material;

        const isComposite = (mesh.children && mesh.children.length > 0) || !mesh.geometry;
        if (isComposite) {
            const combineResult = LandscapeMeshCombiner.combine(redGPUContext, mesh, {
                preservePivot: true,
                centerXZ: false
            });
            if (combineResult.groups.length === 0) {
                consoleAndThrowError(`[Grass] Failed to extract any valid geometry from mesh!`);
            }
            const primaryGroup = combineResult.groups[0];
            this.#geometry = primaryGroup.geometry;
            if (primaryGroup.material) {
                targetMaterial = primaryGroup.material;
            }

            const resolvedTexture = baseColorTexture ?? targetMaterial?.baseColorTexture ?? targetMaterial?.diffuseTexture ?? (mesh.material as any)?.baseColorTexture ?? (mesh.material as any)?.diffuseTexture;
            if (typeof resolvedTexture === 'string') {
                this.#baseColorTexture = new BitmapTexture(redGPUContext, resolvedTexture);
            } else if (resolvedTexture) {
                this.#baseColorTexture = resolvedTexture;
            }

            if (minY !== undefined) {
                this.#minY = minY;
            } else {
                this.#minY = isFinite(combineResult.minY) ? combineResult.minY : 0.0;
            }

            if (height !== undefined) {
                this.#meshHeight = height;
            } else {
                this.#meshHeight = combineResult.boundingHeight > 0 ? combineResult.boundingHeight : 1.0;
            }

            this.#subMeshes = combineResult.groups.map((group, idx) => {
                const mat = group.material;
                const tex = idx === 0 ? this.#baseColorTexture : (mat?.baseColorTexture ?? mat?.diffuseTexture ?? null);
                return new LandscapeSubMesh({
                    geometry: group.geometry,
                    vertexCount: group.vertexCount,
                    indexCount: group.indexCount,
                    isIndexed: !!group.geometry.indexBuffer,
                    strideBytes: group.geometry.vertexBuffer?.stride ? group.geometry.vertexBuffer.stride * 4 : 72,
                    mesh: group.rawNodes[0]?.node ?? mesh,
                    material: mat,
                    baseColorTexture: tex,
                    bottomOffset: 0
                });
            });
        } else {
            const resolvedTexture = baseColorTexture ?? targetMaterial?.baseColorTexture ?? targetMaterial?.diffuseTexture;
            if (typeof resolvedTexture === 'string') {
                this.#baseColorTexture = new BitmapTexture(redGPUContext, resolvedTexture);
            } else if (resolvedTexture) {
                this.#baseColorTexture = resolvedTexture;
            }

            const geom = mesh.geometry;
            if (!geom) {
                consoleAndThrowError(`[Grass] Mesh must have a valid geometry!`);
            }
            this.#geometry = geom;

            const vol = this.#geometry.volume;
            if (minY !== undefined) {
                this.#minY = minY;
            } else if (vol && vol.minY !== undefined) {
                this.#minY = vol.minY;
            } else {
                this.#minY = 0.0;
            }

            if (height !== undefined) {
                this.#meshHeight = height;
            } else {
                const computedH = (vol && (vol.maxY !== undefined && vol.minY !== undefined)) ? (vol.maxY - vol.minY) : 1.0;
                this.#meshHeight = computedH > 0 ? computedH : 1.0;
            }

            const gGeom = this.#geometry as Geometry;
            this.#subMeshes = [
                new LandscapeSubMesh({
                    geometry: gGeom,
                    vertexCount: gGeom.vertexBuffer?.vertexCount ?? 0,
                    indexCount: gGeom.indexBuffer?.indexCount ?? (gGeom.vertexBuffer?.vertexCount ?? 0),
                    isIndexed: !!gGeom.indexBuffer,
                    strideBytes: gGeom.vertexBuffer?.stride ? gGeom.vertexBuffer.stride * 4 : 72,
                    mesh: mesh,
                    material: targetMaterial,
                    baseColorTexture: this.#baseColorTexture,
                    bottomOffset: 0
                })
            ];
        }

        this.#farDistance = Math.max(10.0, farDistance);
        this.#receiveShadow = receiveShadow;

        if (densityPerHectare !== undefined) this.#densityPerHectare = densityPerHectare;
        if (densityMultiplier !== undefined) this.#densityMultiplier = densityMultiplier;
        if (densityScaleByWeight !== undefined) this.#densityScaleByWeight = densityScaleByWeight;
        if (minSlope !== undefined) this.#minSlope = minSlope;
        if (maxSlope !== undefined) this.#maxSlope = maxSlope;
        if (cullingDistance !== undefined) this.#cullingDistance = cullingDistance;
        if (shrinkStartDistance !== undefined) {
            this.#shrinkStartDistance = shrinkStartDistance;
        } else {
            this.#shrinkStartDistance = this.#cullingDistance * 0.75;
        }
        if (minScale) this.#minScale = [minScale[0], minScale[1], minScale[2] ?? minScale[0]];
        if (maxScale) this.#maxScale = [maxScale[0], maxScale[1], maxScale[2] ?? maxScale[0]];
        if (groundBlendStrength !== undefined) this.#groundBlendStrength = groundBlendStrength;

        this.#alphaCutoff = alphaCutoff;

        const inheritedRoughness = targetMaterial?.roughnessFactor ?? targetMaterial?.roughness;
        if (roughness !== undefined) {
            this.#roughness = roughness;
        } else if (inheritedRoughness !== undefined) {
            this.#roughness = inheritedRoughness;
        }

        if (subsurfaceStrength !== undefined) this.#subsurfaceStrength = subsurfaceStrength;
        if (subsurfaceColor) this.#subsurfaceColor = [...subsurfaceColor];
        if (exposureBoost !== undefined) this.#exposureBoost = exposureBoost;
        if (targetLayer !== undefined) this.#targetLayer = targetLayer;
        if (bottomOffset !== undefined) this.#bottomOffset = bottomOffset;
        if (shadowStrength !== undefined) this.#shadowStrength = shadowStrength;
        this.#castShadow = castShadow;
        if (shadowCullDistance !== undefined) {
            this.#shadowCullDistance = Math.max(0.0, shadowCullDistance);
            this.#shadowShrinkStartDistance = shadowShrinkStartDistance !== undefined
                ? Math.max(0.0, shadowShrinkStartDistance)
                : Math.max(0.0, this.#shadowCullDistance * 0.75);
        } else if (shadowShrinkStartDistance !== undefined) {
            this.#shadowShrinkStartDistance = Math.max(0.0, shadowShrinkStartDistance);
        } else {
            this.#shadowShrinkStartDistance = this.#shadowCullDistance * 0.75;
        }
    }

    /**
     * [KO] 잔디 인스턴스의 고유 식별자 이름 (읽기 전용)
     * [EN] Unique identifier name of the grass instance (read-only)
     */
    override get name(): string {
        return super.name;
    }

    override set name(_value: string) {
        consoleAndThrowError('[Grass] name property is readonly and cannot be changed.');
    }

    /**
     * [KO] 잔디 렌더링에 사용되는 기본 메쉬 객체
     * [EN] Base Mesh instance used for grass rendering
     */
    get mesh(): Mesh {
        return this.#mesh;
    }

    /**
     * [KO] 잔디 메쉬에 연결된 지오메트리 또는 프리미티브 객체
     * [EN] Geometry or Primitive object associated with the grass mesh
     */
    get geometry(): Geometry | Primitive {
        return this.#geometry;
    }

    /**
     * [KO] 잔디 모델을 구성하는 공용 서브메쉬(LandscapeSubMesh) 목록을 반환합니다.
     * [EN] Returns the list of shared sub-meshes (LandscapeSubMesh) composing the grass model.
     */
    get subMeshes(): readonly LandscapeSubMesh[] {
        return this.#subMeshes;
    }

    /**
     * [KO] 원거리 간소화 셰이더(Far Grass)로 전환을 시작하는 거리 (미터 단위)
     * [EN] Transition distance in meters where far grass shader is engaged
     */
    get farDistance(): number {
        return this.#farDistance;
    }

    set farDistance(v: number) {
        this.#farDistance = Math.max(10.0, v);
        this.#dirty = true;
    }

    /**
     * [KO] 잔디 표면에 적용된 베이스 컬러 BitmapTexture 객체
     * [EN] Base color BitmapTexture instance applied to grass surface
     */
    get baseColorTexture(): BitmapTexture {
        return this.#baseColorTexture;
    }

    /**
     * [KO] 잔디 렌더링에 사용되는 베이스 컬러 GPUTextureView
     * [EN] Base color GPUTextureView used for grass rendering
     */
    get baseColorTextureView(): GPUTextureView {
        if (this.#baseColorTexture) {
            return this.resourceManager.getGPUResourceBitmapTextureView(this.#baseColorTexture)
                || this.resourceManager.emptyBitmapTextureView;
        }
        return this.resourceManager.emptyBitmapTextureView;
    }

    /**
     * [KO] 헥타르(10,000m²)당 잔디 인스턴스 수량
     * [EN] Number of grass instances per hectare (10,000 m²)
     */
    get densityPerHectare(): number {
        return this.#densityPerHectare;
    }

    set densityPerHectare(v: number) {
        this.#densityPerHectare = Math.max(0, v);
        this.#notifyChange();
    }

    /**
     * [KO] 잔디 밀도에 적용되는 전체 배율
     * [EN] Overall multiplier applied to grass density
     */
    get densityMultiplier(): number {
        return this.#densityMultiplier;
    }

    set densityMultiplier(v: number) {
        this.#densityMultiplier = Math.max(0, v);
        this.#notifyChange();
    }

    /**
     * [KO] 단일 지형 그리드 셀(16m x 16m) 당 생성되는 인스턴스 수량 계산값
     * [EN] Computed number of instances generated per terrain grid cell (16m x 16m)
     */
    get instancesPerCell(): number {
        return Math.max(1, Math.round((this.#densityPerHectare * 256.0 / 10000.0) * this.#densityMultiplier));
    }

    /**
     * [KO] 지형 스플랫 레이어 가중치에 비례하여 밀도를 스케일링할지 여부
     * [EN] Whether to scale density proportional to terrain splat layer weight
     */
    get densityScaleByWeight(): boolean {
        return this.#densityScaleByWeight;
    }

    set densityScaleByWeight(v: boolean) {
        this.#densityScaleByWeight = v;
        this.#notifyChange();
    }

    /**
     * [KO] 잔디가 배치될 수 있는 지형의 최소 경사도 (0~90)
     * [EN] Minimum terrain slope where grass can spawn (0-90)
     */
    get minSlope(): number {
        return this.#minSlope;
    }

    set minSlope(v: number) {
        this.#minSlope = Math.max(0, Math.min(90, v));
        this.#notifyChange();
    }

    /**
     * [KO] 잔디가 배치될 수 있는 지형의 최대 경사도 (0~90)
     * [EN] Maximum terrain slope where grass can spawn (0-90)
     */
    get maxSlope(): number {
        return this.#maxSlope;
    }

    set maxSlope(v: number) {
        this.#maxSlope = Math.max(0, Math.min(90, v));
        this.#notifyChange();
    }

    /**
     * [KO] 카메라로부터 잔디가 렌더링되는 최대 가시거리 (미터 단위)
     * [EN] Maximum visible distance in meters where grass is rendered
     */
    get cullingDistance(): number {
        return this.#cullingDistance;
    }

    set cullingDistance(v: number) {
        this.#cullingDistance = Math.max(10, v);
        this.#shrinkStartDistance = this.#cullingDistance * 0.75;
        this.#dirty = true;
    }

    /**
     * [KO] 카메라 거리에 따라 잔디 스케일 축소가 시작되는 거리 (미터 단위)
     * [EN] Distance in meters where grass scale begins shrinking towards culling boundary
     */
    get shrinkStartDistance(): number {
        return this.#shrinkStartDistance;
    }

    set shrinkStartDistance(v: number) {
        this.#shrinkStartDistance = Math.max(0, v);
        this.#dirty = true;
    }

    /**
     * [KO] 잔디 인스턴스의 최소 스케일 `[x, y, z]`
     * [EN] Minimum scale `[x, y, z]` for grass instances
     */
    get minScale(): [number, number, number] {
        return this.#minScale;
    }

    set minScale(v: [number, number] | [number, number, number]) {
        this.#minScale = [v[0], v[1], v[2] ?? v[0]];
        this.#notifyChange();
    }

    /**
     * [KO] 잔디 인스턴스의 최대 스케일 `[x, y, z]`
     * [EN] Maximum scale `[x, y, z]` for grass instances
     */
    get maxScale(): [number, number, number] {
        return this.#maxScale;
    }

    set maxScale(v: [number, number] | [number, number, number]) {
        this.#maxScale = [v[0], v[1], v[2] ?? v[0]];
        this.#notifyChange();
    }

    /**
     * [KO] 잔디 메쉬 높이 (미터 단위)
     * [EN] Height of the grass mesh in meters
     */
    get meshHeight(): number {
        return this.#meshHeight;
    }

    /**
     * [KO] 지오메트리 하단 Y 오프셋 (미터 단위)
     * [EN] Bottom Y offset in meters for geometry
     */
    get minY(): number {
        return this.#minY;
    }

    /**
     * [KO] 잔디 렌더링 노출 보정 배율
     * [EN] Exposure boost multiplier for grass rendering
     */
    get exposureBoost(): number {
        return this.#exposureBoost;
    }

    set exposureBoost(v: number) {
        this.#exposureBoost = Math.max(0.1, v);
        this.#dirty = true;
    }

    /**
     * [KO] 지면 색상과 잔디 하단 버텍스 컬러 간의 블렌딩 강도 (0.0~1.0)
     * [EN] Blending strength between terrain ground color and grass base vertex color (0.0-1.0)
     */
    get groundBlendStrength(): number {
        return this.#groundBlendStrength;
    }

    set groundBlendStrength(v: number) {
        this.#groundBlendStrength = Math.max(0, Math.min(1, v));
        this.#dirty = true;
    }

    /**
     * [KO] 알파 테스트 컷오프 임계값 (0.01~1.0)
     * [EN] Alpha test cutoff threshold (0.01-1.0)
     */
    get alphaCutoff(): number {
        return this.#alphaCutoff;
    }

    set alphaCutoff(v: number) {
        this.#alphaCutoff = Math.max(0.01, Math.min(1, v));
        this.#dirty = true;
    }

    /**
     * [KO] 잔디 표면 거칠기 값 (0.04~1.0)
     * [EN] Grass surface roughness value (0.04-1.0)
     */
    get roughness(): number {
        return this.#roughness;
    }

    set roughness(v: number) {
        this.#roughness = Math.max(0.04, Math.min(1, v));
        this.#dirty = true;
    }

    /**
     * [KO] 서브서피스 스캐터링(SSS, 잎사귀 투과광) 효과 강도 (0.0~3.0)
     * [EN] Subsurface scattering (SSS transmission) strength (0.0-3.0)
     */
    get subsurfaceStrength(): number {
        return this.#subsurfaceStrength;
    }

    set subsurfaceStrength(v: number) {
        this.#subsurfaceStrength = Math.max(0.0, Math.min(3.0, v));
        this.#dirty = true;
    }

    /**
     * [KO] 서브서피스 스캐터링 투과 색상 `[r, g, b]`
     * [EN] Subsurface scattering transmission color `[r, g, b]`
     */
    get subsurfaceColor(): [number, number, number] {
        return this.#subsurfaceColor;
    }

    set subsurfaceColor(v: [number, number, number]) {
        this.#subsurfaceColor = [v[0], v[1], v[2]];
        this.#dirty = true;
    }

    /**
     * [KO] 잔디가 배치될 특정 지형 스플랫 레이어 이름 또는 인덱스
     * [EN] Target terrain splat layer name or index for grass placement
     */
    get targetLayer(): string | number {
        return this.#targetLayer;
    }

    set targetLayer(v: string | number) {
        this.#targetLayer = v;
        this.#notifyChange();
    }

    /**
     * [KO] 지형 표면 대비 잔디 하단 접지 추가 Y 오프셋 (미터 단위)
     * [EN] Additional bottom Y offset in meters relative to terrain surface
     */
    get bottomOffset(): number {
        return this.#bottomOffset;
    }

    set bottomOffset(v: number) {
        this.#bottomOffset = v;
        this.#notifyChange();
    }

    /**
     * [KO] 그림자 수신 여부
     * [EN] Whether grass receives shadows
     */
    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    set receiveShadow(v: boolean) {
        this.#receiveShadow = v;
        this.#dirty = true;
    }

    /**
     * [KO] 수신되는 그림자의 음영 강도 (0.0~1.0)
     * [EN] Received shadow intensity (0.0-1.0)
     */
    get shadowStrength(): number {
        return this.#shadowStrength;
    }

    set shadowStrength(v: number) {
        this.#shadowStrength = Math.max(0.0, Math.min(1.0, v));
        this.#dirty = true;
    }

    /**
     * [KO] 잔디가 그림자를 투영(캐스팅)할지 여부
     * [EN] Whether grass casts shadows
     */
    get castShadow(): boolean {
        return this.#castShadow;
    }

    set castShadow(v: boolean) {
        this.#castShadow = v;
        this.#dirty = true;
    }

    /**
     * [KO] 그림자 렌더링 패스 시의 최대 컬링 거리 (미터 단위)
     * [EN] Maximum culling distance in meters applied during shadow pass
     */
    get shadowCullDistance(): number {
        return this.#shadowCullDistance;
    }

    set shadowCullDistance(v: number) {
        this.#shadowCullDistance = Math.max(0.0, v);
        this.#shadowShrinkStartDistance = this.#shadowCullDistance * 0.75;
        this.#dirty = true;
    }

    /**
     * [KO] 그림자 렌더링 시 스케일 축소가 시작되는 거리 (미터 단위)
     * [EN] Distance in meters where shadow-casting scale smoothly shrinks towards shadow culling boundary
     */
    get shadowShrinkStartDistance(): number {
        return this.#shadowShrinkStartDistance;
    }

    set shadowShrinkStartDistance(v: number) {
        this.#shadowShrinkStartDistance = Math.max(0.0, v);
        this.#dirty = true;
    }

    /**
     * [KO] 잔디 매니저 내부에서 할당하는 고유 타입 식별자 정수 (Type ID)
     * [EN] Unique type identifier integer (Type ID) assigned internally by grass manager
     */
    get typeId(): number {
        return this.#typeId;
    }

    set typeId(v: number) {
        this.#typeId = v;
    }

    /**
     * [KO] 베이킹 관련 속성 변경 시 호출될 콜백 함수를 등록합니다.
     * [EN] Registers a callback invoked whenever baking-related properties are modified.
     */
    set onChanged(cb: (() => void) | null) {
        this.#onChanged = cb;
    }

    /**
     * [KO] 렌더링 또는 유니폼 버퍼 갱신이 필요한지 여부를 나타내는 더티 플래그
     * [EN] Dirty flag indicating whether rendering or uniform buffer update is required
     */
    get dirty(): boolean {
        return this.#dirty;
    }

    /**
     * [KO] 더티 플래그를 해제하여 데이터가 최신 상태임을 표시합니다.
     * [EN] Clears the dirty flag to indicate data is in the latest state.
     */
    markClean(): void {
        this.#dirty = false;
    }

    #notifyChange(): void {
        this.#dirty = true;
        if (this.#onChanged) this.#onChanged();
    }

    /**
     * [KO] 잔디 인스턴스 및 하위 서브메쉬 리소스를 해제합니다.
     * [EN] Destroys grass instance and subordinate sub-mesh resources.
     */
    destroy(): void {
        this.#subMeshes.forEach(sub => sub.destroy());
        this.#subMeshes.length = 0;
    }
}

Object.freeze(Grass);
export default Grass;
