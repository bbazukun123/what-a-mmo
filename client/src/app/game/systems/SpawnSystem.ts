import { QueriesObject, QueryResults, System, View3DComponent } from '@play-co/odie';
import { app } from '../../utils/app';
import { createPlayerEntity } from '../entities/PlayerEntity';
import { User } from '../../../module_bindings';
import { PlayerEntityTag } from '../defs/tags';
import { GameScene } from '../GameScene';

export class SpawnSystem implements System<void, GameScene> {
    public static readonly NAME = 'spawnSystem';
    public static readonly Queries: QueriesObject = {
        default: {
            components: [PlayerEntityTag, View3DComponent],
        },
    };

    public queries!: QueryResults;
    public scene!: GameScene;

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
        const entity = createPlayerEntity({ user });
        this.scene.addToScene(entity);
    }

    private removePlayerEntity(user: User) {
        const entity = this.queries.default!.entities.find((e) => e.name === user.identity.toHexString());
        if (!entity) return;
        this.scene.removeFromScene(entity);
    }

    private onUserUpdated(user: User) {
        const entity = this.queries.default!.entities.find((e) => e.name === user.identity.toHexString());

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
