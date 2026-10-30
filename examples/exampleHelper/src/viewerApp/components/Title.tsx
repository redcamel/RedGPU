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
                            width: '28px',
                            height: isNarrow ? '32px' : '36px',
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
                    {(!isNarrow || currentExample?.experimental) && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: isNarrow ? 'center' : 'flex-start',
                            gap: '6px',
                            marginBottom: '2px'
                        }}>
                            {!isNarrow && <span style={{...titleLabelStyle, marginBottom: 0}}>Example</span>}
                            {currentExample?.experimental && (
                                <span style={experimentalBadgeStyle}>EXPERIMENTAL</span>
                            )}
                        </div>
                    )}
                    <span style={titleValueStyle}>
                        {currentExample ? currentExample.name : 'empty example name'}
                    </span>
                </div>

                {nextExample && (
                    <button
                        style={{
                            ...buttonStyle,
                            width: '28px',
                            height: isNarrow ? '32px' : '36px',
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
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 10px',
    flexGrow: 1,
    minWidth: '110px',
    textAlign: 'center'
};

const titleLabelStyle: React.CSSProperties = {
    fontSize: '8px',
    lineHeight: '1',
    color: '#888',
    fontWeight: 'bold',
    marginBottom: '2px',
    letterSpacing: '0.05em'
};

const experimentalBadgeStyle: React.CSSProperties = {
    fontSize: '8px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '3px 5px',
    borderRadius: '4px',
    fontWeight: 'bold',
    lineHeight: '1',
    display: 'inline-block'
};

const titleValueStyle: React.CSSProperties = {
    fontSize: '11.5px',
    lineHeight: '1.1',
    color: '#eee',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

const buttonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: '#fdb48d',
    border: 'none',
    width: '28px',
    height: '36px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
    padding: 0,
    flexShrink: 0
};

export default Title;
