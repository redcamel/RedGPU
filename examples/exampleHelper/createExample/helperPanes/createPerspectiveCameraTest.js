/**
 * [KO] PerspectiveCamera를 위한 테스트 패널을 생성합니다.
 * [EN] Creates a test pane for PerspectiveCamera.
 *
 * @param {object} pane - Tweakpane 인스턴스 또는 폴더 [Tweakpane instance or folder]
 * @param {View3D} view - 대상 뷰 인스턴스 [Target view instance]
 * @param {boolean} openYn - 폴더 확장 여부 (기본값: true) [Whether to expand the folder (default: true)]
 */
const createPerspectiveCameraTest = (pane, view, openYn = true) => {
    const camera = view.rawCamera;
    const autoExposure = view.postEffectManager.autoExposure;

    const folder = pane.addFolder({
        title: 'PerspectiveCamera',
        expanded: openYn
    });

    // 1. 투영 설정 (Projection)
    folder.addBinding(camera, 'fieldOfView', { label: 'FOV (deg)', min: 1, max: 179, step: 0.1 });

    // 2. 물리적 노출 설정 (Physical Exposure)
    const exposureFolder = folder.addFolder({ title: 'Exposure', expanded: true });
    const autoExposureBinding = exposureFolder.addBinding(camera, 'useAutoExposure', { label: 'Auto Exposure' });

    let manualFolder = null;
    let autoExposureFolder = null;

    const refreshExposureSettings = (isAuto) => {
        // 기존 폴더가 있다면 삭제
        if (manualFolder) {
            manualFolder.dispose();
            manualFolder = null;
        }
        if (autoExposureFolder) {
            autoExposureFolder.dispose();
            autoExposureFolder = null;
        }

        // 1. Manual 모드 (자동 노출 OFF)
        if (!isAuto) {
            manualFolder = exposureFolder.addFolder({ title: 'Manual Settings', expanded: true });
            manualFolder.addBinding(camera, 'aperture', { label: 'Aperture (f-stop)', min: 1.0, max: 32.0, step: 0.1 });
            manualFolder.addBinding(camera, 'shutterSpeed', {
                label: 'Shutter Speed (s)',
                min: 0.000125, // 1/8000
                max: 1.0,
                step: 0.0001,
                format: (v) => v >= 1 ? v.toFixed(1) : `1/${Math.round(1/v)}`
            });
            manualFolder.addBinding(camera, 'iso', { label: 'ISO', min: 50, max: 3200, step: 1 });
        } 
        // 2. Auto 모드 (자동 노출 ON)
        else if (autoExposure) {
            autoExposureFolder = exposureFolder.addFolder({ title: 'Auto-Exposure Settings', expanded: true });
            autoExposureFolder.addBinding(autoExposure, 'meteringMode', {
                label: 'Metering Mode',
                options: {
                    'Average': 0,
                    'Center-weighted': 1,
                    'Spot': 2
                }
            });
            autoExposureFolder.addBinding(autoExposure, 'exposureCompensation', { min: -10, max: 10, step: 0.1, label: 'Exp Compensation' });
            autoExposureFolder.addBinding(autoExposure, 'targetLuminance', { min: 0.01, max: 1.0, step: 0.01, label: 'Target Luminance' });
            autoExposureFolder.addBinding(autoExposure, 'minEV100', { label: 'Min EV100', min: -10, max: 20, step: 0.1 });
            autoExposureFolder.addBinding(autoExposure, 'maxEV100', { label: 'Max EV100', min: -10, max: 20, step: 0.1 });
            autoExposureFolder.addBinding(autoExposure, 'adaptationSpeedUp', { label: 'Adapt Speed Up', min: 0.1, max: 10.0, step: 0.1 });
            autoExposureFolder.addBinding(autoExposure, 'adaptationSpeedDown', { label: 'Adapt Speed Down', min: 0.1, max: 10.0, step: 0.1 });
        }
    };

    autoExposureBinding.on('change', (evt) => refreshExposureSettings(evt.value));
    refreshExposureSettings(camera.useAutoExposure);

    // 결과 EV100 표시 (Read-only)
    exposureFolder.addBinding(camera, 'ev100', { label: 'EV100', readonly: true, view: 'text', format: (v) => v.toFixed(2) });
};

export default createPerspectiveCameraTest;
