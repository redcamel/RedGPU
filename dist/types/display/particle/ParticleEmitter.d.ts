import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
interface ParticleEmitter {
    /**
     * [KO] 파티클을 카메라를 항상 마주보도록 할지 여부
     * [EN] Whether to make particles always face the camera
     */
    useBillboard: boolean;
    /**
     * [KO] ParticleEmitter 인스턴스인지 판별하는 식별자
     * [EN] Identifier to determine if it is a ParticleEmitter instance
     */
    isInstanceofParticle: boolean;
}
/**
 * [KO] GPU 연산(Compute Shader) 기반의 고성능 파티클 시스템을 생성 및 관리하는 클래스입니다.
 * [EN] Class that creates and manages a high-performance particle system based on GPU computation (Compute Shader).
 *
 * [KO] 수천에서 수십만 개의 파티클을 GPU에서 시뮬레이션하고 병렬로 렌더링합니다. 수명, 크기, 시작/종료 트랜스폼(위치, 회전, 스케일), 알파값의 변화와 이를 보간하는 다양한 이징(Easing) 함수를 실시간으로 제어할 수 있습니다.
 * [EN] Simulates and renders thousands to hundreds of thousands of particles in parallel on the GPU. Allows real-time control over life, size, starting/ending transforms (position, rotation, scale), alpha values, and various easing functions for interpolation.
 *
 * * ### Example
 * ```typescript
 * const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
 * emitter.particleNum = 5000;
 *
 * // [KO] 파티클에 텍스처 적용 예시 (기본 제공되는 BitmapMaterial의 diffuseTexture 속성을 설정합니다)
 * // [EN] Example of applying texture to particles (sets the diffuseTexture property of the default BitmapMaterial)
 * const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'path/to/particle.png');
 * emitter.material.diffuseTexture = texture;
 *
 * scene.addChild(emitter);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/particle/basic/"></iframe>
 *
 * [KO] 아래는 ParticleEmitter의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of ParticleEmitter.
 * @see [ParticleEmitter Performance](/RedGPU/examples/3d/particle/performance/)
 *
 * ## Roadmap
 * - **[KO] 다양한 파티클 이미터 타입 지원**
 * - **[EN] Support for various particle emitter types**
 * @category Particle
 */
declare class ParticleEmitter extends Mesh {
    #private;
    /**
     * [KO] ParticleEmitter 인스턴스를 생성합니다. 기본 지오메트리로 Plane, 기본 재질로 BitmapMaterial이 내부적으로 지정됩니다.
     * [EN] Creates an instance of ParticleEmitter. Internally initializes Plane as the default geometry and BitmapMaterial as the default material.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 객체
     * [EN] RedGPU context object
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 파티클 개별 렌더링에 사용되는 인스턴스 기반 GPU 버텍스 버퍼 레이아웃 정보를 가져옵니다.
     * [EN] Gets the instance-based GPU vertex buffer layout details used for rendering individual particles.
     */
    get vertexStateBuffers(): GPUVertexBufferLayout[];
    /**
     * [KO] 시뮬레이션할 총 파티클 개수를 조회하거나 설정합니다. 설정 가능한 값의 범위는 1부터 최대 500,000개까지이며, 변경 시 GPU 시뮬레이션 버퍼가 재구축됩니다.
     * [EN] Gets or sets the total number of particles to simulate. The value ranges from 1 to a maximum of 500,000, and modifying this will rebuild the GPU simulation buffers.
     */
    get particleNum(): number;
    set particleNum(value: number);
    /**
     * [KO] 파티클 수명의 최소값(ms)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum life value (in ms) of particles.
     */
    get minLife(): number;
    set minLife(value: number);
    /**
     * [KO] 파티클 수명의 최대값(ms)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum life value (in ms) of particles.
     */
    get maxLife(): number;
    set maxLife(value: number);
    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최소 X 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum start X coordinate position particles can have upon generation.
     */
    get minStartX(): number;
    set minStartX(value: number);
    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최소 Y 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum start Y coordinate position particles can have upon generation.
     */
    get minStartY(): number;
    set minStartY(value: number);
    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최소 Z 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum start Z coordinate position particles can have upon generation.
     */
    get minStartZ(): number;
    set minStartZ(value: number);
    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최대 X 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum start X coordinate position particles can have upon generation.
     */
    get maxStartX(): number;
    set maxStartX(value: number);
    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최대 Y 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum start Y coordinate position particles can have upon generation.
     */
    get maxStartY(): number;
    set maxStartY(value: number);
    /**
     * [KO] 파티클이 처음 생성될 때 가질 수 있는 최대 Z 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum start Z coordinate position particles can have upon generation.
     */
    get maxStartZ(): number;
    set maxStartZ(value: number);
    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최소 X 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum end X coordinate position particles can reach before dying.
     */
    get minEndX(): number;
    set minEndX(value: number);
    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최소 Y 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum end Y coordinate position particles can reach before dying.
     */
    get minEndY(): number;
    set minEndY(value: number);
    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최소 Z 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum end Z coordinate position particles can reach before dying.
     */
    get minEndZ(): number;
    set minEndZ(value: number);
    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최대 X 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum end X coordinate position particles can reach before dying.
     */
    get maxEndX(): number;
    set maxEndX(value: number);
    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최대 Y 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum end Y coordinate position particles can reach before dying.
     */
    get maxEndY(): number;
    set maxEndY(value: number);
    /**
     * [KO] 파티클이 사라지기 전에 도달할 수 있는 최대 Z 좌표 위치를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum end Z coordinate position particles can reach before dying.
     */
    get maxEndZ(): number;
    set maxEndZ(value: number);
    /**
     * [KO] 파티클의 최소 시작 불투명도(Opacity)를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum starting opacity of particles.
     */
    get minStartAlpha(): number;
    set minStartAlpha(value: number);
    /**
     * [KO] 파티클의 최대 시작 불투명도(Opacity)를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum starting opacity of particles.
     */
    get maxStartAlpha(): number;
    set maxStartAlpha(value: number);
    /**
     * [KO] 파티클의 최소 종료 불투명도(Opacity)를 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum ending opacity of particles.
     */
    get minEndAlpha(): number;
    set minEndAlpha(value: number);
    /**
     * [KO] 파티클의 최대 종료 불투명도(Opacity)를 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum ending opacity of particles.
     */
    get maxEndAlpha(): number;
    set maxEndAlpha(value: number);
    /**
     * [KO] 파티클의 최소 시작 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum starting scale of particles.
     */
    get minStartScale(): number;
    set minStartScale(value: number);
    /**
     * [KO] 파티클의 최대 시작 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum starting scale of particles.
     */
    get maxStartScale(): number;
    set maxStartScale(value: number);
    /**
     * [KO] 파티클의 최소 종료 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum ending scale of particles.
     */
    get minEndScale(): number;
    set minEndScale(value: number);
    /**
     * [KO] 파티클의 최대 종료 스케일을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum ending scale of particles.
     */
    get maxEndScale(): number;
    set maxEndScale(value: number);
    /**
     * [KO] 파티클의 최소 시작 X축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum starting X-axis rotation angle (in degrees) of particles.
     */
    get minStartRotationX(): number;
    set minStartRotationX(value: number);
    /**
     * [KO] 파티클의 최소 시작 Y축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum starting Y-axis rotation angle (in degrees) of particles.
     */
    get minStartRotationY(): number;
    set minStartRotationY(value: number);
    /**
     * [KO] 파티클의 최소 시작 Z축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum starting Z-axis rotation angle (in degrees) of particles.
     */
    get minStartRotationZ(): number;
    set minStartRotationZ(value: number);
    /**
     * [KO] 파티클의 최대 시작 X축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum starting X-axis rotation angle (in degrees) of particles.
     */
    get maxStartRotationX(): number;
    set maxStartRotationX(value: number);
    /**
     * [KO] 파티클의 최대 시작 Y축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum starting Y-axis rotation angle (in degrees) of particles.
     */
    get maxStartRotationY(): number;
    set maxStartRotationY(value: number);
    /**
     * [KO] 파티클의 최대 시작 Z축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum starting Z-axis rotation angle (in degrees) of particles.
     */
    get maxStartRotationZ(): number;
    set maxStartRotationZ(value: number);
    /**
     * [KO] 파티클의 최소 종료 X축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum ending X-axis rotation angle (in degrees) of particles.
     */
    get minEndRotationX(): number;
    set minEndRotationX(value: number);
    /**
     * [KO] 파티클의 최소 종료 Y축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum ending Y-axis rotation angle (in degrees) of particles.
     */
    get minEndRotationY(): number;
    set minEndRotationY(value: number);
    /**
     * [KO] 파티클의 최소 종료 Z축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minimum ending Z-axis rotation angle (in degrees) of particles.
     */
    get minEndRotationZ(): number;
    set minEndRotationZ(value: number);
    /**
     * [KO] 파티클의 최대 종료 X축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum ending X-axis rotation angle (in degrees) of particles.
     */
    get maxEndRotationX(): number;
    set maxEndRotationX(value: number);
    /**
     * [KO] 파티클의 최대 종료 Y축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum ending Y-axis rotation angle (in degrees) of particles.
     */
    get maxEndRotationY(): number;
    set maxEndRotationY(value: number);
    /**
     * [KO] 파티클의 최대 종료 Z축 회전각(도)을 가져오거나 설정합니다.
     * [EN] Gets or sets the maximum ending Z-axis rotation angle (in degrees) of particles.
     */
    get maxEndRotationZ(): number;
    set maxEndRotationZ(value: number);
    /**
     * [KO] X축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the X-axis coordinate change.
     */
    get easeX(): number;
    set easeX(value: number);
    /**
     * [KO] Y축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Y-axis coordinate change.
     */
    get easeY(): number;
    set easeY(value: number);
    /**
     * [KO] Z축 방향 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Z-axis coordinate change.
     */
    get easeZ(): number;
    set easeZ(value: number);
    /**
     * [KO] 알파(투명도) 수치 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the alpha (opacity) change.
     */
    get easeAlpha(): number;
    set easeAlpha(value: number);
    /**
     * [KO] 스케일 크기 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the scale change.
     */
    get easeScale(): number;
    set easeScale(value: number);
    /**
     * [KO] X축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the X-axis rotation change.
     */
    get easeRotationX(): number;
    set easeRotationX(value: number);
    /**
     * [KO] Y축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Y-axis rotation change.
     */
    get easeRotationY(): number;
    set easeRotationY(value: number);
    /**
     * [KO] Z축 회전 변화에 적용될 이징(Easing) 함수(PARTICLE_EASE 상수 값)를 가져오거나 설정합니다.
     * [EN] Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Z-axis rotation change.
     */
    get easeRotationZ(): number;
    set easeRotationZ(value: number);
    /**
     * [KO] 파티클 데이터 및 속성을 저장하는 GPUBuffer들의 배열을 가져옵니다.
     * [EN] Gets the array of GPUBuffers storing particle data and attributes.
     */
    get particleBuffers(): GPUBuffer[];
    /**
     * [KO] 파티클 이미터를 렌더링 프레임 단위로 갱신 및 시뮬레이션합니다. 매 프레임마다 GPU 컴퓨트 패스(Compute Pass)를 수행하여 위치 정보를 재계산합니다.
     * [EN] Updates and simulates the particle emitter on a per-frame basis. Triggers the GPU Compute Pass each frame to recalculate position and transform states.
     * @param renderViewStateData -
     * [KO] 렌더 뷰 상태 데이터 객체
     * [EN] Render view state data object
     */
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] 파티클용 커스텀 버텍스 셰이더 모듈을 컴파일하고 반환합니다.
     * [EN] Compiles and returns a custom vertex shader module for particles.
     * @returns
     * [KO] 컴파일 완료된 GPUShaderModule
     * [EN] Compiled GPUShaderModule
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default ParticleEmitter;
