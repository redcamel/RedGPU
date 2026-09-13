import RedGPUContext from "../../../context/RedGPUContext";
import Plane from "../../../primitive/Plane";
import Mesh from "../../mesh/Mesh";
import SingleLayerWaterMaterial from "./SingleLayerWaterMaterial";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import vertexModuleSource from "./shader/waterLakeVertex.wgsl";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";

/** WaterBodyLake 전용 버텍스 셰이더 모듈 이름 */
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_WATER_BODY_LAKE';

interface WaterBodyLake {
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
 * [KO] 언리얼 엔진 5(UE5)의 AWaterBodyLake에 대응하는 호수/연못 수체(Water Body) 클래스입니다.
 * [EN] Water Body class for lakes and ponds corresponding to Unreal Engine 5 (UE5) AWaterBodyLake.
 *
 * [KO] Cook-Torrance GGX PBR 물리 조명 모델, 시간(t) 기반 물결 노멀 스크롤링, 수면 투과 및 수위(waterLevel) 제어를 지원하며, 점진적으로 굴절 및 수심 흡수 효과로 확장됩니다.
 * [EN] Supports Cook-Torrance GGX PBR physical lighting model, time(t)-based wave normal scrolling, water surface transparency, and water level control, progressively extending to refraction and depth extinction effects.
 *
 * ### Example
 * ```typescript
 * const lake = new RedGPU.Display.Water.WaterBodyLake(redGPUContext, 1000, 1000);
 * lake.waterLevel = 10;
 * scene.addChild(lake);
 * ```
 *
 * @category Display
 */
class WaterBodyLake extends Mesh {
    #waterWidth: number;
    #waterHeight: number;
    #widthSegments: number;
    #heightSegments: number;

    /**
     * [KO] WaterBodyLake 생성자
     * [EN] WaterBodyLake constructor
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param width - 호수의 가로 너비 (기본값: 100)
     * @param height - 호수의 세로 길이 (기본값: 100)
     * @param widthSegments - 가로 세그먼트 분할 수 (기본값: 64)
     * @param heightSegments - 세로 세그먼트 분할 수 (기본값: 64)
     * @param material - SingleLayerWaterMaterial 머티리얼 (선택)
     * @param name - 수체 오브젝트 이름 (기본값: 'WaterBodyLake')
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 100,
        height: number = 100,
        widthSegments: number = 64,
        heightSegments: number = 64,
        material?: SingleLayerWaterMaterial,
        name: string = 'WaterBodyLake'
    ) {
        const waterMaterial = material || new SingleLayerWaterMaterial(redGPUContext);
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
     * [KO] WaterBodyLake 전용 커스텀 버텍스 셰이더 모듈을 생성합니다. (미세 너울 정점 변위 지원)
     * [EN] Creates a custom vertex shader module dedicated to WaterBodyLake. (Supports micro swell vertex displacement)
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
     * [KO] 호수에 적용된 SingleLayerWaterMaterial 인스턴스를 반환합니다.
     * [EN] Returns the SingleLayerWaterMaterial instance applied to the lake.
     */
    get waterMaterial(): SingleLayerWaterMaterial {
        return this.material as SingleLayerWaterMaterial;
    }

    /**
     * [KO] 호수의 크기를 재설정합니다.
     * [EN] Resizes the lake geometry.
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
        this.geometry = new Plane(
            this.redGPUContext,
            width,
            height,
            widthSegments,
            heightSegments
        );
    }
}

definePositiveNumber(WaterBodyLake, [
    {key: 'waveAmplitude', value: 0.02},
    {key: 'waveWavelength', value: 12.0},
    {key: 'waveSpeed', value: 0.8},
]);

Object.freeze(WaterBodyLake);
export default WaterBodyLake;
