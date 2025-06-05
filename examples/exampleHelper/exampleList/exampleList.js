const ExampleList = [

	{
		name: '3D',
		list: [
			{
				name: 'Hello RedGPU',
				path: '3d/helloWorld',
				thumb: '3d/helloWorld/thumb.png',
				description: {
					ko: `이 예제는 RedGPU의 기본 초기화에 대한 샘플입니다.
                추가로 초기화 성공시 제공되는 RedGPUContext 객체에 제공되는 기본적인 옵션에 대한 실시간 테스트를 제공합니다. `,
					en: `This example is a sample of the basic initialization of RedGPU. 
                It also provides a live test of the basic options provided to the RedGPUContext object provided upon successful initialization.`

				},
			},
			{
				name: 'View3D',
				list: [
					{
						name: 'Single View3D',
						path: '3d/view/singleView',
						thumb: '3d/view/singleView/thumb.png',

						description: {
							ko: `이 예제는 RedGPU의 View 객체의 대한 샘플입니다. View 객체에 제공되는 기본적인 옵션에 대한 실시간 테스트를 제공합니다.`,
							en: `This example is a sample for a View object in RedGPU.
                It provides real-time testing of the basic options provided to a View object.`

						},
					},
					{
						name: 'Multi View3D',
						path: '3d/view/multiView',
						thumb: '3d/view/multiView/thumb.png',
						description: {
							ko: `이 예제는 RedGPU의 Multi View에 대한 샘플입니다. RedGPUContext는 여러개의 멀티뷰를 소유 관리할 수 있습니다.`,
							en: `This example is a sample of RedGPU's Multi View. 
                RedGPUContext can own and manage multiple MultiViews.`

						},
					}
				]
			},
			{
				name: 'Scene',
				list: [
					{
						name: 'Scene',
						path: '3d/scene',
						thumb: '3d/scene/thumb.png',
						description: {
							ko: `이 예제는 RedGPU의 Scene 객체의 대한 샘플입니다. Scene 객체에 제공되는 기본적인 옵션에 대한 실시간 테스트를 제공합니다.`,
							en: `This example is a sample of a Scene object in RedGPU.
                            It provides real-time testing of the basic options provided to the Scene object.`

						},
					}
				]
			},
			{
				name: 'Primitive',
				list: [
					{
						name: 'Primitives',
						path: '3d/primitive/primitives',
						thumb: '3d/primitive/primitives/thumb.png',
						description: {
							ko: `RedGPU에서 지원하는 기본 Primitive Geometry에 대한 샘플입니다.`,
							en: `Samples of basic primitive geometries supported by RedGPU.`

						},
					},
					{
						name: 'Box',
						path: '3d/primitive/box',
						thumb: '3d/primitive/box/thumb.png',
						description: {
							ko: `RedGPU에서 지원하는 기본 Box Primitive에 대한 샘플입니다. Box 설정 옵션에 대한 실시간 테스트를 제공합니다.`,
							en: `Samples for the basic Box Primitives supported by RedGPU. Provides real-time testing of Box configuration options.`

						},
					},
					{
						name: 'Circle',
						path: '3d/primitive/circle',
						thumb: '3d/primitive/circle/thumb.png',
						description: {
							ko: `RedGPU에서 지원하는 기본 Circle Primitive에 대한 샘플입니다. Circle 설정 옵션에 대한 실시간 테스트를 제공합니다.`,
							en: `Samples for the basic Circle Primitives supported by RedGPU. Provides real-time testing of Circle configuration options.`

						},
					},
					{
						name: 'Cylinder',
						path: '3d/primitive/cylinder',
						thumb: '3d/primitive/cylinder/thumb.png',
						description: {
							ko: `RedGPU에서 지원하는 기본 Cylinder Primitive에 대한 샘플입니다. Cylinder 설정 옵션에 대한 실시간 테스트를 제공합니다.`,
							en: `Samples for the basic Cylinder Primitives supported by RedGPU. Provides real-time testing of Cylinder configuration options.`

						},
					},
					{
						name: 'Plane',
						path: '3d/primitive/plane',
						thumb: '3d/primitive/plane/thumb.png',
						description: {
							ko: `RedGPU에서 지원하는 기본 Plane Primitive에 대한 샘플입니다. Plane 설정 옵션에 대한 실시간 테스트를 제공합니다.`,
							en: `Samples for the basic Plane Primitives supported by RedGPU. Provides real-time testing of Plane configuration options.`

						},
					},
					{
						name: 'Sphere',
						path: '3d/primitive/sphere',
						thumb: '3d/primitive/sphere/thumb.png',
						description: {
							ko: `RedGPU에서 지원하는 기본 Sphere Primitive에 대한 샘플입니다. Sphere 설정 옵션에 대한 실시간 테스트를 제공합니다.`,
							en: `Samples for the basic Sphere Primitives supported by RedGPU. Provides real-time testing of Sphere configuration options.`

						},
					},
					{
						name: 'Torus',
						path: '3d/primitive/torus',
						thumb: '3d/primitive/torus/thumb.png',
						description: {
							ko: `RedGPU에서 지원하는 기본 Torus Primitive에 대한 샘플입니다. Torus 설정 옵션에 대한 실시간 테스트를 제공합니다.`,
							en: `Samples for the basic Torus Primitives supported by RedGPU. Provides real-time testing of Torus configuration options.`

						},
					},
					{
						name: 'TorusKnot',
						path: '3d/primitive/torusNut',
						thumb: '3d/primitive/torusNut/thumb.png',
						description: {
							ko: `RedGPU에서 지원하는 기본 TorusKnot Primitive에 대한 샘플입니다. TorusKnot 설정 옵션에 대한 실시간 테스트를 제공합니다.`,
							en: `Samples for the basic TorusKnot Primitives supported by RedGPU. Provides real-time testing of TorusKnot configuration options.`

						},
					},

				]
			},
			{
				name: 'Mesh',
				list: [
					{
						name: 'Basic Mesh',
						path: '3d/mesh/basicMesh',
						thumb: '3d/mesh/basicMesh/thumb.png',
						description: {
							ko: `이 코드는 <b>메쉬의 기본 생성 방법</b>과 주요 속성(위치, 스케일, 회전, 재질 등)을 실시간으로 조작할 수 있는 샘플입니다. 
                                RedGPU를 사용해 Box 메쉬를 생성하고, 속성과 재질을 조정하는 방법을 보여주는 예제입니다.`,
							en: `this code is a sample that shows <b>how to create a basic mesh</b> and how to manipulate its main properties (position, scale, rotation, material, etc.) in real time.
                                This example shows how to create a Box mesh using RedGPU and how to adjust its properties and material.`
						},
					},
					{
						name: 'Hierarchy Mesh',
						path: '3d/mesh/hierarchy',
						thumb: '3d/mesh/hierarchy/thumb.png',
						description: {
							ko: `RedGPU를 사용해 부모-자식 메쉬 하이라키 구조를 생성하고, 위치, 회전, 스케일을 조작할 수 있는 예제입니다.`,
							en: `An example of creating a parent-child mesh hierarchy using RedGPU, and manipulating its position, rotation, and scale.`
						},
					},
					{
						name: 'Pivot Mesh',
						path: '3d/mesh/pivot',
						thumb: '3d/mesh/pivot/thumb.png',
						description: {
							ko: `RedGPU를 사용해 부모와 자식 메쉬를 생성하고, 피봇 설정을 통해 회전 중심을 변경하는 기능을 테스트할 수 있는 실습 예제입니다.`,
							en: `A hands-on example that demonstrates how to create parent and child meshes using RedGPU and change the center of rotation via pivot settings.`
						},
					},
					{
						name: 'Child Methods',
						path: '3d/mesh/childMethod',
						thumb: '3d/mesh/childMethod/thumb.png',
						description: {
							ko: `RedGPU를 활용한 자식 노드 관리 예제로, 자식 추가, 삭제, 인덱스 변경, 교체, 색상 랜덤화를 통해 노드들을 동적으로 제어하는 방법을 보여줍니다.`,
							en: `An example of child node management using RedGPU, showing how to dynamically control nodes by adding, deleting, changing index, replacing, and randomizing color of children.`
						},
					},
				]
			},
			{
				name: 'Material',
				list: [
					{
						name: 'ColorMaterial',
						path: '3d/material/colorMaterial',
						thumb: '3d/material/colorMaterial/thumb.png',
						description: {
							ko: `RedGPU의 ColorMaterial의 기본 컬러조작과 컬러를 설정하기위한 편의 매서드에 대한 실시간 샘플을 제공합니다.`,
							en: `Provides real-time samples of the basic color manipulations of RedGPU's ColorMaterial and convenience methods for setting colors.`
						},
					},
					{
						name: 'BitmapMaterial',
						path: '3d/material/bitmapMaterial',
						thumb: '3d/material/bitmapMaterial/thumb.png',
						description: {
							ko: `RedGPU의 BitmapMaterial 샘플로, 다양한 텍스처 포맷(PNG, JPG, WEBP, SVG)을 실시간으로 적용해 텍스처 변경을 테스트할 수 있습니다.`,
							en: `RedGPU's BitmapMaterial sample allows you to test texture changes in real time by applying various texture formats (PNG, JPG, WEBP, SVG).`
						},
					},
					{
						name: 'PhongMaterial',
						path: '3d/material/phongMaterial',
						thumb: '3d/material/phongMaterial/thumb.png',
						description: {
							ko: `RedGPU를 사용해 PhongMaterial의 기본 속성을 다루고 다양한 텍스쳐 조합을 테스트해 볼 수 있는 샘플 예제입니다.`,
							en: `A sample example that demonstrates how to manipulate the basic properties of PhongMaterial using RedGPU and experiment with different texture combinations.`
						},
					},
					{
						name: 'PhongMaterial Texture<br/>Combination',
						path: '3d/material/phongMaterialTextures',
						thumb: '3d/material/phongMaterialTextures/thumb.png',
						description: {
							ko: `RedGPU를 사용해 PhongMaterial의 다양한 텍스처 조합과 효과를 시각적으로 확인할 수 있는 샘플 예제입니다.`,
							en: `A sample example that visually demonstrates different texture combinations and effects of PhongMaterial using RedGPU.`
						},
					},

				]
			},
			{
				name: 'SkyBox',
				list: [
					{
						name: 'SkyBox',
						path: '3d/skybox/skyBox',
						description: {
							ko: `SkyBox 샘플 예제입니다.`,
							en: `This is a sample SkyBox example.`
						},
					},
					// {
					//     name: 'SphericalSkyBox',
					//     path: '3d/skybox/sphericalSkyBox',
					//     description: {
					//         ko: `SphericalSkyBox 샘플 예제입니다.`,
					//         en: `This is a sample SphericalSkyBox example.`
					//     },
					// },
				]
			},
			{
				name: 'Transparent Sort',
				list: [
					{
						name: 'Transparent Sort',
						path: '3d/transparentSort',
						thumb: '3d/transparentSort/thumb.png',
						description: {
							ko: `반투명 객체가 렌더링되는 순서를 확인하기 위해 메시의 소재에 \`transparent\` 옵션을 적용하는 방법의 예입니다. \`transparent\`를 사용하면 올바른 렌더링 결과를 확인할 수 있습니다.`,
							en: ` example of how to apply the \`transparent\` option to the mesh's material to see the order in which translucent objects are rendered. You can use \`transparent\` to see the correct rendering results.`
						},
					},
				]
			},
			{
				name: 'Texture & Sampler',
				list: [
					{
						name: 'BitmapTexture & Sampler',
						path: '3d/texture/bitmapTextureSampler',
						thumb: '3d/texture/bitmapTextureSampler/thumb.png',
						description: {
							ko: `텍스쳐 샘플러 옵션과 밉맵에 관한 지원을 확인할 수 있는 샘플입니다. `,
							en: `A sample that demonstrates texture sampler options and mipmap support.`
						},
					},
					{
						name: 'Sampler Combination',
						path: '3d/texture/samplerCombination',
						thumb: '3d/texture/samplerCombination/thumb.png',
						description: {
							ko: `텍스쳐 샘플러의 다양한 조합을 한눈에 볼 수 있는 예제입니다.`,
							en: `Here's an example showing the different combinations of texture samplers at a glance.`
						},
					},
					{
						name: 'Sampler SamplerAddressMode',
						path: '3d/texture/samplerAddressMode',
						thumb: '3d/texture/samplerAddressMode/thumb.png',
						description: {
							ko: `텍스쳐 샘플러의 AddressMode 옵션의 조합을 한눈에 볼 수 있는 예제입니다.`,
							en: `An example showing combinations of AddressMode options for a texture sampler.`
						},
					},
					{
						name: 'MaxAnisotropy',
						path: '3d/texture/maxAnisotropy',
						description: {
							ko: `텍스쳐의 Anisotropy 옵션을 확인할 수 있는 예제입니다.`,
							en: `example showing the Anisotropy option for a texture.`
						},
					},
				]
			},
			{
				name: 'Sprite3D & SpriteSheet3D',
				list: [
					{
						name: 'Sprite3D',
						path: '3d/sprite/sprite3D',
						thumb: '3d/sprite/sprite3D/thumb.png',
						description: {
							ko: `Sprite3D 객체에 대한 예제입니다.`,
							en: `example of a Sprite3D object.`
						},
					},
					{
						name: 'SpriteSheet3D',
						path: '3d/sprite/spriteSheet3D',
						thumb: '3d/sprite/spriteSheet3D/thumb.png',
						description: {
							ko: `SpriteSheet3D 객체에 대한 예제입니다.`,
							en: `example of a SpriteSheet3D object.`
						},
					},
				]
			},
			{
				name: 'TextField3D',
				list: [
					{
						name: 'TextField3D',
						path: '3d/textField3D',
						thumb: '3d/textField3D/thumb.png',
						description: {
							ko: `TextField3D 객체에 대한 예제입니다.`,
							en: `example of a TextField3D object.`
						},
					},
				]
			},
			{
				name: 'Light',
				list: [
					{
						name: 'DirectionalLight',
						path: '3d/light/directionalLight',
						thumb: '3d/light/directionalLight/thumb.png',
						description: {
							ko: `DirectionalLight example`,
							en: `DirectionalLight example`
						},
					},
					{
						name: 'PointLight',
						path: '3d/light/pointLight',
						thumb: '3d/light/pointLight/thumb.png',
						description: {
							ko: `PointLight example`,
							en: `PointLight example`
						},
					},
					{
						name: 'PointLight Performance(cluster)',
						path: '3d/light/pointLightPerformance',
						thumb: '3d/light/pointLightPerformance/thumb.png',
						description: {
							ko: `포인트라이트는 클러스터드 타일 렌더를 지원합니다. 1024개의 포인트 라이트를 지원합니다.`,
							en: `PointLight supports clustered tile rendering. Supports 1024 point lights.`
						},
					},
				]
			},
			{
				name: 'Group3D',
				list: [
					{
						name: 'Basic Group3D',
						path: '3d/group3D/basic',
						thumb: '3d/group3D/basic/thumb.png',
						description: {
							ko: `3D오브젝트를 그룹화 할수 있는 Group3D 객체에 대한 예제입니다. `,
							en: `Here's an example of a Group3D object that can group 3D objects.`
						},
					},
				]
			},
			{
				name: 'Tint',
				list: [
					{
						name: 'Tint',
						path: '3d/tint/basic',
						thumb: '3d/tint/basic/thumb.png',
						description: {
							ko: `재질 기반의 tint를 지원합니다. tint의 사용여부와 tintBlendMode, color 설정에 대한 예제입니다.`,
							en: `Supports material-based tint. Examples of using tint, setting tintBlendMode, and color.`
						},
					},
				]
			},
			{
				name: 'Line3D',
				list: [
					{
						name: 'Linear Type',
						path: '3d/line3D/linear',
						thumb: '3d/line3D/linear/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'Bezier Type',
						path: '3d/line3D/bezier',
						thumb: '3d/line3D/bezier/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'CatmullRom Type',
						path: '3d/line3D/catmullRom',
						thumb: '3d/line3D/catmullRom/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: 'MouseEvent',
				list: [
					{
						name: 'Mesh',
						path: '3d/mouseEvent/mesh',
						thumb: '3d/mouseEvent/mesh/thumb.png',
						description: {
							ko: `Mesh에 마우스 이벤트를 설정하는 대한 예제입니다.`,
							en: `Here's an example of setting up mouse events on a Mesh.`
						},
					},
					{
						name: 'Sprite3D',
						path: '3d/mouseEvent/sprite3D',
						thumb: '3d/mouseEvent/sprite3D/thumb.png',
						description: {
							ko: `Sprite3D에 마우스 이벤트를 설정하는 대한 예제입니다.`,
							en: `Here's an example of setting up mouse events on a Sprite3D.`
						},
					},
					{
						name: 'SpriteSheet3D',
						path: '3d/mouseEvent/spriteSheet3D',
						thumb: '3d/mouseEvent/spriteSheet3D/thumb.png',
						description: {
							ko: `SpriteSheet3D에 마우스 이벤트를 설정하는 대한 예제입니다.`,
							en: `Here's an example of setting up mouse events on a SpriteSheet3D.`
						},
					},
					{
						name: 'TextField3D',
						path: '3d/mouseEvent/textField3D',
						thumb: '3d/mouseEvent/textField3D/thumb.png',
						description: {
							ko: `TextField3D에 마우스 이벤트를 설정하는 대한 예제입니다.`,
							en: `Here's an example of setting up mouse events on a TextField3D.`
						},
					},
				]
			},
			{
				name: 'Shadow',
				list: [
					{
						name: 'TODO - DirectionalLight Shadow',
						// path: '3d/shadow/directionalLight',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: 'InstancedMesh',
				list: [
					{
						name: 'InstancedMesh',
						path: '3d/instancedMesh/basic',
						thumb: '3d/instancedMesh/basic/thumb.png',
						description: {
							ko: `InstancedMesh를 지원합니다.`,
							en: `Supports InstancedMesh.`
						},
					},
				]
			},
			{
				name: 'ParticleSystem',
				list: [
					{
						name: 'Particle',
						path: '3d/particle/basic',
						thumb: '3d/particle/basic/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'Multi Particle Performance',
						path: '3d/particle/performance',
						thumb: '3d/particle/performance/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: 'PostEffect',
				list: [
					{
						name: 'Vignetting',
						path: '3d/postEffect/vignetting',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'Convolution',
						path: '3d/postEffect/convolution',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'OldBloom',
						path: '3d/postEffect/oldBloom',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'Adjustments',
						list: [
							{
								name: 'Grayscale',
								path: '3d/postEffect/adjustments/grayscale',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'Invert',
								path: '3d/postEffect/adjustments/invert',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'ColorBalance',
								path: '3d/postEffect/adjustments/colorBalance',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'ColorTemperatureTint',
								path: '3d/postEffect/adjustments/colorTemperatureTint',
								description: {
									ko: ``,
									en: ``
								},
							},

							{
								name: 'BrightnessContrast',
								path: '3d/postEffect/adjustments/brightnessContrast',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'HueSaturation',
								path: '3d/postEffect/adjustments/hueSaturation',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'Threshold',
								path: '3d/postEffect/adjustments/threshold',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'Vibrance',
								path: '3d/postEffect/adjustments/vibrance',
								description: {
									ko: ``,
									en: ``
								},
							},

						]
					},
					{
						name: 'Blur',
						list: [
							{
								name: 'BlurX',
								path: '3d/postEffect/blur/blurX',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'BlurY',
								path: '3d/postEffect/blur/blurY',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'DirectionalBlur',
								path: '3d/postEffect/blur/DirectionalBlur',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'GaussianBlur',
								path: '3d/postEffect/blur/gaussianBlur',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'RadialBlur',
								path: '3d/postEffect/blur/radialBlur',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'ZoomBlur',
								path: '3d/postEffect/blur/zoomBlur',
								description: {
									ko: ``,
									en: ``
								},
							},
						]
					},
				],
			},

		]
	},
	{
		name: 'GLTF',
		list: [
			{
				name: 'Basic',
				list: [
					{
						name: 'TextureEncodingTest',
						path: 'gltf/basic/textureEncodingTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/TextureEncodingTest/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'TextureLinear InterpolationTest',
						path: 'gltf/basic/textureLinearInterpolationTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/TextureLinearInterpolationTest/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'VertexColorTest',
						path: 'gltf/basic/vertexColorTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/VertexColorTest/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'BoxVertexColors',
						path: 'gltf/basic/boxVertexColors',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/BoxVertexColors/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					// {
					//     name: 'OrientationTest',
					//     path: 'gltf/basic/orientationTest',
					//     thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/OrientationTest/screenshot/screenshot-x150.png?raw=true',
					//     description: {
					//         ko: ``,
					//         en: ``
					//     },
					// },
					{
						name: 'TextureCoordinateTest',
						path: 'gltf/basic/textureCoordinateTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/TextureCoordinateTest/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'AlphaBlendModeTest',
						path: 'gltf/basic/alphaBlendModeTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/AlphaBlendModeTest/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'TextureSettingsTest',
						path: 'gltf/basic/textureSettingsTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/TextureSettingsTest/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'MultiUVTest',
						path: 'gltf/basic/multiUVTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/MultiUVTest/screenshot/screenshot-x150.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},

					{
						name: 'MetalRoughSpheres',
						path: 'gltf/basic/metalRoughSpheres',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/MetalRoughSpheres/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'MetalRoughSpheresNoTextures',
						path: 'gltf/basic/metalRoughSpheresNoTextures',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/MetalRoughSpheresNoTextures/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'NormalTangentTest',
						path: 'gltf/basic/normalTangentTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/NormalTangentTest/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'NormalTangentMirrorTest',
						path: 'gltf/basic/normalTangentMirrorTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/NormalTangentMirrorTest/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'NegativeScaleTest',
						path: 'gltf/basic/negativeScaleTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/NegativeScaleTest/screenshot/screenshot.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},

					{
						name: 'EnvironmentTest',
						path: 'gltf/basic/environmentTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/EnvironmentTest/screenshot/screenshot-x150.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: 'Basic Compare',
				list: [
					{
						name: 'CompareBaseColor',
						path: 'gltf/basic/compareBaseColor',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareBaseColor/screenshot/screenshot.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					}, {
						name: 'CompareAlphaCoverage',
						path: 'gltf/basic/compareAlphaCoverage',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareAlphaCoverage/screenshot/screenshot.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'CompareMetallic',
						path: 'gltf/basic/compareMetallic',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareMetallic/screenshot/screenshot.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'CompareNormal',
						path: 'gltf/basic/compareNormal',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareNormal/screenshot/screenshot.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'CompareRoughness',
						path: 'gltf/basic/compareRoughness',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareRoughness/screenshot/screenshot.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'CompareAmbientOcclusion',
						path: 'gltf/basic/compareAmbientOcclusion',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareAmbientOcclusion/screenshot/screenshot.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: 'Animation',
				list: [
					{
						name: 'Basic Animations',
						path: 'gltf/animation/basicAnimations',
						thumb: [
							'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/AnimatedCube/screenshot/screenshot.gif?raw=true',
							'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/AnimatedMorphCube/screenshot/screenshot.gif?raw=true',
							'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/AnimatedTriangle/screenshot/screenshot.gif?raw=true',
							'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/BoxAnimated/screenshot/screenshot.gif?raw=true'
						],
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'SimpleSkin',
						path: 'gltf/animation/simpleSkin',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/SimpleSkin/screenshot/screenshot.gif?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'SimpleMorph',
						path: 'gltf/animation/simpleMorph',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/SimpleMorph/screenshot/screenshot-x150.png?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'RiggedSimple',
						path: 'gltf/animation/riggedSimple',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/RiggedSimple/screenshot/screenshot.gif?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'RiggedFigure',
						path: 'gltf/animation/riggedFigure',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/RiggedFigure/screenshot/screenshot.gif?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'InterpolationTest',
						path: 'gltf/animation/interpolationTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/InterpolationTest/screenshot/screenshot.gif?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'CesiumMan & MilkTruck',
						path: 'gltf/animation/cesiumMan',
						thumb: [
							'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CesiumMan/screenshot/screenshot.gif?raw=true',
							'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CesiumMilkTruck/screenshot/screenshot.gif?raw=true'
						],
						description: {
							ko: ``,
							en: ``
						},
					},

					{
						name: 'BrainStem',
						path: 'gltf/animation/brainStem',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/BrainStem/screenshot/screenshot.gif?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'MorphStressTest',
						path: 'gltf/animation/morphStressTest',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/MorphStressTest/screenshot/screenshot-x150.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'RecursiveSkeletons',
						path: 'gltf/animation/recursiveSkeletons',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/RecursiveSkeletons/screenshot/screenshot-x150.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},

				]
			},
			{
				name: '3D Models',
				list: [
					{
						name: 'corset',
						path: 'gltf/models/corset',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/Corset/screenshot/screenshot-x150.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'Helmets',
						path: 'gltf/models/helmets',
						thumb: [
							'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/DamagedHelmet/screenshot/screenshot-x150.png?raw=true',
							'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/FlightHelmet/screenshot/screenshot-x150.jpg?raw=true',
							'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/SciFiHelmet/screenshot/screenshot-x150.jpg?raw=true',
							'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/Suzanne/screenshot/screenshot-x150.jpg?raw=true',
						],
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'Sponza',
						path: 'gltf/models/sponza',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/Sponza/screenshot/screenshot-x150.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'Tokyo',
						path: 'gltf/models/tokyo',
						thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/Sponza/screenshot/screenshot-x150.jpg?raw=true',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: 'GLTF Extensions',
				list: [
					{
						name: 'KHR_materials_anisotropy',
						list: [
							{
								name: 'CompareAnisotropy',
								path: 'gltf/gltfExtensions/anisotropy/compareAnisotropy',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareAnisotropy/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'AnisotropyDiscTest',
								path: 'gltf/gltfExtensions/anisotropy/anisotropyDiscTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/AnisotropyDiscTest/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'AnisotropyRotationTest',
								path: 'gltf/gltfExtensions/anisotropy/anisotropyRotationTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/AnisotropyRotationTest/screenshot/screenshot.png?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'AnisotropyStrengthTest',
								path: 'gltf/gltfExtensions/anisotropy/anisotropyStrengthTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/AnisotropyStrengthTest/screenshot/screenshot.png?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'AnisotropyBarnLamp',
								path: 'gltf/gltfExtensions/anisotropy/anisotropyBarnLamp',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/AnisotropyBarnLamp/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
						]
					},
					{
						name: 'KHR_materials_clearcoat',
						list: [
							{
								name: 'CompareClearcoat',
								path: 'gltf/gltfExtensions/clearcoat/compareClearcoat',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareClearcoat/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'ClearCoatTest',
								path: 'gltf/gltfExtensions/clearcoat/clearCoatTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/ClearCoatTest/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'ClearcoatWicker',
								path: 'gltf/gltfExtensions/clearcoat/clearcoatWicker',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/ClearcoatWicker/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'ClearCoatCarPaint',
								path: 'gltf/gltfExtensions/clearcoat/clearCoatCarPaint',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/ClearCoatCarPaint/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},

						]
					},
					{
						name: 'KHR_materials_dispersion',
						list: [
							{
								name: 'CompareDispersion',
								path: 'gltf/gltfExtensions/dispersion/compareDispersion',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareDispersion/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'DispersionTest',
								path: 'gltf/gltfExtensions/dispersion/dispersionTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/DispersionTest/screenshot/screenshot.png?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'DragonDispersion',
								path: 'gltf/gltfExtensions/dispersion/dragonDispersion',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/DragonDispersion/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
						]
					},
					{
						name: 'KHR_materials_emissive_strength',
						list: [
							{
								name: 'CompareEmissiveStrength',
								path: 'gltf/gltfExtensions/emissiveStrength/compareEmissiveStrength',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareEmissiveStrength/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'EmissiveStrengthTest',
								path: 'gltf/gltfExtensions/emissiveStrength/emissiveStrengthTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/EmissiveStrengthTest/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
						]
					},
					{
						name: 'KHR_materials_sheen',
						list: [
							{
								name: 'CompareSheen',
								path: 'gltf/gltfExtensions/sheen/compareSheen',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareSheen/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'SheenTestGrid',
								path: 'gltf/gltfExtensions/sheen/sheenTestGrid',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/SheenTestGrid/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'SheenCloth',
								path: 'gltf/gltfExtensions/sheen/sheenCloth',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/SheenCloth/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'SheenChair',
								path: 'gltf/gltfExtensions/sheen/sheenChair',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/SheenChair/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'GlamVelvetSofa',
								path: 'gltf/gltfExtensions/sheen/glamVelvetSofa',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/GlamVelvetSofa/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'ChairDamaskPurplegold',
								path: 'gltf/gltfExtensions/sheen/chairDamaskPurplegold',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/ChairDamaskPurplegold/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},

						]
					},
					{
						name: 'KHR_materials_specular',
						list: [
							{
								name: 'CompareSpecular',
								path: 'gltf/gltfExtensions/specular/compareSpecular',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareSpecular/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'SpecularTest',
								path: 'gltf/gltfExtensions/specular/specularTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/SpecularTest/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'SpecularSilkPouf',
								path: 'gltf/gltfExtensions/specular/specularSilkPouf',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/SpecularSilkPouf/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},

						]
					},
					{
						name: 'KHR_materials_unlit',
						list: [
							{
								name: 'UnlitTest',
								path: 'gltf/gltfExtensions/unlit/unlitTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/UnlitTest/screenshot/screenshot-x150.png?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
						]
					},
					{
						name: 'KHR_texture_transform',
						list: [
							{
								name: 'TextureTransformTest',
								path: 'gltf/gltfExtensions/textureTransform/textureTransformTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/TextureTransformTest/screenshot/screenshot-x150.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'TextureTransformMultiTest',
								path: 'gltf/gltfExtensions/textureTransform/textureTransformMultiTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/TextureTransformMultiTest/screenshot/screenshot-x150.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
						]
					},
					{
						name: 'KHR_materials_transmission',
						list: [
							{
								name: 'CompareTransmission',
								path: 'gltf/gltfExtensions/transmission/compareTransmission',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareTransmission/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'TransmissionTest',
								path: 'gltf/gltfExtensions/transmission/transmissionTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/TransmissionTest/screenshot/screenshot-x150.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'TransmissionRoughnessTest',
								path: 'gltf/gltfExtensions/transmission/transmissionRoughnessTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/TransmissionRoughnessTest/screenshot/screenshot-x150.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'ChronographWatch',
								path: 'gltf/gltfExtensions/transmission/chronographWatch',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/ChronographWatch/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'MosquitoInAmber',
								path: 'gltf/gltfExtensions/transmission/mosquitoInAmber',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/MosquitoInAmber/screenshot/screenshot-x150.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'CommercialRefrigerator',
								path: 'gltf/gltfExtensions/transmission/commercialRefrigerator',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CommercialRefrigerator/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
						]
					},
					{
						name: 'KHR_materials_volume',
						list: [
							{
								name: 'CompareIor',
								path: 'gltf/gltfExtensions/volume/compareIor',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareIor/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'IORTestGrid',
								path: 'gltf/gltfExtensions/volume/IORTestGrid',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/IORTestGrid/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'CompareVolume',
								path: 'gltf/gltfExtensions/volume/compareVolume',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CompareVolume/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'TransmissionThinwallTestGrid',
								path: 'gltf/gltfExtensions/volume/transmissionThinwallTestGrid',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/TransmissionThinwallTestGrid/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'AttenuationTest',
								path: 'gltf/gltfExtensions/volume/attenuationTest',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/AttenuationTest/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'GlassVaseFlowers',
								path: 'gltf/gltfExtensions/volume/glassVaseFlowers',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/GlassVaseFlowers/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'GlassBrokenWindow',
								path: 'gltf/gltfExtensions/volume/glassBrokenWindow',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/GlassBrokenWindow/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'GlassHurricaneCandleHolder',
								path: 'gltf/gltfExtensions/volume/glassHurricaneCandleHolder',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/GlassHurricaneCandleHolder/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
							{
								name: 'DragonAttenuation',
								path: 'gltf/gltfExtensions/volume/dragonAttenuation',
								thumb: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/DragonAttenuation/screenshot/screenshot.jpg?raw=true',
								description: {
									ko: ``,
									en: ``
								},
							},
						]
					},
				]
			}
		]
	},
	{
		name: '2D',
		list: [
			{
				name: 'Hello RedGPU - 2D Mode',
				path: '2d/helloWorld2D',
				thumb: '2d/helloWorld2D/thumb.png',
				description: {
					ko: ``,
					en: ``

				},
			},
			{
				name: 'View2D',
				list: [
					{
						name: 'Multi View (2D + 2D)',
						path: '2d/view/multiView',
						thumb: '2d/view/multiView/thumb.png',
						description: {
							ko: ``,
							en: ``

						},
					},
					{
						name: 'Multi View (3D + 2D)',
						path: '2d/view/multiViewWith3D',
						thumb: '2d/view/multiViewWith3D/thumb.png',
						description: {
							ko: ``,
							en: ``

						},
					},
				]
			},
			{
				name: 'Sprite2D',
				list: [
					{
						name: 'Basic Sprite2D',
						path: '2d/sprite2D/basic',
						thumb: '2d/sprite2D/basic/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'Hierarchy Sprite2D',
						path: '2d/sprite2D/hierarchy',
						thumb: '2d/sprite2D/hierarchy/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'Pivot Sprite2D',
						path: '2d/sprite2D/pivot',
						thumb: '2d/sprite2D/pivot/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'Child Methods',
						path: '2d/sprite2D/childMethod',
						thumb: '2d/sprite2D/childMethod/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: 'SpriteSheet2D',
				list: [
					{
						name: 'Basic SpriteSheet2D',
						path: '2d/spriteSheet2D/basic',
						thumb: '2d/spriteSheet2D/basic/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: 'TextField2D',
				list: [
					{
						name: 'Basic TextField2D',
						path: '2d/textField2D/basic',
						thumb: '2d/textField2D/basic/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: 'Group2D',
				list: [
					{
						name: 'Basic Group2D',
						path: '2d/group2D/basic',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},

			{
				name: '2D Object Opacity',
				list: [
					{
						name: '2D Object Opacity',
						path: '2d/opacity/basic',
						thumb: '2d/opacity/basic/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: '2D BlendMode',
				list: [
					{
						name: 'BlendMode',
						path: '2d/blendMode/basic',
						thumb: '2d/blendMode/basic/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: 'Tint',
				list: [
					{
						name: 'Tint Basic',
						path: '2d/tint/basic',
						thumb: '2d/tint/basic/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					}, {
						name: 'Tint Objects',
						path: '2d/tint/2dObjectTint',
						thumb: '2d/tint/2dObjectTint/thumb.png',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			{
				name: 'MouseEvent',
				list: [
					{
						name: 'Sprite2D',
						path: '2d/mouseEvent/sprite2D',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'SpriteSheet2D',
						path: '2d/mouseEvent/spriteSheet2D',
						description: {
							ko: ``,
							en: ``
						},
					},
					{
						name: 'TextField2D',
						path: '2d/mouseEvent/textField2D',
						description: {
							ko: ``,
							en: ``
						},
					},
				]
			},
			// {
			//     name: 'Line2D',
			//     list: [
			//         {
			//             name: 'Linear Type',
			//             path: '2d/line2D/linear',
			//             description: {
			//                 ko: ``,
			//                 en: ``
			//             },
			//         },
			//         {
			//             name: 'TODO - Bezier Type',
			//             // path: '2d/line2D/bezier',
			//             description: {
			//                 ko: ``,
			//                 en: ``
			//             },
			//         },
			//         {
			//             name: 'TODO - CatmullRom Type',
			//             // path: '2d/line2D/catmullRom',
			//             description: {
			//                 ko: ``,
			//                 en: ``
			//             },
			//         },
			//     ]
			// },

			// {
			// 	name: '2D CompositeMode',
			// 	list: [
			// 		{
			// 			name: 'CompositeMode',
			// 			path: '2d/compositeMode/basic',
			// 			description: {
			// 				ko: ``,
			// 				en: ``
			// 			},
			// 		},
			// 	]
			// },
		]
	},
]
Object.freeze(ExampleList);
export default ExampleList;
