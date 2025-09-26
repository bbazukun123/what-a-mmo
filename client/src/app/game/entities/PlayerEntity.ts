import type { EntityType } from '@play-co/odie';
import { BoxGeometry, createEntity, DefineEntity, Entity3D, PhongMaterial } from '@play-co/odie';
import { User } from '../../../module_bindings';
import { HudComponent } from '../components/hud/HudComponent';
import { EyesComponent } from '../components/player/EyesComponent';
import { PlayerComponent } from '../components/player/PlayerComponent';
import { PlayerViewComponent } from '../components/player/PlayerViewComponent';
import { ShadowTag } from '../defs/tags';

type PlayerEntityOptions = {
    data: User;
    self?: boolean;
};

export const PlayerEntity = DefineEntity(
    Entity3D,
    PlayerComponent,
    PlayerViewComponent,
    EyesComponent,
    ShadowTag,
    HudComponent,
);

export type PlayerEntityType = EntityType<typeof PlayerEntity>;

export function createPlayerEntity(opts: PlayerEntityOptions): PlayerEntityType {
    const id = opts.data.identity.toHexString();
    const entity = createEntity(PlayerEntity, {
        view3d: {
            geometry: new BoxGeometry(1, 1, 1),
            material: new PhongMaterial({
                color: 0xff0000,
                receiveShadows: false,
            }),
        },
        player: opts,
        hud: {
            type: 'player',
        },
    });

    entity.c.view3d!.state.cullMode = 'none';
    entity.name = id;

    return entity;
}
