import RedGPUContext from "../../../context/RedGPUContext";
import Ground from "../../../primitive/Ground";
import Mesh from "../../mesh/Mesh";
import SingleLayerWaterMaterial from "../core/SingleLayerWaterMaterial";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";

/**
 * [KO] 언리얼 엔진 5의 AWaterBodyLake에 대응하는 호수 수체 컴포넌트 클래스 (Phase 2)
 * [EN] Lake water body component class corresponding to Unreal Engine 5 AWaterBodyLake (Phase 2)
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
     * @param name - 오브젝트 이름 (기본값: 'WaterLake')
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
        const waterGeometry = new Ground(redGPUContext, width, height, widthSegments, heightSegments);

        super(redGPUContext, waterGeometry, waterMaterial, name);

        this.#waterWidth = width;
        this.#waterHeight = height;
        this.#widthSegments = widthSegments;
        this.#heightSegments = heightSegments;

        // 반투명 수면 블렌딩을 위해 뎁스 쓰기 비활성화
        this.depthStencilState.depthWriteEnabled = false;

        // 수면 위/아래 양면 시야를 위해 cullMode를 NONE으로 구성
        this.primitiveState.cullMode = GPU_CULL_MODE.NONE;
    }

    /**
     * [KO] 호수에 적용된 SingleLayerWaterMaterial 인스턴스를 반환합니다.
     * [EN] Returns the SingleLayerWaterMaterial instance applied to the lake.
     */
    get waterMaterial(): SingleLayerWaterMaterial {
        return this._material as SingleLayerWaterMaterial;
    }

    /**
     * [KO] 호수의 지오메트리(Ground)를 반환합니다.
     * [EN] Returns the lake geometry (Ground).
     */
    get geometry(): Ground {
        return this._geometry as Ground;
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
     * [KO] 호수의 가로 너비
     * [EN] Width of the lake
     */
    get waterWidth(): number {
        return this.#waterWidth;
    }

    /**
     * [KO] 호수의 세로 길이
     * [EN] Height/Length of the lake
     */
    get waterHeight(): number {
        return this.#waterHeight;
    }

    /**
     * [KO] 가로 세그먼트 수
     * [EN] Width segment count
     */
    get widthSegments(): number {
        return this.#widthSegments;
    }

    /**
     * [KO] 세로 세그먼트 수
     * [EN] Height segment count
     */
    get heightSegments(): number {
        return this.#heightSegments;
    }
}

Object.freeze(WaterLake);
export default WaterLake;
