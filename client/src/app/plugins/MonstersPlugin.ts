import { Plugin } from "@play-co/astro";
import { Monster, DbConnection, EventContext } from "../../module_bindings";
import { Signal } from "typed-signals";
import { Identity } from "@clockworklabs/spacetimedb-sdk";
import { app } from "../utils/app";

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

  public getMonster(identity: Identity): Monster | undefined {
    return this.monsters.find(
      (m) => m.identity.toHexString() === identity.toHexString(),
    );
  }

  /**
   * Astro plugin lifecycle: initialize and subscribe to SpacetimeDB events
   */
  public init() {
    app().spacetimeDB.signals.onConnected.connect(
      (connection: DbConnection) => {
        connection.db.monster.onInsert(this.onMonsterAdd.bind(this));
        connection.db.monster.onUpdate(this.onMonsterUpdate.bind(this));
        connection.db.monster.onDelete(this.onMonsterRemove.bind(this));
      },
    );
  }

  /**
   * Handler for monster insert event
   */
  private onMonsterAdd(_ctx: EventContext, monster: Monster) {
    if (this.getMonster(monster.identity)) return;
    this.monsters.push(monster);
    this.signals.onMonsterAdded.emit(monster);
  }

  /**
   * Handler for monster update event
   */
  private onMonsterUpdate(_ctx: EventContext, monster: Monster) {
    const index = this.monsters.findIndex(
      (m) => m.identity.toHexString() === monster.identity.toHexString(),
    );
    if (index === -1) return;
    this.monsters[index] = monster;
    this.signals.onMonsterUpdated.emit(monster);
  }

  /**
   * Handler for monster delete event
   */
  private onMonsterRemove(_ctx: EventContext, monster: Monster) {
    this.monsters = this.monsters.filter(
      (m) => m.identity.toHexString() !== monster.identity.toHexString(),
    );
    this.signals.onMonsterRemoved.emit(monster);
  }
}
