import type { Component } from '@play-co/odie';
import { User } from '../../../module_bindings';

export interface PlayerOptions {
    user: User;
    self?: boolean;
}

export class PlayerComponent implements Component<PlayerOptions> {
    public static readonly NAME = 'player';
    private data!: PlayerOptions;

    public get user(): User {
        return this.data.user;
    }

    public get playerId() {
        return this.data.user.identity.toHexString();
    }

    public get isSelf() {
        return !!this.data.self;
    }

    public init(data: PlayerOptions) {
        this.data = data;
    }
}
