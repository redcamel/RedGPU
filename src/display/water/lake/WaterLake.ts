import RedGPUContext from "../../../context/RedGPUContext";
import Ground from "../../../primitive/Ground";
import Mesh from "../../mesh/Mesh";
import SingleLayerWaterMaterial from "../core/SingleLayerWaterMaterial";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import vertexModuleSource from "./shader/waterLakeVertex.wgsl";

/**
 * [KO] 언리얼 엔진 5의 AWaterBodyLake에 대응하는 호수 수체 컴포넌트 클래스 (Phase 12 - Micro Swell)
 * [EN] Lake water body component class corresponding to Unreal Engine 5 AWaterBodyLake (Phase 12 - Micro Swell)
 *
 * @category Display
 */
class WaterLake extends Mesh {
    #waterWidth: number;
    #waterHeight: number;
    #widthSegments: number;
    #heightSegments: number;

    #waveAmplitude: number = 0.025; // 기본 2.5cm 미세 너울
    #waveWavelength: number = 16.0; // 기본 파장 16m
    #waveSpeed: number = 1.0; // 기본 전파 속도

    // 고빈도 갱신 시 GC 0건 유지를 위한 정적 크기 재사용 TypedArray 버퍼
    #singleFloatBuffer: Float32Array = new Float32Array(1);
    #allUniformBuffer: Float32Array = new Float32Array(4);

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

        // 커스텀 버텍스 셰이더 파이프라인 활성화
        this.dirtyPipeline = true;
    }

    /**
     * [KO] 호수 표면 미세 장파장 너울의 수직 진폭(Amplitude, 단위: m, 기본값: 0.025 = 2.5cm)
     * [EN] Vertical amplitude of lake surface micro swell (Unit: m, default: 0.025 = 2.5cm)
     */
    get waveAmplitude(): number {
        return this.#waveAmplitude;
    }

    set waveAmplitude(value: number) {
        this.#waveAmplitude = Math.max(0.0, value);
        if (this.gpuRenderInfo?.vertexUniformBuffer && this.gpuRenderInfo?.vertexUniformInfo) {
            const member = this.gpuRenderInfo.vertexUniformInfo.members.waveAmplitude;
            if (member) {
                this.#singleFloatBuffer[0] = this.#waveAmplitude;
                this.redGPUContext.gpuDevice.queue.writeBuffer(
                    this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer,
                    member.uniformOffset,
                    this.#singleFloatBuffer as BufferSource
                );
            }
        }
    }

    /**
     * [KO] 호수 표면 미세 너울의 대표 파장(Wavelength, 단위: m, 기본값: 16.0m)
     * [EN] Representative wavelength of lake surface micro swell (Unit: m, default: 16.0m)
     */
    get waveWavelength(): number {
        return this.#waveWavelength;
    }

    set waveWavelength(value: number) {
        this.#waveWavelength = Math.max(0.1, value);
        if (this.gpuRenderInfo?.vertexUniformBuffer && this.gpuRenderInfo?.vertexUniformInfo) {
            const member = this.gpuRenderInfo.vertexUniformInfo.members.waveWavelength;
            if (member) {
                this.#singleFloatBuffer[0] = this.#waveWavelength;
                this.redGPUContext.gpuDevice.queue.writeBuffer(
                    this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer,
                    member.uniformOffset,
                    this.#singleFloatBuffer as BufferSource
                );
            }
        }
    }

    /**
     * [KO] 호수 표면 미세 너울의 전파 속도 배율 (Speed, 기본값: 1.0)
     * [EN] Propagation speed multiplier of lake surface micro swell (Speed, default: 1.0)
     */
    get waveSpeed(): number {
        return this.#waveSpeed;
    }

    set waveSpeed(value: number) {
        this.#waveSpeed = value;
        if (this.gpuRenderInfo?.vertexUniformBuffer && this.gpuRenderInfo?.vertexUniformInfo) {
            const member = this.gpuRenderInfo.vertexUniformInfo.members.waveSpeed;
            if (member) {
                this.#singleFloatBuffer[0] = this.#waveSpeed;
                this.redGPUContext.gpuDevice.queue.writeBuffer(
                    this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer,
                    member.uniformOffset,
                    this.#singleFloatBuffer as BufferSource
                );
            }
        }
    }

    /**
     * [KO] WaterLake 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to WaterLake.
     *
     * @returns
     * [KO] 생성된 GPU 셰이더 모듈
     * [EN] Created GPU shader module
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('WATER_LAKE_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms?.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('WATER_LAKE_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);
        this.#updateAllVertexUniforms();
        return shaderModule;
    };

    /**
     * [KO] 모든 버텍스 너울 유니폼 데이터를 GPU 버퍼에 일괄 기록합니다 (GC 0건 보장).
     * [EN] Writes all vertex swell uniform data to the GPU buffer in batch (Zero-GC guaranteed).
     */
    #updateAllVertexUniforms() {
        if (this.gpuRenderInfo?.vertexUniformBuffer) {
            this.#allUniformBuffer[0] = this.#waveAmplitude;
            this.#allUniformBuffer[1] = this.#waveWavelength;
            this.#allUniformBuffer[2] = this.#waveSpeed;
            this.#allUniformBuffer[3] = 0.0;
            this.redGPUContext.gpuDevice.queue.writeBuffer(
                this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer,
                0,
                this.#allUniformBuffer as BufferSource
            );
        }
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
