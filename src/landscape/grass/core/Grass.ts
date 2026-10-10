/**
 * [KO] 단일 잔디(Grass) 타입의 메쉬, 텍스처, 밀도, 셰이딩 파라미터를 관리하는 핵심 엔티티 모듈입니다.
 * [EN] Core entity module managing mesh, texture, density, and shading parameters for a single grass type.
 * @packageDocumentation
 */
import RedGPUContext from "../../../context/RedGPUContext";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import Geometry from "../../../geometry/Geometry";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import Mesh from "../../../display/mesh/Mesh";
import type Primitive from "../../../primitive/core/Primitive";
import assembleScatterRenderUnits from "../../core/scatter/assembleScatterRenderUnits";
import ScatterRenderUnit from "../../core/scatter/ScatterRenderUnit";
import AScatterType, {AScatterTypeInitOptions} from "../../core/scatter/AScatterType";
import type {GrassTypeAllocation} from "./buffer/GrassScatterMegaBuffer";

/**
 * [KO] 잔디(Grass) 인스턴스 생성 시 전달되는 설정 옵션 인터페이스입니다.
 * [EN] Configuration options interface passed when creating a Grass instance.
 */
export interface GrassOptions extends AScatterTypeInitOptions {
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
     * [KO] 그림자 렌더링 시 페이드(스케일 축소)가 시작되는 거리 (기본값: shadowCullDistance * 0.75)
     * [EN] Distance where shadow-casting fade smoothly begins towards shadow culling boundary (default: shadowCullDistance * 0.75)
     */
    shadowFadeStartDistance?: number;
    /**
     * [KO] 서브셀 스트리밍 활성 반경 (미터, 미지정 시 cullingDistance * 1.15 또는 매니저 기본값 사용)
     * [EN] Active sub-cell streaming radius in meters (falls back to cullingDistance * 1.15 or manager default if omitted)
     */
    streamingRadius?: number;
    /**
     * [KO] 이 잔디 타입에 할당될 최대 인스턴스 수용 용량 (미지정 시 스트리밍 반경 및 밀도로 자동 계산)
     * [EN] Maximum instance capacity allocated for this grass type (auto-calculated from streaming radius and density if omitted)
     */
    maxInstances?: number;
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
class Grass extends AScatterType<GrassTypeAllocation> {
    #mesh: Mesh;
    #geometry: Geometry | Primitive;
    #renderUnits: ScatterRenderUnit[] = [];
    #baseColorTexture: BitmapTexture;
    #farDistance: number = 35.0;
    #minScale: [number, number] = [0.7, 0.7];
    #maxScale: [number, number] = [1.3, 1.4];
    #minY: number = 0.0;
    #exposureBoost: number = 1.0;
    #subsurfaceStrength: number = 0.25;
    #subsurfaceColor: [number, number, number] = [0.35, 0.65, 0.15];
    #alphaCutoff: number = 0.2;
    #roughness: number = 0.55;
    #receiveShadow: boolean = true;
    #shadowStrength: number = 1.0;
    #shadowFadeStartDistance: number = 26.25;
    #maxInstances?: number;
    #instancesPerCell: number = 1;

    #slotIndex: number = -1;
    #onUniformDirty: ((typeId: number) => void) | null = null;
    #onRepopulateRequired: ((typeId: number) => void) | null = null;
    #isUnifiedGeometryOwned: boolean = false;

    /**
     * [KO] Grass 인스턴스를 생성하고 초기 속성을 설정합니다. (사용자가 직접 생성하지 마시고 `landscape.grassManager.addType(options)` 메서드를 사용하십시오.)
     * [EN] Creates a Grass instance and initializes properties. (Do not instantiate directly; use the `landscape.grassManager.addType(options)` method instead.)
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param options -
     * [KO] 잔디 설정 옵션 객체
     * [EN] Grass configuration options object
     */
    constructor(redGPUContext: RedGPUContext, options: GrassOptions) {
        super(redGPUContext, options.name);

        const {
            mesh,
            baseColorTexture,
            minY,
            height,
            farDistance = 35.0,
            receiveShadow = true,
            densityPerHectare = 5000.0,
            densityMultiplier = 1.0,
            densityScaleByWeight = true,
            minSlope = 0.0,
            maxSlope = 35.0,
            cullingDistance = 100.0,
            minScale,
            maxScale,
            groundBlendStrength = 1.0,
            alphaCutoff = 0.2,
            roughness,
            subsurfaceStrength = 0.25,
            subsurfaceColor,
            exposureBoost = 1.0,
            targetLayer = '',
            bottomOffset = 0.0,
            shadowStrength = 1.0,
            castShadow = true,
            shadowCullDistance,
            shadowFadeStartDistance,
            streamingRadius,
            maxInstances
        } = options;

        if (!mesh) {
            consoleAndThrowError(`[Grass] options.mesh is required and must contain a valid Mesh instance!`);
        }
        this.#mesh = mesh;

        const {
            groups,
            unifiedGeometry,
            minY: assembledMinY,
            boundingHeight,
            renderUnits
        } = assembleScatterRenderUnits(redGPUContext, mesh, {
            preservePivot: true,
            centerXZ: false
        });
        if (groups.length === 0 || !unifiedGeometry) {
            consoleAndThrowError(`[Grass] Failed to extract any valid geometry from mesh!`);
        }
        this.#geometry = unifiedGeometry;
        this.#isUnifiedGeometryOwned = true;

        const {material: targetMaterial} = groups[0];

        const resolvedTexture = baseColorTexture ?? targetMaterial.baseColorTexture;
        if (typeof resolvedTexture === 'string') {
            this.#baseColorTexture = new BitmapTexture(redGPUContext, resolvedTexture);
        } else if (resolvedTexture) {
            this.#baseColorTexture = resolvedTexture;
        }

        this.#minY = minY ?? assembledMinY;
        const resolvedHeight = height ?? (boundingHeight > 0 ? boundingHeight : 1.0);

        this.#renderUnits = renderUnits;
        if (this.#baseColorTexture) {
            this.#renderUnits[0].baseColorTexture = this.#baseColorTexture;
        }

        if (this.#renderUnits.length > 1) {
            console.warn(
                `[Grass] "${this.name}" has ${this.#renderUnits.length} render units with distinct materials. ` +
                `For optimal grass rendering performance (millions of blades), merging textures into an atlas and using a single material is strongly recommended.`
            );
        }

        this.#farDistance = Math.max(10.0, farDistance);
        this.#receiveShadow = receiveShadow;

        const resolvedShadowCullDistance = shadowCullDistance !== undefined ? Math.max(0.0, shadowCullDistance) : 35.0;
        const resolvedStreamingRadius = streamingRadius !== undefined
            ? Math.max(16.0, Number(streamingRadius) || 16.0)
            : Math.max(120.0, cullingDistance * 1.15);

        this.setRawScatterProperties({
            height: resolvedHeight,
            bottomOffset,
            cullingDistance,
            shadowCullDistance: resolvedShadowCullDistance,
            targetLayer,
            minSlope,
            maxSlope,
            densityScaleByWeight,
            densityPerHectare,
            densityMultiplier,
            castShadow,
            groundBlendStrength,
            streamingRadius: resolvedStreamingRadius
        });

        if (minScale) {
            const [sx, sy] = minScale;
            this.#minScale[0] = sx;
            this.#minScale[1] = sy;
        }
        if (maxScale) {
            const [sx, sy] = maxScale;
            this.#maxScale[0] = sx;
            this.#maxScale[1] = sy;
        }

        this.#alphaCutoff = alphaCutoff;
        this.#roughness = roughness ?? targetMaterial.roughnessFactor ?? targetMaterial.roughness ?? 0.55;

        this.#subsurfaceStrength = subsurfaceStrength;
        if (subsurfaceColor) {
            const [r, g, b] = subsurfaceColor;
            this.#subsurfaceColor[0] = r;
            this.#subsurfaceColor[1] = g;
            this.#subsurfaceColor[2] = b;
        }
        this.#exposureBoost = exposureBoost;
        this.#shadowStrength = shadowStrength;
        this.#shadowFadeStartDistance = shadowFadeStartDistance !== undefined
            ? Math.max(0.0, shadowFadeStartDistance)
            : this.shadowCullDistance * 0.75;

        if (maxInstances !== undefined) {
            this.#maxInstances = Math.max(1, Number(maxInstances) || 1);
        }

        this.#updateInstancesPerCell();
    }

    /**
     * [KO] 잔디 렌더링에 사용되는 지오메트리 객체
     * [EN] Geometry instance used for grass rendering
     */
    get geometry(): Geometry | Primitive {
        return this.#geometry;
    }

    /**
     * [KO] 잔디 렌더링에 사용되는 기본 메쉬 객체
     * [EN] Base Mesh instance used for grass rendering
     */
    get mesh(): Mesh {
        return this.#mesh;
    }

    /**
     * [KO] 잔디 모델을 구성하는 공용 렌더 단위(ScatterRenderUnit) 목록을 반환합니다.
     * [EN] Returns the list of shared render units (ScatterRenderUnit) composing the grass model.
     */
    get renderUnits(): ScatterRenderUnit[] {
        return this.#renderUnits;
    }


    /**
     * [KO] 이 잔디 타입이 메인 렌더 패스(Near + Far)에서 발행하는 실제 간접 드로우콜 총 개수를 반환합니다.
     * [EN] Returns the actual number of indirect draw calls dispatched by this grass type in the main render pass.
     */
    override get drawCallCount(): number {
        const alloc = this.allocation;
        if (alloc?.instanceCount > 0) {
            const {nearSlots, farSlots} = alloc;
            return nearSlots.length + farSlots.length;
        }
        return this.#renderUnits.length * 2;
    }

    /**
     * [KO] 원거리 간소화 셰이더(Far Grass)로 전환을 시작하는 거리 (미터 단위)
     * [EN] Transition distance in meters where far grass shader is engaged
     */
    get farDistance(): number {
        return this.#farDistance;
    }

    set farDistance(v: number) {
        const val = Math.max(10.0, Number(v) || 10.0);
        if (this.#farDistance !== val) {
            this.#farDistance = val;
            this.onParameterChanged('farDistance', val);
        }
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
        const {resourceManager} = this;
        const {emptyBitmapTextureView} = resourceManager;
        return resourceManager.getGPUResourceBitmapTextureView(this.#baseColorTexture)
            || emptyBitmapTextureView;
    }

    /**
     * [KO] 단일 지형 그리드 셀(16m x 16m) 당 생성되는 인스턴스 수량 계산값
     * [EN] Computed number of instances generated per terrain grid cell (16m x 16m)
     */
    get instancesPerCell(): number {
        return this.#instancesPerCell;
    }

    set minScale(v: [number, number] | [number, number, number]) {
        if (!v) return;
        const [vx, vy] = v;
        const s = this.#minScale;
        const sx = Math.max(0.01, Number(vx) || 0.01);
        const sy = Math.max(0.01, Number(vy) || 0.01);
        if (s[0] !== sx || s[1] !== sy) {
            s[0] = sx;
            s[1] = sy;
            this.onParameterChanged('minScale', s);
        }
    }


    /**
     * [KO] 잔디 인스턴스의 최소 스케일 [수평(XZ), 수직(Y)]
     * [EN] Minimum scale [horizontal(XZ), vertical(Y)] for grass instances
     */
    get minScale(): [number, number] {
        return this.#minScale;
    }

    set maxScale(v: [number, number] | [number, number, number]) {
        if (!v) return;
        const [vx, vy] = v;
        const s = this.#maxScale;
        const sx = Math.max(0.01, Number(vx) || 0.01);
        const sy = Math.max(0.01, Number(vy) || 0.01);
        if (s[0] !== sx || s[1] !== sy) {
            s[0] = sx;
            s[1] = sy;
            this.onParameterChanged('maxScale', s);
        }
    }

    /**
     * [KO] 잔디 인스턴스의 최대 스케일 [수평(XZ), 수직(Y)]
     * [EN] Maximum scale [horizontal(XZ), vertical(Y)] for grass instances
     */
    get maxScale(): [number, number] {
        return this.#maxScale;
    }

    set exposureBoost(v: number) {
        const val = Math.max(0.1, Number(v) || 0.1);
        if (this.#exposureBoost !== val) {
            this.#exposureBoost = val;
            this.onParameterChanged('exposureBoost', val);
        }
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

    set alphaCutoff(v: number) {
        const val = Math.max(0.01, Math.min(1, Number(v) || 0.01));
        if (this.#alphaCutoff !== val) {
            this.#alphaCutoff = val;
            this.onParameterChanged('alphaCutoff', val);
        }
    }



    /**
     * [KO] 알파 테스트 컷오프 임계값 (0.01~1.0)
     * [EN] Alpha test cutoff threshold (0.01-1.0)
     */
    get alphaCutoff(): number {
        return this.#alphaCutoff;
    }

    set roughness(v: number) {
        const val = Math.max(0.04, Math.min(1, Number(v) || 0.04));
        if (this.#roughness !== val) {
            this.#roughness = val;
            this.onParameterChanged('roughness', val);
        }
    }

    /**
     * [KO] 잔디 표면 거칠기 값 (0.04~1.0)
     * [EN] Grass surface roughness value (0.04-1.0)
     */
    get roughness(): number {
        return this.#roughness;
    }

    set subsurfaceStrength(v: number) {
        const val = Math.max(0.0, Math.min(3.0, Number(v) || 0.0));
        if (this.#subsurfaceStrength !== val) {
            this.#subsurfaceStrength = val;
            this.onParameterChanged('subsurfaceStrength', val);
        }
    }

    /**
     * [KO] 서브서피스 스캐터링(SSS, 잎사귀 투과광) 효과 강도 (0.0~3.0)
     * [EN] Subsurface scattering (SSS transmission) strength (0.0-3.0)
     */
    get subsurfaceStrength(): number {
        return this.#subsurfaceStrength;
    }

    set subsurfaceColor(v: [number, number, number]) {
        if (!v) return;
        const [vr, vg, vb] = v;
        const c = this.#subsurfaceColor;
        const r = Number(vr) || 0;
        const g = Number(vg) || 0;
        const b = Number(vb) || 0;
        if (c[0] !== r || c[1] !== g || c[2] !== b) {
            c[0] = r;
            c[1] = g;
            c[2] = b;
            this.onParameterChanged('subsurfaceColor', c);
        }
    }

    /**
     * [KO] 서브서피스 스캐터링 투과 색상 `[r, g, b]`
     * [EN] Subsurface scattering transmission color `[r, g, b]`
     */
    get subsurfaceColor(): [number, number, number] {
        return this.#subsurfaceColor;
    }

    set receiveShadow(v: boolean) {
        const boolVal = !!v;
        if (this.#receiveShadow !== boolVal) {
            this.#receiveShadow = boolVal;
            this.onParameterChanged('receiveShadow', boolVal);
        }
    }



    /**
     * [KO] 그림자 수신 여부
     * [EN] Whether grass receives shadows
     */
    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    set shadowStrength(v: number) {
        const val = Math.max(0.0, Math.min(1.0, Number(v) || 0.0));
        if (this.#shadowStrength !== val) {
            this.#shadowStrength = val;
            this.onParameterChanged('shadowStrength', val);
        }
    }

    /**
     * [KO] 수신되는 그림자의 음영 강도 (0.0~1.0)
     * [EN] Received shadow intensity (0.0-1.0)
     */
    get shadowStrength(): number {
        return this.#shadowStrength;
    }

    set shadowFadeStartDistance(v: number) {
        const val = Math.max(0.0, Number(v) || 0.0);
        if (this.#shadowFadeStartDistance !== val) {
            this.#shadowFadeStartDistance = val;
            this.onParameterChanged('shadowFadeStartDistance', val);
        }
    }



    /**
     * [KO] 그림자 렌더링 시 페이드(스케일 축소)가 시작되는 거리 (미터 단위)
     * [EN] Distance in meters where shadow-casting fade smoothly begins towards shadow culling boundary
     */
    get shadowFadeStartDistance(): number {
        return this.#shadowFadeStartDistance;
    }

    /**
     * [KO] 잔디 렌더링/셰이딩 UBO 파라미터 변경 시 호출되는 콜백 함수를 등록합니다.
     * [EN] Registers a callback invoked whenever grass rendering/shading UBO parameters change.
     */
    set onUniformDirty(cb: ((typeId: number) => void) | null) {
        this.#onUniformDirty = cb;
    }

    /**
     * [KO] 잔디 배치 관련 속성 변경 시 인스턴스 전체 재스폰(Re-populate)을 요청하는 콜백 함수를 등록합니다.
     * [EN] Registers a callback invoked whenever placement-related properties change to request full instance re-population.
     */
    set onRepopulateRequired(cb: ((typeId: number) => void) | null) {
        this.#onRepopulateRequired = cb;
    }

    override onParameterChanged(prop: string, value: any, prevValue?: any): void {
        switch (prop) {
            case 'bottomOffset':
            case 'targetLayer':
            case 'minSlope':
            case 'maxSlope':
            case 'densityScaleByWeight':
            case 'streamingRadius':
            case 'minScale':
            case 'maxScale':
                this.#notifyRepopulateRequired();
                break;

            case 'densityPerHectare':
            case 'densityMultiplier':
                this.#updateInstancesPerCell();
                this.#notifyRepopulateRequired();
                break;

            case 'cullingDistance': {
                const cDist = value as number;
                if (cDist * 1.15 > this.streamingRadius) {
                    this.streamingRadius = cDist * 1.15;
                    this.#notifyRepopulateRequired();
                } else {
                    this.#notifyUniformDirty();
                }
                break;
            }

            case 'shadowCullDistance':
                this.#shadowFadeStartDistance = (value as number) * 0.75;
                this.#notifyUniformDirty();
                break;

            case 'farDistance':
            case 'exposureBoost':
            case 'alphaCutoff':
            case 'roughness':
            case 'subsurfaceStrength':
            case 'subsurfaceColor':
            case 'receiveShadow':
            case 'shadowStrength':
            case 'shadowFadeStartDistance':
            case 'castShadow':
            case 'groundBlendStrength':
                this.#notifyUniformDirty();
                break;
        }
    }

    /**
     * [KO] 이 잔디 타입에 할당된 최대 인스턴스 수용 용량을 반환합니다. (메가버퍼 세그먼트 할당 용량이 우선 적용됨)
     * [EN] Returns the maximum instance capacity allocated for this grass type. (Mega-buffer segment capacity takes precedence)
     */
    get maxInstances(): number | undefined {
        return this.allocation?.maxInstances ?? this.#maxInstances;
    }

    /**
     * [KO] 현재 스트리밍되어 GPU 버퍼 상에 활성화된 인스턴스 수를 반환합니다.
     * [EN] Returns the number of instances currently active and loaded into GPU buffers.
     */
    get activeInstanceCount(): number {
        return this.allocation?.instanceCount ?? 0;
    }

    /**
     * [KO] 잔디 인스턴스 및 하위 서브메쉬 리소스를 해제합니다.
     * [EN] Destroys grass instance and subordinate sub-mesh resources.
     */
    override destroy(): void {
        this.#slotIndex = -1;
        if (this.#isUnifiedGeometryOwned && this.#geometry instanceof Geometry) {
            this.#geometry.destroy();
        }
        this.#isUnifiedGeometryOwned = false;
        this.#geometry = null as any;
        this.#renderUnits.length = 0;
        this.#baseColorTexture = null as any;
        this.#mesh = null as any;
        this.#onUniformDirty = null;
        this.#onRepopulateRequired = null;
        super.destroy();
    }

    #notifyUniformDirty(): void {
        this.#onUniformDirty?.(this.typeId);
    }

    #updateInstancesPerCell(): void {
        const {densityPerHectare, densityMultiplier} = this;
        this.#instancesPerCell = Math.max(1, Math.round((densityPerHectare * 256.0 / 10000.0) * densityMultiplier));
    }

    /**
     * [KO] 256바이트 정렬 Dynamic Offset UBO 슬롯 인덱스 (0 ~ 255)
     * [EN] 256-byte aligned Dynamic Offset UBO slot index (0 ~ 255)
     */
    get slotIndex(): number {
        return this.#slotIndex;
    }

    set slotIndex(val: number) {
        this.#slotIndex = val;
    }

    #notifyRepopulateRequired(): void {
        this.#onRepopulateRequired?.(this.typeId);
        this.#onUniformDirty?.(this.typeId);
    }
}

Object.freeze(Grass);
export default Grass;
