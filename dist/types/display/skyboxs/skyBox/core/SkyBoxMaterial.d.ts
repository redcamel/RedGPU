import RedGPUContext from "../../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import CubeTexture from "../../../../resources/texture/CubeTexture";
import HDRTexture from "../../../../resources/texture/hdr/HDRTexture";
import ANoiseTexture from "../../../../resources/texture/noiseTexture/core/ANoiseTexture";
interface SkyBoxMaterial {
    skyboxTexture: CubeTexture | HDRTexture;
    transitionTexture: CubeTexture | HDRTexture;
    transitionAlphaTexture: ANoiseTexture | BitmapTexture;
    skyboxTextureSampler: Sampler;
    blur: number;
    transitionProgress: number;
}
/**
 * [KO] SkyBox 렌더링에 사용되는 전용 머티리얼 클래스입니다.
 * [EN] Material class exclusively used for SkyBox rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 머티리얼 클래스입니다.<br/>일반적인 사용자는 직접 인스턴스를 생성할 필요가 없습니다.
 * [EN] This class is a material class used internally by the system.<br/>General users do not need to create instances directly.
 * :::
 *
 * @category SkyBox
 */
declare class SkyBoxMaterial extends ABitmapBaseMaterial {
    /**
     * [KO] 파이프라인 dirty 상태 플래그
     * [EN] Pipeline dirty status flag
     */
    dirtyPipeline: boolean;
    /**
     * [KO] SkyBoxMaterial 생성자
     * [EN] SkyBoxMaterial constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param cubeTexture -
     * [KO] 스카이박스에 사용할 큐브 텍스처 또는 HDR 텍스처
     * [EN] Cube texture or HDR texture to use for the skybox
     */
    constructor(redGPUContext: RedGPUContext, cubeTexture: CubeTexture | HDRTexture);
}
export default SkyBoxMaterial;
