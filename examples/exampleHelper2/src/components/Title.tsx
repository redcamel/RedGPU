import React from "react";
import ExampleHeader from "./ExampleHeader";
import {ExampleHelperState, useExampleHelperStore} from "../store";

const Title = () => {
    const currentExample = useExampleHelperStore((state: ExampleHelperState) => state.currentExample);
    const isNarrow = useExampleHelperStore((state: ExampleHelperState) => state.isNarrow);

    return <>
        <div style={isNarrow ? narrowTitleBoxStyle : titleBoxStyle}>
            {!isNarrow && <span style={titleLabelStyle}>TITLE</span>}
            <span style={titleValueStyle}>
                          {currentExample ? currentExample.name : 'empty example name'}
                        </span>
        </div>
    </>
}

const narrowTitleBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111112',
    width: '100%',
    flexShrink: 0
};
const titleBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 16px',
    backgroundColor: '#111112',
    minWidth: '120px',
    flexShrink: 0
};

const titleLabelStyle: React.CSSProperties = {
    fontSize: '9px',
    color: '#666',
    fontWeight: 'bold',
    marginBottom: '2px'
};

const titleValueStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#ccc',
    fontWeight: 'bold'
};
export default Title