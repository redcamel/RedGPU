import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import Mesh from "../../../../mesh/Mesh";
import Geometry from "../../../../../geometry/Geometry";
import VertexBuffer from "../../../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../../../resources/buffer/indexBuffer/IndexBuffer";
import GPU_BLEND_FACTOR from "../../../../../gpuConst/GPU_BLEND_FACTOR";
import createCrossBillboardGeometry from "../impostor/crossBillboard/createCrossBillboardGeometry";
import CrossBillboardMaterial from "../impostor/crossBillboard/CrossBillboardMaterial";
import FoliageImpostorBaker from "../impostor/FoliageImpostorBaker";
import type {FoliageSubMesh, FoliageTypeOptions} from "../../FoliageType";

export interface FoliageAssemblyResult {
    subMeshes: FoliageSubMesh[];
    lod0SubMeshCount: number;
    bottomOffset: number;
}

interface RawSubMesh {
    node: Mesh;
    geometry: any;
    material: any;
    currentRelativeMatrix: mat4;
    normalMatrix: mat4;
    strideBytes: number;
    rawStride: number;
}

/**
 * [KO] 식생 메시 계층 구조 DFS 탐색 & 머티리얼별 서브메시 병합 조립기 (단일 책임: 지오메트리/머티리얼 병합 & 서브메시 유니폼 생성)
 * [EN] Foliage Mesh Hierarchy DFS Explorer & Material SubMesh Assembler (Single Responsibility: Geometry/Material Combine & Uniform Setup)
 */
class FoliageSubMeshAssembler {
    // 🌟 Zero-GC: 서브메시 유니폼(144 bytes) 패킹용 정적 재사용 버퍼
    static readonly #subMeshUniformData: Float32Array = new Float32Array(36);
    static readonly #subMeshUniformUint32: Uint32Array = new Uint32Array(FoliageSubMeshAssembler.#subMeshUniformData.buffer);
    static readonly #tempLocalMatrix: mat4 = mat4.create();

    static assemble(
        redGPUContext: RedGPUContext,
        options: FoliageTypeOptions,
        subMeshBindGroupLayout: GPUBindGroupLayout
    ): FoliageAssemblyResult {
        const gpuDevice = redGPUContext.gpuDevice;
        const subList: FoliageSubMesh[] = [];
        if (!gpuDevice || !subMeshBindGroupLayout) {
            return {subMeshes: subList, lod0SubMeshCount: 0, bottomOffset: 0};
        }

        const roots = Array.isArray(options.mesh) ? options.mesh : [options.mesh];
        const rawList: RawSubMesh[] = [];

        const computeMeshLocalMatrix = (mesh: Mesh, out: mat4): mat4 => {
            const x = mesh.x ?? 0;
            const y = mesh.y ?? 0;
            const z = mesh.z ?? 0;
            const radX = (mesh.rotationX ?? 0) * (Math.PI / 180);
            const radY = (mesh.rotationY ?? 0) * (Math.PI / 180);
            const radZ = (mesh.rotationZ ?? 0) * (Math.PI / 180);
            const sX = mesh.scaleX ?? 1;
            const sY = mesh.scaleY ?? 1;
            const sZ = mesh.scaleZ ?? 1;

            out[12] = x;
            out[13] = y;
            out[14] = z;
            out[15] = 1;

            const aSx = Math.sin(radX), aCx = Math.cos(radX);
            const aSy = Math.sin(radY), aCy = Math.cos(radY);
            const aSz = Math.sin(radZ), aCz = Math.cos(radZ);

            const b00 = aCy * aCz;
            const b01 = aCx * aSz + aSx * aSy * aCz;
            const b02 = aSx * aSz - aCx * aSy * aCz;

            const b10 = -aCy * aSz;
            const b11 = aCx * aCz - aSx * aSy * aSz;
            const b12 = aSx * aCz + aCx * aSy * aSz;

            const b20 = aSy;
            const b21 = -aSx * aCy;
            const b22 = aCx * aCy;

            out[0] = b00 * sX;
            out[1] = b01 * sX;
            out[2] = b02 * sX;
            out[3] = 0;

            out[4] = b10 * sY;
            out[5] = b11 * sY;
            out[6] = b12 * sY;
            out[7] = 0;

            out[8] = b20 * sZ;
            out[9] = b21 * sZ;
            out[10] = b22 * sZ;
            out[11] = 0;

            return out;
        };

        const traverse = (node: Mesh, parentRelativeMatrix: mat4, isRoot: boolean) => {
            if (!node) return;

            const currentRelativeMatrix = mat4.create();
            if (isRoot) {
                mat4.identity(currentRelativeMatrix);
            } else {
                computeMeshLocalMatrix(node, FoliageSubMeshAssembler.#tempLocalMatrix);
                mat4.multiply(currentRelativeMatrix, parentRelativeMatrix, FoliageSubMeshAssembler.#tempLocalMatrix);
            }

            if (node.geometry && node.material) {
                const mat = node.material;

                // 🌲 UE5 표준 식생 최적화: BLEND/반투명 머티리얼을 MASK(알파 컷오프)로 자동 승격
                if (options.convertBlendToMasked) {
                    if (mat.alphaBlend === 2 || mat.transparent || mat.alphaMode === 'BLEND' || mat.alphaMode === 'MASK') {
                        mat.useCutOff = true;
                        if (!mat.cutOff || mat.cutOff === 0) {
                            mat.cutOff = 0.5;
                        }
                        const {blendColorState, blendAlphaState} = mat;
                        if (blendColorState && blendAlphaState) {
                            blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE;
                            blendColorState.dstFactor = GPU_BLEND_FACTOR.ZERO;
                            blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE;
                            blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ZERO;
                        }
                        mat.transparent = false;
                        mat.alphaBlend = 1;
                    }
                }

                if (mat.dirtyPipeline || !mat.gpuRenderInfo?.fragmentShaderModule || !mat.gpuRenderInfo?.fragmentUniformBindGroup) {
                    mat._updateFragmentState();
                    mat.dirtyPipeline = false;
                }

                const geom = node.geometry;
                const rawStride = (geom.vertexBuffer as any)?.stride || 12;
                const strideBytes = rawStride * 4;

                const normalMatrix = mat4.create();
                mat4.invert(normalMatrix, currentRelativeMatrix);
                mat4.transpose(normalMatrix, normalMatrix);

                rawList.push({
                    node,
                    geometry: geom,
                    material: mat,
                    currentRelativeMatrix,
                    normalMatrix,
                    strideBytes,
                    rawStride,
                });
            }

            const children = node.children;
            if (children && children.length > 0) {
                for (let i = 0; i < children.length; i++) {
                    traverse(children[i] as Mesh, currentRelativeMatrix, false);
                }
            }
        };

        const identityParentMatrix = mat4.create();
        mat4.identity(identityParentMatrix);

        for (let r = 0; r < roots.length; r++) {
            traverse(roots[r], identityParentMatrix, true);
        }

        // 🌟 머티리얼별 서브메시 그룹화
        const getMaterialKey = (mat: any): string => {
            if (!mat) return 'default_mat';
            const matType = mat.constructor?.name || 'Material';
            const diffuseKey = mat.baseColorTexture?.src || mat.diffuseTexture?.src || mat.baseColorTexture?.url || mat.diffuseTexture?.url || (mat.baseColorTexture ? mat.baseColorTexture.uuid : '');
            const normalKey = mat.normalTexture?.src || mat.normalTexture?.url || (mat.normalTexture ? mat.normalTexture.uuid : '');
            const ormKey = mat.ormTexture?.src || mat.ormTexture?.url || (mat.ormTexture ? mat.ormTexture.uuid : '');
            return `${matType}_${diffuseKey}_${normalKey}_${ormKey}`;
        };

        const materialGroups = new Map<string, { material: any; raws: RawSubMesh[] }>();
        for (let i = 0; i < rawList.length; i++) {
            const raw = rawList[i];
            const matKey = getMaterialKey(raw.material);
            let entry = materialGroups.get(matKey);
            if (!entry) {
                entry = {material: raw.material, raws: []};
                materialGroups.set(matKey, entry);
            }
            entry.raws.push(raw);
        }

        const createSubMeshInstance = (
            meshNode: Mesh,
            geom: any,
            mat: any,
            relMatrix: mat4,
            normMatrix: mat4,
            strideBytes: number,
            lodIndex: number = 0
        ): FoliageSubMesh => {
            const isIndexed = !!geom.indexBuffer;
            const indexCount = geom.indexBuffer?.indexCount ?? 0;
            const vertexCount = geom.vertexBuffer?.vertexCount ?? 0;

            const uniformBuffer = gpuDevice.createBuffer({
                label: `FoliageSubMesh_UniformBuffer_${meshNode.name || subList.length}`,
                size: 144,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            const floatView = FoliageSubMeshAssembler.#subMeshUniformData;
            const uintView = FoliageSubMeshAssembler.#subMeshUniformUint32;

            floatView.set(relMatrix, 0);
            floatView.set(normMatrix, 16);
            uintView[32] = (mat as any)?.globalFragmentSlotIndex ?? 0;

            // 🌟 relMatrix가 항등 행렬(Identity)인지 고속 검사
            const isIdentity = (
                relMatrix[0] === 1 && relMatrix[1] === 0 && relMatrix[2] === 0 && relMatrix[3] === 0 &&
                relMatrix[4] === 0 && relMatrix[5] === 1 && relMatrix[6] === 0 && relMatrix[7] === 0 &&
                relMatrix[8] === 0 && relMatrix[9] === 0 && relMatrix[10] === 1 && relMatrix[11] === 0 &&
                relMatrix[12] === 0 && relMatrix[13] === 0 && relMatrix[14] === 0 && relMatrix[15] === 1
            );
            uintView[33] = isIdentity ? 0 : 1;
            uintView[34] = 0;
            uintView[35] = 0;

            gpuDevice.queue.writeBuffer(uniformBuffer, 0, floatView.buffer, floatView.byteOffset, 144);

            const vertexBindGroup = gpuDevice.createBindGroup({
                label: `FoliageSubMesh_VertexBindGroup_${meshNode.name || subList.length}`,
                layout: subMeshBindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: {buffer: uniformBuffer}
                    }
                ]
            });

            const isTransparent = !!mat.transparent || !!mat.use2PathRender;
            const isAlpha = (mat.alphaBlend === 2 || (mat.opacity !== undefined && mat.opacity < 1.0)) && !isTransparent;
            const isLOD0 = lodIndex === 0 || lodIndex === undefined;
            const isMasked = !!mat.useCutOff || (mat.cutOff !== undefined && mat.cutOff > 0);

            const isDepthPrepass = !isTransparent && !isAlpha && isLOD0 && isMasked;
            const isMainOpaqueOrMasked = !isTransparent && !isAlpha;
            const mainDepthMode = (isLOD0 && isMasked) ? 'mainShadingAfterDepth' : 'normal';

            return {
                mesh: meshNode,
                geometry: geom,
                material: mat,
                indexCount,
                vertexCount,
                isIndexed,
                indexFormat: geom.indexBuffer?.format || 'uint32',
                strideBytes,
                bottomOffset: 0,
                relativeModelMatrix: relMatrix,
                relativeNormalMatrix: normMatrix,
                vertexUniformBuffer: uniformBuffer,
                vertexUniformBindGroup: vertexBindGroup,
                lodIndex,
                isDepthPrepass,
                isMainOpaqueOrMasked,
                mainDepthMode,
                isAlpha,
                isTransparent,
            };
        };

        materialGroups.forEach((entry) => {
            const group = entry.raws;
            const mat = entry.material;
            if (!options.combineSubMeshesByMaterial || group.length === 1) {
                for (let g = 0; g < group.length; g++) {
                    const raw = group[g];
                    subList.push(createSubMeshInstance(
                        raw.node,
                        raw.geometry,
                        raw.material,
                        raw.currentRelativeMatrix,
                        raw.normalMatrix,
                        raw.strideBytes,
                        0
                    ));
                }
            } else {
                // 🌟 복수 서브메시 병합 (Combine SubMeshes by Material - LOD 0)
                let totalVertexCount = 0;
                let totalIndexCount = 0;
                const rawStride = group[0].rawStride;
                const interleavedStruct = group[0].geometry.vertexBuffer?.interleavedStruct;

                for (let g = 0; g < group.length; g++) {
                    const geom = group[g].geometry;
                    totalVertexCount += geom.vertexBuffer?.vertexCount ?? 0;
                    totalIndexCount += geom.indexBuffer?.indexCount ?? (geom.vertexBuffer?.vertexCount ?? 0);
                }

                const combinedVertexData = new Float32Array(totalVertexCount * rawStride);
                const combinedIndexData = new Uint32Array(totalIndexCount);

                let vertexOffset = 0;
                let indexOffset = 0;

                for (let g = 0; g < group.length; g++) {
                    const raw = group[g];
                    const geom = raw.geometry;
                    const srcVB = geom.vertexBuffer;
                    const srcIB = geom.indexBuffer;
                    const srcVData = srcVB?.data;
                    const srcIData = srcIB?.data;
                    const vCount = srcVB?.vertexCount ?? 0;

                    if (srcVData && vCount > 0) {
                        const m = raw.currentRelativeMatrix;
                        const n = raw.normalMatrix;

                        for (let v = 0; v < vCount; v++) {
                            const srcIdx = v * rawStride;
                            const dstIdx = (vertexOffset + v) * rawStride;

                            const x = srcVData[srcIdx + 0];
                            const y = srcVData[srcIdx + 1];
                            const z = srcVData[srcIdx + 2];

                            combinedVertexData[dstIdx + 0] = m[0] * x + m[4] * y + m[8] * z + m[12];
                            combinedVertexData[dstIdx + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
                            combinedVertexData[dstIdx + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];

                            if (rawStride >= 6) {
                                const nx = srcVData[srcIdx + 3];
                                const ny = srcVData[srcIdx + 4];
                                const nz = srcVData[srcIdx + 5];

                                let tx = n[0] * nx + n[4] * ny + n[8] * nz;
                                let ty = n[1] * nx + n[5] * ny + n[9] * nz;
                                let tz = n[2] * nx + n[6] * ny + n[10] * nz;
                                const len = Math.sqrt(tx * tx + ty * ty + tz * tz);
                                if (len > 0.000001) {
                                    tx /= len;
                                    ty /= len;
                                    tz /= len;
                                }

                                combinedVertexData[dstIdx + 3] = tx;
                                combinedVertexData[dstIdx + 4] = ty;
                                combinedVertexData[dstIdx + 5] = tz;
                            }

                            if (rawStride > 6) {
                                for (let k = 6; k < rawStride; k++) {
                                    combinedVertexData[dstIdx + k] = srcVData[srcIdx + k];
                                }
                            }
                        }
                    }

                    if (srcIData) {
                        const iCount = srcIB.indexCount;
                        for (let i = 0; i < iCount; i++) {
                            combinedIndexData[indexOffset + i] = srcIData[i] + vertexOffset;
                        }
                        indexOffset += iCount;
                    } else {
                        for (let i = 0; i < vCount; i++) {
                            combinedIndexData[indexOffset + i] = vertexOffset + i;
                        }
                        indexOffset += vCount;
                    }

                    vertexOffset += vCount;
                }

                const vKey = `FoliageCombinedVB_${options.name}_${mat.name || 'mat'}_${Math.random()}`;
                const iKey = `FoliageCombinedIB_${options.name}_${mat.name || 'mat'}_${Math.random()}`;
                const combinedVB = new VertexBuffer(redGPUContext, combinedVertexData, interleavedStruct, undefined, vKey);
                const combinedIB = new IndexBuffer(redGPUContext, combinedIndexData, undefined, iKey);
                const combinedGeom = new Geometry(redGPUContext, combinedVB, combinedIB);

                const identityMatrix = mat4.create();
                mat4.identity(identityMatrix);

                const combinedSubMesh = createSubMeshInstance(
                    group[0].node,
                    combinedGeom,
                    mat,
                    identityMatrix,
                    identityMatrix,
                    group[0].strideBytes,
                    0
                );

                subList.push(combinedSubMesh);
            }
        });

        // 🌟 LOD 0 서브메시 개수
        const lod0SubMeshCount = subList.length;

        // 🌟 LOD 1 3-Plane Star Cross-Billboard Impostor 베이킹 및 등록
        const billboardOpt = options.billboard || options.impostor;
        if (billboardOpt?.enabled) {
            const rootMeshNode = Array.isArray(options.mesh) ? options.mesh[0] : options.mesh;
            const bakeResult = FoliageImpostorBaker.bakeSubMeshes(redGPUContext, subList, rootMeshNode, 512, options.name);

            const bbWidth = billboardOpt.width ?? bakeResult.width;
            const bbHeight = billboardOpt.height ?? bakeResult.height;

            const bbGeom = createCrossBillboardGeometry(redGPUContext, bbWidth, bbHeight);
            let bbMat = billboardOpt.material;
            if (!bbMat) {
                bbMat = new CrossBillboardMaterial(redGPUContext, bakeResult.texture, `${options.name}_CrossBillboardMat`);
            }

            const bbSubMesh = createSubMeshInstance(
                rootMeshNode,
                bbGeom,
                bbMat,
                mat4.create(),
                mat4.create(),
                48,
                1 // LOD 1
            );
            (bbSubMesh as any)._bakedWidth = bbWidth;
            (bbSubMesh as any)._bakedHeight = bbHeight;
            subList.push(bbSubMesh);
        }

        // 🌟 Bottom Offset 산출
        let minOffset = 0;
        for (let i = 0; i < subList.length; i++) {
            minOffset = Math.min(minOffset, subList[i].bottomOffset);
        }

        return {
            subMeshes: subList,
            lod0SubMeshCount,
            bottomOffset: minOffset,
        };
    }
}

Object.freeze(FoliageSubMeshAssembler);
export default FoliageSubMeshAssembler;
export {FoliageSubMeshAssembler};
