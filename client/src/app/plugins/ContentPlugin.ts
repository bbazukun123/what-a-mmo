import { Plugin } from "@play-co/astro";
import { EventContext, Message, User } from "../../module_bindings";
import { app } from "../utils/app";
import { Signal } from "typed-signals";
import { Identity } from "@clockworklabs/spacetimedb-sdk";

export class ContentPlugin extends Plugin {
  private users: User[] = [];
  private messages: Message[] = [];
  public readonly signals = {
    onUserAdded: new Signal<(user: User) => void>(),
    onUserUpdated: new Signal<(user: User) => void>(),
    onUserRemoved: new Signal<(user: User) => void>(),
    onMessageAdded: new Signal<(message: Message) => void>(),
    onMessageRemoved: new Signal<(message: Message) => void>(),
  };

  private get spacetimeDB() {
    return app().spacetimeDB;
  }

  public getUsers(): User[] {
    return this.users;
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public getUser(identity: Identity): User | undefined {
    return this.users.find(
      (u) => u.identity.toHexString() === identity.toHexString(),
    );
  }

  public getUserMessages(identity: Identity): Message[] {
    return this.messages.filter(
      (m) => m.sender.toHexString() === identity.toHexString(),
    );
  }

  public init() {
    this.spacetimeDB.signals.onConnected.connect((connection) => {
      // Subscribe to user events
      connection.db.user.onInsert(this.onUserAdd.bind(this));
      connection.db.user.onUpdate(this.onUserUpdate.bind(this));
      connection.db.user.onDelete(this.onUserRemove.bind(this));

      // Subscribe to message events
      connection.db.message.onInsert(this.onMessageAdd.bind(this));
      connection.db.message.onDelete(this.onMessageRemove.bind(this));
    });
  }

  private onUserAdd(_ctx: EventContext, user: User) {
    // Check if the user already exists
    const existingUser = this.users.find(
      (u) => u.identity.toHexString() === user.identity.toHexString(),
    );
    if (existingUser) return;

    // Add the new user
    this.users.push(user);

    // Signal user added
    this.signals.onUserAdded.emit(user);
  }

  private onUserUpdate(_ctx: EventContext, user: User) {
    // Check if the user exists
    const index = this.users.findIndex(
      (u) => u.identity.toHexString() === user.identity.toHexString(),
    );
    if (index === -1) return;

    // Update the existing user
    this.users[index].name = user.name;
    this.users[index].position = user.position;
    this.users[index].direction = user.direction;
    this.users[index].speed = user.speed;

    console.log("_dir", user.direction);

    // Signal user updated
    this.signals.onUserUpdated.emit(user);
  }

  private onUserRemove(_ctx: EventContext, user: User) {
    // Remove the user by filtering out
    this.users = this.users.filter(
      (u) => u.identity.toHexString() !== user.identity.toHexString(),
    );

    // Signal user removed
    this.signals.onUserRemoved.emit(user);
  }

  private onMessageAdd(_ctx: EventContext, message: Message) {
    // Add the new message
    this.messages.push(message);

    // Signal message added
    this.signals.onMessageAdded.emit(message);
  }

  private onMessageRemove(_ctx: EventContext, message: Message) {
    // Remove the message by filtering out
    this.messages = this.messages.filter(
      (m) =>
        m.text !== message.text &&
        m.sent !== message.sent &&
        m.sender !== message.sender,
    );

    // Signal message removed
    this.signals.onMessageRemoved.emit(message);
  }
}
