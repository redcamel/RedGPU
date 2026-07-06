import{$ as t,Q as o,j as r,m as a,o as s,ax as d}from"./chunks/framework.D5MFXpji.js";const k=JSON.parse('{"title":"RedGPU Context","description":"Learn about RedGPUContext, the starting point and resource manager of the RedGPU engine.","frontmatter":{"title":"RedGPU Context","description":"Learn about RedGPUContext, the starting point and resource manager of the RedGPU engine.","order":2},"headers":[],"relativePath":"en/context/index.md","filePath":"en/context/index.md","lastUpdated":1783325144000}'),c={name:"en/context/index.md"},y=Object.assign(c,{setup(h){const i=`
    graph LR
        Init["Call RedGPU.init()"] -->|Async| Callback["onSuccess Callback"]
        Callback -->|Get Instance| Setup["Scene & View Setup"]
        Setup -->|Start Loop| Render["Renderer.start()"]
        
        %% Grayscale styles applied
        style Init fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
        style Callback fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Setup fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Render fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`;return(p,e)=>{const n=t("MermaidResponsive"),l=t("ClientOnly");return o(),r("div",null,[e[0]||(e[0]=a("",10)),s(l,null,{default:d(()=>[s(n,{definition:i})]),_:1}),e[1]||(e[1]=a("",43))])}}});export{k as __pageData,y as default};
