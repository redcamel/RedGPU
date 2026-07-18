import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
import TerrainGeometry from "./TerrainGeometry";
import TerrainMaterial from "./TerrainMaterial";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import vertexModuleSource from "./vertex.wgsl";
import defineNumber from "../../defineProperty/funcs/number/defineNumber";
import defineVector2 from "../../defineProperty/funcs/vector/defineVector2";
import defineTexture from "../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";

/**
 * [KO] CDLOD 기반 지형 시스템을 총괄하는 디스플레이 메시 객체 클래스입니다.
 * [EN] Display mesh object class that manages the CDLOD-based terrain system.
 */
interface Terrain {
    minHeight: number;
    maxHeight: number;
    worldOffset: [number, number];
    worldSize: [number, number];
    heightTexture: BitmapTexture;
    heightTextureSampler: any;
}

class Terrain extends Mesh {
    /**
     * [KO] Terrain 인스턴스를 생성합니다.
     * [EN] Creates a Terrain instance.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param heightmapUrl - [KO] 지형 높이맵 이미지의 자원 경로 (선택) [EN] Resource URL of the terrain heightmap image (optional)
     * @param name - [KO] 지형 객체 이름 [EN] Terrain object name
     */
    constructor(redGPUContext: RedGPUContext, heightmapUrl?: string, name?: string) {
        const geometry = new TerrainGeometry(redGPUContext);
        const material = new TerrainMaterial(redGPUContext); // 머티리얼은 지형 변위에 직접 관여하지 않고 독립 껍데기 유지

        super(redGPUContext, geometry, material, name);

        // 초기 기본 유니폼 파라미터 값 매핑
        this.minHeight = 0;
        this.maxHeight = 0.5; // 입체 높이 설정
        this.worldOffset = [0, 0];
        this.worldSize = [1, 1];

        if (heightmapUrl) {
            this.heightTexture = new BitmapTexture(redGPUContext, heightmapUrl);
        }
    }

    /**
     * [KO] 지형 전용 커스텀 버텍스 셰이더 모듈을 생성 및 반환합니다.
     * [EN] Creates and returns the custom vertex shader module for the terrain.
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('TERRAIN_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('TERRAIN_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);

        // 💡 1번 버텍스 바인드 그룹을 Terrain 고유의 직접 바인딩 디스크립터로 강제 재생성하여 덮어씁니다.
        this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(
            getTerrainVertexBindGroupDescriptor(this)
        );

        return shaderModule;
    }

    /**
     * [KO] defineTexture 데코레이터 세터 작동 시 버텍스 셰이더 바인딩을 직접 갱신합니다.
     */
    updateTexture(prevTexture: any, texture: any) {
        //TODO - 이거 메쉬가 가지도록 변경해야겠다
        if (prevTexture) {
            prevTexture.__removeDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        if (texture) {
            texture.__addDirtyPipelineListener(this.#dirtyPipelineListener);
        }
    }

    /**
     * [KO] defineSampler 데코레이터 세터 작동 시 버텍스 샘플러 바인딩을 직접 갱신합니다.
     */
    updateSampler(prevSampler: any, sampler: any) {
        //TODO - 이거 메쉬가 가지도록 변경해야겠다
        this.#dirtyPipelineListener()
    }

    destroy() {
        if (this.heightTexture) {
            this.heightTexture.__removeDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        super.destroy();
    }

    #dirtyPipelineListener = () => {
        if (this.gpuRenderInfo && this.redGPUContext) {
            this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(
                getTerrainVertexBindGroupDescriptor(this)
            );
            this.dirtyPipeline = true
        }
    }
}

/**
 * [KO] Terrain 고유의 직접 바인딩 버텍스 바인드 그룹 디스크립터를 빌드합니다. (재질 및 공통코드 우회)
 */
const getTerrainVertexBindGroupDescriptor = (mesh: Terrain) => {
    const {redGPUContext} = mesh;
    const {resourceManager} = redGPUContext;
    const layout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_VERTEX_GPUBindGroupLayout);

    return {
        label: `TERRAIN_VERTEX_GPUBindGroup`,
        layout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: mesh.gpuRenderInfo.vertexUniformBuffer.gpuBuffer
                }
            },
            {
                binding: 1,
                resource: mesh.heightTextureSampler?.gpuSampler || resourceManager.basicDisplacementSampler.gpuSampler
            },
            {
                binding: 2,
                resource: resourceManager.getGPUResourceBitmapTextureView(mesh.heightTexture) || resourceManager.emptyBitmapTextureView
            }
        ]
    };
};

// 버텍스 셰이더용 유니폼 속성 정의
defineNumber(Terrain, [
    {key: "minHeight", value: 0},
    {key: "maxHeight", value: 1}
]);
defineVector2(Terrain, [
    {key: "worldOffset", value: [0, 0]},
    {key: "worldSize", value: [1, 1]}
]);

// 지형(Terrain) 메시 자체에 반응형 높이맵 텍스처 및 샘플러 속성 직접 주입
defineTexture(Terrain, [
    {key: "heightTexture"}
]);
defineSampler(Terrain, [
    {key: "heightTextureSampler"}
]);

Object.freeze(Terrain);
export default Terrain;
