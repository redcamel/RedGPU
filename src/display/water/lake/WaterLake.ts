import RedGPUContext from "../../../context/RedGPUContext";
import Plane from "../../../primitive/Plane";
import Mesh from "../../mesh/Mesh";
import SingleLayerWaterMaterial from "../core/SingleLayerWaterMaterial";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import vertexModuleSource from "./shader/waterLakeVertex.wgsl";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";

/** WaterLake 전용 버텍스 셰이더 모듈 이름 */
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_WATER_LAKE';

interface WaterLake {
    /**
     * [KO] 미세 장파장 너울의 진폭 (단위: m, 기본값: 0.02 = 2cm)
     * [EN] Amplitude of micro long-wavelength swell (Unit: m, default: 0.02 = 2cm)
     */
    waveAmplitude: number;
    /**
     * [KO] 미세 너울의 파장 (단위: m, 기본값: 12.0m)
     * [EN] Wavelength of micro swell (Unit: m, default: 12.0m)
     */
    waveWavelength: number;
    /**
     * [KO] 미세 너울의 전파 속도 (기본값: 0.8 rad/s)
     * [EN] Propagation speed of micro swell (default: 0.8 rad/s)
     */
    waveSpeed: number;
}

/**
 * [KO] 언리얼 엔진 5(UE5)의 AWaterBodyLake에 대응하는 호수/연못 수체(Water) 컴포넌트 클래스입니다.
 * [EN] Water component class for lakes and ponds corresponding to Unreal Engine 5 (UE5) AWaterBodyLake.
 *
 * [KO] Cook-Torrance GGX PBR 물리 조명 모델, 듀얼 노멀 스크롤링, 스넬의 굴절 왜곡, 비어-람베르트(Beer-Lambert) 수심 흡수 그라데이션, 수면 미세 정점 너울(Swell)을 기본 제공합니다.
 * [EN] Provides Cook-Torrance GGX PBR physical lighting model, dual normal scrolling, Snell's law refraction distortion, Beer-Lambert depth extinction gradient, and micro swell vertex displacement out of the box.
 *
 * [KO] 파이프라인 안전성을 위해 지오메트리(`Plane`)와 머티리얼(`SingleLayerWaterMaterial`)은 내부에서 자동 생성되며, 외부 교체가 차단(Read-only)됩니다. 크기 변경은 `resize()` 메서드를 이용하십시오.
 * [EN] For pipeline safety, geometry (`Plane`) and material (`SingleLayerWaterMaterial`) are automatically generated internally and cannot be replaced externally (Read-only). To change dimensions, use the `resize()` method.
 *
 * ### Example
 * ```typescript
 * const lake = new RedGPU.Display.Water.WaterLake(redGPUContext, 1000, 1000);
 * lake.waterLevel = 10;
 * scene.addChild(lake);
 * ```
 *
 * @category Display
 */
class WaterLake extends Mesh {
    #waterWidth: number;
    #waterHeight: number;
    #widthSegments: number;
    #heightSegments: number;

    /**
     * [KO] WaterLake 생성자
     * [EN] WaterLake constructor
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param width - 호수의 가로 너비 (기본값: 100)
     * @param height - 호수의 세로 길이 (기본값: 100)
     * @param widthSegments - 가로 세그먼트 분할 수 (기본값: 64)
     * @param heightSegments - 세로 세그먼트 분할 수 (기본값: 64)
     * @param name - 수체 오브젝트 이름 (기본값: 'WaterLake')
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 100,
        height: number = 100,
        widthSegments: number = 64,
        heightSegments: number = 64,
        name: string = 'WaterLake'
    ) {
        const waterMaterial = new SingleLayerWaterMaterial(redGPUContext);
        const waterGeometry = new Plane(redGPUContext, width, height, widthSegments, heightSegments);

        super(redGPUContext, waterGeometry, waterMaterial, name);

        this.#waterWidth = width;
        this.#waterHeight = height;
        this.#widthSegments = widthSegments;
        this.#heightSegments = heightSegments;

        // XZ 평면(수평 수면)으로 기본 배치
        this.rotationX = -90;

        // 반투명 수면 블렌딩을 위해 뎁스 쓰기 비활성화 (배경 및 물밑 오브젝트 정상 렌더링)
        this.depthStencilState.depthWriteEnabled = false;

        // 수면 위와 물밑 양방향 시야를 위해 cullMode를 NONE으로 기본 구성
        this.primitiveState.cullMode = GPU_CULL_MODE.NONE;

        this.waveAmplitude = 0.02;
        this.waveWavelength = 12.0;
        this.waveSpeed = 0.8;
    }

    /**
     * [KO] 호수 머티리얼을 반환합니다.
     * [EN] Returns the lake material.
     */
    get material(): SingleLayerWaterMaterial {
        return this._material as SingleLayerWaterMaterial;
    }

    /**
     * [KO] WaterLake의 머티리얼은 교체할 수 없습니다. 대신 기존 material의 속성을 수정하십시오.
     * [EN] WaterLake material cannot be replaced. Modify properties on the existing material instead.
     */
    set material(value: any) {
        consoleAndThrowError('WaterLake: material is read-only and cannot be replaced. Modify properties on lake.material instead.');
    }

    /**
     * [KO] 호수에 적용된 SingleLayerWaterMaterial 인스턴스를 반환합니다. (`lake.material`과 동일)
     * [EN] Returns the SingleLayerWaterMaterial instance applied to the lake. (Same as `lake.material`)
     */
    get waterMaterial(): SingleLayerWaterMaterial {
        return this._material as SingleLayerWaterMaterial;
    }

    /**
     * [KO] 호수 지오메트리(Plane)를 반환합니다.
     * [EN] Returns the lake geometry (Plane).
     */
    get geometry(): Plane {
        return this._geometry as Plane;
    }

    /**
     * [KO] WaterLake의 지오메트리는 직접 교체할 수 없습니다. 크기나 분할 수를 변경하려면 `resize()` 메서드를 사용하십시오.
     * [EN] WaterLake geometry cannot be replaced directly. Use `resize()` method to change dimensions or segment counts.
     */
    set geometry(value: any) {
        consoleAndThrowError('WaterLake: geometry is read-only and cannot be replaced directly. Use lake.resize(width, height, ...) instead.');
    }

    /**
     * [KO] WaterLake 전용 커스텀 버텍스 셰이더 모듈을 생성합니다. (미세 너울 정점 변위 지원)
     * [EN] Creates a custom vertex shader module dedicated to WaterLake. (Supports micro swell vertex displacement)
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('WATER_LAKE_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);
    };

    /**
     * [KO] 호수 수위(Y 좌표 높이)를 반환합니다.
     * [EN] Returns the water level (Y-axis height) of the lake.
     */
    get waterLevel(): number {
        return this.y;
    }

    /**
     * [KO] 호수 수위(Y 좌표 높이)를 설정합니다.
     * [EN] Sets the water level (Y-axis height) of the lake.
     */
    set waterLevel(value: number) {
        this.y = value;
    }

    /**
     * [KO] 호수의 가로 너비 (X축 방향 길이)
     * [EN] Width of the lake (length along the X-axis)
     */
    get waterWidth(): number {
        return this.#waterWidth;
    }

    /**
     * [KO] 호수의 세로 길이 (Z축 방향 길이)
     * [EN] Height/Length of the lake (length along the Z-axis)
     */
    get waterHeight(): number {
        return this.#waterHeight;
    }

    /**
     * [KO] 가로 세그먼트 분할 수
     * [EN] Number of width segments
     */
    get widthSegments(): number {
        return this.#widthSegments;
    }

    /**
     * [KO] 세로 세그먼트 분할 수
     * [EN] Number of height segments
     */
    get heightSegments(): number {
        return this.#heightSegments;
    }

    /**
     * [KO] 호수의 크기 및 세그먼트 해상도를 안전하게 재설정합니다.
     * [EN] Safely resizes the lake geometry dimensions and segment resolution.
     * @param width - 가로 너비
     * @param height - 세로 길이
     * @param widthSegments - 가로 세그먼트 분할 수
     * @param heightSegments - 세로 세그먼트 분할 수
     */
    resize(
        width: number,
        height: number,
        widthSegments: number = this.#widthSegments,
        heightSegments: number = this.#heightSegments
    ): void {
        this.#waterWidth = width;
        this.#waterHeight = height;
        this.#widthSegments = widthSegments;
        this.#heightSegments = heightSegments;
        super.geometry = new Plane(
            this.redGPUContext,
            width,
            height,
            widthSegments,
            heightSegments
        );
    }
}

definePositiveNumber(WaterLake, [
    {key: 'waveAmplitude', value: 0.02},
    {key: 'waveWavelength', value: 12.0},
    {key: 'waveSpeed', value: 0.8},
]);

Object.freeze(WaterLake);
export default WaterLake;
