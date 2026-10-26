import{D as a,o as d,c as r,a2 as t,G as n,w as o}from"./chunks/framework.n5RLHRfo.js";const k=JSON.parse('{"title":"WindManager","description":"","frontmatter":{"title":"WindManager","order":4},"headers":[],"relativePath":"en/environment/wind.md","filePath":"en/environment/wind.md","lastUpdated":1792987289000}'),p={name:"en/environment/wind.md"},m=Object.assign(p,{setup(c){const s=`
    Scene["Scene"] -->|scene.windManager| Wind["WindManager (Global Wind Control)"]
    Wind -->|Direction, Speed & Strength| Foliage["FoliageManager (Trees & Foliage)"]
    Wind -->|Direction, Speed & Strength| Lake["Lake (Water Surface)"]

    %% Grayscale styles applied
    style Scene fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Wind fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Foliage fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Lake fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(h,e)=>{const i=a("MermaidResponsive"),l=a("ClientOnly");return d(),r("div",null,[e[0]||(e[0]=t("",2)),n(l,null,{default:o(()=>[n(i,{definition:s})]),_:1}),e[1]||(e[1]=t("",14))])}}});export{k as __pageData,m as default};
