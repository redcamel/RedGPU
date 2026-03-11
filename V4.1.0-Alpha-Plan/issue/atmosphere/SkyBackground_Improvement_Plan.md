# Sky Background (Background Fragment) 개선 계획

## 1. 배경 및 목적
`background_fragment.wgsl`은 대기권 밖의 무한대 영역(하늘, 태양)을 렌더링합니다. 현재 물리적으로 정확한 산란광과 태양 본체를 그려주고 있으나, 상용 엔진(UE5) 수준의 완성도와 후처리 파이프라인(TAA, Motion Blur)과의 완벽한 호환을 위해 추가적인 기능 보강이 필요합니다.

---

## 2. 주요 개선 항목

### 2.1 [P0] 모션 벡터(Motion Vector) 구현
* **문제**: 현재 하늘 영역의 모션 벡터가 `0.0`으로 고정되어 있어, 카메라 회전 시 TAA나 모션 블러에서 아티팩트가 발생할 수 있음.
* **해결**: 이전 프레임의 View-Projection 행렬을 사용하여 배경 픽셀의 이동량을 계산하고 `output.motionVector`에 기록.

### 2.2 [P1] 컬러 밴딩 제거 (Dithering)
* **문제**: 부드러운 대기 그라데이션 영역에서 8비트 정밀도 한계로 인한 계단 현상(Banding) 발생.
* **해결**: `Interleaved Gradient Noise` 또는 `Blue Noise`를 활용한 디더링 알고리즘을 최종 출력 단계에 적용.

### 2.3 [P2] 밤하늘 표현 (Star Field)
* **문제**: 태양이 지평선 아래로 내려갔을 때 단순 블랙/다크 블루로 표현되어 시각적 정보가 부족함.
* **해결**: 
    * 태양 고도에 따른 절차적 별(Stars) 렌더링.
    * 큐브맵 기반의 은하수 및 별자리 레이어 추가.

### 2.4 [P2] 두 번째 광원(Moon) 지원
* **문제**: 밤 시간대에 달의 존재와 그에 따른 미 산란(Mie Glow) 효과가 누락됨.
* **해결**: 
    * `MoonDirection`, `MoonIntensity` 파라미터 추가.
    * 달 원반(Moon Disk) 및 텍스처 매핑 지원.

### 2.5 [P3] G-Buffer 데이터 최적화
* **문제**: `normal` 데이터가 비어 있어 SSR 등 일부 후처리 효과에서 배경 처리에 예외 케이스 발생 가능.
* **해결**: 하늘 영역임을 나타내는 마커 값 혹은 기본 천장 방향 노멀(0, 1, 0) 기입.

---

## 3. 단계별 실행 로직

### 단계 1: 모션 벡터 및 기본 데이터 기입
* `SkyAtmosphere.ts`에서 이전 프레임 행렬을 셰이더로 전달.
* `background_fragment.wgsl`에서 클립 공간 좌표 변환을 통해 모션 벡터 계산.

### 단계 2: 디더링 엔진 통합
* `math.noise` 등 공용 노이즈 함수를 인클루드하여 출력 색상 보정.

### 단계 3: 천체 시스템(Stars/Moon) 확장
* 밤하늘 레이어를 위한 별도의 컴퓨트/프래그먼트 패스 설계 및 블렌딩.

---

## 🔗 관련 문서 (Related Documents)
* **[분석 보고서] [SkyAtmosphere 구현 심층 분석 및 UE5 비교 보고서](./SkyAtmosphere_UE5_Comparison_Analysis.md)**
* **[인덱스] [SkyAtmosphere 개선 프로젝트 메인 README](./README.md)**
