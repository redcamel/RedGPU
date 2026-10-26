import{D as a,o as d,c as r,a2 as s,G as n,w as o}from"./chunks/framework.n5RLHRfo.js";const k=JSON.parse('{"title":"WindManager","description":"","frontmatter":{"title":"WindManager","order":4},"headers":[],"relativePath":"ko/environment/wind.md","filePath":"ko/environment/wind.md","lastUpdated":1792993711000}'),p={name:"ko/environment/wind.md"},m=Object.assign(p,{setup(h){const t=`
    Scene["Scene"] -->|scene.windManager| Wind["WindManager (전역 바람 제어)"]
    Wind -->|풍향·풍속·강도 전달| Foliage["FoliageManager (나무·수목)"]
    Wind -->|풍향·풍속·강도 전달| Lake["Lake (호수·수면)"]

    %% 회색조 스타일 적용
    style Scene fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Wind fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Foliage fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Lake fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(c,e)=>{const i=a("MermaidResponsive"),l=a("ClientOnly");return d(),r("div",null,[e[0]||(e[0]=s("",2)),n(l,null,{default:o(()=>[n(i,{definition:t})]),_:1}),e[1]||(e[1]=s("",14))])}}});export{k as __pageData,m as default};
