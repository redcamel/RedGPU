import React, {useEffect, useMemo, useState} from "react";
import {ExampleHelperState, useExampleHelperStore} from '../../store';
import {getFlatExampleList} from "../../utils/exampleFinder";
import {ExampleItem} from "../../types/example";
import {ChevronLeft, ChevronRight} from '../../common/components/Icons';

const Title = () => {
    const currentExample = useExampleHelperStore((state: ExampleHelperState) => state.currentExample);
    const isNarrow = useExampleHelperStore((state: ExampleHelperState) => state.isNarrow);

    const [flatList, setFlatList] = useState<ExampleItem[]>([]);

    useEffect(() => {
        const loadList = async () => {
            const list = await getFlatExampleList();
            setFlatList(list);
        };
        loadList();
    }, []);

    const currentIndex = useMemo(() => {
        if (!currentExample || flatList.length === 0) return -1;
        return flatList.findIndex(item => item.path === currentExample.path);
    }, [currentExample, flatList]);

    const prevExample = currentIndex > 0 ? flatList[currentIndex - 1] : null;
    const nextExample = currentIndex < flatList.length - 1 ? flatList[currentIndex + 1] : null;

    const [isPrevHovered, setIsPrevHovered] = React.useState(false);
    const [isNextHovered, setIsNextHovered] = React.useState(false);

    const navigate = (path: string) => {
        const pathname = window.location.pathname;
        const examplesIndex = pathname.indexOf('/examples/');
        if (examplesIndex === -1) {
            window.location.href = `${window.location.origin}/examples/${path}/index.html`;
        } else {
            const base = pathname.substring(0, examplesIndex);
            window.location.href = `${window.location.origin}${base}/examples/${path}/index.html`;
        }
    };

    return (
        <div style={isNarrow ? narrowTitleBoxStyle : titleBoxStyle}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                gap: '2px',
                justifyContent: isNarrow ? 'space-between' : 'flex-start'
            }}>
                {prevExample && (
                    <button
                        style={{
                            ...buttonStyle,
                            backgroundColor: isPrevHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent'
                        }}
                        onClick={() => navigate(prevExample.path!)}
                        title={`Previous Example : ${prevExample.name}`}
                        onMouseEnter={() => setIsPrevHovered(true)}
                        onMouseLeave={() => setIsPrevHovered(false)}
                    >
                        <ChevronLeft color="#fdb48d"/>
                    </button>
                )}

                <div style={{...contentBoxStyle, textAlign: isNarrow ? 'center' : 'left'}}>
                    <span style={titleValueStyle}>
                        {currentExample ? currentExample.name : 'Example'}
                    </span>
                    {currentExample?.experimental && (
                        <span style={experimentalBadgeStyle}>EXPERIMENTAL</span>
                    )}
                </div>

                {nextExample && (
                    <button
                        style={{
                            ...buttonStyle,
                            backgroundColor: isNextHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent'
                        }}
                        onClick={() => navigate(nextExample.path!)}
                        title={`Next Example : ${nextExample.name}`}
                        onMouseEnter={() => setIsNextHovered(true)}
                        onMouseLeave={() => setIsNextHovered(false)}
                    >
                        <ChevronRight color="#fdb48d"/>
                    </button>
                )}
            </div>
        </div>
    );
};

const narrowTitleBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
    width: '100%',
    flexShrink: 0
};

const titleBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: '36px',
    flexShrink: 0,
    alignItems: 'stretch'
};

const contentBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '0 8px',
    flexGrow: 1,
    textAlign: 'center'
};

const titleLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    lineHeight: '1',
    color: '#8e8e93',
    fontWeight: 500
};

const experimentalBadgeStyle: React.CSSProperties = {
    fontSize: '10.5px',
    backgroundColor: 'rgba(255, 90, 95, 0.16)',
    color: '#ff6b70',
    border: '1px solid rgba(255, 90, 95, 0.35)',
    padding: '2px 7px',
    borderRadius: '5px',
    fontWeight: 600,
    lineHeight: '1.1',
    display: 'inline-block'
};

const titleValueStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.2',
    color: '#b19898',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

const buttonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: '#fdb48d',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s, color 0.15s',
    padding: 0,
    flexShrink: 0
};

export default Title;
