import{D as s,o as l,c as i,k as a,a as r,G as n,w as d,a2 as p}from"./chunks/framework.n5RLHRfo.js";const u=JSON.parse('{"title":"Post-Effect Overview","description":"The Post-Effect system applies screen-space lighting, color grading, lens effects, and anti-aliasing to the final output image via a compute-shader pipe...","frontmatter":{"title":"Post-Effect Overview","order":9},"headers":[],"relativePath":"en/post-effect/index.md","filePath":"en/post-effect/index.md","lastUpdated":1794650641000}'),m={name:"en/post-effect/index.md"},R=Object.assign(m,{setup(f){const t=`
    graph TB
        subgraph HDR ["1. HDR Built-in & Temporal Phase"]
            direction TB
            SA["SkyAtmosphere / SSAO / SSR / Fog / HeightFog"]:::pipelineNode
            TAA["TAA / AutoExposure"]:::pipelineNode
            OPT["DOF / Bloom / LensFlare"]:::pipelineNode
            SA --> TAA --> OPT
        end

        subgraph LDR ["2. Tone Mapping & LDR Post-Processing Phase"]
            direction TB
            TM["ToneMappingManager (HDR → LDR)"]:::pipelineNode
            BLDR["Built-in LDR (ChromaticAberration / LensDistortion / Vignetting / FilmGrain)"]:::pipelineNode
            ULDR["PostEffectManager (Custom LDR Chain)"]:::pipelineNode
            TM --> BLDR --> ULDR
        end

        subgraph Final ["3. Debugger Isolation & Final Output Phase"]
            direction TB
            DBG["DebuggerRenderer (Overlay Pass)"]:::pipelineNode
            AA["FinalRender (Fused FXAA / TAA CAS)"]:::pipelineNode
            DBG --> AA
        end

        HDR --> LDR --> Final

    classDef pipelineNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    style HDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style LDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Final fill:#f4f4f5,stroke:#e4e4e7,stroke-width:1px,color:#27272a;
`;return(P,e)=>{const o=s("MermaidResponsive"),c=s("ClientOnly");return l(),i("div",null,[e[0]||(e[0]=a("h1",{id:"post-effect",tabindex:"-1"},[r("Post-Effect "),a("a",{class:"header-anchor",href:"#post-effect","aria-label":'Permalink to "Post-Effect"'},"​")],-1)),e[1]||(e[1]=a("p",null,"The Post-Effect system applies screen-space lighting, color grading, lens effects, and anti-aliasing to the final output image via a compute-shader pipeline after the 3D scene's G-Buffer rendering is complete.",-1)),n(c,null,{default:d(()=>[n(o,{definition:t})]),_:1}),e[2]||(e[2]=p("",15))])}}});export{u as __pageData,R as default};
