import{D as a,o as r,c as d,k as i,a as n,G as e,w as c,a2 as t}from"./chunks/framework.n5RLHRfo.js";const m=JSON.parse('{"title":"Instancing Mesh","description":"","frontmatter":{"title":"Instancing Mesh","order":2},"headers":[],"relativePath":"en/extended-objects/instanced-mesh/index.md","filePath":"en/extended-objects/instanced-mesh/index.md","lastUpdated":1792987289000}'),o={name:"en/extended-objects/instanced-mesh/index.md"},F=Object.assign(o,{setup(E){const l=`
    CPU["CPU (1 Draw Call)"] -->|Send| GPU["GPU (Buffer Operations)"]
    GPU --> Inst1["Instance 1"]
    GPU --> Inst2["Instance 2"]
    GPU --> InstN["Instance N..."]

    %% Grayscale styles applied
    style CPU fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style GPU fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Inst1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Inst2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style InstN fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(g,s)=>{const h=a("MermaidResponsive"),p=a("ClientOnly"),k=a("ExampleFrame");return r(),d("div",null,[s[0]||(s[0]=i("h1",{id:"instancing-mesh",tabindex:"-1"},[n("Instancing Mesh "),i("a",{class:"header-anchor",href:"#instancing-mesh","aria-label":'Permalink to "Instancing Mesh"'},"​")],-1)),s[1]||(s[1]=i("p",null,[i("strong",null,"Instancing Mesh"),n(" is a high-performance object that renders thousands or tens of thousands of objects sharing the same geometry and material in a single "),i("strong",null,"Draw Call"),n(". It is essential for representing forests (trees), grass, crowds, etc.")],-1)),e(p,null,{default:c(()=>[e(h,{definition:l})]),_:1}),s[2]||(s[2]=t("",11)),e(k,{src:"/RedGPU/examples/3d/instancedMesh/simple/",style:{width:"100%",height:"500px"}}),s[3]||(s[3]=t("",7))])}}});export{m as __pageData,F as default};
