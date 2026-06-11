import{$ as o,Q as s,j as l,m as t,o as n,ax as d}from"./chunks/framework.D5MFXpji.js";const h=JSON.parse('{"title":"Post-Effect","description":"","frontmatter":{"title":"Post-Effect","order":9},"headers":[],"relativePath":"ko/post-effect/index.md","filePath":"ko/post-effect/index.md","lastUpdated":1781144716000}'),c={name:"ko/post-effect/index.md"},_=Object.assign(c,{setup(p){const a=`
    graph TB
        subgraph Control ["Control Interface (API)"]
            direction TB
            TMM["view.toneMappingManager"]:::controlNode
            PEM["view.postEffectManager"]:::controlNode
        end

        subgraph HDR ["1. HDR Phase (Scene Components)"]
            direction TB
            SA["SkyAtmosphere"]:::pipelineNode
            SSAO["SSAO (Built-in)"]:::pipelineNode
            SSR["SSR (Built-in)"]:::pipelineNode
            SA --> SSAO --> SSR
        end

        subgraph Transition ["2. Transition Phase (Exposure & User Effects)"]
            direction TB
            AE["AutoExposure"]:::pipelineNode
            GE["User General Effects (Loop)"]:::pipelineNode
            TM["Tone Mapping"]:::pipelineNode
            AE --> GE --> TM
        end

        AA["3. LDR Phase (FXAA / TAA)"]:::pipelineNode

    TMM -.->|Inject Settings| TM
    PEM -.->|Manage & Execute| Transition
    Control --> HDR
    HDR --> Transition
    Transition --> AA

    classDef controlNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    classDef pipelineNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    
    style Control fill:#f4f4f5,stroke:#e4e4e7,stroke-width:1px,color:#27272a;
    style HDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Transition fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
`;return(f,e)=>{const r=o("MermaidResponsive"),i=o("ClientOnly");return s(),l("div",null,[e[0]||(e[0]=t('<h1 id="포스트-이펙트" tabindex="-1">포스트 이펙트 <a class="header-anchor" href="#포스트-이펙트" aria-label="Permalink to &quot;포스트 이펙트&quot;">​</a></h1><p>포스트 이펙트는 3D 씬 렌더링이 완료된 후, 최종 2D 이미지에 시각적 효과를 더하는 기술입니다. RedGPU의 후처리 시스템은 <strong>설정의 편의성</strong>과 <strong>실행의 효율성</strong>을 위해 이원화된 인터페이스를 제공합니다.</p><h2 id="_1-시스템-구조-제어와-실행" tabindex="-1">1. 시스템 구조: 제어와 실행 <a class="header-anchor" href="#_1-시스템-구조-제어와-실행" aria-label="Permalink to &quot;1. 시스템 구조: 제어와 실행&quot;">​</a></h2><p>사용자는 목적에 따라 두 개의 매니저를 통해 후처리를 제어하지만, 실제 연산은 <code>PostEffectManager</code> 가 총괄하는 하나의 파이프라인 내에서 순차적으로 실행됩니다.</p><ul><li><strong>ToneMappingManager</strong> (<code>view.toneMappingManager</code>): 씬의 가장 기본적인 색조, 노출, 대비 등 <strong>색상 변환 설정</strong>을 담당하는 전용 창구입니다.</li><li><strong>PostEffectManager</strong> (<code>view.postEffectManager</code>): 일반 이펙트의 추가/삭제 및 파이프라인의 <strong>전체 실행</strong>을 담당합니다.</li></ul>',5)),n(i,null,{default:d(()=>[n(r,{definition:a})]),_:1}),e[1]||(e[1]=t('<h2 id="_2-렌더링-파이프라인-흐름" tabindex="-1">2. 렌더링 파이프라인 흐름 <a class="header-anchor" href="#_2-렌더링-파이프라인-흐름" aria-label="Permalink to &quot;2. 렌더링 파이프라인 흐름&quot;">​</a></h2><p>모든 효과는 아래 순서에 따라 처리됩니다. 이 순서는 그래픽스 최적화와 시각적 결과의 일관성을 위해 고정되어 있습니다.</p><ol><li><strong>HDR Phase (장면 구성 요소)</strong>: <code>SkyAtmosphere</code>, <code>SSAO</code>(SSAO), <code>SSR</code>(실시간 반사) 등 물리적인 씬 정보를 조립하는 단계입니다.</li><li><strong>Exposure &amp; Transition (노출 및 톤매핑 전환)</strong>: <ul><li><code>AutoExposure</code>(자동 노출) 연산이 수행됩니다.</li><li>사용자가 <code>addEffect()</code>로 등록한 <strong>일반 이펙트</strong> 루프를 실행합니다.</li><li>루프 도중 첫 번째 LDR(Low Dynamic Range) 이펙트를 만나는 시점에 즉시 <strong>Tone Mapping</strong>을 수행하며, 만약 루프가 끝날 때까지 수행되지 않았다면 루프 종료 시점에 수행합니다.</li></ul></li><li><strong>LDR Phase (안티앨리어싱)</strong>: 최종 이미지를 보정하는 마지막 단계로, 활성화 상태에 따라 <code>FXAA</code> 또는 <code>TAA</code> (및 <code>TAASharpen</code>) 연산이 수행됩니다.</li></ol><div class="tip custom-block"><p class="custom-block-title">[라이브 데모]</p><p><a href="https://redcamel.github.io/RedGPU/examples/index.html?tab=PostEffect" target="_blank" rel="noreferrer">RedGPU 공식 예제 페이지</a>에서 모든 효과의 실시간 작동 모습을 확인할 수 있습니다.</p></div><h2 id="_3-학습-가이드" tabindex="-1">3. 학습 가이드 <a class="header-anchor" href="#_3-학습-가이드" aria-label="Permalink to &quot;3. 학습 가이드&quot;">​</a></h2><ul><li><strong><a href="./general-effects.html">일반 이펙트</a></strong> : 블룸, 블러, 흑백 등 다양한 효과 추가하기</li><li><strong><a href="./tone-mapping.html">톤 매핑</a></strong> : 씬의 기본 색감과 노출 설정하기</li><li><strong><a href="./builtin-effects.html">빌트인 이펙트</a></strong> : SSAO, SSR 등 고성능 효과 활성화하기</li><li><strong><a href="./../antialiasing/">안티앨리어싱</a></strong> : 화면 외곽선 정리하기</li></ul>',6))])}}});export{h as __pageData,_ as default};
