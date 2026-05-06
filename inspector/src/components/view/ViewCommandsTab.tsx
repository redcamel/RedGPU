import React from 'react';
import View3D from "@redgpu/src/display/view/View3D";
import CommandBatchStatsView from "../state/CommandBatchStatsView";

/**
 * [KO] 뷰의 GPU 커맨드 배치 통계를 표시하는 탭 컴포넌트입니다.
 */
const ViewCommandsTab = ({view}: { view: View3D }) => {
    return <CommandBatchStatsView statsProp={view.renderViewStateData.commandBatchStats}/>;
};

export default ViewCommandsTab;
