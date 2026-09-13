import RedGPUContext from "../../../context/RedGPUContext";
import Plane from "../../../primitive/Plane";
import Mesh from "../../mesh/Mesh";
import SingleLayerWaterMaterial from "./SingleLayerWaterMaterial";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";

/**
 * [KO] 언리얼 엔진 5(UE5)의 AWaterBodyLake에 대응하는 호수/연못 수체(Water Body) 클래스입니다.
 * [EN] Water Body class for lakes and ponds corresponding to Unreal Engine 5 (UE5) AWaterBodyLake.
 *
 * [KO] Step 0에서는 가장 단순한 수평 반투명 평면 수면을 제공하며, 지형/오브젝트 위에 수위를 정의하고 점진적으로 파도 및 광학 효과로 확장됩니다.
 * [EN] Step 0 provides a basic horizontal translucent flat water surface, defining the water level above terrain/objects and progressively extending to waves and optical effects.
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
     * @param widthSegments - 가로 세그먼트 분할 수 (기본값: 1)
     * @param heightSegments - 세로 세그먼트 분할 수 (기본값: 1)
     * @param material - SingleLayerWaterMaterial 머티리얼 (선택)
     * @param name - 수체 오브젝트 이름 (기본값: 'WaterBodyLake')
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 100,
        height: number = 100,
        widthSegments: number = 1,
        heightSegments: number = 1,
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
    }

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

export default WaterBodyLake;
