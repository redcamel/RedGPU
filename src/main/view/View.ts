import RedGPUContext from "../../context/RedGPUContext";
import {mat4, vec3} from "../../util/gl-matrix";
import BasicCamera from "../../camera/BasicCamera";
import TypeSize from "../../resource/buffers/TypeSize";
import Scene from "../scene/Scene";
import UniformBufferFloat32 from "../../resource/buffers/uniformBuffer/UniformBufferFloat32";
import UniformBufferDescriptor from "../../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import PassLightClustersBound from "../../light/pointLightCluster/PassLightClustersBound";
import PassLightClusters from "../../light/pointLightCluster/PassLightClusters";
import LightManager from "../../light/LightManager";
import CONST_DIRTY_TRANSFORM_STATE from "../../object3d/base/CONST_DIRTY_TRANSFORM_STATE";
import computeViewFrustumPlanes from "../../util/computeViewFrustumPlanes";
import ViewBase from "./ViewBase";
import throwErrorInstanceOf from "../../util/errorFunc/throwErrorInstanceOf";

let UUID: number = 0

class View extends ViewBase {
    #resultTexture: GPUTexture
    get resultTexture(): GPUTexture {
        return this.#resultTexture;
    }

    set resultTexture(value: GPUTexture) {
        this.#resultTexture = value;
    }

    #resolveTexture: GPUTexture

    get resolveTexture(): GPUTexture {
        return this.#resolveTexture;
    }

    set resolveTexture(value: GPUTexture) {
        this.#resolveTexture = value;
    }

    #depthTexture: GPUTexture
    get depthTexture(): GPUTexture {
        return this.#depthTexture;
    }

    set depthTexture(value: GPUTexture) {
        this.#depthTexture = value;
    }

    #resultTextureView: GPUTextureView
    get resultTextureView(): GPUTextureView {
        return this.#resultTextureView;
    }

    set resultTextureView(value: GPUTextureView) {
        this.#resultTextureView = value;
    }

    #resolveTextureView: GPUTextureView
    get resolveTextureView(): GPUTextureView {
        return this.#resolveTextureView;
    }

    set resolveTextureView(value: GPUTextureView) {
        this.#resolveTextureView = value;
    }

    #depthTextureView: GPUTextureView

    get depthTextureView(): GPUTextureView {
        return this.#depthTextureView;
    }

    set depthTextureView(value: GPUTextureView) {
        this.#depthTextureView = value;
    }

    #label: string
    set label(value: string) {
        this.#label = value;
    }

    get label(): string {
        return this.#label;
    }


    #scene: Scene
    get scene(): Scene {
        return this.#scene;
    }

    set scene(value: Scene) {
        if (!(value instanceof Scene)) throwErrorInstanceOf(this, 'scene', 'Scene')
        this.#scene = value;
        window.dispatchEvent(new Event('changeViewList'))
    }

    #camera: BasicCamera
    get camera(): BasicCamera {
        return this.#camera;
    }

    #renderPointLightNum: number = 0
    get renderPointLightNum(): number {
        return this.#renderPointLightNum;
    }

    #renderDirectionalLightNum: number = 0
    get renderDirectionalLightNum(): number {
        return this.#renderDirectionalLightNum;
    }

    #frustumPlanes = []
    get frustumPlanes(): any[] {
        return this.#frustumPlanes;
    }

    #systemBufferInfo: UniformBufferFloat32
    get systemBufferInfo(): UniformBufferFloat32 {
        return this.#systemBufferInfo;
    }

    #systemUniformsBindGroupLayout: GPUBindGroupLayout
    get systemUniformsBindGroupLayout(): GPUBindGroupLayout {
        return this.#systemUniformsBindGroupLayout;
    }

    #renderInfo_SystemUniformBindGroup: GPUBindGroup
    get renderInfo_SystemUniformBindGroup(): GPUBindGroup {
        return this.#renderInfo_SystemUniformBindGroup;
    }


    #passLightClustersBound: PassLightClustersBound
    get passLightClustersBound(): PassLightClustersBound {
        return this.#passLightClustersBound;
    }

    #passLightClusters: PassLightClusters
    get passLightClusters(): PassLightClusters {
        return this.#passLightClusters;
    }

    #systemClusterLightBufferInfo: UniformBufferFloat32
    get systemClusterLightBufferInfo(): UniformBufferFloat32 {
        return this.#systemClusterLightBufferInfo;
    }

    #systemAmbientDirectionalLightBufferInfo: UniformBufferFloat32
    get systemAmbientDirectionalLightBufferInfo(): UniformBufferFloat32 {
        return this.#systemAmbientDirectionalLightBufferInfo;
    }

    /**
     * View
     * @param redGPUContext
     * @param scene
     * @param label
     */
    constructor(redGPUContext: RedGPUContext, scene: Scene, label?: string) {
        super(redGPUContext)
        this.#label = label || `View${UUID++} (Label input is recommended.)`
        this.scene = scene
        this.#camera = new BasicCamera()
        this.#init()
        console.log('View', this)
    }

    #init() {
        this.#systemUniformsBindGroupLayout = this.redGPUContext.gpuDevice.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                    buffer: {
                        type: 'uniform',
                    },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {type: 'uniform'}
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                    buffer: {type: 'read-only-storage'}
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {type: 'storage'}
                },


            ]
        });
        this.#makeBuffer()
        this.calcPixelViewRect()
        this.updateClusterLight()
        const renderInfo_SystemUniformBindGroupDescriptor = {
            layout: this.#systemUniformsBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#systemBufferInfo.gpuBuffer,
                        offset: 0,
                        size: this.#systemBufferInfo.gpuBufferSize
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: this.#systemAmbientDirectionalLightBufferInfo.gpuBuffer,
                        offset: 0,
                        size: this.#systemAmbientDirectionalLightBufferInfo.gpuBufferSize
                    }
                },
                {
                    binding: 2,
                    resource: {
                        buffer: this.#systemClusterLightBufferInfo.gpuBuffer,
                        offset: 0,
                        size: this.#systemClusterLightBufferInfo.gpuBufferSize
                    }
                },
                {
                    binding: 3,
                    resource: {
                        buffer: this.#passLightClusters.clusterLightsBuffer,
                        offset: 0,
                        size: this.#passLightClusters.clusterLightsBuffer.size
                    }
                }

            ]
        };
        this.#renderInfo_SystemUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(renderInfo_SystemUniformBindGroupDescriptor);

    }


    #makeBuffer() {
        this.#systemBufferInfo = new UniformBufferFloat32(this.redGPUContext, new UniformBufferDescriptor(
            [
                {size: TypeSize.mat4, valueName: 'projectionMatrix'},
                {size: TypeSize.mat4, valueName: 'inverseProjectionMatrix'},
                {size: TypeSize.mat4, valueName: 'cameraMatrix'},
                {size: TypeSize.float32x2, valueName: 'resolution'},
                {size: TypeSize.float32x2, valueName: 'nearFar'},
            ]
        ))
        this.#systemAmbientDirectionalLightBufferInfo = new UniformBufferFloat32(
            this.redGPUContext,
            new UniformBufferDescriptor(
                [
                    {size: TypeSize.float32x4, valueName: 'ambientLight'},
                    {size: TypeSize.float32x4, valueName: 'directionalLightCount'},
                    {
                        valueName: 'directionalLights',
                        struct: [
                            {size: TypeSize.float32x3, valueName: 'directionalLightColor'},
                            {size: TypeSize.float32, valueName: 'directionalLightIntensity'},
                            {size: TypeSize.float32x3, valueName: 'directionalLightDirection'},
                        ],
                        num: LightManager.MAX_DIRECTIONAL_LIGHT_NUM,
                    }
                ]
            ),
            GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        )
        this.#systemClusterLightBufferInfo = new UniformBufferFloat32(
            this.redGPUContext,
            new UniformBufferDescriptor(
                [
                    {size: TypeSize.float32x4, valueName: 'pointLightCount'},
                    {
                        valueName: 'pointLights',
                        struct: [
                            {size: TypeSize.float32x3, valueName: 'pointLightPosition'},
                            {size: TypeSize.float32, valueName: 'pointLightRange'},
                            {size: TypeSize.float32x3, valueName: 'pointLightColor'},
                            {size: TypeSize.float32, valueName: 'pointLightIntensity'},
                        ],
                        num: LightManager.MAX_POINT_LIGHT_NUM,
                    }
                ]
            ),
            GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        )

    }

    updateSystemUniform() {
        const pixelViewRect = this.pixelViewRect
        const aspect = Math.abs(pixelViewRect[2] / pixelViewRect[3]);
        const projectionMatrix = this.projectionMatrix
        const camera = this.#camera
        const {fov, nearClipping, farClipping, matrix: cameraMTX, mode} = camera
        if (mode === BasicCamera.MODE_3D) {
            mat4.perspective(projectionMatrix, (Math.PI / 180) * fov, aspect, nearClipping, farClipping);
        } else {
            // TODO 2D 모드
        }
        this.#frustumPlanes = computeViewFrustumPlanes(projectionMatrix, cameraMTX)
        const {redStructOffsetMap: offsetMap} = this.#systemBufferInfo.descriptor
        const systemBufferInfoData = this.#systemBufferInfo.data
        systemBufferInfoData.set(projectionMatrix, offsetMap['projectionMatrix'])
        systemBufferInfoData.set(this.inverseProjectionMatrix, offsetMap['inverseProjectionMatrix'])
        // TODO resolution 을  viewRect로 변경할까?
        systemBufferInfoData.set([pixelViewRect[2], pixelViewRect[3]], offsetMap['resolution'])
        systemBufferInfoData.set(cameraMTX, offsetMap['cameraMatrix'])
        systemBufferInfoData.set([nearClipping, farClipping], offsetMap['nearFar'])
        this.#systemBufferInfo.update(systemBufferInfoData)


    }

    #calcLightClusteringYn: boolean = false
    #prevClusterBoundTime: number = 0
    #prevClusterLightTime: number = 0

    updateClusterLight() {

        const {redGPUContext, scene} = this
        const {gpuDevice} = redGPUContext
        this.#renderDirectionalLightNum = 0
        this.#renderPointLightNum = 0
        if (!this.#passLightClustersBound) {
            this.#passLightClustersBound = new PassLightClustersBound(redGPUContext, this)
            this.#passLightClusters = new PassLightClusters(redGPUContext, this)
        }
        if (scene) {
            const {ambientLight, pointLightList, directionalLightList} = scene.lightManager
            //ambient
            {
                const {redStructOffsetMap: offsetMap} = this.#systemAmbientDirectionalLightBufferInfo.descriptor
                const systemAmbientDirectionalLightBufferInfoData = this.#systemAmbientDirectionalLightBufferInfo.data
                const newData = ambientLight ? [
                    scene.lightManager.ambientLight.r,
                    scene.lightManager.ambientLight.g,
                    scene.lightManager.ambientLight.b,
                    scene.lightManager.ambientLight.intensity
                ] : [0, 0, 0, 0]
                systemAmbientDirectionalLightBufferInfoData.set(newData, offsetMap['ambientLight'])
                this.redGPUContext.gpuDevice.queue.writeBuffer(
                    this.#systemAmbientDirectionalLightBufferInfo.gpuBuffer,
                    offsetMap['ambientLight'],
                    new Float32Array(newData)
                );
            }
            //directional
            {
                const {redStructOffsetMap: offsetMap} = this.#systemAmbientDirectionalLightBufferInfo.descriptor
                const systemAmbientDirectionalLightBufferInfoData = this.#systemAmbientDirectionalLightBufferInfo.data
                const directionalNum = directionalLightList.length
                let i = directionalNum
                while (i--) {
                    const tLight = directionalLightList[i]
                    const stride = (
                        TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT
                        + TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT
                    )
                    const offset = offsetMap['directionalLights'] + stride * i
                    const direction = vec3.subtract(vec3.create(), tLight.position, tLight.targetPosition)
                    const newData = [
                        tLight.r, tLight.g, tLight.b, tLight.intensity,
                        direction[0], direction[1], direction[2]
                    ]
                    systemAmbientDirectionalLightBufferInfoData.set(
                        newData,
                        offset,
                    )
                    this.#renderDirectionalLightNum++

                }
                systemAmbientDirectionalLightBufferInfoData.set([directionalNum, 0, 0, 0], offsetMap['directionalLightCount'])
                this.#systemAmbientDirectionalLightBufferInfo.update(systemAmbientDirectionalLightBufferInfoData)

            }
            //pointLight
            {
                const clusterLightBufferInfoData = this.#systemClusterLightBufferInfo.data
                const {redStructOffsetMap: offsetMap} = this.#systemClusterLightBufferInfo.descriptor
                const frustumPlanes = computeViewFrustumPlanes(this.projectionMatrix, this.camera.matrix)
                let frustumPlanes0, frustumPlanes1, frustumPlanes2, frustumPlanes3, frustumPlanes4, frustumPlanes5;
                frustumPlanes0 = frustumPlanes[0];
                frustumPlanes1 = frustumPlanes[1];
                frustumPlanes2 = frustumPlanes[2];
                frustumPlanes3 = frustumPlanes[3];
                frustumPlanes4 = frustumPlanes[4];
                frustumPlanes5 = frustumPlanes[5];

                const pointLightNum = pointLightList.length
                let dirtyLightNum = 0
                if (pointLightNum) {
                    let i = pointLightNum

                    while (i--) {
                        const tLight = pointLightList[i]
                        const tLightMTX = tLight.matrix
                        let inViewPortYn = true
                        // 라이트 매트릭스 계산
                        if (tLight.dirtyTransformState === CONST_DIRTY_TRANSFORM_STATE.DIRTY || tLight.dirtyLight) {
                            dirtyLightNum++
                        }
                        if (tLight.dirtyTransformState === CONST_DIRTY_TRANSFORM_STATE.DIRTY) {

                            mat4.identity(tLightMTX);
                            mat4.translate(tLightMTX, tLightMTX, [tLight.x, tLight.y, tLight.z]);
                            tLight.dirtyTransformState = CONST_DIRTY_TRANSFORM_STATE.NONE
                        }
                        // frustum culling
                        {

                            let a00, a01, a02;
                            let radius: number = tLight.radius
                            a00 = tLightMTX[12], a01 = tLightMTX[13], a02 = tLightMTX[14],
                                frustumPlanes0[0] * a00 + frustumPlanes0[1] * a01 + frustumPlanes0[2] * a02 + frustumPlanes0[3] <= -radius ? inViewPortYn = false
                                    : frustumPlanes1[0] * a00 + frustumPlanes1[1] * a01 + frustumPlanes1[2] * a02 + frustumPlanes1[3] <= -radius ? inViewPortYn = false
                                        : frustumPlanes2[0] * a00 + frustumPlanes2[1] * a01 + frustumPlanes2[2] * a02 + frustumPlanes2[3] <= -radius ? inViewPortYn = false
                                            : frustumPlanes3[0] * a00 + frustumPlanes3[1] * a01 + frustumPlanes3[2] * a02 + frustumPlanes3[3] <= -radius ? inViewPortYn = false
                                                : frustumPlanes4[0] * a00 + frustumPlanes4[1] * a01 + frustumPlanes4[2] * a02 + frustumPlanes4[3] <= -radius ? inViewPortYn = false
                                                    : frustumPlanes5[0] * a00 + frustumPlanes5[1] * a01 + frustumPlanes5[2] * a02 + frustumPlanes5[3] <= -radius ? inViewPortYn = false : 0;

                        }
                        // updateData
                        if (inViewPortYn || tLight.dirtyLight) {
                            const stride = (
                                TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT
                                + TypeSize.float32x4 / Float32Array.BYTES_PER_ELEMENT
                            )
                            const offset = offsetMap['pointLights'] + stride * i
                            clusterLightBufferInfoData.set(
                                [
                                    ...tLight.position, tLight.radius,
                                    tLight.r, tLight.g, tLight.b, tLight.intensity,
                                ],
                                offset,
                            )
                            this.#renderPointLightNum++
                        }
                        tLight.dirtyLight = false
                    }
                } else {

                }

                // updatePointLightCount
                clusterLightBufferInfoData.set([pointLightNum, 0, 0, 0], offsetMap['pointLightCount'])
                this.redGPUContext.gpuDevice.queue.writeBuffer(this.#systemClusterLightBufferInfo.gpuBuffer, offsetMap['pointLightCount'], new Float32Array([pointLightNum, 0, 0, 0]));

                // send data to GPU
                if (dirtyLightNum) this.#systemClusterLightBufferInfo.update(clusterLightBufferInfoData)

            }

            //TODO - dirtyViewRect 기반으로 변경
            // if (this.#dirtyViewRect) {
            const now = performance.now()
            if (now - this.#prevClusterBoundTime > 256) {
                // console.log('Bound cluster')
                if (this.#passLightClustersBound && this.#passLightClustersBound.clusterBoundBuffer) {
                    {
                        const commandEncoder = gpuDevice.createCommandEncoder();
                        const passEncoder = commandEncoder.beginComputePass({
                            label: 'Bound cluster'
                        });
                        this.#passLightClustersBound.render(commandEncoder, passEncoder)
                        passEncoder.end();
                        gpuDevice.queue.submit([commandEncoder.finish()]);
                    }
                }
                // this.#dirtyViewRect = false
                this.#prevClusterBoundTime = now
            }

            // }

            if (this.#passLightClustersBound && this.#passLightClustersBound.clusterBoundBuffer) {
                if (this.#calcLightClusteringYn) {

                } else {
                    const now = performance.now()
                    if (now - this.#prevClusterLightTime > 16) {

                        {
                            const commandEncoder = gpuDevice.createCommandEncoder();
                            const passEncoder = commandEncoder.beginComputePass({
                                label: 'PointLight cluster'
                            });
                            this.#passLightClusters.render(commandEncoder, passEncoder)
                            passEncoder.end();
                            gpuDevice.queue.submit([commandEncoder.finish()]);
                        }
                        this.#calcLightClusteringYn = true
                        gpuDevice.queue.onSubmittedWorkDone().then(v => {
                            this.#calcLightClusteringYn = false
                            this.#prevClusterLightTime = now
                        })

                    }
                }
            }

        }

    }
}

export default View
