import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import {keepLog} from "../../utils";
import AABB from "../../utils/math/bound/AABB";
import AController from "../core/AController";

const PER_PI = Math.PI / 180;
const ROTATION_THRESHOLD = 0.01;
const DISTANCE_THRESHOLD = 0.01;
const tempMatrix = mat4.create();

/**
 * 오빗(Orbit) 카메라 컨트롤러 클래스입니다.
 * 마우스/터치 드래그로 회전, 휠로 줌, 중심점/거리/회전/틸트 등 다양한 파라미터를 지원합니다.
 * 여러 View3D에서 동시에 사용할 수 있습니다.
 *
 * @category Controller
 *
 * @example
 * ```javascript
 * const controller = new RedGPU.Camera.OrbitController(redGPUContext);
 * controller.centerX = 0;
 * controller.centerY = 0;
 * controller.centerZ = 0;
 * controller.distance = 20;
 * controller.tilt = -30;
 * controller.pan = 45;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/orbitController/"></iframe>
 */
class OrbitController extends AController {
	// ==================== 카메라 위치 및 중심점 ====================
	#centerX = 0;
	#centerY = 0;
	#centerZ = 0;
	// ==================== 거리(줌) 관련 ====================
	#distance = 15;
	#speedDistance = 2;
	#distanceInterpolation = 0.1;
	// ==================== 회전(팬/틸트) 관련 ====================
	#pan = 0;
	#tilt = -35;
	#speedRotation = 3;
	#rotationInterpolation = 0.1;
	#minTilt = -90;
	#maxTilt = 90;
	// ==================== 애니메이션 상태 ====================
	#currentPan = 0;
	#currentTilt = 0;
	#currentDistance = 0;

	// ==================== 라이프사이클 ====================
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext,
			{
				HD_Move: (deltaX: number, deltaY: number) => {
					this.#pan -= deltaX * this.#speedRotation * 0.1;
					this.#tilt -= deltaY * this.#speedRotation * 0.1;
				},
				HD_Wheel: (e: WheelEvent) => {
					this.#distance += e.deltaY / 100 * this.#speedDistance;
				},
				HD_TouchPinch: (deltaScale: number) => {
					const scaleChange = (deltaScale - 1) * this.#speedDistance;
					this.#distance -= scaleChange * this.#distance;
				},
			}
		)
		;
	}

	#calcTargetMeshMatrix(mesh: Mesh, view: View3D, parentMesh?: Mesh) {
		//
		const localMatrix = mesh.modelMatrix;
		//
		mat4.identity(localMatrix)
		mat4.translate(localMatrix, localMatrix, [mesh.x, mesh.y, mesh.z]);
		mat4.rotateX(localMatrix, localMatrix, mesh.rotationX * Math.PI / 180);
		mat4.rotateY(localMatrix, localMatrix, mesh.rotationY * Math.PI / 180);
		mat4.rotateZ(localMatrix, localMatrix, mesh.rotationZ * Math.PI / 180);
		mat4.scale(localMatrix, localMatrix, [mesh.scaleX, mesh.scaleY, mesh.scaleZ]);
		mat4.copy(mesh.localMatrix, localMatrix);
		//
		if (parentMesh) {
			mat4.multiply(mesh.modelMatrix, parentMesh.modelMatrix, localMatrix);
		} else {
			mat4.copy(mesh.modelMatrix, localMatrix);
		}
		//
		mesh.children.forEach((child: Mesh) => {
			this.#calcTargetMeshMatrix(child, view, mesh);
		});
	}

	fitMeshToScreenCenter(mesh: Mesh, view: View3D): void {
		this.#calcTargetMeshMatrix(mesh, view);
		const bounds = mesh.combinedBoundingAABB;

		// 1. 유효성 검사 (데이터가 없으면 중단)
		if (!bounds || bounds.minX === Infinity) return;

		const sizeX = Math.abs(bounds.maxX - bounds.minX);
		const sizeY = Math.abs(bounds.maxY - bounds.minY);
		const sizeZ = Math.abs(bounds.maxZ - bounds.minZ);

		const centerX = (bounds.minX + bounds.maxX) / 2;
		const centerY = (bounds.minY + bounds.maxY) / 2;
		const centerZ = (bounds.minZ + bounds.maxZ) / 2;

		// 2. 화각 계산
		//@ts-ignore
		const fovY = view.rawCamera.fieldOfView * Math.PI / 180;
		const tanHalfFovY = Math.tan(fovY / 2);
		const tanHalfFovX = tanHalfFovY * view.aspect;

		// 3. 배율 기반 패딩 적용 (예: 1.1은 10%의 여유 공간을 의미)
		const padding = 1.1;

		// 각 축별로 화면에 꽉 차기 위한 거리 계산
		const distToFitX = (sizeX / 2) / tanHalfFovX;
		const distToFitY = (sizeY / 2) / tanHalfFovY;

		// 4. 최종 거리 계산
		// - Math.max를 통해 가로/세로 중 더 큰 범위를 수용하는 거리를 선택합니다.
		// - 여기에 배율(padding)을 곱하여 모델 크기에 비례하는 여백을 둡니다.
		// - sizeZ / 2를 더해 카메라가 모델의 앞면을 뚫지 않도록 보정합니다.
		const requiredDistance = (Math.max(distToFitX, distToFitY) * padding) + (sizeZ );

		this.centerX = centerX;
		this.centerY = centerY;
		this.centerZ = centerZ;
		this.distance = this.#currentDistance = requiredDistance;
	}

	// ==================== 센터 좌표 Getter/Setter ====================
	/**
	 * 회전 중심의 X축 좌표를 가져옵니다.
	 * @returns {number} 중심점 X축 좌표
	 */
	get centerX(): number {
		return this.#centerX;
	}

	/**
	 * 회전 중심의 X축 좌표를 설정합니다.
	 * @param {number} value - 중심점 X축 좌표
	 */
	set centerX(value: number) {
		this.#centerX = value;
	}

	/**
	 * 회전 중심의 Y축 좌표를 가져옵니다.
	 * @returns {number} 중심점 Y축 좌표
	 */
	get centerY(): number {
		return this.#centerY;
	}

	/**
	 * 회전 중심의 Y축 좌표를 설정합니다.
	 * @param {number} value - 중심점 Y축 좌표
	 */
	set centerY(value: number) {
		this.#centerY = value;
	}

	/**
	 * 회전 중심의 Z축 좌표를 가져옵니다.
	 * @returns {number} 중심점 Z축 좌표
	 */
	get centerZ(): number {
		return this.#centerZ;
	}

	/**
	 * 회전 중심의 Z축 좌표를 설정합니다.
	 * @param {number} value - 중심점 Z축 좌표
	 */
	set centerZ(value: number) {
		this.#centerZ = value;
	}

	// ==================== 거리(줌) Getter/Setter ====================
	/**
	 * 중심점으로부터 카메라까지의 거리를 가져옵니다.
	 * @returns {number} 거리 값
	 */
	get distance(): number {
		return this.#distance;
	}

	/**
	 * 중심점으로부터 카메라까지의 거리를 설정합니다.
	 * @param {number} value - 거리 값 (0 이상)
	 */
	set distance(value: number) {
		validateNumberRange(value, 0);
		this.#distance = value;
	}

	/**
	 * 거리 조절 속도를 가져옵니다.
	 * @returns {number} 거리 변화 속도
	 */
	get speedDistance(): number {
		return this.#speedDistance;
	}

	/**
	 * 거리 조절 속도를 설정합니다. 높을수록 빠른 줌 속도
	 * @param {number} value - 거리 변화 속도 (0.01 이상)
	 */
	set speedDistance(value: number) {
		validateNumberRange(value, 0.01);
		this.#speedDistance = value;
	}

	/**
	 * 거리 보간 계수를 가져옵니다.
	 * @returns {number} 거리 보간 계수 (0.01 ~ 1)
	 */
	get distanceInterpolation(): number {
		return this.#distanceInterpolation;
	}

	/**
	 * 거리 보간 계수를 설정합니다. 낮을수록 부드러운 줌 이동
	 * @param {number} value - 보간 계수 (0.01 ~ 1)
	 */
	set distanceInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#distanceInterpolation = value;
	}

	// ==================== 회전 속도 Getter/Setter ====================
	/**
	 * 회전 속도를 가져옵니다.
	 * @returns {number} 회전 속도 값
	 */
	get speedRotation(): number {
		return this.#speedRotation;
	}

	/**
	 * 회전 속도를 설정합니다. 높을수록 빠른 회전 속도
	 * @param {number} value - 회전 속도 값 (0.01 이상)
	 */
	set speedRotation(value: number) {
		validateNumberRange(value, 0.01);
		this.#speedRotation = value;
	}

	/**
	 * 회전 보간 계수를 가져옵니다.
	 * @returns {number} 회전 보간 계수 (0.01 ~ 1)
	 */
	get rotationInterpolation(): number {
		return this.#rotationInterpolation;
	}

	/**
	 * 회전 보간 계수를 설정합니다. 낮을수록 부드러운 회전
	 * @param {number} value - 보간 계수 (0.01 ~ 1)
	 */
	set rotationInterpolation(value: number) {
		validateNumberRange(value, 0.01, 1);
		this.#rotationInterpolation = value;
	}

	// ==================== 팬/틸트 Getter/Setter ====================
	/**
	 * 카메라의 팬(가로 회전) 각도를 가져옵니다. (단위: 도)
	 * @returns {number} 팬 각도 값
	 */
	get pan(): number {
		return this.#pan;
	}

	/**
	 * 카메라의 팬(가로 회전) 각도를 설정합니다. (단위: 도)
	 * @param {number} value - 팬 각도 값
	 */
	set pan(value: number) {
		this.#pan = value;
	}

	/**
	 * 카메라의 틸트(세로 회전) 각도를 가져옵니다. (단위: 도, 범위: -90 ~ 90)
	 * @returns {number} 틸트 각도 값
	 */
	get tilt(): number {
		return this.#tilt;
	}

	/**
	 * 카메라의 틸트(세로 회전) 각도를 설정합니다. (단위: 도)
	 * @param {number} value - 틸트 각도 값 (-90 ~ 90 범위로 제한됨)
	 */
	set tilt(value: number) {
		validateNumberRange(value, -90, 90);
		this.#tilt = value;
	}

	/**
	 * 최소 틸트 각도를 가져옵니다.
	 * @returns {number} 최소 틸트 각도
	 */
	get minTilt(): number {
		return this.#minTilt;
	}

	/**
	 * 최소 틸트 각도를 설정합니다.
	 * @param {number} value - 최소 틸트 각도 (-90 ~ 90)
	 */
	set minTilt(value: number) {
		validateNumberRange(value, -90, 90);
		this.#minTilt = value;
	}

	/**
	 * 최대 틸트 각도를 가져옵니다.
	 * @returns {number} 최대 틸트 각도
	 */
	get maxTilt(): number {
		return this.#maxTilt;
	}

	/**
	 * 최대 틸트 각도를 설정합니다.
	 * @param {number} value - 최대 틸트 각도 (-90 ~ 90)
	 */
	set maxTilt(value: number) {
		validateNumberRange(value, -90, 90);
		this.#maxTilt = value;
	}

	// ==================== 업데이트 및 애니메이션 ====================
	/**
	 * 매 프레임마다 오빗 카메라를 업데이트합니다.
	 * 회전(팬/틸트), 거리, 보간을 처리하고 카메라 위치를 계산합니다.
	 *
	 * @param {View3D} view - 카메라가 속한 3D 뷰
	 * @param {number} time - 현재 시간 (ms)
	 */
	update(view: View3D, time: number): void {
		super.update(view, time, () => {
			this.#updateAnimation();
		});
	}

	/**
	 * 카메라 애니메이션을 업데이트합니다.
	 * 팬, 틸트, 거리를 부드럽게 보간하고 카메라 위치를 계산합니다.
	 *
	 * @private
	 */
	#updateAnimation(): void {
		// 틸트 범위 제한
		if (this.#tilt < this.#minTilt) this.#tilt = this.#minTilt;
		if (this.#tilt > this.#maxTilt) this.#tilt = this.#maxTilt;
		const {camera} = this;
		// 현재 값을 목표값으로 부드럽게 보간
		const panDelta = this.#pan - this.#currentPan;
		if (Math.abs(panDelta) > ROTATION_THRESHOLD) {
			this.#currentPan += panDelta * this.#rotationInterpolation;
		}
		// 틸트 보간
		const tiltDelta = this.#tilt - this.#currentTilt;
		if (Math.abs(tiltDelta) > ROTATION_THRESHOLD) {
			this.#currentTilt += tiltDelta * this.#rotationInterpolation;
		}
		// 거리(줌) 범위 및 보간
		if (this.#distance < camera.nearClipping) this.#distance = camera.nearClipping;
		const distanceDelta = this.#distance - this.#currentDistance;
		if (Math.abs(distanceDelta) > DISTANCE_THRESHOLD) {
			this.#currentDistance += distanceDelta * this.#distanceInterpolation;
		}
		if (this.#currentDistance < camera.nearClipping) this.#currentDistance = camera.nearClipping;
		// 카메라 위치 계산
		mat4.identity(tempMatrix);
		mat4.translate(tempMatrix, tempMatrix, [this.#centerX, this.#centerY, this.#centerZ]);
		mat4.rotateY(tempMatrix, tempMatrix, this.#currentPan * PER_PI);
		mat4.rotateX(tempMatrix, tempMatrix, this.#currentTilt * PER_PI);
		mat4.translate(tempMatrix, tempMatrix, [0, 0, this.#currentDistance]);
		// 카메라에 적용
		camera.x = tempMatrix[12];
		camera.y = tempMatrix[13];
		camera.z = tempMatrix[14];
		this.camera.lookAt(this.#centerX, this.#centerY, this.#centerZ);
	}
}

export default OrbitController;
