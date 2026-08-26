import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import Mesh from "../../../../mesh/Mesh";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import type {FoliageSubMesh} from "../../FoliageType";
import impostorBakeShaderWGSL from "./impostorBake.wgsl";
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";
import {COMMAND_ENCODER_TYPE} from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../../../../../material/core";

export interface FoliageBakeResult {
    texture: DirectTexture;
    width: number;
    height: number;
    depth: number;
    bottomOffset: number;
}

class FoliageImpostorBaker {
    static #bakePipelineCache: Map<string, GPURenderPipeline> = new Map();
    static #bakeBindGroupLayout: GPUBindGroupLayout | null = null;

    static calculateAABBFromSubMeshes(subMeshes: FoliageSubMesh[]): {
        min: [number, number, number];
        max: [number, number, number];
        width: number;
        height: number;
        depth: number
    } {
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

        for (let s = 0; s < subMeshes.length; s++) {
            const sub = subMeshes[s];
            if (sub.lodIndex === 1) continue;

            const vBuffer = sub.geometry?.vertexBuffer;
            const vData = vBuffer?.data;
            if (!vData) continue;

            const stride = (vBuffer.interleavedStruct?.arrayStride ? vBuffer.interleavedStruct.arrayStride / 4 : 12);
            const vCount = vBuffer.vertexCount || (vData.length / stride);
            const m = sub.relativeModelMatrix;

            for (let i = 0; i < vCount; i++) {
                const idx = i * stride;
                const x = vData[idx];
                const y = vData[idx + 1];
                const z = vData[idx + 2];

                const wx = m[0] * x + m[4] * y + m[8] * z + m[12];
                const wy = m[1] * x + m[5] * y + m[9] * z + m[13];
                const wz = m[2] * x + m[6] * y + m[10] * z + m[14];

                if (wx < minX) minX = wx;
                if (wy < minY) minY = wy;
                if (wz < minZ) minZ = wz;
                if (wx > maxX) maxX = wx;
                if (wy > maxY) maxY = wy;
                if (wz > maxZ) maxZ = wz;
            }
        }

        if (minX === Infinity) {
            return {min: [-1.0, 0, -1.0], max: [1.0, 2.0, 1.0], width: 2.0, height: 2.0, depth: 2.0};
        }

        const width = Math.max(maxX - minX, 0.1);
        const height = Math.max(maxY - minY, 0.1);
        const depth = Math.max(maxZ - minZ, 0.1);

        return {
            min: [minX, minY, minZ],
            max: [maxX, maxY, maxZ],
            width,
            height,
            depth
        };
    }

    static bakeSubMeshes(
        redGPUContext: RedGPUContext,
        subMeshes: FoliageSubMesh[],
        rootMeshNode?: Mesh,
        resolution: number = 512,
        bakeName: string = 'Foliage'
    ): FoliageBakeResult {
        const gpuDevice = redGPUContext.gpuDevice;
        if (!gpuDevice) {
            throw new Error('[FoliageImpostorBaker] GPUDevice is not initialized.');
        }

        const aabb = this.calculateAABBFromSubMeshes(subMeshes);
        const bakedWidth = Math.max(aabb.width, aabb.depth);
        const bakedHeight = aabb.height;
        const bottomOffset = aabb.min[1];
        const centerY = aabb.min[1] + bakedHeight * 0.5;
        const maxRadialExtent = (bakedWidth * 0.5) * 1.15;

        const atlasWidth = resolution * 3;
        const atlasHeight = resolution;
        const mipLevelCount = getMipLevelCount(atlasWidth, atlasHeight);

        const bakedGPUTexture = gpuDevice.createTexture({
            label: `BakedImpostor_${bakeName}`,
            size: [atlasWidth, atlasHeight, 1],
            mipLevelCount,
            format: 'rgba8unorm-srgb',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
        });

        const depthGPUTexture = gpuDevice.createTexture({
            label: `BakedImpostor_Depth_${bakeName}`,
            size: [atlasWidth, atlasHeight, 1],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });

        const maxCameraDist = Math.max(bakedWidth, bakedHeight) * 2.0;

        const angles = [0, Math.PI / 3, (2 * Math.PI) / 3];
        const renderPassViews = [];

        for (let a = 0; a < 3; a++) {
            const rad = angles[a];
            const camX = Math.sin(rad) * maxCameraDist;
            const camZ = Math.cos(rad) * maxCameraDist;

            const proj = mat4.create();
            const view = mat4.create();
            const projView = mat4.create();

            mat4.orthoNO(proj, -maxRadialExtent, maxRadialExtent, -bakedHeight * 0.5, bakedHeight * 0.5, 0.1, maxCameraDist * 2.0);
            mat4.lookAt(view, [camX, centerY, camZ], [0, centerY, 0], [0, 1, 0]);
            mat4.multiply(projView, proj, view);

            renderPassViews.push({
                projView,
                vpX: resolution * a,
                vpY: 0,
                lightDir: [-Math.sin(rad + 0.5), -1.0, -Math.cos(rad + 0.5)]
            });
        }

        this.#initBindGroupLayouts(redGPUContext);

        const commandEncoder = gpuDevice.createCommandEncoder({label: `BakeImpostor_${bakeName}`});
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    view: bakedGPUTexture.createView({baseMipLevel: 0, mipLevelCount: 1}),
                    clearValue: {r: 0, g: 0, b: 0, a: 0},
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: depthGPUTexture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'discard',
            },
        });

        const tempBuffersToDestroy: GPUBuffer[] = [];

        for (let v = 0; v < renderPassViews.length; v++) {
            const vpInfo = renderPassViews[v];
            renderPass.setViewport(vpInfo.vpX, vpInfo.vpY, resolution, resolution, 0, 1);
            renderPass.setScissorRect(vpInfo.vpX, vpInfo.vpY, resolution, resolution);

            for (let s = 0; s < subMeshes.length; s++) {
                const sub = subMeshes[s];
                if (sub.lodIndex === 1) continue;

                const pipeline = this.#getOrCreateBakePipeline(redGPUContext, sub);
                if (!pipeline) continue;

                renderPass.setPipeline(pipeline);

                const texture = sub.material.diffuseTexture || sub.material.baseColorTexture;
                const sampler = sub.material.diffuseTextureSampler || sub.material.baseColorTextureSampler || redGPUContext.resourceManager.basicSampler;

                let gpuTextureView: GPUTextureView | null = null;
                if (texture && texture.gpuTexture) {
                    gpuTextureView = texture.gpuTexture.createView();
                } else {
                    gpuTextureView = redGPUContext.resourceManager.emptyBitmapTextureView;
                }

                const bindGroup = gpuDevice.createBindGroup({
                    label: `BakeBindGroup_${s}`,
                    layout: this.#bakeBindGroupLayout!,
                    entries: [
                        {binding: 0, resource: gpuTextureView},
                        {binding: 1, resource: sampler.gpuSampler},
                    ]
                });
                renderPass.setBindGroup(0, bindGroup);

                const vBuffer = sub.geometry.vertexBuffer?.gpuBuffer;
                if (!vBuffer) continue;

                const mvp = mat4.create();
                mat4.multiply(mvp, vpInfo.projView, sub.relativeModelMatrix);

                const transformData = new Float32Array(16);
                transformData.set(mvp, 0);

                const transformGPUBuffer = gpuDevice.createBuffer({
                    label: `BakeTransformBuffer_${s}`,
                    size: 64,
                    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
                    mappedAtCreation: true,
                });
                new Float32Array(transformGPUBuffer.getMappedRange()).set(transformData);
                transformGPUBuffer.unmap();
                tempBuffersToDestroy.push(transformGPUBuffer);

                renderPass.setVertexBuffer(0, vBuffer);
                renderPass.setVertexBuffer(1, transformGPUBuffer);

                if (sub.isIndexed && sub.geometry.indexBuffer?.gpuBuffer) {
                    renderPass.setIndexBuffer(sub.geometry.indexBuffer.gpuBuffer, sub.indexFormat || 'uint32');
                    renderPass.drawIndexed(sub.indexCount);
                } else {
                    renderPass.draw(sub.vertexCount);
                }
            }
        }

        renderPass.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);

        depthGPUTexture.destroy();
        for (let b = 0; b < tempBuffersToDestroy.length; b++) {
            tempBuffersToDestroy[b].destroy();
        }

        if (mipLevelCount > 1) {
            redGPUContext.resourceManager.mipmapGenerator.generateMipmap(
                bakedGPUTexture,
                {
                    size: [atlasWidth, atlasHeight, 1],
                    mipLevelCount,
                    format: 'rgba8unorm-srgb',
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
                },
                false,
                COMMAND_ENCODER_TYPE.PRE_PROCESS
            );
        }

        const directTexture = new DirectTexture(redGPUContext, 'BakedFoliageImpostorAtlas');
        directTexture.gpuTexture = bakedGPUTexture;

        depthGPUTexture.destroy();

        return {
            texture: directTexture,
            width: bakedWidth,
            height: bakedHeight,
            depth: aabb.depth,
            bottomOffset,
        };
    }

    static async debugPreviewAtlas(
        redGPUContext: RedGPUContext,
        bakeResult: FoliageBakeResult,
        name: string = 'Debug'
    ): Promise<void> {
        const gpuDevice = redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        const texture = bakeResult.texture.gpuTexture;
        if (!texture) return;

        const width = texture.width;
        const height = texture.height;

        const bytesPerRow = Math.ceil((width * 4) / 256) * 256;
        const readBuffer = gpuDevice.createBuffer({
            label: 'Debug_Impostor_ReadBuffer',
            size: bytesPerRow * height,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        });

        const commandEncoder = gpuDevice.createCommandEncoder();
        commandEncoder.copyTextureToBuffer(
            {texture: texture, mipLevel: 0},
            {buffer: readBuffer, bytesPerRow: bytesPerRow, rowsPerImage: height},
            [width, height, 1]
        );
        gpuDevice.queue.submit([commandEncoder.finish()]);

        await readBuffer.mapAsync(GPUMapMode.READ);
        const mappedData = new Uint8Array(readBuffer.getMappedRange());

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.position = 'fixed';
        canvas.style.top = '10px';
        canvas.style.right = '10px';
        canvas.style.width = '384px';
        canvas.style.height = '128px';
        canvas.style.zIndex = '999999';
        canvas.style.border = '3px solid #ff00ff';
        canvas.style.borderRadius = '8px';
        canvas.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.8)';
        canvas.style.background = '#111';

        const ctx = canvas.getContext('2d');
        if (ctx) {
            const imgData = ctx.createImageData(width, height);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const srcIdx = y * bytesPerRow + x * 4;
                    const dstIdx = (y * width + x) * 4;
                    imgData.data[dstIdx] = mappedData[srcIdx];
                    imgData.data[dstIdx + 1] = mappedData[srcIdx + 1];
                    imgData.data[dstIdx + 2] = mappedData[srcIdx + 2];
                    imgData.data[dstIdx + 3] = mappedData[srcIdx + 3];
                }
            }
            ctx.putImageData(imgData, 0, 0);

            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            const thirdW = width / 3;
            ctx.beginPath();
            ctx.moveTo(thirdW, 0);
            ctx.lineTo(thirdW, height);
            ctx.moveTo(thirdW * 2, 0);
            ctx.lineTo(thirdW * 2, height);
            ctx.stroke();

            ctx.fillStyle = '#ffff00';
            ctx.font = 'bold 24px monospace';
            ctx.fillText('STAR 0°', 10, 30);
            ctx.fillText('STAR 60°', thirdW + 10, 30);
            ctx.fillText('STAR 120°', thirdW * 2 + 10, 30);
        }

        readBuffer.unmap();
        readBuffer.destroy();

        const oldCanvas = document.getElementById(`debug_atlas_${name}`);
        if (oldCanvas) oldCanvas.remove();
        canvas.id = `debug_atlas_${name}`;
        document.body.appendChild(canvas);
        console.log(`[FoliageImpostorBaker 🖼️] Debug atlas preview appended to DOM: #${canvas.id}`);
    }

    static #initBindGroupLayouts(redGPUContext: RedGPUContext) {
        if (!this.#bakeBindGroupLayout) {
            const gpuDevice = redGPUContext.gpuDevice;
            const resourceManager = redGPUContext.resourceManager;
            const shaderInfo = resourceManager.wgslParser.parse('FoliageImpostorBakeFragmentModule', impostorBakeShaderWGSL);
            const descriptor = getFragmentBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);

            this.#bakeBindGroupLayout = gpuDevice.createBindGroupLayout({
                label: 'BakeBindGroupLayout',
                ...descriptor
            });
        }
    }

    static #getOrCreateBakePipeline(redGPUContext: RedGPUContext, sub: FoliageSubMesh): GPURenderPipeline {
        const key = `BakePipeline_stride${sub.strideBytes}`;
        let pipeline = this.#bakePipelineCache.get(key);
        if (pipeline) return pipeline;

        const gpuDevice = redGPUContext.gpuDevice;
        const resourceManager = redGPUContext.resourceManager;

        const vertexShaderCode = `
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) uv: vec2<f32>,
            };

            struct TransformInput {
                @location(3) mvp0: vec4<f32>,
                @location(4) mvp1: vec4<f32>,
                @location(5) mvp2: vec4<f32>,
                @location(6) mvp3: vec4<f32>,
            };

            @vertex
            fn main(
                @location(0) position: vec3<f32>,
                @location(1) normal: vec3<f32>,
                @location(2) uv: vec2<f32>,
                trans: TransformInput
            ) -> VertexOutput {
                var out: VertexOutput;
                let mvp = mat4x4<f32>(trans.mvp0, trans.mvp1, trans.mvp2, trans.mvp3);
                out.position = mvp * vec4<f32>(position, 1.0);
                out.uv = uv;
                return out;
            }
        `;

        const vModule = resourceManager.createGPUShaderModule('FoliageImpostorBakeVertexModule', {
            code: vertexShaderCode
        });
        const fModule = resourceManager.createGPUShaderModule('FoliageImpostorBakeFragmentModule', {
            code: impostorBakeShaderWGSL
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'BakePipelineLayout',
            bindGroupLayouts: [this.#bakeBindGroupLayout!]
        });

        pipeline = gpuDevice.createRenderPipeline({
            label: key,
            layout: pipelineLayout,
            vertex: {
                module: vModule,
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: Math.max(sub.strideBytes, 48),
                        attributes: [
                            {shaderLocation: 0, offset: 0, format: 'float32x3'},
                            {shaderLocation: 1, offset: 12, format: 'float32x3'},
                            {shaderLocation: 2, offset: 24, format: 'float32x2'},
                        ]
                    },
                    {
                        arrayStride: 64,
                        stepMode: 'instance',
                        attributes: [
                            {shaderLocation: 3, offset: 0, format: 'float32x4'},
                            {shaderLocation: 4, offset: 16, format: 'float32x4'},
                            {shaderLocation: 5, offset: 32, format: 'float32x4'},
                            {shaderLocation: 6, offset: 48, format: 'float32x4'},
                        ]
                    }
                ]
            },
            fragment: {
                module: fModule,
                entryPoint: 'main',
                targets: [
                    {
                        format: 'rgba8unorm-srgb',
                        blend: {
                            color: {
                                srcFactor: 'src-alpha',
                                dstFactor: 'one-minus-src-alpha',
                                operation: 'add'
                            },
                            alpha: {
                                srcFactor: 'one',
                                dstFactor: 'one-minus-src-alpha',
                                operation: 'add'
                            }
                        }
                    }
                ]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            }
        });

        this.#bakePipelineCache.set(key, pipeline);
        return pipeline;
    }
}

Object.freeze(FoliageImpostorBaker);

export default FoliageImpostorBaker;
