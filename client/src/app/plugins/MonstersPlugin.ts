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
    public onMonsterAdd(ctx: any, monster: Monster): void {
        this.monsters.push(monster);
        // TODO: Add visual representation for monsters in the game world
    }

    /**
     * Handler for monster update event
     */
    public onMonsterUpdate(ctx: any, monster: Monster): void {
        const index = this.monsters.findIndex((m) => m.monsterId === monster.monsterId);

        if (index !== -1) {
            this.monsters[index] = monster;
        }
    }

    /**
     * Handler for monster delete event
     */
    public onMonsterRemove(ctx: any, monster: Monster): void {
        this.monsters = this.monsters.filter((m) => m.monsterId !== monster.monsterId);
    }
}
