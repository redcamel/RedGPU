# [Issue] PBR 확장 레이어들과 SkyAtmosphere IBL 통합 계획

## 1. 개요
PBR 재질의 특수 효과 레이어(Clearcoat, Sheen, Transmission 등)들이 기존의 정적 HDR 환경 맵에만 의존하던 방식을 개선하여, `SkyAtmosphere`의 실시간 대기 산란 데이터를 통합 반영함으로써 물리적 일관성을 확보합니다.

## 2. 통합 대상 및 상세 분석

### 2.1 Clearcoat (투명 코팅) - [완료]
*   **현상**: 코팅층이 대기 산란 무시, 정적 HDR만 반사.
*   **해결**: `clearcoatR` 방향으로 `skyAtmosphere_prefilteredTexture` 샘플링 및 투과율 적용.

### 2.2 Sheen (천/패브릭 광택) - [대기]
*   **현상**: `getSheenIBL` 함수가 `irradianceTexture`만 참조하여, 대기 산란에 의한 부드러운 주변광 변화를 담지 못함.
*   **해결 전략**: `getSheenIBL` 호출 시 `atmosphereIrradianceTexture`와 투과율 데이터를 인자로 전달하거나, 함수 내부에서 시스템 유니폼을 참조하도록 고도화.

### 2.3 Specular Transmission (투과/굴절) - [대기]
*   **현상**: 굴절된 방향으로 배경을 샘플링할 때 대기 투과율이 고려되지 않아 유리/액체 뒤의 대기가 너무 밝게 보일 수 있음.
*   **해결 전략**: `getTransmissionRefraction` 또는 관련 샘플링 로직에 대기 필터링 추가 검토.

### 2.4 Diffuse Transmission (확산 투과) - [완료]
*   **현상**: 물체 뒷면의 산란광 계산 시 `skyViewTexture`를 직접 참조하던 방식이 큐브맵 기반으로 개선됨.
*   **상태**: 이미 `skyAtmosphere_prefilteredTexture` 기반으로 업데이트 완료됨.

## 3. 공통 개선 원칙
1.  **에너지 동기화**: 모든 샘플링된 산란광 데이터에 `sunIntensity`를 곱하여 배경과 톤을 일치시킴.
2.  **투과율 연동**: `getTransmittance` 함수를 사용하여 태양 고도에 따른 환경광 감쇄를 모든 레이어에 적용.
3.  **거칠기 대응**: 각 레이어의 고유한 Roughness 파라미터를 대기 큐브맵의 밉맵 레벨로 변환하여 사용.

## 4. 향후 작업 순서
1.  `getSheenIBL.wgsl` 함수 구조 변경 및 PBR Fragment 연동.
2.  `Transmission` 관련 배경 샘플링 로직의 대기 필터링 정합성 검토.
3.  모든 수정 사항에 대한 시각적 검증 및 성능 측정.
