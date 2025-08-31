import type { EntityType } from '@play-co/odie';
import { BoxGeometry, createEntity, DefineEntity, Entity3D, PhongMaterial } from '@play-co/odie';
import { SeaEntityTag } from '../defs/tags';
import { XY } from '@play-co/commons';
import { Texture } from 'pixi.js';

interface SeaEntityOptions {
    size: XY;
}

export const SeaEntity = DefineEntity(Entity3D, SeaEntityTag);

export type SeaEntityType = EntityType<typeof SeaEntity>;

export function createSeaEntity(opts: SeaEntityOptions): SeaEntityType {
    const { size } = opts;
    // const texture = Texture.from('texture_water.png');
    const texture = Texture.from('texture_water.png');
    const material = new PhongMaterial({
        color: 0x0000ff,
        // diffuseMap: texture,
        useLights: false,
    });
    const entity = createEntity(SeaEntity, {
        view3d: {
            geometry: new BoxGeometry(size.x, 1, size.y),
            material: material,
        },
    });

    return entity;
}
