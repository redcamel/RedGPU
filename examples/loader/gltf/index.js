/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.2.28 21:0:29
 *
 */
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

        // renderer setup
        renderer = new RedGPU.Render();
        render = time => {
            renderer.render(time, this);
                // tScene.children[0].rotationY+=0.1
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        // TestUI setup
        ExampleHelper.setTestUI_GLTFLoader(RedGPU, this,tView,tScene,tCamera ,true);
        ExampleHelper.setTestUI_Debugger(RedGPU);
    }
);
