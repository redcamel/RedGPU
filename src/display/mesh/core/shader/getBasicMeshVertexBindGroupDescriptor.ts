import Sampler from "../../../../resources/sampler/Sampler";
import Mesh from "../../Mesh";

const getBasicMeshVertexBindGroupDescriptor = (mesh: Mesh, skin: boolean = false): GPUBindGroupDescriptor => {
    const {redGPUContext, gpuRenderInfo, material} = mesh
    const {resourceManager} = redGPUContext
    const {vertexUniformBuffer, vertexBindGroupLayout} = gpuRenderInfo
    const {basicSampler, emptyBitmapTextureView, basicDisplacementSampler} = resourceManager
    const {gpuSampler: basicGPUSampler} = basicSampler
    const entries = skin ? [

        {
            binding: 1,
            // resource: getGPUResourceSampler(material?.displacementTextureSampler) || basicGPUSampler
            resource: basicDisplacementSampler.gpuSampler
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
            binding: 1,
            // resource: getGPUResourceSampler(material?.displacementTextureSampler) || basicGPUSampler
            resource: basicDisplacementSampler.gpuSampler
        },
        {
            binding: 2,
            resource: resourceManager.getGPUResourceBitmapTextureView(material?.displacementTexture) || emptyBitmapTextureView
        },
    ]
    if (vertexUniformBuffer) {
        entries.push(
            {
                binding: 0,
                resource: {
                    buffer: vertexUniformBuffer.gpuBuffer,
                    offset: 0,
                    size: vertexUniformBuffer.size
                },
            },
        )
    }
    return {
        layout: vertexBindGroupLayout,
        label: skin ? 'VERTEX_BIND_GROUP_DESCRIPTOR_MESH_SKIN' : 'VERTEX_BIND_GROUP_DESCRIPTOR_MESH',
        entries
    }

}
export default getBasicMeshVertexBindGroupDescriptor
const getGPUResourceSampler = (sampler: Sampler) => {
    return sampler?.gpuSampler
}
