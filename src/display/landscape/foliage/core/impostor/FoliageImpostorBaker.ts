import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import Mesh from "../../../../mesh/Mesh";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import type {FoliageSubMesh} from "../../FoliageType";
import impostorBakeShaderWGSL from "./impostorBake.wgsl";
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";
import {COMMAND_ENCODER_TYPE} from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

export interface FoliageBakeResult {
    texture: DirectTexture;
    width: number;
    height: number;
    depth: number;
    bottomOffset: number;
}

class FoliageImpostorBaker {
    static #bakePipelineCache: Map<string, GPURenderPipeline> = new Map();
    static #bakeBindGroupLayout0: GPUBindGroupLayout | null = null;
    static #bakeBindGroupLayout1: GPUBindGroupLayout | null = null;

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
            format: 'rgba8unorm',
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

        this.#initBindGroupLayouts(gpuDevice);

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

        for (let v = 0; v < renderPassViews.length; v++) {
            const vpInfo = renderPassViews[v];
            renderPass.setViewport(vpInfo.vpX, vpInfo.vpY, resolution, resolution, 0, 1);
            renderPass.setScissorRect(vpInfo.vpX, vpInfo.vpY, resolution, resolution);

            const uniformData = new Float32Array(8);
            uniformData[0] = vpInfo.lightDir[0];
            uniformData[1] = vpInfo.lightDir[1];
            uniformData[2] = vpInfo.lightDir[2];
            uniformData[3] = 0;
            uniformData[4] = resolution;
            uniformData[5] = resolution;
            uniformData[6] = 0;
            uniformData[7] = 0;

            const uniformGPUBuffer = gpuDevice.createBuffer({
                label: `BakeUniformBuffer_${v}`,
                size: 32,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                mappedAtCreation: true,
            });
            new Float32Array(uniformGPUBuffer.getMappedRange()).set(uniformData);
            uniformGPUBuffer.unmap();

            const bindGroup0 = gpuDevice.createBindGroup({
                label: `BakeBindGroup0_${v}`,
                layout: this.#bakeBindGroupLayout0!,
                entries: [
                    {binding: 0, resource: {buffer: uniformGPUBuffer}}
                ]
            });
            renderPass.setBindGroup(0, bindGroup0);

            for (let s = 0; s < subMeshes.length; s++) {
                const sub = subMeshes[s];
                if (sub.lodIndex === 1) continue;

                const pipeline = this.#getOrCreateBakePipeline(gpuDevice, sub);
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

                const bindGroup1 = gpuDevice.createBindGroup({
                    label: `BakeBindGroup1_${s}`,
                    layout: this.#bakeBindGroupLayout1!,
                    entries: [
                        {binding: 0, resource: gpuTextureView},
                        {binding: 1, resource: sampler.gpuSampler},
                    ]
                });
                renderPass.setBindGroup(1, bindGroup1);

                const vBuffer = sub.geometry.vertexBuffer?.gpuBuffer;
                if (!vBuffer) continue;

                const mvp = mat4.create();
                mat4.multiply(mvp, vpInfo.projView, sub.relativeModelMatrix);

                const normMat = mat4.create();
                mat4.invert(normMat, sub.relativeModelMatrix);
                mat4.transpose(normMat, normMat);

                const transformData = new Float32Array(32);
                transformData.set(mvp, 0);
                transformData.set(normMat, 16);

                const transformGPUBuffer = gpuDevice.createBuffer({
                    label: `BakeTransformBuffer_${s}`,
                    size: 128,
                    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
                    mappedAtCreation: true,
                });
                new Float32Array(transformGPUBuffer.getMappedRange()).set(transformData);
                transformGPUBuffer.unmap();

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

        if (mipLevelCount > 1) {
            redGPUContext.resourceManager.mipmapGenerator.generateMipmap(
                bakedGPUTexture,
                {
                    size: [atlasWidth, atlasHeight, 1],
                    mipLevelCount,
                    format: 'rgba8unorm',
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

    static #initBindGroupLayouts(gpuDevice: GPUDevice) {
        if (!this.#bakeBindGroupLayout0) {
            this.#bakeBindGroupLayout0 = gpuDevice.createBindGroupLayout({
                label: 'BakeBindGroupLayout0',
                entries: [
                    {binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'uniform'}}
                ]
            });
        }
        if (!this.#bakeBindGroupLayout1) {
            this.#bakeBindGroupLayout1 = gpuDevice.createBindGroupLayout({
                label: 'BakeBindGroupLayout1',
                entries: [
                    {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                    {binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                ]
            });
        }
    }

    static #getOrCreateBakePipeline(gpuDevice: GPUDevice, sub: FoliageSubMesh): GPURenderPipeline {
        const key = `BakePipeline_stride${sub.strideBytes}`;
        let pipeline = this.#bakePipelineCache.get(key);
        if (pipeline) return pipeline;

        const vertexShaderCode = `
            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) uv: vec2<f32>,
                @location(1) normal: vec3<f32>,
                @location(2) worldPosition: vec3<f32>,
            };

            struct TransformInput {
                @location(3) mvp0: vec4<f32>,
                @location(4) mvp1: vec4<f32>,
                @location(5) mvp2: vec4<f32>,
                @location(6) mvp3: vec4<f32>,
                @location(7) norm0: vec4<f32>,
                @location(8) norm1: vec4<f32>,
                @location(9) norm2: vec4<f32>,
                @location(10) norm3: vec4<f32>,
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
                let normMat = mat4x4<f32>(trans.norm0, trans.norm1, trans.norm2, trans.norm3);

                out.position = mvp * vec4<f32>(position, 1.0);
                out.uv = uv;
                out.normal = (normMat * vec4<f32>(normal, 0.0)).xyz;
                out.worldPosition = position;
                return out;
            }
        `;

        const vModule = gpuDevice.createShaderModule({code: vertexShaderCode, label: 'BakeVertexModule'});
        const fModule = gpuDevice.createShaderModule({code: impostorBakeShaderWGSL, label: 'BakeFragmentModule'});

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'BakePipelineLayout',
            bindGroupLayouts: [this.#bakeBindGroupLayout0!, this.#bakeBindGroupLayout1!]
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
                        arrayStride: 128,
                        stepMode: 'instance',
                        attributes: [
                            {shaderLocation: 3, offset: 0, format: 'float32x4'},
                            {shaderLocation: 4, offset: 16, format: 'float32x4'},
                            {shaderLocation: 5, offset: 32, format: 'float32x4'},
                            {shaderLocation: 6, offset: 48, format: 'float32x4'},
                            {shaderLocation: 7, offset: 64, format: 'float32x4'},
                            {shaderLocation: 8, offset: 80, format: 'float32x4'},
                            {shaderLocation: 9, offset: 96, format: 'float32x4'},
                            {shaderLocation: 10, offset: 112, format: 'float32x4'},
                        ]
                    }
                ]
            },
            fragment: {
                module: fModule,
                entryPoint: 'main',
                targets: [
                    {
                        format: 'rgba8unorm',
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
