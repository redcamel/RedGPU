import{D as o,o as d,c as r,k as a,a as c,G as s,w as i,a2 as p}from"./chunks/framework.n5RLHRfo.js";const R=JSON.parse('{"title":"Post-Effect","description":"","frontmatter":{"title":"Post-Effect","order":9},"headers":[],"relativePath":"ko/post-effect/index.md","filePath":"ko/post-effect/index.md","lastUpdated":1792993711000}'),f={name:"ko/post-effect/index.md"},u=Object.assign(f,{setup(m){const n=`
    graph TB
        subgraph HDR ["1. HDR Built-in & Temporal Phase"]
            direction TB
            SA["SkyAtmosphere"]:::pipelineNode
            SSAO["SSAO (useSSAO)"]:::pipelineNode
            SSR["SSR (useSSR)"]:::pipelineNode
            TAA["TAA (Temporal Accumulation)"]:::pipelineNode
            AE["AutoExposure"]:::pipelineNode
            SA --> SSAO --> SSR --> TAA --> AE
        end

        subgraph Transition ["2. User Effects & Tone Mapping Phase"]
            direction TB
            HDR_EFF["HDR User Effects (OldBloom, etc.)"]:::pipelineNode
            TM["ToneMappingManager (HDR → LDR)"]:::pipelineNode
            LDR_EFF["LDR User Effects (Blur, DoF, etc.)"]:::pipelineNode
            HDR_EFF --> TM --> LDR_EFF
        end

        subgraph Final ["3. LDR Finalization Phase"]
            direction TB
            AA["FXAA / TAA CAS Sharpen"]:::pipelineNode
        end

        HDR --> Transition --> Final

    classDef pipelineNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    style HDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Transition fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Final fill:#f4f4f5,stroke:#e4e4e7,stroke-width:1px,color:#27272a;
`;return(P,e)=>{const t=o("MermaidResponsive"),l=o("ClientOnly");return d(),r("div",null,[e[0]||(e[0]=a("h1",{id:"포스트-이펙트",tabindex:"-1"},[c("포스트 이펙트 "),a("a",{class:"header-anchor",href:"#포스트-이펙트","aria-label":'Permalink to "포스트 이펙트"'},"​")],-1)),e[1]||(e[1]=a("p",null,"포스트 이펙트 (Post-Effect)는 3D 씬의 G-Buffer 렌더링이 완료된 후, 컴퓨트 셰이더 기반 파이프라인을 통해 최종 화면에 공간 광원 효과, 색보정, 렌즈 효과 및 안티앨리어싱을 적용하는 후처리 시스템입니다.",-1)),s(l,null,{default:i(()=>[s(t,{definition:n})]),_:1}),e[2]||(e[2]=p("",15))])}}});export{R as __pageData,u as default};
