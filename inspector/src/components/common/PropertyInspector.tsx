import React, {useState, memo, useMemo} from 'react';
import StatItem from "./StatItem";
import StatBoolItem from "./StatBoolItem";
import {formatNumber} from "../../utils/format";
import {COMMON_STYLES, THEME} from "./Theme";

/**
 * [KO] 객체의 공개 프로퍼티를 재귀적으로 표시하는 컴포넌트입니다.
 */
const PropertyInspector = memo(({target, depth = 0}: { target: any, depth?: number }) => {
    if (depth > 3 || !target) return null;

    // 1. 프로토타입 체인을 포함하여 검사 가능한 모든 키 수집 및 필터링 (useMemo로 최적화)
    const filteredKeys = useMemo(() => {
        const allKeys = new Set<string>();

        // 객체 자체의 프로퍼티
        Object.getOwnPropertyNames(target).forEach(k => allKeys.add(k));

        // 프로토타입 체인의 프로퍼티 (Getter 등)
        let proto = Object.getPrototypeOf(target);
        while (proto && proto !== Object.prototype) {
            Object.getOwnPropertyNames(proto).forEach(k => {
                const descriptor = Object.getOwnPropertyDescriptor(proto, k);
                if (descriptor && (descriptor.get || typeof descriptor.value !== 'function')) {
                    allKeys.add(k);
                }
            });
            proto = Object.getPrototypeOf(proto);
        }

        const blackList = [
            'constructor', 'prototype', 'length', 'name', 'view', 'redGPUContext',
            'passList', 'passListLength', 'passIndex', 'videoMemorySize', 'outputTextureView', 'shaderInfo', 'storageInfo', 'uniformsInfo', 'systemUniformsInfo', 'uniformBuffer'
        ];

        return Array.from(allKeys).filter(key => {
            if (key.startsWith('#') || key.startsWith('_')) return false;
            if (blackList.includes(key)) return false;
            try {
                if (typeof target[key] === 'function') return false;
            } catch (e) {
                return false;
            }
            return true;
        }).sort();
    }, [target]);

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
});

/**
 * [KO] 하위 객체나 배열을 접고 펼칠 수 있는 컴포넌트입니다.
 * [EN] Component that can expand and collapse sub-objects or arrays.
 */
const CollapsibleObject = ({label, value, depth, typeLabel}: {
    label: string,
    value: any,
    depth: number,
    typeLabel: string
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div style={{marginBottom: '4px'}}>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={headerStyle}
            >
                <span style={COMMON_STYLES.toggleButton}>{isExpanded ? '-' : '+'}</span>
                <span style={COMMON_STYLES.label}>{label}</span>
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
