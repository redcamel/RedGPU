import{D as t,c as s,o as l,a2 as a,H as n,w as c}from"./chunks/framework.cYGcyyTy.js";const _=JSON.parse('{"title":"Post-Effect 개요","description":"","frontmatter":{"title":"Post-Effect 개요","order":9},"headers":[],"relativePath":"ko/post-effect/index.md","filePath":"ko/post-effect/index.md","lastUpdated":1769496586000}'),f={name:"ko/post-effect/index.md"},h=Object.assign(f,{setup(p){const o=`
    subgraph Control ["Control Interface (API)"]
        direction LR
        TMM["view.toneMappingManager"]
        PEM["view.postEffectManager"]
    end

    subgraph Pipeline ["Execution Pipeline (GPU)"]
        direction TB
        TM["1. Tone Mapping"]
        CE["2. General Effects (Chained)"]
        SE["3. Screen Space Effects (Built-in)"]
        AA["4. Antialiasing"]
        
        TM --> CE --> SE --> AA
    end

    TMM -.->|Inject Settings| TM
    PEM -.->|Manage & Execute| Pipeline
`;return(d,e)=>{const r=t("MermaidResponsive"),i=t("ClientOnly");return l(),s("div",null,[e[0]||(e[0]=a('<h1 id="포스트-이펙트" tabindex="-1">포스트 이펙트 <a class="header-anchor" href="#포스트-이펙트" aria-label="Permalink to &quot;포스트 이펙트&quot;">​</a></h1><p>포스트 이펙트는 3D 씬 렌더링이 완료된 후, 최종 2D 이미지에 시각적 효과를 더하는 기술입니다. RedGPU의 후처리 시스템은 <strong>설정의 편의성</strong>과 <strong>실행의 효율성</strong>을 위해 이원화된 인터페이스를 제공합니다.</p><h2 id="_1-시스템-구조-제어와-실행" tabindex="-1">1. 시스템 구조: 제어와 실행 <a class="header-anchor" href="#_1-시스템-구조-제어와-실행" aria-label="Permalink to &quot;1. 시스템 구조: 제어와 실행&quot;">​</a></h2><p>사용자는 목적에 따라 두 개의 매니저를 통해 후처리를 제어하지만, 실제 연산은 <code>PostEffectManager</code> 가 총괄하는 하나의 파이프라인 내에서 순차적으로 실행됩니다.</p><ul><li><strong>ToneMappingManager</strong> (<code>view.toneMappingManager</code>): 씬의 가장 기본적인 색조, 노출, 대비 등 <strong>색상 변환 설정</strong>을 담당하는 전용 창구입니다.</li><li><strong>PostEffectManager</strong> (<code>view.postEffectManager</code>): 일반 이펙트의 추가/삭제 및 파이프라인의 <strong>전체 실행</strong>을 담당합니다.</li></ul>',5)),n(i,null,{default:c(()=>[n(r,{definition:o})]),_:1}),e[1]||(e[1]=a('<h2 id="_2-렌더링-파이프라인-흐름" tabindex="-1">2. 렌더링 파이프라인 흐름 <a class="header-anchor" href="#_2-렌더링-파이프라인-흐름" aria-label="Permalink to &quot;2. 렌더링 파이프라인 흐름&quot;">​</a></h2><p>모든 효과는 아래 순서에 따라 처리됩니다. 이 순서는 그래픽스 최적화와 시각적 결과의 일관성을 위해 고정되어 있습니다.</p><ol><li><strong>Tone Mapping</strong>: HDR 데이터를 디스플레이 범위로 변환하는 첫 번째 관문입니다.</li><li><strong>General Effects</strong>: <code>addEffect()</code> 로 추가된 효과들이 등록된 순서대로 체인처럼 연결되어 실행됩니다.</li><li><strong>Screen Space Effects</strong>: SSAO, SSR 등 씬의 깊이 정보를 활용하는 고성능 빌트인 효과가 적용됩니다.</li><li><strong>Antialiasing</strong>: 계단 현상을 제거하는 최종 보정 단계입니다.</li></ol><div class="tip custom-block"><p class="custom-block-title">[라이브 데모]</p><p><a href="https://redcamel.github.io/RedGPU/examples/#postEffect" target="_blank" rel="noreferrer">RedGPU 공식 예제 페이지</a>에서 모든 효과의 실시간 작동 모습을 확인할 수 있습니다.</p></div><h2 id="_3-학습-가이드" tabindex="-1">3. 학습 가이드 <a class="header-anchor" href="#_3-학습-가이드" aria-label="Permalink to &quot;3. 학습 가이드&quot;">​</a></h2><ul><li><strong><a href="./general-effects.html">일반 이펙트</a></strong> : 블룸, 블러, 흑백 등 다양한 효과 추가하기</li><li><strong><a href="./tone-mapping.html">톤 매핑</a></strong> : 씬의 기본 색감과 노출 설정하기</li><li><strong><a href="./builtin-effects.html">빌트인 이펙트</a></strong> : SSAO, SSR 등 고성능 효과 활성화하기</li><li><strong><a href="./../assets/text-field/">텍스트 필드</a></strong> : 3D 공간에 텍스트 UI 추가하기</li></ul>',6))])}}});export{_ as __pageData,h as default};
