import { Plugin } from '@play-co/astro';
import { User, DbConnection, EventContext } from '../../module_bindings';
import { Signal } from 'typed-signals';
import { Identity } from '@clockworklabs/spacetimedb-sdk';
import { app } from '../utils/app';

export class PlayersPlugin extends Plugin {
    private users: User[] = [];
    public readonly signals = {
        onUserAdded: new Signal<(user: User) => void>(),
        onUserUpdated: new Signal<(user: User) => void>(),
        onUserRemoved: new Signal<(user: User) => void>(),
    };

    public getUsers(): User[] {
        return this.users;
    }

    public getUser(identity: Identity): User | undefined {
        return this.users.find((u) => u.identity.toHexString() === identity.toHexString());
    }

    public getUserById(id: string): User | undefined {
        return this.users.find((u) => u.identity.toHexString() === id);
    }

    /**
     * Astro plugin lifecycle: initialize and subscribe to SpacetimeDB events
     */
    public async init() {
        app().spacetimeDB.signals.onConnected.connect((connection: DbConnection) => {
            connection.db.user.onInsert(this.onUserAdd.bind(this));
            connection.db.user.onUpdate((ctx, _, newUser) => this.onUserUpdate(ctx, newUser));
            connection.db.user.onDelete(this.onUserRemove.bind(this));
        });
    }

    /**
     * Handler for user insert event
     */
    private onUserAdd(_ctx: EventContext, user: User) {
        if (this.getUser(user.identity)) return;
        this.users.push(user);
        this.signals.onUserAdded.emit(user);
    }

    /**
     * Handler for user update event
     */
    private onUserUpdate(_ctx: EventContext, user: User) {
        const index = this.users.findIndex((u) => u.identity.toHexString() === user.identity.toHexString());
        if (index === -1 || !this.users[index]) return;

        this.users[index].online = user.online;
        this.users[index].name = user.name;
        this.users[index].position = user.position;
        this.users[index].direction = user.direction;
        this.users[index].speed = user.speed;

        this.signals.onUserUpdated.emit(user);
    }

    /**
     * Handler for user delete event
     */
    private onUserRemove(_ctx: EventContext, user: User) {
        this.users = this.users.filter((u) => u.identity.toHexString() !== user.identity.toHexString());
        this.signals.onUserRemoved.emit(user);
    }
}
