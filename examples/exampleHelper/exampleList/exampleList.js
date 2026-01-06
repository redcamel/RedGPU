const ExampleList = [

    {
        name: '3D',
        list: [
            {
                name: 'Hello RedGPU',
                path: '3d/helloWorld',
                thumb: '3d/helloWorld/thumb.png',
                description: {
                    ko: ``,
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
                            ko: ``,
                            en: `This example is a sample for a View object in RedGPU.
                It provides real-time testing of the basic options provided to a View object.`

                        },
                    },
                    {
                        name: 'Multi View3D',
                        path: '3d/view/multiView',
                        thumb: '3d/view/multiView/thumb.png',
                        description: {
                            ko: ``,
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
                        thumb: '3d/scene/thumb.png',
                        description: {
                            ko: ``,
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
				        thumb: '3d/controller/freeController/thumb.png',
				        description: {
					        ko: ``,
					        en: `FreeController provides first-person camera control with keyboard (WASD/QERTFG) and mouse/touch input.<br/>Features include free movement in 3D space, rotation control, customizable speed/acceleration, and key binding configuration.`
				        },
			        },
			        {
				        name: 'OrbitController',
				        path: '3d/controller/orbitController',
				        thumb: '3d/controller/orbitController/thumb.png',
				        description: {
					        ko: ``,
					        en: `OrbitController provides orbital camera control that rotates around a center point.<br/>Features include mouse drag rotation, wheel zoom, touch pinch zoom, customizable center position, distance control, and pan/tilt limits.`
				        },
			        },
			        {
				        name: 'FollowController',
				        path: '3d/controller/followController',
				        thumb: '3d/controller/followController/thumb.png',
				        description: {
					        ko: ``,
					        en: `FollowController provides third-person camera control that follows a target mesh.<br/> Features include smooth camera following, customizable distance and height, pan/tilt control, target rotation tracking, and wheel/pinch zoom.<br/>Perfect for third-person games and object tracking scenarios.`
				        },
			        },
			        {
				        name: 'IsometricController',
				        path: '3d/controller/isometricController',
				        thumb: '3d/controller/isometricController/thumb.png',
				        description: {
					        ko: ``,
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
                        thumb: '3d/primitive/primitives/thumb.png',
                        description: {
                            ko: ``,
                            en: `Samples of basic primitive geometries supported by RedGPU.`

                        },
                    },
                    {
                        name: 'Box',
                        path: '3d/primitive/box',
                        thumb: '3d/primitive/box/thumb.png',
                        description: {
                            ko: ``,
                            en: `Samples for the basic Box Primitives supported by RedGPU. Provides real-time testing of Box configuration options.`

                        },
                    },
                    {
                        name: 'Circle',
                        path: '3d/primitive/circle',
                        thumb: '3d/primitive/circle/thumb.png',
                        description: {
                            ko: ``,
                            en: `Samples for the basic Circle Primitives supported by RedGPU. Provides real-time testing of Circle configuration options.`

                        },
                    },
                    {
                        name: 'Cylinder',
                        path: '3d/primitive/cylinder',
                        thumb: '3d/primitive/cylinder/thumb.png',
                        description: {
                            ko: ``,
                            en: `Samples for the basic Cylinder Primitives supported by RedGPU. Provides real-time testing of Cylinder configuration options.`

                        },
                    },
                    {
                        name: 'Plane',
                        path: '3d/primitive/plane',
                        thumb: '3d/primitive/plane/thumb.png',
                        description: {
                            ko: ``,
                            en: `Samples for the basic Plane Primitives supported by RedGPU. Provides real-time testing of Plane configuration options.`

                        },
                    },
                    {
                        name: 'Ground',
                        path: '3d/primitive/ground',
                        thumb: '3d/primitive/ground/thumb.png',
                        description: {
                            ko: ``,
                            en: `Samples for the basic Ground Primitives supported by RedGPU. Provides real-time testing of Ground configuration options.`

                        },
                    },
                    {
                        name: 'Sphere',
                        path: '3d/primitive/sphere',
                        thumb: '3d/primitive/sphere/thumb.png',
                        description: {
                            ko: ``,
                            en: `Samples for the basic Sphere Primitives supported by RedGPU. Provides real-time testing of Sphere configuration options.`

                        },
                    },
                    {
                        name: 'Torus',
                        path: '3d/primitive/torus',
                        thumb: '3d/primitive/torus/thumb.png',
                        description: {
                            ko: ``,
                            en: `Samples for the basic Torus Primitives supported by RedGPU. Provides real-time testing of Torus configuration options.`

                        },
                    },
                    {
                        name: 'TorusKnot',
                        path: '3d/primitive/torusNut',
                        thumb: '3d/primitive/torusNut/thumb.png',
                        description: {
                            ko: ``,
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
                            ko: ``,
                            en: `this code is a sample that shows how to create a basic mesh and how to manipulate its main properties (position, scale, rotation, material, etc.) in real time. <br/>This example shows how to create a Box mesh using RedGPU and how to adjust its properties and material.`
                        },
                    },
                    {
                        name: 'Hierarchy Mesh',
                        path: '3d/mesh/hierarchy',
                        thumb: '3d/mesh/hierarchy/thumb.png',
                        description: {
                            ko: ``,
                            en: `An example of creating a parent-child mesh hierarchy using RedGPU, and manipulating its position, rotation, and scale.`
                        },
                    },
                    {
                        name: 'Pivot Mesh',
                        path: '3d/mesh/pivot',
                        thumb: '3d/mesh/pivot/thumb.png',
                        description: {
                            ko: ``,
                            en: `A hands-on example that demonstrates how to create parent and child meshes using RedGPU and change the center of rotation via pivot settings.`
                        },
                    },
                    {
                        name: 'Child Methods',
                        path: '3d/mesh/childMethod',
                        thumb: '3d/mesh/childMethod/thumb.png',
                        description: {
                            ko: ``,
                            en: `An example of child node management using RedGPU, showing how to dynamically control nodes by adding, deleting, changing index, replacing, and randomizing color of children.`
                        },
                    },
                    {
                        name: 'lookAt Methods',
                        path: '3d/mesh/lookAt',
                        thumb: '3d/mesh/lookAt/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },

                    {
                        name: 'BoundingBox',
                        list: [
                            {
                                name: 'BoundingBox',
                                path: '3d/mesh/boundBox/meshBoundBox',
                                thumb: '3d/mesh/boundBox/meshBoundBox/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'AABB - intersects',
                                path: '3d/mesh/boundBox/meshAABBIntersects',
                                thumb: '3d/mesh/boundBox/meshAABBIntersects/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'OBB - intersects',
                                path: '3d/mesh/boundBox/meshOBBIntersects',
                                thumb: '3d/mesh/boundBox/meshOBBIntersects/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
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
                        thumb: '3d/coordinateTransformation/worldToLocal/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'screenToWorld',
                        path: '3d/coordinateTransformation/screenToWorld',
                        thumb: '3d/coordinateTransformation/screenToWorld/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
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
                            ko: ``,
                            en: `Provides real-time samples of the basic color manipulations of RedGPU's ColorMaterial and convenience methods for setting colors.`
                        },
                    },
                    {
                        name: 'BitmapMaterial',
                        path: '3d/material/bitmapMaterial',
                        thumb: '3d/material/bitmapMaterial/thumb.png',
                        description: {
                            ko: ``,
                            en: `RedGPU's BitmapMaterial sample allows you to test texture changes in real time by applying various texture formats (PNG, JPG, WEBP, SVG).`
                        },
                    },
                    {
                        name: 'PhongMaterial',
                        path: '3d/material/phongMaterial',
                        thumb: '3d/material/phongMaterial/thumb.png',
                        description: {
                            ko: ``,
                            en: `A sample example that demonstrates how to manipulate the basic properties of PhongMaterial using RedGPU and experiment with different texture combinations.`
                        },
                    },
                    {
                        name: 'PhongMaterial Texture Combination',
                        path: '3d/material/phongMaterialTextures',
                        thumb: '3d/material/phongMaterialTextures/thumb.png',
                        description: {
                            ko: ``,
                            en: `A sample example that visually demonstrates different texture combinations and effects of PhongMaterial using RedGPU.`
                        },
                    },
                    {
                        name: 'Material Opacity',
                        path: '3d/material/opacity',
                        thumb: '3d/material/opacity/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'Fragment Variant Test',
                        path: '3d/material/fragmentVariantTest',
                        thumb: '3d/material/fragmentVariantTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
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
                            ko: ` `,
                            en: `A sample that demonstrates texture sampler options and mipmap support.`
                        },
                    },
                    {
                        name: 'Sampler Combination',
                        path: '3d/texture/samplerCombination',
                        thumb: '3d/texture/samplerCombination/thumb.png',
                        description: {
                            ko: ``,
                            en: `Here's an example showing the different combinations of texture samplers at a glance.`
                        },
                    },
                    {
                        name: 'Sampler SamplerAddressMode',
                        path: '3d/texture/samplerAddressMode',
                        thumb: '3d/texture/samplerAddressMode/thumb.png',
                        description: {
                            ko: ``,
                            en: `An example showing combinations of AddressMode options for a texture sampler.`
                        },
                    },
                    {
                        name: 'MaxAnisotropy',
                        path: '3d/texture/maxAnisotropy',
                        thumb: '3d/texture/maxAnisotropy/thumb.png',
                        description: {
                            ko: ``,
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
                                thumb: '3d/skybox/skybox/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'Skybox using HDRTexture',
                                path: '3d/skybox/skyboxWithHDRTexture',
                                thumb: '3d/skybox/skyboxWithHDRTexture/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'Skybox transition',
                                list: [
                                    {
                                        name: 'Basic transition',
                                        path: '3d/skybox/transition/skyboxTransition',
                                        thumb: '3d/skybox/transition/skyboxTransition/thumb.png',
                                        description: {
                                            ko: ``,
                                            en: ``
                                        },
                                    },
                                    {
                                        name: 'transitionAlphaTexture - with NoiseTexture',
                                        path: '3d/skybox/transition/skyboxTransitionWithNoiseTexture',
                                        thumb: '3d/skybox/transition/skyboxTransitionWithNoiseTexture/thumb.png',
                                        description: {
                                            ko: ``,
                                            en: ``
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
                                path: '3d/skybox/skyboxWithIbl',
                                thumb: '3d/skybox/skyboxWithIbl/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'IBL Test',
                                path: '3d/skybox/iblTest',
                                thumb: '3d/skybox/iblTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'Custom IBL Texture Size',
                                path: '3d/skybox/iblTextureSize',
                                thumb: '3d/skybox/iblTextureSize/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
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
                                thumb: '3d/frustumCulling/frustumCulling/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'DistanceCulling',
                                path: '3d/frustumCulling/distanceCulling',
                                thumb: '3d/frustumCulling/distanceCulling/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
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
                        thumb: '3d/drawDebugger/basic/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
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
                        thumb: '3d/transparentSort/thumb.png',
                        description: {
                            ko: ``,
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
                                thumb: '3d/noiseTexture/simplex/basic/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                experimental: true,
                                name: 'Custom SimplexTexture - Fire',
                                path: '3d/noiseTexture/simplex/fire/',
                                thumb: '3d/noiseTexture/simplex/fire/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                experimental: true,
                                name: 'Custom SimplexTexture - Displacement',
                                path: '3d/noiseTexture/simplex/displacement/',
                                thumb: '3d/noiseTexture/simplex/displacement/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
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
                                thumb: '3d/noiseTexture/voronoi/basic/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
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
                        thumb: '3d/sprite/sprite3D/thumb.png',
                        description: {
                            ko: ``,
                            en: `example of a Sprite3D object.`
                        },
                    },
                    {
                        name: 'SpriteSheet3D',
                        path: '3d/sprite/spriteSheet3D',
                        thumb: '3d/sprite/spriteSheet3D/thumb.png',
                        description: {
                            ko: ``,
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
                            ko: ``,
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
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'PointLight',
                        path: '3d/light/pointLight',
                        thumb: '3d/light/pointLight/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'SpotLight',
                        path: '3d/light/spotLight',
                        thumb: '3d/light/spotLight/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'PointLight Performance(cluster)',
                        path: '3d/light/pointLightPerformance',
                        thumb: '3d/light/pointLightPerformance/thumb.png',
                        description: {
                            ko: ``,
                            en: `PointLight supports clustered tile rendering. Supports 1024 point lights.`
                        },
                    },
                    {
                        name: 'SpotLight Performance(cluster)',
                        path: '3d/light/spotLightPerformance',
                        thumb: '3d/light/spotLightPerformance/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
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
                            ko: ``,
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
                        thumb: '3d/tint/basic/thumb.png',
                        description: {
                            ko: ``,
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
                        thumb: '3d/line3D/linear/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        experimental: true,
                        name: 'Bezier Type',
                        path: '3d/line3D/bezier',
                        thumb: '3d/line3D/bezier/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        experimental: true,
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
                            ko: ``,
                            en: `Here's an example of setting up mouse events on a Mesh.`
                        },
                    },
                    {
                        name: 'Sprite3D',
                        path: '3d/mouseEvent/sprite3D',
                        thumb: '3d/mouseEvent/sprite3D/thumb.png',
                        description: {
                            ko: ``,
                            en: `Here's an example of setting up mouse events on a Sprite3D.`
                        },
                    },
                    {
                        name: 'SpriteSheet3D',
                        path: '3d/mouseEvent/spriteSheet3D',
                        thumb: '3d/mouseEvent/spriteSheet3D/thumb.png',
                        description: {
                            ko: ``,
                            en: `Here's an example of setting up mouse events on a SpriteSheet3D.`
                        },
                    },
                    {
                        name: 'TextField3D',
                        path: '3d/mouseEvent/textField3D',
                        thumb: '3d/mouseEvent/textField3D/thumb.png',
                        description: {
                            ko: ``,
                            en: `Here's an example of setting up mouse events on a TextField3D.`
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
                        thumb: '3d/shadow/directionalShadow/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'DirectionalLight Shadow - GLTF',
                        path: '3d/shadow/gltfDirectionalShadow',
                        thumb: '3d/shadow/gltfDirectionalShadow/thumb.png',
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
                        name: 'InstancedMesh Simple',
                        path: '3d/instancedMesh/simple',
                        thumb: '3d/instancedMesh/simple/thumb.png',
                        description: {
                            ko: ``,
                            en: `This demo demonstrates instance performance testing using a simple Plane. This demo maximizes the WebGPU's minimum safe memory of 128 MB buffer (1 million instances).`
                        },
                    },
                    {
                        name: 'InstancedMesh Sphere',
                        path: '3d/instancedMesh/sphere',
                        thumb: '3d/instancedMesh/sphere/thumb.png',
                        description: {
                            ko: ``,
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
                        thumb: '3d/lod/InstanceMeshGPULOD/thumb.png',
                        description: {
                            ko: ``,
                            en: `This demo demonstrates GPU LOD performance testing for instanced meshes. It fully utilizes WebGPU's minimum safe memory of 128MB buffer (1 million instances).`
                        },
                    },
                    {
                        name: 'Mesh CPU LOD',
                        path: '3d/lod/MeshCPULOD',
                        thumb: '3d/lod/MeshCPULOD/thumb.png',
                        description: {
                            ko: ``,
                            en: `This demo demonstrates CPU LOD performance testing for meshes.`
                        },
                    },
                    {
                        name: 'Multi Material GPU LOD',
                        path: '3d/lod/InstanceMeshGPULOD_material',
                        thumb: '3d/lod/InstanceMeshGPULOD_material/thumb.png',
                        description: {
                            ko: ``,
                            en: `This demo demonstrates testing utilizing different materials in GPU LOD.`
                        },
                    },
                    {
                        name: 'Multi Material CPU LOD',
                        path: '3d/lod/MeshCPULOD_material',
                        thumb: '3d/lod/MeshCPULOD_material/thumb.png',
                        description: {
                            ko: ``,
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
                name: 'Indirect Draw Test',
                list: [
                    {
                        name: 'drawIndexedIndirect Test',
                        path: '3d/indirectDrawTest',
                        thumb: '3d/indirectDrawTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    }
                ]
            },


        ]
    },
    {
        name: 'PostEffect',
        list: [

            {
                name: 'Convolution',
                path: '3d/postEffect/convolution',
                thumb: '3d/postEffect/convolution/thumb.png',
                description: {
                    ko: ``,
                    en: ``
                },
            },
            {
                name: 'FilmGrain',
                path: '3d/postEffect/filmGrain',
                thumb: '3d/postEffect/filmGrain/thumb.png',
                description: {
                    ko: ``,
                    en: ``
                },
            },
            {
                name: 'OldBloom',
                path: '3d/postEffect/oldBloom',
                thumb: '3d/postEffect/oldBloom/thumb.png',
                description: {
                    ko: ``,
                    en: ``
                },
            },
            {
                name: 'Sharpen',
                path: '3d/postEffect/sharpen',
                thumb: '3d/postEffect/sharpen/thumb.png',
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
                        thumb: '3d/postEffect/adjustments/grayscale/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'Invert',
                        path: '3d/postEffect/adjustments/invert',
                        thumb: '3d/postEffect/adjustments/invert/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'ColorBalance',
                        path: '3d/postEffect/adjustments/colorBalance',
                        thumb: '3d/postEffect/adjustments/colorBalance/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'ColorTemperatureTint',
                        path: '3d/postEffect/adjustments/colorTemperatureTint',
                        thumb: '3d/postEffect/adjustments/colorTemperatureTint/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },

                    {
                        name: 'BrightnessContrast',
                        path: '3d/postEffect/adjustments/brightnessContrast',
                        thumb: '3d/postEffect/adjustments/brightnessContrast/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'HueSaturation',
                        path: '3d/postEffect/adjustments/hueSaturation',
                        thumb: '3d/postEffect/adjustments/hueSaturation/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'Threshold',
                        path: '3d/postEffect/adjustments/threshold',
                        thumb: '3d/postEffect/adjustments/threshold/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'Vibrance',
                        path: '3d/postEffect/adjustments/vibrance',
                        thumb: '3d/postEffect/adjustments/vibrance/thumb.png',
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
                        name: 'Blur',
                        path: '3d/postEffect/blur/blur',
                        thumb: '3d/postEffect/blur/blur/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'BlurX',
                        path: '3d/postEffect/blur/blurX',
                        thumb: '3d/postEffect/blur/blurX/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'BlurY',
                        path: '3d/postEffect/blur/blurY',
                        thumb: '3d/postEffect/blur/blurY/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'DirectionalBlur',
                        path: '3d/postEffect/blur/directionalBlur',
                        thumb: '3d/postEffect/blur/directionalBlur/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'GaussianBlur',
                        path: '3d/postEffect/blur/gaussianBlur',
                        thumb: '3d/postEffect/blur/gaussianBlur/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'RadialBlur',
                        path: '3d/postEffect/blur/radialBlur',
                        thumb: '3d/postEffect/blur/radialBlur/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'ZoomBlur',
                        path: '3d/postEffect/blur/zoomBlur',
                        thumb: '3d/postEffect/blur/zoomBlur/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                ]
            },
            {
                name: 'Lens',
                list: [
                    {
                        name: 'LensDistortion',
                        path: '3d/postEffect/lens/lensDistortion',
                        thumb: '3d/postEffect/lens/lensDistortion/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        }
                    },
                    {
                        name: 'ChromaticAberration',
                        path: '3d/postEffect/lens/chromaticAberration',
                        thumb: '3d/postEffect/lens/chromaticAberration/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        }
                    },
                    {
                        name: 'DepthOfField',
                        path: '3d/postEffect/lens/dof',
                        thumb: '3d/postEffect/lens/dof/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        }
                    },
                    {
                        name: 'Vignetting',
                        path: '3d/postEffect/lens/vignetting',
                        thumb: '3d/postEffect/lens/vignetting/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                ]
            },
            {
                name: 'Fog',
                list: [
                    {
                        name: 'Fog',
                        path: '3d/postEffect/fog/fog',
                        thumb: '3d/postEffect/fog/fog/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        }
                    },
                    {
                        name: 'HeightFog',

                        path: '3d/postEffect/fog/heightFog',
                        thumb: '3d/postEffect/fog/heightFog/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
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
                    path: '3d/postEffect/ssr',
                    thumb: '3d/postEffect/ssr/thumb.png',
                    description: {
                        ko: ``,
                        en: ``
                    }
                },
                ]
            },
            {
                name: 'Screen Space Ambient Occlusion',
                list: [{
                    name: 'SSAO',
                    path: '3d/postEffect/ssao',
                    thumb: '3d/postEffect/ssao/thumb.png',
                    description: {
                        ko: ``,
                        en: ``
                    }
                },
                ]
            },
        ],
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
                        thumb: 'gltf/basic/textureEncodingTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'TextureLinear InterpolationTest',
                        path: 'gltf/basic/textureLinearInterpolationTest',
                        thumb: 'gltf/basic/textureLinearInterpolationTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'VertexColorTest',
                        path: 'gltf/basic/vertexColorTest',
                        thumb: 'gltf/basic/vertexColorTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'BoxVertexColors',
                        path: 'gltf/basic/boxVertexColors',
                        thumb: 'gltf/basic/boxVertexColors/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'OrientationTest',
                        path: 'gltf/basic/orientationTest',
                        thumb: 'gltf/basic/orientationTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'TextureCoordinateTest',
                        path: 'gltf/basic/textureCoordinateTest',
                        thumb: 'gltf/basic/textureCoordinateTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'AlphaBlendModeTest',
                        path: 'gltf/basic/alphaBlendModeTest',
                        thumb: 'gltf/basic/alphaBlendModeTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'TextureSettingsTest',
                        path: 'gltf/basic/textureSettingsTest',
                        thumb: 'gltf/basic/textureSettingsTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'MultiUVTest',
                        path: 'gltf/basic/multiUVTest',
                        thumb: 'gltf/basic/multiUVTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },

                    {
                        name: 'MetalRoughSpheres',
                        path: 'gltf/basic/metalRoughSpheres',
                        thumb: 'gltf/basic/metalRoughSpheres/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'MetalRoughSpheresNoTextures',
                        path: 'gltf/basic/metalRoughSpheresNoTextures',
                        thumb: 'gltf/basic/metalRoughSpheresNoTextures/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'NormalTangentTest',
                        path: 'gltf/basic/normalTangentTest',
                        thumb: 'gltf/basic/normalTangentTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'NormalTangentMirrorTest',
                        path: 'gltf/basic/normalTangentMirrorTest',
                        thumb: 'gltf/basic/normalTangentMirrorTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'NegativeScaleTest',
                        path: 'gltf/basic/negativeScaleTest',
                        thumb: 'gltf/basic/negativeScaleTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },

                    {
                        name: 'EnvironmentTest',
                        path: 'gltf/basic/environmentTest',
                        thumb: 'gltf/basic/environmentTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'Generate normal vector test',
                        path: 'gltf/basic/generateNormalTest',
                        thumb: 'gltf/basic/generateNormalTest/thumb.png',
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
                        thumb: 'gltf/basic/compareBaseColor/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    }, {
                        name: 'CompareAlphaCoverage',
                        path: 'gltf/basic/compareAlphaCoverage',
                        thumb: 'gltf/basic/compareAlphaCoverage/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'CompareMetallic',
                        path: 'gltf/basic/compareMetallic',
                        thumb: 'gltf/basic/compareMetallic/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'CompareNormal',
                        path: 'gltf/basic/compareNormal',
                        thumb: 'gltf/basic/compareNormal/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'CompareRoughness',
                        path: 'gltf/basic/compareRoughness',
                        thumb: 'gltf/basic/compareRoughness/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'CompareAmbientOcclusion',
                        path: 'gltf/basic/compareAmbientOcclusion',
                        thumb: 'gltf/basic/compareAmbientOcclusion/thumb.png',
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
                        thumb: 'gltf/animation/basicAnimations/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'SimpleSkin',
                        path: 'gltf/animation/simpleSkin',
                        thumb: 'gltf/animation/simpleSkin/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'SimpleMorph',
                        path: 'gltf/animation/simpleMorph',
                        thumb: 'gltf/animation/simpleMorph/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'RiggedSimple',
                        path: 'gltf/animation/riggedSimple',
                        thumb: 'gltf/animation/riggedSimple/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'RiggedFigure',
                        path: 'gltf/animation/riggedFigure',
                        thumb: 'gltf/animation/riggedFigure/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'InterpolationTest',
                        path: 'gltf/animation/interpolationTest',
                        thumb: 'gltf/animation/interpolationTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'CesiumMan & MilkTruck',
                        path: 'gltf/animation/cesiumMan',
                        thumb: 'gltf/animation/cesiumMan/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },

                    {
                        name: 'BrainStem',
                        path: 'gltf/animation/brainStem',
                        thumb: 'gltf/animation/brainStem/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'MorphStressTest',
                        path: 'gltf/animation/morphStressTest',
                        thumb: 'gltf/animation/morphStressTest/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'RecursiveSkeletons',
                        path: 'gltf/animation/recursiveSkeletons',
                        thumb: 'gltf/animation/recursiveSkeletons/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'Animation Performance Test',
                        list: [
                            {
                                name: 'Medium load Skinning',
                                path: 'gltf/animation/performance/mediumLoadSkinning',
                                thumb: 'gltf/animation/performance/mediumLoadSkinning/thumb.png',
                                description: {
                                    ko: ``,
                                    en: `This is a performance demo that computes a large number of models with 19 joints and 57 animation channels.`
                                },
                            },
                            {
                                name: 'High vertex load Skinning',
                                path: 'gltf/animation/performance/highVertexLoadSkinning',
                                thumb: 'gltf/animation/performance/highVertexLoadSkinning/thumb.png',
                                description: {
                                    ko: ``,
                                    en: `perform tests to measure skinning performance for models with many vertices and joints. We monitor FPS and GPU/CPU utilization to determine performance limits for each device.`
                                },
                            },
                            {
                                name: 'Morph target load Test',
                                path: 'gltf/animation/performance/highMorphTarget',
                                thumb: 'gltf/animation/performance/highMorphTarget/thumb.png',
                                description: {
                                    ko: ``,
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
                        thumb: 'gltf/models/corset/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'Helmets',
                        path: 'gltf/models/helmets',
                        thumb: 'gltf/models/helmets/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'Sponza',
                        path: 'gltf/models/sponza',
                        thumb: 'gltf/models/sponza/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'Tokyo',
                        path: 'gltf/models/tokyo',
                        thumb: 'gltf/models/tokyo/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },   {
                        name: 'texcooredNTest',
                        path: 'gltf/models/texcooredNTest',
                        thumb: 'gltf/models/texcooredNTest/thumb.png',
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
                                thumb: 'gltf/gltfExtensions/anisotropy/compareAnisotropy/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'AnisotropyDiscTest',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyDiscTest',
                                thumb: 'gltf/gltfExtensions/anisotropy/anisotropyDiscTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'AnisotropyRotationTest',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyRotationTest',
                                thumb: 'gltf/gltfExtensions/anisotropy/anisotropyRotationTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'AnisotropyStrengthTest',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyStrengthTest',
                                thumb: 'gltf/gltfExtensions/anisotropy/anisotropyStrengthTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'AnisotropyBarnLamp',
                                path: 'gltf/gltfExtensions/anisotropy/anisotropyBarnLamp',
                                thumb: 'gltf/gltfExtensions/anisotropy/anisotropyBarnLamp/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
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
                                thumb: 'gltf/gltfExtensions/iridescence/compareIridescence/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'IridescenceDielectricSpheres',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceDielectricSpheres',
                                thumb: 'gltf/gltfExtensions/iridescence/iridescenceDielectricSpheres/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'IridescenceMetallicSpheres',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceMetallicSpheres',
                                thumb: 'gltf/gltfExtensions/iridescence/iridescenceMetallicSpheres/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'IridescenceSuzanne',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceSuzanne',
                                thumb: 'gltf/gltfExtensions/iridescence/iridescenceSuzanne/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'IridescenceLamp',
                                path: 'gltf/gltfExtensions/iridescence/iridescenceLamp',
                                thumb: 'gltf/gltfExtensions/iridescence/iridescenceLamp/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'SunglassesKhronos',
                                path: 'gltf/gltfExtensions/iridescence/sunglassesKhronos',
                                thumb: 'gltf/gltfExtensions/iridescence/sunglassesKhronos/thumb.png',
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
                                thumb: 'gltf/gltfExtensions/clearcoat/compareClearcoat/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'ClearCoatTest',
                                path: 'gltf/gltfExtensions/clearcoat/clearCoatTest',
                                thumb: 'gltf/gltfExtensions/clearcoat/clearCoatTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'ClearcoatWicker',
                                path: 'gltf/gltfExtensions/clearcoat/clearcoatWicker',
                                thumb: 'gltf/gltfExtensions/clearcoat/clearcoatWicker/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'ClearCoatCarPaint',
                                path: 'gltf/gltfExtensions/clearcoat/clearCoatCarPaint',
                                thumb: 'gltf/gltfExtensions/clearcoat/clearCoatCarPaint/thumb.png',
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
                                thumb: 'gltf/gltfExtensions/dispersion/compareDispersion/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'DispersionTest',
                                path: 'gltf/gltfExtensions/dispersion/dispersionTest',
                                thumb: 'gltf/gltfExtensions/dispersion/dispersionTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'DragonDispersion',
                                path: 'gltf/gltfExtensions/dispersion/dragonDispersion',
                                thumb: 'gltf/gltfExtensions/dispersion/dragonDispersion/thumb.png',
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
                                thumb: 'gltf/gltfExtensions/emissiveStrength/compareEmissiveStrength/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'EmissiveStrengthTest',
                                path: 'gltf/gltfExtensions/emissiveStrength/emissiveStrengthTest',
                                thumb: 'gltf/gltfExtensions/emissiveStrength/emissiveStrengthTest/thumb.png',
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
                                thumb: 'gltf/gltfExtensions/sheen/compareSheen/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'SheenTestGrid',
                                path: 'gltf/gltfExtensions/sheen/sheenTestGrid',
                                thumb: 'gltf/gltfExtensions/sheen/sheenTestGrid/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'SheenCloth',
                                path: 'gltf/gltfExtensions/sheen/sheenCloth',
                                thumb: 'gltf/gltfExtensions/sheen/sheenCloth/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'SheenChair',
                                path: 'gltf/gltfExtensions/sheen/sheenChair',
                                thumb: 'gltf/gltfExtensions/sheen/sheenChair/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'GlamVelvetSofa',
                                path: 'gltf/gltfExtensions/sheen/glamVelvetSofa',
                                thumb: 'gltf/gltfExtensions/sheen/glamVelvetSofa/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'ChairDamaskPurplegold',
                                path: 'gltf/gltfExtensions/sheen/chairDamaskPurplegold',
                                thumb: 'gltf/gltfExtensions/sheen/chairDamaskPurplegold/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'SheenWoodLeatherSofa',
                                path: 'gltf/gltfExtensions/sheen/sheenWoodLeatherSofa',
                                thumb: 'gltf/gltfExtensions/sheen/sheenWoodLeatherSofa/thumb.png',
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
                                thumb: 'gltf/gltfExtensions/specular/compareSpecular/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'SpecularTest',
                                path: 'gltf/gltfExtensions/specular/specularTest',
                                thumb: 'gltf/gltfExtensions/specular/specularTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'SpecularSilkPouf',
                                path: 'gltf/gltfExtensions/specular/specularSilkPouf',
                                thumb: 'gltf/gltfExtensions/specular/specularSilkPouf/thumb.png',
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
                                thumb: 'gltf/gltfExtensions/unlit/unlitTest/thumb.png',
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
                                thumb: 'gltf/gltfExtensions/textureTransform/textureTransformTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'TextureTransformMultiTest',
                                path: 'gltf/gltfExtensions/textureTransform/textureTransformMultiTest',
                                thumb: 'gltf/gltfExtensions/textureTransform/textureTransformMultiTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
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
                                thumb: 'gltf/gltfExtensions/diffuseTransmission/diffuseTransmissionTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'DiffuseTransmissionTeacup',
                                path: 'gltf/gltfExtensions/diffuseTransmission/diffuseTransmissionTeacup',
                                thumb: 'gltf/gltfExtensions/diffuseTransmission/diffuseTransmissionTeacup/thumb.png',
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
                                thumb: 'gltf/gltfExtensions/transmission/compareTransmission/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'TransmissionTest',
                                path: 'gltf/gltfExtensions/transmission/transmissionTest',
                                thumb: 'gltf/gltfExtensions/transmission/transmissionTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'TransmissionRoughnessTest',
                                path: 'gltf/gltfExtensions/transmission/transmissionRoughnessTest',
                                thumb: 'gltf/gltfExtensions/transmission/transmissionRoughnessTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'ChronographWatch',
                                path: 'gltf/gltfExtensions/transmission/chronographWatch',
                                thumb: 'gltf/gltfExtensions/transmission/chronographWatch/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'MosquitoInAmber',
                                path: 'gltf/gltfExtensions/transmission/mosquitoInAmber',
                                thumb: 'gltf/gltfExtensions/transmission/mosquitoInAmber/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'CommercialRefrigerator',
                                path: 'gltf/gltfExtensions/transmission/commercialRefrigerator',
                                thumb: 'gltf/gltfExtensions/transmission/commercialRefrigerator/thumb.png',
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
                                thumb: 'gltf/gltfExtensions/volume/compareIor/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'IORTestGrid',
                                path: 'gltf/gltfExtensions/volume/IORTestGrid',
                                thumb: 'gltf/gltfExtensions/volume/IORTestGrid/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'CompareVolume',
                                path: 'gltf/gltfExtensions/volume/compareVolume',
                                thumb: 'gltf/gltfExtensions/volume/compareVolume/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'TransmissionThinwallTestGrid',
                                path: 'gltf/gltfExtensions/volume/transmissionThinwallTestGrid',
                                thumb: 'gltf/gltfExtensions/volume/transmissionThinwallTestGrid/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'AttenuationTest',
                                path: 'gltf/gltfExtensions/volume/attenuationTest',
                                thumb: 'gltf/gltfExtensions/volume/attenuationTest/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'GlassVaseFlowers',
                                path: 'gltf/gltfExtensions/volume/glassVaseFlowers',
                                thumb: 'gltf/gltfExtensions/volume/glassVaseFlowers/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'GlassBrokenWindow',
                                path: 'gltf/gltfExtensions/volume/glassBrokenWindow',
                                thumb: 'gltf/gltfExtensions/volume/glassBrokenWindow/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'GlassHurricaneCandleHolder',
                                path: 'gltf/gltfExtensions/volume/glassHurricaneCandleHolder',
                                thumb: 'gltf/gltfExtensions/volume/glassHurricaneCandleHolder/thumb.png',
                                description: {
                                    ko: ``,
                                    en: ``
                                },
                            },
                            {
                                name: 'DragonAttenuation',
                                path: 'gltf/gltfExtensions/volume/dragonAttenuation',
                                thumb: 'gltf/gltfExtensions/volume/dragonAttenuation/thumb.png',
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
                        thumb: '2d/group2D/basic/thumb.png',
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
                name: '2D Object BlendMode',
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
                name: '2D Tint',
                experimental: true,
                list: [
                    {
                        experimental: true,
                        name: 'Tint Basic',
                        path: '2d/tint/basic',
                        thumb: '2d/tint/basic/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        experimental: true,
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
                name: '2D MouseEvent',
                list: [
                    {
                        name: 'Sprite2D',
                        path: '2d/mouseEvent/sprite2D',
                        thumb: '2d/mouseEvent/sprite2D/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'SpriteSheet2D',
                        path: '2d/mouseEvent/spriteSheet2D',
                        thumb: '2d/mouseEvent/spriteSheet2D/thumb.png',
                        description: {
                            ko: ``,
                            en: ``
                        },
                    },
                    {
                        name: 'TextField2D',
                        path: '2d/mouseEvent/textField2D',
                        thumb: '2d/mouseEvent/textField2D/thumb.png',
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
