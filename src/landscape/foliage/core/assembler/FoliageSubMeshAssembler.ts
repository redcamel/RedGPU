import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../context/RedGPUContext";
import Mesh from "../../../../display/mesh/Mesh";
import {createOctahedralImpostorGeometry} from "../impostor/octahedral/createOctahedralImpostorGeometry";
import OctahedralImpostorMaterial from "../impostor/octahedral/OctahedralImpostorMaterial";
import FoliageImpostorBaker from "../impostor/FoliageImpostorBaker";
import FoliageSubMesh from "../submesh/FoliageSubMesh";
import FoliageShadowMergedSubMesh from "../submesh/FoliageShadowMergedSubMesh";
import type {FoliageLODInfo, FoliageOptions} from "../Foliage";
import type {FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";
import LandscapeMeshCombiner, {
    PBR_STRIDE_BYTES,
    POSITION_ONLY_STRIDE_BYTES
} from "../../../core/geometry/LandscapeMeshCombiner";

export interface FoliageAssemblyResult {
    subMeshes: FoliageSubMesh[];
    shadowMergedSubMeshes: FoliageShadowMergedSubMesh[];
    lodInfoList: FoliageLODInfo[];
    bottomOffset: number;
    boundingRadius: number;
    boundingHeight: number;
}

const subMeshUniformData: Float32Array = new Float32Array(52);
const subMeshUniformUint32: Uint32Array = new Uint32Array(subMeshUniformData.buffer);
const identityMatrix: mat4 = mat4.create();

/**
 * [KO] Foliage 계층 모델의 서브메쉬들을 공용 지오메트리 결합기(LandscapeMeshCombiner)를 통해 단일 통합 버퍼로 조립하고, 임포스터 및 섀도우 지오메트리를 생성하는 조립 클래스입니다.
 * [EN] Assembler class that combines sub-meshes of Foliage hierarchical models into unified buffers via the shared LandscapeMeshCombiner, and generates impostor and shadow geometries.
 */
class FoliageSubMeshAssembler {

    static assemble(
        redGPUContext: RedGPUContext,
        options: FoliageOptions,
        subMeshBindGroupLayout: GPUBindGroupLayout
    ): FoliageAssemblyResult {
        const gpuDevice = redGPUContext.gpuDevice;
        const subList: FoliageSubMesh[] = [];
        const lodInfoList: FoliageLODInfo[] = [];

        if (!gpuDevice || !subMeshBindGroupLayout) {
            return {
                subMeshes: subList,
                shadowMergedSubMeshes: [],
                lodInfoList: [],
                bottomOffset: 0,
                boundingRadius: 10.0,
                boundingHeight: 10.0
            };
        }

        const useImpostor = options.useImpostor !== undefined
            ? options.useImpostor
            : true;
        const lodConfigs = options.lods || [];
        const numLODs = Math.min(lodConfigs.length, 8);

        const shadowMergedSubMeshes: FoliageShadowMergedSubMesh[] = [];
        const subMeshUniformCache = new Map<string, { buffer: GPUBuffer; bindGroup: GPUBindGroup }>();

        for (let l = 0; l < numLODs; l++) {
            const lodCfg = lodConfigs[l];
            const lodMeshes = Array.isArray(lodCfg.mesh) ? lodCfg.mesh : [lodCfg.mesh];
            const startSubOffset = subList.length;

            const lodReceiveShadow = lodCfg.receiveShadow !== false;

            const assembled = FoliageSubMeshAssembler.#assembleMeshList(
                redGPUContext,
                lodMeshes,
                l,
                options,
                subMeshBindGroupLayout,
                subMeshUniformCache,
                lodReceiveShadow
            );

            const assembledSubMeshes = assembled.subMeshes;
            for (let s = 0; s < assembledSubMeshes.length; s++) {
                subList.push(assembledSubMeshes[s]);
            }

            if (assembled.shadowMergedSubMesh) {
                shadowMergedSubMeshes.push(assembled.shadowMergedSubMesh);
            }

            const subCountForThisLOD = subList.length - startSubOffset;
            const defaultDist = (l === 0) ? 80.0 : (80.0 * Math.pow(2.5, l));
            const switchDist = lodCfg.lodDistance ?? defaultDist;

            lodInfoList.push({
                lodIndex: l,
                lodDistance: switchDist,
                subMeshOffset: startSubOffset,
                subMeshCount: subCountForThisLOD,
                receiveShadow: lodReceiveShadow,
            });
        }

        if (useImpostor && subList.length > 0) {
            const impostorLODIndex = lodInfoList.length;
            const lod0SubMeshes: FoliageSubMesh[] = [];
            for (let i = 0; i < subList.length; i++) {
                if (subList[i].lodIndex === 0) {
                    lod0SubMeshes.push(subList[i]);
                }
            }

            FoliageSubMeshAssembler.#buildAndAttachImpostor(
                redGPUContext,
                gpuDevice,
                subMeshBindGroupLayout,
                options,
                lod0SubMeshes,
                subList,
                lodInfoList,
                impostorLODIndex,
                subMeshUniformCache
            );
        }

        let maxDistSq = 0;
        let minY = Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < subList.length; i++) {
            const sub = subList[i];
            if (sub.isImpostor) continue;

            const vBuffer = sub.geometry?.vertexBuffer;
            const vData = vBuffer?.data;
            if (vData) {
                const stride = (vBuffer.stride || (vBuffer.interleavedStruct?.arrayStride ? vBuffer.interleavedStruct.arrayStride / 4 : 18));
                const count = vBuffer.vertexCount ?? 0;
                for (let v = 0; v < count; v++) {
                    const idx = v * stride;
                    const vx = vData[idx];
                    const vy = vData[idx + 1];
                    const vz = vData[idx + 2];
                    const dSq = vx * vx + vy * vy + vz * vz;
                    if (dSq > maxDistSq) maxDistSq = dSq;
                    if (vy < minY) minY = vy;
                    if (vy > maxY) maxY = vy;
                }
            }
        }

        const boundingRadius = Math.sqrt(maxDistSq);
        const boundingHeight = (isFinite(minY) && isFinite(maxY) && maxY > minY)
            ? (maxY - minY)
            : (boundingRadius > 0 ? boundingRadius * 2.0 : 1.0);

        const userOffset = options.bottomOffset;
        const finalBottomOffset = userOffset !== undefined ? userOffset : 0;

        return {
            subMeshes: subList,
            shadowMergedSubMeshes,
            lodInfoList,
            bottomOffset: finalBottomOffset,
            boundingRadius,
            boundingHeight,
        };
    }

    static #prepareFoliageMaterials(node: Mesh): void {
        if (!node) return;
        if (node.material) {
            const mat = node.material as any;
            const isMasked = !!mat.useCutOff || mat.alphaBlend === 1 || mat.alphaBlend === 2 || !!mat.transparent;
            mat.isFoliage = true;
            if (isMasked) {
                mat.useCutOff = true;
                mat.cutOff = (mat.cutOff > 0) ? mat.cutOff : 0.3333;
                mat.doubleSided = true;
                mat.alphaBlend = 1;
                mat.transparent = false;
            } else {
                mat.useCutOff = false;
                mat.doubleSided = false;
                mat.alphaBlend = 0;
                mat.transparent = false;
            }
            mat.dirtyPipeline = true;

            if (mat.dirtyPipeline || !mat.gpuRenderInfo?.fragmentShaderModule || !mat.gpuRenderInfo?.fragmentUniformBindGroup) {
                mat._updateFragmentState?.();
                mat.dirtyPipeline = false;
            }
        }
        const children = node.children;
        if (children && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                FoliageSubMeshAssembler.#prepareFoliageMaterials(children[i] as Mesh);
            }
        }
    }

    static #assembleMeshList(
        redGPUContext: RedGPUContext,
        roots: Mesh[],
        lodIndex: number,
        options: FoliageOptions,
        subMeshBindGroupLayout: GPUBindGroupLayout,
        subMeshUniformCache?: Map<string, { buffer: GPUBuffer; bindGroup: GPUBindGroup }>,
        lodReceiveShadow: boolean = true
    ): {
        subMeshes: FoliageSubMesh[];
        shadowMergedSubMesh: FoliageShadowMergedSubMesh | null;
    } {
        const gpuDevice = redGPUContext.gpuDevice;

        for (let r = 0; r < roots.length; r++) {
            FoliageSubMeshAssembler.#prepareFoliageMaterials(roots[r]);
        }

        const combineResult = LandscapeMeshCombiner.combine(
            redGPUContext,
            roots,
            {
                preservePivot: options.preservePivot ?? true,
                centerXZ: true,
                generateShadowMergedGeometry: true
            }
        );

        if (combineResult.groups.length === 0) {
            return {subMeshes: [], shadowMergedSubMesh: null};
        }

        const resultSubMeshes: FoliageSubMesh[] = [];

        for (let g = 0; g < combineResult.groups.length; g++) {
            const group = combineResult.groups[g];
            const maxPrepassLOD = 0;
            const combinedSubMesh = FoliageSubMeshAssembler.#createSubMeshInstance(
                gpuDevice,
                subMeshBindGroupLayout,
                group.rawNodes[0]?.node,
                group.geometry,
                group.material,
                identityMatrix,
                identityMatrix,
                PBR_STRIDE_BYTES,
                lodIndex,
                false,
                0,
                lodReceiveShadow,
                subMeshUniformCache,
                maxPrepassLOD,
                options.groundBlendStrength,
                options.groundBlendRange
            );

            resultSubMeshes.push(combinedSubMesh);
        }

        let shadowMergedSubMesh: FoliageShadowMergedSubMesh | null = null;
        if (combineResult.shadowMergedGeometry && combineResult.totalVertexCount > 0) {
            const shadowUniform = FoliageSubMeshAssembler.#createShadowUniform(
                gpuDevice,
                subMeshBindGroupLayout,
                options.name,
                lodIndex
            );

            shadowMergedSubMesh = new FoliageShadowMergedSubMesh({
                geometry: combineResult.shadowMergedGeometry,
                indexCount: combineResult.totalIndexCount,
                vertexCount: combineResult.totalVertexCount,
                isIndexed: true,
                indexFormat: 'uint32',
                strideBytes: POSITION_ONLY_STRIDE_BYTES,
                vertexUniformBuffer: shadowUniform.buffer,
                vertexUniformBindGroup: shadowUniform.bindGroup,
                lodIndex,
                instanceBufferOffset: 0,
                indirectOffsetBytes: 0,
            });
        }

        return {
            subMeshes: resultSubMeshes,
            shadowMergedSubMesh,
        };
    }

    static #createShadowUniform(
        gpuDevice: GPUDevice,
        subMeshBindGroupLayout: GPUBindGroupLayout,
        name: string,
        lodIndex: number
    ): { buffer: GPUBuffer; bindGroup: GPUBindGroup } {
        const uniformBuffer = gpuDevice.createBuffer({
            label: `Foliage_ShadowSubMesh_UniformBuffer_${name}_LOD${lodIndex}`,
            size: 208,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const floatView = subMeshUniformData;
        const uintView = subMeshUniformUint32;
        floatView.set(identityMatrix, 0);
        floatView.set(identityMatrix, 16);
        uintView[32] = 0;
        uintView[33] = 0;
        floatView[34] = 0.0;
        uintView[35] = 0;

        floatView[36] = 1.0;
        floatView[37] = 0.5;
        floatView[38] = 1.5;
        floatView[39] = 0.8;
        floatView[40] = 0.1;
        floatView[41] = 0.3;
        uintView[42] = 1;
        floatView[43] = 1.0;
        floatView[44] = 0.5;
        uintView[45] = 0;
        floatView[46] = 5.0;
        uintView[47] = 0;

        floatView[48] = 0.0;
        floatView[49] = 1.5;
        floatView[50] = 0.0;
        floatView[51] = 0.0;

        gpuDevice.queue.writeBuffer(uniformBuffer, 0, floatView.buffer, floatView.byteOffset, 208);

        const vertexBindGroup = gpuDevice.createBindGroup({
            label: `Foliage_ShadowSubMesh_BindGroup_${name}_LOD${lodIndex}`,
            layout: subMeshBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: uniformBuffer,
                    },
                },
            ],
        });

        return {buffer: uniformBuffer, bindGroup: vertexBindGroup};
    }

    static #buildAndAttachImpostor(
        redGPUContext: RedGPUContext,
        gpuDevice: GPUDevice,
        subMeshBindGroupLayout: GPUBindGroupLayout,
        options: FoliageOptions,
        sourceSubMeshes: FoliageSubMesh[],
        subList: FoliageSubMesh[],
        lodInfoList: FoliageLODInfo[],
        impostorLODIndex: number,
        subMeshUniformCache?: Map<string, { buffer: GPUBuffer; bindGroup: GPUBindGroup }>
    ): void {
        const bakeResult = FoliageImpostorBaker.bakeSubMeshes(redGPUContext, sourceSubMeshes, options.name);

        const bbWidth = bakeResult.width;
        const bbHeight = bakeResult.height;
        const bbBottomOffset = bakeResult.bottomOffset ?? 0;

        const bbGeom = createOctahedralImpostorGeometry(redGPUContext, bbWidth, bbHeight, bbBottomOffset);
        const bbMat = new OctahedralImpostorMaterial(redGPUContext, bakeResult.baseColorTexture, bakeResult.normalTexture, bakeResult.packedORMTexture, `${options.name}_OctahedralMat`, 8.0);

        const bbStartOffset = subList.length;
        const bbSubMesh = FoliageSubMeshAssembler.#createSubMeshInstance(
            gpuDevice,
            subMeshBindGroupLayout,
            sourceSubMeshes[0]?.mesh,
            bbGeom,
            bbMat,
            mat4.create(),
            mat4.create(),
            PBR_STRIDE_BYTES,
            impostorLODIndex,
            true,
            bbBottomOffset,
            false,
            subMeshUniformCache
        );
        subList.push(bbSubMesh);

        lodInfoList.push({
            lodIndex: impostorLODIndex,
            lodDistance: 1000000.0,
            subMeshOffset: bbStartOffset,
            subMeshCount: 1,
            receiveShadow: false,
        });
    }

    static #createSubMeshInstance(
        gpuDevice: GPUDevice,
        subMeshBindGroupLayout: GPUBindGroupLayout,
        meshNode: Mesh,
        geom: any,
        mat: any,
        relMatrix: mat4,
        normMatrix: mat4,
        strideBytes: number,
        lodIndex: number = 0,
        isImpostorOverride: boolean = false,
        bottomOffset: number = 0,
        receiveShadow: boolean = true,
        uniformCache?: Map<string, { buffer: GPUBuffer; bindGroup: GPUBindGroup }>,
        maxPrepassLOD: number = 0,
        groundBlendStrength?: number,
        groundBlendRange?: number
    ): FoliageSubMesh {
        const isIndexed = !!geom.indexBuffer;
        const indexCount = geom.indexBuffer?.indexCount ?? 0;
        const vertexCount = geom.vertexBuffer?.vertexCount ?? 0;

        const isImpostor = isImpostorOverride || mat instanceof OctahedralImpostorMaterial || mat?.constructor?.name === 'OctahedralImpostorMaterial' || (typeof mat?.name === 'string' && mat.name.includes('Octahedral'));
        const isMasked = !!mat.useCutOff || mat.alphaBlend === 1 || mat.alphaBlend === 2 || !!mat.transparent || isImpostor;

        const globalSlot = (mat as any)?.globalFragmentSlotIndex ?? 0;
        const cacheKey = `${globalSlot}_${receiveShadow ? 1 : 0}_${isMasked ? 1 : 0}`;

        let uniformBuffer: GPUBuffer;
        let vertexBindGroup: GPUBindGroup;

        if (uniformCache && uniformCache.has(cacheKey)) {
            const cached = uniformCache.get(cacheKey)!;
            uniformBuffer = cached.buffer;
            vertexBindGroup = cached.bindGroup;
        } else {
            uniformBuffer = gpuDevice.createBuffer({
                label: `Foliage_SubMesh_UniformBuffer_${globalSlot}`,
                size: 208,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            const floatView = subMeshUniformData;
            const uintView = subMeshUniformUint32;

            floatView.set(relMatrix, 0);
            floatView.set(normMatrix, 16);
            uintView[32] = globalSlot;

            const isIdentity = (
                relMatrix[0] === 1 && relMatrix[1] === 0 && relMatrix[2] === 0 && relMatrix[3] === 0 &&
                relMatrix[4] === 0 && relMatrix[5] === 1 && relMatrix[6] === 0 && relMatrix[7] === 0 &&
                relMatrix[8] === 0 && relMatrix[9] === 0 && relMatrix[10] === 1 && relMatrix[11] === 0 &&
                relMatrix[12] === 0 && relMatrix[13] === 0 && relMatrix[14] === 0 && relMatrix[15] === 1
            );
            uintView[33] = isIdentity ? 0 : 1;
            floatView[34] = receiveShadow ? 1.0 : 0.0;
            uintView[35] = 0;

            floatView[36] = 1.0;
            floatView[37] = 0.5;
            floatView[38] = 1.5;
            floatView[39] = 0.8;
            floatView[40] = 0.1;
            floatView[41] = 0.3;
            uintView[42] = 1;
            floatView[43] = 1.0;
            floatView[44] = isMasked ? 1.0 : 0.0;
            uintView[45] = 0;
            floatView[46] = 5.0;
            uintView[47] = 0;

            const applyGroundBlend = !isImpostor;
            floatView[48] = applyGroundBlend ? (groundBlendStrength ?? 0.8) : 0.0;
            floatView[49] = groundBlendRange ?? 1.5;
            floatView[50] = 0.0;
            floatView[51] = 0.0;

            gpuDevice.queue.writeBuffer(uniformBuffer, 0, floatView.buffer, floatView.byteOffset, 208);

            vertexBindGroup = gpuDevice.createBindGroup({
                label: `Foliage_SubMesh_BindGroup_${globalSlot}`,
                layout: subMeshBindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: {buffer: uniformBuffer}
                    }
                ]
            });

            if (uniformCache) {
                uniformCache.set(cacheKey, {buffer: uniformBuffer, bindGroup: vertexBindGroup});
            }
        }

        const hasBaseColorTexture = !!(mat.baseColorTexture?.gpuTexture || mat.baseColorTexture?.src || mat.baseColorTexture?.url || (mat.diffuseTexture && (mat.diffuseTexture.gpuTexture || mat.diffuseTexture.src || mat.diffuseTexture.url)));

        const isMaskedFoliage = !isImpostor && isMasked && hasBaseColorTexture;
        const isDepthPrepass = isMaskedFoliage && (lodIndex <= maxPrepassLOD);
        const isMainOpaqueOrMasked = true;
        const mainDepthMode: FoliageDepthPassMode = isDepthPrepass ? 'mainShadingAfterDepth' : 'normal';

        return new FoliageSubMesh({
            mesh: meshNode,
            geometry: geom,
            material: mat,
            indexCount,
            vertexCount,
            isIndexed,
            indexFormat: geom.indexBuffer?.format || 'uint32',
            strideBytes,
            bottomOffset,
            relativeModelMatrix: relMatrix,
            relativeNormalMatrix: normMatrix,
            vertexUniformBuffer: uniformBuffer,
            vertexUniformBindGroup: vertexBindGroup,
            lodIndex,
            isDepthPrepass,
            isMainOpaqueOrMasked,
            isMasked,
            mainDepthMode,
            isImpostor,
            receiveShadow,
            instanceBufferOffset: 0,
            indirectOffsetBytes: 0,
        });
    }
}

Object.freeze(FoliageSubMeshAssembler);
export default FoliageSubMeshAssembler;
