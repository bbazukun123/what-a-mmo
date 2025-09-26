import { QueriesObject, QueryResults, Time } from '@play-co/odie';
import { MonsterComponent } from '../components/monster/MonsterComponent';
import { monsterSize } from '../defs/monster';
import { System } from '../defs/types';
import { worldSizeRatio } from '../defs/world';
import { MonsterEntityType } from '../entities/MonsterEntity';
import { GameScene } from '../GameScene';
import { createMonsterView, stepMonsterAnimation } from '../utils/monsterViewUtils';

export class MonsterViewSystem implements System<void, GameScene, MonsterEntityType> {
    public static readonly NAME = 'monsterViewSystem';
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
        const { monster, monsterView } = entity.c;
        const size = monsterSize * worldSizeRatio;
        const view = (monsterView.view = createMonsterView({ size }));
        monsterView.size.set(size, size, size);
        monsterView.basePosition.x = view.x;
        monsterView.basePosition.y = view.y;
        monsterView.basePosition.z = view.z;
        entity.addChild(view);
    }

    public removedFromQuery(entity: MonsterEntityType) {
        const { monsterView } = entity.c;
        entity.removeChild(monsterView.view);
    }

    public update(time: Time) {
        this.queries.default!.forEach((entity: MonsterEntityType) => {
            this.updateState(entity);
            this.updateView(entity, time.deltaTime);
        });
    }

    private updateState(entity: MonsterEntityType) {
        const { monster, monsterView } = entity.c;
        const { direction, speed } = monster.data;
        const targetRotation = Math.atan2(direction.x, direction.y);
        monsterView.state = speed > 0 ? 'walking' : 'idle';
        entity.rotation.y = targetRotation;
    }

    private updateView(entity: MonsterEntityType, dt: number) {
        stepMonsterAnimation({ entity, dt });
    }
}
