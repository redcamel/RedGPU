const exampleList = [
	{
		key: 'Basic',
		list: [
			{
				key: 'helloWorld',
				href: 'basic/helloWorld/index.html'
			},
			{
				key: 'multiView',
				href: 'basic/multiView/index.html'
			},
			{
				key: 'scene',
				href: 'basic/scene/index.html'
			},
			{
				key: 'view',
				href: 'basic/view/index.html'
			}
		]
	},
	{
		key: 'Primitives',
		list: [
			{
				key: 'box',
				href: 'primitive/box/index.html'
			},
			{
				key: 'plane',
				href: 'primitive/plane/index.html'
			},
			{
				key: 'cylinder',
				href: 'primitive/cylinder/index.html'
			},
			{
				key: 'sphere',
				href: 'primitive/sphere/index.html'
			}
		]
	},
	{
		key: 'controller',
		list: [
			{
				key: 'camera2D',
				href: 'controller/camera2D/index.html'
			},
			{
				key: 'camera3D',
				href: 'controller/camera3D/index.html'
			},
			{
				key: 'obitController',
				href: 'controller/obitController/index.html'
			}
		]
	},
	{
		key: 'coordinate',
		list: [
			{
				key: 'getScreenPoint',
				href: 'coordinate/getScreenPoint/index.html'
			},
			{
				key: 'localToWorld',
				href: 'coordinate/localToWorld/index.html'
			},
			{
				key: 'pivotPoint',
				href: 'coordinate/pivotPoint/index.html'
			},
			{
				key: 'pivotPoint_2d',
				href: 'coordinate/pivotPoint_2d/index.html'
			},
			{
				key: 'screenToWorld',
				href: 'coordinate/screenToWorld/index.html'
			},
			{
				key: 'worldToLocal',
				href: 'coordinate/worldToLocal/index.html'
			}
		]
	},
	{
		key: 'light',
		list: [
			{
				key: 'ambientLight',
				href: 'light/ambientLight/index.html'
			},
			{
				key: 'directionalLight',
				href: 'light/directionalLight/index.html'
			},
			{
				key: 'pointLight',
				href: 'light/pointLight/index.html'
			}
		]
	},
	{
		key: 'loader',
		list: [
			{
				key: 'gltf',
				href: 'loader/gltf/index.html'
			},
			{
				key: 'gltfComplex',
				href: 'loader/gltfComplex/index.html'
			}
		]
	},
	{
		key: 'material',
		list: [
			{
				key: 'colorMaterial',
				href: 'material/colorMaterial/index.html'
			},
			{
				key: 'colorPhongMaterial',
				href: 'material/colorPhongMaterial/index.html'
			},
			{
				key: 'colorPhongTextureMaterial',
				href: 'material/colorPhongTextureMaterial/index.html'
			},
			{
				key: 'bitmapMaterial',
				href: 'material/bitmapMaterial/index.html'
			},
			{
				key: 'standardMaterial',
				href: 'material/standardMaterial/index.html'
			},
			{
				key: 'environmentMaterial',
				href: 'material/environmentMaterial/index.html'
			},
			{
				key: 'refractionMaterial',
				href: 'material/refractionMaterial/index.html'
			},
			{
				key: 'spriteSheetMaterial',
				href: 'material/spriteSheetMaterial/index.html'
			}
		]
	},
	{
		key: 'texture',
		list: [
			{
				key: 'bitmapTexture',
				href: 'texture/bitmapTexture/index.html'
			}
		]
	},
	{
		key: 'mouseEvent',
		list: [
			{
				key: 'mouseEvent',
				href: 'mouseEvent/mouseEvent/index.html'
			},
			{
				key: 'mouseEventInMultiView',
				href: 'mouseEvent/mouseEventInMultiView/index.html'
			}
		]
	},
	{
		key: 'object3D',
		list: [
			{
				key: 'axis',
				href: 'object3D/axis/index.html'
			},
			{
				key: 'grid',
				href: 'object3D/grid/index.html'
			},
			{
				key: 'lineBezier',
				href: 'object3D/lineBezier/index.html'
			},
			{
				key: 'lineCatmullRom',
				href: 'object3D/lineCatmullRom/index.html'
			},
			{
				key: 'lineLinear',
				href: 'object3D/lineLinear/index.html'
			},
			{
				key: 'mesh',
				href: 'object3D/mesh/index.html'
			},
			{
				key: 'skyBox',
				href: 'object3D/skyBox/index.html'
			},
			{
				key: 'sprite3D',
				href: 'object3D/sprite3D/index.html'
			},
			{
				key: 'targetTo',
				href: 'object3D/targetTo/index.html'
			},
			{
				key: 'text',
				href: 'object3D/text/index.html'
			},
		]
	},
	{
		key: 'particle',
		list: [
			{
				key: 'particle',
				href: 'particle/particle/index.html'
			}
		]
	},
	{
		key: 'postEffect',
		list: [
			{
				key: 'postEffect',
				href: 'postEffect/postEffect/index.html'
			},
			{
				key: 'postEffect_gray',
				href: 'postEffect/postEffect_gray/index.html'
			},
			{
				key: 'postEffect_hueSaturation',
				href: 'postEffect/postEffect_hueSaturation/index.html'
			},
			{
				key: 'postEffect_invert',
				href: 'postEffect/postEffect_invert/index.html'
			},
			{
				key: 'postEffect_threshold',
				href: 'postEffect/postEffect_threshold/index.html'
			},
			{
				key: 'postEffect_blur',
				href: 'postEffect/postEffect_blur/index.html'
			},
			{
				key: 'postEffect_blurX',
				href: 'postEffect/postEffect_blurX/index.html'
			},
			{
				key: 'postEffect_blurY',
				href: 'postEffect/postEffect_blurY/index.html'
			},
			{
				key: 'postEffect_zoomBlur',
				href: 'postEffect/postEffect_zoomBlur/index.html'
			},
			{
				key: 'postEffect_gaussianBlur',
				href: 'postEffect/postEffect_gaussianBlur/index.html'
			},
			{
				key: 'postEffect_brightnessContrast',
				href: 'postEffect/postEffect_brightnessContrast/index.html'
			},
			{
				key: 'postEffect_bloom',
				href: 'postEffect/postEffect_bloom/index.html'
			},
			{
				key: 'postEffect_dof',
				href: 'postEffect/postEffect_dof/index.html'
			},

			{
				key: 'postEffect_convolution',
				href: 'postEffect/postEffect_convolution/index.html'
			},
			{
				key: 'postEffect_film',
				href: 'postEffect/postEffect_film/index.html'
			},

			{
				key: 'postEffect_halfTone',
				href: 'postEffect/postEffect_halfTone/index.html'
			},

			{
				key: 'postEffect_pixelize',
				href: 'postEffect/postEffect_pixelize/index.html'
			},

			{
				key: 'postEffect_vignetting',
				href: 'postEffect/postEffect_vignetting/index.html'
			},

		]
	},
]
export default exampleList
