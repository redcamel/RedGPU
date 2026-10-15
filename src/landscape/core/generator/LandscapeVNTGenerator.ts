import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vntBakeShaderCode from "../shader/landscapeVNTBake.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

/**
 * [KO] 가상 하이트 텍스처(VHT) 아틀라스의 고도 구배로부터 지형 표면 법선 및 경사도를 계산하여 가상 노멀 텍스처(VNT) 아틀라스에 베이킹하는 생성기 클래스입니다.
 * [EN] Generator class that computes terrain surface normals and slope from Virtual Height Texture (VHT) atlas gradients and bakes them into the Virtual Normal Texture (VNT) atlas.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class LandscapeVNTGenerator extends ALandscapeAtlasGenerator {
    #uniformArray: Float32Array;
    #uniformByteLength: number = 48;

    /**
     * [KO] `LandscapeVNTGenerator` 인스턴스를 초기화합니다.
     * [EN] Initializes a `LandscapeVNTGenerator` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, 'VNT');
        this.#uniformArray = new Float32Array(12);
        this.#initComputeResources();
    }

    /**
     * [KO] VHT 아틀라스의 지정된 타일 영역으로부터 법선 데이터를 계산하여 VNT 아틀라스에 베이킹합니다.
     * [EN] Computes normal data from the specified tile region of the VHT atlas and bakes it into the VNT atlas.
     *
     * @param vhtAtlas -
     * [KO] 원본 가상 하이트 텍스처(VHT) 아틀라스
     * [EN] Source Virtual Height Texture (VHT) atlas
     * @param vntAtlas -
     * [KO] 대상 가상 노멀 텍스처(VNT) 아틀라스
     * [EN] Target Virtual Normal Texture (VNT) atlas
     * @param pixelX -
     * [KO] 타일 영역의 시작 X 픽셀 오프셋
     * [EN] Starting X pixel offset of the tile region
     * @param pixelZ -
     * [KO] 타일 영역의 시작 Z(Y) 픽셀 오프셋
     * [EN] Starting Z(Y) pixel offset of the tile region
     * @param pixelW -
     * [KO] 타일 영역의 가로 픽셀 크기
     * [EN] Width of the tile region in pixels
     * @param pixelH -
     * [KO] 타일 영역의 세로 픽셀 크기
     * [EN] Height of the tile region in pixels
     * @param heightScale -
     * [KO] 지형 최대 높이 스케일 (월드 단위)
     * [EN] Maximum terrain height scale in world units
     * @param worldSizeX -
     * [KO] 지형 전체의 X축 월드 크기
     * [EN] Total world size of the terrain along the X-axis
     * @param componentCountX -
     * [KO] X축 방향 타일(컴포넌트) 개수
     * [EN] Number of tiles (components) along the X-axis
     */
    bakeTileRegion(
        vhtAtlas: DirectTexture,
        vntAtlas: DirectTexture,
        pixelX: number,
        pixelZ: number,
        pixelW: number,
        pixelH: number,
        heightScale: number,
        worldSizeX: number,
        componentCountX: number
    ): void {
        if (!this.computePipeline || !this.bindGroupLayout) return;
        if (!vhtAtlas?.gpuTexture || !vntAtlas?.gpuTexture) return;

        const {gpuDevice} = this.redGPUContext;
        const {width, height} = vhtAtlas.gpuTexture;

        const texelWorldSize = worldSizeX / (componentCountX * 512);

        const bakeX = Math.max(0, pixelX - 1);
        const bakeZ = Math.max(0, pixelZ - 1);
        const bakeW = Math.min(width - bakeX, pixelW + (pixelX > 0 ? 2 : 1));
        const bakeH = Math.min(height - bakeZ, pixelH + (pixelZ > 0 ? 2 : 1));

        if (bakeW <= 0 || bakeH <= 0 || pixelX >= width || pixelZ >= height) return;

        const arr = this.#uniformArray;
        arr[0] = bakeX;
        arr[1] = bakeZ;
        arr[2] = bakeW;
        arr[3] = bakeH;

        arr[4] = width;
        arr[5] = height;
        arr[6] = heightScale;
        arr[7] = texelWorldSize;

        const uniformBuffer = this.acquireUniformBuffer(this.#uniformByteLength);
        gpuDevice.queue.writeBuffer(uniformBuffer, 0, arr.buffer, 0, this.#uniformByteLength);

        const bindGroup = gpuDevice.createBindGroup({
            label: `Landscape_VNT_BindGroup_[${pixelX},${pixelZ}]`,
            layout: this.bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {buffer: uniformBuffer}
                },
                {
                    binding: 1,
                    resource: vhtAtlas.gpuTextureView
                },
                {
                    binding: 2,
                    resource: vntAtlas.gpuTextureView
                }
            ]
        });

        this.dispatchBakePass(bindGroup, bakeW, bakeH, pixelX, pixelZ);
    }

    #initComputeResources(): void {
        const {resourceManager} = this.redGPUContext;
        const shaderInfo = resourceManager.wgslParser.parse('Landscape_VNT_Bake_ShaderModule', vntBakeShaderCode);
        const uniformByteLength = shaderInfo?.uniforms?.uniforms?.arrayBufferByteLength || 48;
        this.#uniformByteLength = uniformByteLength;
        this.#uniformArray = new Float32Array(uniformByteLength / Float32Array.BYTES_PER_ELEMENT);

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0, {
            1: {
                texture: {
                    sampleType: 'unfilterable-float',
                    viewDimension: '2d'
                }
            }
        });

        this.initBaseComputePipeline(
            'Landscape_VNT_Bake_ShaderModule',
            vntBakeShaderCode,
            descriptor.entries as GPUBindGroupLayoutEntry[],
            uniformByteLength
        );
    }
}

Object.freeze(LandscapeVNTGenerator);
export default LandscapeVNTGenerator;
