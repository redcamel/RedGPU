import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../context/RedGPUContext";
import Mesh from "../../../mesh/Mesh";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import {FoliageSubMesh} from "../FoliageType";
import impostorBakeShaderWGSL from "./shader/impostorBake.wgsl";

export interface FoliageBakeResult {
    texture: DirectTexture;
    width: number;
    height: number;
    depth: number;
    bottomOffset: number;
}

/**
 * [KO] 언리얼 엔진 5 스타일 식생 자동 임포스터 캡처/베이커 (Foliage Impostor Baker)
 * [EN] Unreal Engine 5 style Foliage Impostor Baker that automatically captures all tree submeshes into a single billboard texture.
 */
export class FoliageImpostorBaker {
    static #bakePipelineCache: Map<string, GPURenderPipeline> = new Map();
    static #bakeBindGroupLayout0: GPUBindGroupLayout | null = null;
    static #bakeBindGroupLayout1: GPUBindGroupLayout | null = null;

    /**
     * 실제 수집된 서브메시들의 최종 버텍스 데이터를 직접 분석하여 100% 정밀 AABB를 계산합니다.
     */
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
            if (sub.lodIndex === 1) continue; // 빌보드 자체는 제외

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

                // relativeModelMatrix 적용
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

    /**
     * [KO] 줄기(Trunk)와 나뭇잎(Leaf)을 포함한 모든 서브메시지를 오프스크린 가상 스튜디오에서 렌더링하여
     * 단 1장의 투명 배경 통합 빌보드 텍스처로 자동 베이킹합니다.
     */
    static bakeSubMeshes(
        redGPUContext: RedGPUContext,
        subMeshes: FoliageSubMesh[],
        rootMesh: Mesh,
        resolution: number = 512,
        bakeName: string = 'FoliageImpostor'
    ): FoliageBakeResult {
        const gpuDevice = redGPUContext.gpuDevice;
        const aabb = this.calculateAABBFromSubMeshes(subMeshes);

        const maxWidth = Math.max(aabb.width, aabb.depth);
        const bakedWidth = maxWidth * 1.05;
        const bakedHeight = aabb.height * 1.05;

        // 1. 오프스크린 렌더타겟 텍스처 생성 (RGBA8Unorm 투명 배경)
        const bakedGPUTexture = gpuDevice.createTexture({
            label: `BakedImpostor_${bakeName}`,
            size: [resolution, resolution, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
        });

        const depthGPUTexture = gpuDevice.createTexture({
            label: `BakedImpostor_Depth_${bakeName}`,
            size: [resolution, resolution, 1],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });

        // 2. 완벽하고 무결한 직교 투영 행렬 (Orthographic Matrix)
        const projViewMatrix = mat4.create();
        const centerX = (aabb.min[0] + aabb.max[0]) * 0.5;
        const halfW = bakedWidth * 0.5;
        const halfH = bakedHeight * 0.5;
        const centerY = aabb.min[1] + halfH;

        // X: [minX, maxX] -> [-1, 1]
        // Y: [minY, minY + bakedHeight] -> [-1, 1]
        // Z: [-100, 100] -> [0, 1]
        projViewMatrix[0] = 1.0 / halfW;
        projViewMatrix[5] = 1.0 / halfH;
        projViewMatrix[10] = -1.0 / 200.0;
        projViewMatrix[12] = -centerX / halfW;
        projViewMatrix[13] = -centerY / halfH;
        projViewMatrix[14] = 0.5;
        projViewMatrix[15] = 1.0;

        this.#initBindGroupLayouts(gpuDevice);

        const commandEncoder = gpuDevice.createCommandEncoder({label: `BakeImpostor_${bakeName}`});
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    view: bakedGPUTexture.createView(),
                    clearValue: {r: 0, g: 0, b: 0, a: 0}, // 완전 투명 배경!
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: depthGPUTexture.createView(),
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        });

        const basicSampler = redGPUContext.resourceManager.basicSampler.gpuSampler;
        const emptyTextureView = redGPUContext.resourceManager.emptyBitmapTextureView;

        // 3. 모든 서브메시(줄기 + 잎사귀 등) 순차 렌더링!
        for (let i = 0; i < subMeshes.length; i++) {
            const sub = subMeshes[i];
            if (sub.lodIndex === 1) continue; // 빌보드 자체는 렌더링 제외

            const vertexGPU = sub.geometry.vertexBuffer?.gpuBuffer;
            if (!vertexGPU) continue;

            // 🌟 각 서브메시마다 독립된 유니폼 버퍼 및 바인드그룹 할당 (행렬 덮어쓰기 버그 완벽 방지!)
            const subUniformBuffer = gpuDevice.createBuffer({
                size: 144,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            const subUniformData = new Float32Array(36);
            subUniformData.set(projViewMatrix, 0); // 0~15
            subUniformData.set(sub.relativeModelMatrix, 16); // 16~31 (서브메시의 정확한 고유 상대 행렬)
            subUniformData[32] = -0.5; // lightDir.x
            subUniformData[33] = -1.0; // lightDir.y
            subUniformData[34] = -0.5; // lightDir.z
            subUniformData[35] = 0.0;

            gpuDevice.queue.writeBuffer(subUniformBuffer, 0, subUniformData.buffer);

            const subBindGroup0 = gpuDevice.createBindGroup({
                layout: this.#bakeBindGroupLayout0!,
                entries: [{binding: 0, resource: {buffer: subUniformBuffer}}],
            });

            const pipeline = this.#getOrCreatePipeline(gpuDevice, sub.geometry);

            const mat = sub.material;
            const texView = mat?.baseColorTexture?.gpuTexture?.createView()
                || mat?.diffuseTexture?.gpuTexture?.createView()
                || emptyTextureView;

            const bindGroup1 = gpuDevice.createBindGroup({
                layout: this.#bakeBindGroupLayout1!,
                entries: [
                    {binding: 0, resource: basicSampler},
                    {binding: 1, resource: texView},
                ],
            });

            renderPass.setPipeline(pipeline);
            renderPass.setBindGroup(0, subBindGroup0);
            renderPass.setBindGroup(1, bindGroup1);
            renderPass.setVertexBuffer(0, vertexGPU);

            if (sub.isIndexed && sub.geometry.indexBuffer?.gpuBuffer) {
                renderPass.setIndexBuffer(sub.geometry.indexBuffer.gpuBuffer, sub.indexFormat || 'uint32');
                renderPass.drawIndexed(sub.indexCount);
            } else {
                renderPass.draw(sub.vertexCount);
            }
        }

        renderPass.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);

        // 4. DirectTexture 래핑
        const uniqueCacheKey = `FoliageImpostorDirectTexture_${bakeName}_${Math.random()}`;
        const bakedTexture = new DirectTexture(redGPUContext, uniqueCacheKey, bakedGPUTexture);

        console.log(`[FoliageImpostorBaker 📸] Successfully baked ${subMeshes.length} submeshes of '${bakeName}' into ${resolution}x${resolution} Impostor Texture! Size: ${bakedWidth.toFixed(2)}m x ${bakedHeight.toFixed(2)}m (AABB: X[${aabb.min[0].toFixed(2)}~${aabb.max[0].toFixed(2)}], Y[${aabb.min[1].toFixed(2)}~${aabb.max[1].toFixed(2)}])`);

        return {
            texture: bakedTexture,
            width: bakedWidth,
            height: bakedHeight,
            depth: aabb.depth,
            bottomOffset: aabb.min[1]
        };
    }

    static #initBindGroupLayouts(gpuDevice: GPUDevice): void {
        if (this.#bakeBindGroupLayout0) return;

        this.#bakeBindGroupLayout0 = gpuDevice.createBindGroupLayout({
            label: 'ImpostorBake_BGL0',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {type: 'uniform'},
                },
            ],
        });

        this.#bakeBindGroupLayout1 = gpuDevice.createBindGroupLayout({
            label: 'ImpostorBake_BGL1',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {type: 'filtering'},
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {sampleType: 'float'},
                },
            ],
        });
    }

    static #getOrCreatePipeline(gpuDevice: GPUDevice, geometry: any): GPURenderPipeline {
        const interleavedStruct = geometry.vertexBuffer?.interleavedStruct;
        const stride = interleavedStruct?.arrayStride || 48;
        const key = `BakePipeline_${stride}`;

        let pipeline = this.#bakePipelineCache.get(key);
        if (pipeline) return pipeline;

        const shaderModule = gpuDevice.createShaderModule({
            label: 'ImpostorBakeShader',
            code: impostorBakeShaderWGSL,
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            bindGroupLayouts: [this.#bakeBindGroupLayout0!, this.#bakeBindGroupLayout1!],
        });

        const attributes: GPUVertexAttribute[] = interleavedStruct?.attributes || [
            {shaderLocation: 0, offset: 0, format: 'float32x3'},
            {shaderLocation: 1, offset: 12, format: 'float32x3'},
            {shaderLocation: 2, offset: 24, format: 'float32x2'},
        ];

        pipeline = gpuDevice.createRenderPipeline({
            label: `ImpostorBake_Pipeline_${stride}`,
            layout: pipelineLayout,
            vertex: {
                module: shaderModule,
                entryPoint: 'vs_main',
                buffers: [
                    {
                        arrayStride: stride,
                        attributes: attributes,
                    },
                ],
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fs_main',
                targets: [
                    {
                        format: 'rgba8unorm',
                        blend: {
                            color: {
                                srcFactor: 'src-alpha',
                                dstFactor: 'one-minus-src-alpha',
                                operation: 'add',
                            },
                            alpha: {
                                srcFactor: 'one',
                                dstFactor: 'one-minus-src-alpha',
                                operation: 'add',
                            },
                        },
                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
        });

        this.#bakePipelineCache.set(key, pipeline);
        return pipeline;
    }
}
