import {ExampleListType} from '../types/example';

export const ExampleList: ExampleListType = [

    {
        name: '3D',
        list: [
            {
                name: 'Core & Setup',
                list: [
                    {
                        name: 'Hello RedGPU',
                        path: '3d/helloWorld',
                        description: {
                            ko: 'RedGPU 초기화와 Scene, View3D, 컨트롤러 구성의 기본 예제입니다.',
                            en: 'Basic RedGPU initialization with Scene, View3D, and OrbitController.'
                        },
                    },
                    {
                        name: 'View3D',
                        list: [
                            {
                                name: 'Single View3D',
                                path: '3d/view/singleView',
                                description: {
                                    ko: '단일 View3D 렌더링과 축·그리드 헬퍼 및 뷰포트 옵션을 테스트합니다.',
                                    en: 'Single View3D rendering with axis/grid helpers and viewport controls.'
                                },
                            },
                            {
                                name: 'Multi View3D',
                                path: '3d/view/multiView',
                                description: {
                                    ko: '단일 캔버스에 여러 View3D를 배치하고 크기·위치를 동적으로 제어합니다.',
                                    en: 'Arranges multiple independent View3Ds on a single canvas.'
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
                                    ko: 'Scene 컨테이너 생성과 배경 색상 및 투명도 옵션을 테스트합니다.',
                                    en: 'Configures Scene background color and alpha transparency options.'
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
                                    ko: '키보드와 마우스 입력으로 3D 공간을 자유롭게 이동하는 1인칭 컨트롤러입니다.',
                                    en: 'First-person camera controller with keyboard and mouse navigation.'
                                },
                            },
                            {
                                name: 'OrbitController',
                                path: '3d/controller/orbitController',
                                description: {
                                    ko: '중심점 기준 회전, 줌, 팬·틸트 제어를 제공하는 궤도형 카메라 컨트롤러입니다.',
                                    en: 'Orbital camera controller with pivot rotation, zoom, and pan/tilt.'
                                },
                            },
                            {
                                name: 'FollowController',
                                path: '3d/controller/followController',
                                description: {
                                    ko: '타겟 메쉬의 이동과 회전을 부드럽게 추적하는 3인칭 카메라 컨트롤러입니다.',
                                    en: 'Third-person camera controller that smoothly tracks a target mesh.'
                                },
                            },
                            {
                                name: 'IsometricController',
                                path: '3d/controller/isometricController',
                                description: {
                                    ko: '직교 투영 기반의 타겟 추적 및 줌을 지원하는 아이소메트릭 컨트롤러입니다.',
                                    en: 'Orthographic isometric camera controller with target tracking and zoom.'
                                },
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Objects & Geometry',
                list: [
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
                                    ko: 'Box 프리미티브 생성 및 세부 속성을 실시간으로 테스트합니다.',
                                    en: 'Creates and tests Box primitive geometry options in real time.'

                                },
                            },
                            {
                                name: 'RoundedBox',
                                path: '3d/primitive/roundedBox',
                                description: {
                                    ko: '모서리 반지름과 분할 수를 조절하는 RoundedBox 프리미티브 예제입니다.',
                                    en: 'Creates and tests RoundedBox primitives with corner radius settings.'
                                },
                            },
                            {
                                name: 'Circle',
                                path: '3d/primitive/circle',
                                description: {
                                    ko: 'Circle 프리미티브 생성 및 세부 속성을 실시간으로 테스트합니다.',
                                    en: 'Creates and tests Circle primitive geometry options in real time.'

                                },
                            },
                            {
                                name: 'Cone',
                                path: '3d/primitive/cone',
                                description: {
                                    ko: 'Cone 프리미티브 생성 및 세부 속성을 실시간으로 테스트합니다.',
                                    en: 'Creates and tests Cone primitive geometry options in real time.'

                                },
                            },
                            {
                                name: 'Cylinder',
                                path: '3d/primitive/cylinder',
                                description: {
                                    ko: 'Cylinder 프리미티브 생성 및 세부 속성을 실시간으로 테스트합니다.',
                                    en: 'Creates and tests Cylinder primitive geometry options in real time.'

                                },
                            },
                            {
                                name: 'Plane',
                                path: '3d/primitive/plane',
                                description: {
                                    ko: 'Plane 프리미티브 생성 및 세부 속성을 실시간으로 테스트합니다.',
                                    en: 'Creates and tests Plane primitive geometry options in real time.'

                                },
                            },
                            {
                                name: 'Ground',
                                path: '3d/primitive/ground',
                                description: {
                                    ko: 'Ground 프리미티브 생성 및 세부 속성을 실시간으로 테스트합니다.',
                                    en: 'Creates and tests Ground primitive geometry options in real time.'

                                },
                            },
                            {
                                name: 'Sphere',
                                path: '3d/primitive/sphere',
                                description: {
                                    ko: 'Sphere 프리미티브 생성 및 세부 속성을 실시간으로 테스트합니다.',
                                    en: 'Creates and tests Sphere primitive geometry options in real time.'

                                },
                            },
                            {
                                name: 'Capsule',
                                path: '3d/primitive/capsule',
                                description: {
                                    ko: 'Capsule 프리미티브 생성 및 세부 속성을 실시간으로 테스트합니다.',
                                    en: 'Creates and tests Capsule primitive geometry options in real time.'

                                },
                            },
                            {
                                name: 'Torus',
                                path: '3d/primitive/torus',
                                description: {
                                    ko: 'Torus 프리미티브 생성 및 세부 속성을 실시간으로 테스트합니다.',
                                    en: 'Creates and tests Torus primitive geometry options in real time.'

                                },
                            },
                            {
                                name: 'TorusKnot',
                                path: '3d/primitive/torusKnot',
                                description: {
                                    ko: 'TorusKnot 프리미티브 생성 및 세부 속성을 실시간으로 테스트합니다.',
                                    en: 'Creates and tests TorusKnot primitive geometry options in real time.'

                                },
                            },
                            {
                                name: 'Ring',
                                path: '3d/primitive/ring',
                                description: {
                                    ko: 'Ring 프리미티브 생성 및 세부 속성을 실시간으로 테스트합니다.',
                                    en: 'Creates and tests Ring primitive geometry options in real time.'

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
                                    ko: '기본 메쉬의 위치, 크기, 회전 및 재질 속성을 실시간으로 조작합니다.',
                                    en: 'Manipulates mesh position, scale, rotation, and material properties.'
                                },
                            },
                            {
                                name: 'Hierarchy Mesh',
                                path: '3d/mesh/hierarchy',
                                description: {
                                    ko: '부모-자식 메쉬 계층 구조를 구성하고 위치·회전·스케일을 제어합니다.',
                                    en: 'Builds a parent-child mesh hierarchy and controls transforms.'
                                },
                            },
                            {
                                name: 'Pivot Mesh',
                                path: '3d/mesh/pivot',
                                description: {
                                    ko: '피벗(Pivot) 설정을 통해 메쉬의 회전 및 스케일 중심점을 변경합니다.',
                                    en: 'Changes the center of rotation and scaling via mesh pivot settings.'
                                },
                            },
                            {
                                name: 'Child Methods',
                                path: '3d/mesh/childMethod',
                                description: {
                                    ko: '자식 노드의 추가, 삭제, 순서 변경 및 교체를 동적으로 제어합니다.',
                                    en: 'Dynamically adds, removes, reorders, and replaces child nodes.'
                                },
                            },
                            {
                                name: 'lookAt Methods',
                                path: '3d/mesh/lookAt',
                                description: {
                                    ko: 'lookAt 메서드로 객체가 특정 목표 지점을 바라보도록 제어합니다.',
                                    en: 'Orients an object toward a target point using the lookAt method.'
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
                                            ko: '메쉬 간 AABB(축 정렬 바운딩 박스) 교차 검사를 테스트합니다.',
                                            en: 'Tests intersection detection between mesh AABB bounding boxes.'
                                        },
                                    },
                                    {
                                        name: 'OBB - intersects',
                                        path: '3d/mesh/boundBox/meshOBBIntersects',
                                        description: {
                                            ko: '메쉬 간 OBB(방향성 바운딩 박스) 교차 검사를 테스트합니다.',
                                            en: 'Tests intersection detection between mesh OBB bounding boxes.'
                                        },
                                    },
                                ]
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
                                    ko: '3D 객체들을 그룹으로 묶어 제어하는 Group3D 예제입니다.',
                                    en: 'Groups and transforms multiple 3D objects together using Group3D.'
                                },
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
                                    ko: '월드 좌표와 로컬 좌표 간의 변환을 테스트하는 예제입니다.',
                                    en: 'Tests coordinate transformations between world space and local space.'
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
                        name: 'Sprite3D & SpriteSheet3D',
                        list: [
                            {
                                name: 'Sprite3D',
                                path: '3d/sprite/sprite3D',
                                description: {
                                    ko: `Sprite3D 객체의 사용법을 보여주는 예제입니다.`,
                                    en: `An example demonstrating the usage of a Sprite3D object.`
                                },
                            },
                            {
                                name: 'Sprite3D Comparison (World vs Pixel)',
                                path: '3d/sprite/sprite3DCompare',
                                description: {
                                    ko: 'Sprite3D의 월드 크기와 고정 픽셀 크기 모드를 비교합니다.',
                                    en: 'Compares Sprite3D worldSize and fixed pixelSize rendering modes.'
                                },
                            },
                            {
                                name: 'SpriteSheet3D',
                                path: '3d/sprite/spriteSheet3D',
                                description: {
                                    ko: `SpriteSheet3D 객체의 사용법을 보여주는 예제입니다.`,
                                    en: `An example demonstrating the usage of a SpriteSheet3D object.`
                                },
                            },
                            {
                                name: 'SpriteSheet3D Comparison (World vs Pixel)',
                                path: '3d/sprite/spriteSheet3DCompare',
                                description: {
                                    ko: 'SpriteSheet3D의 월드 크기와 고정 픽셀 크기 모드를 비교합니다.',
                                    en: 'Compares SpriteSheet3D worldSize and fixed pixelSize rendering modes.'
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
                                    en: `An example demonstrating the usage of a TextField3D object.`
                                },
                            },
                            {
                                name: 'TextField3D Comparison (World vs Pixel)',
                                path: '3d/textField/textField3DCompare',
                                description: {
                                    ko: 'TextField3D의 월드 크기와 고정 픽셀 크기 모드를 비교합니다.',
                                    en: 'Compares TextField3D worldSize and fixed usePixelSize rendering modes.'
                                },
                            },
                        ]
                    }
                ]
            },
            {
                name: 'Material & Texture',
                list: [
                    {
                        name: 'Material',
                        list: [
                            {
                                name: 'ColorMaterial',
                                path: '3d/material/colorMaterial',
                                description: {
                                    ko: 'ColorMaterial의 기본 색상 속성과 제어 메서드를 실시간으로 테스트합니다.',
                                    en: 'Tests ColorMaterial color properties and control methods in real time.'
                                },
                            },
                            {
                                name: 'BitmapMaterial',
                                path: '3d/material/bitmapMaterial',
                                description: {
                                    ko: '다양한 이미지 포맷을 적용한 BitmapMaterial 예제입니다.',
                                    en: 'Applies PNG, JPG, WEBP, and SVG textures to BitmapMaterial.'
                                },
                            },
                            {
                                name: 'PhongMaterial',
                                path: '3d/material/phongMaterial',
                                description: {
                                    ko: 'PhongMaterial의 조명 반응 속성과 기본 파라미터를 실시간으로 조절합니다.',
                                    en: 'Configures PhongMaterial lighting properties and shading parameters.'
                                },
                            },
                            {
                                name: 'PhongMaterial Texture Combination',
                                path: '3d/material/phongMaterialTextures',
                                description: {
                                    ko: 'PhongMaterial의 다양한 텍스처 맵 조합과 시각적 효과를 시연합니다.',
                                    en: 'Demonstrates various texture map combinations on PhongMaterial.'
                                },
                            },
                            {
                                name: 'UV Transform',
                                path: '3d/material/uvTransform',
                                description: {
                                    ko: '재질의 UV 오프셋과 스케일을 조절해 텍스처 흐름 및 타일링을 구현합니다.',
                                    en: 'Implements texture scrolling and tiling via material UV offset and scale.'
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
                                    ko: '텍스처 샘플러의 다양한 필터링 및 래핑 조합을 한눈에 비교합니다.',
                                    en: 'Compares various texture sampler filtering and wrapping combinations.'
                                },
                            },
                            {
                                name: 'Sampler AddressMode',
                                path: '3d/texture/samplerAddressMode',
                                description: {
                                    ko: `텍스처 샘플러의 AddressMode 옵션 조합을 보여주는 예제입니다.`,
                                    en: `An example showing combinations of AddressMode options for a texture sampler.`
                                },
                            },
                            {
                                name: 'Max Anisotropy',
                                path: '3d/texture/maxAnisotropy',
                                description: {
                                    ko: `텍스처의 비등방성 필터링(Anisotropy) 옵션을 보여주는 예제입니다.`,
                                    en: `An example showing the Anisotropy option for a texture.`
                                },
                            },

                        ],

                    },
                    {
                        name: 'KTX2 Texture',
                        list: [
                            {
                                name: 'Basic (Three.js 18 Standard)',
                                path: '3d/texture/ktx2/basic',
                                description: {
                                    ko: '표준 KTX2 텍스처(비압축, 블록 압축, Basis 트랜스코딩)를 테스트합니다.',
                                    en: 'Tests standard KTX2 textures including raw, block-compressed, and Basis.'
                                }
                            },
                            {
                                name: 'Legacy (1st Gen Reference)',
                                path: '3d/texture/ktx2/legacy',
                                description: {
                                    ko: 'Khronos 1세대 레퍼런스 KTX2 텍스처 판별 및 렌더링을 테스트합니다.',
                                    en: 'Tests automatic metadata detection and rendering of legacy KTX2 assets.'
                                }
                            },
                            {
                                name: 'Transcode (Basis Universal ETC1S / UASTC)',
                                path: '3d/texture/ktx2/transcode',
                                description: {
                                    ko: 'Basis Universal(ETC1S, UASTC) KTX2 트랜스코딩 예제입니다.',
                                    en: 'Tests Basis Universal (ETC1S & UASTC) 2D KTX2 runtime transcoding.'
                                }
                            },
                            {
                                name: 'ASTC (Mobile / Apple Silicon Only)',
                                path: '3d/texture/ktx2/astc',
                                description: {
                                    ko: 'ASTC 압축 KTX2 텍스처와 소프트웨어 디코딩 폴백을 테스트합니다.',
                                    en: 'Tests ASTC compressed KTX2 textures with software decoding fallback.'
                                }
                            },
                            {
                                name: 'ZSTD (Supercompressed & Block)',
                                path: '3d/texture/ktx2/zstd',
                                description: {
                                    ko: `ZSTD 초고압축 텍스처 및 블록 압축/다국어 2D 텍스처 전용 테스트 예제입니다.`,
                                    en: `Test example for ZSTD supercompressed textures and block compressed 2D textures.`
                                }
                            },
                            {
                                name: 'Array / Cube / 3D (3D / Array / Cubemap)',
                                path: '3d/texture/ktx2/arrayCube3d',
                                description: {
                                    ko: '3D 볼륨, 텍스처 배열, 큐브맵 및 스카이박스 KTX2 텍스처를 테스트합니다.',
                                    en: 'Tests KTX2 3D volume textures, texture arrays, cubemaps, and skyboxes.'
                                }
                            }
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
                                        path: '3d/noiseTexture/simplex/basic',
                                        description: {
                                            ko: `심플렉스 노이즈 텍스처를 생성하고 적용하는 기본 예제입니다.`,
                                            en: `Basic example of generating and applying Simplex Noise Texture.`
                                        },
                                    },
                                    {
                                        experimental: true,
                                        name: 'Custom SimplexTexture - Fire',
                                        path: '3d/noiseTexture/simplex/fire',
                                        description: {
                                            ko: `심플렉스 노이즈를 활용하여 불꽃 효과를 연출하는 커스텀 텍스처 예제입니다.`,
                                            en: `Custom texture example creating a fire effect using Simplex Noise.`
                                        },
                                    },
                                    {
                                        experimental: true,
                                        name: 'Custom SimplexTexture - Displacement',
                                        path: '3d/noiseTexture/simplex/displacement',
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
                        name: 'Tint',
                        experimental: true,
                        list: [
                            {
                                experimental: true,
                                name: 'Tint',
                                path: '3d/tint/basic',
                                description: {
                                    ko: '재질의 색상 틴트(Tint)와 블렌드 모드(tintBlendMode)를 테스트합니다.',
                                    en: 'Tests material color tinting and tintBlendMode configurations.'
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
                                    ko: '반투명(transparent) 객체들의 깊이 정렬 및 렌더링 순서를 확인합니다.',
                                    en: 'Demonstrates depth sorting and rendering order of translucent objects.'
                                },
                            },
                        ]
                    }
                ]
            },
            {
                name: 'Lighting & Environment',
                list: [
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
                                    ko: '한 지점에서 전방위로 빛을 방출하는 점광원(PointLight) 예제입니다.',
                                    en: 'Demonstrates omnidirectional PointLight properties and controls.'
                                },
                            },
                            {
                                name: 'PointLight with glTF',
                                path: '3d/light/pointLightWithGltf',
                                description: {
                                    ko: '물리적 거리 감쇄 PointLight와 glTF PBR 모델의 조명 예제입니다.',
                                    en: 'Demonstrates PointLight attenuation interacting with a glTF PBR model.'
                                },
                            },
                            {
                                name: 'SpotLight',
                                path: '3d/light/spotLight',
                                description: {
                                    ko: '특정 방향으로 원뿔형 빛을 비추는 스포트라이트(SpotLight) 예제입니다.',
                                    en: 'Demonstrates cone-shaped SpotLight properties and angle controls.'
                                },
                            },
                            {
                                name: 'SpotLight with glTF',
                                path: '3d/light/spotLightWithGltf',
                                description: {
                                    ko: '원뿔 감쇄가 적용된 SpotLight와 glTF PBR 모델의 조명 예제입니다.',
                                    en: 'Demonstrates SpotLight angle attenuation on a glTF PBR model.'
                                },
                            },
                            {
                                name: 'PointLight Performance (Cluster)',
                                path: '3d/light/pointLightPerformance',
                                description: {
                                    ko: '클러스터드 라이팅 기반으로 1,024개의 PointLight를 동시 렌더링합니다.',
                                    en: 'Renders 1,024 dynamic PointLights using clustered forward lighting.'
                                },
                            },
                            {
                                name: 'SpotLight Performance (Cluster)',
                                path: '3d/light/spotLightPerformance',
                                description: {
                                    ko: `SpotLight의 대량 렌더링 성능(클러스터링)을 테스트하는 예제입니다.`,
                                    en: `An example testing the mass rendering performance (clustering) of SpotLights.`
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
                                    ko: 'DirectionalLight 기반의 실시간 그림자 생성과 세부 설정을 시연합니다.',
                                    en: 'Demonstrates real-time DirectionalLight shadow rendering and settings.'
                                },
                            },
                            {
                                name: 'glTF DirectionalLight Shadow',
                                path: '3d/shadow/gltfDirectionalShadow',
                                description: {
                                    ko: 'glTF PBR 모델과 DirectionalLight의 CSM 그림자 예제입니다.',
                                    en: 'Real-time CSM directional shadows cast across glTF PBR models.'
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
                                                    ko: '노이즈 알파 텍스처를 활용해 두 스카이박스 간의 전환 효과를 연출합니다.',
                                                    en: 'Creates smooth skybox transition effects using noise alpha textures.'
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
                                            ko: 'HDR 환경맵 기반의 IBL(이미지 기반 조명)과 스카이박스를 생성합니다.',
                                            en: 'Creates a skybox and scene lighting using HDR Image-Based Lighting.'
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
                                            ko: 'IBL 스페큘러 반사 연산을 위한 BRDF LUT 텍스처 생성을 검증합니다.',
                                            en: 'Verifies BRDF LUT texture generation for IBL specular reflections.'
                                        },
                                    },
                                    {
                                        name: 'Irradiance Test (Dev Only)',
                                        path: '3d/skybox/ibl/irradianceTest',
                                        description: {
                                            ko: '환경맵으로부터 확산 반사용 Irradiance 큐브맵 생성을 검증합니다.',
                                            en: 'Verifies diffuse Irradiance cubemap generation from an environment map.'
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
                                            ko: '카메라 시야 밖의 객체를 렌더링에서 제외하는 절두체 컬링을 시연합니다.',
                                            en: 'Excludes objects outside the camera frustum from rendering.'
                                        },
                                    },
                                    {
                                        name: 'DistanceCulling',
                                        path: '3d/frustumCulling/distanceCulling',
                                        description: {
                                            ko: '카메라와의 거리에 따라 원거리 객체를 렌더링에서 제외하는 거리 컬링입니다.',
                                            en: 'Excludes distant objects from rendering based on camera distance.'
                                        },
                                    },
                                ]
                            },
                            {
                                name: 'SkyAtmosphere',
                                list: [
                                    {
                                        name: 'SkyAtmosphere Basic',
                                        path: '3d/skyAtmosphere/skyAtmosphere',
                                        description: {
                                            ko: '물리 기반 대기 산란(SkyAtmosphere)과 실시간 태양 광원 연동을 시연합니다.',
                                            en: 'Physics-based SkyAtmosphere scattering synchronized with sun direction.'
                                        },
                                    },
                                    {
                                        name: 'Material Scattering (Aerial Perspective)',
                                        path: '3d/skyAtmosphere/scatteringTest',
                                        description: {
                                            ko: '거리에 따른 대기 산란(공중 투시) 효과가 재질에 미치는 영향을 비교합니다.',
                                            en: 'Compares distance-based aerial perspective across various materials.'
                                        },
                                    },
                                    {
                                        name: 'Atmosphere & IBL Harmony',
                                        path: '3d/skyAtmosphere/gltf',
                                        description: {
                                            ko: '대기 산란, IBL 환경광, 스카이박스를 결합한 glTF PBR 통합 렌더링입니다.',
                                            en: 'Combines SkyAtmosphere, IBL, and skybox lighting on a glTF PBR model.'
                                        },
                                    },

                                    {
                                        name: 'SkyAtmosphere LUT Generator',
                                        path: '3d/skyAtmosphere/generator',
                                        description: {
                                            ko: '대기 산란 계산에 사용되는 투과율·하늘 뷰 등 내부 LUT를 시각화합니다.',
                                            en: 'Visualizes internal Transmittance and SkyView LUTs for SkyAtmosphere.'
                                        },
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Interaction',
                list: [
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
                                            ko: 'Mesh 객체에 마우스 클릭·호버 등 포인터 이벤트를 등록하는 예제입니다.',
                                            en: 'Registers mouse click and hover pointer events on a 3D Mesh.'
                                        },
                                    },
                                    {
                                        name: 'Sprite3D',
                                        path: '3d/interaction/mouseEvent/sprite3D',
                                        description: {
                                            ko: 'Sprite3D 객체에 마우스 포인터 이벤트를 등록하는 예제입니다.',
                                            en: 'Registers mouse click and hover pointer events on a Sprite3D.'
                                        },
                                    },
                                    {
                                        name: 'SpriteSheet3D',
                                        path: '3d/interaction/mouseEvent/spriteSheet3D',
                                        description: {
                                            ko: 'SpriteSheet3D 객체에 마우스 포인터 이벤트를 등록하는 예제입니다.',
                                            en: 'Registers mouse click and hover pointer events on a SpriteSheet3D.'
                                        },
                                    },
                                    {
                                        name: 'TextField3D',
                                        path: '3d/interaction/mouseEvent/textField3D',
                                        description: {
                                            ko: 'TextField3D 객체에 마우스 포인터 이벤트를 등록하는 예제입니다.',
                                            en: 'Registers mouse click and hover pointer events on a TextField3D.'
                                        },
                                    },
                                    {
                                        name: 'Raycasting (Precision Picking)',
                                        path: '3d/interaction/mouseEvent/raycasting',
                                        description: {
                                            ko: '복잡한 메쉬 표면의 정확한 교차점과 면 인덱스를 검출하는 정밀 레이캐스팅입니다.',
                                            en: 'High-precision raycasting detecting exact hit points and face indices.'
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
                                            ko: 'keyboardKeyBuffer로 매 프레임 키 입력 상태를 확인해 객체를 제어합니다.',
                                            en: 'Polls keyboard state each frame via keyboardKeyBuffer to move objects.'
                                        },
                                    }
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                name: 'World & Simulation',
                list: [
                    {
                        name: 'ParticleSystem',
                        list: [
                            {
                                name: 'Particle',
                                path: '3d/particle/basic',
                                description: {
                                    ko: `기본적인 파티클 시스템을 시연하는 예제입니다.`,
                                    en: `An example demonstrating a basic particle system.`
                                }
                            },
                            {
                                name: 'Multi Particle Performance',
                                path: '3d/particle/performance',
                                description: {
                                    ko: `다수의 파티클 시스템을 동시에 렌더링하여 성능을 테스트하는 예제입니다.`,
                                    en: `An example testing performance by rendering multiple particle systems simultaneously.`
                                }
                            }
                        ]
                    },
                    {
                        name: 'Landscape',
                        experimental: true,
                        list: [
                            {
                                experimental: true,
                                name: 'Basic Terrain',
                                path: '3d/landscape/basicTerrain',
                                description: {
                                    ko: '16비트 하이트맵 지형 생성과 연속 LOD·지오모핑 및 그림자를 제어합니다.',
                                    en: '16-bit heightmap terrain with continuous LOD, geomorphing, and shadows.'
                                }
                            },
                            {
                                experimental: true,
                                name: 'Multi-Layer Splatting',
                                path: '3d/landscape/multiLayerSplatting',
                                description: {
                                    ko: '4채널 스플랫맵 기반의 지형 PBR 재질 블렌딩과 스토캐스틱 타일링 예제입니다.',
                                    en: 'Blends 4 terrain PBR layers via RGBA splatmap and stochastic tiling.'
                                }
                            },
                            {
                                experimental: true,
                                name: 'Tile Streaming',
                                path: '3d/landscape/tileStreaming',
                                description: {
                                    ko: '16×16 분할 지형에서 카메라 위치에 맞춰 고해상도 타일을 비동기 스트리밍합니다.',
                                    en: 'Asynchronously streams high-res heightmap tiles across a 16×16 terrain.'
                                }
                            },
                            {
                                experimental: true,
                                name: 'Procedural Grass Field',
                                path: '3d/landscape/proceduralGrass',
                                description: {
                                    ko: '지형 가중치와 경사도를 기반으로 수만 개의 GPU 절차적 잔디를 배치·컬링합니다.',
                                    en: 'Procedurally scatters and culls tens of thousands of GPU grass blades.'
                                }
                            },
                            {
                                experimental: true,
                                name: 'Foliage & Impostors',
                                path: '3d/landscape/foliageAndImpostors',
                                description: {
                                    ko: '대규모 수목의 절차적 배치와 3단계 메쉬 LOD 및 원거리 임포스터를 시연합니다.',
                                    en: 'Large-scale tree foliage with 3-stage mesh LODs and distant impostors.'
                                }
                            },
                            {
                                experimental: true,
                                name: 'Open World Integration',
                                path: '3d/landscape/openWorldIntegration',
                                description: {
                                    ko: '타일 스트리밍 지형, 멀티레이어 스플랫, 식생 및 캐릭터 컨트롤러 통합 예제입니다.',
                                    en: 'Integrates streaming terrain, PBR splatting, foliage, and character control.'
                                }
                            },
                            {
                                experimental: true,
                                name: 'Landscape & Water System',
                                path: '3d/landscape/landscapeAndWater',
                                description: {
                                    ko: '스트리밍 지형과 호수(Lake)를 결합해 수중 굴절과 보행 물결을 시연합니다.',
                                    en: 'Combines streaming terrain and Lake water with optics and walking ripples.'
                                }
                            }
                        ]
                    },
                    {
                        name: 'Water',
                        experimental: true,
                        list: [
                            {
                                name: 'Lake',
                                experimental: true,
                                list: [
                                    {
                                        experimental: true,
                                        name: 'Basic Lake',
                                        path: '3d/water/lake/basicLake',
                                        description: {
                                            ko: '씬에 호수(Lake)를 등록하고 수위, 파동 및 기본 재질 속성을 제어합니다.',
                                            en: 'Registers a Lake and controls water level, waves, and material settings.'
                                        }
                                    },
                                    {
                                        experimental: true,
                                        name: 'Lake Material',
                                        path: '3d/water/lake/lakeMaterial',
                                        description: {
                                            ko: '수중 굴절·감쇠, 코스틱스 및 SSR 반사 등 호수 광학 속성을 제어합니다.',
                                            en: 'Controls LakeMaterial optics including refraction, caustics, and SSR.'
                                        }
                                    },
                                    {
                                        experimental: true,
                                        name: 'Object Interaction',
                                        path: '3d/water/lake/interaction',
                                        description: {
                                            ko: '움직이는 구체들이 수면과 접촉하며 일으키는 실시간 물결과 파동 간섭입니다.',
                                            en: 'Real-time water ripples and wave interference from moving spheres.'
                                        }
                                    },
                                    {
                                        experimental: true,
                                        name: 'Character Walking',
                                        path: '3d/water/lake/characterWalking',
                                        description: {
                                            ko: '스키닝 캐릭터의 이동 궤적을 따라 수면 위에 자연스러운 보행 물결을 생성합니다.',
                                            en: 'Generates dynamic water ripples trailing a walking skinned character.'
                                        }
                                    },
                                    {
                                        experimental: true,
                                        name: 'Multi Lake',
                                        path: '3d/water/lake/multiLake',
                                        description: {
                                            ko: '서로 다른 수위와 색상을 가진 여러 개의 독립된 호수(Lake)를 동시 렌더링합니다.',
                                            en: 'Renders multiple independent Lakes with distinct water levels and colors.'
                                        }
                                    },
                                    {
                                        experimental: true,
                                        name: 'Lake with Landscape',
                                        path: '3d/water/lake/lakeWithLandscape',
                                        description: {
                                            ko: '지형·식생과 호수를 결합해 수변 깊이 페이드, 수중 광학 및 물결을 시연합니다.',
                                            en: 'Integrates terrain and foliage with Lake depth fade, optics, and ripples.'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Optimization',
                list: [
                    {
                        name: 'InstancedMesh',
                        list: [
                            {
                                name: 'InstancedMesh Simple',
                                path: '3d/instancedMesh/simple',
                                description: {
                                    ko: '단일 드로우콜로 대량의 Plane을 그리는 InstancedMesh 예제입니다.',
                                    en: 'Benchmarks InstancedMesh rendering performance with massive Plane instances.'
                                },
                            },
                            {
                                name: 'InstancedMesh Sphere',
                                path: '3d/instancedMesh/sphere',
                                description: {
                                    ko: '단일 드로우콜로 대량의 Sphere를 그리는 InstancedMesh 예제입니다.',
                                    en: 'Benchmarks InstancedMesh rendering performance with massive Sphere instances.'
                                },
                            },
                        ]
                    },
                    {
                        name: 'LOD',
                        list: [
                            {
                                name: 'InstancedMesh GPU LOD',
                                path: '3d/lod/InstanceMeshGPULOD',
                                description: {
                                    ko: 'InstancedMesh에 GPU 기반 LOD를 적용해 수만 개의 객체를 최적화합니다.',
                                    en: 'Optimizes tens of thousands of instances using GPU-driven LOD.'
                                },
                            },
                            {
                                name: 'InstancedMesh Multi-Material GPU LOD',
                                path: '3d/lod/InstanceMeshGPULOD_material',
                                description: {
                                    ko: 'InstancedMesh에서 거리별로 지오메트리와 재질을 함께 전환합니다.',
                                    en: 'GPU-driven LOD switching both geometry and material by distance.'
                                },
                            },
                            {
                                name: 'Mesh CPU LOD',
                                path: '3d/lod/MeshCPULOD',
                                description: {
                                    ko: '수천 개의 개별 Mesh 객체에 거리별 CPU LOD를 적용해 성능을 최적화합니다.',
                                    en: 'Optimizes thousands of individual Meshes using distance-based CPU LOD.'
                                },
                            },

                            {
                                name: 'Mesh Multi-Material CPU LOD',
                                path: '3d/lod/MeshCPULOD_material',
                                description: {
                                    ko: '개별 Mesh에서 거리에 따라 지오메트리와 재질을 함께 전환하는 CPU LOD입니다.',
                                    en: 'CPU-driven LOD switching both geometry and material on individual Meshes.'
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
                    }
                ]
            },
            {
                name: 'System & Diagnostics',
                list: [
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
                        name: 'Multi Canvas',
                        list: [
                            {
                                name: 'Multi Canvas',
                                path: '3d/multiCanvas',
                                description: {
                                    ko: '다중 캔버스 RedGPUContext 생성과 개별 소멸 시 격리를 검증합니다.',
                                    en: 'Runs multiple RedGPUContexts and verifies isolated resource destruction.'
                                },
                            }
                        ]
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
                        name: 'Texture Encoding Test',
                        path: 'gltf/basic/textureEncodingTest',
                        description: {
                            ko: 'BaseColor와 Emissive 텍스처의 sRGB 디코딩 샘플링을 검증합니다.',
                            en: 'Verifies sRGB decoding and color space sampling for BaseColor and Emissive.'
                        },
                    },
                    {
                        name: 'Texture Linear Interpolation Test',
                        path: 'gltf/basic/textureLinearInterpolationTest',
                        description: {
                            ko: 'sRGB 디코딩 이후 선형 색공간에서의 텍스처 선형 보간 정확도를 검증합니다.',
                            en: 'Verifies linear texture interpolation after sRGB-to-linear decoding.'
                        },
                    },
                    {
                        name: 'Vertex Color Test',
                        path: 'gltf/basic/vertexColorTest',
                        description: {
                            ko: `뷰어가 정점 색상(COLORS_0 속성)을 올바르게 지원하는지 테스트합니다.`,
                            en: `Tests proper support for vertex colors (COLORS_0 attribute) in the viewer.`
                        },
                    },
                    {
                        name: 'Box Vertex Colors',
                        path: 'gltf/basic/boxVertexColors',
                        description: {
                            ko: `각 면에 정점 색상이 적용된 간단한 박스 모델입니다.`,
                            en: `A simple box model with vertex colors applied to each face.`
                        },
                    },
                    {
                        name: 'Orientation Test',
                        path: 'gltf/basic/orientationTest',
                        description: {
                            ko: `노드의 회전 및 방향(Quaternion) 처리가 올바른지 테스트합니다.`,
                            en: `Tests the correctness of node rotation and orientation (Quaternion) handling.`
                        },
                    },
                    {
                        name: 'Texture Coordinate Test',
                        path: 'gltf/basic/textureCoordinateTest',
                        description: {
                            ko: `XYZ 위치(3D 공간 좌표)와 UV 위치(2D 텍스처 좌표) 간의 관계를 보여줍니다.`,
                            en: `Demonstrates the relationship between XYZ positions and UV texture coordinates.`
                        },
                    },
                    {
                        name: 'Alpha Blend Mode Test',
                        path: 'gltf/basic/alphaBlendModeTest',
                        description: {
                            ko: 'glTF의 알파 블렌드 모드(OPAQUE, BLEND, MASK) 렌더링을 검증합니다.',
                            en: 'Tests glTF alpha rendering modes (OPAQUE, BLEND, and MASK).'
                        },
                    },
                    {
                        name: 'Texture Settings Test',
                        path: 'gltf/basic/textureSettingsTest',
                        description: {
                            ko: `텍스처 샘플링 설정(Wrap 모드, 필터링)을 테스트합니다.`,
                            en: `Tests texture sampling settings (Wrap modes, Filtering).`
                        },
                    },
                    {
                        name: 'Multi UV Test',
                        path: 'gltf/basic/multiUVTest',
                        description: {
                            ko: '단일 재질에서 다중 UV 채널(TEXCOORD_0, 1) 활용을 시연합니다.',
                            en: 'Demonstrates multiple UV channels (TEXCOORD_0 and TEXCOORD_1) on a mesh.'
                        },
                    },

                    {
                        name: 'Metal Rough Spheres',
                        path: 'gltf/basic/metalRoughSpheres',
                        description: {
                            ko: '금속성과 거칠기 단계별 구체 격자로 PBR 재질을 검증합니다.',
                            en: 'Tests PBR shading across a grid of spheres with varying metal/roughness.'
                        },
                    },
                    {
                        name: 'Metal Rough Spheres No Textures',
                        path: 'gltf/basic/metalRoughSpheresNoTextures',
                        description: {
                            ko: '텍스처 없이 수치(Factor) 값만으로 금속성과 거칠기 단계를 테스트합니다.',
                            en: 'Tests Metallic and Roughness using material factors without textures.'
                        },
                    },
                    {
                        name: 'Water Bottle',
                        path: 'gltf/basic/waterBottle',
                        description: {
                            ko: 'Normal, Occlusion, Emissive 맵이 적용된 PBR 물병 모델입니다.',
                            en: 'Standard PBR water bottle model with Normal, Occlusion, and Emissive maps.'
                        },
                    },
                    {
                        name: 'Normal Tangent Test',
                        path: 'gltf/basic/normalTangentTest',
                        description: {
                            ko: `노멀 맵핑과 탄젠트 공간 계산의 정확성을 테스트합니다.`,
                            en: `Tests the accuracy of normal mapping and tangent space calculations.`
                        },
                    },
                    {
                        name: 'Normal Tangent Mirror Test',
                        path: 'gltf/basic/normalTangentMirrorTest',
                        description: {
                            ko: `미러링된 텍스처 좌표에서의 노멀 맵핑 처리를 테스트합니다.`,
                            en: `Tests normal mapping handling with mirrored texture coordinates.`
                        },
                    },
                    {
                        name: 'Negative Scale Test',
                        path: 'gltf/basic/negativeScaleTest',
                        description: {
                            ko: `음수 스케일(반전)이 적용된 노드의 렌더링을 테스트합니다.`,
                            en: `Tests rendering of nodes with negative scale (inversion) applied.`
                        },
                    },

                    {
                        name: 'Environment Test',
                        path: 'gltf/basic/environmentTest',
                        description: {
                            ko: `금속 표면에서의 환경 맵 반사 효과를 테스트합니다.`,
                            en: `Tests environment map reflection effects on metallic surfaces.`
                        },
                    },
                    {
                        name: 'Generate Normal Vector Test',
                        path: 'gltf/basic/generateNormalTest',
                        description: {
                            ko: '노멀 데이터가 없는 모델 로드 시 정점 노멀 자동 생성을 테스트합니다.',
                            en: 'Tests automatic vertex normal generation for models without normal data.'
                        },
                    },
                ]
            },
            {
                name: 'Basic Compare',
                list: [
                    {
                        name: 'Compare Base Color',
                        path: 'gltf/basic/compareBaseColor',
                        description: {
                            ko: `기본 색상(Base Color) 렌더링 결과를 비교합니다.`,
                            en: `Compares Base Color rendering results.`
                        },
                    }, {
                        name: 'Compare Alpha Coverage',
                        path: 'gltf/basic/compareAlphaCoverage',
                        description: {
                            ko: `알파 커버리지(Alpha Coverage) 렌더링 결과를 비교합니다.`,
                            en: `Compares Alpha Coverage rendering results.`
                        },
                    },
                    {
                        name: 'Compare Metallic',
                        path: 'gltf/basic/compareMetallic',
                        description: {
                            ko: `금속성(Metallic) 렌더링 결과를 비교합니다.`,
                            en: `Compares Metallic rendering results.`
                        },
                    },
                    {
                        name: 'Compare Normal',
                        path: 'gltf/basic/compareNormal',
                        description: {
                            ko: `노멀 맵(Normal Map) 렌더링 결과를 비교합니다.`,
                            en: `Compares Normal Map rendering results.`
                        },
                    },
                    {
                        name: 'Compare Roughness',
                        path: 'gltf/basic/compareRoughness',
                        description: {
                            ko: `거칠기(Roughness) 렌더링 결과를 비교합니다.`,
                            en: `Compares Roughness rendering results.`
                        },
                    },
                    {
                        name: 'Compare Ambient Occlusion',
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
                        name: 'Simple Skin',
                        path: 'gltf/animation/simpleSkin',
                        description: {
                            ko: `가장 기본적인 형태의 스키닝(Skinning) 애니메이션 예제입니다.`,
                            en: `The most basic example of skinning animation.`
                        },
                    },
                    {
                        name: 'Simple Morph',
                        path: 'gltf/animation/simpleMorph',
                        description: {
                            ko: `간단한 모프 타겟(Morph Target) 애니메이션 예제입니다.`,
                            en: `Simple Morph Target animation example.`
                        },
                    },
                    {
                        name: 'Rigged Simple',
                        path: 'gltf/animation/riggedSimple',
                        description: {
                            ko: `간단하게 리깅된 원통형 메쉬를 통해 스키닝 동작을 확인합니다.`,
                            en: `Verifies skinning behavior via a simply rigged cylindrical mesh.`
                        },
                    },
                    {
                        name: 'Rigged Figure',
                        path: 'gltf/animation/riggedFigure',
                        description: {
                            ko: `리깅된 인간형 캐릭터 모델의 애니메이션을 테스트합니다.`,
                            en: `Tests animation of a rigged humanoid character model.`
                        },
                    },
                    {
                        name: 'Interpolation Test',
                        path: 'gltf/animation/interpolationTest',
                        description: {
                            ko: '키프레임 보간 방식(Step, Linear, CubicSpline)을 비교합니다.',
                            en: 'Compares animation keyframe interpolation (Step, Linear, CubicSpline).'
                        },
                    },
                    {
                        name: 'Cesium Man & Milk Truck',
                        path: 'gltf/animation/cesiumMan',
                        description: {
                            ko: `스키닝된 CesiumMan과 애니메이션이 적용된 우유 트럭 모델입니다.`,
                            en: `Skinned CesiumMan and animated Milk Truck models.`
                        },
                    },

                    {
                        name: 'Brain Stem',
                        path: 'gltf/animation/brainStem',
                        description: {
                            ko: `복잡한 계층 구조와 스키닝을 가진 BrainStem 모델 애니메이션입니다.`,
                            en: `BrainStem model animation with complex hierarchy and skinning.`
                        },
                    },
                    {
                        name: 'Morph Stress Test',
                        path: 'gltf/animation/morphStressTest',
                        description: {
                            ko: '다수의 활성 정점 속성을 사용하는 모프 타겟 애니메이션 스트레스 테스트입니다.',
                            en: 'Stress-tests morph target animation with up to 18 active attributes.'
                        },
                    },
                    {
                        name: 'Recursive Skeletons',
                        path: 'gltf/animation/recursiveSkeletons',
                        description: {
                            ko: '단일 스켈레톤의 다중 스킨 바인딩 및 메쉬 재사용 스키닝을 테스트합니다.',
                            en: 'Tests multi-skin binding and mesh reuse on a shared skeleton.'
                        },
                    },
                    {
                        name: 'Motion Blending',
                        list: [
                            {
                                name: 'Motion Blending',
                                path: 'gltf/animation/motionBlending',
                                description: {
                                    ko: 'AnimStateMachine으로 Idle·Walk·Run 크로스페이드를 제어합니다.',
                                    en: 'Controls smooth Idle/Walk/Run crossfade blending via AnimStateMachine.'
                                },
                            },
                            {
                                name: 'Keyboard Character Control',
                                path: 'gltf/animation/keyboardCharacterControl',
                                description: {
                                    ko: '키보드 이동 입력에 맞춰 Idle·Walk·Run 모션이 전환되는 캐릭터 컨트롤입니다.',
                                    en: 'Third-person keyboard character control with automatic animation blending.'
                                },
                            },
                        ]
                    },
                    {
                        name: 'Animation Performance Test',
                        list: [
                            {
                                name: 'Medium load Skinning',
                                path: 'gltf/animation/performance/mediumLoadSkinning',
                                description: {
                                    ko: '다수의 관절과 애니메이션 채널을 가진 스키닝 모델의 다중 렌더링 성능 데모입니다.',
                                    en: 'Benchmarks multi-instance skinning with 19 joints and 57 anim channels.'
                                },
                            },
                            {
                                name: 'High vertex load Skinning',
                                path: 'gltf/animation/performance/highVertexLoadSkinning',
                                description: {
                                    ko: '고밀도 정점·관절 스키닝 모델을 다수 렌더링해 스키닝 성능을 벤치마킹합니다.',
                                    en: 'Benchmarks skinning performance with numerous high-vertex skinned models.'
                                },
                            },
                            {
                                name: 'Morph target load Test',
                                path: 'gltf/animation/performance/highMorphTarget',
                                description: {
                                    ko: '수백 개의 모프 타겟 모델을 동시 렌더링해 모프 스키닝 성능을 측정합니다.',


                                    en: 'Benchmarks real-time morph target performance across hundreds of models.'


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
                        name: 'Corset',
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
                            ko: 'Damaged Helmet 등 고해상도 PBR 텍스처가 적용된 쇼케이스 모델입니다.',
                            en: 'Showcases high-resolution PBR helmet models including Damaged Helmet.'
                        },
                    },
                    {
                        name: 'Sponza',
                        path: 'gltf/models/sponza',
                        description: {
                            ko: 'PBR 라이팅과 실시간 그림자 검증에 활용되는 고해상도 Sponza 건축 모델입니다.',
                            en: 'High-resolution Sponza atrium scene for PBR lighting and shadow testing.'
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
                        name: 'A Beautiful Game',
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
                                name: 'Compare Anisotropy',
                                path: 'gltf/gltfExtensions/anisotropy/compareAnisotropy',
                                extensionList: ['KHR_materials_anisotropy'],
                                description: {
                                    ko: `비등방성(Anisotropy)이 있는 렌더링과 없는 렌더링을 비교합니다.`,
                                    en: `Compares rendering with and without anisotropy.`
                                },
                            },
                            {
                                name: 'Anisotropy Disc Test',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyDiscTest',
                                extensionList: ['KHR_materials_anisotropy'],
                                description: {
                                    ko: `원판 형태의 비등방성 하이라이트 회전을 테스트합니다.`,
                                    en: `Tests anisotropic highlight rotation on a disc shape.`
                                },
                            },
                            {
                                name: 'Anisotropy Rotation Test',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyRotationTest',
                                extensionList: ['KHR_materials_anisotropy'],
                                description: {
                                    ko: `비등방성 방향 회전에 따른 렌더링 변화를 테스트합니다.`,
                                    en: `Tests rendering changes based on anisotropy direction rotation.`
                                },
                            },
                            {
                                name: 'Anisotropy Strength Test',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyStrengthTest',
                                extensionList: ['KHR_materials_anisotropy'],
                                description: {
                                    ko: `비등방성 강도(Strength)에 따른 하이라이트 변화를 테스트합니다.`,
                                    en: `Tests highlight changes based on anisotropy strength.`
                                },
                            },
                            {
                                name: 'Anisotropy Barn Lamp',
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
                                name: 'Compare Iridescence',
                                path: 'gltf/gltfExtensions/iridescence/compareIridescence',
                                extensionList: ['KHR_materials_iridescence'],
                                description: {
                                    ko: `무지개빛(Iridescence) 박막 간섭 효과를 비교합니다.`,
                                    en: `Compares Iridescence thin-film interference effects.`
                                },
                            },
                            {
                                name: 'Iridescence Dielectric Spheres',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceDielectricSpheres',
                                extensionList: ['KHR_materials_iridescence', 'KHR_materials_transmission', 'KHR_materials_volume'],
                                description: {
                                    ko: '비금속 유전체 재질의 박막 간섭(Iridescence) 반사를 테스트합니다.',
                                    en: 'Tests KHR_materials_iridescence thin-film effects on dielectric spheres.'
                                },
                            },
                            {
                                name: 'Iridescence Metallic Spheres',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceMetallicSpheres',
                                extensionList: ['KHR_materials_iridescence'],
                                description: {
                                    ko: `금속 구체에 적용된 무지개빛 효과를 테스트합니다.`,
                                    en: `Tests iridescence effects applied to metallic spheres.`
                                },
                            },
                            {
                                name: 'Iridescence Suzanne',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceSuzanne',
                                extensionList: ['KHR_materials_iridescence'],
                                description: {
                                    ko: `Suzanne 모델에 적용된 무지개빛 쉐이더 테스트입니다.`,
                                    en: `Iridescence shader test applied to the Suzanne model.`
                                },
                            },
                            {
                                name: 'Iridescence Lamp',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceLamp',
                                extensionList: ['KHR_materials_iridescence', 'KHR_materials_transmission', 'KHR_materials_volume'],
                                description: {
                                    ko: '투과·볼륨 및 무지개빛 박막 간섭(Iridescence)이 결합된 램프 모델입니다.',
                                    en: 'Wayfair lamp showcasing transmission, volume, and iridescence extensions.'
                                },
                            },
                            {
                                name: 'Sunglasses Khronos',
                                path: 'gltf/gltfExtensions/iridescence/sunglassesKhronos',
                                extensionList: ['KHR_materials_iridescence', 'KHR_materials_transmission'],
                                description: {
                                    ko: `렌즈에 얇은 막 무지개빛 효과가 적용된 선글라스 모델입니다.`,
                                    en: `Sunglasses model with thin-film iridescence effects applied to the lenses.`
                                },
                            },
                            {
                                name: 'Iridescent Dish With Olives',
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
                                name: 'Compare Clearcoat',
                                path: 'gltf/gltfExtensions/clearcoat/compareClearcoat',
                                extensionList: ['KHR_materials_clearcoat'],
                                description: {
                                    ko: `클리어코트(Clearcoat) 재질 렌더링 결과를 비교합니다.`,
                                    en: `Compares Clearcoat material rendering results.`
                                },
                            },
                            {
                                name: 'ClearCoat Test',
                                path: 'gltf/gltfExtensions/clearcoat/clearCoatTest',
                                extensionList: ['KHR_materials_clearcoat'],
                                description: {
                                    ko: `다양한 거칠기와 클리어코트 강도를 테스트합니다.`,
                                    en: `Tests various roughness and clearcoat strengths.`
                                },
                            },
                            {
                                name: 'Clearcoat Wicker',
                                path: 'gltf/gltfExtensions/clearcoat/clearcoatWicker',
                                extensionList: ['KHR_materials_clearcoat'],
                                description: {
                                    ko: `직물 표면 위에 코팅된 클리어코트 효과를 보여주는 위커 모델입니다.`,
                                    en: `Wicker model showing clearcoat effect coated over a woven surface.`
                                },
                            },
                            {
                                name: 'ClearCoat Car Paint',
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
                                name: 'Compare Dispersion',
                                path: 'gltf/gltfExtensions/dispersion/compareDispersion',
                                extensionList: ['KHR_materials_dispersion', 'KHR_materials_transmission'],
                                description: {
                                    ko: `빛의 분산(Dispersion) 효과를 비교합니다.`,
                                    en: `Compares light dispersion effects.`
                                },
                            },
                            {
                                name: 'Dispersion Test',
                                path: 'gltf/gltfExtensions/dispersion/dispersionTest',
                                extensionList: ['KHR_materials_dispersion', 'KHR_materials_transmission'],
                                description: {
                                    ko: `프리즘과 같은 빛의 분산 현상을 테스트합니다.`,
                                    en: `Tests light dispersion phenomena like a prism.`
                                },
                            },
                            {
                                name: 'Dragon Dispersion',
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
                                name: 'Compare Emissive Strength',
                                path: 'gltf/gltfExtensions/emissiveStrength/compareEmissiveStrength',
                                extensionList: ['KHR_materials_emissive_strength'],
                                description: {
                                    ko: `발광(Emissive) 강도 증폭 효과를 비교합니다.`,
                                    en: `Compares Emissive Strength amplification effects.`
                                },
                            },
                            {
                                name: 'Emissive Strength Test',
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
                                name: 'Compare Sheen',
                                path: 'gltf/gltfExtensions/sheen/compareSheen',
                                extensionList: ['KHR_materials_sheen'],
                                description: {
                                    ko: `직물 등의 미세한 반사광(Sheen) 효과를 비교합니다.`,
                                    en: `Compares Sheen effects seen on fabrics etc.`
                                },
                            },
                            {
                                name: 'Sheen Test Grid',
                                path: 'gltf/gltfExtensions/sheen/sheenTestGrid',
                                extensionList: ['KHR_materials_sheen'],
                                description: {
                                    ko: `Sheen 색상과 거칠기에 따른 변화를 그리드로 테스트합니다.`,
                                    en: `Tests changes based on Sheen color and roughness in a grid.`
                                },
                            },
                            {
                                name: 'Sheen Cloth',
                                path: 'gltf/gltfExtensions/sheen/sheenCloth',
                                extensionList: ['KHR_materials_sheen'],
                                description: {
                                    ko: `Sheen 효과를 보여주는 직물 예제입니다.`,
                                    en: `A fabric example showcasing sheen.`
                                },
                            },
                            {
                                name: 'Sheen Chair',
                                path: 'gltf/gltfExtensions/sheen/sheenChair',
                                extensionList: ['KHR_materials_sheen', 'KHR_materials_variants'],
                                description: {
                                    ko: `재질 변형(Variant)과 Sheen 효과를 보여주는 의자 모델입니다.`,
                                    en: `A chair model demonstrating material variants and sheen.`
                                },
                            },
                            {
                                name: 'Glam Velvet Sofa',
                                path: 'gltf/gltfExtensions/sheen/glamVelvetSofa',
                                extensionList: ['KHR_materials_sheen', 'KHR_materials_specular', 'KHR_materials_variants'],
                                description: {
                                    ko: `고급 벨벳 소파의 질감을 표현하는 Sheen 모델입니다.`,
                                    en: `Sheen model expressing the texture of a luxury velvet sofa.`
                                },
                            },
                            {
                                name: 'Chair Damask Purplegold',
                                path: 'gltf/gltfExtensions/sheen/chairDamaskPurplegold',
                                extensionList: ['KHR_materials_sheen'],
                                description: {
                                    ko: `다마스크 패턴 의자의 직물 느낌을 표현합니다.`,
                                    en: `Expresses the fabric feel of a damask pattern chair.`
                                },
                            },
                            {
                                name: 'Sheen Wood Leather Sofa',
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
                                name: 'Compare Specular',
                                path: 'gltf/gltfExtensions/specular/compareSpecular',
                                extensionList: ['KHR_materials_specular'],
                                description: {
                                    ko: `스펙큘러(Specular) 반사 강도 및 색상 제어를 비교합니다.`,
                                    en: `Compares Specular reflection strength and color control.`
                                },
                            },
                            {
                                name: 'Specular Test',
                                path: 'gltf/gltfExtensions/specular/specularTest',
                                extensionList: ['KHR_materials_specular'],
                                description: {
                                    ko: `유전체 재질의 스펙큘러 하이라이트 조절을 테스트합니다.`,
                                    en: `Tests specular highlight adjustments on dielectric materials.`
                                },
                            },
                            {
                                name: 'Specular Silk Pouf',
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
                                name: 'Unlit Test',
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
                                name: 'Texture Transform Test',
                                path: 'gltf/gltfExtensions/textureTransform/textureTransformTest',
                                extensionList: ['KHR_texture_transform'],
                                description: {
                                    ko: 'KHR_texture_transform 기반의 UV 스케일·회전·이동을 검증합니다.',
                                    en: 'Tests UV scaling, rotation, and offset via KHR_texture_transform.'
                                },
                            },
                            {
                                name: 'Texture Transform Multi Test',
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
                                name: 'Diffuse Transmission Test',
                                path: 'gltf/gltfExtensions/diffuseTransmission/diffuseTransmissionTest',
                                extensionList: ['KHR_materials_diffuseTransmission'],
                                description: {
                                    ko: `반투명한 물체의 확산 투과(Diffuse Transmission) 효과를 테스트합니다.`,
                                    en: `Tests Diffuse Transmission effects on translucent objects.`
                                },
                            },
                            {
                                name: 'Diffuse Transmission Teacup',
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
                                name: 'Compare Transmission',
                                path: 'gltf/gltfExtensions/transmission/compareTransmission',
                                extensionList: ['KHR_materials_transmission'],
                                description: {
                                    ko: `투명한 물체의 투과(Transmission) 렌더링을 비교합니다.`,
                                    en: `Compares Transmission rendering of transparent objects.`
                                },
                            },
                            {
                                name: 'Transmission Test',
                                path: 'gltf/gltfExtensions/transmission/transmissionTest',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_ior'],
                                description: {
                                    ko: `다양한 투과율과 거칠기에 따른 굴절 효과를 테스트합니다.`,
                                    en: `Tests refraction effects based on various transmission rates and roughness.`
                                },
                            },
                            {
                                name: 'Transmission Roughness Test',
                                path: 'gltf/gltfExtensions/transmission/transmissionRoughnessTest',
                                extensionList: ['KHR_materials_transmission'],
                                description: {
                                    ko: `거친 표면을 가진 투명 재질의 흐림 효과를 테스트합니다.`,
                                    en: `Tests blurring effects on transparent materials with rough surfaces.`
                                },
                            },
                            {
                                name: 'Transmission Order Test',
                                path: 'gltf/gltfExtensions/transmission/transmissionOrderTest',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume', 'KHR_materials_ior'],
                                description: {
                                    ko: '다중 투과(Transmission) 및 반투명 객체 중첩 시의 정렬 순서를 검증합니다.',
                                    en: 'Tests depth sorting order across overlapping transmissive objects.'
                                },
                            },
                            {
                                name: 'Transmission Thinwall Test Grid',
                                path: 'gltf/gltfExtensions/transmission/transmissionThinwallTestGrid',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume'],
                                description: {
                                    ko: `얇은 벽(Thin-walled) 옵션 활성화 여부에 따른 투과 차이를 테스트합니다.`,
                                    en: `Tests transmission differences based on Thin-walled option activation.`
                                },
                            },
                            {
                                name: 'Stained Glass Lamp',
                                path: 'gltf/gltfExtensions/transmission/stainedGlassLamp',
                                extensionList: ['KHR_materials_transmission'],
                                description: {
                                    ko: `스테인드글라스 램프를 통해 색상이 있는 투과광을 보여줍니다.`,
                                    en: `Shows colored transmitted light through a stained glass lamp.`
                                },
                            },
                            {
                                name: 'Chronograph Watch',
                                path: 'gltf/gltfExtensions/transmission/chronographWatch',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_variants'],
                                description: {
                                    ko: `시계 유리의 투명도와 내부 디테일을 보여주는 고품질 모델입니다.`,
                                    en: `High-quality model showing watch glass transparency and internal details.`
                                },
                            },
                            {
                                name: 'Mosquito In Amber',
                                path: 'gltf/gltfExtensions/transmission/mosquitoInAmber',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume', 'KHR_materials_ior'],
                                description: {
                                    ko: '호박 속 모기 모델로 투과, 굴절률(IOR), 볼륨 감쇠를 시연합니다.',
                                    en: 'Showcases transmission, IOR, and volume attenuation with amber material.'
                                },
                            },
                            {
                                name: 'Commercial Refrigerator',
                                path: 'gltf/gltfExtensions/transmission/commercialRefrigerator',
                                extensionList: ['KHR_materials_transmission'],
                                description: {
                                    ko: `유리 문을 가진 상업용 냉장고 모델입니다.`,
                                    en: `Commercial refrigerator model with glass doors.`
                                },
                            },
                            {
                                name: 'Glass Broken Window',
                                path: 'gltf/gltfExtensions/transmission/glassBrokenWindow',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume', 'KHR_materials_ior'],
                                description: {
                                    ko: `깨진 유리창의 두께감과 굴절을 표현합니다.`,
                                    en: `Expresses the thickness and refraction of a broken window.`
                                },
                            },
                        ]
                    },
                    {
                        name: 'KHR_materials_volume',
                        list: [
                            {
                                name: 'Compare IOR',
                                path: 'gltf/gltfExtensions/volume/compareIor',
                                extensionList: ['KHR_materials_ior'],
                                description: {
                                    ko: `굴절률(IOR)에 따른 빛의 굴절 차이를 비교합니다.`,
                                    en: `Compares light refraction differences based on Index of Refraction (IOR).`
                                },
                            },
                            {
                                name: 'IOR Test Grid',
                                path: 'gltf/gltfExtensions/volume/IORTestGrid',
                                extensionList: ['KHR_materials_ior'],
                                description: {
                                    ko: `다양한 IOR 값에 따른 굴절 변화를 그리드로 테스트합니다.`,
                                    en: `Tests refraction changes based on various IOR values in a grid.`
                                },
                            },
                            {
                                name: 'Compare Volume',
                                path: 'gltf/gltfExtensions/volume/compareVolume',
                                extensionList: ['KHR_materials_volume'],
                                description: {
                                    ko: `볼륨(Volume) 흡수 및 산란 효과를 비교합니다.`,
                                    en: `Compares Volume absorption and scattering effects.`
                                },
                            },
                            {
                                name: 'Attenuation Test',
                                path: 'gltf/gltfExtensions/volume/attenuationTest',
                                extensionList: ['KHR_materials_volume'],
                                description: {
                                    ko: `빛이 매질을 통과할 때의 감쇠(Attenuation) 거리와 색상을 테스트합니다.`,
                                    en: `Tests attenuation distance and color as light passes through a medium.`
                                },
                            },
                            {
                                name: 'Glass Vase Flowers',
                                path: 'gltf/gltfExtensions/volume/glassVaseFlowers',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume', 'KHR_materials_ior'],
                                description: {
                                    ko: `유리 꽃병과 물의 볼륨 효과를 보여주는 모델입니다.`,
                                    en: `Model showing volume effects of a glass vase and water.`
                                },
                            },
                            {
                                name: 'Glass Hurricane Candle Holder',
                                path: 'gltf/gltfExtensions/volume/glassHurricaneCandleHolder',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume', 'KHR_materials_ior'],
                                description: {
                                    ko: `복잡한 유리 형태의 굴절과 반사를 보여주는 캔들 홀더입니다.`,
                                    en: `Candle holder showing refraction and reflection of complex glass shapes.`
                                },
                            },
                            {
                                name: 'Dragon Attenuation',
                                path: 'gltf/gltfExtensions/volume/dragonAttenuation',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume'],
                                description: {
                                    ko: '투과(Transmission)와 볼륨 감쇠로 두꺼운 색유리 재질을 표현합니다.',
                                    en: 'Renders colored glass attenuation using transmission and volume extensions.'
                                },
                            },
                            {
                                name: 'USD Shader Ball',
                                path: 'gltf/gltfExtensions/volume/usdShaderBallForGltf',
                                extensionList: ['KHR_materials_transmission', 'KHR_materials_volume'],
                                description: {
                                    ko: '투과와 볼륨 등 고급 PBR 재질 속성을 검증하는 표준 USD 셰이더 볼입니다.',
                                    en: 'Standard USD Shader Ball showcasing transmission and volume PBR properties.'
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
                name: 'BuiltInEffect',
                list: [
                    {
                        name: 'Screen Space',
                        list: [
                            {
                                name: 'SSAO',
                                path: 'postEffect/builtIn/screenSpace/ssao',
                                description: {
                                    ko: `화면 공간 앰비언트 오클루전(SSAO) 효과를 시연하는 예제입니다.`,
                                    en: `An example demonstrating Screen Space Ambient Occlusion (SSAO) effects.`
                                }
                            },
                            {
                                experimental: true,
                                name: 'SSR',
                                path: 'postEffect/builtIn/screenSpace/ssr',
                                description: {
                                    ko: `화면 공간 반사(SSR) 효과를 시연하는 예제입니다.`,
                                    en: `An example demonstrating Screen Space Reflection (SSR) effects.`
                                }
                            },
                        ]
                    },
                    {
                        name: 'Fog',
                        list: [
                            {
                                name: 'Fog',
                                path: 'postEffect/builtIn/fog/fog',
                                description: {
                                    ko: `안개 효과를 시연하는 예제입니다.`,
                                    en: `An example demonstrating fog effects.`
                                }
                            },
                            {
                                name: 'Height Fog',
                                path: 'postEffect/builtIn/fog/heightFog',
                                description: {
                                    ko: `높이 기반 안개 효과를 시연하는 예제입니다.`,
                                    en: `An example demonstrating height-based fog effects.`
                                }
                            }
                        ]
                    },
                    {
                        name: 'Camera & Lens',
                        list: [
                            {
                                name: 'Auto Exposure',
                                path: 'postEffect/builtIn/lens/autoExposure',
                                description: {
                                    ko: `히스토그램 기반 자동 노출(AutoExposure)과 명암 순응 효과를 시연합니다.`,
                                    en: `Demonstrates histogram-based AutoExposure and eye adaptation effects.`
                                }
                            },
                            {
                                name: 'Depth of Field',
                                path: 'postEffect/builtIn/lens/dof',
                                description: {
                                    ko: '물리 기반 렌즈 설정과 다각형 보케 및 렌즈 프리셋을 지원하는 DOF 예제입니다.',
                                    en: 'Physically-based Depth of Field with polygonal bokeh and lens presets.'
                                }
                            },
                            {
                                name: 'Depth of Field (Auto Focus)',
                                path: 'postEffect/builtIn/lens/dofAutoFocus',
                                description: {
                                    ko: '화면 중앙 9-Point Zone 피사체 거리를 감지해 초점을 자동 추적합니다.',
                                    en: 'Continuous Auto-Focus tracking subject distance via 9-Point Zone metering.'
                                },
                            },
                            {
                                name: 'Bloom',
                                path: 'postEffect/builtIn/lens/bloom',
                                description: {
                                    ko: `물리 기반 HDR 다단 Mip-Chain 블룸 효과를 시연하는 예제입니다.`,
                                    en: `An example demonstrating physically-based HDR Mip-Chain Bloom effects.`
                                },
                            },
                            {
                                name: 'Lens Flare (SkyAtmosphere)',
                                path: 'postEffect/builtIn/lens/lensFlareSkyAtmosphere',
                                description: {
                                    ko: '대기 산란 태양광과 HDR 하이라이트 기반의 하이브리드 렌즈 플레어 예제입니다.',
                                    en: 'Hybrid Lens Flare with sun occlusion, bokeh ghosts, and streaks in SkyAtmosphere.'
                                },
                            },
                            {
                                name: 'Lens Flare (SkyBox)',
                                path: 'postEffect/builtIn/lens/lensFlareSkyBox',
                                description: {
                                    ko: '일반 HDR IBL 스카이박스 및 PBR 환경에서 동작하는 렌즈 플레어 예제입니다.',
                                    en: 'Demonstrates Lens Flare in a standard HDR IBL SkyBox and PBR environment.'
                                },
                            },
                            {
                                name: 'Chromatic Aberration',
                                path: 'postEffect/builtIn/lens/chromaticAberration',
                                description: {
                                    ko: `색수차 효과 예제입니다.`,
                                    en: `Example of Chromatic Aberration effect.`
                                }
                            },
                            {
                                name: 'Lens Distortion',
                                path: 'postEffect/builtIn/lens/lensDistortion',
                                description: {
                                    ko: `렌즈 왜곡 효과 예제입니다.`,
                                    en: `Example of Lens Distortion effect.`
                                }
                            },
                            {
                                name: 'Vignetting',
                                path: 'postEffect/builtIn/lens/vignetting',
                                description: {
                                    ko: `비네팅 효과 예제입니다.`,
                                    en: `Example of Vignetting effect.`
                                },
                            },
                            {
                                name: 'Film Grain',
                                path: 'postEffect/builtIn/lens/filmGrain',
                                description: {
                                    ko: `필름 그레인 효과를 시연하는 예제입니다.`,
                                    en: `An example demonstrating film grain effects.`
                                },
                            }
                        ]
                    }
                ]
            },
            {
                name: 'PostEffect',
                list: [
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
                                name: 'Color Balance',
                                path: 'postEffect/adjustments/colorBalance',
                                description: {
                                    ko: `컬러 밸런스 색상 보정 효과 예제입니다.`,
                                    en: `Example of Color Balance color adjustment effect.`
                                },
                            },
                            {
                                name: 'Color Temperature Tint',
                                path: 'postEffect/adjustments/colorTemperatureTint',
                                description: {
                                    ko: `색온도 및 틴트 색상 보정 효과 예제입니다.`,
                                    en: `Example of Color Temperature & Tint color adjustment effect.`
                                },
                            },
                            {
                                name: 'Brightness Contrast',
                                path: 'postEffect/adjustments/brightnessContrast',
                                description: {
                                    ko: `밝기 및 대비 색상 보정 효과 예제입니다.`,
                                    en: `Example of Brightness & Contrast color adjustment effect.`
                                },
                            },
                            {
                                name: 'Hue Saturation',
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
                                name: 'Blur X',
                                path: 'postEffect/blur/blurX',
                                description: {
                                    ko: `가로 방향 블러 효과 예제입니다.`,
                                    en: `Example of Horizontal Blur effect.`
                                },
                            },
                            {
                                name: 'Blur Y',
                                path: 'postEffect/blur/blurY',
                                description: {
                                    ko: `세로 방향 블러 효과 예제입니다.`,
                                    en: `Example of Vertical Blur effect.`
                                },
                            },
                            {
                                name: 'Directional Blur',
                                path: 'postEffect/blur/directionalBlur',
                                description: {
                                    ko: `방향성 블러 효과 예제입니다.`,
                                    en: `Example of Directional Blur effect.`
                                },
                            },
                            {
                                name: 'Gaussian Blur',
                                path: 'postEffect/blur/gaussianBlur',
                                description: {
                                    ko: `가우시안 블러 효과 예제입니다.`,
                                    en: `Example of Gaussian Blur effect.`
                                },
                            },
                            {
                                name: 'Radial Blur',
                                path: 'postEffect/blur/radialBlur',
                                description: {
                                    ko: `방사형 블러 효과 예제입니다.`,
                                    en: `Example of Radial Blur effect.`
                                },
                            },
                            {
                                name: 'Zoom Blur',
                                path: 'postEffect/blur/zoomBlur',
                                description: {
                                    ko: `줌 블러 효과 예제입니다.`,
                                    en: `Example of Zoom Blur effect.`
                                },
                            },
                        ]
                    },
                    {
                        name: 'Image Filters',
                        list: [
                            {
                                name: 'Sharpen',
                                path: 'postEffect/sharpen',
                                description: {
                                    ko: `선명도(Sharpen) 효과를 시연하는 예제입니다.`,
                                    en: `An example demonstrating sharpen effects.`
                                },
                            },
                            {
                                name: 'Convolution',
                                path: 'postEffect/convolution',
                                description: {
                                    ko: `컨볼루션 필터 효과를 시연하는 예제입니다.`,
                                    en: `An example demonstrating convolution filter effects.`
                                },
                            }
                        ]
                    }
                ]
            },
        ],
    },

    {
        name: '2D',
        list: [
            {
                name: 'Core & Setup',
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
                    }
                ]
            },
            {
                name: 'Display Objects',
                list: [
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
                ]
            },
            {
                name: 'Style & Blending',
                list: [
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
                                    ko: 'keyboardKeyBuffer를 사용해 2D 객체를 키보드로 이동·제어합니다.',
                                    en: 'Controls 2D objects via per-frame keyboard polling with keyboardKeyBuffer.'
                                },
                            }
                        ]
                    },
                ]
            },
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
                            ko: 'Box, Sphere, Cylinder, Capsule 충돌체를 테스트합니다.',
                            en: 'Tests Box, Sphere, Cylinder, and Capsule colliders with friction and bounce.'
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
                            ko: '높이맵(HeightField) 데이터를 기반으로 굴곡진 지형의 물리 충돌을 구현합니다.',
                            en: 'Implements terrain surface physics collisions using HeightField data.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'GLTF Physics',
                        path: 'physics/gltfPhysics',
                        description: {
                            ko: '로드된 glTF 메쉬 계층을 분석해 정밀 물리 충돌체를 자동 생성합니다.',
                            en: 'Automatically generates physics colliders from a loaded glTF mesh hierarchy.'
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
                            ko: '마우스 클릭 광선으로 물리 객체를 검출하고 충격량을 가해 밀어냅니다.',
                            en: 'Detects physics bodies via mouse raycasting and applies push impulses.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Collision Events',
                        path: 'physics/collisionEvents',
                        description: {
                            ko: '강체 간 물리 충돌 이벤트를 감지해 실시간으로 색상을 변경합니다.',
                            en: 'Detects rigid-body collision events and updates object colors in real time.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Triggers & Sensors',
                        path: 'physics/triggers',
                        description: {
                            ko: '물리적 반발 없이 영역 진입만 감지하는 트리거 센서(Trigger) 예제입니다.',
                            en: 'Detects volume entry without physical collision response using Triggers.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Collision Filtering',
                        path: 'physics/collisionFiltering',
                        description: {
                            ko: '비트마스크 충돌 그룹을 설정해 특정 그룹 간에만 선택적으로 충돌시킵니다.',
                            en: 'Filters collisions between specific object groups using bitmask rules.'
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
                            ko: '물리 관절(Joint)로 강체들을 연결해 체인과 진자 운동을 구현합니다.',
                            en: 'Connects rigid bodies with physics joints to simulate chains and pendulums.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Revolute Joints & Motors',
                        path: 'physics/revoluteJoint',
                        description: {
                            ko: '단일 축 회전 관절(Revolute Joint)과 모터로 회전 장치를 구현합니다.',
                            en: 'Simulates motorized rotating mechanisms using Revolute Joints.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Prismatic Joints & Sliders',
                        path: 'physics/prismaticJoint',
                        description: {
                            ko: '직선 왕복 관절(Prismatic Joint)로 슬라이더 및 승강기 운동을 구현합니다.',
                            en: 'Simulates linear sliding mechanisms and elevators using Prismatic Joints.'
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
                            ko: '여러 기본 충돌체를 결합해 단일 복합 형상(Compound) 강체를 구성합니다.',
                            en: 'Combines multiple primitive shapes into a single compound rigid body.'
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
                            ko: '접촉한 물체에 일정 방향 속도를 전달하는 컨베이어 벨트 물리 예제입니다.',
                            en: 'Simulates conveyor belts applying surface velocity to contacting bodies.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Buoyancy Basics',
                        path: 'physics/buoyancy',
                        description: {
                            ko: '침수 깊이에 비례하는 부력과 유체 저항으로 물에 뜨는 물체를 시뮬레이션합니다.',
                            en: 'Simulates floating bodies using depth-based buoyancy and fluid drag.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Ragdoll System',
                        path: 'physics/ragdoll',
                        description: {
                            ko: '인간형 뼈대를 관절로 연결해 중력에 반응하는 래그돌 물리를 시뮬레이션합니다.',
                            en: 'Simulates articulated humanoid ragdoll physics falling under gravity.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Character Controller',
                        path: 'physics/characterController',
                        description: {
                            ko: '캡슐 충돌체와 glTF 캐릭터 애니메이션을 결합한 지면·계단 보행 예제입니다.',
                            en: 'Capsule character controller with glTF animation for walking and stairs.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Advanced Character Controller',
                        path: 'physics/advancedCharacterController',
                        description: {
                            ko: '관성 이동, 공중 제어, 이단 점프를 지원하는 고급 캐릭터 컨트롤러입니다.',
                            en: 'Advanced character controller featuring inertia, air control, and double jump.'
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
                            ko: '수많은 구슬이 핀 사이로 낙하하며 정규분포를 형성하는 갈톤 보드입니다.',
                            en: 'Galton board simulation showing falling balls forming a bell curve.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Physics Bowling',
                        path: 'physics/bowling',
                        description: {
                            ko: '연속 충돌 감지(CCD)를 적용해 고속 볼링공과 핀의 충돌을 시뮬레이션합니다.',
                            en: 'High-speed bowling simulation using Continuous Collision Detection (CCD).'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Impulse Explosion',
                        path: 'physics/explosion',
                        description: {
                            ko: '폭발 중심으로부터 주변 강체들에 방사형 충격량을 가하는 물리 예제입니다.',
                            en: 'Applies radial explosion impulses to blast away surrounding rigid bodies.'
                        },
                    },
                    {
                        experimental: true,
                        name: 'Ultimate Stress Test',
                        path: 'physics/stressTest',
                        description: {
                            ko: '수천 개의 물리 객체를 동시 시뮬레이션하며 휴면(Sleep) 최적화를 검증합니다.',
                            en: 'Stress-tests thousands of rigid bodies with Sleep mode optimization.'
                        },
                    },
                ]
            },
        ]
    }
]
Object.freeze(ExampleList);
export default ExampleList;