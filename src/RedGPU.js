/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.24 20:56:2
 *
 */
// renderder ///////////////////////////////////////////////////////////////////////
import Render from "./renderer/Render.js";
import Debugger from "./renderer/system/Debugger.js";

// base ///////////////////////////////////////////////////////////////////////
import DetectorGPU from "./base/detect/DetectorGPU.js";
import BaseLight from "./base/BaseLight.js";
import BaseMaterial from "./base/BaseMaterial.js";
import BaseObject3D from "./base/BaseObject3D.js";
import ShareGLSL from "./base/ShareGLSL.js";
import BasePostEffect from "./base/BasePostEffect.js";
import Mix from "./base/Mix.js";
import Pipeline from "./base/Pipeline.js";
import DisplayContainer from "./base/DisplayContainer.js";
import UUID from "./base/UUID.js";
// buffer ///////////////////////////////////////////////////////////////////////
import BindGroup from "./buffer/BindGroup.js";
import Buffer from "./buffer/Buffer.js";
import UniformBuffer from "./buffer/UniformBuffer.js";
import UniformBufferDescriptor from "./buffer/UniformBufferDescriptor.js";
// controller ///////////////////////////////////////////////////////////////////////
import Camera from "./controller/Camera.js";
import ObitController from "./controller/ObitController.js";
// geometry ///////////////////////////////////////////////////////////////////////
import Geometry from "./geometry/Geometry.js";
import InterleaveInfo from "./geometry/InterleaveInfo.js";
// light ///////////////////////////////////////////////////////////////////////
import AmbientLight from "./light/AmbientLight.js";
import DirectionalLight from "./light/DirectionalLight.js";
import PointLight from "./light/PointLight.js";
import SpotLight from "./light/SpotLight.js";
// loader ///////////////////////////////////////////////////////////////////////
import TextureLoader from "./loader/TextureLoader.js";
import BaseTexture from "./base/BaseTexture.js";
import GLTFLoader from "./loader/gltf/GLTFLoader.js";
// material ///////////////////////////////////////////////////////////////////////
import GridMaterial from "./material/system/GridMaterial.js";
import PBRMaterial_System from "./material/system/PBRMaterial_System.js";
import SkyBoxMaterial from "./material/system/SkyBoxMaterial.js";
import BitmapMaterial from "./material/BitmapMaterial.js";
import ColorMaterial from "./material/ColorMaterial.js";
import ColorPhongMaterial from "./material/ColorPhongMaterial.js";
import ColorPhongTextureMaterial from "./material/ColorPhongTextureMaterial.js";
import EnvironmentMaterial from "./material/EnvironmentMaterial.js";
import SheetMaterial from "./material/SheetMaterial.js";
import Sprite3DMaterial from "./material/Sprite3DMaterial.js";
import StandardMaterial from "./material/StandardMaterial.js";
// object3D ///////////////////////////////////////////////////////////////////////
import Axis from "./object3D/Axis.js";
import Grid from "./object3D/Grid.js";
import Mesh from "./object3D/Mesh.js";
import SkyBox from "./object3D/SkyBox.js";
import Sprite3D from "./object3D/Sprite3D.js";
import Text from "./object3D/Text.js";
import Line from "./object3D/Line.js";
// postEffect ///////////////////////////////////////////////////////////////////////
import PostEffect_BrightnessContrast from "./postEffect/adjustments/PostEffect_BrightnessContrast.js";
import PostEffect_Gray from "./postEffect/adjustments/PostEffect_Gray.js";
import PostEffect_HueSaturation from "./postEffect/adjustments/PostEffect_HueSaturation.js";
import PostEffect_Invert from "./postEffect/adjustments/PostEffect_Invert.js";
import PostEffect_Threshold from "./postEffect/adjustments/PostEffect_Threshold.js";
import PostEffect_Bloom from "./postEffect/bloom/PostEffect_Bloom.js";
import PostEffect_Bloom_blend from "./postEffect/bloom/PostEffect_Bloom_blend.js";
import PostEffect_Blur from "./postEffect/blur/PostEffect_Blur.js";
import PostEffect_BlurX from "./postEffect/blur/PostEffect_BlurX.js";
import PostEffect_BlurY from "./postEffect/blur/PostEffect_BlurY.js";
import PostEffect_GaussianBlur from "./postEffect/blur/PostEffect_GaussianBlur.js";
import PostEffect_ZoomBlur from "./postEffect/blur/PostEffect_ZoomBlur.js";
import PostEffect_DoF from "./postEffect/dof/PostEffect_DoF.js";
import PostEffect_DoF_blend from "./postEffect/dof/PostEffect_DoF_blend.js";
import PostEffect_HalfTone from "./postEffect/pixelate/PostEffect_HalfTone.js";
import PostEffect_Pixelize from "./postEffect/pixelate/PostEffect_Pixelize.js";
import PostEffect from "./postEffect/PostEffect.js";
import PostEffect_Convolution from "./postEffect/PostEffect_Convolution.js";
import PostEffect_Film from "./postEffect/PostEffect_Film.js";
import PostEffect_Vignetting from "./postEffect/PostEffect_Vignetting.js";
// primitives ///////////////////////////////////////////////////////////////////////
import Box from "./primitives/Box.js";
import Cylinder from "./primitives/Cylinder.js";
import Plane from "./primitives/Plane.js";
import Sphere from "./primitives/Sphere.js";
// resources ///////////////////////////////////////////////////////////////////////
import CopyBufferToTexture from "./resources/system/CopyBufferToTexture.js";
import ImageLoader from "./resources/system/ImageLoader.js";
import BitmapCubeTexture from "./resources/BitmapCubeTexture.js";
import BitmapTexture from "./resources/BitmapTexture.js";
import Sampler from "./resources/Sampler.js";
import ShaderModule_GLSL from "./resources/ShaderModule_GLSL.js";
import TypeSize from "./resources/TypeSize.js";
// util ///////////////////////////////////////////////////////////////////////
import UTILColor from "./util/func/UTILColor.js";
import UTILMath from "./util/func/UTILMath.js";
import UTIL from "./util/UTIL.js";
//
import RedGPUContext from "./RedGPUContext.js"
import Scene from "./Scene.js"
import View from "./View.js"

const RedGPU = {
	// base
	DetectorGPU,
	BaseLight: BaseLight,
	BaseMaterial,
	BaseObject3D,
	ShareGLSL,
	BasePostEffect,
	BaseTexture,
	Mix,
	Pipeline,
	DisplayContainer,
	UUID,
	// buffer ///////////////////////////////////////////////////////////////////////
	BindGroup,
	Buffer,
	UniformBuffer,
	UniformBufferDescriptor,
	// controller ///////////////////////////////////////////////////////////////////////
	Camera,
	ObitController,
	// geometry ///////////////////////////////////////////////////////////////////////
	Geometry,
	InterleaveInfo,
	// light ///////////////////////////////////////////////////////////////////////
	AmbientLight,
	DirectionalLight,
	PointLight,
	SpotLight,
	// loader ///////////////////////////////////////////////////////////////////////
	GLTFLoader,
	TextureLoader,
	// material ///////////////////////////////////////////////////////////////////////
	GridMaterial,
	PBRMaterial_System,
	SkyBoxMaterial,
	BitmapMaterial,
	ColorMaterial,
	ColorPhongMaterial,
	ColorPhongTextureMaterial,
	SheetMaterial,
	Sprite3DMaterial,
	EnvironmentMaterial,
	StandardMaterial,
	// object3D ///////////////////////////////////////////////////////////////////////
	Axis,
	Grid,
	Mesh,
	SkyBox,
	Sprite3D,
	Text,
	Line,
	// postEffect ///////////////////////////////////////////////////////////////////////
	PostEffect_BrightnessContrast,
	PostEffect_Gray,
	PostEffect_HueSaturation,
	PostEffect_Invert,
	PostEffect_Threshold,
	PostEffect_Bloom,
	PostEffect_Bloom_blend,
	PostEffect_Blur,
	PostEffect_BlurX,
	PostEffect_BlurY,
	PostEffect_GaussianBlur,
	PostEffect_ZoomBlur,
	PostEffect_DoF,
	PostEffect_DoF_blend,
	PostEffect_HalfTone,
	PostEffect_Pixelize,
	PostEffect,
	PostEffect_Convolution,
	PostEffect_Film,
	PostEffect_Vignetting,
	// primitives ///////////////////////////////////////////////////////////////////////
	Box,
	Cylinder,
	Plane,
	Sphere,
	// renderder ///////////////////////////////////////////////////////////////////////
	Render,
	Debugger,
	// resources ///////////////////////////////////////////////////////////////////////
	CopyBufferToTexture,
	ImageLoader,
	BitmapCubeTexture,
	BitmapTexture,
	Sampler,
	ShaderModule_GLSL,
	TypeSize,
	// util ///////////////////////////////////////////////////////////////////////
	UTILColor,
	UTILMath,
	UTIL,
	//
	RedGPUContext,
	Scene,
	View
};
export default RedGPU;