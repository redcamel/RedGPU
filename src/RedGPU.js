/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.14 13:27:49
 *
 */
// base ///////////////////////////////////////////////////////////////////////
import RedDetectorGPU from "./base/detect/RedDetectorGPU.js";
import RedBaseLight from "./base/RedBaseLight.js";
import RedBaseMaterial from "./base/RedBaseMaterial.js";
import RedBaseObject3D from "./base/RedBaseObject3D.js";
import RedShareGLSL from "./base/RedShareGLSL.js";
import RedBasePostEffect from "./base/RedBasePostEffect.js";
import RedMix from "./base/RedMix.js";
import RedPipeline from "./base/RedPipeline.js";
import RedDisplayContainer from "./base/RedDisplayContainer.js";
import RedUUID from "./base/RedUUID.js";
// buffer ///////////////////////////////////////////////////////////////////////
import RedBindGroup from "./buffer/RedBindGroup.js";
import RedBuffer from "./buffer/RedBuffer.js";
import RedUniformBuffer from "./buffer/RedUniformBuffer.js";
import RedUniformBufferDescriptor from "./buffer/RedUniformBufferDescriptor.js";
// controller ///////////////////////////////////////////////////////////////////////
import RedCamera from "./controller/RedCamera.js";
import RedObitController from "./controller/RedObitController.js";
// geometry ///////////////////////////////////////////////////////////////////////
import RedGeometry from "./geometry/RedGeometry.js";
import RedInterleaveInfo from "./geometry/RedInterleaveInfo.js";
// light ///////////////////////////////////////////////////////////////////////
import RedAmbientLight from "./light/RedAmbientLight.js";
import RedDirectionalLight from "./light/RedDirectionalLight.js";
import RedPointLight from "./light/RedPointLight.js";
import RedSpotLight from "./light/RedSpotLight.js";
// loader ///////////////////////////////////////////////////////////////////////
import RedGLTFLoader from "./loader/RedGLTFLoader.js";
// material ///////////////////////////////////////////////////////////////////////
import RedGridMaterial from "./material/system/RedGridMaterial.js";
import RedPBRMaterial_System from "./material/system/RedPBRMaterial_System.js";
import RedSkyBoxMaterial from "./material/system/RedSkyBoxMaterial.js";
import RedBitmapMaterial from "./material/RedBitmapMaterial.js";
import RedColorMaterial from "./material/RedColorMaterial.js";
import RedColorPhongMaterial from "./material/RedColorPhongMaterial.js";
import RedColorPhongTextureMaterial from "./material/RedColorPhongTextureMaterial.js";
import RedEnvironmentMaterial from "./material/RedEnvironmentMaterial.js";
import RedStandardMaterial from "./material/RedStandardMaterial.js";
// object3D ///////////////////////////////////////////////////////////////////////
import RedAxis from "./object3D/RedAxis.js";
import RedGrid from "./object3D/RedGrid.js";
import RedMesh from "./object3D/RedMesh.js";
import RedSkyBox from "./object3D/RedSkyBox.js";
// postEffect ///////////////////////////////////////////////////////////////////////
import RedPostEffect_BrightnessContrast from "./postEffect/adjustments/RedPostEffect_BrightnessContrast.js";
import RedPostEffect_Gray from "./postEffect/adjustments/RedPostEffect_Gray.js";
import RedPostEffect_HueSaturation from "./postEffect/adjustments/RedPostEffect_HueSaturation.js";
import RedPostEffect_Invert from "./postEffect/adjustments/RedPostEffect_Invert.js";
import RedPostEffect_Threshold from "./postEffect/adjustments/RedPostEffect_Threshold.js";
import RedPostEffect_Bloom from "./postEffect/bloom/RedPostEffect_Bloom.js";
import RedPostEffect_Bloom_blend from "./postEffect/bloom/RedPostEffect_Bloom_blend.js";
import RedPostEffect_Blur from "./postEffect/blur/RedPostEffect_Blur.js";
import RedPostEffect_BlurX from "./postEffect/blur/RedPostEffect_BlurX.js";
import RedPostEffect_BlurY from "./postEffect/blur/RedPostEffect_BlurY.js";
import RedPostEffect_GaussianBlur from "./postEffect/blur/RedPostEffect_GaussianBlur.js";
import RedPostEffect_ZoomBlur from "./postEffect/blur/RedPostEffect_ZoomBlur.js";
import RedPostEffect_DoF from "./postEffect/dof/RedPostEffect_DoF.js";
import RedPostEffect_DoF_blend from "./postEffect/dof/RedPostEffect_DoF_blend.js";
import RedPostEffect_HalfTone from "./postEffect/pixelate/RedPostEffect_HalfTone.js";
import RedPostEffect_Pixelize from "./postEffect/pixelate/RedPostEffect_Pixelize.js";
import RedPostEffect from "./postEffect/RedPostEffect.js";
import RedPostEffect_Convolution from "./postEffect/RedPostEffect_Convolution.js";
import RedPostEffect_Film from "./postEffect/RedPostEffect_Film.js";
import RedPostEffect_Vignetting from "./postEffect/RedPostEffect_Vignetting.js";
// primitives ///////////////////////////////////////////////////////////////////////
import RedBox from "./primitives/RedBox.js";
import RedCylinder from "./primitives/RedCylinder.js";
import RedPlane from "./primitives/RedPlane.js";
import RedSphere from "./primitives/RedSphere.js";
// renderder ///////////////////////////////////////////////////////////////////////
import RedRender from "./renderer/RedRender.js";
// resources ///////////////////////////////////////////////////////////////////////
import RedBitmapCubeTexture from "./resources/RedBitmapCubeTexture.js";
import RedBitmapTexture from "./resources/RedBitmapTexture.js";
import RedSampler from "./resources/RedSampler.js";
import RedShaderModule_GLSL from "./resources/RedShaderModule_GLSL.js";
import RedTypeSize from "./resources/RedTypeSize.js";
// util ///////////////////////////////////////////////////////////////////////
import RedUTILColor from "./util/func/RedUTILColor.js";
import RedUTILMath from "./util/func/RedUTILMath.js";
import RedUTIL from "./util/RedUTIL.js";
//
import RedGPUContext from "./RedGPUContext.js"
import RedScene from "./RedScene.js"
import RedView from "./RedView.js"
const RedGPU = {
	glMatrix,
	// base
	RedDetectorGPU,
	RedBaseLight,
	RedBaseMaterial,
	RedBaseObject3D,
	RedShareGLSL,
	RedBasePostEffect,
	RedMix,
	RedPipeline,
	RedDisplayContainer,
	RedUUID,
	// buffer ///////////////////////////////////////////////////////////////////////
	RedBindGroup,
	RedBuffer,
	RedUniformBuffer,
	RedUniformBufferDescriptor,
	// controller ///////////////////////////////////////////////////////////////////////
	RedCamera,
	RedObitController,
	// geometry ///////////////////////////////////////////////////////////////////////
	RedGeometry,
	RedInterleaveInfo,
	// light ///////////////////////////////////////////////////////////////////////
	RedAmbientLight,
	RedDirectionalLight,
	RedPointLight,
	RedSpotLight,
	// loader ///////////////////////////////////////////////////////////////////////
	RedGLTFLoader,
	// material ///////////////////////////////////////////////////////////////////////
	RedGridMaterial,
	RedPBRMaterial_System,
	RedSkyBoxMaterial,
	RedBitmapMaterial,
	RedColorMaterial,
	RedColorPhongMaterial,
	RedColorPhongTextureMaterial,
	RedEnvironmentMaterial,
	RedStandardMaterial,
	// object3D ///////////////////////////////////////////////////////////////////////
	RedAxis,
	RedGrid,
	RedMesh,
	RedSkyBox,
	// postEffect ///////////////////////////////////////////////////////////////////////
	RedPostEffect_BrightnessContrast,
	RedPostEffect_Gray,
	RedPostEffect_HueSaturation,
	RedPostEffect_Invert,
	RedPostEffect_Threshold,
	RedPostEffect_Bloom,
	RedPostEffect_Bloom_blend,
	RedPostEffect_Blur,
	RedPostEffect_BlurX,
	RedPostEffect_BlurY,
	RedPostEffect_GaussianBlur,
	RedPostEffect_ZoomBlur,
	RedPostEffect_DoF,
	RedPostEffect_DoF_blend,
	RedPostEffect_HalfTone,
	RedPostEffect_Pixelize,
	RedPostEffect,
	RedPostEffect_Convolution,
	RedPostEffect_Film,
	RedPostEffect_Vignetting,
	// primitives ///////////////////////////////////////////////////////////////////////
	RedBox,
	RedCylinder,
	RedPlane,
	RedSphere,
	// renderder ///////////////////////////////////////////////////////////////////////
	RedRender,
	// resources ///////////////////////////////////////////////////////////////////////
	RedBitmapCubeTexture,
	RedBitmapTexture,
	RedSampler,
	RedShaderModule_GLSL,
	RedTypeSize,
	// util ///////////////////////////////////////////////////////////////////////
	RedUTILColor,
	RedUTILMath,
	RedUTIL,
	//
	RedGPUContext,
	RedScene,
	RedView
}
export default RedGPU;