import type { EntityType } from '@play-co/odie';
import { createEntity, DefineEntity, Entity3D, PhongMaterial, SphereGeometry } from '@play-co/odie';
import { User } from '../../../module_bindings';
import { PlayerComponent } from '../components/PlayerComponent';
import { ShadowTag } from '../defs/tags';
import { worldSizeRatio } from '../defs/world';

interface PlayerEntityOptions {
    user: User;
    self?: boolean;
}

export const PlayerEntity = DefineEntity(Entity3D, PlayerComponent, ShadowTag);

export type PlayerEntityType = EntityType<typeof PlayerEntity>;

const playerSize = 100;

export function createPlayerEntity(opts: PlayerEntityOptions): PlayerEntityType {
    const radius = playerSize * 0.5 * worldSizeRatio;
    const entity = createEntity(PlayerEntity, {
        view3d: {
            geometry: new SphereGeometry(radius),
            material: new PhongMaterial({
                color: 0xff0000,
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
    });

    entity.name = opts.user.identity.toHexString();

    return entity;
}
