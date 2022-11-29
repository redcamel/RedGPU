const debuggerRenderViewList = (viewList) => {
    const debugView = document.getElementById('___debugView___')
    let debugStr = ''
    viewList.forEach(view => {
        //TODO - 정리
        let debugStr2 = ''
        {
            // view debug

            const {viewDebugger, scene} = view

            for (const k in viewDebugger) {
                const tData = viewDebugger[k]
                if (typeof tData === 'string') {
                    debugStr2 += `<div><b>${k} : ${tData}</b></div>`
                } else {
                    debugStr2 += `<div><b>${k}</b></div>`
                    for (const key in tData) {
                        const value = tData[key]
                        const fontSize = (key === 'AVG FPS' || key === 'Frame FPS' || key === 'Render PointLight') ? '14px' : ''
                        const color = (key === 'AVG FPS' || key === 'Frame FPS' || key === 'Render PointLight') ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)'
                        debugStr2 += `<div style="font-size:${fontSize};color:${color}">${key} : ${typeof value === 'number' ? (+value.toFixed(2)).toLocaleString() : value}</div>`
                    }
                    debugStr2 += `<div style="margin:6px 0px;height:1px;background: rgba(255,255,255,0.2)"></div>`
                }
            }
//             const renderChild = target => {
//                 const {children} = target
//                 return children.map(v => {
//                     // console.log(v)
//                     return `
// <div>
// 	${v.constructor.name}
// 	<div style="padding-left: 10px">
// 		<div>${v.geometry ? v.geometry.constructor.name : ''}</div>
// 		<div>${v.material?.constructor.name}</div>
// 		${v.children.length ? `<div style="padding-left: 10px">${renderChild(v.children)}</div>` : ''}
// 	</div>
// </div>`
//                 }).flat().join('').trim()
//             }
//             // console.log(renderChild(scene))
//             //TODO
//             debugStr2 += `${renderChild(scene)}`

        }
        debugStr += `<div style="background: rgba(0,0,0,0.5);padding: 16px;">${debugStr2}</div>`
    })
    debugView.innerHTML = `${debugStr}`
}
export default debuggerRenderViewList
