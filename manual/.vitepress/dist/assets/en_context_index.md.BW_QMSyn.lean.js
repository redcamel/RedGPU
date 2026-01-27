import{D as i,o as h,c as r,a2 as a,G as e,w as o}from"./chunks/framework.Dn9yU8Jh.js";const g=JSON.parse('{"title":"RedGPU Context","description":"Learn about RedGPUContext, the starting point and resource manager of the RedGPU engine.","frontmatter":{"title":"RedGPU Context","description":"Learn about RedGPUContext, the starting point and resource manager of the RedGPU engine.","order":2},"headers":[],"relativePath":"en/context/index.md","filePath":"en/context/index.md","lastUpdated":1769513216000}'),p={name:"en/context/index.md"},E=Object.assign(p,{setup(d){const t=`
    graph LR
        Init["Call RedGPU.init()"] -->|Async| Callback["onSuccess Callback"]
        Callback -->|Obtain Instance| Setup["Scene and View Setup"]
        Setup -->|Start Loop| Render["Renderer.start()"]
`;return(k,s)=>{const n=i("MermaidResponsive"),l=i("ClientOnly");return h(),r("div",null,[s[0]||(s[0]=a("",7)),e(l,null,{default:o(()=>[e(n,{definition:t})]),_:1}),s[1]||(s[1]=a("",19))])}}});export{g as __pageData,E as default};
