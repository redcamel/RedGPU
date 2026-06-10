/**
 * [KO] 이벤트 정보 박스의 스타일을 업데이트합니다.
 * [EN] Updates the style of the event information box.
 */
export const updateEventInfoBoxStyle = (infoBox, isMobile) => {
    Object.assign(infoBox.style, {
        position: 'absolute',
        bottom: isMobile ? '100px' : '70px',
        left: '12px',
        width: isMobile ? 'calc(100% - 64px)' : 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '12px',
        fontSize: isMobile ? '12px' : '11px',
        lineHeight: '1.6',
        pointerEvents: 'none',
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        display: infoBox.style.display || 'none',
        userSelect: 'none',
        zIndex: '100',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
    });
};

/**
 * [KO] 이벤트 정보 표시를 위한 HTML 요소를 생성합니다.
 * [EN] Creates an HTML element for event information display.
 */
export const createEventInfoBox = (isMobile) => {
    const infoBox = document.createElement('div');
    updateEventInfoBoxStyle(infoBox, isMobile);
    document.body.appendChild(infoBox);
    return infoBox;
};

/**
 * [KO] 발생한 이벤트의 상세 정보를 UI에 업데이트합니다.
 * [EN] Update the UI with detailed information of the occurred event.
 */
export const updateEventInfo = (infoBox, eventName, e) => {
    infoBox.style.display = 'block';
    infoBox.innerHTML = `[Event Info]
Object: ${e.target.name || 'Object'}
Event: ${eventName}
Distance: ${e.distance ? e.distance.toFixed(4) : 'N/A'}
World Point: [${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}]
Local Point: [${e.localPoint[0].toFixed(2)}, ${e.localPoint[1].toFixed(2)}, ${e.localPoint[2].toFixed(2)}]
Mouse Position: [${e.mouseX.toFixed(2)}, ${e.mouseY.toFixed(2)}]
Face Index: ${e.faceIndex}
UV: [${e.uv ? e.uv[0].toFixed(3) : 'N/A'}, ${e.uv ? e.uv[1].toFixed(3) : 'N/A'}]`;
};
