import{D as n,o as r,c as l,k as a,a as c,G as o,w as d,a2 as p}from"./chunks/framework.n5RLHRfo.js";const u=JSON.parse('{"title":"Post-Effect Overview","description":"","frontmatter":{"title":"Post-Effect Overview","order":9},"headers":[],"relativePath":"en/post-effect/index.md","filePath":"en/post-effect/index.md","lastUpdated":1792987289000}'),f={name:"en/post-effect/index.md"},P=Object.assign(f,{setup(m){const t=`
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
`;return(h,e)=>{const s=n("MermaidResponsive"),i=n("ClientOnly");return r(),l("div",null,[e[0]||(e[0]=a("h1",{id:"post-effect",tabindex:"-1"},[c("Post-Effect "),a("a",{class:"header-anchor",href:"#post-effect","aria-label":'Permalink to "Post-Effect"'},"​")],-1)),e[1]||(e[1]=a("p",null,"The Post-Effect system applies screen-space lighting, color grading, lens effects, and anti-aliasing to the final output image via a compute-shader pipeline after the 3D scene's G-Buffer rendering is complete.",-1)),o(i,null,{default:d(()=>[o(s,{definition:t})]),_:1}),e[2]||(e[2]=p("",15))])}}});export{u as __pageData,P as default};
