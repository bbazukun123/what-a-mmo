import { Plugin } from "@play-co/astro";
import { User } from "../../module_bindings";
import { app } from "../utils/app";

const SEND_UPDATES_PER_SEC = 20;
const SEND_UPDATES_FREQUENCY = 1 / SEND_UPDATES_PER_SEC;

export class PlayerPlugin extends Plugin {
  private tick = 0;

  private readonly movement = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  private get spacetimeDB() {
    return app().spacetimeDB;
  }

  private get content() {
    return app().content;
  }

  private get player() {
    if (!this.spacetimeDB.self) return undefined;
    return this.content.getUser(this.spacetimeDB.self);
  }

  public async init() {
    // Key up
    app().keyboard.bindKeyDown("ArrowUp", () => {
      this.movement.up = true;
      this.movement.down = false;
    });
    app().keyboard.bindKeyUp("ArrowUp", () => {
      this.movement.up = false;
    });

    // Key down
    app().keyboard.bindKeyDown("ArrowDown", () => {
      this.movement.down = true;
      this.movement.up = false;
    });
    app().keyboard.bindKeyUp("ArrowDown", () => {
      this.movement.down = false;
    });

    // Key left
    app().keyboard.bindKeyDown("ArrowLeft", () => {
      this.movement.left = true;
      this.movement.right = false;
    });
    app().keyboard.bindKeyUp("ArrowLeft", () => {
      this.movement.left = false;
    });

    // Key right
    app().keyboard.bindKeyDown("ArrowRight", () => {
      this.movement.right = true;
      this.movement.left = false;
    });
    app().keyboard.bindKeyUp("ArrowRight", () => {
      this.movement.right = false;
    });
  }

  public isSelf(user: User): boolean {
    return user.identity.toHexString() === this.spacetimeDB.self?.toHexString();
  }

  public getMessages() {
    if (!this.spacetimeDB.self) return [];
    return this.content.getUserMessages(this.spacetimeDB.self);
  }

  public getPosition() {
    if (!this.player) return;
    return this.player.position;
  }

  public getName() {
    return this.player?.name;
  }

  public setName(name: string) {
    this.spacetimeDB.reducers?.setName(name);
  }

  public sendMessage(message: string) {
    this.spacetimeDB.reducers?.sendMessage(message);
  }

  public update(dt: number): void {
    if (!this.player) return;
    this.tick += dt / 60;
    if (this.tick < SEND_UPDATES_FREQUENCY) return;
    this.tick = 0;

    const { up, down, left, right } = this.movement;
    let dx = 0;
    let dy = 0;

    if (up) dy = -1;
    if (down) dy = 1;
    if (left) dx = -1;
    if (right) dx = 1;

    this.spacetimeDB.reducers?.updatePlayerInput({
      x: dx,
      y: dy,
    });
  }
}
