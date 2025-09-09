import { QueriesObject, QueryResults, System, View3DComponent } from '@play-co/odie';
import { User } from '../../../module_bindings';
import { app } from '../../utils/app';
import { GameScene } from '../GameScene';
import { PlayerComponent } from '../components/player/PlayerComponent';
import { createPlayerEntity, PlayerEntityType } from '../entities/PlayerEntity';

export class SpawnSystem implements System<void, GameScene> {
    public static readonly NAME = 'spawnSystem';
    public static readonly Queries: QueriesObject = {
        players: {
            components: [PlayerComponent, View3DComponent],
        },
    };

    public queries!: QueryResults;
    public scene!: GameScene;

    private get players() {
        return this.queries.players!.entities as unknown as PlayerEntityType[];
    }

    public start() {
        this.initPlayers();
    }

    private initPlayers() {
        // Initialize players
        app()
            .players.getUsers()
            .forEach((user) => this.addPlayerEntity(user));

        // Listen for users update
        const { onUserAdded, onUserUpdated, onUserRemoved } = app().players.signals;
        onUserAdded.connect((user) => this.addPlayerEntity(user));
        onUserUpdated.connect((user) => this.onUserUpdated(user));
        onUserRemoved.connect((user) => this.removePlayerEntity(user));
    }

    private initMonsters() {
        //
    }

    private addPlayerEntity(user: User) {
        if (!user.online) return;
        const entity = createPlayerEntity({ user, self: app().playerController.isSelf(user) });
        this.scene.addToScene(entity);
    }

    private removePlayerEntity(user: User) {
        const entity = this.players.find((e) => e.c.player.user.identity.isEqual(user.identity));
        if (!entity) return;
        this.scene.removeFromScene(entity);
    }

    private onUserUpdated(user: User) {
        const entity = this.players.find((e) => e.c.player.user.identity.isEqual(user.identity));

        if (user.online && !entity) {
            this.addPlayerEntity(user);
            return;
        }

        if (!user.online && entity) {
            this.removePlayerEntity(user);
            return;
        }
    }
}
