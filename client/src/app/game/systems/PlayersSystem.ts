import { lerp, QueriesObject, QueryResults } from '@play-co/odie';
import { app } from '../../utils/app';
import { PlayerComponent } from '../components/player/PlayerComponent';
import { System } from '../defs/types';
import { worldSizeRatio } from '../defs/world';
import { PlayerEntityType } from '../entities/PlayerEntity';
import { GameScene } from '../GameScene';
import { CameraControllerSystem } from './CameraControllerSystem';

export class PlayersSystem implements System<void, GameScene> {
    public static readonly NAME = 'playerSystem';
    public static readonly Queries: QueriesObject = {
        default: {
            components: [PlayerComponent],
            added: true,
            removed: true,
        },
    };

    public queries!: QueryResults;
    public scene!: GameScene;

    public addedToQuery(entity: PlayerEntityType) {
        const { player } = entity.c;
        if (player.isSelf) {
            entity.position.x = player.user.position.x * worldSizeRatio;
            entity.position.z = player.user.position.y * worldSizeRatio;
            this.scene.getSystem(CameraControllerSystem).setTarget(entity, true);
        }
    }

    public removedFromQuery(entity: PlayerEntityType) {
        if (app().spacetimeDB.self?.toHexString() === entity.name) {
            this.scene.getSystem(CameraControllerSystem).removeTarget();
        }
    }

    public update() {
        for (const entity of this.queries.default!.entities as PlayerEntityType[]) {
            const { player } = entity.c;

            if (!player.user.online) {
                entity.c.view3d!.renderable = false;
                continue;
            }

            entity.c.view3d!.renderable = true;
            entity.position.x = lerp(entity.position.x, player.user.position.x * worldSizeRatio, 0.1);
            entity.position.z = lerp(entity.position.z, player.user.position.y * worldSizeRatio, 0.1);
        }
    }
}
