import {mat4} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import {keepLog} from "../../utils";

/**
 * [KO] 원근 투영을 사용하는 카메라입니다.
 * [EN] Camera that uses perspective projection.
 *
 * [KO] 인간의 눈이나 카메라 렌즈와 유사하게 거리에 따라 물체의 크기가 달라지는 원근감을 제공합니다. 3D 환경에서 깊이감 있는 씬을 렌더링할 때 기본적으로 사용됩니다.
 * [EN] Provides perspective where object sizes vary based on distance, similar to the human eye or a camera lens. It is used by default for rendering depth-filled scenes in a 3D environment.
 *
 * ### Example
 * ```typescript
 * const camera = new RedGPU.PerspectiveCamera();
 * camera.x = 10;
 * camera.y = 5;
 * camera.z = 20;
 * camera.fieldOfView = 75;
 * camera.lookAt(0, 0, 0);
 * ```
 * @category Camera
 */
class PerspectiveCamera {
	/**
	 * [KO] 인스턴스 고유 ID
	 * [EN] Instance unique ID
	 */
	#instanceId: number;

	/**
	 * [KO] up 벡터 (기본값 [0, 1, 0])
	 * [EN] Up vector (default [0, 1, 0])
	 */
	#up = new Float32Array([0, 1, 0]);

	/**
	 * [KO] 모델 행렬(mat4)
	 * [EN] Model matrix (mat4)
	 */
	#modelMatrix: mat4 = mat4.create();

	/**
	 * [KO] X 좌표
	 * [EN] X coordinate
	 */
	#x: number = 0;

	/**
	 * [KO] Z 좌표
	 * [EN] Z coordinate
	 */
	#z: number = 0;

	/**
	 * [KO] Y 좌표
	 * [EN] Y coordinate
	 */
	#y: number = 0;

	/**
	 * [KO] X축 회전(라디안)
	 * [EN] Rotation X (radians)
	 */
	#rotationX: number = 0;

	/**
	 * [KO] Y축 회전(라디안)
	 * [EN] Rotation Y (radians)
	 */
	#rotationY: number = 0;

	/**
	 * [KO] Z축 회전(라디안)
	 * [EN] Rotation Z (radians)
	 */
	#rotationZ: number = 0;

	/**
	 * [KO] 시야각(FOV, 도)
	 * [EN] Field of view (degrees)
	 */
	#fieldOfView: number = 60;

	/**
	 * [KO] 근평면(near)
	 * [EN] Near clipping plane
	 */
	#nearClipping: number = 0.1;

	/**
	 * [KO] 원평면(far)
	 * [EN] Far clipping plane
	 */
	#farClipping: number = 10000;

	/**
	 * [KO] 카메라 이름
	 * [EN] Camera name
	 */
	#name: string;

	/**
	 * [KO] PerspectiveCamera 인스턴스를 생성합니다.
	 * [EN] Creates an instance of PerspectiveCamera.
	 *
	 * ### Example
	 * ```typescript
	 * const camera = new RedGPU.PerspectiveCamera();
	 * ```
	 */
	constructor() {
	}

	/**
	 * [KO] X축 회전값을 반환합니다. (라디안)
	 * [EN] Returns the X rotation value. (radians)
	 *
	 * @returns
	 * [KO] X축 회전값
	 * [EN] X rotation value
	 */
	get rotationX(): number {
		return this.#rotationX;
	}

	/**
	 * [KO] X축 회전값을 설정합니다. (라디안)
	 * [EN] Sets the X rotation value. (radians)
	 *
	 * @param value -
	 * [KO] 설정할 회전값
	 * [EN] Rotation value to set
	 */
	set rotationX(value: number) {
		this.#rotationX = value;
	}

	/**
	 * [KO] Y축 회전값을 반환합니다. (라디안)
	 * [EN] Returns the Y rotation value. (radians)
	 *
	 * @returns
	 * [KO] Y축 회전값
	 * [EN] Y rotation value
	 */
	get rotationY(): number {
		return this.#rotationY;
	}

	/**
	 * [KO] Y축 회전값을 설정합니다. (라디안)
	 * [EN] Sets the Y rotation value. (radians)
	 *
	 * @param value -
	 * [KO] 설정할 회전값
	 * [EN] Rotation value to set
	 */
	set rotationY(value: number) {
		this.#rotationY = value;
	}

	/**
	 * [KO] Z축 회전값을 반환합니다. (라디안)
	 * [EN] Returns the Z rotation value. (radians)
	 *
	 * @returns
	 * [KO] Z축 회전값
	 * [EN] Z rotation value
	 */
	get rotationZ(): number {
		return this.#rotationZ;
	}

	/**
	 * [KO] Z축 회전값을 설정합니다. (라디안)
	 * [EN] Sets the Z rotation value. (radians)
	 *
	 * @param value -
	 * [KO] 설정할 회전값
	 * [EN] Rotation value to set
	 */
	set rotationZ(value: number) {
		this.#rotationZ = value;
	}

	/**
	 * [KO] 시야각(FOV)을 반환합니다. (도)
	 * [EN] Returns the field of view. (degrees)
	 *
	 * @returns
	 * [KO] 시야각
	 * [EN] Field of view
	 */
	get fieldOfView(): number {
		return this.#fieldOfView;
	}

	/**
	 * [KO] 시야각(FOV)을 설정합니다. (도)
	 * [EN] Sets the field of view. (degrees)
	 *
	 * @param value -
	 * [KO] 설정할 시야각
	 * [EN] Field of view to set
	 */
	set fieldOfView(value: number) {
		validateNumber(value);
		this.#fieldOfView = value;
	}

	/**
	 * [KO] 근평면(near) 거리를 반환합니다.
	 * [EN] Returns the near clipping distance.
	 *
	 * @returns
	 * [KO] 근평면 거리
	 * [EN] Near clipping distance
	 */
	get nearClipping(): number {
		return this.#nearClipping;
	}

	/**
	 * [KO] 근평면(near) 거리를 설정합니다.
	 * [EN] Sets the near clipping distance.
	 *
	 * @param value -
	 * [KO] 설정할 근평면 거리
	 * [EN] Near clipping distance to set
	 */
	set nearClipping(value: number) {
		validateNumber(value);
		this.#nearClipping = value;
	}

	/**
	 * [KO] 원평면(far) 거리를 반환합니다.
	 * [EN] Returns the far clipping distance.
	 *
	 * @returns
	 * [KO] 원평면 거리
	 * [EN] Far clipping distance
	 */
	get farClipping(): number {
		return this.#farClipping;
	}

	/**
	 * [KO] 원평면(far) 거리를 설정합니다.
	 * [EN] Sets the far clipping distance.
	 *
	 * @param value -
	 * [KO] 설정할 원평면 거리
	 * [EN] Far clipping distance to set
	 */
	set farClipping(value: number) {
		validateNumber(value);
		this.#farClipping = value;
	}

	/**
	 * [KO] 카메라 이름을 반환합니다.
	 * [EN] Returns the camera name.
	 *
	 * @returns
	 * [KO] 카메라 이름
	 * [EN] Camera name
	 */
	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	/**
	 * [KO] 카메라 이름을 설정합니다.
	 * [EN] Sets the camera name.
	 *
	 * @param value -
	 * [KO] 설정할 이름
	 * [EN] Name to set
	 */
	set name(value: string) {
		this.#name = value;
	}

	/**
	 * [KO] 모델 행렬을 반환합니다.
	 * [EN] Returns the model matrix.
	 *
	 * @returns
	 * [KO] 모델 행렬
	 * [EN] Model matrix
	 */
	get modelMatrix(): mat4 {
		return this.#modelMatrix;
	}

	/**
	 * [KO] X 좌표를 반환합니다.
	 * [EN] Returns the X coordinate.
	 *
	 * @returns
	 * [KO] X 좌표
	 * [EN] X coordinate
	 */
	get x(): number {
		return this.#x;
	}

	/**
	 * [KO] X 좌표를 설정합니다.
	 * [EN] Sets the X coordinate.
	 *
	 * @param value -
	 * [KO] 설정할 X 좌표
	 * [EN] X coordinate to set
	 */
	set x(value: number) {
		this.#x = value;
		this.#modelMatrix[12] = value;
	}

	/**
	 * [KO] Y 좌표를 반환합니다.
	 * [EN] Returns the Y coordinate.
	 *
	 * @returns
	 * [KO] Y 좌표
	 * [EN] Y coordinate
	 */
	get y(): number {
		return this.#y;
	}

	/**
	 * [KO] Y 좌표를 설정합니다.
	 * [EN] Sets the Y coordinate.
	 *
	 * @param value -
	 * [KO] 설정할 Y 좌표
	 * [EN] Y coordinate to set
	 */
	set y(value: number) {
		this.#y = value;
		this.#modelMatrix[13] = value;
	}

	/**
	 * [KO] Z 좌표를 반환합니다.
	 * [EN] Returns the Z coordinate.
	 *
	 * @returns
	 * [KO] Z 좌표
	 * [EN] Z coordinate
	 */
	get z(): number {
		return this.#z;
	}

	/**
	 * [KO] Z 좌표를 설정합니다.
	 * [EN] Sets the Z coordinate.
	 *
	 * @param value -
	 * [KO] 설정할 Z 좌표
	 * [EN] Z coordinate to set
	 */
	set z(value: number) {
		this.#z = value;
		this.#modelMatrix[14] = value;
	}

	/**
	 * [KO] 카메라 위치 (x, y, z)를 반환합니다.
	 * [EN] Returns the camera position (x, y, z).
	 *
	 * @returns
	 * [KO] [x, y, z] 좌표 배열
	 * [EN] [x, y, z] coordinate array
	 */
	get position(): [number, number, number] {
		return [this.#x, this.#y, this.#z];
	}

	/**
	 * [KO] 카메라 위치를 설정합니다.
	 * [EN] Sets the camera position.
	 *
	 * ### Example
	 * ```typescript
	 * camera.setPosition(10, 5, 20);
	 * camera.setPosition([10, 5, 20]);
	 * ```
	 *
	 * @param x -
	 * [KO] X 좌표 또는 [x, y, z] 배열
	 * [EN] X coordinate or [x, y, z] array
	 * @param y -
	 * [KO] Y 좌표 (x가 배열인 경우 무시됨)
	 * [EN] Y coordinate (ignored if x is an array)
	 * @param z -
	 * [KO] Z 좌표 (x가 배열인 경우 무시됨)
	 * [EN] Z coordinate (ignored if x is an array)
	 */
	setPosition(x: number | [number, number, number], y?: number, z?: number): void {
		if (Array.isArray(x)) {
			[this.#x, this.#y, this.#z] = x;
		} else {
			this.#x = x;
			this.#y = y;
			this.#z = z;
		}
		[this.#modelMatrix[12], this.#modelMatrix[13], this.#modelMatrix[14]] = [this.#x, this.#y, this.#z];
	}

	/**
	 * [KO] 카메라가 특정 좌표를 바라보도록 회전시킵니다.
	 * [EN] Rotates the camera to look at a specific coordinate.
	 *
	 * ### Example
	 * ```typescript
	 * camera.lookAt(0, 0, 0);
	 * ```
	 *
	 * @param x -
	 * [KO] 바라볼 대상의 X 좌표
	 * [EN] Target X coordinate to look at
	 * @param y -
	 * [KO] 바라볼 대상의 Y 좌표
	 * [EN] Target Y coordinate to look at
	 * @param z -
	 * [KO] 바라볼 대상의 Z 좌표
	 * [EN] Target Z coordinate to look at
	 */
	lookAt(x: number, y: number, z: number): void {
		const eye: [number, number, number] = [this.#x, this.#y, this.#z];
		const target: [number, number, number] = [x, y, z];
		const up: [number, number, number] = [this.#up[0], this.#up[1], this.#up[2]];


		// 방향 벡터 계산
		const dir = [target[0] - eye[0], target[1] - eye[1], target[2] - eye[2]];
		const len = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1] + dir[2] * dir[2]);
		dir[0] /= len;
		dir[1] /= len;
		dir[2] /= len;

		// 방향 벡터와 up 벡터가 평행한지 확인 (외적의 크기가 0에 가까우면 평행)
		const cross = [
			dir[1] * up[2] - dir[2] * up[1],
			dir[2] * up[0] - dir[0] * up[2],
			dir[0] * up[1] - dir[1] * up[0]
		];
		const crossLen = Math.sqrt(cross[0] * cross[0] + cross[1] * cross[1] + cross[2] * cross[2]);

		if (crossLen < 0.0001) {
			// 평행할 경우 대체 up 벡터 사용
			up[2] = (dir[1] > 0) ? 1 : -1;
			up[0] = 0;
			up[1] = 0;
		}

		mat4.lookAt(this.#modelMatrix, eye, target, up);
	}
}

export default PerspectiveCamera;