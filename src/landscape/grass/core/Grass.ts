import RedGPUContext from "../../../context/RedGPUContext";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import Geometry from "../../../geometry/Geometry";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import Mesh from "../../../display/mesh/Mesh";
import type Primitive from "../../../primitive/core/Primitive";
import assembleScatterRenderUnits from "../../core/scatter/assembleScatterRenderUnits";
import ScatterRenderUnit from "../../core/scatter/ScatterRenderUnit";
import AScatterType, {AScatterTypeInitOptions} from "../../core/scatter/AScatterType";
import type {GrassTypeAllocation} from "./buffer/GrassMegaBuffer";
import {GRASS_CELL_SIZE} from "./baking/GrassInstanceBaker";

/**
 * [KO] 잔디(`Grass`) 타입 생성 및 초기화를 위한 설정 옵션 인터페이스입니다.
 * [EN] Configuration options interface for creating and initializing a `Grass` type.
 * @category Landscape
 */
export interface GrassOptions extends AScatterTypeInitOptions {
    /**
     * [KO] 잔디 블레이드 지오메트리 및 재질을 추출할 원본 `Mesh` 인스턴스
     * [EN] Source `Mesh` instance from which grass blade geometry and material are extracted
     */
    mesh: Mesh;
    /**
     * [KO] 잔디 베이스 컬러 텍스처 경로 문자열 또는 `BitmapTexture` 인스턴스
     * [EN] Grass base color texture URL string or `BitmapTexture` instance
     */
    baseColorTexture?: string | BitmapTexture;
    /**
     * [KO] 인스턴스 랜덤 스케일 최솟값 `[width, height]` 또는 `[x, y, z]` (기본값: `[0.7, 0.7]`)
     * [EN] Minimum random instance scale `[width, height]` or `[x, y, z]` (default: `[0.7, 0.7]`)
     */
    minScale?: [number, number] | [number, number, number];
    /**
     * [KO] 인스턴스 랜덤 스케일 최댓값 `[width, height]` 또는 `[x, y, z]` (기본값: `[1.3, 1.4]`)
     * [EN] Maximum random instance scale `[width, height]` or `[x, y, z]` (default: `[1.3, 1.4]`)
     */
    maxScale?: [number, number] | [number, number, number];
    /**
     * [KO] 알파 컷오프 임계값 (`0.01` ~ `1.0`, 기본값: `0.2`)
     * [EN] Alpha cutoff threshold (`0.01` to `1.0`, default: `0.2`)
     */
    alphaCutoff?: number;
    /**
     * [KO] 표면 거칠기(Roughness) 계수 (`0.04` ~ `1.0`, 기본값: `0.55`)
     * [EN] Surface roughness factor (`0.04` to `1.0`, default: `0.55`)
     */
    roughness?: number;
    /**
     * [KO] 서브서피스 스캐터링(Subsurface Scattering) 투과 강도 (`0.0` ~ `3.0`, 기본값: `0.25`)
     * [EN] Subsurface scattering transmission strength (`0.0` to `3.0`, default: `0.25`)
     */
    subsurfaceStrength?: number;
    /**
     * [KO] 서브서피스 스캐터링 RGB 색상 `[r, g, b]` (`0.0` ~ `1.0`, 기본값: `[0.35, 0.65, 0.15]`)
     * [EN] Subsurface scattering RGB color `[r, g, b]` (`0.0` to `1.0`, default: `[0.35, 0.65, 0.15]`)
     */
    subsurfaceColor?: [number, number, number];
    /**
     * [KO] 밝기 노출 부스트 배율 (기본값: `1.0`)
     * [EN] Brightness exposure boost multiplier (default: `1.0`)
     */
    exposureBoost?: number;
    /**
     * [KO] 메시 로컬 바운딩 최소 Y 오프셋 (미지정 시 메시 지오메트리로부터 자동 계산)
     * [EN] Mesh local bounding minimum Y offset (automatically calculated from mesh geometry if omitted)
     */
    minY?: number;
    /**
     * [KO] 잔디 표면의 그림자 수신 여부 (기본값: `true`)
     * [EN] Whether the grass surface receives shadows (default: `true`)
     */
    receiveShadow?: boolean;
    /**
     * [KO] 수신된 그림자의 어두움 강도 (`0.0` ~ `1.0`, 기본값: `1.0`)
     * [EN] Darkness strength of received shadows (`0.0` to `1.0`, default: `1.0`)
     */
    shadowStrength?: number;
    /**
     * [KO] 할당할 최대 인스턴스 수용량
     * [EN] Maximum instance capacity to allocate
     */
    maxInstances?: number;
}

/**
 * [KO] 지형(`Landscape`) 위에 대규모로 배치되는 단일 잔디(Grass) 타입의 지오메트리, 셰이딩 속성 및 베이킹 파라미터를 관리하는 클래스입니다.
 * [EN] Class that manages geometry, shading properties, and baking parameters for a single large-scale grass type placed on a `Landscape`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 밀도 및 컬링 거리를 지정하여 잔디 타입 추가
 * // [EN] Add a grass type with density and culling distance
 * const grass = landscape.grassManager.addType({
 *     name: 'MeadowGrass',
 *     mesh: grassMesh,
 *     densityPerHectare: 50000,
 *     cullingDistance: 80
 * });
 * ```
 *
 * @see [Foliage and Impostors example](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
 * @category Landscape
 */
class Grass extends AScatterType<GrassTypeAllocation> {
    #mesh: Mesh;
    #geometry: Geometry | Primitive;
    #renderUnits: ScatterRenderUnit[] = [];
    #baseColorTexture: BitmapTexture;
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
    #maxInstances?: number;
    #instancesPerCell: number = 1;

    #slotIndex: number = -1;
    #onUniformDirty: ((typeId: number) => void) | null = null;
    #onRepopulateRequired: ((typeId: number) => void) | null = null;
    #isUnifiedGeometryOwned: boolean = false;

    /**
     * [KO] `Grass` 인스턴스를 생성합니다.
     * [EN] Creates a `Grass` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param options -
     * [KO] 잔디 타입 초기화 옵션
     * [EN] Grass type initialization options
     */
    constructor(redGPUContext: RedGPUContext, options: GrassOptions) {
        super(redGPUContext, options.name);

        const {
            mesh,
            baseColorTexture,
            minY,
            height,
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

        this.#receiveShadow = receiveShadow;

        this.setRawScatterProperties({
            height: resolvedHeight,
            bottomOffset,
            cullingDistance,
            shadowCullDistance: Math.max(15.0, Math.min(40.0, cullingDistance * 0.35)),
            targetLayer,
            minSlope,
            maxSlope,
            densityScaleByWeight,
            densityPerHectare,
            densityMultiplier,
            castShadow,
            groundBlendStrength
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

        if (maxInstances !== undefined) {
            this.#maxInstances = Math.max(1, Number(maxInstances) || 1);
        }

        this.#updateInstancesPerCell();
    }

    /**
     * [KO] 어셈블리되어 통합된 잔디 `Geometry` 또는 `Primitive` 인스턴스를 반환합니다.
     * [EN] Returns the assembled and unified grass `Geometry` or `Primitive` instance.
     * @returns
     * [KO] `Geometry` 또는 `Primitive` 인스턴스
     * [EN] `Geometry` or `Primitive` instance
     */
    get geometry(): Geometry | Primitive {
        return this.#geometry;
    }

    /**
     * [KO] 잔디 생성에 사용된 원본 `Mesh` 인스턴스를 반환합니다.
     * [EN] Returns the source `Mesh` instance used to create the grass.
     * @returns
     * [KO] 원본 `Mesh` 인스턴스
     * [EN] Source `Mesh` instance
     */
    get mesh(): Mesh {
        return this.#mesh;
    }

    /**
     * [KO] 잔디 렌더링에 사용되는 `ScatterRenderUnit` 배열을 반환합니다.
     * [EN] Returns the array of `ScatterRenderUnit` instances used for grass rendering.
     * @returns
     * [KO] `ScatterRenderUnit` 배열
     * [EN] Array of `ScatterRenderUnit`
     */
    get renderUnits(): ScatterRenderUnit[] {
        return this.#renderUnits;
    }

    /**
     * [KO] 근거리(Near)와 원거리(Far) 잔디 버킷이 분리되는 기준 거리(미터 단위)를 반환합니다.
     * [EN] Returns the threshold distance in meters separating near and far grass buckets.
     * @returns
     * [KO] 근/원거리 분리 기준 거리 (미터)
     * [EN] Near/far separation distance in meters
     */
    get farDistance(): number {
        return Math.max(15.0, Math.min(40.0, this.cullingDistance * 0.35));
    }

    /**
     * [KO] 잔디의 베이스 컬러 `BitmapTexture`를 반환합니다.
     * [EN] Returns the base color `BitmapTexture` of the grass.
     * @returns
     * [KO] `BitmapTexture` 인스턴스
     * [EN] `BitmapTexture` instance
     */
    get baseColorTexture(): BitmapTexture {
        return this.#baseColorTexture;
    }

    /**
     * [KO] 잔디 베이스 컬러 텍스처의 `GPUTextureView`를 반환합니다.
     * [EN] Returns the `GPUTextureView` of the grass base color texture.
     * @returns
     * [KO] `GPUTextureView` 인스턴스
     * [EN] `GPUTextureView` instance
     */
    get baseColorTextureView(): GPUTextureView {
        const {resourceManager} = this;
        const {emptyBitmapTextureView} = resourceManager;
        return resourceManager.getGPUResourceBitmapTextureView(this.#baseColorTexture)
            ?? emptyBitmapTextureView;
    }

    /**
     * [KO] 잔디 그리드 셀(Cell) 하나당 생성되는 인스턴스 개수를 반환합니다.
     * [EN] Returns the number of instances generated per grass grid cell.
     * @returns
     * [KO] 셀당 인스턴스 개수
     * [EN] Number of instances per cell
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
            this.onParameterChanged('minScale');
        }
    }

    /**
     * [KO] 인스턴스 랜덤 스케일의 최솟값 `[width, height]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the minimum random instance scale `[width, height]`.
     * @returns
     * [KO] 최소 스케일 튜플 `[width, height]`
     * [EN] Minimum scale tuple `[width, height]`
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
            this.onParameterChanged('maxScale');
        }
    }

    /**
     * [KO] 인스턴스 랜덤 스케일의 최댓값 `[width, height]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum random instance scale `[width, height]`.
     * @returns
     * [KO] 최대 스케일 튜플 `[width, height]`
     * [EN] Maximum scale tuple `[width, height]`
     */
    get maxScale(): [number, number] {
        return this.#maxScale;
    }

    set exposureBoost(v: number) {
        const val = Math.max(0.1, Number(v) || 0.1);
        if (this.#exposureBoost !== val) {
            this.#exposureBoost = val;
            this.onParameterChanged('exposureBoost');
        }
    }

    /**
     * [KO] 메시 로컬 바운딩의 최소 Y 오프셋을 반환합니다.
     * [EN] Returns the minimum Y offset of the mesh local bounding box.
     * @returns
     * [KO] 최소 Y 오프셋
     * [EN] Minimum Y offset
     */
    get minY(): number {
        return this.#minY;
    }

    /**
     * [KO] 밝기 노출 부스트 배율을 반환하거나 설정합니다.
     * [EN] Gets or sets the brightness exposure boost multiplier.
     * @returns
     * [KO] 노출 부스트 배율
     * [EN] Exposure boost multiplier
     */
    get exposureBoost(): number {
        return this.#exposureBoost;
    }

    set alphaCutoff(v: number) {
        const val = Math.max(0.01, Math.min(1, Number(v) || 0.01));
        if (this.#alphaCutoff !== val) {
            this.#alphaCutoff = val;
            this.onParameterChanged('alphaCutoff');
        }
    }

    /**
     * [KO] 알파 컷오프 임계값(`0.01` ~ `1.0`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the alpha cutoff threshold (`0.01` to `1.0`).
     * @returns
     * [KO] 알파 컷오프 값
     * [EN] Alpha cutoff value
     */
    get alphaCutoff(): number {
        return this.#alphaCutoff;
    }

    set roughness(v: number) {
        const val = Math.max(0.04, Math.min(1, Number(v) || 0.04));
        if (this.#roughness !== val) {
            this.#roughness = val;
            this.onParameterChanged('roughness');
        }
    }

    /**
     * [KO] 표면 거칠기(Roughness) 계수(`0.04` ~ `1.0`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the surface roughness factor (`0.04` to `1.0`).
     * @returns
     * [KO] 거칠기 계수
     * [EN] Roughness factor
     */
    get roughness(): number {
        return this.#roughness;
    }

    set subsurfaceStrength(v: number) {
        const val = Math.max(0.0, Math.min(3.0, Number(v) || 0.0));
        if (this.#subsurfaceStrength !== val) {
            this.#subsurfaceStrength = val;
            this.onParameterChanged('subsurfaceStrength');
        }
    }

    /**
     * [KO] 서브서피스 스캐터링(Subsurface Scattering) 투과 강도(`0.0` ~ `3.0`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the subsurface scattering transmission strength (`0.0` to `3.0`).
     * @returns
     * [KO] 서브서피스 투과 강도
     * [EN] Subsurface transmission strength
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
            this.onParameterChanged('subsurfaceColor');
        }
    }

    /**
     * [KO] 서브서피스 스캐터링 RGB 색상 `[r, g, b]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the subsurface scattering RGB color `[r, g, b]`.
     * @returns
     * [KO] 서브서피스 RGB 색상 튜플 `[r, g, b]`
     * [EN] Subsurface RGB color tuple `[r, g, b]`
     */
    get subsurfaceColor(): [number, number, number] {
        return this.#subsurfaceColor;
    }

    set receiveShadow(v: boolean) {
        const boolVal = !!v;
        if (this.#receiveShadow !== boolVal) {
            this.#receiveShadow = boolVal;
            this.onParameterChanged('receiveShadow');
        }
    }

    /**
     * [KO] 잔디 표면의 그림자 수신 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the grass surface receives shadows.
     * @returns
     * [KO] 그림자 수신 여부
     * [EN] Whether shadows are received
     */
    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    set shadowStrength(v: number) {
        const val = Math.max(0.0, Math.min(1.0, Number(v) || 0.0));
        if (this.#shadowStrength !== val) {
            this.#shadowStrength = val;
            this.onParameterChanged('shadowStrength');
        }
    }

    /**
     * [KO] 수신된 그림자의 어두움 강도(`0.0` ~ `1.0`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the darkness strength of received shadows (`0.0` to `1.0`).
     * @returns
     * [KO] 그림자 강도
     * [EN] Shadow strength
     */
    get shadowStrength(): number {
        return this.#shadowStrength;
    }

    /**
     * [KO] 잔디 그림자가 렌더링되는 최대 컬링 거리를 반환합니다 (`farDistance`로부터 자동 파생).
     * [EN] Returns the maximum culling distance at which grass shadows are rendered (auto-derived from `farDistance`).
     * @returns
     * [KO] 그림자 컬링 거리 (미터)
     * [EN] Shadow culling distance in meters
     */
    override get shadowCullDistance(): number {
        return this.farDistance;
    }

    override set shadowCullDistance(_val: number) {
        console.warn(`[Grass] "${this.name}": shadowCullDistance is auto-derived from farDistance and cannot be set directly.`);
    }

    /**
     * [KO] 잔디 그림자 페이드아웃이 시작되는 거리를 반환합니다 (`shadowCullDistance * 0.5`).
     * [EN] Returns the distance at which grass shadow fade-out begins (`shadowCullDistance * 0.5`).
     * @returns
     * [KO] 그림자 페이드 시작 거리 (미터)
     * [EN] Shadow fade start distance in meters
     */
    get shadowFadeStartDistance(): number {
        return this.shadowCullDistance * 0.5;
    }

    set shadowFadeStartDistance(_val: number) {
        console.warn(`[Grass] "${this.name}": shadowFadeStartDistance is auto-calculated and cannot be set directly.`);
    }

    /**
     * [KO] 유니폼 파라미터 변경 시 호출될 콜백 함수를 설정합니다.
     * [EN] Sets the callback function to be invoked when uniform parameters change.
     *
     * @param cb -
     * [KO] 타입 ID를 인자로 받는 콜백 함수 또는 `null`
     * [EN] Callback function receiving the type ID, or `null`
     */
    set onUniformDirty(cb: ((typeId: number) => void) | null) {
        this.#onUniformDirty = cb;
    }

    /**
     * [KO] 인스턴스 리베이크(재배치)가 필요할 때 호출될 콜백 함수를 설정합니다.
     * [EN] Sets the callback function to be invoked when instance rebaking (repopulation) is required.
     *
     * @param cb -
     * [KO] 타입 ID를 인자로 받는 콜백 함수 또는 `null`
     * [EN] Callback function receiving the type ID, or `null`
     */
    set onRepopulateRequired(cb: ((typeId: number) => void) | null) {
        this.#onRepopulateRequired = cb;
    }

    /**
     * [KO] 카메라 주변 잔디 인스턴스가 베이킹되는 반경(미터 단위)을 반환합니다.
     * [EN] Returns the radius in meters around the camera within which grass instances are baked.
     * @returns
     * [KO] 베이킹 반경 (미터)
     * [EN] Bake radius in meters
     */
    get bakeRadius(): number {
        const margin = Math.max(GRASS_CELL_SIZE * 2, this.cullingDistance * 0.2);
        return this.cullingDistance + margin;
    }

    /**
     * [KO] 이 잔디 타입에 할당된 최대 인스턴스 수용량을 반환합니다.
     * [EN] Returns the maximum instance capacity allocated to this grass type.
     * @returns
     * [KO] 최대 인스턴스 수 또는 미할당 시 `undefined`
     * [EN] Maximum instance count, or `undefined` if unallocated
     */
    get maxInstances(): number | undefined {
        return this.allocation?.maxInstances ?? this.#maxInstances;
    }

    /**
     * [KO] 현재 베이킹되어 활성화된 총 잔디 인스턴스 수를 반환합니다.
     * [EN] Returns the total number of currently baked and active grass instances.
     * @returns
     * [KO] 활성 인스턴스 수
     * [EN] Active instance count
     */
    get activeInstanceCount(): number {
        return this.allocation?.instanceCount ?? 0;
    }

    /**
     * [KO] `GrassSlotPooler`에서 할당된 UBO 슬롯 인덱스를 반환하거나 설정합니다.
     * [EN] Gets or sets the UBO slot index allocated from `GrassSlotPooler`.
     * @returns
     * [KO] 할당된 슬롯 인덱스 (미할당 시 `-1`)
     * [EN] Allocated slot index (`-1` if unallocated)
     */
    get slotIndex(): number {
        return this.#slotIndex;
    }

    /**
     * [KO] 스캐터 또는 재질 속성이 변경되었을 때 호출되어 리베이크 또는 UBO 갱신을 트리거합니다.
     * [EN] Invoked when a scatter or material property changes, triggering rebaking or UBO update.
     *
     * @param prop -
     * [KO] 변경된 속성 이름
     * [EN] Name of the changed property
     */
    override onParameterChanged(prop: string): void {
        switch (prop) {
            case 'bottomOffset':
            case 'targetLayer':
            case 'minSlope':
            case 'maxSlope':
            case 'densityScaleByWeight':
            case 'minScale':
            case 'maxScale':
                this.#notifyRepopulateRequired();
                break;

            case 'densityPerHectare':
            case 'densityMultiplier':
                this.#updateInstancesPerCell();
                this.#notifyRepopulateRequired();
                break;

            case 'cullingDistance':
                this.#notifyRepopulateRequired();
                this.#notifyUniformDirty();
                break;

            case 'exposureBoost':
            case 'alphaCutoff':
            case 'roughness':
            case 'subsurfaceStrength':
            case 'subsurfaceColor':
            case 'receiveShadow':
            case 'shadowStrength':
            case 'castShadow':
            case 'groundBlendStrength':
                this.#notifyUniformDirty();
                break;
        }
    }

    #notifyUniformDirty(): void {
        this.#onUniformDirty?.(this.typeId);
    }

    #updateInstancesPerCell(): void {
        const {densityPerHectare, densityMultiplier} = this;
        this.#instancesPerCell = Math.max(1, Math.round((densityPerHectare * 256.0 / 10000.0) * densityMultiplier));
    }

    /**
     * [KO] 잔디 타입이 소유한 통합 지오메트리 및 관련 리소스를 해제합니다.
     * [EN] Releases the unified geometry owned by the grass type and associated resources.
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

