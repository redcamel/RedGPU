/**
 * [KO] glTF 에셋 내 객체를 참조하기 위한 0 기반 인덱스 식별자입니다.
 * [EN] Zero-based index identifier used to reference objects within a glTF asset.
 *
 * @category Loader
 */
export type GlTfId = number;

/**
 * [KO] 기본값에서 벗어난 희소(Sparse) 접근자 요소의 인덱스 버퍼 뷰 정보를 정의하는 인터페이스입니다.
 * [EN] Interface defining buffer view information for indices of deviating sparse accessor elements.
 *
 * @category Loader
 */
export interface AccessorSparseIndices {
    /**
     * [KO] 희소 인덱스가 저장된 버퍼 뷰(`BufferView`)의 인덱스
     * [EN] Index of the `BufferView` containing sparse indices
     */
    "bufferView": GlTfId;
    /**
     * [KO] 버퍼 뷰 시작 위치로부터의 바이트 오프셋
     * [EN] Byte offset relative to the start of the buffer view
     */
    "byteOffset"?: number;
    /**
     * [KO] 인덱스 데이터의 컴포넌트 타입 (예: `5121` UNSIGNED_BYTE, `5123` UNSIGNED_SHORT, `5125` UNSIGNED_INT)
     * [EN] Component data type of the indices (e.g., `5121` UNSIGNED_BYTE, `5123` UNSIGNED_SHORT, `5125` UNSIGNED_INT)
     */
    "componentType": number;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 기본값에서 벗어난 희소(Sparse) 접근자 요소의 실제 값 버퍼 뷰 정보를 정의하는 인터페이스입니다.
 * [EN] Interface defining buffer view information for the actual values of deviating sparse accessor elements.
 *
 * @category Loader
 */
export interface AccessorSparseValues {
    /**
     * [KO] 희소 값들이 저장된 버퍼 뷰(`BufferView`)의 인덱스
     * [EN] Index of the `BufferView` containing sparse values
     */
    "bufferView": GlTfId;
    /**
     * [KO] 버퍼 뷰 시작 위치로부터의 바이트 오프셋
     * [EN] Byte offset relative to the start of the buffer view
     */
    "byteOffset"?: number;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 초기값과 다른 접근자(Accessor) 요소들을 압축 저장하기 위한 희소(Sparse) 데이터 구조 인터페이스입니다.
 * [EN] Interface for sparse storage of accessor values that deviate from their initialization value.
 *
 * @category Loader
 */
export interface AccessorSparse {
    /**
     * [KO] 희소 배열에 저장된 변경된 접근자 요소의 개수
     * [EN] Number of deviating accessor values stored in the sparse array
     */
    "count": number;
    /**
     * [KO] 변경된 요소들의 인덱스를 가리키는 버퍼 뷰 정보
     * [EN] Buffer view descriptor pointing to the indices of deviating accessor values
     */
    "indices": AccessorSparseIndices;
    /**
     * [KO] 변경된 요소들의 실제 데이터 값을 가리키는 버퍼 뷰 정보
     * [EN] Buffer view descriptor pointing to the deviating accessor values
     */
    "values": AccessorSparseValues;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 원시 바이너리 버퍼 뷰(`BufferView`)의 데이터를 타입화된 배열로 해석하는 접근자(Accessor) 인터페이스입니다.
 * [EN] Interface for an accessor that provides a typed view into raw binary data within a `BufferView`.
 *
 * @category Loader
 */
export interface Accessor {
    /**
     * [KO] 참조할 버퍼 뷰(`BufferView`)의 인덱스
     * [EN] Index of the referenced `BufferView`
     */
    "bufferView"?: GlTfId;
    /**
     * [KO] 버퍼 뷰 시작점으로부터의 바이트 오프셋
     * [EN] Byte offset relative to the start of the buffer view
     */
    "byteOffset"?: number;
    /**
     * [KO] 접근자 컴포넌트의 데이터 타입 (예: `5126` FLOAT)
     * [EN] Data type of the accessor's components (e.g., `5126` FLOAT)
     */
    "componentType": number;
    /**
     * [KO] 정수 데이터 값을 사용 전 정규화(Normalize)할지 여부
     * [EN] Whether integer data values are normalized before usage
     */
    "normalized"?: boolean;
    /**
     * [KO] 이 접근자가 참조하는 데이터 요소(Element)의 총 개수
     * [EN] Total number of elements referenced by this accessor
     */
    "count": number;
    /**
     * [KO] 요소의 데이터 구조 유형 (`"SCALAR"`, `"VEC2"`, `"VEC3"`, `"VEC4"`, `"MAT2"`, `"MAT3"`, `"MAT4"`)
     * [EN] Data structure type of the elements (`"SCALAR"`, `"VEC2"`, `"VEC3"`, `"VEC4"`, `"MAT2"`, `"MAT3"`, `"MAT4"`)
     */
    "type": any | string;
    /**
     * [KO] 각 컴포넌트의 최댓값 배열
     * [EN] Array of maximum values for each component
     */
    "max"?: number[];
    /**
     * [KO] 각 컴포넌트의 최솟값 배열
     * [EN] Array of minimum values for each component
     */
    "min"?: number[];
    /**
     * [KO] 초기값에서 벗어난 요소들의 희소(Sparse) 저장 정보
     * [EN] Sparse storage information for elements that deviate from their initialization value
     */
    "sparse"?: AccessorSparse;
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 애니메이션이 적용될 대상 노드와 변환 속성을 지정하는 인터페이스입니다.
 * [EN] Interface specifying the target node and transformation property to be animated.
 *
 * @category Loader
 */
export interface AnimationChannelTarget {
    /**
     * [KO] 애니메이션을 적용할 대상 노드(`Node`)의 인덱스
     * [EN] Index of the target `Node` to animate
     */
    "node"?: GlTfId;
    /**
     * [KO] 애니메이션할 노드의 TRS 속성 이름(`"translation"`, `"rotation"`, `"scale"`) 또는 모프 타겟 가중치(`"weights"`)
     * [EN] Name of the node's TRS property to animate (`"translation"`, `"rotation"`, `"scale"`) or morph target `"weights"`
     */
    "path": any | string;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 애니메이션 샘플러(`AnimationSampler`)와 애니메이션 대상(`AnimationChannelTarget`)을 연결하는 채널 인터페이스입니다.
 * [EN] Interface for an animation channel that connects an `AnimationSampler` with an `AnimationChannelTarget`.
 *
 * @category Loader
 */
export interface AnimationChannel {
    /**
     * [KO] 목표 값을 계산하는 데 사용할 애니메이션 내 샘플러(`AnimationSampler`)의 인덱스
     * [EN] Index of the `AnimationSampler` in this animation used to compute the target value
     */
    "sampler": GlTfId;
    /**
     * [KO] 애니메이션이 적용될 대상 노드 및 속성 정보
     * [EN] Descriptor of the target node and property to animate
     */
    "target": AnimationChannelTarget;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 키프레임 타임스탬프 입력과 출력 값을 연결하고 보간 알고리즘을 정의하는 애니메이션 샘플러 인터페이스입니다.
 * [EN] Interface for an animation sampler that combines keyframe timestamps with output values and defines the interpolation algorithm.
 *
 * @category Loader
 */
export interface AnimationSampler {
    /**
     * [KO] 키프레임 타임스탬프(초 단위)가 저장된 접근자(`Accessor`)의 인덱스
     * [EN] Index of the `Accessor` containing keyframe timestamps (in seconds)
     */
    "input": GlTfId;
    /**
     * [KO] 키프레임 간 보간 알고리즘 (`"LINEAR"`, `"STEP"`, `"CUBICSPLINE"`)
     * [EN] Keyframe interpolation algorithm (`"LINEAR"`, `"STEP"`, `"CUBICSPLINE"`)
     */
    "interpolation"?: "CUBICSPLINE" | "STEP" | 'LINEAR' | string;
    /**
     * [KO] 키프레임 출력 데이터 값이 저장된 접근자(`Accessor`)의 인덱스
     * [EN] Index of the `Accessor` containing keyframe output values
     */
    "output": GlTfId;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 채널 목록과 샘플러 목록으로 구성되는 키프레임 애니메이션 인터페이스입니다.
 * [EN] Keyframe animation interface composed of channels and samplers.
 *
 * @category Loader
 */
export interface Animation {
    /**
     * [KO] 애니메이션 채널(`AnimationChannel`) 배열
     * [EN] Array of `AnimationChannel` objects
     */
    "channels": AnimationChannel[];
    /**
     * [KO] 애니메이션 샘플러(`AnimationSampler`) 배열
     * [EN] Array of `AnimationSampler` objects
     */
    "samplers": AnimationSampler[];
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] glTF 에셋의 버전, 저작권, 생성 도구 등 메타데이터를 정의하는 인터페이스입니다.
 * [EN] Interface defining metadata about the glTF asset such as version, copyright, and generator tool.
 *
 * @category Loader
 */
export interface Asset {
    /**
     * [KO] 콘텐츠 제작자 표기를 위한 저작권 메시지
     * [EN] Copyright message for crediting the content creator
     */
    "copyright"?: string;
    /**
     * [KO] 이 glTF 모델을 생성한 툴 이름
     * [EN] Name of the tool that generated this glTF model
     */
    "generator"?: string;
    /**
     * [KO] 이 에셋이 대상으로 하는 glTF 스펙 버전 (`"<major>.<minor>"` 형식)
     * [EN] Target glTF specification version in `"<major>.<minor>"` format
     */
    "version": string;
    /**
     * [KO] 이 에셋을 로드하기 위해 요구되는 최소 glTF 스펙 버전 (`"<major>.<minor>"` 형식)
     * [EN] Minimum glTF specification version required to load this asset in `"<major>.<minor>"` format
     */
    "minVersion"?: string;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 바이너리 지오메트리, 애니메이션 또는 스킨 데이터를 담고 있는 원시 버퍼 인터페이스입니다.
 * [EN] Raw buffer interface pointing to binary geometry, animation, or skin data.
 *
 * @category Loader
 */
export interface Buffer {
    /**
     * [KO] 버퍼 리소스의 URI 경로 또는 로드된 `ArrayBuffer` 데이터
     * [EN] URI path of the buffer resource or loaded `ArrayBuffer` data
     */
    "uri"?: string | ArrayBuffer;
    /**
     * [KO] 버퍼의 총 바이트 길이
     * [EN] Total byte length of the buffer
     */
    "byteLength": number;
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 버퍼(`Buffer`)의 특정 부분 영역(Subset)을 나타내는 버퍼 뷰 인터페이스입니다.
 * [EN] Buffer view interface representing a contiguous subset of a `Buffer`.
 *
 * @category Loader
 */
export interface BufferView {
    /**
     * [KO] 참조할 원본 버퍼(`Buffer`)의 인덱스
     * [EN] Index of the referenced `Buffer`
     */
    "buffer": GlTfId;
    /**
     * [KO] 버퍼 시작 위치로부터의 바이트 오프셋
     * [EN] Byte offset into the buffer
     */
    "byteOffset"?: number;
    /**
     * [KO] 버퍼 뷰의 총 바이트 길이
     * [EN] Total byte length of the buffer view
     */
    "byteLength": number;
    /**
     * [KO] 정점 속성 간 바이트 스트라이드(Stride)
     * [EN] Stride in bytes between vertex attributes
     */
    "byteStride"?: number;
    /**
     * [KO] 이 버퍼 뷰가 사용될 GPU 버퍼 타겟 힌트
     * [EN] Hint representing the intended GPU buffer type for this buffer view
     */
    "target"?: number;
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 직교 투영(Orthographic Projection) 행렬 생성을 위한 카메라 속성 인터페이스입니다.
 * [EN] Camera property interface for creating an orthographic projection matrix.
 *
 * @category Loader
 */
export interface CameraOrthographic {
    /**
     * [KO] 뷰의 수평 배율 (`0`이 아니어야 하며 음수가 아니어야 함)
     * [EN] Horizontal magnification of the view (must not be `0` or negative)
     */
    "xmag": number;
    /**
     * [KO] 뷰의 수직 배율 (`0`이 아니어야 하며 음수가 아니어야 함)
     * [EN] Vertical magnification of the view (must not be `0` or negative)
     */
    "ymag": number;
    /**
     * [KO] 원거리 클리핑 평면(Far Clipping Plane)까지의 거리 (`znear`보다 커야 함)
     * [EN] Distance to the far clipping plane (must be greater than `znear`)
     */
    "zfar": number;
    /**
     * [KO] 근거리 클리핑 평면(Near Clipping Plane)까지의 거리
     * [EN] Distance to the near clipping plane
     */
    "znear": number;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 원근 투영(Perspective Projection) 행렬 생성을 위한 카메라 속성 인터페이스입니다.
 * [EN] Camera property interface for creating a perspective projection matrix.
 *
 * @category Loader
 */
export interface CameraPerspective {
    /**
     * [KO] 시야각(FOV)의 가로세로 종횡비(Aspect Ratio)
     * [EN] Aspect ratio of the field of view
     */
    "aspectRatio"?: number;
    /**
     * [KO] 수직 시야각 (라디안 단위)
     * [EN] Vertical field of view (in radians)
     */
    "yfieldOfView"?: number;
    /**
     * [KO] 수직 시야각 (라디안 단위, `π` 미만 권장)
     * [EN] Vertical field of view (in radians, recommended to be less than `π`)
     */
    "yfov"?: number;
    /**
     * [KO] 원거리 클리핑 평면(Far Clipping Plane)까지의 거리
     * [EN] Distance to the far clipping plane
     */
    "zfar"?: number;
    /**
     * [KO] 근거리 클리핑 평면(Near Clipping Plane)까지의 거리
     * [EN] Distance to the near clipping plane
     */
    "znear": number;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] glTF 카메라의 투영(Projection) 설정을 정의하는 인터페이스입니다.
 * [EN] Interface defining a glTF camera's projection settings.
 *
 * @category Loader
 */
export interface Camera {
    /**
     * [KO] 직교 투영 카메라 속성 (`perspective`가 정의된 경우 정의하지 않음)
     * [EN] Orthographic camera properties (must not be defined when `perspective` is defined)
     */
    "orthographic"?: CameraOrthographic;
    /**
     * [KO] 원근 투영 카메라 속성 (`orthographic`이 정의된 경우 정의하지 않음)
     * [EN] Perspective camera properties (must not be defined when `orthographic` is defined)
     */
    "perspective"?: CameraPerspective;
    /**
     * [KO] 카메라 투영 방식 (`"perspective"` 또는 `"orthographic"`)
     * [EN] Camera projection type (`"perspective"` or `"orthographic"`)
     */
    "type": any | string;
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 텍스처 생성에 사용되는 이미지 데이터(URI 또는 버퍼 뷰 참조) 인터페이스입니다.
 * [EN] Interface for image data (referenced by URI or buffer view index) used to create a texture.
 *
 * @category Loader
 */
export interface Image {
    /**
     * [KO] 이미지 리소스의 URI 경로
     * [EN] URI path of the image resource
     */
    "uri"?: string;
    /**
     * [KO] 이미지의 미디어 타입 (`"image/jpeg"`, `"image/png"` 등, `bufferView` 사용 시 필수)
     * [EN] Media type of the image (`"image/jpeg"`, `"image/png"`, etc., required when `bufferView` is defined)
     */
    "mimeType"?: any | string;
    /**
     * [KO] 이미지 바이너리 데이터가 저장된 버퍼 뷰(`BufferView`)의 인덱스 (`uri` 사용 시 정의하지 않음)
     * [EN] Index of the `BufferView` containing image binary data (must not be defined when `uri` is defined)
     */
    "bufferView"?: GlTfId;
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 재질에서 참조하는 텍스처 인덱스 및 UV 좌표 세트 정보를 정의하는 인터페이스입니다.
 * [EN] Interface defining the texture index and UV coordinate set referenced by a material.
 *
 * @category Loader
 */
export interface TextureInfo {
    /**
     * [KO] 참조할 텍스처(`Texture`)의 인덱스
     * [EN] Index of the referenced `Texture`
     */
    "index": GlTfId;
    /**
     * [KO] 텍스처 좌표 매핑에 사용할 정점의 `TEXCOORD` 속성 세트 인덱스 (기본값: `0`)
     * [EN] Set index of the mesh's `TEXCOORD` attribute used for texture coordinate mapping (default: `0`)
     */
    "texCoord"?: number;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 물리 기반 렌더링(PBR)의 금속성-거칠기(Metallic-Roughness) 재질 모델을 정의하는 파라미터 인터페이스입니다.
 * [EN] Interface defining parameter values for the Physically-Based Rendering (PBR) metallic-roughness material model.
 *
 * @category Loader
 */
export interface MaterialPbrMetallicRoughness {
    /**
     * [KO] 재질의 기본 색상(Base Color) 배율 배열 (`[r, g, b, a]`, 각 성분 `0.0` ~ `1.0`)
     * [EN] Base color factor array of the material (`[r, g, b, a]`, each component `0.0` to `1.0`)
     */
    "baseColorFactor"?: number[];
    /**
     * [KO] 기본 색상(Base Color) 텍스처 참조 정보
     * [EN] Base color texture reference descriptor
     */
    "baseColorTexture"?: TextureInfo;
    /**
     * [KO] 재질의 금속성(Metalness) 계수 (`0.0` ~ `1.0`)
     * [EN] Metalness factor of the material (`0.0` to `1.0`)
     */
    "metallicFactor"?: number;
    /**
     * [KO] 재질의 거칠기(Roughness) 계수 (`0.0` ~ `1.0`)
     * [EN] Roughness factor of the material (`0.0` to `1.0`)
     */
    "roughnessFactor"?: number;
    /**
     * [KO] 금속성-거칠기(Metallic-Roughness) 텍스처 참조 정보 (B 채널: 금속성, G 채널: 거칠기)
     * [EN] Metallic-roughness texture reference descriptor (B channel: metalness, G channel: roughness)
     */
    "metallicRoughnessTexture"?: TextureInfo;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 재질의 탄젠트 공간 노멀 텍스처(Normal Texture) 참조 및 스케일 정보를 정의하는 인터페이스입니다.
 * [EN] Interface defining the tangent-space normal texture reference and scale factor for a material.
 *
 * @category Loader
 */
export interface MaterialNormalTextureInfo {
    /**
     * [KO] 참조할 텍스처(`Texture`)의 인덱스
     * [EN] Index of the referenced `Texture`
     */
    "index"?: any;
    /**
     * [KO] 노멀 텍스처 매핑에 사용할 `TEXCOORD` 속성 세트 인덱스
     * [EN] Set index of the `TEXCOORD` attribute used for normal texture mapping
     */
    "texCoord"?: any;
    /**
     * [KO] 노멀 텍스처의 X, Y 법선 성분에 곱해지는 스케일 계수
     * [EN] Scalar multiplier applied to the X and Y components of the normal texture
     */
    "scale"?: number;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 재질의 오클루전 텍스처(Occlusion Texture) 참조 및 강도 정보를 정의하는 인터페이스입니다.
 * [EN] Interface defining the occlusion texture reference and strength factor for a material.
 *
 * @category Loader
 */
export interface MaterialOcclusionTextureInfo {
    /**
     * [KO] 참조할 텍스처(`Texture`)의 인덱스
     * [EN] Index of the referenced `Texture`
     */
    "index"?: any;
    /**
     * [KO] 오클루전 텍스처 매핑에 사용할 `TEXCOORD` 속성 세트 인덱스
     * [EN] Set index of the `TEXCOORD` attribute used for occlusion texture mapping
     */
    "texCoord"?: any;
    /**
     * [KO] 적용되는 차폐(Occlusion) 강도를 조절하는 스칼라 계수 (`0.0` ~ `1.0`)
     * [EN] Scalar multiplier controlling the amount of occlusion applied (`0.0` to `1.0`)
     */
    "strength"?: number;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 프리미티브(Primitive)의 표면 외형을 결정하는 glTF 재질(Material) 인터페이스입니다.
 * [EN] glTF material interface that defines the surface appearance of a primitive.
 *
 * @category Loader
 */
export interface Material {
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;
    /**
     * [KO] PBR 금속성-거칠기(Metallic-Roughness) 모델 속성
     * [EN] PBR metallic-roughness material model properties
     */
    "pbrMetallicRoughness"?: MaterialPbrMetallicRoughness;
    /**
     * [KO] 탄젠트 공간 법선(Normal) 텍스처 정보
     * [EN] Tangent-space normal texture descriptor
     */
    "normalTexture"?: MaterialNormalTextureInfo;
    /**
     * [KO] 환경 차폐(Ambient Occlusion) 텍스처 정보
     * [EN] Ambient occlusion texture descriptor
     */
    "occlusionTexture"?: MaterialOcclusionTextureInfo;
    /**
     * [KO] 자체 발광(Emissive) 텍스처 정보
     * [EN] Emissive texture descriptor
     */
    "emissiveTexture"?: TextureInfo;
    /**
     * [KO] 재질의 자체 발광 색상 배율 (`[r, g, b]`)
     * [EN] Emissive color factors of the material (`[r, g, b]`)
     */
    "emissiveFactor"?: number[];
    /**
     * [KO] 알파 렌더링 모드 (`"OPAQUE"`, `"MASK"`, `"BLEND"`)
     * [EN] Alpha rendering mode (`"OPAQUE"`, `"MASK"`, `"BLEND"`)
     */
    "alphaMode"?: any | string;
    /**
     * [KO] `"MASK"` 알파 모드에서 사용되는 알파 컷오프 임계값
     * [EN] Alpha cutoff threshold used when `alphaMode` is `"MASK"`
     */
    "alphaCutoff"?: number;
    /**
     * [KO] 양면 렌더링(Double-Sided) 여부
     * [EN] Whether the material is double-sided
     */
    "doubleSided"?: boolean;

    [k: string]: any;
}

/**
 * [KO] 단일 재질로 렌더링되는 기하 구조 단위인 메쉬 프리미티브(Mesh Primitive) 인터페이스입니다.
 * [EN] Mesh primitive interface defining geometry to be rendered with a given material.
 *
 * @category Loader
 */
export interface MeshPrimitive {
    /**
     * [KO] 정점 속성 시맨틱(예: `"POSITION"`, `"NORMAL"`)을 해당 접근자(`Accessor`) 인덱스에 매핑하는 객체
     * [EN] Dictionary object mapping vertex attribute semantics (e.g., `"POSITION"`, `"NORMAL"`) to `Accessor` indices
     */
    "attributes": {
        [k: string]: GlTfId;
    };
    /**
     * [KO] 정점 인덱스 데이터를 담고 있는 접근자(`Accessor`)의 인덱스
     * [EN] Index of the `Accessor` containing vertex indices
     */
    "indices"?: GlTfId;
    /**
     * [KO] 이 프리미티브에 적용할 재질(`Material`)의 인덱스
     * [EN] Index of the `Material` to apply to this primitive
     */
    "material"?: GlTfId;
    /**
     * [KO] 렌더링할 프리미티브의 토폴로지(Topology) 모드 (기본값: `4` TRIANGLES)
     * [EN] Topology type of primitives to render (default: `4` TRIANGLES)
     */
    "mode"?: number;
    /**
     * [KO] 모프 타겟(Morph Targets) 정점 속성 매핑 배열
     * [EN] Array of morph target vertex attribute dictionaries
     */
    "targets"?: {
        [k: string]: GlTfId;
    }[];
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 렌더링할 프리미티브(`MeshPrimitive`)들의 집합을 정의하는 glTF 메쉬 인터페이스입니다.
 * [EN] glTF mesh interface defining a set of `MeshPrimitive` objects to be rendered.
 *
 * @category Loader
 */
export interface Mesh {
    /**
     * [KO] 렌더링될 기하 구조를 정의하는 프리미티브(`MeshPrimitive`) 배열
     * [EN] Array of `MeshPrimitive` objects defining geometry to be rendered
     */
    "primitives": MeshPrimitive[];
    /**
     * [KO] 모프 타겟(Morph Targets)에 적용될 초기 가중치 배열
     * [EN] Array of initial weights to be applied to morph targets
     */
    "weights"?: number[];
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 씬 계층 구조를 구성하는 단일 노드(Node) 인터페이스입니다.
 * [EN] Interface representing a single node in the scene hierarchy.
 *
 * [KO] 노드는 열 우선(Column-major) 4x4 행렬(`matrix`) 또는 이동/회전/스케일(`translation`/`rotation`/`scale`) 속성을 가질 수 있으며, 메쉬, 카메라, 스킨을 참조할 수 있습니다.
 * [EN] A node can have either a column-major 4x4 transformation `matrix` or `translation`/`rotation`/`scale` (TRS) properties, and may reference a mesh, camera, or skin.
 *
 * @category Loader
 */
export interface Node {
    /**
     * [KO] 이 노드가 참조하는 카메라(`Camera`)의 인덱스
     * [EN] Index of the `Camera` referenced by this node
     */
    "camera"?: GlTfId;
    /**
     * [KO] 이 노드의 자식 노드(`Node`) 인덱스 배열
     * [EN] Array of indices of this node's child `Node` objects
     */
    "children"?: GlTfId[];
    /**
     * [KO] 이 노드의 메쉬 스키닝에 사용되는 스킨(`Skin`)의 인덱스
     * [EN] Index of the `Skin` referenced by this node
     */
    "skin"?: GlTfId;
    /**
     * [KO] 열 우선(Column-major) 순서로 저장된 4x4 부동소수점 변환 행렬 (길이 16 배열)
     * [EN] Floating-point 4x4 transformation matrix stored in column-major order (16-element array)
     */
    "matrix"?: number[];
    /**
     * [KO] 이 노드에 배치할 메쉬(`Mesh`)의 인덱스
     * [EN] Index of the `Mesh` in this node
     */
    "mesh"?: GlTfId;
    /**
     * [KO] 노드의 단위 쿼터니언 회전 값 (`[x, y, z, w]`)
     * [EN] Node's unit quaternion rotation in `[x, y, z, w]` order
     */
    "rotation"?: number[];
    /**
     * [KO] 노드의 X, Y, Z축 스케일 배율 (`[x, y, z]`)
     * [EN] Node's scaling factors along the X, Y, and Z axes (`[x, y, z]`)
     */
    "scale"?: number[];
    /**
     * [KO] 노드의 X, Y, Z축 이동 좌표 (`[x, y, z]`)
     * [EN] Node's translation along the X, Y, and Z axes (`[x, y, z]`)
     */
    "translation"?: number[];
    /**
     * [KO] 인스턴스화된 모프 타겟(Morph Target)의 가중치 배열
     * [EN] Array of weights for the instantiated morph targets
     */
    "weights"?: number[];
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 텍스처의 필터링(Filtering) 및 래핑(Wrapping) 모드를 정의하는 샘플러 인터페이스입니다.
 * [EN] Sampler interface defining texture filtering and wrapping modes.
 *
 * @category Loader
 */
export interface Sampler {
    /**
     * [KO] 확대 필터(Magnification Filter) 상수
     * [EN] Magnification filter constant
     */
    "magFilter"?: number;
    /**
     * [KO] 축소 필터(Minification Filter) 상수
     * [EN] Minification filter constant
     */
    "minFilter"?: number;
    /**
     * [KO] S(U)축 래핑 모드 상수
     * [EN] S (U) wrapping mode constant
     */
    "wrapS"?: number;
    /**
     * [KO] T(V)축 래핑 모드 상수
     * [EN] T (V) wrapping mode constant
     */
    "wrapT"?: number;
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 씬을 구성하는 최상위 루트 노드 목록을 정의하는 인터페이스입니다.
 * [EN] Interface defining the root nodes of a scene.
 *
 * @category Loader
 */
export interface Scene {
    /**
     * [KO] 각 최상위 루트 노드(`Node`)의 인덱스 배열
     * [EN] Array of indices of each root `Node`
     */
    "nodes"?: GlTfId[];
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 버텍스 스키닝(Skinning)을 위한 조인트 노드 목록과 역바인드 행렬을 정의하는 인터페이스입니다.
 * [EN] Interface defining joint nodes and inverse-bind matrices for vertex skinning.
 *
 * @category Loader
 */
export interface Skin {
    /**
     * [KO] 4x4 역바인드 행렬(Inverse-Bind Matrices) 데이터를 담고 있는 접근자(`Accessor`)의 인덱스
     * [EN] Index of the `Accessor` containing the 4x4 floating-point inverse-bind matrices
     */
    "inverseBindMatrices"?: GlTfId;
    /**
     * [KO] 스켈레톤 루트로 사용되는 노드(`Node`)의 인덱스
     * [EN] Index of the `Node` used as a skeleton root
     */
    "skeleton"?: GlTfId;
    /**
     * [KO] 이 스킨의 조인트(뼈대)로 사용되는 스켈레톤 노드(`Node`)들의 인덱스 배열
     * [EN] Array of indices of skeleton `Node` objects used as joints in this skin
     */
    "joints": GlTfId[];
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] 원본 이미지(`Image`)와 샘플러(`Sampler`)를 결합하는 glTF 텍스처 인터페이스입니다.
 * [EN] glTF texture interface combining a source `Image` and a `Sampler`.
 *
 * @category Loader
 */
export interface Texture {
    /**
     * [KO] 이 텍스처가 사용하는 샘플러(`Sampler`)의 인덱스
     * [EN] Index of the `Sampler` used by this texture
     */
    "sampler"?: GlTfId;
    /**
     * [KO] 이 텍스처가 사용하는 이미지(`Image`)의 인덱스
     * [EN] Index of the `Image` used by this texture
     */
    "source"?: GlTfId;
    /**
     * [KO] 객체의 사용자 정의 이름
     * [EN] User-defined name of this object
     */
    "name"?: any;
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}

/**
 * [KO] glTF 2.0 에셋의 최상위 루트 JSON 구조를 정의하는 인터페이스입니다.
 * [EN] Interface defining the root JSON object structure for a glTF 2.0 asset.
 *
 * @category Loader
 */
export interface GLTF {
    /**
     * [KO] 이 에셋에서 사용된 glTF 확장(Extension) 이름 배열
     * [EN] Names of glTF extensions used in this asset
     */
    "extensionsUsed"?: string[];
    /**
     * [KO] 이 에셋을 올바르게 로드하기 위해 필수로 요구되는 glTF 확장 이름 배열
     * [EN] Names of glTF extensions required to properly load this asset
     */
    "extensionsRequired"?: string[];
    /**
     * [KO] 접근자(`Accessor`) 배열
     * [EN] Array of `Accessor` objects
     */
    "accessors"?: Accessor[];
    /**
     * [KO] 키프레임 애니메이션(`Animation`) 배열
     * [EN] Array of keyframe `Animation` objects
     */
    "animations"?: Animation[];
    /**
     * [KO] glTF 에셋에 대한 메타데이터 정보
     * [EN] Metadata about the glTF asset
     */
    "asset": Asset;
    /**
     * [KO] 원시 바이너리 버퍼(`Buffer`) 배열
     * [EN] Array of `Buffer` objects
     */
    "buffers"?: Buffer[];
    /**
     * [KO] 버퍼 뷰(`BufferView`) 배열
     * [EN] Array of `BufferView` objects
     */
    "bufferViews"?: BufferView[];
    /**
     * [KO] 카메라(`Camera`) 배열
     * [EN] Array of `Camera` objects
     */
    "cameras"?: Camera[];
    /**
     * [KO] 이미지(`Image`) 배열
     * [EN] Array of `Image` objects
     */
    "images"?: Image[];
    /**
     * [KO] 재질(`Material`) 배열
     * [EN] Array of `Material` objects
     */
    "materials"?: Material[];
    /**
     * [KO] 메쉬(`Mesh`) 배열
     * [EN] Array of `Mesh` objects
     */
    "meshes"?: Mesh[];
    /**
     * [KO] 노드(`Node`) 배열
     * [EN] Array of `Node` objects
     */
    "nodes"?: Node[];
    /**
     * [KO] 샘플러(`Sampler`) 배열
     * [EN] Array of `Sampler` objects
     */
    "samplers"?: Sampler[];
    /**
     * [KO] 기본 씬(`Scene`)의 인덱스
     * [EN] Index of the default `Scene`
     */
    "scene"?: GlTfId;
    /**
     * [KO] 씬(`Scene`) 배열
     * [EN] Array of `Scene` objects
     */
    "scenes"?: Scene[];
    /**
     * [KO] 스킨(`Skin`) 배열
     * [EN] Array of `Skin` objects
     */
    "skins"?: Skin[];
    /**
     * [KO] 텍스처(`Texture`) 배열
     * [EN] Array of `Texture` objects
     */
    "textures"?: Texture[];
    /**
     * [KO] glTF 확장(Extension) 데이터 객체
     * [EN] glTF extension data object
     */
    "extensions"?: any;
    /**
     * [KO] 애플리케이션별 추가 사용자 정의 데이터
     * [EN] Application-specific extra custom data
     */
    "extras"?: any;

    [k: string]: any;
}
