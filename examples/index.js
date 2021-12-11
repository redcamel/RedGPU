/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.2.28 21:0:29
 *
 */
"use strict"
import RedGPU from "../dist/RedGPU.min.mjs";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);
new RedGPU.RedGPUContext(
    cvs,
    function () {
        let tView, tScene, tCamera;
        let renderer, render;
        ///////////////////////////////////////////////////////////////////////////////////////////
        // basic setup
        tScene = new RedGPU.Scene();
        tScene.backgroundColor = '#222';
        tCamera = new RedGPU.Camera3D(this);
        tView = new RedGPU.View(this, tScene, tCamera);
        this.addView(tView);
        ///////////////////////////////////////////////////////////////////////////////////////////
        // sky setup
        tScene.skyBox = new RedGPU.SkyBox(
            this, new RedGPU.BitmapCubeTexture(
                this,
                [
                    '../assets/cubemap/SwedishRoyalCastle/px.jpg',
                    '../assets/cubemap/SwedishRoyalCastle/nx.jpg',
                    '../assets/cubemap/SwedishRoyalCastle/py.jpg',
                    '../assets/cubemap/SwedishRoyalCastle/ny.jpg',
                    '../assets/cubemap/SwedishRoyalCastle/pz.jpg',
                    '../assets/cubemap/SwedishRoyalCastle/nz.jpg'
                ]
            )
        );
        ///////////////////////////////////////////////////////////////////////////////////////////
        // light setup
        let tLight = new RedGPU.DirectionalLight(this)
        tLight.x = 5;
        tLight.y = 5;
        tLight.z = 5;
        tScene.addLight(tLight)
        tLight = new RedGPU.DirectionalLight(this,'#ff0000')
        tLight.intensity = 0.05
        tLight.x = -5;
        tLight.y = -5;
        tLight.z = -5;
        tScene.addLight(tLight)
        ///////////////////////////////////////////////////////////////////////////////////////////
        // material setup
        const material1 = new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, './assets/hud_003.png'))
        const material2 = new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, './assets/hud_001.png'))
        const material3 = new RedGPU.BitmapMaterial(this, new RedGPU.BitmapTexture(this, './assets/hud_006.png'))
        material1.alpha = 0.7
        ///////////////////////////////////////////////////////////////////////////////////////////
        // make obejct
        const makeCyber = () => {
            let rootMesh = new RedGPU.Mesh(this);

            let tGeo = new RedGPU.Sphere(this, 8, 8, 8, 8)
            let positionList = []
            let i = 0
            let len = tGeo.interleaveBuffer.data.length / 8
            for (i; i < len; i++) {
                positionList.push(
                    [
                        tGeo.interleaveBuffer.data[i * 8],
                        tGeo.interleaveBuffer.data[i * 8 + 1],
                        tGeo.interleaveBuffer.data[i * 8 + 2]
                    ]
                )
            }
            // console.log(positionList)
            i = positionList.length - 1
            while (i--) {
                let tMesh = new RedGPU.Mesh(this, new RedGPU.Plane(this), material1)
                tMesh.scaleX = tMesh.scaleY = (Math.sqrt(positionList[i][0] * positionList[i][0] + positionList[i][2] * positionList[i][2])) * 0.5 + Math.random() * 10
                tMesh.cullMode = 'none';
                tMesh.depthWriteEnabled = false;
                rootMesh.addChild(tMesh)
                //
                const t = Math.random() * 3 + 1
                tMesh.x = positionList[i][0] * t
                tMesh.y = positionList[i][1] * t
                tMesh.z = positionList[i][2] * t
                tMesh.targetTo(0, 0, 0)
                tMesh.rotationZ = Math.random() * 360
                tMesh.opacity = Math.random()

                //
                let tMesh2 = new RedGPU.Mesh(this, new RedGPU.Plane(this), material2)
                tMesh2.scaleX = tMesh2.scaleY = Math.random() * 0.25
                tMesh2.z = Math.random()
                tMesh2.cullMode = 'none';
                tMesh2.depthWriteEnabled = false;
                tMesh.addChild(tMesh2)

                {
                    let tRandomPositionScale = Math.random() - 0.5 + 5.5
                    let tPosition = [
                        positionList[i][0],
                        positionList[i][1],
                        positionList[i][2]
                    ]
                    let tScale = Math.random() * 0.5 + 0.5
                    TweenMax.to(tMesh, Math.random() * 4 + 0.5, {
                        x: tPosition[0] * tRandomPositionScale,
                        y: tPosition[1] * tRandomPositionScale,
                        z: tPosition[2] * tRandomPositionScale,
                        scaleX: tScale,
                        scaleY: tScale,
                        yoyo: true,
                        repeat: -1,
                        ease: Quint.easeInOut
                    })
                    TweenMax.to(tMesh, Math.random() * 2 + 0.3, {
                        rotationZ: tMesh.rotationZ + Math.random() * 90 - 45,
                        yoyo: true,
                        repeat: -1,
                        ease: Quint.easeInOut
                    })
                    let tScale2 = Math.random() * 0.5 - 0.25 + 1
                    TweenMax.to(tMesh2, Math.random() * 2 + 0.5, {
                        scaleX: tScale2,
                        scaleY: tScale2,
                        z: Math.random(),
                        yoyo: true,
                        repeat: -1,
                        ease: Quint.easeInOut
                    })
                    TweenMax.to(tMesh2, Math.random() * 2 + 0.3, {
                        rotationZ: tMesh2.rotationZ + Math.random() * 90 - 45,
                        yoyo: true,
                        repeat: -1,
                        ease: Quint.easeInOut
                    })
                }

                {

                    let tMesh3 = new RedGPU.Mesh(this, new RedGPU.Plane(this), material3)
                    tMesh3.scaleX = tMesh3.scaleY = 0.25
                    tMesh3.z = -Math.random() * 2
                    tMesh3.opacity = 0.7
                    tMesh3.cullMode = 'none';
                    tMesh3.depthWriteEnabled = false;
                    tMesh3.addChild(tMesh3)

                    let tScale = Math.random() * 0.5 - 0.25 + 0.5
                    TweenMax.to(tMesh3, Math.random() * 3 + 1, {
                        scaleX: tScale,
                        scaleY: tScale,
                        rotationZ: Math.random() * 360,
                        yoyo: true,
                        repeat: -1,
                        ease: Quint.easeInOut
                    })
                }

            }
            return rootMesh
        }

        const makeMesh = function (redGpuContext, y) {
            let tMaterial = new RedGPU.EnvironmentMaterial(redGpuContext,
                new RedGPU.BitmapTexture(redGpuContext, './assets/Brick03_col.jpg'),
                new RedGPU.BitmapCubeTexture(
                    redGpuContext,
                    [
                        '../assets/cubemap/SwedishRoyalCastle/px.jpg',
                        '../assets/cubemap/SwedishRoyalCastle/nx.jpg',
                        '../assets/cubemap/SwedishRoyalCastle/py.jpg',
                        '../assets/cubemap/SwedishRoyalCastle/ny.jpg',
                        '../assets/cubemap/SwedishRoyalCastle/pz.jpg',
                        '../assets/cubemap/SwedishRoyalCastle/nz.jpg'
                    ]
                ),
                new RedGPU.BitmapTexture(redGpuContext, './assets/Brick03_nrm.jpg'),
                new RedGPU.BitmapTexture(redGpuContext, './assets/specular.png'),
                new RedGPU.BitmapTexture(redGpuContext, './assets/emissive.jpg'),
                new RedGPU.BitmapTexture(redGpuContext, './assets/Brick03_disp.jpg'),
            )
            let tMesh;
            let i = 10
            tMesh = new RedGPU.Mesh(redGpuContext, new RedGPU.Sphere(redGpuContext, 6, 32, 32, 32), tMaterial)
            tMesh.x = 0
            tMesh.y = y
            tScene.addChild(tMesh)
            while (i--) {
                tMesh = new RedGPU.Mesh(redGpuContext, new RedGPU.Sphere(redGpuContext, 1, 32, 32, 32), tMaterial)
                tMesh.x = Math.sin(Math.PI * 2 / 10 * i) * 15
                tMesh.z = Math.cos(Math.PI * 2 / 10 * i) * 15
                tMesh.scaleX = tMesh.scaleY = tMesh.scaleZ = 2
                tScene.addChild(tMesh)
            }


            tMaterial.emissivePower = 0
            tMaterial.displacementPower = 0
            tMaterial.displacementFlowSpeedX = 0.1
            tMaterial.displacementFlowSpeedY = 0.1
            let tDelay = 1
            let tDuration = 0.76
            let timeline = new TimelineMax({repeat: 1000, yoyo: true, repeatDelay: 2});
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                reflectionPower: 0,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                reflectionPower: 1,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                normalPower: 0,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                normalPower: 2,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                shininess: 16,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                displacementPower: 1,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                shininess: 128,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                specularPower: 0.1,
                reflectionPower: 0.5,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                displacementPower: 0,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                specularPower: 1,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                emissivePower: 0.5,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                emissivePower: 0,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                displacementPower: 1,
                ease: Ease.CubicInOut
            }));
            timeline.add(TweenMax.to(tMaterial, tDuration, {
                delay: tDelay,
                displacementPower: 0.2,
                reflectionPower: 1,
                ease: Ease.CubicInOut
            }));

        }
        makeMesh(this, 0);
        const main = makeCyber();
        const sub = makeCyber();
        tScene.addChild(main)
        tScene.addChild(sub)
        sub.rotationX = sub.rotationY = sub.rotationZ = Math.random() * 360
        sub.scaleX = sub.scaleY = sub.scaleZ = 0.8
        sub.opacity = 0.5

        /////////////////////////////////////////////////////////////////////////////////////////
        // PostEffect setup
        const effect = new RedGPU.PostEffect_Bloom(this)
        effect.bloomStrength = 0.4
        effect.exposure = 1.3
        tView.postEffect.addEffect(effect)
        const effectZoomBlue = new RedGPU.PostEffect_ZoomBlur(this)
        effectZoomBlue.amount = 0
        tView.postEffect.addEffect(effectZoomBlue)
        const effectHueSaturation = new RedGPU.PostEffect_HueSaturation(this)

        tView.postEffect.addEffect(effectHueSaturation)
        ///////////////////////////////////////////////////////////////////////////////////////////
        // Particle setup
        let particleTest = new RedGPU.Particle(this, 3000, {maxLife : 5000}, new RedGPU.BitmapTexture(this, './assets/particle.png'))

        tScene.addChild(particleTest)
        let particleTest2 = new RedGPU.Particle(this, 5000, {maxLife : 5000}, new RedGPU.BitmapTexture(this, './assets/particle2.png'))
        tScene.addChild(particleTest2)
        ///////////////////////////////////////////////////////////////////////////////////////////
        // renderer setup
        renderer = new RedGPU.Render();
        render = time => {
            renderer.render(time, this);
            main.rotationX += 0.05
            main.rotationY += 0.03
            sub.rotationX -= 0.08
            tCamera.x = Math.sin(time / 2000) * 30
            tCamera.y = Math.cos(time / 2500) * 20 + 15
            tCamera.z = Math.cos(time / 1500) * 20
            tCamera.lookAt(0, 0, 0)

            particleTest.x = Math.sin(time / 2000 + Math.cos(time / 3000)) * Math.cos(time / 1000) * 30
            particleTest.y = Math.sin(time / 3000 + Math.cos(time / 2000)) * Math.cos(time / 1000) * 20
            particleTest.z = Math.cos(time / 1000 + Math.cos(time / 2000)) * Math.cos(time / 1000) * 30
            particleTest2.x = -Math.sin(time / 1000 + Math.cos(time / 3500)) * Math.cos(time / 2000) * 30
            particleTest2.y = -Math.sin(time / 2000 + Math.cos(time / 2000)) * Math.cos(time / 1000) * 50
            particleTest2.z = -Math.cos(time / 1000 + Math.cos(time / 2000)) * Math.cos(time / 1000) * 30
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        makeExampleList(this, effectHueSaturation, effectZoomBlue)
    }
);
const makeExampleList = (redGpuContext, tEffect, tEffect2) => {
    const rootPath = './'
    let itemList = [];
    let makeItem = function (list, root, depth) {
        depth = depth || 0;
        list.forEach(function (v) {
            let tIDX = itemList.length;


            let tDom;
            if (!v['href']) {
                let newGroup;
                root.S(
                    '>', Alucard.Dom('h2').S(
                        'fontSize', 14,
                        'html', v['key']
                    ),
                    '>', newGroup = Alucard.Dom('ul').S(
                        'display', 'flex',
                        'alignItems', 'center',
                        'flexWrap', 'wrap',
                        'gap',5
                    )
                );
                makeItem(v['list'] ? v['list'] : [], depth ? root : newGroup, depth + 1)
            } else {
                itemList.push(v);
                tDom = Alucard.Dom('li').S(
                    'display', 'flex',
                    'alignItems', 'center',
                    'gap',5,
                    'background', 'rgba(0,0,0,0.2)',
                    'padding', '10px',
                    'borderRadius', 6,
                    'lineHeight',1,
                    '<', root
                );
                //
                let tImg;
                Alucard.Dom('div').S(
                    'display', 'flex',
                    'alignItems', 'center',
                    'cursor', 'pointer',
                    'position', 'relative',
                    // 'height', 108 * 0.85 + 27,
                    // '>', tImg = Alucard.Dom('img').S(
                    //     '@src', 'thumb/' + v['key'] + '.png',
                    //     // '@src', 'https://redcamel.github.io/RedGL2/example/thumb/RedGL.png',
                    //     'min-width',180,
                    //     'opacity', 0.65,
                    //     'border-top-left-radius', 5,
                    //     'height', 108 * 0.85,
                    //     'box-shadow', '0px 0px 10px rgba(0, 0, 0, 1)'
                    // ),
                    '>', Alucard.Dom('li').S(
                        // 'position', 'absolute',
                        // 'bottom', 0, 'left', 0, 'right', 0,
                        'display', 'flex',
                        'alignItems', 'center',
                        'border-radius', 8,
                        'padding', '0px 10px',
                        'min-height',26,
                        'font-size', 11,
                        'color', '#dd8450',
                        'background', 'rgba(14,14,14,0.9)',
                        'html', v['key']
                    ),
                    'over', function (e) {
                        console.log(e);
                        this.S('z-index', 2);
                        TweenMax.to(this.dom, 0.2, {scale: 1.3, ease: Ease.QuintInOut});
                        TweenMax.to(tEffect, 0.5, {saturation: -100, ease: Ease.QuintOut});
                        TweenMax.to(tEffect2, 0.5, {
                                centerX: e.nativeEvent.clientX / document.body.clientWidth - 0.5,
                                centerY: e.nativeEvent.clientY / window.outerHeight - 0.5,
                                amount: 15, ease: Ease.QuintOut
                            }
                        )

                    },
                    'out', function () {
                        this.S('z-index', 1);
                        TweenMax.to(this.dom, 0.3, {scale: 1, ease: Ease.QuintInOut});
                        TweenMax.to(tEffect, 0.5, {saturation: 0, ease: Ease.QuintOut});
                        TweenMax.to(tEffect2, 0.5, {
                                centerX: 0,
                                centerY: 0,
                                amount: 0, ease: Ease.QuintOut
                            }
                        )
                    },
                    'click', function () {
                        window.location.href = rootPath + v['href'] + '?idx=' + tIDX
                    },
                    '<', tDom
                );
                // tImg.dom.onerror = function () {
                //     tImg.S('@src', 'https://redcamel.github.io/RedGL2/example/thumb/test.jpg')
                // };
                makeItem(v['list'] ? v['list'] : [], tDom, depth + 1)
            }

        })
    };

    makeItem([
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
                    key: 'camera2D',
                    href: 'coordinate/getScreenPoint/index.html'
                },
                {
                    key: 'camera3D',
                    href: 'coordinate/localToWorld/index.html'
                },
                {
                    key: 'obitController',
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
                    href: 'postEffect/postEffectindex.html'
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
    ], Alucard.Dom('#exampleBox'))
}