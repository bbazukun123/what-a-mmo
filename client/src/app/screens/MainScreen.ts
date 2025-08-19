import { Message, User } from "../../module_bindings";
import { ChatBar } from "../components/ChatBar";
import { PlayerEntity } from "../components/PlayerEntity";
import { app } from "../utils/app";
import { LayoutScreen } from "./LayoutScreen";
import { LayoutContainer } from "@pixi/layout/components";

export class MainScreen extends LayoutScreen {
  private container!: LayoutContainer;
  private chatBar!: ChatBar;
  private playersMap: Map<string, PlayerEntity> = new Map();

  private get content() {
    return app().content;
  }

  public async preload() {
    //
  }

  public async init(): Promise<void> {
    this.view.layout = {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#1099bb",
    };

    new LayoutContainer({
      parent: this.view,
      layout: {
        position: "absolute",
        width: "100%",
        height: 1080,
        backgroundColor: "#1099bb",
      },
    });

    this.container = new LayoutContainer({
      parent: this.view,
      layout: {
        width: "100%",
        height: 1080,
      },
    });
    this.chatBar = this.view.addChild(new ChatBar());

    // Initialize content
    this.content.getUsers().forEach((user) => this.onUserAdded(user));

    // Listen for new content
    const {
      onUserAdded,
      onUserUpdated,
      onUserRemoved,
      onMessageAdded,
      onMessageRemoved,
    } = this.content.signals;
    onUserAdded.connect((user) => this.onUserAdded(user));
    onUserUpdated.connect((user) => this.onUserUpdated(user));
    onUserRemoved.connect((user) => this.onUserRemoved(user));
    onMessageAdded.connect((message) => this.onMessageUpdated(message));
    onMessageRemoved.connect((message) => this.onMessageUpdated(message));
  }

  private onUserAdded(user: User) {
    // Skip if user is already added
    if (this.playersMap.has(user.identity.toHexString())) return;

    // Skip if user is offline
    if (!user.online) return;

    const userEntity = this.container.addChild(new PlayerEntity(user));

    // Store the user view
    this.playersMap.set(user.identity.toHexString(), userEntity);
  }

  private onUserUpdated(user: User) {
    if (!user.online) {
      this.onUserRemoved(user);
      return;
    }

    // Attempt to re-add the user who may have come back online
    this.onUserAdded(user);

    // Sync user data
    this.playersMap.get(user.identity.toHexString())?.syncName();
  }

  private onUserRemoved(user: User) {
    // Find the user entity
    const userEntity = this.playersMap.get(user.identity.toHexString());
    if (!userEntity) return;

    // Remove the user entity from the container
    this.container.removeChild(userEntity);
    this.playersMap.delete(user.identity.toHexString());
  }

  private onMessageUpdated(message: Message) {
    const userEntity = this.playersMap.get(message.sender.toHexString());
    userEntity?.syncMessages();
  }

  public async show(): Promise<void> {
    //
  }

  public async shown(): Promise<void> {
    this.chatBar.start();
  }

  public async hidden(): Promise<void> {
    this.chatBar.stop();
  }

  public update(dt: number): void {
    this.playersMap.forEach((player) => player.update(dt));
  }
}
