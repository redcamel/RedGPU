import Sampler from "../../../../resources/sampler/Sampler";
import Mesh from "../../Mesh";

const getBasicMeshVertexBindGroupDescriptor = (mesh: Mesh, skin: boolean = false): GPUBindGroupDescriptor => {
    const {redGPUContext, gpuRenderInfo, material} = mesh
    const {resourceManager} = redGPUContext
    const {vertexUniformBuffer, vertexBindGroupLayout} = gpuRenderInfo
    const {basicSampler, emptyBitmapTextureView, emptyCubeTextureView} = resourceManager
    const {gpuSampler: basicGPUSampler} = basicSampler

    return {
        layout: vertexBindGroupLayout,
        label: skin ? 'VERTEX_BIND_GROUP_DESCRIPTOR_MESH_SKIN' : 'VERTEX_BIND_GROUP_DESCRIPTOR_MESH',
        entries: skin ? [
            {
                binding: 0,
                resource: {
                    buffer: vertexUniformBuffer.gpuBuffer,
                    offset: 0,
                    size: vertexUniformBuffer.size
                },
            },
            {
                binding: 1,
                resource: getGPUResourceSampler(material?.displacementTextureSampler) || basicGPUSampler
            },
            {
                binding: 2,
                resource: resourceManager.getGPUResourceBitmapTextureView(material?.displacementTexture) || emptyBitmapTextureView
            },
            {
                binding: 3,
                resource: {
                    buffer: mesh.animationInfo.skinInfo.vertexStorageBuffer,
                    offset: 0,
                    size: mesh.animationInfo.skinInfo.vertexStorageBuffer.size
                },
            },
            {
                binding: 4,
                resource: {
                    buffer: mesh.animationInfo.skinInfo.prevVertexStorageBuffer,
                    offset: 0,
                    size: mesh.animationInfo.skinInfo.prevVertexStorageBuffer.size
                },
            },
        ] : [
            {
                binding: 0,
                resource: {
                    buffer: vertexUniformBuffer.gpuBuffer,
                    offset: 0,
                    size: vertexUniformBuffer.size
                },
            },
            {
                binding: 1,
                resource: getGPUResourceSampler(material?.displacementTextureSampler) || basicGPUSampler
            },
            {
                binding: 2,
                resource: resourceManager.getGPUResourceBitmapTextureView(material?.displacementTexture) || emptyBitmapTextureView
            },
        ]
    }
}
export default getBasicMeshVertexBindGroupDescriptor
const getGPUResourceSampler = (sampler: Sampler) => {
    return sampler?.gpuSampler
}
