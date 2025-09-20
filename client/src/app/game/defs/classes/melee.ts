import { BoxGeometry, createEntity, Entity3D, lerp, PhongMaterial } from '@play-co/odie';
import { PlayerViewComponent } from '../../components/player/PlayerViewComponent';
import { PlayerEntityType } from '../../entities/PlayerEntity';

export function createMeleeView({ color, size }: { color: number; size: number }) {
    const view = createEntity(Entity3D, {
        view3d: {
            geometry: new BoxGeometry(size, size, size),
            material: new PhongMaterial({
                color,
                receiveShadows: false,
            }),
        },
        transform: {
            position: {
                x: 0,
                y: size * 0.5,
                z: 0,
            },
        },
    } as unknown as any);

    view.c.view3d!.state.blend = true;

    return view;
}

export function stepMeleeAnimation(player: PlayerEntityType, dt: number) {
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
    const { view } = component;
    const closestRoundedupQuarterRotation = Math.ceil(view.rx / (Math.PI / 2)) * (Math.PI / 2);
    view.rx = lerp(view.rx, closestRoundedupQuarterRotation, 0.1);
}

function stepWalkingAnimation(component: PlayerViewComponent, dt: number) {
    const { view } = component;
    const sDt = dt * 0.001;
    component.tick += sDt;
    view.rx = component.tick * 4;
}
