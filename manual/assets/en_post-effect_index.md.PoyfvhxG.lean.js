import{$ as t,Q as s,j as l,m as o,o as n,ax as c}from"./chunks/framework.D5MFXpji.js";const u=JSON.parse('{"title":"Post-Effect Overview","description":"","frontmatter":{"title":"Post-Effect Overview","order":9},"headers":[],"relativePath":"en/post-effect/index.md","filePath":"en/post-effect/index.md","lastUpdated":1784264306000}'),d={name:"en/post-effect/index.md"},h=Object.assign(d,{setup(f){const i=`
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
`;return(p,e)=>{const a=t("MermaidResponsive"),r=t("ClientOnly");return s(),l("div",null,[e[0]||(e[0]=o("",5)),n(r,null,{default:c(()=>[n(a,{definition:i})]),_:1}),e[1]||(e[1]=o("",6))])}}});export{u as __pageData,h as default};
