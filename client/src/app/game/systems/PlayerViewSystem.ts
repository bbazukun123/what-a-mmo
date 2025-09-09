import { QueriesObject, QueryResults, Time } from '@play-co/odie';
import { PlayerViewComponent } from '../components/player/PlayerViewComponent';
import { createRangerView, stepRangerAnimation } from '../defs/classes/ranger';
import { playerSize } from '../defs/player';
import { System } from '../defs/types';
import { worldSizeRatio } from '../defs/world';
import { PlayerEntityType } from '../entities/PlayerEntity';
import { GameScene } from '../GameScene';

export class PlayerViewSystem implements System<void, GameScene> {
    public static readonly NAME = 'playerViewSystem';
    public static readonly Queries: QueriesObject = {
        default: {
            components: [PlayerViewComponent],
            added: true,
            removed: true,
        },
    };

    public queries!: QueryResults;
    public scene!: GameScene;

    public addedToQuery(entity: PlayerEntityType) {
        const { player, playerView } = entity.c;
        const size = playerSize * worldSizeRatio;
        const view = (playerView.view = createRangerView({ id: player.playerId, size }));
        playerView.size.set(size, size, size);
        playerView.basePosition.x = view.x;
        playerView.basePosition.y = view.y;
        playerView.basePosition.z = view.z;
        entity.addChild(view);
    }

    public removedFromQuery(entity: PlayerEntityType) {
        const { playerView } = entity.c;
        entity.removeChild(playerView.view);
    }

    public update(time: Time) {
        this.queries.default!.forEach((entity: PlayerEntityType) => {
            this.updateState(entity);
            this.updateView(entity, time.deltaTime);
        });
    }

    private updateState(entity: PlayerEntityType) {
        const { player, playerView } = entity.c;
        const { direction, speed } = player.user;
        const targetRotation = Math.atan2(direction.x, direction.y);
        playerView.state = speed > 0 ? 'walking' : 'idle';
        entity.rotation.y = targetRotation;
    }

    private updateView(entity: PlayerEntityType, dt: number) {
        stepRangerAnimation(entity, dt);
    }
}
