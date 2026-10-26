import{D as s,o as d,c as o,a2 as a,G as i,w as h}from"./chunks/framework.n5RLHRfo.js";const g=JSON.parse('{"title":"RedGPU Context","description":"Learn about RedGPUContext, the entry point and resource manager of the RedGPU engine.","frontmatter":{"title":"RedGPU Context","description":"Learn about RedGPUContext, the entry point and resource manager of the RedGPU engine.","order":2},"headers":[],"relativePath":"en/context/index.md","filePath":"en/context/index.md","lastUpdated":1792993711000}'),r={name:"en/context/index.md"},E=Object.assign(r,{setup(p){const n=`
    graph LR
        Init["Call RedGPU.init()"] -->|Async| Callback["onWebGPUInitialized Callback"]
        Callback -->|Acquire Instance| Setup["Scene & View Setup"]
        Setup -->|Start Loop| Render["Renderer.start()"]
        
        %% Grayscale styles applied
        style Init fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
        style Callback fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Setup fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Render fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`;return(c,e)=>{const t=s("MermaidResponsive"),l=s("ClientOnly");return d(),o("div",null,[e[0]||(e[0]=a("",6)),i(l,null,{default:h(()=>[i(t,{definition:n})]),_:1}),e[1]||(e[1]=a("",26))])}}});export{g as __pageData,E as default};
