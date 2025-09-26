import { Entity3D, type Component } from '@play-co/odie';
import { User } from '../../../../module_bindings';

export type PlayerOptions = {
    data: User;
    self?: boolean;
};

export class PlayerComponent implements Component<PlayerOptions> {
    public static readonly NAME = 'player';
    public view!: Entity3D;
    private options!: PlayerOptions;

    public get data(): User {
        return this.options.data;
    }

    public get playerId() {
        return this.data.identity.toHexString();
    }

    public get playerClass() {
        return this.data.class!.tag;
    }

    public get isSelf() {
        return !!this.options.self;
    }

    public init(data: PlayerOptions) {
        this.options = data;
    }
}
