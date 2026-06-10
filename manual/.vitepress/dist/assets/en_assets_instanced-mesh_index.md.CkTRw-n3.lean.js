import{$ as n,Q as e,j as p,g as i,n as a,o as t,ax as r,m as d}from"./chunks/framework.D5MFXpji.js";const o=JSON.parse('{"title":"Instancing Mesh","description":"","frontmatter":{"title":"Instancing Mesh","order":2},"headers":[],"relativePath":"en/assets/instanced-mesh/index.md","filePath":"en/assets/instanced-mesh/index.md","lastUpdated":1781133167000}'),E={name:"en/assets/instanced-mesh/index.md"},F=Object.assign(E,{setup(g){const h=`
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
`;return(y,s)=>{const l=n("MermaidResponsive"),k=n("ClientOnly");return e(),p("div",null,[s[0]||(s[0]=i("h1",{id:"instancing-mesh",tabindex:"-1"},[a("Instancing Mesh "),i("a",{class:"header-anchor",href:"#instancing-mesh","aria-label":'Permalink to "Instancing Mesh"'},"​")],-1)),s[1]||(s[1]=i("p",null,[i("strong",null,"Instancing Mesh"),a(" is a high-performance object that renders thousands or tens of thousands of objects sharing the same geometry and material in a single "),i("strong",null,"Draw Call"),a(". It is essential for representing forests (trees), grass, particles, crowds, etc.")],-1)),t(k,null,{default:r(()=>[t(l,{definition:h})]),_:1}),s[2]||(s[2]=d("",18))])}}});export{o as __pageData,F as default};
