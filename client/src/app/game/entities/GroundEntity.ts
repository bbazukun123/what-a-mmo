import type { EntityType } from '@play-co/odie';
import { BoxGeometry, createEntity, DefineEntity, Entity3D, PhongMaterial } from '@play-co/odie';
import { GroundEntityTag } from '../defs/tags';
import { XY } from '@play-co/commons';
import { Texture } from 'pixi.js';
import { worldSizeRatio } from '../defs/world';

interface GroundEntityOptions {
    id: string;
    size: XY;
    texture: Texture;
}

export const GroundEntity = DefineEntity(Entity3D, GroundEntityTag);

export type GroundEntityType = EntityType<typeof GroundEntity>;

export function createGroundEntity(opts: GroundEntityOptions): GroundEntityType {
    const { id, size, texture } = opts;
    const height = 10 * worldSizeRatio;
    const entity = createEntity(GroundEntity, {
        view3d: {
            geometry: new BoxGeometry(size.x, height, size.y),
            material: new PhongMaterial({
                color: 0x00ff00,
                receiveShadows: true,
            }),
        },
        transform: {
            position: {
                x: size.x * 0.5,
                y: -height * 0.5,
                z: size.y * 0.5,
            },
        },
    });

    entity.name = id;

    return entity;
}
