import { Plugin } from '@play-co/astro';
import { Signal } from 'typed-signals';
import { DbConnection, Monster } from '../../module_bindings';
import { app } from '../utils/app';

export class MonstersPlugin extends Plugin {
    private monsters: Monster[] = [];
    public readonly signals = {
        onMonsterAdded: new Signal<(monster: Monster) => void>(),
        onMonsterUpdated: new Signal<(monster: Monster) => void>(),
        onMonsterRemoved: new Signal<(monster: Monster) => void>(),
    };

    public getMonsters(): Monster[] {
        return this.monsters;
    }

    public getMonster(monsterId: number): Monster | undefined {
        return this.monsters.find((m) => m.monsterId === monsterId);
    }

    /**
     * Astro plugin lifecycle: initialize and subscribe to SpacetimeDB events
     */
    public init() {
        app().spacetimeDB.signals.onConnected.connect((connection: DbConnection) => {
            connection.db.monster.onInsert(this.onMonsterAdd.bind(this));
            connection.db.monster.onUpdate(this.onMonsterUpdate.bind(this));
            connection.db.monster.onDelete(this.onMonsterRemove.bind(this));
        });
    }

    /**
     * Handler for monster insert event
     */
    public onMonsterAdd(_ctx: any, monster: Monster): void {
        if (this.getMonster(monster.monsterId)) return;
        this.monsters.push(monster);
        this.signals.onMonsterAdded.emit(monster);
    }

    /**
     * Handler for monster update event
     */
    public onMonsterUpdate(_ctx: any, monster: Monster): void {
        const index = this.monsters.findIndex((m) => m.monsterId === monster.monsterId);
        if (index === -1 || !this.monsters[index]) return;

        this.monsters[index].position = monster.position;
        this.monsters[index].direction = monster.direction;
        this.monsters[index].speed = monster.speed;
        this.monsters[index].health = monster.health;

        this.signals.onMonsterUpdated.emit(monster);
    }

    /**
     * Handler for monster delete event
     */
    public onMonsterRemove(ctx: any, monster: Monster): void {
        this.monsters = this.monsters.filter((m) => m.monsterId !== monster.monsterId);
        this.signals.onMonsterRemoved.emit(monster);
    }
}
