# [Issue] PBR Clearcoat 레이어와 SkyAtmosphere IBL 통합

## 1. 개요
PBR 재질의 Clearcoat(투명 코팅) 레이어가 기존 HDR 환경 맵만 사용하던 방식에서 벗어나, `SkyAtmosphere` 시스템에서 생성된 실시간 대기 산란 데이터를 함께 사용하도록 개선했습니다.

## 2. 상세 문제점
*   **시각적 불일치**: 기본 표면(Base Specular)은 대기 산란 효과를 받지만, 그 위의 Clearcoat 층은 이를 무시하고 정적인 HDR 맵만 반사하여 물리적으로 어색해 보이는 현상이 있었습니다.
*   **투과율 누락**: Clearcoat 반사광 계산 시 대기 투과율(Transmittance)이 고려되지 않아, 노을이나 밤 상황에서도 코팅층만 비정상적으로 밝게 빛나는 문제가 있었습니다.

## 3. 해결 내용 (Implementation)

### 3.1 셰이더 로직 고도화 (`pbrMaterial/fragment.wgsl`)
*   **실시간 산란광 샘플링**: Clearcoat 반사 벡터(`clearcoatR`)와 거칠기(`clearcoatRoughnessParameter`)를 사용하여 `skyAtmosphere_prefilteredTexture`를 샘플링합니다.
*   **대기 투과율 적용**: 코팅층이 반사하는 HDR 환경광에 `getTransmittance`를 적용하여 태양 고도에 따른 감쇄를 반영했습니다.
*   **에너지 스케일 동기화**: 샘플링된 산란광에 `sunIntensity`를 곱하여 전체 씬의 밝기 밸런스를 맞췄습니다.

### 3.2 수식 반영
```wgsl
// 대기 산란 필터링 적용 (Clearcoat Specular)
if (systemUniforms.useSkyAtmosphere == 1u) {
    let u_atmo = systemUniforms.skyAtmosphere;
    let ccTrans = getTransmittance(transmittanceTexture, atmosphereSampler, u_atmo.cameraHeight, clearcoatR.y, u_atmo.atmosphereHeight);
    let atmoMipCount = f32(textureNumLevels(skyAtmosphere_prefilteredTexture) - 1);
    let atmoMipLevel = clearcoatRoughnessParameter * atmoMipCount;
    let ccSkyScat = textureSampleLevel(skyAtmosphere_prefilteredTexture, atmosphereSampler, clearcoatR, atmoMipLevel).rgb * u_atmo.sunIntensity;
    clearcoatPrefilteredColor = (clearcoatPrefilteredColor * ccTrans) + ccSkyScat;
}
```

## 4. 기대 효과
*   자동차 도장, 유광 플라스틱 등 Clearcoat가 적용된 재질에서 대기 상태(시간대, 날씨 등)가 실시간으로 반영된 사실적인 반사 구현.
*   표면 반사와 코팅층 반사 간의 시각적 톤 일치 및 물리적 정합성 확보.
