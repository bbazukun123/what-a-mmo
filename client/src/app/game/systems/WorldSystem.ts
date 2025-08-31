import { QueriesObject, QueryResults, System, View3DComponent } from '@play-co/odie';
import { GroundEntityTag } from '../defs/tags';
import { GameScene } from '../GameScene';
import { createGroundEntity } from '../entities/GroundEntity';
import { Texture } from 'pixi.js';
import { worldSizeRatio } from '../defs/world';
import { app } from '../../utils/app';
import { createSeaEntity } from '../entities/SeaEntity';

export class WorldSystem implements System<void, GameScene> {
    public static readonly NAME = 'worldSystem';
    public static readonly Queries: QueriesObject = {
        default: {
            components: [GroundEntityTag, View3DComponent],
            added: true,
            removed: true,
        },
    };

    public queries!: QueryResults;
    public scene!: GameScene;

    public start() {
        this.createSea();
        this.createGround();
    }

    private createSea() {
        const entity = createSeaEntity({
            size: { x: 2000, y: 2000 },
        });
        this.scene.addToScene(entity);
    }

    private createGround() {
        const size = app().world.worldSize * worldSizeRatio;
        const entity = createGroundEntity({
            id: 'ground',
            size: { x: size, y: size },
            texture: Texture.WHITE,
        });
        this.scene.addToScene(entity);
    }
}
