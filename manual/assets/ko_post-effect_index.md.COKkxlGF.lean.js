import{D as s,o as l,c as d,k as a,a as p,G as o,w as i,a2 as r}from"./chunks/framework.n5RLHRfo.js";const h=JSON.parse('{"title":"Post-Effect","description":"포스트 이펙트 (Post-Effect)는 3D 씬의 G-Buffer 렌더링이 완료된 후, 컴퓨트 셰이더 기반 파이프라인을 통해 최종 화면에 공간 광원 효과, 색보정, 렌즈 효과 및 안티앨리어싱을 적용하는 후처리 시스템입니다.","frontmatter":{"title":"Post-Effect","order":9},"headers":[],"relativePath":"ko/post-effect/index.md","filePath":"ko/post-effect/index.md","lastUpdated":1794650641000}'),m={name:"ko/post-effect/index.md"},G=Object.assign(m,{setup(P){const n=`
    graph TB
        subgraph HDR ["1. HDR 빌트인 이펙트 및 시간 누적 단계"]
            direction TB
            SA["SkyAtmosphere / SSAO / SSR / Fog / HeightFog"]:::pipelineNode
            TAA["TAA / AutoExposure"]:::pipelineNode
            OPT["DOF / Bloom / LensFlare"]:::pipelineNode
            SA --> TAA --> OPT
        end

        subgraph LDR ["2. 톤 매핑 및 LDR 후처리 단계"]
            direction TB
            TM["ToneMappingManager (HDR → LDR)"]:::pipelineNode
            BLDR["BuiltIn LDR (색수차 / 왜곡 / 비네팅 / 그레인)"]:::pipelineNode
            ULDR["PostEffectManager (사용자 커스텀 LDR 체인)"]:::pipelineNode
            TM --> BLDR --> ULDR
        end

        subgraph Final ["3. 디버거 격리 및 최종 출력 단계"]
            direction TB
            DBG["DebuggerRenderer (오버레이 패스)"]:::pipelineNode
            AA["FinalRender (Fused FXAA / TAA CAS)"]:::pipelineNode
            DBG --> AA
        end

        HDR --> LDR --> Final

    classDef pipelineNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    style HDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style LDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Final fill:#f4f4f5,stroke:#e4e4e7,stroke-width:1px,color:#27272a;
`;return(f,e)=>{const t=s("MermaidResponsive"),c=s("ClientOnly");return l(),d("div",null,[e[0]||(e[0]=a("h1",{id:"포스트-이펙트",tabindex:"-1"},[p("포스트 이펙트 "),a("a",{class:"header-anchor",href:"#포스트-이펙트","aria-label":'Permalink to "포스트 이펙트"'},"​")],-1)),e[1]||(e[1]=a("p",null,"포스트 이펙트 (Post-Effect)는 3D 씬의 G-Buffer 렌더링이 완료된 후, 컴퓨트 셰이더 기반 파이프라인을 통해 최종 화면에 공간 광원 효과, 색보정, 렌즈 효과 및 안티앨리어싱을 적용하는 후처리 시스템입니다.",-1)),o(c,null,{default:i(()=>[o(t,{definition:n})]),_:1}),e[2]||(e[2]=r("",15))])}}});export{h as __pageData,G as default};
