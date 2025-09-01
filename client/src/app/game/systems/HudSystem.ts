import { QueriesObject, QueryResults } from '@play-co/odie';
import { HudComponent } from '../components/HudComponent';
import { PlayerComponent } from '../components/PlayerComponent';
import { System } from '../defs/types';
import { PlayerEntityType } from '../entities/PlayerEntity';
import { GameScene } from '../GameScene';

export class HudSystem implements System<void, GameScene> {
    public static readonly NAME = 'hudSystem';
    public static readonly Queries: QueriesObject = {
        players: {
            components: [PlayerComponent, HudComponent],
        },
    };

    public queries!: QueryResults;
    public scene!: GameScene;

    public update() {
        this.queries.players!.forEach((entity: PlayerEntityType) => {
            const { player, hud } = entity.c;

            hud.nameLabel.setName(player.user.name ?? 'Creating...');
            hud.healthBar.visible = player.isSelf;
            hud.manaBar.visible = player.isSelf;

            // TODO: Handle resource bars
        });
    }
}
