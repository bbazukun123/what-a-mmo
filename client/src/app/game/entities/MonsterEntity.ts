import type { EntityType } from '@play-co/odie';
import { BoxGeometry, createEntity, DefineEntity, Entity3D, PhongMaterial } from '@play-co/odie';
import { Monster } from '../../../module_bindings';
import { HudComponent } from '../components/hud/HudComponent';
import { MonsterComponent } from '../components/monster/MonsterComponent';
import { MonsterViewComponent } from '../components/monster/MonsterViewComponent';
import { ShadowTag } from '../defs/tags';

type MonsterEntityOptions = {
    data: Monster;
};

export const MonsterEntity = DefineEntity(Entity3D, MonsterComponent, MonsterViewComponent, ShadowTag, HudComponent);

export type MonsterEntityType = EntityType<typeof MonsterEntity>;

export function createMonsterEntity(opts: MonsterEntityOptions): MonsterEntityType {
    const id = opts.data.monsterId.toString();
    const entity = createEntity(MonsterEntity, {
        view3d: {
            geometry: new BoxGeometry(1, 1, 1),
            material: new PhongMaterial({
                color: 0xff0000,
                receiveShadows: false,
            }),
        },
        monster: opts,
        hud: {
            type: 'monster',
        },
    });

    entity.c.view3d!.state.cullMode = 'none';
    entity.name = id;

    return entity;
}
