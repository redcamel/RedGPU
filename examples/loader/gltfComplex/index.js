/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.2.28 21:0:29
 *
 */
"use strict"
import RedGPU from "../../../dist/RedGPU.min.mjs";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);
new RedGPU.RedGPUContext(
    cvs,
    function () {
        let tView, tScene, tCamera, tLight;
        let renderer, render;
        let testCubeTexture;
        ///////////////////////////////////////////////////////////////////////////////////////////
        // basic setup
        tScene = new RedGPU.Scene();
        testCubeTexture = new RedGPU.BitmapCubeTexture(
            this,
            [
                '../../../assets/cubemap/SwedishRoyalCastle/px.jpg',
                '../../../assets/cubemap/SwedishRoyalCastle/nx.jpg',
                '../../../assets/cubemap/SwedishRoyalCastle/py.jpg',
                '../../../assets/cubemap/SwedishRoyalCastle/ny.jpg',
                '../../../assets/cubemap/SwedishRoyalCastle/pz.jpg',
                '../../../assets/cubemap/SwedishRoyalCastle/nz.jpg'
            ]
        )
        tScene.skyBox = new RedGPU.SkyBox(
            this, testCubeTexture
        );
        tCamera = new RedGPU.ObitController(this);
        tCamera.tilt = 0;
        tLight = new RedGPU.DirectionalLight(this)
        tLight.x = 2
        tLight.y = 3
        tLight.z = 3
        tScene.addLight(tLight)
        //
        tLight = new RedGPU.DirectionalLight(this)
        tLight.x = -2
        tLight.y = 3
        tLight.z = -3
        tScene.addLight(tLight)
        tView = new RedGPU.View(this, tScene, tCamera);
        this.addView(tView);
            {
                    let setGLTF = (path, fileName) => {
                            let tGLTF = null;
                            tGLTF = new RedGPU.GLTFLoader(
                              this, // redGPUContext
                              path, // assetRootPath
                              fileName, // fileName
                              function (v) { // callBack
                                      console.log('Load Complete.', v);
                              },
                              // tCubeTexture
                            );

                            return tGLTF;
                    };
                    let t0 = setGLTF(
                      'https://redcamel.github.io/RedGL-Examples-test/asset/glTF/tokyo/',
                      'scene.gltf'
                    );
                    console.log(t0);

                    t0 = t0['resultMesh'];
                    t0.scaleX = t0.scaleY = t0.scaleZ = 0.01;
                    // t0.x = -5;
                    tScene.addChild(t0);
            }
        // renderer setup
        renderer = new RedGPU.Render();
        render = time => {
            renderer.render(time, this);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        // TestUI setup
        // ExampleHelper.setTestUI_GLTFLoader(RedGPU, this,tView,tScene,tCamera ,true);
        ExampleHelper.setTestUI_Debugger(RedGPU);
    }
);
