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
                                name: 'Skybox using HDRTexture',
                                path: '3d/skybox/skyboxWithHDRTexture',
                                description: {
                                    ko: `HDR 텍스처를 사용하여 스카이박스를 구성하는 예제입니다.`, 
                                    en: `An example of constructing a skybox using an HDR texture.`
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
                            // {
                            //     name: 'Skybox using IBL',
                            //     path: '3d/skybox/skyboxWithIbl',
                            //     description: {
                            //         ko: ``, 
                            //         en: ``
                            //     },
                            // },
                            {
                                name: 'IBL Test',
                                path: '3d/skybox/iblTest',
                                description: {
                                    ko: `이미지 기반 조명(IBL)을 테스트하는 예제입니다.`, 
                                    en: `An example testing Image-Based Lighting (IBL).`
                                },
                            },
                            {
                                name: 'Custom IBL Texture Size',
                                path: '3d/skybox/iblTextureSize',
                                description: {
                                    ko: `IBL 텍스처의 크기를 사용자 정의하는 예제입니다.`, 
                                    en: `An example of customizing the size of the IBL texture.`
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
                        name: 'SpriteSheet3D',
                        path: '3d/sprite/spriteSheet3D',
                        description: {
                            ko: `SpriteSheet3D 객체의 사용법을 보여주는 예제입니다.`, 
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
                        description: {
                            ko: `TextField3D 객체의 사용법을 보여주는 예제입니다.`, 
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
                name: 'MouseEvent',
                list: [
                    {
                        name: 'Mesh',
                        path: '3d/mouseEvent/mesh',
                        description: {
                            ko: `Mesh에 마우스 이벤트를 설정하는 예제입니다.`, 
                            en: `Here's an example of setting up mouse events on a Mesh.`
                        },
                    },
                    {
                        name: 'Sprite3D',
                        path: '3d/mouseEvent/sprite3D',
                        description: {
                            ko: `Sprite3D에 마우스 이벤트를 설정하는 예제입니다.`, 
                            en: `Here's an example of setting up mouse events on a Sprite3D.`
                        },
                    },
                    {
                        name: 'SpriteSheet3D',
                        path: '3d/mouseEvent/spriteSheet3D',
                        description: {
                            ko: `SpriteSheet3D에 마우스 이벤트를 설정하는 예제입니다.`, 
                            en: `Here's an example of setting up mouse events on a SpriteSheet3D.`
                        },
                    },
                    {
                        name: 'TextField3D',
                        path: '3d/mouseEvent/textField3D',
                        description: {
                            ko: `TextField3D에 마우스 이벤트를 설정하는 예제입니다.`, 
                            en: `Here's an example of setting up mouse events on a TextField3D.`
                        },
                    },
                    {
                        name: 'Raycasting (Precision Picking)',
                        path: '3d/mouseEvent/raycasting',
                        description: {
                            ko: `이 예제는 복잡한 지오메트리(TorusKnot)에 대한 고정밀 레이캐스팅을 보여줍니다.<br/>버텍스 버퍼를 분석하여 정확한 교차 지점, 면 인덱스 및 로컬 좌표를 CPU에서 계산합니다.`, 
                            en: `This example demonstrates high-precision raycasting on complex geometry (TorusKnot).<br/>It calculates the exact intersection point, face index, and local coordinates on the CPU by analyzing vertex buffers.`
                        },
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
            {
                name: 'IBL Upgrade (Foundation)',
                list: [
                    {
                        name: 'BRDF LUT Test',
                        path: '3d/ibl/brdfLutTest',
                        description: {
                            ko: `새로운 IBL 시스템의 기초인 BRDF LUT 생성을 테스트합니다.`,
                            en: `Tests BRDF LUT generation, the foundation of the new IBL system.`
                        },
                    },
                    {
                        name: 'Irradiance Test',
                        path: '3d/ibl/irradianceTest',
                        description: {
                            ko: `분리된 IrradianceGenerator를 사용하여 환경맵으로부터 Irradiance 맵을 생성하고 테스트합니다. 배경 스카이박스에는 생성된 Irradiance 맵이 적용되어 있으며, 중앙의 Sprite3D에는 원본 HDRTexture가 2D 텍스처로 적용되어 있습니다.`,
                            en: `Generates and tests an Irradiance map from an environment map using the separated IrradianceGenerator. The background skybox uses the generated Irradiance map, while the central Sprite3D uses the original HDRTexture as a 2D texture.`
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
                            ko: `텍스처 인코딩 테스트`, 
                            en: `Texture Encoding Test`
                        },
                    },
                    {
                        name: 'TextureLinear InterpolationTest',
                        path: 'gltf/basic/textureLinearInterpolationTest',
                        description: {
                            ko: `텍스처 선형 보간 테스트`, 
                            en: `Texture Linear Interpolation Test`
                        },
                    },
                    {
                        name: 'VertexColorTest',
                        path: 'gltf/basic/vertexColorTest',
                        description: {
                            ko: `정점 색상 테스트`, 
                            en: `Vertex Color Test`
                        },
                    },
                    {
                        name: 'BoxVertexColors',
                        path: 'gltf/basic/boxVertexColors',
                        description: {
                            ko: `박스 정점 색상 테스트`, 
                            en: `Box Vertex Colors Test`
                        },
                    },
                    {
                        name: 'OrientationTest',
                        path: 'gltf/basic/orientationTest',
                        description: {
                            ko: `오리엔테이션(회전) 테스트`, 
                            en: `Orientation Test`
                        },
                    },
                    {
                        name: 'TextureCoordinateTest',
                        path: 'gltf/basic/textureCoordinateTest',
                        description: {
                            ko: `텍스처 좌표(UV) 테스트`, 
                            en: `Texture Coordinate Test`
                        },
                    },
                    {
                        name: 'AlphaBlendModeTest',
                        path: 'gltf/basic/alphaBlendModeTest',
                        description: {
                            ko: `알파 블렌드 모드 테스트`, 
                            en: `Alpha Blend Mode Test`
                        },
                    },
                    {
                        name: 'TextureSettingsTest',
                        path: 'gltf/basic/textureSettingsTest',
                        description: {
                            ko: `텍스처 설정 테스트`, 
                            en: `Texture Settings Test`
                        },
                    },
                    {
                        name: 'MultiUVTest',
                        path: 'gltf/basic/multiUVTest',
                        description: {
                            ko: `멀티 UV 테스트`, 
                            en: `Multi-UV Test`
                        },
                    },

                    {
                        name: 'MetalRoughSpheres',
                        path: 'gltf/basic/metalRoughSpheres',
                        description: {
                            ko: `금속/거칠기 구체 테스트`, 
                            en: `Metal/Roughness Spheres Test`
                        },
                    },
                    {
                        name: 'MetalRoughSpheresNoTextures',
                        path: 'gltf/basic/metalRoughSpheresNoTextures',
                        description: {
                            ko: `텍스처 없는 금속/거칠기 구체 테스트`, 
                            en: `Metal/Roughness Spheres (No Textures) Test`
                        },
                    },
                    {
                        name: 'WaterBottle',
                        path: 'gltf/basic/waterBottle',
                        description: {
                            ko: `물병 모델 렌더링`, 
                            en: `Water Bottle Model Rendering`
                        },
                    },
                    {
                        name: 'NormalTangentTest',
                        path: 'gltf/basic/normalTangentTest',
                        description: {
                            ko: `노멀/탄젠트 테스트`, 
                            en: `Normal/Tangent Test`
                        },
                    },
                    {
                        name: 'NormalTangentMirrorTest',
                        path: 'gltf/basic/normalTangentMirrorTest',
                        description: {
                            ko: `노멀/탄젠트 미러링 테스트`, 
                            en: `Normal/Tangent Mirror Test`
                        },
                    },
                    {
                        name: 'NegativeScaleTest',
                        path: 'gltf/basic/negativeScaleTest',
                        description: {
                            ko: `음수 스케일 테스트`, 
                            en: `Negative Scale Test`
                        },
                    },

                    {
                        name: 'EnvironmentTest',
                        path: 'gltf/basic/environmentTest',
                        description: {
                            ko: `환경 맵 테스트`, 
                            en: `Environment Map Test`
                        },
                    },
                    {
                        name: 'Generate normal vector test',
                        path: 'gltf/basic/generateNormalTest',
                        description: {
                            ko: `노멀 벡터 생성 테스트`, 
                            en: `Generate Normal Vector Test`
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
                            ko: `기본 색상 비교`, 
                            en: `Compare Base Color`
                        },
                    }, {
                        name: 'CompareAlphaCoverage',
                        path: 'gltf/basic/compareAlphaCoverage',
                        description: {
                            ko: `알파 커버리지 비교`, 
                            en: `Compare Alpha Coverage`
                        },
                    },
                    {
                        name: 'CompareMetallic',
                        path: 'gltf/basic/compareMetallic',
                        description: {
                            ko: `금속성 비교`, 
                            en: `Compare Metallic`
                        },
                    },
                    {
                        name: 'CompareNormal',
                        path: 'gltf/basic/compareNormal',
                        description: {
                            ko: `노멀 맵 비교`, 
                            en: `Compare Normal`
                        },
                    },
                    {
                        name: 'CompareRoughness',
                        path: 'gltf/basic/compareRoughness',
                        description: {
                            ko: `거칠기 비교`, 
                            en: `Compare Roughness`
                        },
                    },
                    {
                        name: 'CompareAmbientOcclusion',
                        path: 'gltf/basic/compareAmbientOcclusion',
                        description: {
                            ko: `앰비언트 오클루전 비교`, 
                            en: `Compare Ambient Occlusion`
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
                            ko: `기본 애니메이션`, 
                            en: `Basic Animations`
                        },
                    },
                    {
                        name: 'SimpleSkin',
                        path: 'gltf/animation/simpleSkin',
                        description: {
                            ko: `간단한 스키닝 애니메이션`, 
                            en: `Simple Skinning Animation`
                        },
                    },
                    {
                        name: 'SimpleMorph',
                        path: 'gltf/animation/simpleMorph',
                        description: {
                            ko: `간단한 모프 타겟 애니메이션`, 
                            en: `Simple Morph Target Animation`
                        },
                    },
                    {
                        name: 'RiggedSimple',
                        path: 'gltf/animation/riggedSimple',
                        description: {
                            ko: `간단한 리깅 애니메이션`, 
                            en: `Simple Rigged Animation`
                        },
                    },
                    {
                        name: 'RiggedFigure',
                        path: 'gltf/animation/riggedFigure',
                        description: {
                            ko: `리깅된 캐릭터 애니메이션`, 
                            en: `Rigged Figure Animation`
                        },
                    },
                    {
                        name: 'InterpolationTest',
                        path: 'gltf/animation/interpolationTest',
                        description: {
                            ko: `애니메이션 보간 테스트`, 
                            en: `Animation Interpolation Test`
                        },
                    },
                    {
                        name: 'CesiumMan & MilkTruck',
                        path: 'gltf/animation/cesiumMan',
                        description: {
                            ko: `CesiumMan 및 MilkTruck 애니메이션`, 
                            en: `CesiumMan & MilkTruck Animation`
                        },
                    },

                    {
                        name: 'BrainStem',
                        path: 'gltf/animation/brainStem',
                        description: {
                            ko: `BrainStem 복합 애니메이션`, 
                            en: `BrainStem Complex Animation`
                        },
                    },
                    {
                        name: 'MorphStressTest',
                        path: 'gltf/animation/morphStressTest',
                        description: {
                            ko: `모프 타겟 스트레스 테스트`, 
                            en: `Morph Target Stress Test`
                        },
                    },
                    {
                        name: 'RecursiveSkeletons',
                        path: 'gltf/animation/recursiveSkeletons',
                        description: {
                            ko: `재귀적 스켈레톤 애니메이션`, 
                            en: `Recursive Skeletons Animation`
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
                            ko: `코르셋 모델`, 
                            en: `Corset Model`
                        },
                    },
                    {
                        name: 'Helmets',
                        path: 'gltf/models/helmets',
                        description: {
                            ko: `헬멧 모델`, 
                            en: `Helmets Model`
                        },
                    },
                    {
                        name: 'Sponza',
                        path: 'gltf/models/sponza',
                        description: {
                            ko: `스폰자(Sponza) 씬`, 
                            en: `Sponza Scene`
                        },
                    },
                    {
                        name: 'Tokyo',
                        path: 'gltf/models/tokyo',
                        description: {
                            ko: `도쿄(Tokyo) 씬`, 
                            en: `Tokyo Scene`
                        },
                    },
                    {
                        name: 'texcooredNTest',
                        path: 'gltf/models/texcooredNTest',
                        description: {
                            ko: `텍스처 좌표 N 테스트`, 
                            en: `Texture Coordinate N Test`
                        },
                    },
                    {
                        name: 'ABeautifulGame',
                        path: 'gltf/models/aBeautifulGame',
                        description: {
                            ko: `체스 게임 모델`, 
                            en: `A Beautiful Game Model`
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
                                description: {
                                    ko: `비등방성 비교`, 
                                    en: `Compare Anisotropy`
                                },
                            },
                            {
                                name: 'AnisotropyDiscTest',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyDiscTest',
                                description: {
                                    ko: `비등방성 디스크 테스트`, 
                                    en: `Anisotropy Disc Test`
                                },
                            },
                            {
                                name: 'AnisotropyRotationTest',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyRotationTest',
                                description: {
                                    ko: `비등방성 회전 테스트`, 
                                    en: `Anisotropy Rotation Test`
                                },
                            },
                            {
                                name: 'AnisotropyStrengthTest',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyStrengthTest',
                                description: {
                                    ko: `비등방성 강도 테스트`, 
                                    en: `Anisotropy Strength Test`
                                },
                            },
                            {
                                name: 'AnisotropyBarnLamp',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyBarnLamp',
                                description: {
                                    ko: `비등방성 램프 모델`, 
                                    en: `Anisotropy Barn Lamp Model`
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
                                description: {
                                    ko: `무지개빛(Iridescence) 비교`, 
                                    en: `Compare Iridescence`
                                },
                            },
                            {
                                name: 'IridescenceDielectricSpheres',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceDielectricSpheres',
                                description: {
                                    ko: `유전체 구체 무지개빛 테스트`, 
                                    en: `Iridescence Dielectric Spheres Test`
                                },
                            },
                            {
                                name: 'IridescenceMetallicSpheres',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceMetallicSpheres',
                                description: {
                                    ko: `금속 구체 무지개빛 테스트`, 
                                    en: `Iridescence Metallic Spheres Test`
                                },
                            },
                            {
                                name: 'IridescenceSuzanne',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceSuzanne',
                                description: {
                                    ko: `수잔(Suzanne) 모델 무지개빛 테스트`, 
                                    en: `Iridescence Suzanne Model Test`
                                },
                            },
                            {
                                name: 'IridescenceLamp',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceLamp',
                                description: {
                                    ko: `램프 모델 무지개빛 테스트`, 
                                    en: `Iridescence Lamp Model Test`
                                },
                            },
                            {
                                name: 'SunglassesKhronos',
                                path: 'gltf/gltfExtensions/iridescence/sunglassesKhronos',
                                description: {
                                    ko: `선글라스 모델 무지개빛 테스트`, 
                                    en: `Sunglasses Khronos Model Test`
                                },
                            },
                            {
                                name: 'IridescentDishWithOlives',
                                path: 'gltf/gltfExtensions/iridescence/iridescentDishWithOlives',
                                description: {
                                    ko: `접시와 올리브 모델 무지개빛 테스트`, 
                                    en: `Iridescent Dish With Olives Model Test`
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
                                description: {
                                    ko: `클리어코트 비교`, 
                                    en: `Compare Clearcoat`
                                },
                            },
                            {
                                name: 'ClearCoatTest',
                                path: 'gltf/gltfExtensions/clearcoat/clearCoatTest',
                                description: {
                                    ko: `클리어코트 테스트`, 
                                    en: `Clearcoat Test`
                                },
                            },
                            {
                                name: 'ClearcoatWicker',
                                path: 'gltf/gltfExtensions/clearcoat/clearcoatWicker',
                                description: {
                                    ko: `위커(Wicker) 재질 클리어코트`, 
                                    en: `Clearcoat Wicker Material`
                                },
                            },
                            {
                                name: 'ClearCoatCarPaint',
                                path: 'gltf/gltfExtensions/clearcoat/clearCoatCarPaint',
                                description: {
                                    ko: `자동차 페인트 클리어코트`, 
                                    en: `Clearcoat Car Paint`
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
                                description: {
                                    ko: `분산(Dispersion) 비교`, 
                                    en: `Compare Dispersion`
                                },
                            },
                            {
                                name: 'DispersionTest',
                                path: 'gltf/gltfExtensions/dispersion/dispersionTest',
                                description: {
                                    ko: `분산 테스트`, 
                                    en: `Dispersion Test`
                                },
                            },
                            {
                                name: 'DragonDispersion',
                                path: 'gltf/gltfExtensions/dispersion/dragonDispersion',
                                description: {
                                    ko: `용 모델 분산 테스트`, 
                                    en: `Dragon Model Dispersion Test`
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
                                description: {
                                    ko: `발광 강도 비교`, 
                                    en: `Compare Emissive Strength`
                                },
                            },
                            {
                                name: 'EmissiveStrengthTest',
                                path: 'gltf/gltfExtensions/emissiveStrength/emissiveStrengthTest',
                                description: {
                                    ko: `발광 강도 테스트`, 
                                    en: `Emissive Strength Test`
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
                                description: {
                                    ko: `광택(Sheen) 비교`, 
                                    en: `Compare Sheen`
                                },
                            },
                            {
                                name: 'SheenTestGrid',
                                path: 'gltf/gltfExtensions/sheen/sheenTestGrid',
                                description: {
                                    ko: `광택 테스트 그리드`, 
                                    en: `Sheen Test Grid`
                                },
                            },
                            {
                                name: 'SheenCloth',
                                path: 'gltf/gltfExtensions/sheen/sheenCloth',
                                description: {
                                    ko: `천 재질 광택`, 
                                    en: `Sheen Cloth Material`
                                },
                            },
                            {
                                name: 'SheenChair',
                                path: 'gltf/gltfExtensions/sheen/sheenChair',
                                description: {
                                    ko: `의자 모델 광택`, 
                                    en: `Sheen Chair Model`
                                },
                            },
                            {
                                name: 'GlamVelvetSofa',
                                path: 'gltf/gltfExtensions/sheen/glamVelvetSofa',
                                description: {
                                    ko: `벨벳 소파 광택`, 
                                    en: `Velvet Sofa Sheen`
                                },
                            },
                            {
                                name: 'ChairDamaskPurplegold',
                                path: 'gltf/gltfExtensions/sheen/chairDamaskPurplegold',
                                description: {
                                    ko: `다마스크 의자 광택`, 
                                    en: `Damask Chair Sheen`
                                },
                            },
                            {
                                name: 'SheenWoodLeatherSofa',
                                path: 'gltf/gltfExtensions/sheen/sheenWoodLeatherSofa',
                                description: {
                                    ko: `나무/가죽 소파 광택`, 
                                    en: `Wood/Leather Sofa Sheen`
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
                                description: {
                                    ko: `스펙큘러 비교`, 
                                    en: `Compare Specular`
                                },
                            },
                            {
                                name: 'SpecularTest',
                                path: 'gltf/gltfExtensions/specular/specularTest',
                                description: {
                                    ko: `스펙큘러 테스트`, 
                                    en: `Specular Test`
                                },
                            },
                            {
                                name: 'SpecularSilkPouf',
                                path: 'gltf/gltfExtensions/specular/specularSilkPouf',
                                description: {
                                    ko: `실크 푸프 스펙큘러`, 
                                    en: `Silk Pouf Specular`
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
                                description: {
                                    ko: `Unlit(무광) 재질 테스트`, 
                                    en: `Unlit Material Test`
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
                                description: {
                                    ko: `텍스처 변환 테스트`, 
                                    en: `Texture Transform Test`
                                },
                            },
                            {
                                name: 'TextureTransformMultiTest',
                                path: 'gltf/gltfExtensions/textureTransform/textureTransformMultiTest',
                                description: {
                                    ko: `다중 텍스처 변환 테스트`, 
                                    en: `Multi Texture Transform Test`
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
                                description: {
                                    ko: `확산 투과 테스트`, 
                                    en: `Diffuse Transmission Test`
                                },
                            },
                            {
                                name: 'DiffuseTransmissionTeacup',
                                path: 'gltf/gltfExtensions/diffuseTransmission/diffuseTransmissionTeacup',
                                description: {
                                    ko: `찻잔 확산 투과`, 
                                    en: `Teacup Diffuse Transmission`
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
                                description: {
                                    ko: `투과(Transmission) 비교`, 
                                    en: `Compare Transmission`
                                },
                            },
                            {
                                name: 'TransmissionTest',
                                path: 'gltf/gltfExtensions/transmission/transmissionTest',
                                description: {
                                    ko: `투과 테스트`, 
                                    en: `Transmission Test`
                                },
                            },
                            {
                                name: 'TransmissionRoughnessTest',
                                path: 'gltf/gltfExtensions/transmission/transmissionRoughnessTest',
                                description: {
                                    ko: `투과 거칠기 테스트`, 
                                    en: `Transmission Roughness Test`
                                },
                            },
                            {
                                name: 'StainedGlassLamp',
                                path: 'gltf/gltfExtensions/transmission/stainedGlassLamp',
                                description: {
                                    ko: `스테인드글라스 램프 투과`, 
                                    en: `Stained Glass Lamp Transmission`
                                },
                            },
                            {
                                name: 'ChronographWatch',
                                path: 'gltf/gltfExtensions/transmission/chronographWatch',
                                description: {
                                    ko: `크로노그래프 시계 투과`, 
                                    en: `Chronograph Watch Transmission`
                                },
                            },
                            {
                                name: 'MosquitoInAmber',
                                path: 'gltf/gltfExtensions/transmission/mosquitoInAmber',
                                description: {
                                    ko: `호박 속 모기 투과`, 
                                    en: `Mosquito In Amber Transmission`
                                },
                            },
                            {
                                name: 'CommercialRefrigerator',
                                path: 'gltf/gltfExtensions/transmission/commercialRefrigerator',
                                description: {
                                    ko: `상업용 냉장고 투과`, 
                                    en: `Commercial Refrigerator Transmission`
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
                                description: {
                                    ko: `굴절률(IOR) 비교`, 
                                    en: `Compare IOR`
                                },
                            },
                            {
                                name: 'IORTestGrid',
                                path: 'gltf/gltfExtensions/volume/IORTestGrid',
                                description: {
                                    ko: `굴절률 테스트 그리드`, 
                                    en: `IOR Test Grid`
                                },
                            },
                            {
                                name: 'CompareVolume',
                                path: 'gltf/gltfExtensions/volume/compareVolume',
                                description: {
                                    ko: `볼륨(Volume) 비교`, 
                                    en: `Compare Volume`
                                },
                            },
                            {
                                name: 'TransmissionThinwallTestGrid',
                                path: 'gltf/gltfExtensions/volume/transmissionThinwallTestGrid',
                                description: {
                                    ko: `얇은 벽 투과 테스트`, 
                                    en: `Thin-wall Transmission Test`
                                },
                            },
                            {
                                name: 'AttenuationTest',
                                path: 'gltf/gltfExtensions/volume/attenuationTest',
                                description: {
                                    ko: `감쇠(Attenuation) 테스트`, 
                                    en: `Attenuation Test`
                                },
                            },
                            {
                                name: 'GlassVaseFlowers',
                                path: 'gltf/gltfExtensions/volume/glassVaseFlowers',
                                description: {
                                    ko: `유리 꽃병 볼륨`, 
                                    en: `Glass Vase Flowers Volume`
                                },
                            },
                            {
                                name: 'GlassBrokenWindow',
                                path: 'gltf/gltfExtensions/volume/glassBrokenWindow',
                                description: {
                                    ko: `깨진 유리창 볼륨`, 
                                    en: `Glass Broken Window Volume`
                                },
                            },
                            {
                                name: 'GlassHurricaneCandleHolder',
                                path: 'gltf/gltfExtensions/volume/glassHurricaneCandleHolder',
                                description: {
                                    ko: `유리 캔들 홀더 볼륨`, 
                                    en: `Glass Hurricane Candle Holder Volume`
                                },
                            },
                            {
                                name: 'DragonAttenuation',
                                path: 'gltf/gltfExtensions/volume/dragonAttenuation',
                                description: {
                                    ko: `용 모델 감쇠`, 
                                    en: `Dragon Model Attenuation`
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
                name: '2D MouseEvent',
                list: [
                    {
                        name: 'Sprite2D',
                        path: '2d/mouseEvent/sprite2D',
                        description: {
                            ko: `Sprite2D에 대한 마우스 이벤트를 처리하는 예제입니다.`, 
                            en: `An example handling mouse events on Sprite2D.`
                        },
                    },
                    {
                        name: 'SpriteSheet2D',
                        path: '2d/mouseEvent/spriteSheet2D',
                        description: {
                            ko: `SpriteSheet2D에 대한 마우스 이벤트를 처리하는 예제입니다.`, 
                            en: `An example handling mouse events on SpriteSheet2D.`
                        },
                    },
                    {
                        name: 'TextField2D',
                        path: '2d/mouseEvent/textField2D',
                        description: {
                            ko: `TextField2D에 대한 마우스 이벤트를 처리하는 예제입니다.`, 
                            en: `An example handling mouse events on TextField2D.`
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
    {
        name: 'Physics',
        list: [
            {
                name: 'Fundamentals',
                list: [
                    {
                        name: 'Basic Physics',
                        path: 'physics/basic',
                        description: {
                            ko: `Rapier 물리 엔진을 사용한 기본적인 물리 시뮬레이션 예제입니다.`, 
                            en: `Basic physics simulation example using the Rapier physics engine.`
                        },
                    },
                    {
                        name: 'Shapes & Materials',
                        path: 'physics/shapes',
                        description: {
                            ko: `다양한 충돌체 형상(Box, Sphere, Cylinder, Capsule)과 탄성/마찰 설정을 테스트합니다.`, 
                            en: `Tests various collider shapes (Box, Sphere, Cylinder, Capsule) and restitution/friction settings.`
                        },
                    },
                    {
                        name: 'Kinematic Interaction',
                        path: 'physics/kinematic',
                        description: {
                            ko: `코드에 의해 제어되는 키네마틱 객체가 동적 객체들과 상호작용하는 모습을 보여줍니다.`, 
                            en: `Demonstrates how kinematic objects controlled by code interact with dynamic objects.`
                        },
                    },
                    {
                        name: 'Mesh Collider',
                        path: 'physics/meshCollider',
                        description: {
                            ko: `커스텀 기하구조를 물리 충돌체로 변환하는 방법을 테스트합니다.`, 
                            en: `Tests how to convert custom geometries into physics engine colliders.`
                        },
                    },
                    {
                        name: 'HeightField',
                        path: 'physics/heightField',
                        description: {
                            ko: `높이맵 데이터를 사용하여 지형과 같은 복잡한 표면의 물리 충돌을 구현하는 방법을 테스트합니다.`, 
                            en: `Tests how to implement physics collisions for complex surfaces like terrain using heightmap data.`
                        },
                    },
                    {
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
                list: [
                    {
                        name: 'Raycasting Interaction',
                        path: 'physics/raycast',
                        description: {
                            ko: `마우스 클릭 지점에서 광선을 쏘아 물리 객체를 검출하고, 힘을 가해 밀어내는 등의 상호작용을 구현합니다.`, 
                            en: `Casts rays from mouse click positions to detect physics objects and implements interactions like pushing them with force.`
                        },
                    },
                    {
                        name: 'Collision Events',
                        path: 'physics/collisionEvents',
                        description: {
                            ko: `물체 간의 충돌 이벤트를 감지하여 실시간으로 색상을 변경하는 등 물리 연동 로직을 테스트합니다.`, 
                            en: `Tests physics integration logic by detecting collision events between objects and changing colors in real-time.`
                        },
                    },
                    {
                        name: 'Triggers & Sensors',
                        path: 'physics/triggers',
                        description: {
                            ko: `물체와 물리적인 충돌은 발생하지 않으나 영역 진입을 감지하는 센서(Trigger) 기능을 테스트합니다.`, 
                            en: `Tests the sensor (Trigger) function that detects area entry without physical collision.`
                        },
                    },
                    {
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
                list: [
                    {
                        name: 'Basic Joints',
                        path: 'physics/joints',
                        description: {
                            ko: `물체들을 서로 연결하는 관절(Joint) 기능을 사용하여 체인이나 진자 운동과 같은 복잡한 물리 구조를 구현합니다.`, 
                            en: `Implements complex physical structures like chains or pendulums using joints to connect objects together.`
                        },
                    },
                    {
                        name: 'Revolute Joints & Motors',
                        path: 'physics/revoluteJoint',
                        description: {
                            ko: `특정 축을 기준으로 회전하는 관절(Revolute Joint)과 모터 기능을 사용하여 풍차나 선풍기와 같은 회전 장치를 구현합니다.`, 
                            en: `Implements rotating devices like windmills or fans using revolute joints that rotate around a specific axis and motor functions.`
                        },
                    },
                    {
                        name: 'Prismatic Joints & Sliders',
                        path: 'physics/prismaticJoint',
                        description: {
                            ko: `직선 방향으로만 왕복 이동이 가능한 프리즈매틱 관절(Prismatic Joint)을 사용하여 승강기나 슬라이더 장치를 구현합니다.`, 
                            en: `Implements elevators or slider devices using prismatic joints that allow reciprocal movement only in a straight line.`
                        },
                    },
                                        {
                                            name: 'Spring Joint',
                                            path: 'physics/springJoint',
                                            description: {
                                                ko: `스프링 조인트를 사용하여 탄성 있는 연결을 구현하는 방법을 테스트합니다.`, 
                                                en: `Tests how to implement elastic connections using spring joints.`
                                            },
                                        },
                                                            {
                                                                name: 'Soft Body',
                                                                path: 'physics/softBody',
                                                                description: {
                                                                    ko: `다수의 노드를 스프링으로 연결하여 젤리와 같은 소프트 바디 효과를 구현합니다.`, 
                                                                    en: `Implements a jelly-like soft body effect by connecting multiple nodes with springs.`
                                                                },
                                                            },
                                                            {
                                                                name: 'Raycast Vehicle',
                                                                path: 'physics/raycastVehicle',
                                                                description: {
                                                                    ko: `레이캐스트를 사용하여 서스펜션과 주행이 가능한 차량 물리 시뮬레이션을 구현합니다.`, 
                                                                    en: `Implements a vehicle physics simulation with suspension and driving using raycasts.`
                                                                },
                                                            },
                                                            {
                                                                name: 'Compound Shapes',                        path: 'physics/compound',
                        description: {
                            ko: `여러 개의 지오메트리를 결합하여 하나의 복잡한 물리 객체를 만드는 복합 형상 기능을 테스트합니다.`, 
                            en: `Tests the compound shape function that combines multiple geometries to create a single complex physics object.`
                        },
                    }
                ]
            },
            {
                name: 'Simulation & Systems',
                list: [
                    {
                        name: 'Surface Velocity (Conveyor)',
                        path: 'physics/surfaceVelocity',
                        description: {
                            ko: `컨베이어 벨트와 같이 표면이 움직이는 물체를 시뮬레이션합니다. 물체가 닿았을 때 특정 방향으로 힘을 가하여 이동시킵니다.`, 
                            en: `Simulates objects with moving surfaces like conveyor belts. Applies force to move objects in a specific direction when they make contact.`
                        },
                    },
                    {
                        name: 'Buoyancy Basics',
                        path: 'physics/buoyancy',
                        description: {
                            ko: `물속에서 물체가 떠오르는 부력과 유체 저항을 시뮬레이션합니다. 잠긴 깊이에 따라 상향 힘을 조절합니다.`, 
                            en: `Simulates buoyancy and fluid resistance for objects in water. Adjusts upward force based on submerged depth.`
                        },
                    },
                    {
                        name: 'Ragdoll System',
                        path: 'physics/ragdoll',
                        description: {
                            ko: `인간형 캐릭터의 뼈대를 관절(Joint)로 연결하여, 중력에 의해 자연스럽게 쓰러지는 래그돌 물리 효과를 시뮬레이션합니다.`, 
                            en: `Simulates ragdoll physics where a humanoid skeleton is connected with joints and falls naturally under gravity.`
                        },
                    },
                    {
                        name: 'Character Controller',
                        path: 'physics/characterController',
                        description: {
                            ko: `지면을 걷고 계단을 오르는 1인칭/3인칭 캐릭터 이동의 기초를 구현합니다.`, 
                            en: `Implements the basics of 1st/3rd person character movement walking on the ground and climbing stairs.`
                        },
                    },
                    {
                        name: 'Advanced Character Controller',
                        path: 'physics/advancedCharacterController',
                        description: {
                            ko: `관성 이동, 공중 제어, 이중 점프 등 게임적인 조작감이 가미된 고급 캐릭터 컨트롤러를 구현합니다.`, 
                            en: `Implements an advanced character controller with game-like controls such as inertial movement, air control, and double jumping.`
                        },
                    },
                    {
                        name: 'Snapshot & Serialization',
                        path: 'physics/snapshot',
                        description: {
                            ko: `물리 월드 전체 상태를 바이너리 데이터로 저장하고 복구하는 기능을 시연합니다. 시간 되감기나 세이브 시스템 구현에 필수적입니다.`, 
                            en: `Demonstrates saving and restoring the entire physics world state as binary data. Essential for time rewind or save systems.`
                        },
                    }
                ]
            },
            {
                name: 'Performance & Stress Test',
                list: [
                    {
                        name: 'Galton Board',
                        path: 'physics/galton',
                        description: {
                            ko: `수많은 구슬이 핀 사이를 떨어지며 통계적 분포를 형성하는 과정을 시뮬레이션합니다.`, 
                            en: `Simulates the process where numerous balls fall between pins and form a statistical distribution.`
                        },
                    },
                    {
                        name: 'Physics Bowling',
                        path: 'physics/bowling',
                        description: {
                            ko: `고속으로 이동하는 볼과 핀 사이의 충돌 및 연쇄 반응을 테스트합니다. CCD(Continuous Collision Detection) 기술이 적용되었습니다.`, 
                            en: `Tests collisions and chain reactions between a fast-moving ball and pins. CCD (Continuous Collision Detection) technology is applied.`
                        },
                    },
                    {
                        name: 'Impulse Explosion',
                        path: 'physics/explosion',
                        description: {
                            ko: `폭발 지점으로부터 주변 객체들에 충격량을 가하여 날려버리는 물리 효과를 구현합니다.`, 
                            en: `Implements physics effects where impulse is applied from an explosion point to blow away surrounding objects.`
                        },
                    },
                    {
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