# [Optimization] Weight Diet: Material System Consolidation

## 📌 개요 (Overview)
RedGPU 프로젝트의 핵심 구성 요소인 재질(Material) 시스템 내의 중복 로직을 제거하고, 구조적 설계를 표준화하여 전체 코드 용량 감축 및 유지보수 효율성을 극대화합니다.

---

## 🎯 최적화 목표 (Goals)
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 25%;">목표 항목</th>
      <th style="width: 50%;">세부 내용</th>
      <th style="width: 25%;">기대 효과</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>재질 시스템 경량화</b></td>
      <td><code>DefineForFragment</code> 보일러플레이트 제거 및 유니폼 업데이트 자동화</td>
      <td>코드 용량 감축 (~60%)</td>
    </tr>
    <tr>
      <td><b>WGSL 표준화</b></td>
      <td>셰이더 내 중복되는 구조체 선언을 라이브러리 기반으로 단일화</td>
      <td>셰이더 유지보수성 향상</td>
    </tr>
    <tr>
      <td><b>구조적 설계 최적화</b></td>
      <td>텍스처 및 샘플러 바인딩 관리를 베이스 클래스에서 일관되게 처리</td>
      <td>구현 복잡도 완화</td>
    </tr>
  </tbody>
</table>

---

## 🛠️ 주요 작업 계획 현황 (Task Plan)

### 1. 유니폼 및 속성 관리 자동화
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 30%;">작업 항목</th>
      <th style="width: 55%;">세부 내용</th>
      <th style="width: 15%;">상태</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Uniform 업데이트 자동화</b></td>
      <td>클래스 메타데이터 기반으로 속성 변경 시 자동 업데이트 (Proxy/Decorator)</td>
      <td align="center">🟡</td>
    </tr>
    <tr>
      <td><b>Getter/Setter 최적화</b></td>
      <td>반복적인 유니폼 업데이트 상용구(Boilerplate) 제거</td>
      <td align="center">🟡</td>
    </tr>
    <tr>
      <td><b>Uniform 메타데이터화</b></td>
      <td>오프셋, 타입 정보를 정적 맵으로 관리하여 코드량 절감</td>
      <td align="center">🟡</td>
    </tr>
  </tbody>
</table>

### 2. 셰이더 및 리소스 관리 표준화
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 30%;">작업 항목</th>
      <th style="width: 55%;">세부 내용</th>
      <th style="width: 15%;">상태</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>WGSL 구조체 단일화</b></td>
      <td>중복 <code>Uniforms</code> 구조체를 <code>SystemCodeManager</code>로 이관</td>
      <td align="center">🟡</td>
    </tr>
    <tr>
      <td><b>탄젠트 데이터 활용</b></td>
      <td><code>PrimitiveUtils.calculateTangents</code> 최적화(TypedArray 직접 처리) 및 실시간 TBN 연산 부하 감소</td>
      <td align="center">🟡</td>
    </tr>
    <tr>
      <td><b>리소스 생성 GC 최적화</b></td>
      <td>지오메트리 생성 루프 내 객체 생성 최소화 (Scratchpad 활용 리팩토링)</td>
      <td align="center">✅</td>
    </tr>
    <tr>
      <td><b>Shader Chunk 모듈화</b></td>
      <td>색상 변환, 조명 감쇄 등 공통 헬퍼 함수들을 라이브러리화</td>
      <td align="center">🟡</td>
    </tr>
    <tr>
      <td><b>ABaseMaterial 확장</b></td>
      <td>리소스 바인딩 관리를 베이스 클래스에서 통합 처리</td>
      <td align="center">🟡</td>
    </tr>
  </tbody>
</table>

---

## 🔍 개선 전략 (Improvement Strategy)
<table style="width: 100%;">
  <thead>
    <tr>
      <th style="width: 30%;">전략 항목</th>
      <th style="width: 70%;">상세 전략</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>자동화 아키텍처</b></td>
      <td>속성 정의 시 메타데이터를 주입하여 런타임에 유니폼 오프셋을 자동 계산하는 구조 도입</td>
    </tr>
    <tr>
      <td><b>#redgpu_include 활용</b></td>
      <td>셰이더 전처리기를 적극 활용하여 공통 구조체 및 함수 재사용 극대화</td>
    </tr>
    <tr>
      <td><b>TBN Matrix 최적화</b></td>
      <td>미리 계산된 탄젠트/비탄젠트 부호를 사용하여 노멀 매핑의 정확도와 성능 동시 확보</td>
    </tr>
  </tbody>
</table>

---
**대상 버전:** V4.1.0-Alpha
