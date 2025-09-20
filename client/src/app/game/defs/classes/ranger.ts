import { Vector3 } from '@play-co/commons';
import { createEntity, Entity3D, lerp, PhongMaterial, SphereGeometry } from '@play-co/odie';
import { PlayerViewComponent } from '../../components/player/PlayerViewComponent';
import { PlayerEntityType } from '../../entities/PlayerEntity';
import { worldSizeRatio } from '../world';

export function createRangerView({ color, size }: { color: number; size: number }) {
    const radius = size * 0.5;

    const view = createEntity(Entity3D, {
        view3d: {
            geometry: new SphereGeometry(radius),
            material: new PhongMaterial({
                color,
                receiveShadows: false,
            }),
        },
        transform: {
            position: {
                x: 0,
                y: radius,
                z: 0,
            },
        },
    } as unknown as any);

    view.c.view3d!.state.blend = true;

    return view;
}

export function stepRangerAnimation(player: PlayerEntityType, dt: number) {
    const { playerView } = player.c;

    switch (playerView.state) {
        case 'idle':
            playerView.tick = 0;
            stepIdleAnimation(playerView, dt);
            break;
        case 'walking':
            stepWalkingAnimation(playerView, dt);
            break;
    }
}

function stepIdleAnimation(component: PlayerViewComponent, _: number) {
    const { view, basePosition } = component;

    view.x = lerp(view.x, basePosition.x, 0.1);
    view.y = lerp(view.y, basePosition.y, 0.1);
    view.z = lerp(view.z, basePosition.z, 0.1);

    view.sx = lerp(view.sx, 1, 0.1);
    view.sy = lerp(view.sy, 1, 0.1);
    view.sz = lerp(view.sz, 1, 0.1);
}

const offsetVec3 = new Vector3();
const scaleVec3 = new Vector3();

function stepWalkingAnimation(component: PlayerViewComponent, dt: number) {
    const { view, basePosition } = component;
    const sDt = dt * 0.001;

    component.tick += sDt;

    const ay = Math.cos(component.tick * 10);
    const az = Math.sin(component.tick * 10);

    scaleVec3.x = 1 + az * 0.1;
    scaleVec3.y = 1 + ay * 0.1;

    offsetVec3.y = basePosition.y + ay * 20 * worldSizeRatio;
    offsetVec3.z = basePosition.z + az * 10 * worldSizeRatio;

    view.y = lerp(view.y, offsetVec3.y, 0.1);
    view.z = lerp(view.z, offsetVec3.z, 0.1);

    view.sx = lerp(view.sx, scaleVec3.x, 0.1);
    view.sy = lerp(view.sy, scaleVec3.y, 0.1);
}
