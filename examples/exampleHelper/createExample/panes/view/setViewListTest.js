import {setSingleViewTest} from "../index.js?t=1770637396475";

const setViewListTest = (pane, viewList, shouldExpand = false, camera2DYn = false) => {
    const title = viewList.length === 1 ? viewList[0].name : 'ViewList';
    const folder = pane.addFolder({
        title: title,
        expanded: shouldExpand
    });

    if (viewList.length === 1) {
        setSingleViewTest(folder, viewList[0], true, camera2DYn)
    } else {
        console.log('viewList', viewList)
        const tab = folder.addTab({
            pages: viewList.map(view => {
                return ({title: view.name.replace(/Instance/g, '')})
            })
        });

        assignViewsToTestTabs(viewList, tab, camera2DYn);
    }
}
export default setViewListTest;

function assignViewsToTestTabs(viewList, tab, camera2DYn = false) {
    viewList.forEach((view, index) => {
        setSingleViewTest(tab.pages[index], view, true, camera2DYn)
    });
}
