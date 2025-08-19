import { MessageBubble } from "./MessageBubble";
import { Message, User } from "../../module_bindings";
import { app } from "../utils/app";
import { Container, Graphics, Text } from "pixi.js";
import { lerp } from "@play-co/commons";

const width = 100;
const height = 150;

export class PlayerEntity extends Container {
  private user: User;
  private view: Graphics;
  private nameLabel: Text;
  private messages: MessageBubble[] = [];
  private tick = 0;

  private get isSelf() {
    return app().player.isSelf(this.user);
  }

  constructor(user: User) {
    super({
      x: user.position.x,
      y: user.position.y,
      alpha: user.online ? 1 : 0.5,
    });

    this.user = user;

    const color = this.getRandomColor(user.identity.toHexString());

    this.view = this.addChild(new Graphics());
    this.view
      // Draw body
      .roundRect(-width * 0.5, -height, width, height, width * 0.5)
      .fill(color)
      // Draw eye 1
      .roundRect(
        -width * 0.4,
        -height * 0.8,
        width * 0.15,
        height * 0.2,
        width * 0.075,
      )
      .fill(0xffffff)
      // Draw eye 2
      .roundRect(
        -width * 0.1,
        -height * 0.8,
        width * 0.15,
        height * 0.2,
        width * 0.075,
      )
      .fill(0xffffff);

    this.nameLabel = this.addChild(
      new Text({
        text: user.name ?? "Creating...",
        y: 20,
        anchor: {
          x: 0.5,
          y: 0,
        },
        style: {
          fontSize: 30,
          fill: color,
          stroke: {
            color: 0x000000,
            width: 4,
          },
          fontWeight: "bold",
        },
      }),
    );
    this.syncMessages();
  }

  public syncName(): void {
    this.nameLabel.text = this.user.name ?? "Creating...";
  }

  public syncDirection(): void {
    this.view.scale.x = this.user.direction.x > 0 ? -1 : 1;
  }

  public syncPosition(): void {
    this.x = lerp(this.x, this.user.position.x, 0.25);
    this.y = lerp(this.y, this.user.position.y, 0.25);
    this.zIndex = this.user.position.y;
  }

  public animateWalk(dt: number): void {
    // console.log("__direction__", this.user.direction);

    if (this.user.direction.x === 0 && this.user.direction.y === 0) {
      this.tick = 0;
      this.view.y = lerp(this.view.y, 0, 0.1);
      return;
    }

    this.tick += dt / 60;
    const y = Math.sin(this.tick * 20) * 10;
    this.view.y = y;
  }

  public syncMessages(): void {
    const messages = app().player.getMessages();
    messages.forEach((message) => this.addMessage(message));
  }

  private addMessage(message: Message): void {
    // Skip if the message is already displayed
    if (this.messages.some((bubble) => bubble.isEqual(message))) return;
    const bubble = this.addChild(new MessageBubble(message, this.isSelf));
    this.messages.push(bubble);
  }

  public update(dt: number): void {
    this.syncName();
    // this.syncMessages();
    this.syncDirection();
    this.syncPosition();
    this.animateWalk(dt);
  }

  private getRandomColor(seed: string) {
    const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (hash * 9301 + 49297) % 233280;
    const color = (random / 233280) * 0xffffff;
    return color;
  }
}
