import RedGPUContext from "../../context/RedGPUContext";
import BaseGeometry from "../../resource/geometry/Geometry";
import {mat4} from "../../util/gl-matrix";
import TypeSize from "../../resource/buffers/TypeSize";
import UniformBufferDescriptor from "../../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import BaseMaterial from "../../material/BaseMaterial";
import BaseObject3D from "../base/BaseObject3D";
import View from "../../main/view/View";
import CONST_DIRTY_TRANSFORM_STATE from "../base/CONST_DIRTY_TRANSFORM_STATE";

const define_vertexUniformBufferDescriptor: UniformBufferDescriptor = new UniformBufferDescriptor(
    [
        {size: TypeSize.mat4, valueName: 'modelMatrix'},
        {size: TypeSize.mat4, valueName: 'normalMatrix'},
    ]
);
const define_vertexUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = {
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: {
                type: 'uniform',
            },
        }
    ]
};

class Mesh extends BaseObject3D {
    updateBindGroup() {
        this.updateVertexUniformBindGroup({
            layout: this.renderInfo_VertexUniformBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.vertexUniformBuffer.gpuBuffer,
                        offset: 0,
                        size: this.vertexUniformBuffer.gpuBufferSize
                    }
                }
            ]
        })
    }


    constructor(
        redGPUContext: RedGPUContext,
        geometry?: BaseGeometry,
        material?: BaseMaterial,
        vertexUniformBufferDescriptor: UniformBufferDescriptor = define_vertexUniformBufferDescriptor,
        vertexUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = define_vertexUniformBindGroupLayoutDescriptor
    ) {
        super(redGPUContext, vertexUniformBufferDescriptor, vertexUniformBindGroupLayoutDescriptor)
        const device = redGPUContext.gpuDevice
        this.geometry = geometry
        this.material = material
        // 유니폼 정보를 초기화함
        this.#initVertexUniformBindGroupLayout(device)
        // 파이프 라인을 생성함
        // this.updatePipeline()
        // console.log(this)
    }

    #initVertexUniformBindGroupLayout(device: GPUDevice) {
        this.updateBindGroup()
    }

    updateTransform() {
        const {redStructOffsetMap, redGpuStructOffsetMap} = this.vertexUniformBuffer.descriptor
        // mat4.identity(this.matrix);
        // mat4.translate(this.matrix, this.matrix, [this.x, this.y, this.z]);
        // mat4.rotateX(this.matrix, this.matrix, this.rotationX);
        // mat4.rotateY(this.matrix, this.matrix, this.rotationY);
        // mat4.rotateZ(this.matrix, this.matrix, this.rotationZ);
        // mat4.scale(this.matrix, this.matrix, [this.scaleX, this.scaleY, this.scaleZ]);
        // update Uniform
        // this.vertexUniformBuffer.data.set(this.matrix,redStructOffsetMap['modelMatrix'])
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.vertexUniformBuffer.gpuBuffer,
            redGpuStructOffsetMap['modelMatrix'],
            this.matrix
        );
        // this.vertexUniformBuffer.update(0, this.matrix)
        /////////////////////////////////////////////////////////
        if (this.vertexUniformBufferDescriptor.redStructOffsetMap['normalMatrix']) {
            mat4.transpose(this.normalMatrix, mat4.invert(this.normalMatrix, this.matrix))
            // this.vertexUniformBuffer.data.set(this.normalMatrix,redStructOffsetMap['normalMatrix'])
            this.redGPUContext.gpuDevice.queue.writeBuffer(
                this.vertexUniformBuffer.gpuBuffer,
                redGpuStructOffsetMap['normalMatrix'],
                this.normalMatrix
            );
        }
        // this.vertexUniformBuffer.update()


        /////////////////////////////////////////////////////////
        this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.NONE
    }

    renderBundle: GPURenderBundle

    render(view: View, passEncoder: GPURenderPassEncoder, time) {
        if (this.redGPUContext.dirtyMultiSample) this.dirtyPipeline = true
        // dirty 계산
        if (this.materialBindGroupID !== this.material?.bindGroupID) {
            this.materialBindGroupID = this.material?.bindGroupID
            this.dirtyPipeline = true
        }
        const tempDirtyPipeline = this.dirtyPipeline
        const frustumPlanes = view.frustumPlanes


        let frustumCulling = true
        // GPU렌더링
        if (this.dirtyTransformState === CONST_DIRTY_TRANSFORM_STATE.DIRTY) {
            mat4.identity(this.matrix);
            mat4.translate(this.matrix, this.matrix, [this.x, this.y, this.z]);
            mat4.rotateX(this.matrix, this.matrix, this.rotationX);
            mat4.rotateY(this.matrix, this.matrix, this.rotationY);
            mat4.rotateZ(this.matrix, this.matrix, this.rotationZ);
            mat4.scale(this.matrix, this.matrix, [this.scaleX, this.scaleY, this.scaleZ]);
            this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.NEED_GPU_UPDATE
        }
        if (this.geometry && this.material) {

            // if(!this.renderBundle || tempDirtyPipeline){
            //     const des : GPURenderBundleEncoderDescriptor = {
            //         colorFormats: [navigator.gpu.getPreferredCanvasFormat()],
            //         depthStencilFormat : 'depth24plus-stencil8',
            //         sampleCount:4,
            //     }
            //     const renderBundleEncoder:GPURenderBundleEncoder = this.redGPUContext.gpuDevice.createRenderBundleEncoder(des)
            //     //
            //     renderBundleEncoder.setBindGroup(0, view.renderInfo_SystemUniformBindGroup);
            //     //
            //     renderBundleEncoder.setPipeline(this.renderInfo_pipeline.gpuPipeline); // 무조건갱신
            //     renderBundleEncoder.setVertexBuffer(0, this.geometry.vertexGpuBuffer); // 줄일수있으면 줄이면 좋음
            //     renderBundleEncoder.setBindGroup(1, this.renderInfo_VertexUniformBindGroup); // 버텍스 유니폼 버퍼 1번 고정
            //     renderBundleEncoder.setBindGroup(2, this.material.renderInfo_FragmentUniformBindGroup); // 프래그 먼트 유니폼 버퍼 2번 고정
            //     if (this.geometry.indexGpuBuffer) {
            //         //TODO 더 유연하게
            //         renderBundleEncoder.setIndexBuffer(this.geometry.indexGpuBuffer, 'uint32')
            //         renderBundleEncoder.drawIndexed(this.geometry.indexBuffer.indexNum, 1, 0, 0, 0);
            //     } else {
            //         renderBundleEncoder.draw(this.geometry.vertexBuffer.vertexCount, 1, 0, 0);
            //     }
            //     this.renderBundle = renderBundleEncoder.finish();
            // }else{
            //     // console.log(this.renderBundle)
            // }
            //
            // passEncoder.executeBundles([this.renderBundle])

            {

                let frustumPlanes0, frustumPlanes1, frustumPlanes2, frustumPlanes3, frustumPlanes4, frustumPlanes5;
                frustumPlanes0 = frustumPlanes[0];
                frustumPlanes1 = frustumPlanes[1];
                frustumPlanes2 = frustumPlanes[2];
                frustumPlanes3 = frustumPlanes[3];
                frustumPlanes4 = frustumPlanes[4];
                frustumPlanes5 = frustumPlanes[5];
                let a00, a01, a02;
                const geoVolume = this.geometry.volume;
                let geometryRadius: number = geoVolume.geometryRadius
                let radius: number = Math.max(
                    geometryRadius,
                    Math.max(
                        geometryRadius * this.matrix[0],
                        Math.max(
                            geometryRadius * this.matrix[5],
                            geometryRadius * this.matrix[10]
                        )
                    )
                );
                // let radiusTemp: number = geometryRadius * this.matrix[5];
                // radius = radius < radiusTemp ? radiusTemp : radius;
                // radiusTemp = geometryRadius * this.matrix[10];
                // radius = radius < radiusTemp ? radiusTemp : radius;
                // console.log(radius)
                a00 = this.matrix[12], a01 = this.matrix[13], a02 = this.matrix[14],
                    frustumPlanes0[0] * a00 + frustumPlanes0[1] * a01 + frustumPlanes0[2] * a02 + frustumPlanes0[3] <= -radius ? frustumCulling = false
                        : frustumPlanes1[0] * a00 + frustumPlanes1[1] * a01 + frustumPlanes1[2] * a02 + frustumPlanes1[3] <= -radius ? frustumCulling = false
                            : frustumPlanes2[0] * a00 + frustumPlanes2[1] * a01 + frustumPlanes2[2] * a02 + frustumPlanes2[3] <= -radius ? frustumCulling = false
                                : frustumPlanes3[0] * a00 + frustumPlanes3[1] * a01 + frustumPlanes3[2] * a02 + frustumPlanes3[3] <= -radius ? frustumCulling = false
                                    : frustumPlanes4[0] * a00 + frustumPlanes4[1] * a01 + frustumPlanes4[2] * a02 + frustumPlanes4[3] <= -radius ? frustumCulling = false
                                        : frustumPlanes5[0] * a00 + frustumPlanes5[1] * a01 + frustumPlanes5[2] * a02 + frustumPlanes5[3] <= -radius ? frustumCulling = false : 0;

            }
            if (frustumCulling) {
                if (this.dirtyPipeline) this.updatePipeline(view.systemUniformsBindGroupLayout)
                if (this.dirtyTransformState === CONST_DIRTY_TRANSFORM_STATE.NEED_GPU_UPDATE) this.updateTransform()
                passEncoder.setPipeline(this.renderInfo_pipeline.gpuPipeline); // 무조건갱신
                passEncoder.setVertexBuffer(0, this.geometry.vertexGpuBuffer); // 줄일수있으면 줄이면 좋음
                passEncoder.setBindGroup(1, this.renderInfo_VertexUniformBindGroup); // 버텍스 유니폼 버퍼 1번 고정
                passEncoder.setBindGroup(2, this.material.renderInfo_FragmentUniformBindGroup); // 프래그 먼트 유니폼 버퍼 2번 고정
                if (this.geometry.indexGpuBuffer) {
                    //TODO 더 유연하게
                    passEncoder.setIndexBuffer(this.geometry.indexGpuBuffer, 'uint32')
                    passEncoder.drawIndexed(this.geometry.indexBuffer.indexNum, 1, 0, 0, 0);
                } else {
                    passEncoder.draw(this.geometry.vertexBuffer.vertexCount, 1, 0, 0);
                }
            }

        } else {
            this.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.NONE
        }
        //
        const children = this.children
        let i = children.length
        while (i--) children[i].render(view, passEncoder, time);
        return frustumCulling ? 0 : this
        //
    }
}

export {Mesh}
