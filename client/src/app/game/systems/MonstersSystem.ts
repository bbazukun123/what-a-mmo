import { lerp, QueriesObject, QueryResults } from '@play-co/odie';
import { app } from '../../utils/app';
import { MonsterComponent } from '../components/monster/MonsterComponent';
import { System } from '../defs/types';
import { worldSizeRatio } from '../defs/world';
import { MonsterEntityType } from '../entities/MonsterEntity';
import { GameScene } from '../GameScene';
import { CameraControllerSystem } from './CameraControllerSystem';

export class MonstersSystem implements System<void, GameScene, MonsterEntityType> {
    public static readonly NAME = 'monstersSystem';
    public static readonly Queries: QueriesObject = {
        default: {
            components: [MonsterComponent],
            added: true,
            removed: true,
        },
    };

    public queries!: QueryResults;
    public scene!: GameScene;

    public addedToQuery(entity: MonsterEntityType) {
        const { monster } = entity.c;
        entity.position.x = monster.data.position.x * worldSizeRatio;
        entity.position.z = monster.data.position.y * worldSizeRatio;
    }

    public removedFromQuery(entity: MonsterEntityType) {
        if (app().spacetimeDB.self?.toHexString() === entity.name) {
            this.scene.getSystem(CameraControllerSystem).removeTarget();
        }
    }

    public update() {
        for (const entity of this.queries.default!.entities as MonsterEntityType[]) {
            const { monster } = entity.c;
            entity.position.x = lerp(entity.position.x, monster.data.position.x * worldSizeRatio, 0.1);
            entity.position.z = lerp(entity.position.z, monster.data.position.y * worldSizeRatio, 0.1);
        }
    }
}
