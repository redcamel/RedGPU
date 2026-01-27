import{D as t,o as s,c as l,a2 as n,G as i,w as c}from"./chunks/framework.Dn9yU8Jh.js";const u=JSON.parse('{"title":"Post-Effect Overview","description":"","frontmatter":{"title":"Post-Effect Overview","order":9},"headers":[],"relativePath":"en/post-effect/index.md","filePath":"en/post-effect/index.md","lastUpdated":1769513216000}'),f={name:"en/post-effect/index.md"},h=Object.assign(f,{setup(d){const a=`
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
`;return(g,e)=>{const o=t("MermaidResponsive"),r=t("ClientOnly");return s(),l("div",null,[e[0]||(e[0]=n("",5)),i(r,null,{default:c(()=>[i(o,{definition:a})]),_:1}),e[1]||(e[1]=n("",6))])}}});export{u as __pageData,h as default};
