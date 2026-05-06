import React, {useState} from 'react';
import StatItem from "./StatItem";
import StatBoolItem from "./StatBoolItem";
import {formatNumber} from "../../utils/format";
import {THEME} from "./Theme";

/**
 * [KO] 객체의 공개 프로퍼티를 재귀적으로 표시하는 컴포넌트입니다.
 * [EN] Component that recursively displays public properties of an object.
 */
const PropertyInspector = ({target, depth = 0}: { target: any, depth?: number }) => {
    if (depth > 3 || !target) return null;

    // 1. 프로토타입 체인을 포함하여 검사 가능한 모든 키 수집
    const allKeys = new Set<string>();

    // 객체 자체의 프로퍼티 (필드 등)
    Object.getOwnPropertyNames(target).forEach(k => allKeys.add(k));

    // 프로토타입 체인의 프로퍼티 (Getter 등)
    let proto = Object.getPrototypeOf(target);
    while (proto && proto !== Object.prototype) {
        Object.getOwnPropertyNames(proto).forEach(k => {
            const descriptor = Object.getOwnPropertyDescriptor(proto, k);
            // Getter이거나 데이터 프로퍼티이면서 함수가 아닌 경우 포함
            if (descriptor && (descriptor.get || typeof descriptor.value !== 'function')) {
                allKeys.add(k);
            }
        });
        proto = Object.getPrototypeOf(proto);
    }

    // 2. 필터링 및 정렬
    const filteredKeys = Array.from(allKeys).filter(key => {
        // 시스템 내부 변수 및 상속된 일반 메서드 제외
        if (key.startsWith('#') || key.startsWith('_')) return false;

        // 제외할 블랙리스트 (시스템성 프로퍼티)
        const blackList = [
            'constructor', 'prototype', 'length', 'name', 'view', 'redGPUContext',
            'passList', 'passListLength', 'passIndex', 'videoMemorySize', 'outputTextureView', 'shaderInfo', 'storageInfo', 'uniformsInfo', 'systemUniformsInfo', 'uniformBuffer'
        ];
        if (blackList.includes(key)) return false;

        // 현재 값의 타입을 확인하여 함수인 경우(메서드) 제외
        try {
            if (typeof target[key] === 'function') return false;
        } catch (e) {
            return false;
        }

        return true;
    }).sort();

    if (filteredKeys.length === 0) {
        return <div style={{fontSize: '10px', color: '#666', paddingLeft: '8px'}}>No inspectable properties.</div>;
    }

    return (
        <div style={{paddingLeft: depth > 0 ? '12px' : '0'}}>
            {filteredKeys.map(key => {
                let value;
                try {
                    value = target[key];
                } catch (e) {
                    return null;
                }

                const type = typeof value;

                if (value === null || value === undefined) {
                    return <StatItem key={key} label={key} value="null"/>;
                }

                if (type === 'number') {
                    return <StatItem key={key} label={key} value={formatNumber(value)}/>;
                }

                if (type === 'boolean') {
                    return <StatBoolItem key={key} label={key} value={value}/>;
                }

                if (type === 'string') {
                    return <StatItem key={key} label={key} value={value}/>;
                }

                if (Array.isArray(value)) {
                    if (value.length > 0 && typeof value[0] !== 'object') {
                        return <StatItem key={key} label={key} value={`[${value.map(v => typeof v === 'number' ? formatNumber(v) : v).join(', ')}]`}/>;
                    }
                    return <CollapsibleObject key={key} label={key} value={value} depth={depth} typeLabel="Array"/>;
                }

                if (type === 'object') {
                    return <CollapsibleObject key={key} label={key} value={value} depth={depth} typeLabel="Object"/>;
                }

                return null;
            })}
        </div>
    );
};

/**
 * [KO] 하위 객체나 배열을 접고 펼칠 수 있는 컴포넌트입니다.
 */
const CollapsibleObject = ({label, value, depth, typeLabel}: { label: string, value: any, depth: number, typeLabel: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div style={{marginBottom: '4px'}}>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={headerStyle}
            >
                <span style={toggleButtonStyle}>{isExpanded ? '-' : '+'}</span>
                <span style={labelStyle}>{label}</span>
                <span style={typeHintStyle}>({typeLabel === 'Array' ? `Array(${value.length})` : 'object'})</span>
            </div>
            {isExpanded && (
                <div style={contentWrapperStyle}>
                    <PropertyInspector target={value} depth={depth + 1}/>
                </div>
            )}
        </div>
    );
};

// Styles
const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontSize: '11px',
    padding: '2px 0',
    userSelect: 'none'
};

const toggleButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '14px',
    height: '14px',
    border: `1px solid ${THEME.colors.primary}`,
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: THEME.colors.primary,
    lineHeight: '14px',
    background: 'rgba(0,0,0,0.3)',
    flexShrink: 0
};

const labelStyle: React.CSSProperties = {
    color: '#888'
};

const typeHintStyle: React.CSSProperties = {
    color: '#555',
    fontSize: '10px',
    fontStyle: 'italic'
};

const contentWrapperStyle: React.CSSProperties = {
    borderLeft: '1px solid rgba(255,255,255,0.1)',
    marginLeft: '5px',
    marginTop: '2px'
};

export default PropertyInspector;
