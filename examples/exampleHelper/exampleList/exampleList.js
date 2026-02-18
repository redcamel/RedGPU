const ExampleList = [

    {
        name: '3D',
        list: [
            {
                name: 'Hello RedGPU',
                path: '3d/helloWorld',
                description: {
                    ko: `RedGPU의 기본 초기화 방법을 보여주는 샘플입니다. 초기화 성공 시 제공되는 RedGPUContext 객체의 기본 옵션들을 실시간으로 테스트할 수 있습니다.`, 
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

                        description: {
                            ko: `RedGPU의 View 객체에 대한 샘플입니다. View 객체에 제공되는 기본 옵션들을 실시간으로 테스트할 수 있습니다.`, 
                            en: `This example is a sample for a View object in RedGPU.
                It provides real-time testing of the basic options provided to a View object.`

                        },
                    },
                    {
                        name: 'Multi View3D',
                        path: '3d/view/multiView',
                        description: {
                            ko: `RedGPU의 멀티 뷰 기능을 보여주는 샘플입니다.<br/> RedGPUContext는 여러 개의 View를 소유하고 관리할 수 있습니다.`, 
                            en: `This example is a sample of RedGPU's Multi View.<br/> RedGPUContext can own and manage multiple MultiViews.`

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
                        description: {
                            ko: `RedGPU의 Scene 객체에 대한 샘플입니다.<br/> Scene 객체에 제공되는 기본 옵션들을 실시간으로 테스트할 수 있습니다.`, 
                            en: `This example is a sample of a Scene object in RedGPU.<br/> It provides real-time testing of the basic options provided to the Scene object.`
                        },
                    }
                ]
            },
            {
                name: 'Camera Controller',
                list: [
                    {
                        name: 'FreeController',
                        path: '3d/controller/freeController',
                        description: {
                            ko: `FreeController는 키보드(WASD/QERTFG)와 마우스/터치 입력을 사용하여 1인칭 카메라 제어를 제공합니다.<br/>3D 공간에서의 자유로운 이동, 회전 제어, 속도/가속도 조절 및 키 바인딩 설정 기능을 포함합니다.`, 
                            en: `FreeController provides first-person camera control with keyboard (WASD/QERTFG) and mouse/touch input.<br/>Features include free movement in 3D space, rotation control, customizable speed/acceleration, and key binding configuration.`
                        },
                    },
                    {
                        name: 'OrbitController',
                        path: '3d/controller/orbitController',
                        description: {
                            ko: `OrbitController는 중심점을 기준으로 회전하는 궤도형 카메라 제어를 제공합니다.<br/>마우스 드래그 회전, 휠 줌, 터치 핀치 줌, 중심점 위치 사용자 정의, 거리 제어 및 팬/틸트 제한 기능을 포함합니다.`, 
                            en: `OrbitController provides orbital camera control that rotates around a center point.<br/>Features include mouse drag rotation, wheel zoom, touch pinch zoom, customizable center position, distance control, and pan/tilt limits.`
                        },
                    },
                    {
                        name: 'FollowController',
                        path: '3d/controller/followController',
                        description: {
                            ko: `FollowController는 타겟 메쉬를 따라다니는 3인칭 카메라 제어를 제공합니다.<br/> 부드러운 카메라 추적, 거리 및 높이 조절, 팬/틸트 제어, 타겟 회전 추적 및 휠/핀치 줌 기능을 포함합니다.<br/>3인칭 게임 및 객체 추적 시나리오에 적합합니다.`, 
                            en: `FollowController provides third-person camera control that follows a target mesh.<br/> Features include smooth camera following, customizable distance and height, pan/tilt control, target rotation tracking, and wheel/pinch zoom.<br/>Perfect for third-person games and object tracking scenarios.`
                        },
                    },
                    {
                        name: 'IsometricController',
                        path: '3d/controller/isometricController',
                        description: {
                            ko: `IsometricController는 아이소메트릭 뷰를 위한 고정 각도 직교 투영 카메라 제어를 제공합니다.<br/>타겟 메쉬 추적, 키보드(WASD) 및 마우스 이동, 휠/핀치 줌 제어, 카메라 각도 및 뷰 높이 사용자 정의 기능을 포함합니다.<br/>아이소메트릭 게임, 전략 게임 및 건축 시각화에 이상적입니다.`, 
                            en: `IsometricController provides fixed-angle orthographic camera control for isometric views.<br/>Features include target mesh tracking, keyboard (WASD) and mouse movement, wheel/pinch zoom control, and customizable camera angle and view height.<br/>Ideal for isometric games, strategy games, and architectural visualization.`
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
                        description: {
                            ko: `RedGPU가 지원하는 기본적인 프리미티브 지오메트리들의 샘플입니다.`, 
                            en: `Samples of basic primitive geometries supported by RedGPU.`

                        },
                    },
                    {
                        name: 'Box',
                        path: '3d/primitive/box',
                        description: {
                            ko: `RedGPU가 지원하는 기본 Box 프리미티브에 대한 샘플입니다. Box 설정 옵션을 실시간으로 테스트할 수 있습니다.`, 
                            en: `Samples for the basic Box Primitives supported by RedGPU. Provides real-time testing of Box configuration options.`

                        },
                    },
                    {
                        name: 'Circle',
                        path: '3d/primitive/circle',
                        description: {
                            ko: `RedGPU가 지원하는 기본 Circle 프리미티브에 대한 샘플입니다. Circle 설정 옵션을 실시간으로 테스트할 수 있습니다.`, 
                            en: `Samples for the basic Circle Primitives supported by RedGPU. Provides real-time testing of Circle configuration options.`

                        },
                    },
                    {
                        name: 'Cylinder',
                        path: '3d/primitive/cylinder',
                        description: {
                            ko: `RedGPU가 지원하는 기본 Cylinder 프리미티브에 대한 샘플입니다. Cylinder 설정 옵션을 실시간으로 테스트할 수 있습니다.`, 
                            en: `Samples for the basic Cylinder Primitives supported by RedGPU. Provides real-time testing of Cylinder configuration options.`

                        },
                    },
                    {
                        name: 'Plane',
                        path: '3d/primitive/plane',
                        description: {
                            ko: `RedGPU가 지원하는 기본 Plane 프리미티브에 대한 샘플입니다. Plane 설정 옵션을 실시간으로 테스트할 수 있습니다.`, 
                            en: `Samples for the basic Plane Primitives supported by RedGPU. Provides real-time testing of Plane configuration options.`

                        },
                    },
                    {
                        name: 'Ground',
                        path: '3d/primitive/ground',
                        description: {
                            ko: `RedGPU가 지원하는 기본 Ground 프리미티브에 대한 샘플입니다. Ground 설정 옵션을 실시간으로 테스트할 수 있습니다.`, 
                            en: `Samples for the basic Ground Primitives supported by RedGPU. Provides real-time testing of Ground configuration options.`

                        },
                    },
                    {
                        name: 'Sphere',
                        path: '3d/primitive/sphere',
                        description: {
                            ko: `RedGPU가 지원하는 기본 Sphere 프리미티브에 대한 샘플입니다. Sphere 설정 옵션을 실시간으로 테스트할 수 있습니다.`, 
                            en: `Samples for the basic Sphere Primitives supported by RedGPU. Provides real-time testing of Sphere configuration options.`

                        },
                    },
                    {
                        name: 'Capsule',
                        path: '3d/primitive/capsule',
                        description: {
                            ko: `RedGPU가 지원하는 기본 Capsule 프리미티브에 대한 샘플입니다. Capsule 설정 옵션을 실시간으로 테스트할 수 있습니다.`, 
                            en: `Samples for the basic Capsule Primitives supported by RedGPU. Provides real-time testing of Capsule configuration options.`

                        },
                    },
                    {
                        name: 'Torus',
                        path: '3d/primitive/torus',
                        description: {
                            ko: `RedGPU가 지원하는 기본 Torus 프리미티브에 대한 샘플입니다. Torus 설정 옵션을 실시간으로 테스트할 수 있습니다.`, 
                            en: `Samples for the basic Torus Primitives supported by RedGPU. Provides real-time testing of Torus configuration options.`

                        },
                    },
                    {
                        name: 'TorusKnot',
                        path: '3d/primitive/torusNut',
                        description: {
                            ko: `RedGPU가 지원하는 기본 TorusKnot 프리미티브에 대한 샘플입니다. TorusKnot 설정 옵션을 실시간으로 테스트할 수 있습니다.`, 
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
                        description: {
                            ko: `이 코드는 기본 메쉬를 생성하고 위치, 크기, 회전, 재질 등 주요 속성을 실시간으로 조작하는 방법을 보여주는 샘플입니다. <br/>RedGPU를 사용하여 Box 메쉬를 생성하고 속성과 재질을 조정하는 방법을 보여줍니다.`, 
                            en: `this code is a sample that shows how to create a basic mesh and how to manipulate its main properties (position, scale, rotation, material, etc.) in real time. <br/>This example shows how to create a Box mesh using RedGPU and how to adjust its properties and material.`
                        },
                    },
                    {
                        name: 'Hierarchy Mesh',
                        path: '3d/mesh/hierarchy',
                        description: {
                            ko: `RedGPU를 사용하여 부모-자식 메쉬 계층 구조를 생성하고, 위치, 회전 및 스케일을 조작하는 예제입니다.`, 
                            en: `An example of creating a parent-child mesh hierarchy using RedGPU, and manipulating its position, rotation, and scale.`
                        },
                    },
                    {
                        name: 'Pivot Mesh',
                        path: '3d/mesh/pivot',
                        description: {
                            ko: `RedGPU를 사용하여 부모 및 자식 메쉬를 생성하고 피벗 설정을 통해 회전 중심을 변경하는 방법을 보여주는 실습 예제입니다.`, 
                            en: `A hands-on example that demonstrates how to create parent and child meshes using RedGPU and change the center of rotation via pivot settings.`
                        },
                    },
                    {
                        name: 'Child Methods',
                        path: '3d/mesh/childMethod',
                        description: {
                            ko: `RedGPU를 사용한 자식 노드 관리 예제로, 자식 추가, 삭제, 인덱스 변경, 교체 및 자식 색상 무작위화 등을 통해 노드를 동적으로 제어하는 방법을 보여줍니다.`, 
                            en: `An example of child node management using RedGPU, showing how to dynamically control nodes by adding, deleting, changing index, replacing, and randomizing color of children.`
                        },
                    },
                    {
                        name: 'lookAt Methods',
                        path: '3d/mesh/lookAt',
                        description: {
                            ko: `객체가 특정 지점이나 다른 객체를 바라보도록 하는 lookAt 메서드의 사용법을 보여주는 예제입니다.`, 
                            en: `An example demonstrating the usage of the lookAt method to make an object face a specific point or another object.`
                        },
                    },

                    {
                        name: 'BoundingBox',
                        list: [
                            {
                                name: 'BoundingBox',
                                path: '3d/mesh/boundBox/meshBoundBox',
                                description: {
                                    ko: `메쉬의 바운딩 박스(AABB)를 시각화하고 확인하는 예제입니다.`, 
                                    en: `An example of visualizing and checking the bounding box (AABB) of a mesh.`
                                },
                            },
                            {
                                name: 'AABB - intersects',
                                path: '3d/mesh/boundBox/meshAABBIntersects',
                                description: {
                                    ko: `AABB(Axis-Aligned Bounding Box) 간의 교차 검사 기능을 테스트하는 예제입니다.`, 
                                    en: `An example testing the intersection check function between AABBs (Axis-Aligned Bounding Boxes).`
                                },
                            },
                            {
                                name: 'OBB - intersects',
                                path: '3d/mesh/boundBox/meshOBBIntersects',
                                description: {
                                    ko: `OBB(Oriented Bounding Box) 간의 교차 검사 기능을 테스트하는 예제입니다.`, 
                                    en: `An example testing the intersection check function between OBBs (Oriented Bounding Boxes).`
                                },
                            },
                        ]
                    },

                ]
            },
            {
                name: 'Coordinate Transformation',
                list: [
                    {
                        name: 'worldToLocal / localToWorld',
                        path: '3d/coordinateTransformation/worldToLocal',
                        description: {
                            ko: `월드 좌표와 로컬 좌표 간의 변환을 테스트하는 예제입니다.`, 
                            en: `An example testing the transformation between world coordinates and local coordinates.`
                        },
                    },
                    {
                        name: 'screenToWorld',
                        path: '3d/coordinateTransformation/screenToWorld',
                        description: {
                            ko: `화면(스크린) 좌표를 월드 좌표로 변환하는 방법을 보여주는 예제입니다.`, 
                            en: `An example showing how to convert screen coordinates to world coordinates.`
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
                        description: {
                            ko: `RedGPU ColorMaterial의 기본 색상 조작 및 색상 설정을 위한 편의 메서드들에 대한 실시간 샘플을 제공합니다.`, 
                            en: `Provides real-time samples of the basic color manipulations of RedGPU's ColorMaterial and convenience methods for setting colors.`
                        },
                    },
                    {
                        name: 'BitmapMaterial',
                        path: '3d/material/bitmapMaterial',
                        description: {
                            ko: `RedGPU의 BitmapMaterial 샘플로, 다양한 텍스처 포맷(PNG, JPG, WEBP, SVG)을 적용하여 텍스처 변경을 실시간으로 테스트할 수 있습니다.`, 
                            en: `RedGPU's BitmapMaterial sample allows you to test texture changes in real time by applying various texture formats (PNG, JPG, WEBP, SVG).`
                        },
                    },
                    {
                        name: 'PhongMaterial',
                        path: '3d/material/phongMaterial',
                        description: {
                            ko: `RedGPU를 사용하여 PhongMaterial의 기본 속성을 조작하고 다양한 텍스처 조합을 실험하는 방법을 보여주는 샘플 예제입니다.`, 
                            en: `A sample example that demonstrates how to manipulate the basic properties of PhongMaterial using RedGPU and experiment with different texture combinations.`
                        },
                    },
                    {
                        name: 'PhongMaterial Texture Combination',
                        path: '3d/material/phongMaterialTextures',
                        description: {
                            ko: `RedGPU를 사용하여 PhongMaterial의 다양한 텍스처 조합과 효과를 시각적으로 보여주는 샘플 예제입니다.`, 
                            en: `A sample example that visually demonstrates different texture combinations and effects of PhongMaterial using RedGPU.`
                        },
                    },
                    {
                        name: 'UV Transform',
                        path: '3d/material/uvTransform',
                        description: {
                            ko: `재질의 텍스처 오프셋과 스케일을 조절하여 흐르는 효과나 타일링을 구현하는 방법을 테스트합니다.`, 
                            en: `Tests how to implement scrolling effects or tiling by adjusting the texture offset and scale of the material.`
                        },
                    },
                    {
                        name: 'Material Opacity',
                        path: '3d/material/opacity',
                        description: {
                            ko: `재질의 불투명도(Opacity)를 조절하여 반투명 효과를 테스트하는 예제입니다.`, 
                            en: `An example testing the translucency effect by adjusting the opacity of the material.`
                        },
                    },
                    {
                        name: 'Fragment Variant Test',
                        path: '3d/material/fragmentVariantTest',
                        description: {
                            ko: `쉐이더의 프래그먼트 변형을 테스트하는 예제입니다.`, 
                            en: `An example testing fragment variants of shaders.`
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
                        description: {
                            ko: `텍스처 샘플러 옵션과 밉맵 지원을 시연하는 샘플입니다.`, 
                            en: `A sample that demonstrates texture sampler options and mipmap support.`
                        },
                    },
                    {
                        name: 'Sampler Combination',
                        path: '3d/texture/samplerCombination',
                        description: {
                            ko: `텍스처 샘플러의 다양한 조합을 한눈에 보여주는 예제입니다.`, 
                            en: `Here's an example showing the different combinations of texture samplers at a glance.`
                        },
                    },
                    {
                        name: 'Sampler SamplerAddressMode',
                        path: '3d/texture/samplerAddressMode',
                        description: {
                            ko: `텍스처 샘플러의 AddressMode 옵션 조합을 보여주는 예제입니다.`, 
                            en: `An example showing combinations of AddressMode options for a texture sampler.`
                        },
                    },
                    {
                        name: 'MaxAnisotropy',
                        path: '3d/texture/maxAnisotropy',
                        description: {
                            ko: `텍스처의 비등방성 필터링(Anisotropy) 옵션을 보여주는 예제입니다.`, 
                            en: `example showing the Anisotropy option for a texture.`
                        },
                    },
                ]
            },
            {
                name: 'SkyBox & IBL',
                list: [
                    {
                        name: 'SkyBox',
                        list: [
                            {
                                name: 'Skybox using 6 assets',
                                path: '3d/skybox/skybox',
                                description: {
                                    ko: `6개의 이미지를 사용하여 스카이박스를 구성하는 예제입니다.`, 
                                    en: `An example of constructing a skybox using 6 images.`
                                },
                            },
                            {
                                name: 'Skybox transition',
                                list: [
                                    {
                                        name: 'Basic transition',
                                        path: '3d/skybox/transition/skyboxTransition',
                                        description: {
                                            ko: `스카이박스 간의 부드러운 전환 효과를 보여주는 예제입니다.`, 
                                            en: `An example showing smooth transition effects between skyboxes.`
                                        },
                                    },
                                    {
                                        name: 'transitionAlphaTexture - with NoiseTexture',
                                        path: '3d/skybox/transition/skyboxTransitionWithNoiseTexture',
                                        description: {
                                            ko: `노이즈 텍스처와 알파 텍스처를 사용하여 스카이박스 전환 효과를 연출하는 예제입니다.`, 
                                            en: `An example creating skybox transition effects using noise textures and alpha textures.`
                                        },
                                    },
                                ]
                            }

                        ]
                    },
                    {
                        name: 'IBL',
                        list: [
                            {
                                name: 'Skybox using IBL',
                                path: '3d/skybox/ibl/skyboxWithIbl',
                                description: {
                                    ko: `IBL(Image Based Lighting)을 사용하여 스카이박스를 생성하는 방법을 보여줍니다.`, 
                                    en: `Demonstrates how to create a skybox using IBL (Image Based Lighting).`
                                },
                            },
                            {
                                name: 'IBL Test',
                                path: '3d/skybox/ibl/iblTest',
                                description: {
                                    ko: `이미지 기반 조명(IBL)을 테스트하는 예제입니다.`, 
                                    en: `An example testing Image-Based Lighting (IBL).`
                                },
                            },
                            {
                                name: 'Custom IBL Texture Size',
                                path: '3d/skybox/ibl/iblTextureSize',
                                description: {
                                    ko: `IBL 텍스처의 크기를 사용자 정의하는 예제입니다.`, 
                                    en: `An example of customizing the size of the IBL texture.`
                                },
                            },
                            {
                                name: 'BRDF LUT Test (Dev Only)',
                                path: '3d/skybox/ibl/brdfLutTest',
                                description: {
                                    ko: `새로운 IBL 시스템의 기초인 BRDF LUT 생성을 테스트합니다. (개발 확인용)`,
                                    en: `Tests BRDF LUT generation, the foundation of the new IBL system. (For development verification)`
                                },
                            },
                            {
                                name: 'Irradiance Test (Dev Only)',
                                path: '3d/skybox/ibl/irradianceTest',
                                description: {
                                    ko: `분리된 IrradianceGenerator를 사용하여 환경맵으로부터 Irradiance 맵을 생성하고 테스트합니다. (개발 확인용)`,
                                    en: `Generates and tests an Irradiance map from an environment map using the separated IrradianceGenerator. (For development verification)`
                                },
                            },
                        ]
                    },
                    {
                        name: 'FrustumCulling',
                        list: [
                            {
                                name: 'FrustumCulling',
                                path: '3d/frustumCulling/frustumCulling',
                                description: {
                                    ko: `카메라 시야 밖의 객체를 렌더링에서 제외하는 절두체 컬링(Frustum Culling) 기능을 시연합니다.`, 
                                    en: `Demonstrates Frustum Culling, which excludes objects outside the camera view from rendering.`
                                },
                            },
                            {
                                name: 'DistanceCulling',
                                path: '3d/frustumCulling/distanceCulling',
                                description: {
                                    ko: `카메라와의 거리에 따라 객체를 렌더링에서 제외하는 거리 컬링 기능을 시연합니다.`, 
                                    en: `Demonstrates Distance Culling, which excludes objects from rendering based on their distance from the camera.`
                                },
                            },
                        ]
                    },
                    {
                        name: 'SkyAtmosphere',
                        list: [
                            {
                                name: 'SkyAtmosphere Basic',
                                path: '3d/skyAtmosphere/basic',
                                description: {
                                    ko: `물리 기반 대기 산란(Atmospheric Scattering)을 시뮬레이션하는 SkyAtmosphere의 기본 사용법을 보여줍니다.`,
                                    en: `Shows the basic usage of SkyAtmosphere, which simulates physics-based atmospheric scattering.`
                                },
                            },
                            {
                                name: 'SkyAtmosphere Generator (LUT)',
                                path: '3d/skyAtmosphere/generator',
                                description: {
                                    ko: `SkyAtmosphere 시스템 내부에서 실시간으로 생성되는 LUT(Look-Up Table) 텍스처들을 Sprite3D를 통해 시각화합니다.`,
                                    en: `Visualizes LUT (Look-Up Table) textures generated in real-time within the SkyAtmosphere system using Sprite3D.`
                                },
                            }
                        ]
                    }

                ]
            },
            {
                name: 'DrawDebugger',
                list: [
                    {
                        name: 'DrawDebugger',
                        path: '3d/drawDebugger/basic',
                        description: {
                            ko: `렌더링 정보를 디버깅하기 위한 도구를 시연하는 예제입니다.`, 
                            en: `An example demonstrating tools for debugging rendering information.`
                        },
                    },
                ]
            },
            {
                name: 'Transparent Sort',
                list: [
                    {
                        name: 'Transparent Sort',
                        path: '3d/transparentSort',
                        description: {
                            ko: `메쉬의 재질에 \`transparent\` 옵션을 적용하여 반투명 객체가 렌더링되는 순서를 확인하는 예제입니다. \`transparent\`를 사용하여 올바른 렌더링 결과를 확인할 수 있습니다.`, 
                            en: ` example of how to apply the \`transparent\` option to the mesh's material to see the order in which translucent objects are rendered. You can use \`transparent\` to see the correct rendering results.`
                        },
                    },
                ]
            },

            {
                name: 'Noise Texture',
                experimental: true,
                list: [
                    {
                        name: 'SimplexTexture',
                        experimental: true,
                        list: [
                            {
                                experimental: true,
                                name: 'SimplexTexture',
                                path: '3d/noiseTexture/simplex/basic/',
                                description: {
                                    ko: `심플렉스 노이즈 텍스처를 생성하고 적용하는 기본 예제입니다.`, 
                                    en: `Basic example of generating and applying Simplex Noise Texture.`
                                },
                            },
                            {
                                experimental: true,
                                name: 'Custom SimplexTexture - Fire',
                                path: '3d/noiseTexture/simplex/fire/',
                                description: {
                                    ko: `심플렉스 노이즈를 활용하여 불꽃 효과를 연출하는 커스텀 텍스처 예제입니다.`, 
                                    en: `Custom texture example creating a fire effect using Simplex Noise.`
                                },
                            },
                            {
                                experimental: true,
                                name: 'Custom SimplexTexture - Displacement',
                                path: '3d/noiseTexture/simplex/displacement/',
                                description: {
                                    ko: `심플렉스 노이즈를 활용하여 변위(Displacement) 효과를 주는 예제입니다.`, 
                                    en: `Example applying displacement effects using Simplex Noise.`
                                },
                            },
                        ]
                    },
                    {
                        name: 'VoronoiTexture',
                        experimental: true,
                        list: [
                            {
                                experimental: true,
                                name: 'VoronoiTexture',
                                path: '3d/noiseTexture/voronoi/basic',
                                description: {
                                    ko: `보로노이 노이즈 텍스처를 생성하고 적용하는 예제입니다.`, 
                                    en: `Example of generating and applying Voronoi Noise Texture.`
                                },
                            },
                        ]
                    },
                ]
            },
            {
                name: 'Sprite3D & SpriteSheet3D',
                list: [
                    {
                        name: 'Sprite3D',
                        path: '3d/sprite/sprite3D',
                        description: {
                            ko: `Sprite3D 객체의 사용법을 보여주는 예제입니다.`, 
                            en: `example of a Sprite3D object.`
                        },
                    },
                    {
                        name: 'Sprite3D Comparison (World vs Pixel)',
                        path: '3d/sprite/sprite3DCompare',
                        description: {
                            ko: `Sprite3D의 월드 단위 크기(worldSize)와 고정 픽셀 크기(pixelSize) 설정을 비교 시연하는 예제입니다.`, 
                            en: `A comparison example demonstrating Sprite3D's world unit size (worldSize) and fixed pixel size (pixelSize) settings.`
                        },
                    },
                    {
                        name: 'SpriteSheet3D',
                        path: '3d/sprite/spriteSheet3D',
                        description: {
                            ko: `SpriteSheet3D 객체의 사용법을 보여주는 예제입니다.`, 
                            en: `example of a SpriteSheet3D object.`
                        },
                    },
                    {
                        name: 'SpriteSheet3D Comparison (World vs Pixel)',
                        path: '3d/sprite/spriteSheet3DCompare',
                        description: {
                            ko: `SpriteSheet3D의 월드 단위 크기(worldSize)와 고정 픽셀 크기(pixelSize) 설정을 비교 시연하는 예제입니다.`, 
                            en: `A comparison example demonstrating SpriteSheet3D's world unit size (worldSize) and fixed pixel size (pixelSize) settings.`
                        },
                    },
                ]
            },
            {
                name: 'TextField3D',
                list: [
                    {
                        name: 'TextField3D',
                        path: '3d/textField/textField3D',
                        description: {
                            ko: `TextField3D 객체의 사용법을 보여주는 예제입니다.`, 
                            en: `example of a TextField3D object.`
                        },
                    },
                    {
                        name: 'TextField3D Comparison (World vs Pixel)',
                        path: '3d/textField/textField3DCompare',
                        description: {
                            ko: `TextField3D의 월드 단위 크기(worldSize)와 고정 픽셀 크기(usePixelSize) 설정을 비교 시연하는 예제입니다.`, 
                            en: `A comparison example demonstrating TextField3D's world unit size (worldSize) and fixed pixel size (usePixelSize) settings.`
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
                        description: {
                            ko: `태양광과 같은 직사광(Directional Light)을 시연하는 예제입니다.`, 
                            en: `An example demonstrating Directional Light, simulating sunlight.`
                        },
                    },
                    {
                        name: 'PointLight',
                        path: '3d/light/pointLight',
                        description: {
                            ko: `한 지점에서 모든 방향으로 빛을 방출하는 점광원(Point Light)을 시연하는 예제입니다.`, 
                            en: `An example demonstrating Point Light, emitting light in all directions from a point.`
                        },
                    },
                    {
                        name: 'PointLight with glTF',
                        path: '3d/light/pointLightWithGltf',
                        description: {
                            ko: `현대적인 감쇄(Attenuation) 수식이 적용된 Point Light와 glTF PBR 모델의 상호작용 예제입니다.`, 
                            en: `An example of interaction between Point Light with modern attenuation formula and glTF PBR model.`
                        },
                    },
                    {
                        name: 'SpotLight',
                        path: '3d/light/spotLight',
                        description: {
                            ko: `특정 방향으로 원뿔형 빛을 방출하는 스포트라이트(Spot Light)를 시연하는 예제입니다.`, 
                            en: `An example demonstrating Spot Light, cone-shaped light in a specific direction.`
                        },
                    },
                    {
                        name: 'PointLight Performance(cluster)',
                        path: '3d/light/pointLightPerformance',
                        description: {
                            ko: `PointLight는 클러스터 타일 렌더링을 지원합니다. 1024개의 포인트 라이트를 지원합니다.`, 
                            en: `PointLight supports clustered tile rendering. Supports 1024 point lights.`
                        },
                    },
                    {
                        name: 'SpotLight Performance(cluster)',
                        path: '3d/light/spotLightPerformance',
                        description: {
                            ko: `SpotLight의 대량 렌더링 성능(클러스터링)을 테스트하는 예제입니다.`, 
                            en: `An example testing the mass rendering performance (clustering) of SpotLights.`
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
                        description: {
                            ko: `3D 객체들을 그룹화할 수 있는 Group3D 객체의 예제입니다.`, 
                            en: `Here's an example of a Group3D object that can group 3D objects.`
                        },
                    },
                ]
            },
            {
                name: 'Tint',
                experimental: true,
                list: [
                    {
                        experimental: true,
                        name: 'Tint',
                        path: '3d/tint/basic',
                        description: {
                            ko: `재질 기반 틴트를 지원합니다. 틴트 사용, tintBlendMode 설정 및 색상 사용 예제입니다.`, 
                            en: `Supports material-based tint. Examples of using tint, setting tintBlendMode, and color.`
                        },
                    },
                ]
            },
            {
                name: 'Line3D',
                experimental: true,
                list: [
                    {
                        experimental: true,
                        name: 'Linear Type',
                        path: '3d/line3D/linear',
                        description: {
                            ko: `직선 형태의 라인을 그리는 예제입니다.`, 
                            en: `An example of drawing linear lines.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Bezier Type',
                        path: '3d/line3D/bezier',
                        description: {
                            ko: `베지에 곡선 형태의 라인을 그리는 예제입니다.`, 
                            en: `An example of drawing Bezier curve lines.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'CatmullRom Type',
                        path: '3d/line3D/catmullRom',
                        description: {
                            ko: `캣멀-롬 스플라인 형태의 라인을 그리는 예제입니다.`, 
                            en: `An example of drawing Catmull-Rom spline lines.`
                        },
                    },
                ]
            },
            {
                name: 'Interaction',
                list: [
                    {
                        name: 'MouseEvent',
                        list: [
                            {
                                name: 'Mesh',
                                path: '3d/interaction/mouseEvent/mesh',
                                description: {
                                    ko: `Mesh에 마우스 이벤트를 설정하는 예제입니다.`, 
                                    en: `Here's an example of setting up mouse events on a Mesh.`
                                },
                            },
                            {
                                name: 'Sprite3D',
                                path: '3d/interaction/mouseEvent/sprite3D',
                                description: {
                                    ko: `Sprite3D에 마우스 이벤트를 설정하는 예제입니다.`, 
                                    en: `Here's an example of setting up mouse events on a Sprite3D.`
                                },
                            },
                            {
                                name: 'SpriteSheet3D',
                                path: '3d/interaction/mouseEvent/spriteSheet3D',
                                description: {
                                    ko: `SpriteSheet3D에 마우스 이벤트를 설정하는 예제입니다.`, 
                                    en: `Here's an example of setting up mouse events on a SpriteSheet3D.`
                                },
                            },
                            {
                                name: 'TextField3D',
                                path: '3d/interaction/mouseEvent/textField3D',
                                description: {
                                    ko: `TextField3D에 마우스 이벤트를 설정하는 예제입니다.`, 
                                    en: `Here's an example of setting up mouse events on a TextField3D.`
                                },
                            },
                            {
                                name: 'Raycasting (Precision Picking)',
                                path: '3d/interaction/mouseEvent/raycasting',
                                description: {
                                    ko: `이 예제는 복잡한 지오메트리(TorusKnot)에 대한 고정밀 레이캐스팅을 보여줍니다.<br/>버텍스 버퍼를 분석하여 정확한 교차 지점, 면 인덱스 및 로컬 좌표를 CPU에서 계산합니다.`, 
                                    en: `This example demonstrates high-precision raycasting on complex geometry (TorusKnot).<br/>It calculates the exact intersection point, face index, and local coordinates on the CPU by analyzing vertex buffers.`
                                },
                            },
                        ]
                    },
                    {
                        name: 'KeyboardEvent',
                        list: [
                            {
                                name: 'Keyboard Interaction',
                                path: '3d/interaction/keyboardEvent',
                                description: {
                                    ko: `keyboardKeyBuffer를 사용하여 매 프레임 키보드 상태를 체크하고 객체를 제어하는 기초적인 방법을 보여줍니다.`, 
                                    en: `Shows basic way to check keyboard state every frame and control an object using keyboardKeyBuffer.`
                                },
                            }
                        ]
                    },
                ]
            },
            {
                name: 'Shadow',
                list: [
                    {
                        name: 'DirectionalLight Shadow',
                        path: '3d/shadow/directionalShadow',
                        description: {
                            ko: `DirectionalLight에 의한 그림자 효과를 시연하는 예제입니다.`, 
                            en: `An example demonstrating shadow effects caused by DirectionalLight.`
                        },
                    },
                    {
                        name: 'DirectionalLight Shadow - GLTF',
                        path: '3d/shadow/gltfDirectionalShadow',
                        description: {
                            ko: `GLTF 모델에 대한 DirectionalLight 그림자 효과를 시연하는 예제입니다.`, 
                            en: `An example demonstrating DirectionalLight shadow effects on a GLTF model.`
                        },
                    },
                ]
            },
            {
                name: 'InstancedMesh',
                list: [
                    {
                        name: 'InstancedMesh Simple',
                        path: '3d/instancedMesh/simple',
                        description: {
                            ko: `이 데모는 간단한 Plane을 사용한 인스턴스 성능 테스트를 보여줍니다. WebGPU의 최소 안전 메모리인 128MB 버퍼(100만 인스턴스)를 최대한 활용합니다.`, 
                            en: `This demo demonstrates instance performance testing using a simple Plane. This demo maximizes the WebGPU's minimum safe memory of 128 MB buffer (1 million instances).`
                        },
                    },
                    {
                        name: 'InstancedMesh Sphere',
                        path: '3d/instancedMesh/sphere',
                        description: {
                            ko: `이 데모는 Sphere를 사용한 인스턴스 성능 테스트를 보여줍니다. WebGPU의 최소 안전 메모리인 128MB 버퍼(100만 인스턴스)를 최대한 활용합니다.`, 
                            en: `This demo demonstrates instance performance testing using Sphere. This demo maximizes the WebGPU's minimum safe memory of 128 MB buffer (1 million instances).`
                        },
                    },
                ]
            },
            {
                name: 'LOD',
                list: [
                    {
                        name: 'InstanceMesh GPU LOD',
                        path: '3d/lod/InstanceMeshGPULOD',
                        description: {
                            ko: `이 데모는 인스턴스 메쉬에 대한 GPU LOD 성능 테스트를 보여줍니다. WebGPU의 최소 안전 메모리인 128MB 버퍼(100만 인스턴스)를 최대한 활용합니다.`, 
                            en: `This demo demonstrates GPU LOD performance testing for instanced meshes. It fully utilizes WebGPU's minimum safe memory of 128MB buffer (1 million instances).`
                        },
                    },
                    {
                        name: 'Mesh CPU LOD',
                        path: '3d/lod/MeshCPULOD',
                        description: {
                            ko: `이 데모는 메쉬에 대한 CPU LOD 성능 테스트를 보여줍니다.`, 
                            en: `This demo demonstrates CPU LOD performance testing for meshes.`
                        },
                    },
                    {
                        name: 'Multi Material GPU LOD',
                        path: '3d/lod/InstanceMeshGPULOD_material',
                        description: {
                            ko: `이 데모는 GPU LOD에서 다양한 재질을 활용하는 테스트를 보여줍니다.`, 
                            en: `This demo demonstrates testing utilizing different materials in GPU LOD.`
                        },
                    },
                    {
                        name: 'Multi Material CPU LOD',
                        path: '3d/lod/MeshCPULOD_material',
                        description: {
                            ko: `이 데모는 CPU LOD에서 다양한 재질을 활용하는 테스트를 보여줍니다.`, 
                            en: `This demo demonstrates testing utilizing different materials in CPU LOD.`
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
                        description: {
                            ko: `기본적인 파티클 시스템을 시연하는 예제입니다.`, 
                            en: `An example demonstrating a basic particle system.`
                        },
                    },
                    {
                        name: 'Multi Particle Performance',
                        path: '3d/particle/performance',
                        description: {
                            ko: `다수의 파티클 시스템을 동시에 렌더링하여 성능을 테스트하는 예제입니다.`, 
                            en: `An example testing performance by rendering multiple particle systems simultaneously.`
                        },
                    },
                ]
            },
            {
                name: 'Indirect Draw Test',
                list: [
                    {
                        name: 'drawIndexedIndirect Test',
                        path: '3d/indirectDrawTest',
                        description: {
                            ko: `drawIndexedIndirect 기능을 테스트하는 예제입니다.`, 
                            en: `An example testing the drawIndexedIndirect function.`
                        },
                    }
                ]
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
                        description: {
                            ko: `텍스처가 올바른 전달 함수(Transfer Function)로 샘플링되는지 테스트합니다. Base Color와 Emissive가 sRGB에서 올바르게 디코딩되는지 확인합니다.`, 
                            en: `Tests that textures are sampled with the correct transfer functions. Verifies base color and emissive textures are decoded from sRGB.`
                        },
                    },
                    {
                        name: 'TextureLinear InterpolationTest',
                        path: 'gltf/basic/textureLinearInterpolationTest',
                        description: {
                            ko: `sRGB 디코딩 후 선형 값에 대해 텍스처 선형 보간이 올바르게 수행되는지 테스트합니다.`, 
                            en: `Tests that linear texture interpolation is correctly performed on linear values (after sRGB decoding).`
                        },
                    },
                    {
                        name: 'VertexColorTest',
                        path: 'gltf/basic/vertexColorTest',
                        description: {
                            ko: `뷰어가 정점 색상(COLORS_0 속성)을 올바르게 지원하는지 테스트합니다.`, 
                            en: `Tests proper support for vertex colors (COLORS_0 attribute) in the viewer.`
                        },
                    },
                    {
                        name: 'BoxVertexColors',
                        path: 'gltf/basic/boxVertexColors',
                        description: {
                            ko: `각 면에 정점 색상이 적용된 간단한 박스 모델입니다.`, 
                            en: `A simple box model with vertex colors applied to each face.`
                        },
                    },
                    {
                        name: 'OrientationTest',
                        path: 'gltf/basic/orientationTest',
                        description: {
                            ko: `노드의 회전 및 방향(Quaternion) 처리가 올바른지 테스트합니다.`, 
                            en: `Tests the correctness of node rotation and orientation (Quaternion) handling.`
                        },
                    },
                    {
                        name: 'TextureCoordinateTest',
                        path: 'gltf/basic/textureCoordinateTest',
                        description: {
                            ko: `XYZ 위치(3D 공간 좌표)와 UV 위치(2D 텍스처 좌표) 간의 관계를 보여줍니다.`, 
                            en: `Demonstrates the relationship between XYZ positions and UV texture coordinates.`
                        },
                    },
                    {
                        name: 'AlphaBlendModeTest',
                        path: 'gltf/basic/alphaBlendModeTest',
                        description: {
                            ko: `다양한 알파 모드(OPAQUE, BLEND, MASK)가 올바르게 렌더링되는지 테스트합니다.`, 
                            en: `Tests the various alpha modes (OPAQUE, BLEND, MASK) to verify correct rendering.`
                        },
                    },
                    {
                        name: 'TextureSettingsTest',
                        path: 'gltf/basic/textureSettingsTest',
                        description: {
                            ko: `텍스처 샘플링 설정(Wrap 모드, 필터링)을 테스트합니다.`, 
                            en: `Tests texture sampling settings (Wrap modes, Filtering).`
                        },
                    },
                    {
                        name: 'MultiUVTest',
                        path: 'gltf/basic/multiUVTest',
                        description: {
                            ko: `다중 텍스처 좌표 속성(예: 색상용 TEXCOORD_0, 기타 요소용 TEXCOORD_1)의 사용을 시연합니다.`, 
                            en: `Demonstrates the usage of multiple texture coordinate attributes (e.g., TEXCOORD_0 for color, TEXCOORD_1 for other elements).`
                        },
                    },

                    {
                        name: 'MetalRoughSpheres',
                        path: 'gltf/basic/metalRoughSpheres',
                        description: {
                            ko: `다양한 금속성(Metallic)과 거칠기(Roughness) 값을 가진 구체들을 통해 PBR 렌더링을 테스트합니다.`, 
                            en: `Tests PBR rendering via spheres with varying Metallic and Roughness values.`
                        },
                    },
                    {
                        name: 'MetalRoughSpheresNoTextures',
                        path: 'gltf/basic/metalRoughSpheresNoTextures',
                        description: {
                            ko: `텍스처 없이 재질의 요소(Factor) 값만으로 금속성과 거칠기를 표현하는 테스트입니다.`, 
                            en: `Tests representing metallic and roughness using only material factor values without textures.`
                        },
                    },
                    {
                        name: 'WaterBottle',
                        path: 'gltf/basic/waterBottle',
                        description: {
                            ko: `Normal, Occlusion, Emissive 맵을 사용하는 기본적인 금속/거칠기(Metal/Roughness) PBR 물병 모델입니다.`, 
                            en: `A basic Metal/Roughness PBR water bottle model using Normal, Occlusion, and Emissive maps.`
                        },
                    },
                    {
                        name: 'NormalTangentTest',
                        path: 'gltf/basic/normalTangentTest',
                        description: {
                            ko: `노멀 맵핑과 탄젠트 공간 계산의 정확성을 테스트합니다.`, 
                            en: `Tests the accuracy of normal mapping and tangent space calculations.`
                        },
                    },
                    {
                        name: 'NormalTangentMirrorTest',
                        path: 'gltf/basic/normalTangentMirrorTest',
                        description: {
                            ko: `미러링된 텍스처 좌표에서의 노멀 맵핑 처리를 테스트합니다.`, 
                            en: `Tests normal mapping handling with mirrored texture coordinates.`
                        },
                    },
                    {
                        name: 'NegativeScaleTest',
                        path: 'gltf/basic/negativeScaleTest',
                        description: {
                            ko: `음수 스케일(반전)이 적용된 노드의 렌더링을 테스트합니다.`, 
                            en: `Tests rendering of nodes with negative scale (inversion) applied.`
                        },
                    },

                    {
                        name: 'EnvironmentTest',
                        path: 'gltf/basic/environmentTest',
                        description: {
                            ko: `금속 표면에서의 환경 맵 반사 효과를 테스트합니다.`, 
                            en: `Tests environment map reflection effects on metallic surfaces.`
                        },
                    },
                    {
                        name: 'Generate normal vector test',
                        path: 'gltf/basic/generateNormalTest',
                        description: {
                            ko: `모델에 노멀 정보가 없을 때 자동으로 노멀 벡터를 생성하는 기능을 테스트합니다.`, 
                            en: `Tests the automatic generation of normal vectors when the model lacks normal information.`
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
                        description: {
                            ko: `기본 색상(Base Color) 렌더링 결과를 비교합니다.`, 
                            en: `Compares Base Color rendering results.`
                        },
                    }, {
                        name: 'CompareAlphaCoverage',
                        path: 'gltf/basic/compareAlphaCoverage',
                        description: {
                            ko: `알파 커버리지(Alpha Coverage) 렌더링 결과를 비교합니다.`, 
                            en: `Compares Alpha Coverage rendering results.`
                        },
                    },
                    {
                        name: 'CompareMetallic',
                        path: 'gltf/basic/compareMetallic',
                        description: {
                            ko: `금속성(Metallic) 렌더링 결과를 비교합니다.`, 
                            en: `Compares Metallic rendering results.`
                        },
                    },
                    {
                        name: 'CompareNormal',
                        path: 'gltf/basic/compareNormal',
                        description: {
                            ko: `노멀 맵(Normal Map) 렌더링 결과를 비교합니다.`, 
                            en: `Compares Normal Map rendering results.`
                        },
                    },
                    {
                        name: 'CompareRoughness',
                        path: 'gltf/basic/compareRoughness',
                        description: {
                            ko: `거칠기(Roughness) 렌더링 결과를 비교합니다.`, 
                            en: `Compares Roughness rendering results.`
                        },
                    },
                    {
                        name: 'CompareAmbientOcclusion',
                        path: 'gltf/basic/compareAmbientOcclusion',
                        description: {
                            ko: `앰비언트 오클루전(AO) 렌더링 결과를 비교합니다.`, 
                            en: `Compares Ambient Occlusion (AO) rendering results.`
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
                        description: {
                            ko: `노드의 이동, 회전, 크기 조절 애니메이션을 보여주는 기본 예제입니다.`, 
                            en: `Basic example showing node translation, rotation, and scaling animations.`
                        },
                    },
                    {
                        name: 'SimpleSkin',
                        path: 'gltf/animation/simpleSkin',
                        description: {
                            ko: `가장 기본적인 형태의 스키닝(Skinning) 애니메이션 예제입니다.`, 
                            en: `The most basic example of skinning animation.`
                        },
                    },
                    {
                        name: 'SimpleMorph',
                        path: 'gltf/animation/simpleMorph',
                        description: {
                            ko: `간단한 모프 타겟(Morph Target) 애니메이션 예제입니다.`, 
                            en: `Simple Morph Target animation example.`
                        },
                    },
                    {
                        name: 'RiggedSimple',
                        path: 'gltf/animation/riggedSimple',
                        description: {
                            ko: `간단하게 리깅된 원통형 메쉬를 통해 스키닝 동작을 확인합니다.`, 
                            en: `Verifies skinning behavior via a simply rigged cylindrical mesh.`
                        },
                    },
                    {
                        name: 'RiggedFigure',
                        path: 'gltf/animation/riggedFigure',
                        description: {
                            ko: `리깅된 인간형 캐릭터 모델의 애니메이션을 테스트합니다.`, 
                            en: `Tests animation of a rigged humanoid character model.`
                        },
                    },
                    {
                        name: 'InterpolationTest',
                        path: 'gltf/animation/interpolationTest',
                        description: {
                            ko: `애니메이션 보간 모드(Step, Linear, Cubic Spline)의 차이를 보여줍니다.`, 
                            en: `Demonstrates the differences between animation interpolation modes (Step, Linear, Cubic Spline).`
                        },
                    },
                    {
                        name: 'CesiumMan & MilkTruck',
                        path: 'gltf/animation/cesiumMan',
                        description: {
                            ko: `스키닝된 CesiumMan과 애니메이션이 적용된 우유 트럭 모델입니다.`, 
                            en: `Skinned CesiumMan and animated Milk Truck models.`
                        },
                    },

                    {
                        name: 'BrainStem',
                        path: 'gltf/animation/brainStem',
                        description: {
                            ko: `복잡한 계층 구조와 스키닝을 가진 BrainStem 모델 애니메이션입니다.`, 
                            en: `BrainStem model animation with complex hierarchy and skinning.`
                        },
                    },
                    {
                        name: 'MorphStressTest',
                        path: 'gltf/animation/morphStressTest',
                        description: {
                            ko: `다수의 활성 정점 속성(최대 18개)을 사용하여 모프 타겟 구현을 스트레스 테스트합니다.`, 
                            en: `Stress-tests morph target implementations with a high number of active vertex attributes (up to 18).`
                        },
                    },
                    {
                        name: 'RecursiveSkeletons',
                        path: 'gltf/animation/recursiveSkeletons',
                        description: {
                            ko: `복잡한 스키닝 케이스(다른 스킨으로 메쉬 재사용, 단일 스켈레톤에 다중 스킨 바인딩)를 테스트합니다.`, 
                            en: `Tests complex skinning cases: reusing meshes with different skins and binding multiple skins to a single skeleton.`
                        },
                    },
                    {
                        name: 'Animation Performance Test',
                        list: [
                            {
                                name: 'Medium load Skinning',
                                path: 'gltf/animation/performance/mediumLoadSkinning',
                                description: {
                                    ko: `19개의 관절과 57개의 애니메이션 채널을 가진 다수의 모델을 계산하는 성능 데모입니다.`, 
                                    en: `This is a performance demo that computes a large number of models with 19 joints and 57 animation channels.`
                                },
                            },
                            {
                                name: 'High vertex load Skinning',
                                path: 'gltf/animation/performance/highVertexLoadSkinning',
                                description: {
                                    ko: `많은 정점과 관절을 가진 모델에 대한 스키닝 성능을 측정하는 테스트를 수행합니다. 각 장치의 성능 한계를 확인하기 위해 FPS와 GPU/CPU 사용량을 모니터링합니다.`, 
                                    en: `perform tests to measure skinning performance for models with many vertices and joints. We monitor FPS and GPU/CPU utilization to determine performance limits for each device.`
                                },
                            },
                            {
                                name: 'Morph target load Test',
                                path: 'gltf/animation/performance/highMorphTarget',
                                description: {
                                    ko: `수백 개의 MorphStressTest 모델을 인스턴스화하여 모프 스트레스 테스트를 수행합니다.
실시간 모프 타겟 스키닝 성능을 극한까지 벤치마킹합니다. 세 가지 애니메이션 중 가장 무거운 모프 타겟 애니메이션의 성능을 테스트합니다.
각 장치의 성능 한계를 확인하세요.`, 
                                    en: `Perform morph stress tests by instantiating hundreds of MorphStressTest models.
Benchmark real-time morph target skinning performance to the limit. Test the performance of the heaviest of the three animations, the morph target animation.
Check performance limits on each device.`
                                },
                            },
                        ]
                    },
                ]
            },
            {
                name: '3D Models',
                list: [
                    {
                        name: 'corset',
                        path: 'gltf/models/corset',
                        description: {
                            ko: `복잡한 형상과 텍스처를 가진 고해상도 코르셋 모델입니다.`, 
                            en: `High-resolution Corset model with complex geometry and textures.`
                        },
                    },
                    {
                        name: 'Helmets',
                        path: 'gltf/models/helmets',
                        description: {
                            ko: `손상된 헬멧(Damaged Helmet) 등 고품질 PBR 텍스처를 보여주는 모델들입니다.`, 
                            en: `Models showcasing high-quality PBR textures, such as the Damaged Helmet.`
                        },
                    },
                    {
                        name: 'Sponza',
                        path: 'gltf/models/sponza',
                        description: {
                            ko: `조명 테스트에 널리 사용되는 건물 내부 모델입니다. 현대적인 PBR 파이프라인을 위해 고해상도 지오메트리로 리메이크되었습니다.`, 
                            en: `Building interior commonly used for testing lighting. Remade for modern PBR pipelines with high-resolution geometry.`
                        },
                    },
                    {
                        name: 'Tokyo',
                        path: 'gltf/models/tokyo',
                        description: {
                            ko: `수많은 드로우 콜과 대규모 씬 렌더링을 테스트하는 도쿄 도시 모델입니다.`, 
                            en: `Tokyo city model testing large-scale scene rendering and numerous draw calls.`
                        },
                    },
                    {
                        name: 'texcooredNTest',
                        path: 'gltf/models/texcooredNTest',
                        description: {
                            ko: `다중 텍스처 좌표 채널의 동작을 확인하는 테스트 모델입니다.`, 
                            en: `Test model verifying the behavior of multiple texture coordinate channels.`
                        },
                    },
                    {
                        name: 'ABeautifulGame',
                        path: 'gltf/models/aBeautifulGame',
                        extensionList: ['KHR_materials_transmission', 'KHR_materials_volume'],
                        description: {
                            ko: `투과(Transmission)와 볼륨(Volume) 효과를 시연하는 체스 세트입니다.`, 
                            en: `A chess set demonstrating transmission and volume.`
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
                                extensionList: ['KHR_materials_anisotropy'],
                                description: {
                                    ko: `비등방성(Anisotropy)이 있는 렌더링과 없는 렌더링을 비교합니다.`, 
                                    en: `Compares rendering with and without anisotropy.`
                                },
                            },
                            {
                                name: 'AnisotropyDiscTest',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyDiscTest',
                                extensionList: ['KHR_materials_anisotropy'],
                                description: {
                                    ko: `원판 형태의 비등방성 하이라이트 회전을 테스트합니다.`, 
                                    en: `Tests anisotropic highlight rotation on a disc shape.`
                                },
                            },
                            {
                                name: 'AnisotropyRotationTest',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyRotationTest',
                                extensionList: ['KHR_materials_anisotropy'],
                                description: {
                                    ko: `비등방성 방향 회전에 따른 렌더링 변화를 테스트합니다.`, 
                                    en: `Tests rendering changes based on anisotropy direction rotation.`
                                },
                            },
                            {
                                name: 'AnisotropyStrengthTest',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyStrengthTest',
                                extensionList: ['KHR_materials_anisotropy'],
                                description: {
                                    ko: `비등방성 강도(Strength)에 따른 하이라이트 변화를 테스트합니다.`, 
                                    en: `Tests highlight changes based on anisotropy strength.`
                                },
                            },
                            {
                                name: 'AnisotropyBarnLamp',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyBarnLamp',
                                extensionList: ['KHR_materials_anisotropy'],
                                description: {
                                    ko: `비등방성(Anisotropic) 재질 속성을 보여주는 헛간 램프 모델입니다.`, 
                                    en: `A barn lamp model showcasing anisotropic material properties.`
                                },
                            },
                        ]
                    },
                    {
                        name: 'KHR_materials_iridescence',
                        list: [
                            {
                                name: 'CompareIridescence',
                                path: 'gltf/gltfExtensions/iridescence/compareIridescence',
                                extensionList: ['KHR_materials_iridescence'],
                                description: {
                                    ko: `무지개빛(Iridescence) 박막 간섭 효과를 비교합니다.`, 
                                    en: `Compares Iridescence thin-film interference effects.`
                                },
                            },
                            {
                                name: 'IridescenceDielectricSpheres',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceDielectricSpheres',
                                extensionList: ['KHR_materials_iridescence', 'KHR_materials_transmission', 'KHR_materials_volume'],
                                description: {
                                    ko: `비금속(유전체) 재질에서 KHR_materials_iridescence 확장을 테스트합니다.`, 
                                    en: `Tests the KHR_materials_iridescence extension on non-metallic (dielectric) materials.`
                                },
                            },
                            {
                                name: 'IridescenceMetallicSpheres',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceMetallicSpheres',
                                extensionList: ['KHR_materials_iridescence'],
                                description: {
                                    ko: `금속 구체에 적용된 무지개빛 효과를 테스트합니다.`, 
                                    en: `Tests iridescence effects applied to metallic spheres.`
                                },
                            },
                            {
                                name: 'IridescenceSuzanne',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceSuzanne',
                                extensionList: ['KHR_materials_iridescence'],
                                description: {
                                    ko: `Suzanne 모델에 적용된 무지개빛 쉐이더 테스트입니다.`, 
                                    en: `Iridescence shader test applied to the Suzanne model.`
                                },
                            },
                            {
                                name: 'IridescenceLamp',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceLamp',
                                extensionList: ['KHR_materials_iridescence', 'KHR_materials_transmission', 'KHR_materials_volume'],
                                description: {
                                    ko: `투과 및 볼륨 효과와 함께 KHR_materials_iridescence를 보여주는 Wayfair 램프 모델입니다.`, 
                                    en: `A Wayfair lamp model showcasing transmission, volume, and KHR_materials_iridescence.`
                                },
                            },
                            {
                                name: 'SunglassesKhronos',
                                path: 'gltf/gltfExtensions/iridescence/sunglassesKhronos',
                                extensionList: ['KHR_materials_iridescence', 'KHR_materials_transmission'],
                                description: {
                                    ko: `렌즈에 얇은 막 무지개빛 효과가 적용된 선글라스 모델입니다.`, 
                                    en: `Sunglasses model with thin-film iridescence effects applied to the lenses.`
                                },
                            },
                            {
                                name: 'IridescentDishWithOlives',
                                path: 'gltf/gltfExtensions/iridescence/iridescentDishWithOlives',
                                extensionList: ['KHR_materials_iridescence', 'KHR_materials_transmission', 'KHR_materials_volume', 'KHR_materials_ior', 'KHR_materials_specular'],
                                description: {
                                    ko: `투과, 볼륨, IOR 및 스펙큘러 속성을 보여주는 접시 모델입니다.`, 
                                    en: `A dish demonstrating transmission, volume, IOR, and specular properties.`
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
                                extensionList: ['KHR_materials_clearcoat'],
                                description: {
                                    ko: `클리어코트(Clearcoat) 재질 렌더링 결과를 비교합니다.`, 
                                    en: `Compares Clearcoat material rendering results.`
                                },
                            },
                            {
                                name: 'ClearCoatTest',
                                path: 'gltf/gltfExtensions/clearcoat/clearCoatTest',
                                extensionList: ['KHR_materials_clearcoat'],
                                description: {
                                    ko: `다양한 거칠기와 클리어코트 강도를 테스트합니다.`, 
                                    en: `Tests various roughness and clearcoat strengths.`
                                },
                            },
                            {
                                name: 'ClearcoatWicker',
                                path: 'gltf/gltfExtensions/clearcoat/clearcoatWicker',
                                extensionList: ['KHR_materials_clearcoat'],
                                description: {
                                    ko: `직물 표면 위에 코팅된 클리어코트 효과를 보여주는 위커 모델입니다.`, 
                                    en: `Wicker model showing clearcoat effect coated over a woven surface.`
                                },
                            },
                            {
                                name: 'ClearCoatCarPaint',
                                path: 'gltf/gltfExtensions/clearcoat/clearCoatCarPaint',
                                extensionList: ['KHR_materials_clearcoat'],
                                description: {
                                    ko: `자동차 페인트와 같은 다중 레이어 재질 표현을 테스트합니다.`, 
                                    en: `Tests multi-layer material representation like car paint.`
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
                                extensionList: ['KHR_materials_dispersion', 'KHR_materials_transmission'],
                                description: {
                                    ko: `빛의 분산(Dispersion) 효과를 비교합니다.`, 
                                    en: `Compares light dispersion effects.`
                                },
                            },
                            {
                                name: 'DispersionTest',
                                path: 'gltf/gltfExtensions/dispersion/dispersionTest',
                                extensionList: ['KHR_materials_dispersion', 'KHR_materials_transmission'],
                                description: {
                                    ko: `프리즘과 같은 빛의 분산 현상을 테스트합니다.`, 
                                    en: `Tests light dispersion phenomena like a prism.`
                                },
                            },
                            {
                                name: 'DragonDispersion',
                                path: 'gltf/gltfExtensions/dispersion/dragonDispersion',
                                extensionList: ['KHR_materials_dispersion', 'KHR_materials_transmission', 'KHR_materials_volume'],
                                description: {
                                    ko: `용 모델에 적용된 보석 같은 분산 효과를 보여줍니다.`, 
                                    en: `Shows gem-like dispersion effects applied to a Dragon model.`
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
                                extensionList: ['KHR_materials_emissive_strength'],
                                description: {
                                    ko: `발광(Emissive) 강도 증폭 효과를 비교합니다.`, 
                                    en: `Compares Emissive Strength amplification effects.`
                                },
                            },
                            {
                                name: 'EmissiveStrengthTest',
                                path: 'gltf/gltfExtensions/emissiveStrength/emissiveStrengthTest',
                                extensionList: ['KHR_materials_emissive_strength'],
                                description: {
                                    ko: `1.0을 초과하는 고강도 발광 표현을 테스트합니다.`, 
                                    en: `Tests high-intensity emissive representation exceeding 1.0.`
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
                                extensionList: ['KHR_materials_sheen'],
                                description: {
                                    ko: `직물 등의 미세한 반사광(Sheen) 효과를 비교합니다.`, 
                                    en: `Compares Sheen effects seen on fabrics etc.`
                                },
                            },
                            {
                                name: 'SheenTestGrid',
                                path: 'gltf/gltfExtensions/sheen/sheenTestGrid',
                                extensionList: ['KHR_materials_sheen'],
                                description: {
                                    ko: `Sheen 색상과 거칠기에 따른 변화를 그리드로 테스트합니다.`, 
                                    en: `Tests changes based on Sheen color and roughness in a grid.`
                                },
                            },
                            {
                                name: 'SheenCloth',
                                path: 'gltf/gltfExtensions/sheen/sheenCloth',
                                extensionList: ['KHR_materials_sheen'],
                                description: {
                                    ko: `Sheen 효과를 보여주는 직물 예제입니다.`, 
                                    en: `A fabric example showcasing sheen.`
                                },
                            },
                            {
                                name: 'SheenChair',
                                path: 'gltf/gltfExtensions/sheen/sheenChair',
                                extensionList: ['KHR_materials_sheen', 'KHR_materials_variants'],
                                description: {
                                    ko: `재질 변형(Variant)과 Sheen 효과를 보여주는 의자 모델입니다.`, 
                                    en: `A chair model demonstrating material variants and sheen.`
                                },
                            },
                            {
                                name: 'GlamVelvetSofa',
                                path: 'gltf/gltfExtensions/sheen/glamVelvetSofa',
                                extensionList: ['KHR_materials_sheen', 'KHR_materials_specular', 'KHR_materials_variants'],
                                description: {
                                    ko: `고급 벨벳 소파의 질감을 표현하는 Sheen 모델입니다.`, 
                                    en: `Sheen model expressing the texture of a luxury velvet sofa.`
                                },
                            },
                            {
                                name: 'ChairDamaskPurplegold',
                                path: 'gltf/gltfExtensions/sheen/chairDamaskPurplegold',
                                extensionList: ['KHR_materials_sheen'],
                                description: {
                                    ko: `다마스크 패턴 의자의 직물 느낌을 표현합니다.`, 
                                    en: `Expresses the fabric feel of a damask pattern chair.`
                                },
                            },
                            {
                                name: 'SheenWoodLeatherSofa',
                                path: 'gltf/gltfExtensions/sheen/sheenWoodLeatherSofa',
                                extensionList: ['KHR_materials_sheen'],
                                description: {
                                    ko: `가죽과 나무 재질이 혼합된 소파에서의 Sheen 효과입니다.`, 
                                    en: `Sheen effect on a sofa combining leather and wood materials.`
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
                                extensionList: ['KHR_materials_specular'],
                                description: {
                                    ko: `스펙큘러(Specular) 반사 강도 및 색상 제어를 비교합니다.`, 
                                    en: `Compares Specular reflection strength and color control.`
                                },
                            },
                            {
                                name: 'SpecularTest',
                                path: 'gltf/gltfExtensions/specular/specularTest',
                                extensionList: ['KHR_materials_specular'],
                                description: {
                                    ko: `유전체 재질의 스펙큘러 하이라이트 조절을 테스트합니다.`, 
                                    en: `Tests specular highlight adjustments on dielectric materials.`
                                },
                            },
                            {
                                name: 'SpecularSilkPouf',
                                path: 'gltf/gltfExtensions/specular/specularSilkPouf',
                                extensionList: ['KHR_materials_specular'],
                                description: {
                                    ko: `스펙큘러 속성을 보여주는 실크 푸프 모델입니다.`, 
                                    en: `A silk pouf model demonstrating specular properties.`
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
                                extensionList: ['KHR_materials_unlit'],
                                description: {
                                    ko: `조명의 영향을 받지 않는 Unlit(무광) 재질을 테스트합니다.`, 
                                    en: `Tests Unlit materials not affected by lighting.`
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
                                extensionList: ['KHR_texture_transform'],
                                description: {
                                    ko: `KHR_texture_transform 확장의 사용법(스케일, 회전, 이동)을 시연합니다.`, 
                                    en: `Demonstrates the usage of the KHR_texture_transform extension (scaling, rotation, translation).`
                                },
                            },
                            {
                                name: 'TextureTransformMultiTest',
                                path: 'gltf/gltfExtensions/textureTransform/textureTransformMultiTest',
                                extensionList: ['KHR_texture_transform'],
                                description: {
                                    ko: `여러 텍스처에 서로 다른 변환을 적용하는 테스트입니다.`, 
                                    en: `Tests applying different transforms to multiple textures.`
                                },
                            },
                        ]
                    },
                    {
                        name: 'KHR_materials_diffuseTransmission',
                        list: [
                            {
                                name: 'DiffuseTransmissionTest',
                                path: 'gltf/gltfExtensions/diffuseTransmission/diffuseTransmissionTest',
                                extensionList: ['KHR_materials_diffuseTransmission'],
                                description: {
                                    ko: `반투명한 물체의 확산 투과(Diffuse Transmission) 효과를 테스트합니다.`, 
                                    en: `Tests Diffuse Transmission effects on translucent objects.`
                                },
                            },
                            {
                                name: 'DiffuseTransmissionTeacup',
                                path: 'gltf/gltfExtensions/diffuseTransmission/diffuseTransmissionTeacup',
                                extensionList: ['KHR_materials_diffuseTransmission'],
                                description: {
                                    ko: `얇은 찻잔을 통과하는 빛의 확산을 보여줍니다.`, 
                                    en: `Shows light diffusion passing through a thin teacup.`
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
                                extensionList: ['KHR_materials_transmission'],
                                description: {
                                    ko: `투명한 물체의 투과(Transmission) 렌더링을 비교합니다.`, 
                                    en: `Compares Transmission rendering of transparent objects.`
                                },
                            },
                            {
                                name: 'TransmissionTest',
                                path: 'gltf/gltfExtensions/transmission/transmissionTest',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_ior'],
                                description: {
                                    ko: `다양한 투과율과 거칠기에 따른 굴절 효과를 테스트합니다.`, 
                                    en: `Tests refraction effects based on various transmission rates and roughness.`
                                },
                            },
                            {
                                name: 'TransmissionRoughnessTest',
                                path: 'gltf/gltfExtensions/transmission/transmissionRoughnessTest',
                                extensionList: ['KHR_materials_transmission'],
                                description: {
                                    ko: `거친 표면을 가진 투명 재질의 흐림 효과를 테스트합니다.`, 
                                    en: `Tests blurring effects on transparent materials with rough surfaces.`
                                },
                            },
                            {
                                name: 'StainedGlassLamp',
                                path: 'gltf/gltfExtensions/transmission/stainedGlassLamp',
                                extensionList: ['KHR_materials_transmission'],
                                description: {
                                    ko: `스테인드글라스 램프를 통해 색상이 있는 투과광을 보여줍니다.`, 
                                    en: `Shows colored transmitted light through a stained glass lamp.`
                                },
                            },
                            {
                                name: 'ChronographWatch',
                                path: 'gltf/gltfExtensions/transmission/chronographWatch',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_variants'],
                                description: {
                                    ko: `시계 유리의 투명도와 내부 디테일을 보여주는 고품질 모델입니다.`, 
                                    en: `High-quality model showing watch glass transparency and internal details.`
                                },
                            },
                            {
                                name: 'MosquitoInAmber',
                                path: 'gltf/gltfExtensions/transmission/mosquitoInAmber',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume', 'KHR_materials_ior'],
                                description: {
                                    ko: `호박(Amber) 속에 갇힌 모기를 통해 투과, 굴절률(IOR), 볼륨 속성을 시연합니다.`, 
                                    en: `A mosquito encased in amber, demonstrating the use of transmission, IOR, and volume properties.`
                                },
                            },
                            {
                                name: 'CommercialRefrigerator',
                                path: 'gltf/gltfExtensions/transmission/commercialRefrigerator',
                                extensionList: ['KHR_materials_transmission'],
                                description: {
                                    ko: `유리 문을 가진 상업용 냉장고 모델입니다.`, 
                                    en: `Commercial refrigerator model with glass doors.`
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
                                extensionList: ['KHR_materials_ior'],
                                description: {
                                    ko: `굴절률(IOR)에 따른 빛의 굴절 차이를 비교합니다.`, 
                                    en: `Compares light refraction differences based on Index of Refraction (IOR).`
                                },
                            },
                            {
                                name: 'IORTestGrid',
                                path: 'gltf/gltfExtensions/volume/IORTestGrid',
                                extensionList: ['KHR_materials_ior'],
                                description: {
                                    ko: `다양한 IOR 값에 따른 굴절 변화를 그리드로 테스트합니다.`, 
                                    en: `Tests refraction changes based on various IOR values in a grid.`
                                },
                            },
                            {
                                name: 'CompareVolume',
                                path: 'gltf/gltfExtensions/volume/compareVolume',
                                extensionList: ['KHR_materials_volume'],
                                description: {
                                    ko: `볼륨(Volume) 흡수 및 산란 효과를 비교합니다.`, 
                                    en: `Compares Volume absorption and scattering effects.`
                                },
                            },
                            {
                                name: 'TransmissionThinwallTestGrid',
                                path: 'gltf/gltfExtensions/volume/transmissionThinwallTestGrid',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume'],
                                description: {
                                    ko: `얇은 벽(Thin-walled) 옵션 활성화 여부에 따른 투과 차이를 테스트합니다.`, 
                                    en: `Tests transmission differences based on Thin-walled option activation.`
                                },
                            },
                            {
                                name: 'AttenuationTest',
                                path: 'gltf/gltfExtensions/volume/attenuationTest',
                                extensionList: ['KHR_materials_volume'],
                                description: {
                                    ko: `빛이 매질을 통과할 때의 감쇠(Attenuation) 거리와 색상을 테스트합니다.`, 
                                    en: `Tests attenuation distance and color as light passes through a medium.`
                                },
                            },
                            {
                                name: 'GlassVaseFlowers',
                                path: 'gltf/gltfExtensions/volume/glassVaseFlowers',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume', 'KHR_materials_ior'],
                                description: {
                                    ko: `유리 꽃병과 물의 볼륨 효과를 보여주는 모델입니다.`, 
                                    en: `Model showing volume effects of a glass vase and water.`
                                },
                            },
                            {
                                name: 'GlassBrokenWindow',
                                path: 'gltf/gltfExtensions/volume/glassBrokenWindow',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume', 'KHR_materials_ior'],
                                description: {
                                    ko: `깨진 유리창의 두께감과 굴절을 표현합니다.`, 
                                    en: `Expresses the thickness and refraction of a broken window.`
                                },
                            },
                            {
                                name: 'GlassHurricaneCandleHolder',
                                path: 'gltf/gltfExtensions/volume/glassHurricaneCandleHolder',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume', 'KHR_materials_ior'],
                                description: {
                                    ko: `복잡한 유리 형태의 굴절과 반사를 보여주는 캔들 홀더입니다.`, 
                                    en: `Candle holder showing refraction and reflection of complex glass shapes.`
                                },
                            },
                            {
                                name: 'DragonAttenuation',
                                path: 'gltf/gltfExtensions/volume/dragonAttenuation',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume'],
                                description: {
                                    ko: `KHR_materials_transmission과 KHR_materials_volume을 사용하여 색유리와 같은 객체를 표현합니다.`, 
                                    en: `Showcases KHR_materials_transmission and KHR_materials_volume, creating an object that resembles colored glass.`
                                },
                            },
                        ]
                    },
                ]
            }
        ]
    },
    {
        name: 'PostEffect',
        list: [
            {
                name: 'Convolution',
                path: 'postEffect/convolution',
                description: {
                    ko: `컨볼루션 필터 효과를 시연하는 예제입니다.`, 
                    en: `An example demonstrating convolution filter effects.`
                },
            },
            {
                name: 'FilmGrain',
                path: 'postEffect/filmGrain',
                description: {
                    ko: `필름 그레인 효과를 시연하는 예제입니다.`, 
                    en: `An example demonstrating film grain effects.`
                },
            },
            {
                name: 'OldBloom',
                path: 'postEffect/oldBloom',
                description: {
                    ko: `고전적인 블룸 효과를 시연하는 예제입니다.`, 
                    en: `An example demonstrating classic bloom effects.`
                },
            },
            {
                name: 'Sharpen',
                path: 'postEffect/sharpen',
                description: {
                    ko: `선명도(Sharpen) 효과를 시연하는 예제입니다.`, 
                    en: `An example demonstrating sharpen effects.`
                },
            },
            {
                name: 'Adjustments',
                list: [
                    {
                        name: 'Grayscale',
                        path: 'postEffect/adjustments/grayscale',
                        description: {
                            ko: `그레이스케일 색상 보정 효과 예제입니다.`, 
                            en: `Example of Grayscale color adjustment effect.`
                        },
                    },
                    {
                        name: 'Invert',
                        path: 'postEffect/adjustments/invert',
                        description: {
                            ko: `색상 반전 효과 예제입니다.`, 
                            en: `Example of Invert color adjustment effect.`
                        },
                    },
                    {
                        name: 'ColorBalance',
                        path: 'postEffect/adjustments/colorBalance',
                        description: {
                            ko: `컬러 밸런스 색상 보정 효과 예제입니다.`, 
                            en: `Example of Color Balance color adjustment effect.`
                        },
                    },
                    {
                        name: 'ColorTemperatureTint',
                        path: 'postEffect/adjustments/colorTemperatureTint',
                        description: {
                            ko: `색온도 및 틴트 색상 보정 효과 예제입니다.`, 
                            en: `Example of Color Temperature & Tint color adjustment effect.`
                        },
                    },

                    {
                        name: 'BrightnessContrast',
                        path: 'postEffect/adjustments/brightnessContrast',
                        description: {
                            ko: `밝기 및 대비 색상 보정 효과 예제입니다.`, 
                            en: `Example of Brightness & Contrast color adjustment effect.`
                        },
                    },
                    {
                        name: 'HueSaturation',
                        path: 'postEffect/adjustments/hueSaturation',
                        description: {
                            ko: `색조 및 채도 색상 보정 효과 예제입니다.`, 
                            en: `Example of Hue & Saturation color adjustment effect.`
                        },
                    },
                    {
                        name: 'Threshold',
                        path: 'postEffect/adjustments/threshold',
                        description: {
                            ko: `임계값(Threshold) 색상 보정 효과 예제입니다.`, 
                            en: `Example of Threshold color adjustment effect.`
                        },
                    },
                    {
                        name: 'Vibrance',
                        path: 'postEffect/adjustments/vibrance',
                        description: {
                            ko: `활기(Vibrance) 색상 보정 효과 예제입니다.`, 
                            en: `Example of Vibrance color adjustment effect.`
                        },
                    },

                ]
            },
            {
                name: 'Blur',
                list: [
                    {
                        name: 'Blur',
                        path: 'postEffect/blur/blur',
                        description: {
                            ko: `기본 블러 효과 예제입니다.`, 
                            en: `Example of Basic Blur effect.`
                        },
                    },
                    {
                        name: 'BlurX',
                        path: 'postEffect/blur/blurX',
                        description: {
                            ko: `가로 방향 블러 효과 예제입니다.`, 
                            en: `Example of Horizontal Blur effect.`
                        },
                    },
                    {
                        name: 'BlurY',
                        path: 'postEffect/blur/blurY',
                        description: {
                            ko: `세로 방향 블러 효과 예제입니다.`, 
                            en: `Example of Vertical Blur effect.`
                        },
                    },
                    {
                        name: 'DirectionalBlur',
                        path: 'postEffect/blur/directionalBlur',
                        description: {
                            ko: `방향성 블러 효과 예제입니다.`, 
                            en: `Example of Directional Blur effect.`
                        },
                    },
                    {
                        name: 'GaussianBlur',
                        path: 'postEffect/blur/gaussianBlur',
                        description: {
                            ko: `가우시안 블러 효과 예제입니다.`, 
                            en: `Example of Gaussian Blur effect.`
                        },
                    },
                    {
                        name: 'RadialBlur',
                        path: 'postEffect/blur/radialBlur',
                        description: {
                            ko: `방사형 블러 효과 예제입니다.`, 
                            en: `Example of Radial Blur effect.`
                        },
                    },
                    {
                        name: 'ZoomBlur',
                        path: 'postEffect/blur/zoomBlur',
                        description: {
                            ko: `줌 블러 효과 예제입니다.`, 
                            en: `Example of Zoom Blur effect.`
                        },
                    },
                ]
            },
            {
                name: 'Lens',
                list: [
                    {
                        name: 'LensDistortion',
                        path: 'postEffect/lens/lensDistortion',
                        description: {
                            ko: `렌즈 왜곡 효과 예제입니다.`, 
                            en: `Example of Lens Distortion effect.`
                        }
                    },
                    {
                        name: 'ChromaticAberration',
                        path: 'postEffect/lens/chromaticAberration',
                        description: {
                            ko: `색수차 효과 예제입니다.`, 
                            en: `Example of Chromatic Aberration effect.`
                        }
                    },
                    {
                        name: 'DepthOfField',
                        path: 'postEffect/lens/dof',
                        description: {
                            ko: `피사계 심도(DoF) 효과 예제입니다.`, 
                            en: `Example of Depth of Field effect.`
                        }
                    },
                    {
                        name: 'Vignetting',
                        path: 'postEffect/lens/vignetting',
                        description: {
                            ko: `비네팅 효과 예제입니다.`, 
                            en: `Example of Vignetting effect.`
                        },
                    },
                ]
            },
            {
                name: 'Fog',
                list: [
                    {
                        name: 'Fog',
                        path: 'postEffect/fog/fog',
                        description: {
                            ko: `안개 효과를 시연하는 예제입니다.`, 
                            en: `An example demonstrating fog effects.`
                        }
                    },
                    {
                        name: 'HeightFog',

                        path: 'postEffect/fog/heightFog',
                        description: {
                            ko: `높이 기반 안개 효과를 시연하는 예제입니다.`, 
                            en: `An example demonstrating height-based fog effects.`
                        }
                    }
                ]
            },
            {
                name: 'Screen Space Reflection',
                experimental: true,
                list: [{
                    experimental: true,
                    name: 'SSR',
                    path: 'postEffect/ssr',
                    description: {
                        ko: `화면 공간 반사(SSR) 효과를 시연하는 예제입니다.`, 
                        en: `An example demonstrating Screen Space Reflection (SSR) effects.`
                    }
                },
                ]
            },
            {
                name: 'Screen Space Ambient Occlusion',
                list: [{
                    name: 'SSAO',
                    path: 'postEffect/ssao',
                    description: {
                        ko: `화면 공간 앰비언트 오클루전(SSAO) 효과를 시연하는 예제입니다.`, 
                        en: `An example demonstrating Screen Space Ambient Occlusion (SSAO) effects.`
                    }
                },
                ]
            },
        ],
    },

    {
        name: '2D',
        list: [
            {
                name: 'Hello RedGPU - 2D Mode',
                path: '2d/helloWorld2D',
                description: {
                    ko: `RedGPU의 2D 모드 초기화 샘플입니다.`, 
                    en: `Sample of RedGPU's 2D mode initialization.`

                },
            },
            {
                name: 'View2D',
                list: [
                    {
                        name: 'Multi View (2D + 2D)',
                        path: '2d/view/multiView',
                        description: {
                            ko: `여러 개의 2D View를 사용하는 멀티 뷰 예제입니다.`, 
                            en: `Multi-view example using multiple 2D Views.`

                        },
                    },
                    {
                        name: 'Multi View (3D + 2D)',
                        path: '2d/view/multiViewWith3D',
                        description: {
                            ko: `3D View와 2D View를 함께 사용하는 복합 멀티 뷰 예제입니다.`, 
                            en: `Complex multi-view example using both 3D View and 2D View.`

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
                        description: {
                            ko: `기본적인 Sprite2D 객체 사용법을 보여주는 예제입니다.`, 
                            en: `An example showing basic usage of Sprite2D object.`
                        },
                    },
                    {
                        name: 'Hierarchy Sprite2D',
                        path: '2d/sprite2D/hierarchy',
                        description: {
                            ko: `2D 공간에서 Sprite2D의 계층 구조를 구성하는 예제입니다.`, 
                            en: `An example constructing a hierarchy of Sprite2D in 2D space.`
                        },
                    },
                    {
                        name: 'Pivot Sprite2D',
                        path: '2d/sprite2D/pivot',
                        description: {
                            ko: `Sprite2D의 피벗(중심점)을 변경하여 회전 및 위치를 제어하는 예제입니다.`, 
                            en: `An example controlling rotation and position by changing the pivot of Sprite2D.`
                        },
                    },
                    {
                        name: 'Child Methods',
                        path: '2d/sprite2D/childMethod',
                        description: {
                            ko: `2D 객체의 자식 노드를 관리하는 다양한 메서드를 시연하는 예제입니다.`, 
                            en: `An example demonstrating various methods for managing child nodes of 2D objects.`
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
                        description: {
                            ko: `스프라이트 시트 애니메이션을 재생하는 기본적인 SpriteSheet2D 예제입니다.`, 
                            en: `Basic SpriteSheet2D example playing sprite sheet animation.`
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
                        description: {
                            ko: `2D 텍스트를 렌더링하는 TextField2D 객체의 기본 사용법 예제입니다.`, 
                            en: `Basic usage example of TextField2D object for rendering 2D text.`
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
                            ko: `2D 객체들을 그룹화하여 관리하는 Group2D 예제입니다.`, 
                            en: `Group2D example managing 2D objects by grouping them.`
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
                        description: {
                            ko: `2D 객체의 투명도(Opacity)를 조절하는 예제입니다.`, 
                            en: `An example adjusting the opacity of 2D objects.`
                        },
                    },
                ]
            },
            {
                name: '2D Object BlendMode',
                list: [
                    {
                        name: 'BlendMode',
                        path: '2d/blendMode/basic',
                        description: {
                            ko: `2D 객체의 다양한 블렌딩 모드를 테스트하는 예제입니다.`, 
                            en: `An example testing various blending modes of 2D objects.`
                        },
                    },
                ]
            },
            {
                name: '2D Tint',
                experimental: true,
                list: [
                    {
                        experimental: true,
                        name: 'Tint Basic',
                        path: '2d/tint/basic',
                        description: {
                            ko: `2D 객체에 색상을 입히는 기본 틴트 예제입니다.`, 
                            en: `Basic tint example applying color to 2D objects.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Tint Objects',
                        path: '2d/tint/2dObjectTint',
                        description: {
                            ko: `다양한 2D 객체에 틴트를 적용하는 예제입니다.`, 
                            en: `An example applying tint to various 2D objects.`
                        },
                    },
                ]
            },
            {
                name: 'Interaction',
                list: [
                    {
                        name: 'MouseEvent',
                        list: [
                            {
                                name: 'Sprite2D',
                                path: '2d/interaction/mouseEvent/sprite2D',
                                description: {
                                    ko: `Sprite2D에 대한 마우스 이벤트를 처리하는 예제입니다.`, 
                                    en: `An example handling mouse events on Sprite2D.`
                                },
                            },
                            {
                                name: 'SpriteSheet2D',
                                path: '2d/interaction/mouseEvent/spriteSheet2D',
                                description: {
                                    ko: `SpriteSheet2D에 대한 마우스 이벤트를 처리하는 예제입니다.`, 
                                    en: `An example handling mouse events on SpriteSheet2D.`
                                },
                            },
                            {
                                name: 'TextField2D',
                                path: '2d/interaction/mouseEvent/textField2D',
                                description: {
                                    ko: `TextField2D에 대한 마우스 이벤트를 처리하는 예제입니다.`, 
                                    en: `An example handling mouse events on TextField2D.`
                                },
                            },
                        ]
                    },
                    {
                        name: 'KeyboardEvent',
                        list: [
                            {
                                name: 'Keyboard Interaction',
                                path: '2d/interaction/keyboardEvent',
                                description: {
                                    ko: `keyboardKeyBuffer를 사용하여 2D 환경에서 객체를 제어하는 방법을 보여줍니다.`, 
                                    en: `Demonstrates how to control an object in a 2D environment using keyboardKeyBuffer.`
                                },
                            }
                        ]
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
    {
        name: 'Physics',
        experimental: true,
        list: [
            {
                name: 'Fundamentals',
                experimental: true,
                list: [
                    {
                        experimental: true,
                        name: 'Basic Physics',
                        path: 'physics/basic',
                        description: {
                            ko: `Rapier 물리 엔진을 사용한 기본적인 물리 시뮬레이션 예제입니다.`, 
                            en: `Basic physics simulation example using the Rapier physics engine.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Shapes & Materials',
                        path: 'physics/shapes',
                        description: {
                            ko: `다양한 충돌체 형상(Box, Sphere, Cylinder, Capsule)과 탄성/마찰 설정을 테스트합니다.`, 
                            en: `Tests various collider shapes (Box, Sphere, Cylinder, Capsule) and restitution/friction settings.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Kinematic Interaction',
                        path: 'physics/kinematic',
                        description: {
                            ko: `코드에 의해 제어되는 키네마틱 객체가 동적 객체들과 상호작용하는 모습을 보여줍니다.`, 
                            en: `Demonstrates how kinematic objects controlled by code interact with dynamic objects.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Mesh Collider',
                        path: 'physics/meshCollider',
                        description: {
                            ko: `커스텀 기하구조를 물리 충돌체로 변환하는 방법을 테스트합니다.`, 
                            en: `Tests how to convert custom geometries into physics engine colliders.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'HeightField',
                        path: 'physics/heightField',
                        description: {
                            ko: `높이맵 데이터를 사용하여 지형과 같은 복잡한 표면의 물리 충돌을 구현하는 방법을 테스트합니다.`, 
                            en: `Tests how to implement physics collisions for complex surfaces like terrain using heightmap data.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'GLTF Physics',
                        path: 'physics/gltfPhysics',
                        description: {
                            ko: `로드된 GLTF 모델의 복잡한 계층 구조와 메쉬 데이터를 분석하여 자동으로 물리 충돌체를 생성하는 방법을 테스트합니다.`, 
                            en: `Tests how to automatically generate physics colliders by analyzing the complex hierarchy and mesh data of a loaded GLTF model.`
                        },
                    }
                ]
            },
            {
                name: 'Interaction & Events',
                experimental: true,
                list: [
                    {
                        experimental: true,
                        name: 'Raycasting Interaction',
                        path: 'physics/raycast',
                        description: {
                            ko: `마우스 클릭 지점에서 광선을 쏘아 물리 객체를 검출하고, 힘을 가해 밀어내는 등의 상호작용을 구현합니다.`, 
                            en: `Casts rays from mouse click positions to detect physics objects and implements interactions like pushing them with force.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Collision Events',
                        path: 'physics/collisionEvents',
                        description: {
                            ko: `물체 간의 충돌 이벤트를 감지하여 실시간으로 색상을 변경하는 등 물리 연동 로직을 테스트합니다.`, 
                            en: `Tests physics integration logic by detecting collision events between objects and changing colors in real-time.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Triggers & Sensors',
                        path: 'physics/triggers',
                        description: {
                            ko: `물체와 물리적인 충돌은 발생하지 않으나 영역 진입을 감지하는 센서(Trigger) 기능을 테스트합니다.`, 
                            en: `Tests the sensor (Trigger) function that detects area entry without physical collision.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Collision Filtering',
                        path: 'physics/collisionFiltering',
                        description: {
                            ko: `Bitmask 기반의 충돌 그룹 설정을 통해 특정 객체들끼리만 선택적으로 충돌하도록 제어하는 고급 물리 기술을 구현합니다.`, 
                            en: `Implements advanced physics techniques to selectively control collisions between specific objects through Bitmask-based collision group settings.`
                        },
                    }
                ]
            },
            {
                name: 'Joints & Constraints',
                experimental: true,
                list: [
                    {
                        experimental: true,
                        name: 'Basic Joints',
                        path: 'physics/joints',
                        description: {
                            ko: `물체들을 서로 연결하는 관절(Joint) 기능을 사용하여 체인이나 진자 운동과 같은 복잡한 물리 구조를 구현합니다.`, 
                            en: `Implements complex physical structures like chains or pendulums using joints to connect objects together.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Revolute Joints & Motors',
                        path: 'physics/revoluteJoint',
                        description: {
                            ko: `특정 축을 기준으로 회전하는 관절(Revolute Joint)과 모터 기능을 사용하여 풍차나 선풍기와 같은 회전 장치를 구현합니다.`, 
                            en: `Implements rotating devices like windmills or fans using revolute joints that rotate around a specific axis and motor functions.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Prismatic Joints & Sliders',
                        path: 'physics/prismaticJoint',
                        description: {
                            ko: `직선 방향으로만 왕복 이동이 가능한 프리즈매틱 관절(Prismatic Joint)을 사용하여 승강기나 슬라이더 장치를 구현합니다.`, 
                            en: `Implements elevators or slider devices using prismatic joints that allow reciprocal movement only in a straight line.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Spring Joint',
                        path: 'physics/springJoint',
                        description: {
                            ko: `스프링 조인트를 사용하여 탄성 있는 연결을 구현하는 방법을 테스트합니다.`, 
                            en: `Tests how to implement elastic connections using spring joints.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Soft Body',
                        path: 'physics/softBody',
                        description: {
                            ko: `다수의 노드를 스프링으로 연결하여 젤리와 같은 소프트 바디 효과를 구현합니다.`, 
                            en: `Implements a jelly-like soft body effect by connecting multiple nodes with springs.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Compound Shapes',
                        path: 'physics/compound',
                        description: {
                            ko: `여러 개의 지오메트리를 결합하여 하나의 복잡한 물리 객체를 만드는 복합 형상 기능을 테스트합니다.`, 
                            en: `Tests the compound shape function that combines multiple geometries to create a single complex physics object.`
                        },
                    }
                ]
            },
            {
                name: 'Simulation & Systems',
                experimental: true,
                list: [
                    {
                        experimental: true,
                        name: 'Surface Velocity (Conveyor)',
                        path: 'physics/surfaceVelocity',
                        description: {
                            ko: `컨베이어 벨트와 같이 표면이 움직이는 물체를 시뮬레이션합니다. 물체가 닿았을 때 특정 방향으로 힘을 가하여 이동시킵니다.`, 
                            en: `Simulates objects with moving surfaces like conveyor belts. Applies force to move objects in a specific direction when they make contact.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Buoyancy Basics',
                        path: 'physics/buoyancy',
                        description: {
                            ko: `물속에서 물체가 떠오르는 부력과 유체 저항을 시뮬레이션합니다. 잠긴 깊이에 따라 상향 힘을 조절합니다.`, 
                            en: `Simulates buoyancy and fluid resistance for objects in water. Adjusts upward force based on submerged depth.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Ragdoll System',
                        path: 'physics/ragdoll',
                        description: {
                            ko: `인간형 캐릭터의 뼈대를 관절(Joint)로 연결하여, 중력에 의해 자연스럽게 쓰러지는 래그돌 물리 효과를 시뮬레이션합니다.`, 
                            en: `Simulates ragdoll physics where a humanoid skeleton is connected with joints and falls naturally under gravity.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Character Controller',
                        path: 'physics/characterController',
                        description: {
                            ko: `지면을 걷고 계단을 오르는 1인칭/3인칭 캐릭터 이동의 기초를 구현합니다.`, 
                            en: `Implements the basics of 1st/3rd person character movement walking on the ground and climbing stairs.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Advanced Character Controller',
                        path: 'physics/advancedCharacterController',
                        description: {
                            ko: `관성 이동, 공중 제어, 이중 점프 등 게임적인 조작감이 가미된 고급 캐릭터 컨트롤러를 구현합니다.`, 
                            en: `Implements an advanced character controller with game-like controls such as inertial movement, air control, and double jumping.`
                        },
                    }
                ]
            },
            {
                name: 'Performance & Stress Test',
                experimental: true,
                list: [
                    {
                        experimental: true,
                        name: 'Galton Board',
                        path: 'physics/galton',
                        description: {
                            ko: `수많은 구슬이 핀 사이를 떨어지며 통계적 분포를 형성하는 과정을 시뮬레이션합니다.`, 
                            en: `Simulates the process where numerous balls fall between pins and form a statistical distribution.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Physics Bowling',
                        path: 'physics/bowling',
                        description: {
                            ko: `고속으로 이동하는 볼과 핀 사이의 충돌 및 연쇄 반응을 테스트합니다. CCD(Continuous Collision Detection) 기술이 적용되었습니다.`, 
                            en: `Tests collisions and chain reactions between a fast-moving ball and pins. CCD (Continuous Collision Detection) technology is applied.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Impulse Explosion',
                        path: 'physics/explosion',
                        description: {
                            ko: `폭발 지점으로부터 주변 객체들에 충격량을 가하여 날려버리는 물리 효과를 구현합니다.`, 
                            en: `Implements physics effects where impulse is applied from an explosion point to blow away surrounding objects.`
                        },
                    },
                    {
                        experimental: true,
                        name: 'Ultimate Stress Test',
                        path: 'physics/stressTest',
                        description: {
                            ko: `수천 개의 물리 객체를 동시에 시뮬레이션하여 엔진의 한계 성능을 테스트합니다. 휴면(Sleep) 모드 활성화를 통한 최적화 효과를 확인합니다.`, 
                            en: `Tests the engine's performance limits by simulating thousands of physics objects simultaneously. Demonstrates optimization through Sleep mode.`
                        },
                    },
                ]
            },
        ]
    }
]
Object.freeze(ExampleList);
export default ExampleList;