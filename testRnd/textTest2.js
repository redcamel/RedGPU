/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.3.24 21:36:11
 *
 */
import RedGPU from "https://redcamel.github.io/RedGPU/src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);
console.log(RedGPU)

class VertexColorMaterial extends RedGPU.BaseMaterial {
    static vertexShaderGLSL = `
    #version 460
	${RedGPU.ShareGLSL.GLSL_SystemUniforms_vertex.systemUniforms}
    ${RedGPU.ShareGLSL.GLSL_SystemUniforms_vertex.meshUniforms}
    layout(set=2,binding = 0) uniform Uniforms {
        mat4 modelMatrix;
    } uniforms;
    layout(location = 0) in vec3 position;
    layout(location = 1) in vec4 vertexColor;
    layout(location = 0) out vec4 vVertexColor;
    void main() {
        gl_Position = systemUniforms.perspectiveMTX * systemUniforms.cameraMTX * meshMatrixUniforms.modelMatrix[ int(meshUniforms.index) ] * vec4(position,1.0);
        vVertexColor = vertexColor;
    }
    `;
    static fragmentShaderGLSL = `
    #version 460
    layout(location = 0) in vec4 vVertexColor;
    layout(location = 0) out vec4 outColor;
    void main() {
        outColor = vVertexColor;
    }
    `;
    static PROGRAM_OPTION_LIST = {
        vertex: [],
        fragment: []
    };
    static uniformsBindGroupLayoutDescriptor_material = {
        bindings: []
    };
    static uniformBufferDescriptor_vertex = RedGPU.BaseMaterial.uniformBufferDescriptor_empty;
    static uniformBufferDescriptor_fragment = RedGPU.BaseMaterial.uniformBufferDescriptor_empty;

    constructor(redGPU) {
        super(redGPU);
        this.resetBindingInfo()
    }

    resetBindingInfo() {
        this.bindings = [];
        this._afterResetBindingInfo();
    }
}

new RedGPU.RedGPUContext(cvs,
    function () {
        let tScene = new RedGPU.Scene();
        tScene.backgroundColor = '#fff';

        let tCamera = new RedGPU.ObitController(this);
        let tView = new RedGPU.View(this, tScene, tCamera);
        this.addView(tView);
        tCamera.distance = 2;

        this.setSize(window.innerWidth, window.innerHeight);

        // Square data
        //             1.0 y
        //              ^  -1.0
        //              | / z
        //              |/       x
        // -1.0 -----------------> +1.0
        //            / |
        //      +1.0 /  |
        //           -1.0
        //
        //        [0]------[1]
        //         |      / |
        //         |    /   |
        //         |  /     |
        //        [2]------[3]
        //
        let interleaveData = new Float32Array(
            [
                // x,   y,   z,    r,   g,   b    a
                -0.5, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0, // v0
                0.5, 0.5, 0.0, 0.0, 1.0, 0.0, 1.0, // v1
                -0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1.0, // v2
                0.5, -0.5, 0.0, 1.0, 1.0, 0.0, 1.0  // v3
            ]
        );
        let indexData = new Uint16Array(
            [
                2, 1, 0, // v2-v1-v0
                2, 3, 1  // v2-v3-v1
            ]
        );

        let geometry = new RedGPU.Geometry(
            this,
            new RedGPU.Buffer(
                this,
                'interleaveBuffer',
                RedGPU.Buffer.TYPE_VERTEX,
                new Float32Array(interleaveData),
                [
                    new RedGPU.InterleaveInfo('vertexPosition', 'float3'),
                    new RedGPU.InterleaveInfo('vertexColor', 'float4')
                ]
            ),
            new RedGPU.Buffer(
                this,
                'indexBuffer',
                RedGPU.Buffer.TYPE_INDEX,
                new Uint32Array(indexData)
            )
        );

        let colorMat = new VertexColorMaterial(this);
        let tMesh = new RedGPU.Mesh(this, geometry, colorMat);
        tScene.addChild(tMesh);

        let renderer = new RedGPU.Render();
        let render = (time) => {
            renderer.render(time, this);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);


    }
)
