import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../context/RedGPUContext";
import Mesh from "../../../mesh/Mesh";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import {FoliageSubMesh} from "../FoliageType";
import impostorBakeShaderWGSL from "./shader/impostorBake.wgsl";
import getMipLevelCount from "../../../../utils/texture/getMipLevelCount";
import {COMMAND_ENCODER_TYPE} from "../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

export interface FoliageBakeResult {
    texture: DirectTexture;
    width: number;
    height: number;
    depth: number;
    bottomOffset: number;
}

/**
 * [KO] 언리얼 엔진 5 스타일 식생 자동 임포스터 캡처/베이커 (Foliage Impostor Baker)
 *      3-Way 아틀라스 (Front View + Side View + Top-Down View)를 단일 텍스처로 자동 베이킹합니다.
 * [EN] Unreal Engine 5 style Foliage Impostor Baker that captures Front, Side, and Top-Down views into a 3-Way texture atlas.
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
     * [KO] 줄기(Trunk)와 나뭇잎(Leaf)을 포함한 모든 서브메시지를 3-Way 아틀라스(Front + Side + Top-Down)로 자동 베이킹합니다.
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

        // 🌟 나무의 실제 최대 반경 및 높이 산출 (1% 최소 마진으로 해상도 100% 활용)
        const maxRadialExtent = Math.max(
            Math.abs(aabb.min[0]),
            Math.abs(aabb.max[0]),
            Math.abs(aabb.min[2]),
            Math.abs(aabb.max[2]),
            0.5
        ) * 1.02;

        const bakedWidth = maxRadialExtent * 2.0;
        const bakedHeight = Math.max(aabb.max[1] - aabb.min[1], 0.1) * 1.02;
        const bottomY = aabb.min[1];
        const topY = bottomY + bakedHeight;
        const centerY = (bottomY + topY) * 0.5;

        // 🌟 3-Way 가로 아틀라스: Front(0) + Side(1) + Top-Down(2)
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

        // 🌟 3-Plane Star: 0°, 60°, 120° 3방향 수평 회전 투영 뷰 행렬 생성
        const angles = [0, Math.PI / 3, (2 * Math.PI) / 3]; // 0°, 60°, 120°
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
                depthStoreOp: 'store',
            },
        });

        const basicSampler = redGPUContext.resourceManager.basicSampler.gpuSampler;
        const emptyTextureView = redGPUContext.resourceManager.emptyBitmapTextureView;

        for (let v = 0; v < renderPassViews.length; v++) {
            const pv = renderPassViews[v];
            renderPass.setViewport(pv.vpX, pv.vpY, resolution, resolution, 0.0, 1.0);
            renderPass.setScissorRect(pv.vpX, pv.vpY, resolution, resolution);

            for (let i = 0; i < subMeshes.length; i++) {
                const sub = subMeshes[i];
                if (sub.lodIndex === 1) continue;

                const vertexGPU = sub.geometry.vertexBuffer?.gpuBuffer;
                if (!vertexGPU) continue;

                const subUniformBuffer = gpuDevice.createBuffer({
                    size: 144,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                });

                const subUniformData = new Float32Array(36);
                subUniformData.set(pv.projView, 0); // 0~15
                subUniformData.set(sub.relativeModelMatrix, 16); // 16~31
                subUniformData[32] = pv.lightDir[0];
                subUniformData[33] = pv.lightDir[1];
                subUniformData[34] = pv.lightDir[2];
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
        }

        renderPass.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);

        // 🌟 10단계 Mipmap 체인 자동 생성 (원거리 텍스처 캐시 미스 및 화면 지글거림 완전 제거)
        if (mipLevelCount > 1) {
            redGPUContext.resourceManager.mipmapGenerator.generateMipmap(
                bakedGPUTexture,
                {
                    size: [atlasWidth, atlasHeight, 1],
                    mipLevelCount,
                    format: 'rgba8unorm',
                    usage: 0
                },
                false,
                COMMAND_ENCODER_TYPE.IMMEDIATE
            );
        }

        const uniqueCacheKey = `FoliageImpostorDirectTexture_${bakeName}_${Math.random()}`;
        const bakedTexture = new DirectTexture(redGPUContext, uniqueCacheKey, bakedGPUTexture);

        console.log(`[FoliageImpostorBaker 📸] Successfully baked 3-Way Atlas (Front + Side + Top-Down, ${atlasWidth}x${atlasHeight}, ${mipLevelCount} Mip levels) for '${bakeName}'! Size: ${bakedWidth.toFixed(2)}m x ${bakedHeight.toFixed(2)}m`);

        // 🌟 브라우저 화면 좌측 상단에 실시간 3-Way 베이킹 아틀라스 2D 캔버스 표시
        if (typeof document !== 'undefined') {
            this.#debugDumpToCanvas(redGPUContext, bakedGPUTexture, atlasWidth, atlasHeight, bakeName);
        }

        return {
            texture: bakedTexture,
            width: bakedWidth,
            height: bakedHeight,
            depth: bakedWidth,
            bottomOffset: bottomY
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

    static async #debugDumpToCanvas(
        redGPUContext: RedGPUContext,
        gpuTexture: GPUTexture,
        width: number,
        height: number,
        name: string
    ): Promise<void> {
        const gpuDevice = redGPUContext.gpuDevice;
        const bytesPerRow = Math.ceil((width * 4) / 256) * 256;
        const bufferSize = bytesPerRow * height;

        const readBuffer = gpuDevice.createBuffer({
            size: bufferSize,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        });

        const commandEncoder = gpuDevice.createCommandEncoder();
        commandEncoder.copyTextureToBuffer(
            {texture: gpuTexture},
            {buffer: readBuffer, bytesPerRow: bytesPerRow, rowsPerImage: height},
            {width, height, depthOrArrayLayers: 1}
        );
        gpuDevice.queue.submit([commandEncoder.finish()]);

        await readBuffer.mapAsync(GPUMapMode.READ);
        const arrayBuffer = readBuffer.getMappedRange();
        const srcData = new Uint8Array(arrayBuffer);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.position = 'fixed';
        canvas.style.top = '10px';
        canvas.style.left = '10px';
        canvas.style.width = '384px';
        canvas.style.height = '128px';
        canvas.style.border = '2px solid #00ff66';
        canvas.style.borderRadius = '4px';
        canvas.style.background = '#1a1a1a';
        canvas.style.zIndex = '999999';
        canvas.style.boxShadow = '0 4px 16px rgba(0,0,0,0.8)';
        canvas.title = `Baked Impostor Atlas: ${name} (Front | Side | Top-Down)`;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            const imgData = ctx.createImageData(width, height);
            for (let y = 0; y < height; y++) {
                const srcRowOffset = y * bytesPerRow;
                const dstRowOffset = y * width * 4;
                for (let x = 0; x < width; x++) {
                    const r = srcData[srcRowOffset + x * 4 + 0];
                    const g = srcData[srcRowOffset + x * 4 + 1];
                    const b = srcData[srcRowOffset + x * 4 + 2];
                    const a = srcData[srcRowOffset + x * 4 + 3];

                    const dstIdx = dstRowOffset + x * 4;
                    if (a > 10) {
                        // 🌿 실제 캡처된 수목 픽셀 (RGB 선명하게 표시)
                        imgData.data[dstIdx + 0] = r;
                        imgData.data[dstIdx + 1] = g;
                        imgData.data[dstIdx + 2] = b;
                        imgData.data[dstIdx + 3] = 255;
                    } else {
                        // 🏁 투명 배경 영역 (체커보드 패턴으로 투명 영역 명확히 구분)
                        const checker = ((Math.floor(x / 16) + Math.floor(y / 16)) % 2 === 0) ? 60 : 40;
                        imgData.data[dstIdx + 0] = checker;
                        imgData.data[dstIdx + 1] = checker;
                        imgData.data[dstIdx + 2] = checker;
                        imgData.data[dstIdx + 3] = 255;
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0);

            // 🌟 3개 뷰포트 구분선 (Front | Side | Top-Down) 그리기
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            const thirdW = width / 3;
            ctx.beginPath();
            ctx.moveTo(thirdW, 0);
            ctx.lineTo(thirdW, height);
            ctx.moveTo(thirdW * 2, 0);
            ctx.lineTo(thirdW * 2, height);
            ctx.stroke();

            // 텍스트 라벨 표기
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
}

