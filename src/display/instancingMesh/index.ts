/**
 * [KO] 수많은 동일 객체를 효율적으로 렌더링하기 위한 GPU 인스턴싱 시스템을 제공합니다.
 * [EN] Provides a GPU instancing system for efficiently rendering numerous identical objects.
 *
 * [KO] 단일 드로우 콜로 수천 개의 인스턴스를 처리하며, 각 인스턴스별 개별 트랜스폼 및 속성 제어 기능을 지원합니다.
 * [EN] It handles thousands of instances with a single draw call and supports individual transform and property control for each instance.
 *
 * @packageDocumentation
 */
import * as CoreInstancingMesh from "./core";
import InstancingMesh from "./InstancingMesh";

export {InstancingMesh, CoreInstancingMesh};
