#redgpu_include math.hash.getHash1D

// 파티클 구조체 선언
struct Info {
    startValue: f32,
    endValue: f32,
    easeType: f32,
    birthCenterValue: f32
};

struct InfoGroup {
    infoX: Info,
    infoY: Info,
    infoZ: Info,
};

struct Particle {
    startTime: f32,
    life: f32,
    valuePosition: vec3<f32>,
    valueAlpha: f32,
    valueRotation: vec3<f32>,
    valueScale: f32,
};
struct SimParams {
     time:f32,
     currentPositionX:f32,currentPositionY:f32,currentPositionZ:f32,
     minLife:f32, maxLife:f32,
     minStartX:f32, maxStartX:f32, minEndX:f32, maxEndX:f32, easeX:f32,
     minStartY:f32, maxStartY:f32, minEndY:f32, maxEndY:f32, easeY:f32,
     minStartZ:f32, maxStartZ:f32, minEndZ:f32, maxEndZ:f32, easeZ:f32,
     minStartAlpha:f32, maxStartAlpha:f32, minEndAlpha:f32, maxEndAlpha:f32, easeAlpha:f32,
     minStartScale:f32, maxStartScale:f32, minEndScale:f32, maxEndScale:f32, easeScale:f32,
     minStartRotationX:f32, maxStartRotationX:f32, minEndRotationX:f32, maxEndRotationX:f32, easeRotationX:f32,
     minStartRotationY:f32, maxStartRotationY:f32, minEndRotationY:f32, maxEndRotationY:f32, easeRotationY:f32,
     minStartRotationZ:f32, maxStartRotationZ:f32, minEndRotationZ:f32, maxEndRotationZ:f32, easeRotationZ:f32,
};


@group(0) @binding(0) var<uniform> params: SimParams;
@group(0) @binding(1) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(2) var<storage, read_write> infoPosition: array<InfoGroup>;
@group(0) @binding(3) var<storage, read_write> infoRotation: array<InfoGroup>;
@group(0) @binding(4) var<storage, read_write> infoScale: array<Info>;
@group(0) @binding(5) var<storage, read_write> infoAlpha: array<Info>;

#redgpu_include math.PI
#redgpu_include math.HPI
#redgpu_include math.PI2
#redgpu_include math.DEG_TO_RAD

fn calEasing(n: f32, easingType: f32) -> f32 {
    var m: f32 = n;
    let easingInt: i32 = i32(easingType);

    switch (easingInt) {
        case 0: { m = m; }
        case 1: { m = m * m * m * m * m; }
        case 2: {
            m -= 1.0;
            m = (m * m * m * m * m) + 1.0;
        }
        case 3: {
            if(m * 2.0 < 1.0) {
                m *= 2.0;
                m = m * m * m * m * m * 0.5;
            }
            else {
                m = m * 2.0 - 2.0;
                m = 0.5 * (m * m * m * m * m + 2.0);
            }
        }
        case 4: { m = m * m * (m * 1.70158 + m - 1.70158); }
        case 5: {
            m -= 1.0;
            m = m * m * (m * 1.70158 + m + 1.70158) + 1.0;
        }
        case 6: {
            if(m * 2.0 < 1.0) {
                m *= 2.0;
                m = 0.5 * m * m * (m * 1.70158 + m - 1.70158);
            }
            else {
                m = m * 2.0 - 2.0;
                m = 0.5 * m * m * (m * 1.70158 + m + 1.70158) + 1.0;
            }
        }
        case 7: { m = -1.0 * (sqrt(1.0 - m * m) - 1.0); }
        case 8: {
            m -= 1.0;
            m = sqrt(1.0 - m * m);
        }
        case 9: {
            if(m * 2.0 < 1.0) {
                m *= 2.0;
                m = -0.5 * (sqrt(1.0 - m * m) - 1.0);
            }
            else {
                m = m * 2.0 - 2.0;
                m = 0.5 * sqrt(1.0 - m * m) + 0.5;
            }
        }
        case 10: { m = m * m * m; }
        case 11: {
            m -= 1.0;
            m = m * m * m + 1.0;
        }
        case 12: {
            if(m * 2.0 < 1.0) {
                m *= 2.0;
                m = m * m * m * 0.5;
            }
            else {
                m = m * 2.0 - 2.0;
                m = 0.5 * (m * m * m + 2.0);
            }
        }
        case 13: {
            if (m == 0.0) { m = 0.0; }
            else { m = pow(2.0, 10.0 * (m - 1.0)); }
        }
        case 14: {
            if (m == 1.0) { m = 1.0; }
            else { m = -pow(2.0, -10.0 * m) + 1.0; }
        }
        case 15: {
            if(m * 2.0 < 1.0) {
                if (m == 0.0) { m = 0.0; }
                else { m *= 2.0; m = 0.5 * pow(2.0, 10.0 * (m - 1.0)); }
            }
            else {
                if (m == 2.0) { m = 1.0; }
                else { m = m * 2.0 - 1.0; m = -0.5 * pow(2.0, -10.0 * m) + 1.0; }
            }
        }
        case 16: { m = m * m; }
        case 17: { m = (2.0 - m) * m; }
        case 18: {
            if(m * 2.0 < 1.0) {
                m *= 2.0;
                m = m * m * 0.5;
            }
            else {
                m = 2.0 - m;
                m = 0.5 * (m * m + 1.0);
            }
        }
        case 19: { m = m * m * m * m; }
        case 20: {
            m -= 1.0;
            m = 1.0 - (m * m * m * m);
        }
        case 21: {
            if(m * 2.0 < 1.0) {
                m *= 2.0;
                m = m * m * m * m * 0.5;
            }
            else {
                m = m * 2.0 - 2.0;
                m = 1.0 - (m * m * m * m * 0.5);
            }
        }
        case 22: { m = -cos(m * HPI) + 1.0; }
        case 23: { m = sin(m * HPI); }
        case 24: { m = (-cos(m * PI) + 1.0) * 0.5; }
        case 25: {
            if (m == 0.0) { m = 0.0; }
            else if (m == 1.0) { m = 1.0; }
            else { m -= 1.0; m = -1.0 * pow(2.0, 10.0 * m) * sin((m - 0.075) * PI2 / 0.3); }
        }
        // ElasticIn
        case 26: {
            if (m == 0.0) {
                m = 0.0;
            } else if (m == 1.0) {
                m = 1.0;
            } else {
                m -= 1.0;
                m = -pow(2.0, 10.0 * m) * sin((m - 0.075) * PI2 / 0.3);
            }
        }
        // ElasticOut
        case 27: {
            if (m == 0.0) {
                m = 0.0;
            } else if (m == 1.0) {
                m = 1.0;
            } else {
                m = pow(2.0, -10.0 * m) * sin((m - 0.075) * PI2 / 0.3) + 1.0;
            }
        }
        default: { m = m; }
    }
    return m;
}
fn randomRange(min:f32, max:f32, v:f32)->f32
{
    var newValue:f32 = getHash1D(v);
    return (newValue * (max-min)) + min;
}
fn compute_value(tInfo: Info, lifeRatio: f32) -> f32 {
    return tInfo.startValue + ((tInfo.endValue - tInfo.startValue) * calEasing(lifeRatio, tInfo.easeType));
}
@compute @workgroup_size(256,1,1)
fn main(
    @builtin(global_invocation_id) global_id : vec3<u32>
 ) {
    let index: u32 = (global_id.x);
    let age: f32 = (params.time - particles[index].startTime);
    var lifeRatio: f32 = (age / particles[index].life);
    if (lifeRatio >= 1.0 ) {
        let uuid: f32 = (params.time + f32(index));
        particles[index].startTime = params.time;
        particles[index].life = randomRange( params.minLife, params.maxLife, uuid );

        // position
        infoPosition[index].infoX.startValue = randomRange( params.minStartX + params.currentPositionX, params.maxStartX + params.currentPositionX, (uuid + 1.0) );
        infoPosition[index].infoX.endValue   = randomRange( params.minEndX + params.currentPositionX, params.maxEndX + params.currentPositionX, (uuid + 2.0) );
        infoPosition[index].infoX.easeType   = params.easeX;
        infoPosition[index].infoX.birthCenterValue = params.currentPositionX;
        //
        infoPosition[index].infoY.startValue = randomRange( params.minStartY +params.currentPositionY, params.maxStartY+params.currentPositionY, (uuid + 3.0) );
        infoPosition[index].infoY.endValue   = randomRange( params.minEndY+params.currentPositionY, params.maxEndY+params.currentPositionY, (uuid + 4.0) );
        infoPosition[index].infoY.easeType   = params.easeY;
        infoPosition[index].infoY.birthCenterValue = params.currentPositionY;
        //
        infoPosition[index].infoZ.startValue = randomRange( params.minStartZ+params.currentPositionZ, params.maxStartZ+params.currentPositionZ, (uuid + 5.0) );
        infoPosition[index].infoZ.endValue   = randomRange( params.minEndZ+params.currentPositionZ, params.maxEndZ+params.currentPositionZ, (uuid + 6.0) );
        infoPosition[index].infoZ.easeType   = params.easeZ;
        infoPosition[index].infoZ.birthCenterValue = params.currentPositionZ;
        // alpha
        infoAlpha[index].startValue = randomRange( params.minStartAlpha, params.maxStartAlpha, (uuid + 7.0) );
        infoAlpha[index].endValue   = randomRange( params.minEndAlpha, params.maxEndAlpha, (uuid + 8.0) );
        infoAlpha[index].easeType   = params.easeAlpha;
        // scale
        infoScale[index].startValue = randomRange( params.minStartScale, params.maxStartScale, (uuid + 9.0) );
        infoScale[index].endValue   = randomRange( params.minEndScale, params.maxEndScale, (uuid + 10.0));
        infoScale[index].easeType   = params.easeScale;
        // rotation
        infoRotation[index].infoX.startValue = randomRange( params.minStartRotationX, params.maxStartRotationX, (uuid + 11.0));
        infoRotation[index].infoX.endValue   = randomRange( params.minEndRotationX, params.maxEndRotationX, (uuid + 12.0));
        infoRotation[index].infoX.easeType   = params.easeRotationX;
        //
        infoRotation[index].infoY.startValue = randomRange( params.minStartRotationY, params.maxStartRotationY, (uuid + 13.0));
        infoRotation[index].infoY.endValue   = randomRange( params.minEndRotationY, params.maxEndRotationY, (uuid + 14.0));
        infoRotation[index].infoY.easeType   = params.easeRotationY;
        //
        infoRotation[index].infoZ.startValue = randomRange( params.minStartRotationZ, params.maxStartRotationZ, (uuid + 15.0));
        infoRotation[index].infoZ.endValue   = randomRange( params.minEndRotationZ, params.maxEndRotationZ, (uuid + 16.0));
        infoRotation[index].infoZ.easeType   = params.easeRotationZ;

        lifeRatio = 0.0;
    }
    var targetInfo:Info;
    let targetParticle = particles[index];
    // position
    targetInfo = infoPosition[index].infoX;
    particles[index].valuePosition.x = compute_value(targetInfo, lifeRatio);
    targetInfo = infoPosition[index].infoY;
    particles[index].valuePosition.y =  compute_value(targetInfo, lifeRatio);
    targetInfo = infoPosition[index].infoZ;
    particles[index].valuePosition.z =  compute_value(targetInfo, lifeRatio);
    // alpha
    targetInfo = infoAlpha[index];
    particles[index].valueAlpha = compute_value(targetInfo, lifeRatio);
    // scale
    targetInfo = infoScale[index];
    particles[index].valueScale = compute_value(targetInfo, lifeRatio);
    // rotation
    targetInfo = infoRotation[index].infoX;
    particles[index].valueRotation.x =  compute_value(targetInfo, lifeRatio) * DEG_TO_RAD;
    targetInfo = infoRotation[index].infoY;
    particles[index].valueRotation.y =  compute_value(targetInfo, lifeRatio) * DEG_TO_RAD;
    targetInfo = infoRotation[index].infoZ;
    particles[index].valueRotation.z =  compute_value(targetInfo, lifeRatio) * DEG_TO_RAD;


}
