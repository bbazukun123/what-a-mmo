import { Plugin } from '@play-co/astro';
import { PlayerClass, User } from '../../module_bindings';
import { app } from '../utils/app';

export class PlayerControllerPlugin extends Plugin {
    private tick = 0;
    private readonly movement = {
        up: false,
        down: false,
        left: false,
        right: false,
    };

    private get identity() {
        return app().spacetimeDB.self;
    }

    private get player() {
        if (!this.identity) return undefined;
        return app().players.getUser(this.identity);
    }

    /**
     * Astro plugin lifecycle: initialize keyboard bindings and subscribe to SpacetimeDB events if needed
     */
    public init() {
        // Keyboard bindings
        app().keyboard.bindKeyDown('ArrowUp', () => {
            this.movement.up = true;
            this.movement.down = false;
        });
        app().keyboard.bindKeyUp('ArrowUp', () => {
            this.movement.up = false;
        });
        app().keyboard.bindKeyDown('ArrowDown', () => {
            this.movement.down = true;
            this.movement.up = false;
        });
        app().keyboard.bindKeyUp('ArrowDown', () => {
            this.movement.down = false;
        });
        app().keyboard.bindKeyDown('ArrowLeft', () => {
            this.movement.left = true;
            this.movement.right = false;
        });
        app().keyboard.bindKeyUp('ArrowLeft', () => {
            this.movement.left = false;
        });
        app().keyboard.bindKeyDown('ArrowRight', () => {
            this.movement.right = true;
            this.movement.left = false;
        });
        app().keyboard.bindKeyUp('ArrowRight', () => {
            this.movement.right = false;
        });
    }

    public isSelf(user: User): boolean {
        return user.identity.toHexString() === this.identity?.toHexString();
    }

    public getMessages() {
        if (!this.identity) return [];
        // return app().messages.getMessages(app().spacetimeDB.self);
    }

    public getPosition() {
        if (!this.player) return;
        return this.player.position;
    }

    public getName() {
        return this.player?.name;
    }

    public setName(name: string) {
        app().spacetimeDB.reducers?.setName(name);
    }

    public getClass() {
        return this.player?.class;
    }

    public setClass(playerClass: PlayerClass) {
        app().spacetimeDB.reducers?.setClass((PlayerClass as any)[playerClass as any]);
    }

    public sendMessage(message: string) {
        app().spacetimeDB.reducers?.sendMessage(message);
    }

    public update(dt: number): void {
        if (!this.player) return;
        this.tick += dt / 60;
        if (this.tick < 1 / 20) return;
        this.tick = 0;

        const { up, down, left, right } = this.movement;
        let dx = 0;
        let dy = 0;

        if (up) dy = -1;
        if (down) dy = 1;
        if (left) dx = -1;
        if (right) dx = 1;

        app().spacetimeDB.reducers?.updatePlayerInput(dx, dy);
    }
}
