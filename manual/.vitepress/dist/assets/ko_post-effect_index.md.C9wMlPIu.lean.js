import{D as t,o as s,c as l,a2 as a,G as n,w as c}from"./chunks/framework.DpNgdNqH.js";const _=JSON.parse('{"title":"Post-Effect 개요","description":"","frontmatter":{"title":"Post-Effect 개요","order":9},"headers":[],"relativePath":"ko/post-effect/index.md","filePath":"ko/post-effect/index.md","lastUpdated":1770637469000}'),f={name:"ko/post-effect/index.md"},h=Object.assign(f,{setup(p){const o=`
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
`;return(d,e)=>{const r=t("MermaidResponsive"),i=t("ClientOnly");return s(),l("div",null,[e[0]||(e[0]=a("",5)),n(i,null,{default:c(()=>[n(r,{definition:o})]),_:1}),e[1]||(e[1]=a("",6))])}}});export{_ as __pageData,h as default};
