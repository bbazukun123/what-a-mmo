import type { EntityType } from '@play-co/odie';
import { createEntity, DefineEntity, Entity3D, PhongMaterial, SphereGeometry } from '@play-co/odie';
import { User } from '../../../module_bindings';
import { HudComponent } from '../components/HudComponent';
import { PlayerComponent } from '../components/PlayerComponent';
import { ShadowTag } from '../defs/tags';
import { worldSizeRatio } from '../defs/world';

interface PlayerEntityOptions {
    user: User;
    self?: boolean;
}

export const PlayerEntity = DefineEntity(Entity3D, PlayerComponent, ShadowTag, HudComponent);

export type PlayerEntityType = EntityType<typeof PlayerEntity>;

const playerSize = 100;

export function createPlayerEntity(opts: PlayerEntityOptions): PlayerEntityType {
    const id = opts.user.identity.toHexString();
    const radius = playerSize * 0.5 * worldSizeRatio;
    const color = getRandomColor(id);

    const entity = createEntity(PlayerEntity, {
        view3d: {
            geometry: new SphereGeometry(radius),
            material: new PhongMaterial({
                color,
                receiveShadows: false,
            }),
        },
        player: opts,
        transform: {
            position: {
                x: 0,
                y: radius,
                z: 0,
            },
        },
        hud: {
            type: 'player',
        },
    });

    entity.name = id;

    return entity;
}

function getRandomColor(seed: string) {
    const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (hash * 9301 + 49297) % 233280;
    const color = (random / 233280) * 0xffffff;
    return color;
}
