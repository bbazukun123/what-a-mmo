import { QueriesObject, QueryResults, System } from '@play-co/odie';
import { Monster, User } from '../../../module_bindings';
import { app } from '../../utils/app';
import { GameScene } from '../GameScene';
import { MonsterComponent } from '../components/monster/MonsterComponent';
import { PlayerComponent } from '../components/player/PlayerComponent';
import { createMonsterEntity, MonsterEntityType } from '../entities/MonsterEntity';
import { createPlayerEntity, PlayerEntityType } from '../entities/PlayerEntity';

export class SpawnSystem implements System<void, GameScene> {
    public static readonly NAME = 'spawnSystem';
    public static readonly Queries: QueriesObject = {
        players: {
            components: [PlayerComponent],
        },
        monsters: {
            components: [MonsterComponent],
        },
    };

    public queries!: QueryResults;
    public scene!: GameScene;

    private get players() {
        return this.queries.players!.entities as unknown as PlayerEntityType[];
    }

    private get monsters() {
        return this.queries.monsters!.entities as unknown as MonsterEntityType[];
    }

    public start() {
        this.initPlayers();
        this.initMonsters();
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
        // Initialize monsters
        app()
            .monsters.getMonsters()
            .forEach((monster) => this.addMonsterEntity(monster));

        // Listen for monsters update
        const { onMonsterAdded, onMonsterUpdated, onMonsterRemoved } = app().monsters.signals;
        onMonsterAdded.connect((monster) => this.addMonsterEntity(monster));
        onMonsterUpdated.connect((monster) => this.onMonsterUpdated(monster));
        onMonsterRemoved.connect((monster) => this.removeMonsterEntity(monster));
    }

    private addPlayerEntity(data: User) {
        if (!data.online) return;
        const entity = createPlayerEntity({ data, self: app().playerController.isSelf(data) });
        this.scene.addToScene(entity);
    }

    private removePlayerEntity(data: User) {
        const entity = this.players.find((e) => e.c.player.data.identity.isEqual(data.identity));
        if (!entity) return;
        this.scene.removeFromScene(entity);
    }

    private onUserUpdated(data: User) {
        const entity = this.players.find((e) => e.c.player.data.identity.isEqual(data.identity));

        if (data.online && !entity) {
            this.addPlayerEntity(data);
            return;
        }

        if (!data.online && entity) {
            this.removePlayerEntity(data);
            return;
        }
    }

    private addMonsterEntity(data: Monster) {
        const entity = createMonsterEntity({ data });
        this.scene.addToScene(entity);
    }

    private removeMonsterEntity(data: Monster) {
        const entity = this.monsters.find((e) => e.c.monster.data.monsterId === data.monsterId);
        if (!entity) return;
        this.scene.removeFromScene(entity);
    }

    private onMonsterUpdated(data: Monster) {
        // TODO: To be implemented
    }
}
