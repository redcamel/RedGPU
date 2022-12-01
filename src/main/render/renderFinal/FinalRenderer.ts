import RedGPUContextBase from "../../../context/RedGPUContextBase";
import RedGPUContext from "../../../context/RedGPUContext";
import vertexSource from './vertex.wgsl';
import fragmentSource from './fragment.wgsl';
import {mat4} from "../../../util/gl-matrix";
import {View} from "../../view";
import {TextureSampler} from "../../../resource/texture";
import makeShaderModule from "../../../resource/makeShaderModule";
import VertexBuffer from "../../../resource/buffers/buffer/VertexBuffer";
import InterleaveInfo from "../../../resource/buffers/interleaveInfo/InterleaveInfo";
import InterleaveUnit from "../../../resource/buffers/interleaveInfo/InterleaveUnit";

class FinalRenderer extends RedGPUContextBase {
    vertexBuffer: VertexBuffer

    sampler: TextureSampler
    uniformsBindGroupLayout: GPUBindGroupLayout
    uniformBindGroup: GPUBindGroup
    pipeline: GPURenderPipeline
    #matrix
    pixelViewRect

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext)
        const {gpuDevice} = redGPUContext
        const vShaderModule = makeShaderModule(gpuDevice, vertexSource, 'FinalRenderer_vShaderModule')
        const fShaderModule = makeShaderModule(gpuDevice, fragmentSource, 'FinalRenderer_fShaderModule')
        console.log(vShaderModule, fShaderModule)
        this.#matrix = mat4.create()
        ////////////////////////////////////////////////////////////////////////
        // make vertexBuffer
        this.vertexBuffer = new VertexBuffer(
            redGPUContext,
            new Float32Array(
                [
                    //x,y,z, u,v
                    -1.0, -1.0, 0.0, 0.0, 1.0,
                    1.0, -1.0, 0.0, 1.0, 1.0,
                    -1.0, 1.0, 0.0, 0.0, 0.0,
                    -1.0, 1.0, 0.0, 0.0, 0.0,
                    1.0, -1.0, 0.0, 1.0, 1.0,
                    1.0, 1.0, 0.0, 1.0, 0.0
                ]
            ),
            new InterleaveInfo(
                [
                    new InterleaveUnit(InterleaveUnit.VERTEX_POSITION, "float32x3"),
                    new InterleaveUnit(InterleaveUnit.TEXCOORD, 'float32x2')
                ]
            ),
        );
        this.uniformsBindGroupLayout = gpuDevice.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform',
                    },

                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: 'filtering',
                    },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {}
                }
            ]
        });

        this.sampler = new TextureSampler(redGPUContext, {
            magFilter: "linear",
            minFilter: "linear",
            mipmapFilter: "nearest"
        });

        /////
        console.log(this.vertexBuffer)
        const presentationFormat: GPUTextureFormat = navigator.gpu.getPreferredCanvasFormat();
        const pipeLineDescriptor: GPURenderPipelineDescriptor = {
            // set bindGroupLayouts
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.uniformsBindGroupLayout]}),
            vertex: {
                module: vShaderModule,
                entryPoint: 'main',

                buffers: [
                    {
                        arrayStride: this.vertexBuffer.arrayStride,
                        attributes: this.vertexBuffer.attributes.map((v, index) => {
                            return {
                                // position
                                shaderLocation: index,
                                offset: v.offset,
                                format: v.format
                            }
                        })
                    }
                ]
            },
            fragment: {
                module: fShaderModule,
                entryPoint: 'main',
                targets: [
                    {
                        format: presentationFormat,
                        blend: {
                            color: {
                                srcFactor: "src-alpha",
                                dstFactor: "one-minus-src-alpha",
                                operation: "add"
                            },
                            alpha: {
                                srcFactor: "one",
                                dstFactor: "one-minus-src-alpha",
                                operation: "add"
                            }
                        }
                    },
                ],
            },
        }
        this.pipeline = gpuDevice.createRenderPipeline(pipeLineDescriptor);
        /////

    }

    render(viewList) {
        const redGPUContext = this.redGPUContext

        const {gpuDevice, gpuContext, pixelSize} = redGPUContext
        const commandEncoder: GPUCommandEncoder = gpuDevice.createCommandEncoder();
        const textureView: GPUTextureView = gpuContext.getCurrentTexture().createView();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            /**
             * @typedef {GPURenderPassColorAttachment}
             */
            colorAttachments: [
                {
                    view: textureView,
                    clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            // depthStencilAttachment: {
            //     view: this.depthTextureView,
            //     depthClearValue: 1.0,
            //     depthLoadOp: "clear",
            //     depthStoreOp: "store",
            //     stencilClearValue: 0,
            //     stencilLoadOp: "load",
            //     stencilStoreOp: "store",
            // }

        };


        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);

        //
        passEncoder.setViewport(0, 0, pixelSize.width, pixelSize.height, 0, 1);
        passEncoder.setScissorRect(0, 0, pixelSize.width, pixelSize.height);
        viewList.forEach((view: View) => {
            const {pixelViewRect} = view
            console.log(view.resolveTextureView,view.resultTextureView.label)
            const uniformBindGroupDescriptor = {
                layout: this.uniformsBindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: {
                            buffer: view.finalRenderUniformBuffer,
                            offset: 0,
                            size: 4 * 4 * Float32Array.BYTES_PER_ELEMENT
                        }
                    },
                    {
                        binding: 1,
                        resource: this.sampler.gpuSampler,
                    },
                    {
                        binding: 2,
                        resource: view.resolveTextureView,
                    }
                ]
            };
            this.uniformBindGroup = gpuDevice.createBindGroup(uniformBindGroupDescriptor);
            passEncoder.setVertexBuffer(0, this.vertexBuffer.gpuBuffer);
            passEncoder.setBindGroup(0, this.uniformBindGroup);


            mat4.identity(this.#matrix)
            mat4.ortho(
                this.#matrix,
                0., // left
                1., // right
                0., // bottom
                1., // top,
                -1000,
                1000
            );

            mat4.scale(
                this.#matrix,
                this.#matrix,
                [
                    1 / pixelSize.width,
                    1 / pixelSize.height,
                    1
                ]
            );
            mat4.translate(
                this.#matrix,
                this.#matrix,
                [
                    (pixelViewRect[2] / 2),
                    (pixelSize.height - pixelViewRect[3] / 2),
                    0
                ]
            );

            const temp = mat4.create()
            mat4.scale(
                temp,
                temp,
                [
                    pixelViewRect[2] / 2,
                    pixelViewRect[3] / 2,
                    1
                ]
            );
            mat4.translate(
                this.#matrix,
                this.#matrix,
                [
                    (pixelViewRect[0]),
                    (-pixelViewRect[1]),
                    0
                ]
            );

            mat4.multiply(
                this.#matrix,
                this.#matrix,
                temp,
            )

            gpuDevice.queue.writeBuffer(view.finalRenderUniformBuffer, 0, this.#matrix);

            ///////////////////////////////////////////////////////////////////
            // setVertexBuffer

            passEncoder.draw(6, 1, 0, 0);
        })
        passEncoder.setViewport(0, 0, pixelSize.width, pixelSize.height, 0, 1);
        passEncoder.setScissorRect(0, 0, pixelSize.width, pixelSize.height);
        //
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);


    }

}

export default FinalRenderer
